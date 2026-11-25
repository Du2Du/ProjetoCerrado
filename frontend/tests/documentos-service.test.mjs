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
    categories: [],
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

test("serializa exatamente os UUIDs selecionados e permite limpar as associações", async () => {
  apiClient.setCsrfToken("csrf-documentos");
  const requests = [];
  globalThis.fetch = async (_url, { body }) => {
    requests.push(body);
    return jsonResponse({ success: true });
  };
  const categoryIds = [apiItem.uuid, "9e91c09b-e4ae-442e-9058-58d183f25936"];
  const values = { title: "Documento", description: "Descrição", categoryIds };
  await documentosService.create(values);
  await documentosService.update(apiItem.uuid, { ...values, categoryIds: [] });
  assert.deepEqual(JSON.parse(requests[0].get("categorias")), categoryIds);
  assert.equal(requests[1].get("categorias"), "[]");
});

test("combina UUIDs separados por vírgula com busca e paginação nas duas listagens", async () => {
  const first = "9e91c09b-e4ae-442e-9058-58d183f25936";
  const second = "170b64fc-9d5e-423b-a8db-4ee2270de55e";
  const documents = [
    { ...apiItem, categorias: [{ uuid: first, nome: "Solos" }] },
    { ...apiItem, titulo: "Outro relatório", categorias: [{ uuid: second, nome: "Água" }] },
    { ...apiItem, titulo: "Cerrado", categorias: [] }
  ];
  const paths = [];
  globalThis.fetch = async (url) => {
    const { pathname, searchParams } = new URL(url, "http://localhost");
    paths.push(pathname);
    assert.equal(searchParams.get("categorias"), `${first},${second}`);
    assert.equal(searchParams.get("search"), "relatório");
    assert.equal(searchParams.get("page"), "2");
    assert.equal(searchParams.get("limit"), "1");
    const selected = searchParams.get("categorias").split(",");
    const matches = documents.filter((item) => item.titulo.toLowerCase().includes(searchParams.get("search"))
      && item.categorias.some(({ uuid }) => selected.includes(uuid)));
    return jsonResponse({ items: matches.slice(1, 2), pagination: { page: 2, limit: 1, total: matches.length, totalPages: 2 } });
  };
  for (const list of [documentosService.listPublic, documentosService.listAdmin]) {
    const result = await list({ page: 2, limit: 1, search: "relatório", categoryIds: [first, second] });
    assert.equal(result.pagination.totalItems, 2);
    assert.deepEqual(result.items[0].categories, [{ id: second, name: "Água" }]);
  }
  assert.deepEqual(paths, ["/api/documentos", "/api/admin/documentos"]);
});

test("omitir filtros vazios e preservar a mensagem de categoria inválida", async () => {
  apiClient.setCsrfToken("csrf-documentos");
  globalThis.fetch = async (url, { method, body }) => {
    if (method === "PUT") {
      assert.equal(body.get("categorias"), JSON.stringify([apiItem.uuid]));
      return jsonResponse({ message: "Categoria excluída ou inválida." }, 400);
    }
    assert.equal(new URL(url, "http://localhost").searchParams.has("categorias"), false);
    return jsonResponse({ items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });
  };
  await documentosService.listAdmin({ categoryIds: [] });
  await assert.rejects(documentosService.update(apiItem.uuid, {
    title: "Documento", description: "Descrição", categoryIds: [apiItem.uuid]
  }), { status: 400, message: "Categoria excluída ou inválida." });
});
