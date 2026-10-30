import { documentosService } from "../services/documentos-service.js";
import { debounce, renderPagination, setButtonLoading } from "../components/documentos-ui.js";

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

const state = { search: "", page: 1, limit: 10 };

function applyCoverFallback(image) {
  image.addEventListener("error", () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = "true";
    image.src = FALLBACK_COVER_URL;
  });
}

function publicErrorMessage(error) {
  if (error.status === 0) return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
  if (error.status === 403) return "O acesso à biblioteca foi negado pelo servidor.";
  if (error.status >= 500) return "A biblioteca está temporariamente indisponível. Tente novamente em alguns instantes.";
  return "Não foi possível carregar os documentos. Tente novamente.";
}

function downloadErrorMessage(error) {
  if (error.status === 0) return "Falha de conexão. Tente novamente.";
  if (error.status === 404) return "O arquivo não está mais disponível.";
  if (error.status >= 500) return "O servidor não conseguiu disponibilizar o PDF.";
  return "Não foi possível baixar o PDF.";
}

function downloadFileName(documentData) {
  const slug = documentData.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "documento"}.pdf`;
}

async function downloadDocument(documentData, button, feedback) {
  feedback.textContent = "";
  setButtonLoading(button, true, "Baixando…");
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
    setButtonLoading(button, false);
  }
}

function setView(view) {
  elements.loading.hidden = view !== "loading";
  elements.empty.hidden = view !== "empty";
  elements.error.hidden = view !== "error";
  elements.grid.hidden = view !== "ready";
  elements.grid.setAttribute("aria-busy", String(view === "loading"));
  if (view !== "ready") elements.pagination.replaceChildren();
}

function createDocumentCard(documentData) {
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
  download.textContent = "Baixar PDF ↓";
  const downloadFeedback = document.createElement("span");
  downloadFeedback.className = "field-error";
  downloadFeedback.setAttribute("role", "alert");
  download.addEventListener("click", () => downloadDocument(documentData, download, downloadFeedback));

  body.append(tag, title, description, download, downloadFeedback);
  article.append(cover, body);
  return article;
}

async function loadDocuments({ focusResults = false } = {}) {
  setView("loading");
  elements.summary.textContent = "";
  try {
    const response = await documentosService.listPublic(state);
    state.page = response.pagination.page;
    elements.grid.replaceChildren(...response.items.map(createDocumentCard));

    if (!response.items.length) {
      elements.emptyTitle.textContent = state.search ? "Nenhum resultado encontrado" : "Nenhum documento disponível";
      elements.emptyMessage.textContent = state.search
        ? `Não encontramos documentos para “${state.search}”. Tente outros termos.`
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
      document.querySelector("#main-content").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    elements.errorMessage.textContent = publicErrorMessage(error);
    setView("error");
  }
}

elements.search.addEventListener("input", debounce(() => {
  state.search = elements.search.value.trim();
  state.page = 1;
  loadDocuments();
}, 350));
elements.retry.addEventListener("click", () => loadDocuments());

loadDocuments();
