import test from "node:test";
import assert from "node:assert/strict";
import { ApiError, clearCsrfToken, setCsrfToken } from "../services/api-client.js";
import { categoriasService } from "../services/categorias-service.js";
import { categoryFilterState, sortCategories, validateCategory } from "../components/categorias-ui.js";
import { createListRequest } from "../components/documentos-ui.js";

test("valida nome obrigatório, limites e duplicidade entre categorias ativas", () => {
  const categories = [{ id: "a", name: "Relatórios" }];
  assert.ok(validateCategory({ name: "  ", description: "" }, categories).name);
  assert.ok(validateCategory({ name: " relatÓrios ", description: "" }, categories).name);
  assert.deepEqual(validateCategory({ name: "relatórios", description: "" }, categories, "a"), {});
  assert.deepEqual(validateCategory({ name: "n".repeat(100), description: "d".repeat(500) }, categories), {});
  assert.deepEqual(Object.keys(validateCategory({
    name: "n".repeat(101),
    description: "d".repeat(501)
  }, categories)), ["name", "description"]);
});

test("recolher as categorias preserva seleções fora das dez primeiras", () => {
  const categories = sortCategories(Array.from({ length: 12 }, (_, i) => ({
    id: String(i),
    name: `Categoria ${String(i).padStart(2, "0")}`
  })).reverse());
  const selected = new Set(["1", "10", "11"]);
  assert.equal(categoryFilterState(categories, selected, false).visible.length, 10);
  assert.equal(categoryFilterState(categories, selected, false).hiddenCount, 2);
  assert.equal(categoryFilterState(categories, selected, true).hiddenCount, 0);
  assert.deepEqual([...selected], ["1", "10", "11"]);
  selected.clear();
  assert.equal(categoryFilterState(categories, selected, false).hiddenCount, 0);
});

test("somente a última consulta pode atualizar os resultados", () => {
  const requests = createListRequest();
  const first = requests.start();
  const second = requests.start();
  assert.equal(first(), false);
  assert.equal(second(), true);
  requests.invalidate();
  assert.equal(second(), false);
});

const category = {
  uuid: "4ac6b26f-41ec-4e25-a4bd-3d4bad88a78e", nome: "Solos",
  descricao: "Pesquisa de campo", totalDocumentos: 2
};

test("rotas de categorias usam os contratos de consulta e mutação, cookies e CSRF", async (t) => {
  const requests = [];
  const previousFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = previousFetch;
    clearCsrfToken();
  });
  globalThis.fetch = async (path, options) => {
    requests.push({ path, ...options });
    if (path.startsWith("/api/categorias?")) return Response.json({ success: true, items: [category] });
    if (options.method === "GET") {
      return Response.json({
        items: [{ ...category, created_at: "2026-10-01", updated_at: "2026-10-02" }],
        pagination: { page: 2, limit: 10, total: 12, totalPages: 2 }
      });
    }
    if (options.method === "DELETE") return Response.json({ success: true, vinculosRemovidos: 2 });
    return Response.json({ success: true, categoria: category }, { status: options.method === "POST" ? 201 : 200 });
  };

  clearCsrfToken();
  await assert.rejects(categoriasService.remove(category.uuid), { details: { code: "csrf_token_missing" } });
  assert.equal(requests.length, 0);
  setCsrfToken("categorias-csrf");

  const item = { id: category.uuid, name: "Solos", description: "Pesquisa de campo", documentCount: 2 };
  assert.deepEqual(await categoriasService.listPublic("todas"), [item]);
  assert.deepEqual(await categoriasService.listPublic("filtro"), [item]);
  assert.deepEqual(await categoriasService.listAdmin({ page: 2, search: "Pesquisa de campo" }), {
    items: [item], pagination: { page: 2, totalPages: 2, totalItems: 12 }
  });
  const values = { name: " Solos ", description: " Pesquisa de campo " };
  await categoriasService.create(values);
  await categoriasService.update(category.uuid, values);
  assert.equal((await categoriasService.remove(category.uuid)).vinculosRemovidos, 2);

  assert.deepEqual(requests.map(({ path, method }) => [path, method]), [
    ["/api/categorias?uso=todas", "GET"],
    ["/api/categorias?uso=filtro", "GET"],
    ["/api/admin/categorias?page=2&limit=10&search=Pesquisa+de+campo", "GET"],
    ["/api/admin/categorias", "POST"],
    [`/api/admin/categorias/${category.uuid}`, "PUT"],
    [`/api/admin/categorias/${category.uuid}`, "DELETE"]
  ]);
  assert.ok(requests.every(({ credentials }) => credentials === "include"));
  assert.ok(requests.slice(0, 3).every(({ headers }) => !headers["X-CSRF-Token"]));
  assert.ok(requests.slice(3).every(({ headers }) => headers["X-CSRF-Token"] === "categorias-csrf"));
  for (const request of requests.slice(3, 5)) {
    assert.equal(request.headers["Content-Type"], "application/json");
    assert.deepEqual(JSON.parse(request.body), { nome: "Solos", descricao: "Pesquisa de campo" });
  }
});

test("validação, conflitos, sessão expirada e erros de CSRF chegam ao chamador", async (t) => {
  const previousFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = previousFetch;
    clearCsrfToken();
  });
  setCsrfToken("categorias-csrf");
  for (const status of [400, 409, 401, 403]) {
    globalThis.fetch = async () => Response.json({ message: "Erro de categorias" }, { status });
    await assert.rejects(categoriasService.update(category.uuid, { name: "Solos", description: "" }), (error) =>
      error instanceof ApiError && error.status === status && error.message === "Erro de categorias");
  }
});
