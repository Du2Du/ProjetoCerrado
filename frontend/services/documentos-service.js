import { apiRequest, ApiError } from "./api-client.js";

/**
 * Camada de dados da biblioteca de documentos.
 * Traduz os nomes do backend para o modelo usado pela interface e valida
 * respostas antes que cheguem às telas.
 */

// Converte o modelo da interface para os nomes multipart esperados pela API.
function toFormData(values) {
  // O backend recebe multipart/form-data porque imagem e PDF podem ser enviados
  // junto dos campos textuais. O navegador define o boundary automaticamente.
  const formData = new FormData();
  formData.append("titulo", values.title.trim());
  formData.append("descricao", values.description.trim());
  if (values.coverFile) formData.append("imagem", values.coverFile);
  if (values.pdfFile) formData.append("pdf", values.pdfFile);
  return formData;
}

// Cria um erro específico para respostas incompatíveis com o contrato esperado.
function contractError(message, details = {}) {
  return new ApiError(message, 502, {
    code: "invalid_documents_contract",
    ...details
  });
}

// Valida e traduz um documento do formato do backend para o formato da tela.
function normalizeDocument(item) {
  // Valida o contrato externo e o converte para nomes usados no frontend. URLs
  // dos arquivos são derivadas do UUID, não confiadas à resposta da listagem.
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
  const imageVersion = item.updated_at || item.created_at;
  const coverUrl = `/api/documentos/${encodedId}/imagem${
    imageVersion ? `?v=${encodeURIComponent(imageVersion)}` : ""
  }`;
  return {
    id,
    title: item.titulo,
    description: item.descricao,
    createdAt: item.created_at || null,
    updatedAt: item.updated_at || null,
    active: item.active,
    coverUrl,
    pdfUrl: `/api/documentos/${encodedId}/download`
  };
}

// Valida itens e paginação antes de liberar a resposta para a interface.
function normalizeListResponse(response) {
  // Falha cedo quando o backend muda de formato, produzindo um erro distinguível
  // de uma lista realmente vazia.
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

// Serializa busca e paginação para as rotas pública e administrativa.
function listQuery(params) {
  return new URLSearchParams({
    page: String(params.page || 1),
    limit: String(params.limit || 10),
    search: params.search || ""
  });
}

// Solicita o PDF como Blob preservando cookies e status de erro.
async function downloadPdf(id) {
  // Download retorna Blob, portanto não usa `apiRequest`, voltado a JSON/texto.
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
  // Lista documentos públicos e permite busca também pela descrição.
  async listPublic(params = {}) {
    const response = await apiRequest(`/api/documentos?${listQuery(params)}`);
    return normalizeListResponse(response);
  },

  // Lista documentos para gestão usando a rota administrativa autenticada.
  async listAdmin(params = {}) {
    const response = await apiRequest(`/api/admin/documentos?${listQuery(params)}`);
    return normalizeListResponse(response);
  },

  // Delega o download binário para a implementação comum de PDF.
  download(id) {
    return downloadPdf(id);
  },

  // Cadastra um documento pela API administrativa.
  async create(values) {
    return apiRequest("/api/admin/documentos", { method: "POST", body: toFormData(values) });
  },

  // Altera metadados e substitui somente os arquivos enviados.
  async update(id, values) {
    return apiRequest(`/api/admin/documentos/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: toFormData(values)
    });
  },

  // Exclui um documento pela API administrativa.
  async remove(id) {
    return apiRequest(`/api/admin/documentos/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
});
