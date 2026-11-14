import test from "node:test";
import assert from "node:assert/strict";

const apiClient = await import("../services/api-client.js");
const { documentosService } = await import("../services/documentos-service.js");

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const apiItem = {
  uuid: "4ac6b26f-41ec-4e25-a4bd-3d4bad88a78e",
  titulo: "Relatório do Cerrado",
  descricao: "Descrição técnica",
  imagem_path: "/dados/capa.webp",
  pdf_path: "/dados/relatorio.pdf",
  active: true,
  created_at: "2026-10-29T12:00:00.000Z",
  updated_at: "2026-10-29T13:00:00.000Z"
};

test("normaliza a listagem pública e constrói URLs sem expor paths do servidor", async () => {
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return jsonResponse({
      items: [apiItem],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
    });
  };

  const response = await documentosService.listPublic({ page: 1, limit: 10, search: "cerrado" });

  assert.equal(captured.url, "/api/documentos?page=1&limit=10&search=cerrado");
  assert.equal(captured.options.credentials, "include");
  assert.deepEqual(response.pagination, {
    page: 1,
    limit: 10,
    totalItems: 1,
    totalPages: 1
  });
  assert.deepEqual(response.items[0], {
    id: apiItem.uuid,
    title: apiItem.titulo,
    description: apiItem.descricao,
    createdAt: apiItem.created_at,
    updatedAt: apiItem.updated_at,
    active: true,
    coverUrl: `/api/documentos/${apiItem.uuid}/imagem?v=${encodeURIComponent(apiItem.updated_at)}`,
    pdfUrl: `/api/documentos/${apiItem.uuid}/download`
  });
});

test("versiona a imagem com a data de criação quando updated_at não está disponível", async () => {
  globalThis.fetch = async () => jsonResponse({
    items: [{ ...apiItem, updated_at: null }],
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
  });

  const response = await documentosService.listPublic();

  assert.equal(
    response.items[0].coverUrl,
    `/api/documentos/${apiItem.uuid}/imagem?v=${encodeURIComponent(apiItem.created_at)}`
  );
});

test("usa o endpoint administrativo para a listagem autenticada", async () => {
  let requestedUrl;
  globalThis.fetch = async (url) => {
    requestedUrl = url;
    return jsonResponse({
      items: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
    });
  };

  const response = await documentosService.listAdmin({ search: "", page: 1, limit: 10 });
  assert.equal(requestedUrl, "/api/admin/documentos?page=1&limit=10&search=");
  assert.equal(response.pagination.totalItems, 0);
});

test("cadastro envia multipart com nomes de campos do workflow e CSRF", async () => {
  apiClient.setCsrfToken("csrf-documentos");
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return jsonResponse({ success: true }, 201);
  };
  const image = new File(["imagem"], "capa.webp", { type: "image/webp" });
  const pdf = new File(["pdf"], "documento.pdf", { type: "application/pdf" });

  await documentosService.create({
    title: " Documento ",
    description: " Descrição ",
    coverFile: image,
    pdfFile: pdf
  });

  assert.equal(captured.url, "/api/admin/documentos");
  assert.equal(captured.options.credentials, "include");
  assert.equal(captured.options.headers["X-CSRF-Token"], "csrf-documentos");
  assert.equal(captured.options.headers["Content-Type"], undefined);
  assert.deepEqual(Array.from(captured.options.body.keys()), ["titulo", "descricao", "imagem", "pdf"]);
  assert.equal(captured.options.body.get("titulo"), "Documento");
  assert.equal(captured.options.body.get("descricao"), "Descrição");
});

test("edição sem novos arquivos preserva os arquivos atuais", async () => {
  apiClient.setCsrfToken("csrf-documentos");
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return jsonResponse({ success: true });
  };

  await documentosService.update(apiItem.uuid, {
    title: "Título alterado",
    description: "Descrição alterada"
  });

  assert.equal(captured.url, `/api/admin/documentos/${apiItem.uuid}`);
  assert.equal(captured.options.method, "PUT");
  assert.deepEqual(Array.from(captured.options.body.keys()), ["titulo", "descricao"]);
});

test("edição permite substituir imagem e PDF", async () => {
  apiClient.setCsrfToken("csrf-documentos");
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return jsonResponse({ success: true });
  };
  const image = new File(["nova imagem"], "nova-capa.png", { type: "image/png" });
  const pdf = new File(["novo pdf"], "novo-documento.pdf", { type: "application/pdf" });

  await documentosService.update(apiItem.uuid, {
    title: "Título alterado",
    description: "Descrição alterada",
    coverFile: image,
    pdfFile: pdf
  });

  assert.deepEqual(Array.from(captured.options.body.keys()), ["titulo", "descricao", "imagem", "pdf"]);
  assert.equal(captured.options.body.get("imagem").name, "nova-capa.png");
  assert.equal(captured.options.body.get("pdf").name, "novo-documento.pdf");
});

test("exclusão envia cookie e CSRF para o UUID correto", async () => {
  apiClient.setCsrfToken("csrf-documentos");
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return jsonResponse({ success: true });
  };

  await documentosService.remove(apiItem.uuid);
  assert.equal(captured.url, `/api/admin/documentos/${apiItem.uuid}`);
  assert.equal(captured.options.method, "DELETE");
  assert.equal(captured.options.credentials, "include");
  assert.equal(captured.options.headers["X-CSRF-Token"], "csrf-documentos");
});

test("download trata o PDF como binário e inclui cookies", async () => {
  let captured;
  const expected = new Blob(["conteúdo pdf"], { type: "application/pdf" });
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return new Response(expected, {
      status: 200,
      headers: { "Content-Type": "application/pdf" }
    });
  };

  const received = await documentosService.download(apiItem.uuid);
  assert.equal(captured.url, `/api/documentos/${apiItem.uuid}/download`);
  assert.equal(captured.options.credentials, "include");
  assert.equal(captured.options.headers.Accept, "application/pdf");
  assert.equal(received.type, "application/pdf");
  assert.equal(await received.text(), "conteúdo pdf");
});

test("download preserva o status HTTP de arquivo indisponível", async () => {
  globalThis.fetch = async () => new Response("não encontrado", { status: 404 });

  await assert.rejects(
    documentosService.download(apiItem.uuid),
    (error) => error.status === 404
  );
});

test("preserva erros HTTP 400, 403 e 500 recebidos dos workflows", async () => {
  for (const status of [400, 403, 500]) {
    globalThis.fetch = async () => jsonResponse({ message: `Erro ${status}` }, status);
    await assert.rejects(
      documentosService.listPublic(),
      (error) => error.status === status && error.message === `Erro ${status}`
    );
  }
});

test("rejeita respostas incompatíveis sem inventar propriedades", async () => {
  globalThis.fetch = async () => jsonResponse({ items: [{}], pagination: {} });

  await assert.rejects(
    documentosService.listPublic(),
    (error) => error.status === 502 && error.details?.code === "invalid_documents_contract"
  );
});
