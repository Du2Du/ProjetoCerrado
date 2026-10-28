import { documentosService } from "../services/documentos-service.js";
import { debounce, renderPagination } from "../components/documentos-ui.js";

const elements = {
  search: document.querySelector("#document-search"),
  summary: document.querySelector("#documents-summary"),
  grid: document.querySelector("#documents-grid"),
  loading: document.querySelector("#documents-loading"),
  empty: document.querySelector("#documents-empty"),
  emptyTitle: document.querySelector("#documents-empty-title"),
  emptyMessage: document.querySelector("#documents-empty-message"),
  error: document.querySelector("#documents-error"),
  retry: document.querySelector("#documents-retry"),
  pagination: document.querySelector("#documents-pagination")
};

const state = { search: "", page: 1, limit: 10 };

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
  const download = document.createElement("a");
  download.className = "app-button app-button--primary document-card__action";
  download.href = documentData.pdfUrl;
  download.download = documentData.pdfName || "documento.pdf";
  download.setAttribute("aria-label", `Baixar PDF: ${documentData.title}`);
  download.textContent = "Baixar PDF ↓";

  body.append(tag, title, description, download);
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
  } catch {
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
