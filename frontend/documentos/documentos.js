import { categoriasService } from "../services/categorias-service.js";
import { categoryTags, createCategoryFilter } from "../components/categorias-ui.js";
import { documentosService } from "../services/documentos-service.js";
import { createListRequest, debounce, renderPagination, scrollToResults, setButtonLoading } from "../components/documentos-ui.js";

/**
 * Página pública da biblioteca.
 * O estado guarda busca/página; `loadDocuments` consulta o serviço e escolhe um
 * dos quatro estados visuais: carregando, vazio, erro ou lista pronta.
 */

const FALLBACK_COVER_URL = "/public/img/logo.avif";

const elements = {
  search: document.querySelector("#document-search"),
  summary: document.querySelector("#documents-summary"),
  grid: document.querySelector("#documents-grid"),
  loading: document.querySelector("#documents-loading"),
  empty: document.querySelector("#documents-empty"),
  emptyTitle: document.querySelector("#documents-empty-title"),
  emptyMessage: document.querySelector("#documents-empty-message"),
  error: document.querySelector("#documents-error"),
  errorMessage: document.querySelector("#documents-error-message"),
  retry: document.querySelector("#documents-retry"),
  pagination: document.querySelector("#documents-pagination")
};

const listRequest = createListRequest();
const state = { search: "", page: 1, limit: 12, categoryIds: [] };
const filterRequest = createListRequest();
const filter = createCategoryFilter(document.querySelector("#public-category-filter"), {
  onChange(ids) {
    state.categoryIds = ids;
    state.page = 1;
    loadDocuments();
  }
});

async function loadCategoryFilter() {
  const isCurrent = filterRequest.start();
  const status = document.querySelector("#public-category-status");
  status.textContent = "";
  try {
    const categories = await categoriasService.listPublic("filtro");
    if (isCurrent()) filter.setCategories(categories);
  } catch {
    if (isCurrent()) status.textContent = "Não foi possível carregar os filtros de categorias.";
  }
}

// Substitui uma capa indisponível pela imagem padrão, evitando repetição do erro.
function applyCoverFallback(image) {
  image.addEventListener("error", () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = "true";
    image.src = FALLBACK_COVER_URL;
  });
}

// Traduz status técnicos da listagem para mensagens adequadas ao público.
function publicErrorMessage(error) {
  if (error.status === 0) return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
  if (error.status === 403) return "O acesso à biblioteca foi negado pelo servidor.";
  if (error.status >= 500) return "A biblioteca está temporariamente indisponível. Tente novamente em alguns instantes.";
  return "Não foi possível carregar os documentos. Tente novamente.";
}

// Traduz falhas específicas do download para a mensagem exibida no cartão.
function downloadErrorMessage(error) {
  if (error.status === 0) return "Falha de conexão. Tente novamente.";
  if (error.status === 404) return "O arquivo não está mais disponível.";
  if (error.status >= 500) return "O servidor não conseguiu disponibilizar o PDF.";
  return "Não foi possível baixar o PDF.";
}

// Gera um nome de arquivo seguro e legível a partir do título do documento.
function downloadFileName(documentData) {
  const slug = documentData.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "documento"}.pdf`;
}

// Obtém o PDF, dispara o download local e controla loading e retorno de erro.
async function downloadDocument(documentData, button, label, feedback) {
  // Cria uma URL temporária para o Blob e dispara o download sem navegar para
  // fora da página. A URL é revogada logo depois para liberar memória.
  feedback.textContent = "";
  setButtonLoading(button, true, "Baixando…", label);
  try {
    const blob = await documentosService.download(documentData.id);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = downloadFileName(documentData);
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  } catch (error) {
    feedback.textContent = downloadErrorMessage(error);
  } finally {
    setButtonLoading(button, false, undefined, label);
  }
}

// Exibe exatamente um estado da página: loading, vazio, erro ou resultados.
function setView(view) {
  // Garante que apenas um estado da listagem fique visível por vez.
  elements.loading.hidden = view !== "loading";
  elements.empty.hidden = view !== "empty";
  elements.error.hidden = view !== "error";
  elements.grid.hidden = view !== "ready";
  elements.grid.setAttribute("aria-busy", String(view === "loading"));
  if (view !== "ready") elements.pagination.replaceChildren();
}

// Constrói um cartão acessível usando somente APIs seguras do DOM.
function createDocumentCard(documentData) {
  // Usa APIs do DOM e `textContent` para que dados vindos da API não sejam
  // interpretados como HTML.
  const article = document.createElement("article");
  article.className = "document-card";

  const cover = document.createElement("div");
  cover.className = "document-card__cover";
  const image = document.createElement("img");
  image.src = documentData.coverUrl;
  image.alt = `Capa do documento ${documentData.title}`;
  image.loading = "lazy";
  applyCoverFallback(image);
  cover.append(image);

  const body = document.createElement("div");
  body.className = "document-card__body";
  const tag = document.createElement("span");
  tag.className = "document-card__tag";
  tag.textContent = "Documento PDF";
  const title = document.createElement("h3");
  title.textContent = documentData.title;
  const description = document.createElement("p");
  description.textContent = documentData.description;
  const download = document.createElement("button");
  download.type = "button";
  download.className = "app-button app-button--primary document-card__action";
  download.setAttribute("aria-label", `Baixar PDF: ${documentData.title}`);
  const downloadLabel = document.createElement("span");
  downloadLabel.textContent = "Baixar PDF";
  const downloadIcon = document.createElement("span");
  downloadIcon.className = "material-symbol";
  downloadIcon.setAttribute("aria-hidden", "true");
  downloadIcon.textContent = "download";
  download.append(downloadLabel, downloadIcon);
  const downloadFeedback = document.createElement("span");
  downloadFeedback.className = "field-error";
  downloadFeedback.setAttribute("role", "alert");
  download.addEventListener("click", () => downloadDocument(documentData, download, downloadLabel, downloadFeedback));

  body.append(tag, title, description);
  if (documentData.categories?.length) body.append(categoryTags(documentData.categories));
  body.append(download, downloadFeedback);
  article.append(cover, body);
  return article;
}

// Executa busca, renderização, paginação e tratamento de estados da listagem.
async function loadDocuments({ focusResults = false } = {}) {
  // Esta função é o ciclo completo da tela: mostra loading, busca, renderiza,
  // configura paginação e converte exceções em uma mensagem pública segura.
  setView("loading");
  elements.summary.textContent = "";
  const isCurrent = listRequest.start();
  try {
    const response = await documentosService.listPublic(state);
    if (!isCurrent()) return;
    state.page = response.pagination.page;
    elements.grid.replaceChildren(...response.items.map(createDocumentCard));

    if (!response.items.length) {
      const filtered = state.search || state.categoryIds.length;
      elements.emptyTitle.textContent = filtered ? "Nenhum resultado encontrado" : "Nenhum documento disponível";
      elements.emptyMessage.textContent = state.search
        ? `Não encontramos documentos para “${state.search}”. Tente outros termos.`
        : filtered ? "Nenhum documento corresponde às categorias selecionadas."
          : "Novos materiais serão publicados em breve.";
      setView("empty");
      elements.summary.textContent = "0 documentos encontrados";
      return;
    }

    setView("ready");
    const count = response.pagination.totalItems;
    elements.summary.textContent = `${count} ${count === 1 ? "documento encontrado" : "documentos encontrados"}`;
    renderPagination(elements.pagination, response.pagination, (page) => {
      state.page = page;
      loadDocuments({ focusResults: true });
    });
    if (focusResults) {
      scrollToResults(document.querySelector("#main-content"));
    }
  } catch (error) {
    if (!isCurrent()) return;
    elements.errorMessage.textContent = publicErrorMessage(error);
    setView("error");
  }
}

const searchDocuments = debounce(() => loadDocuments(), 350);
elements.search.addEventListener("input", () => {
  listRequest.invalidate();
  state.search = elements.search.value.trim();
  state.page = 1;
  searchDocuments();
});
elements.retry.addEventListener("click", () => {
  loadDocuments();
  loadCategoryFilter();
});
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  elements.search.value = "";
  state.search = "";
  state.page = 1;
  if (state.categoryIds.length) filter.reset();
  else {
    filter.reset();
    loadDocuments();
  }
  loadCategoryFilter();
});

loadDocuments();
loadCategoryFilter();
