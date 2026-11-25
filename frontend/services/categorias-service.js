import { apiRequest, ApiError } from "./api-client.js";

const administrativePath = "/api/admin/categorias";
const categoryPath = (id) => `${administrativePath}/${encodeURIComponent(id)}`;

function normalizeCategory({ uuid, nome, descricao, totalDocumentos }) {
  return { id: uuid, name: nome, description: descricao || "", documentCount: totalDocumentos };
}

function normalizeItems(response) {
  if (!Array.isArray(response?.items)) {
    throw new ApiError("A API retornou uma listagem de categorias inválida.", 502);
  }
  return response.items.map(normalizeCategory);
}

function categoryBody({ name, description }) {
  return { nome: name.trim(), descricao: description.trim() };
}

export const categoriasService = Object.freeze({
  async listPublic(usage = "todas") {
    const query = new URLSearchParams({ uso: usage });
    const response = await apiRequest(`/api/categorias?${query}`, { notifyOnUnauthorized: false });
    return normalizeItems(response);
  },

  async listAdmin({ page = 1, search = "" } = {}) {
    const query = new URLSearchParams({ page, limit: 10, search });
    const response = await apiRequest(`${administrativePath}?${query}`);
    const items = normalizeItems(response);
    const { page: currentPage, total, totalPages } = response.pagination ?? {};
    if (![currentPage, total, totalPages].every(Number.isInteger)) {
      throw new ApiError("A API retornou uma paginação de categorias inválida.", 502);
    }
    return { items, pagination: { page: currentPage, totalPages, totalItems: total } };
  },

  create(values) {
    return apiRequest(administrativePath, { method: "POST", body: categoryBody(values) });
  },

  update(id, values) {
    return apiRequest(categoryPath(id), { method: "PUT", body: categoryBody(values) });
  },

  remove(id) {
    return apiRequest(categoryPath(id), { method: "DELETE" });
  }
});
