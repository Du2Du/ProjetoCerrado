import { apiConfig, apiRequest, ApiError, wait } from "./api-client.js";

const STORAGE_KEY = "projeto-cerrado:mock-documentos";
const MOCK_PDF = "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFIvUmVzb3VyY2VzPDwvRm9udDw8L0YxIDUgMCBSPj4+Pj4+ZW5kb2JqCjQgMCBvYmo8PC9MZW5ndGggNzQ+PnN0cmVhbQpCVAovRjEgMTggVGYKNzIgNzYwIFRkCihQcm9qZXRvIENlcnJhZG8gLSBEb2N1bWVudG8gZGUgZGVtb25zdHJhY2FvKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNTEgMDAwMDAgbiAKMDAwMDAwMDM3NCAwMDAwMCBuIAp0cmFpbGVyPDwvU2l6ZSA2L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKNDQ0CiUlRU9G";

const covers = [
  "/public/img/slider-01.jpg",
  "/public/img/slider-02.jpg",
  "/public/img/slider-03.jpg",
  "/public/img/slider-04.jpg",
  "/public/img/slider-05.jpg"
];

const seedContent = [
  ["Panorama da Pecuária de Leite no Cerrado", "Indicadores de produção, produtividade e evolução da cadeia leiteira na região Centro-Oeste."],
  ["Diagnóstico da Bovinocultura de Corte", "Análise técnica da cadeia de corte, seus principais desafios e oportunidades de inovação."],
  ["Plano de Intervenção — Eucalipto", "Propostas para fortalecer a cadeia do eucalipto com foco em integração e sustentabilidade."],
  ["Plano de Intervenção — Seringueira", "Ações prioritárias para ampliar a competitividade e a renda na heveicultura regional."],
  ["Boletim de Indicadores Agropecuários 2025", "Síntese anual dos principais indicadores acompanhados pelo Projeto Cerrado."],
  ["Caderno de Tecnologias Sustentáveis", "Práticas e tecnologias aplicáveis às cadeias produtivas monitoradas pelo observatório."],
  ["Relatório do Dia de Campo em Caiapônia", "Resultados, aprendizados e encaminhamentos do encontro dedicado à pecuária de leite."],
  ["Relatório do Dia de Campo em Cáceres", "Contribuições dos participantes para o plano de intervenção da bovinocultura de corte."],
  ["Sistemas Agroflorestais no Distrito Federal", "Experiências de produção agroflorestal e agroecológica no DF e entorno."],
  ["Integração Lavoura-Pecuária-Floresta", "Orientações técnicas e resultados observados em propriedades do Cerrado."],
  ["Mercados para a Borracha Natural", "Cenários de mercado, custos e oportunidades para produtores de seringueira."],
  ["Manejo de Pastagens no Cerrado", "Recomendações para elevar a produtividade com conservação do solo e da água."],
  ["Análise de Sensibilidade — Leite", "Avaliação dos fatores que mais influenciam custos e resultados da produção leiteira."],
  ["Análise de Sensibilidade — Corte", "Cenários econômicos e variáveis críticas para a bovinocultura de corte."],
  ["Análise de Sensibilidade — Eucalipto", "Impacto de custos, produtividade e preços sobre a rentabilidade florestal."],
  ["Análise de Sensibilidade — Seringueira", "Variáveis econômicas determinantes para a produção de borracha natural."],
  ["Guia de Boas Práticas de Campo", "Cuidados essenciais para manejo, coleta de dados e avaliação de resultados."],
  ["Mapeamento de Atores das Cadeias", "Instituições, produtores e parceiros mobilizados nas ações do Projeto Cerrado."],
  ["Relatório Técnico de Pesquisa Aplicada", "Metodologia e resultados consolidados das atividades de pesquisa do projeto."],
  ["Caderno de Capacitações", "Conteúdos de apoio utilizados nas oficinas e ações formativas do Projeto Cerrado."],
  ["Indicadores Municipais de Produção", "Recorte municipal dos dados de produção agropecuária no Centro-Oeste."],
  ["Memória dos Encontros com Stakeholders", "Registro das contribuições coletadas nos encontros com os atores das cadeias."],
  ["Agenda de Inovação para o Cerrado", "Prioridades de inovação e cooperação para cadeias mais resilientes e competitivas."],
  ["Documento interno arquivado", "Registro inativo usado para validar o filtro da área pública."]
];

function buildSeed() {
  return seedContent.map(([title, description], index) => ({
    id: String(index + 1),
    title,
    description,
    coverUrl: covers[index % covers.length],
    pdfUrl: MOCK_PDF,
    pdfName: `${title.toLocaleLowerCase("pt-BR").replace(/[^a-z0-9]+/g, "-")}.pdf`,
    createdAt: new Date(2026, 8 - (index % 8), 24 - (index % 20)).toISOString(),
    active: index !== seedContent.length - 1
  }));
}

let mockDocuments = loadDocuments();

function loadDocuments() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(saved) ? saved : buildSeed();
  } catch {
    return buildSeed();
  }
}

function saveDocuments() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mockDocuments));
  } catch {
    // Arquivos grandes podem exceder a cota. O estado continua válido nesta página.
  }
}

function shouldSimulateError() {
  return new URLSearchParams(window.location.search).get("simularErro") === "documentos";
}

function paginate(items, page, limit) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const start = (safePage - 1) * limit;
  return {
    items: items.slice(start, start + limit).map((item) => ({ ...item })),
    pagination: { page: safePage, limit, totalItems, totalPages }
  };
}

async function mockList({ search = "", page = 1, limit = 10 } = {}, searchDescription = true) {
  await wait(500);
  if (shouldSimulateError()) throw new ApiError("Não foi possível carregar os documentos.", 500);
  const query = search.trim().toLocaleLowerCase("pt-BR");
  const items = mockDocuments
    .filter((item) => item.active)
    .filter((item) => {
      const searchable = searchDescription ? `${item.title} ${item.description}` : item.title;
      return !query || searchable.toLocaleLowerCase("pt-BR").includes(query);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return paginate(items, page, limit);
}

function toFormData(values) {
  const formData = new FormData();
  formData.append("titulo", values.title.trim());
  formData.append("descricao", values.description.trim());
  if (values.coverFile) formData.append("imagem", values.coverFile);
  if (values.pdfFile) formData.append("pdf", values.pdfFile);
  return formData;
}

function contractError(message, details = {}) {
  return new ApiError(message, 502, {
    code: "invalid_documents_contract",
    ...details
  });
}

function normalizeDocument(item) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    throw contractError("A API retornou um documento em formato inválido.");
  }

  const id = item.uuid;
  if (typeof id !== "string" || !id.trim()) {
    throw contractError("A API retornou um documento sem UUID.");
  }
  if (typeof item.titulo !== "string" || typeof item.descricao !== "string") {
    throw contractError("A API retornou um documento sem título ou descrição.", { id });
  }

  const encodedId = encodeURIComponent(id);
  return {
    id,
    title: item.titulo,
    description: item.descricao,
    createdAt: item.created_at || null,
    updatedAt: item.updated_at || null,
    active: item.active,
    coverUrl: `/api/documentos/${encodedId}/imagem`,
    pdfUrl: `/api/documentos/${encodedId}/download`
  };
}

function normalizeListResponse(response) {
  if (!response || typeof response !== "object" || !Array.isArray(response.items)) {
    throw contractError("A API retornou uma listagem de documentos inválida.");
  }
  const pagination = response.pagination;
  if (!pagination || typeof pagination !== "object") {
    throw contractError("A API não retornou os dados de paginação.");
  }

  const page = Number(pagination.page);
  const limit = Number(pagination.limit);
  const totalItems = Number(pagination.total);
  const totalPages = Number(pagination.totalPages);
  if (![page, limit, totalItems, totalPages].every(Number.isFinite)) {
    throw contractError("A API retornou dados de paginação inválidos.");
  }

  return {
    items: response.items.map(normalizeDocument),
    pagination: {
      page: Math.max(1, page),
      limit: Math.max(1, limit),
      totalItems: Math.max(0, totalItems),
      totalPages: Math.max(0, totalPages)
    }
  };
}

function listQuery(params) {
  return new URLSearchParams({
    page: String(params.page || 1),
    limit: String(params.limit || 10),
    search: params.search || ""
  });
}

async function downloadPdf(id) {
  let response;
  try {
    response = await fetch(`/api/documentos/${encodeURIComponent(id)}/download`, {
      credentials: "include",
      headers: { Accept: "application/pdf" }
    });
  } catch (cause) {
    const error = new ApiError("Não foi possível conectar ao servidor.", 0, {
      code: "network_error"
    });
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    throw new ApiError("Não foi possível baixar o documento.", response.status);
  }

  return response.blob();
}

export const documentosService = Object.freeze({
  async listPublic(params = {}) {
    if (apiConfig.useDocumentMocks) return mockList(params, true);
    const response = await apiRequest(`/api/documentos?${listQuery(params)}`);
    return normalizeListResponse(response);
  },

  async listAdmin(params = {}) {
    if (apiConfig.useDocumentMocks) return mockList(params, false);
    const response = await apiRequest(`/api/admin/documentos?${listQuery(params)}`);
    return normalizeListResponse(response);
  },

  download(id) {
    return downloadPdf(id);
  },

  async create(values) {
    if (!apiConfig.useDocumentMocks) {
      return apiRequest("/api/admin/documentos", { method: "POST", body: toFormData(values) });
    }
    await wait(700);
    const document = {
      id: `${Date.now()}`,
      title: values.title.trim(),
      description: values.description.trim(),
      coverUrl: values.coverUrl || covers[0],
      pdfUrl: MOCK_PDF,
      pdfName: values.pdfFile?.name || "documento.pdf",
      createdAt: new Date().toISOString(),
      active: true
    };
    mockDocuments.push(document);
    saveDocuments();
    return { ...document };
  },

  async update(id, values) {
    if (!apiConfig.useDocumentMocks) {
      return apiRequest(`/api/admin/documentos/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: toFormData(values)
      });
    }
    await wait(700);
    const index = mockDocuments.findIndex((item) => item.id === String(id) && item.active);
    if (index < 0) throw new ApiError("Documento não encontrado.", 404);
    mockDocuments[index] = {
      ...mockDocuments[index],
      title: values.title.trim(),
      description: values.description.trim(),
      coverUrl: values.coverUrl || mockDocuments[index].coverUrl,
      pdfName: values.pdfFile?.name || mockDocuments[index].pdfName,
      pdfUrl: values.pdfFile ? MOCK_PDF : mockDocuments[index].pdfUrl
    };
    saveDocuments();
    return { ...mockDocuments[index] };
  },

  async remove(id) {
    if (!apiConfig.useDocumentMocks) {
      return apiRequest(`/api/admin/documentos/${encodeURIComponent(id)}`, { method: "DELETE" });
    }
    await wait(600);
    const document = mockDocuments.find((item) => item.id === String(id) && item.active);
    if (!document) throw new ApiError("Documento não encontrado.", 404);
    document.active = false;
    saveDocuments();
    return { success: true };
  }
});
