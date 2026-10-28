import { authService } from "../../services/auth-service.js";
import { documentosService } from "../../services/documentos-service.js";
import {
  createModalController,
  debounce,
  formatDate,
  renderPagination,
  setButtonLoading,
  showToast
} from "../../components/documentos-ui.js";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 20 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const elements = {
  userName: document.querySelector("#admin-user-name"),
  logout: document.querySelector("#logout-button"),
  add: document.querySelector("#add-document"),
  search: document.querySelector("#admin-search"),
  summary: document.querySelector("#admin-summary"),
  loading: document.querySelector("#admin-loading"),
  empty: document.querySelector("#admin-empty"),
  emptyTitle: document.querySelector("#admin-empty-title"),
  emptyMessage: document.querySelector("#admin-empty-message"),
  error: document.querySelector("#admin-error"),
  retry: document.querySelector("#admin-retry"),
  tableCard: document.querySelector("#admin-table-card"),
  tableBody: document.querySelector("#documents-table-body"),
  pagination: document.querySelector("#admin-pagination"),
  documentModal: document.querySelector("#document-modal"),
  modalTitle: document.querySelector("#document-modal-title"),
  modalSubtitle: document.querySelector("#document-modal-subtitle"),
  form: document.querySelector("#document-form"),
  title: document.querySelector("#document-title"),
  description: document.querySelector("#document-description"),
  cover: document.querySelector("#document-cover"),
  pdf: document.querySelector("#document-pdf"),
  coverRequired: document.querySelector("#cover-required"),
  pdfRequired: document.querySelector("#pdf-required"),
  coverPreview: document.querySelector("#cover-preview"),
  coverPreviewImage: document.querySelector("#cover-preview-image"),
  coverPreviewName: document.querySelector("#cover-preview-name"),
  pdfPreview: document.querySelector("#pdf-preview"),
  pdfPreviewName: document.querySelector("#pdf-preview-name"),
  formFeedback: document.querySelector("#form-feedback"),
  save: document.querySelector("#save-document"),
  deleteModal: document.querySelector("#delete-modal"),
  deleteTitle: document.querySelector("#delete-document-title"),
  deleteFeedback: document.querySelector("#delete-feedback"),
  confirmDelete: document.querySelector("#confirm-delete"),
  toast: document.querySelector("#app-toast")
};

const state = {
  search: "",
  page: 1,
  limit: 10,
  items: [],
  editing: null,
  deleting: null,
  formDirty: false,
  submitting: false
};

const documentModal = createModalController(elements.documentModal, {
  onRequestClose: () => {
    if (state.submitting) return false;
    if (state.formDirty && !window.confirm("Descartar as alterações não salvas?")) return false;
    state.formDirty = false;
    return true;
  }
});
const deleteModal = createModalController(elements.deleteModal, {
  onRequestClose: () => !elements.confirmDelete.disabled
});

function redirectToLogin() {
  const redirect = encodeURIComponent("/admin/documentos/");
  window.location.replace(`../login/?redirect=${redirect}`);
}

async function ensureSession() {
  try {
    const session = await authService.me();
    elements.userName.textContent = `Olá, ${session.user.name}`;
  } catch {
    redirectToLogin();
    throw new Error("Sessão ausente");
  }
}

function setListView(view) {
  elements.loading.hidden = view !== "loading";
  elements.empty.hidden = view !== "empty";
  elements.error.hidden = view !== "error";
  elements.tableCard.hidden = view !== "ready";
  elements.tableCard.setAttribute("aria-busy", String(view === "loading"));
  if (view !== "ready") elements.pagination.replaceChildren();
}

function actionButton(label, symbol, className, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.textContent = symbol;
  button.addEventListener("click", handler);
  return button;
}

function createTableRow(documentData) {
  const row = document.createElement("tr");
  const coverCell = document.createElement("td");
  const cover = document.createElement("img");
  cover.className = "admin-table__cover";
  cover.src = documentData.coverUrl;
  cover.alt = "";
  coverCell.append(cover);

  const titleCell = document.createElement("td");
  titleCell.className = "admin-table__title";
  titleCell.textContent = documentData.title;

  const dateCell = document.createElement("td");
  dateCell.textContent = formatDate(documentData.createdAt);

  const actionsCell = document.createElement("td");
  const actions = document.createElement("div");
  actions.className = "admin-table__actions";
  actions.append(
    actionButton(`Editar ${documentData.title}`, "✎", "icon-button", () => openEdit(documentData)),
    actionButton(`Excluir ${documentData.title}`, "⌫", "icon-button icon-button--danger", () => openDelete(documentData))
  );
  actionsCell.append(actions);
  row.append(coverCell, titleCell, dateCell, actionsCell);
  return row;
}

async function loadDocuments({ focusTable = false } = {}) {
  setListView("loading");
  elements.summary.textContent = "";
  try {
    const response = await documentosService.listAdmin(state);
    state.page = response.pagination.page;
    state.items = response.items;
    elements.tableBody.replaceChildren(...state.items.map(createTableRow));

    if (!state.items.length) {
      elements.emptyTitle.textContent = state.search ? "Nenhum resultado encontrado" : "Nenhum documento cadastrado";
      elements.emptyMessage.textContent = state.search
        ? `Não há documentos com o título “${state.search}”.`
        : "Adicione o primeiro documento para iniciar a biblioteca.";
      setListView("empty");
      elements.summary.textContent = "0 documentos encontrados";
      return;
    }

    setListView("ready");
    const count = response.pagination.totalItems;
    elements.summary.textContent = `${count} ${count === 1 ? "documento cadastrado" : "documentos cadastrados"}`;
    renderPagination(elements.pagination, response.pagination, (page) => {
      state.page = page;
      loadDocuments({ focusTable: true });
    });
    if (focusTable) elements.tableCard.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {
    setListView("error");
  }
}

function clearErrors() {
  [elements.title, elements.description, elements.cover, elements.pdf].forEach((field) => {
    field.removeAttribute("aria-invalid");
    document.querySelector(`#${field.id}-error`).textContent = "";
  });
  elements.formFeedback.textContent = "";
}

function resetForm() {
  elements.form.reset();
  clearErrors();
  elements.coverPreview.hidden = true;
  elements.pdfPreview.hidden = true;
  elements.coverPreviewImage.removeAttribute("src");
  elements.coverPreviewName.textContent = "";
  elements.pdfPreviewName.textContent = "";
  state.formDirty = false;
}

function openCreate() {
  resetForm();
  state.editing = null;
  elements.modalTitle.textContent = "Adicionar documento";
  elements.modalSubtitle.textContent = "Preencha os dados e selecione os arquivos obrigatórios.";
  elements.save.textContent = "Salvar documento";
  elements.coverRequired.hidden = false;
  elements.pdfRequired.hidden = false;
  elements.cover.required = true;
  elements.pdf.required = true;
  documentModal.open(elements.add);
}

function openEdit(documentData) {
  resetForm();
  state.editing = documentData;
  elements.modalTitle.textContent = "Editar documento";
  elements.modalSubtitle.textContent = "Altere os dados ou selecione novos arquivos para substituí-los.";
  elements.save.textContent = "Salvar alterações";
  elements.coverRequired.hidden = true;
  elements.pdfRequired.hidden = true;
  elements.cover.required = false;
  elements.pdf.required = false;
  elements.title.value = documentData.title;
  elements.description.value = documentData.description;
  elements.coverPreviewImage.src = documentData.coverUrl;
  elements.coverPreviewName.textContent = "Imagem atual";
  elements.coverPreview.hidden = false;
  elements.pdfPreviewName.textContent = documentData.pdfName || "PDF atual";
  elements.pdfPreview.hidden = false;
  state.formDirty = false;
  documentModal.open();
}

function setFieldError(field, message) {
  field.setAttribute("aria-invalid", "true");
  document.querySelector(`#${field.id}-error`).textContent = message;
}

function validateForm() {
  clearErrors();
  const coverFile = elements.cover.files[0];
  const pdfFile = elements.pdf.files[0];
  let valid = true;

  if (!elements.title.value.trim()) {
    setFieldError(elements.title, "Informe o título.");
    valid = false;
  }
  if (!elements.description.value.trim()) {
    setFieldError(elements.description, "Informe a descrição.");
    valid = false;
  }
  if (!state.editing && !coverFile) {
    setFieldError(elements.cover, "Selecione uma imagem de capa.");
    valid = false;
  } else if (coverFile && !IMAGE_TYPES.includes(coverFile.type)) {
    setFieldError(elements.cover, "Use uma imagem JPG, PNG ou WebP.");
    valid = false;
  } else if (coverFile && coverFile.size > MAX_IMAGE_SIZE) {
    setFieldError(elements.cover, "A imagem deve ter no máximo 5 MB.");
    valid = false;
  }
  if (!state.editing && !pdfFile) {
    setFieldError(elements.pdf, "Selecione o arquivo PDF.");
    valid = false;
  } else if (pdfFile && pdfFile.type !== "application/pdf" && !pdfFile.name.toLocaleLowerCase("pt-BR").endsWith(".pdf")) {
    setFieldError(elements.pdf, "Selecione exclusivamente um arquivo PDF.");
    valid = false;
  } else if (pdfFile && pdfFile.size > MAX_PDF_SIZE) {
    setFieldError(elements.pdf, "O PDF deve ter no máximo 20 MB.");
    valid = false;
  }
  return valid;
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function previewCover() {
  const file = elements.cover.files[0];
  state.formDirty = true;
  if (!file) {
    if (state.editing) {
      elements.coverPreviewImage.src = state.editing.coverUrl;
      elements.coverPreviewName.textContent = "Imagem atual";
      elements.coverPreview.hidden = false;
    } else {
      elements.coverPreview.hidden = true;
    }
    return;
  }
  if (!IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE) return;
  readAsDataUrl(file).then((url) => {
    elements.coverPreviewImage.src = url;
    elements.coverPreviewName.textContent = file.name;
    elements.coverPreview.hidden = false;
  });
}

function previewPdf() {
  const file = elements.pdf.files[0];
  state.formDirty = true;
  if (file) {
    elements.pdfPreviewName.textContent = file.name;
    elements.pdfPreview.hidden = false;
  } else if (state.editing) {
    elements.pdfPreviewName.textContent = state.editing.pdfName || "PDF atual";
    elements.pdfPreview.hidden = false;
  } else {
    elements.pdfPreview.hidden = true;
  }
}

async function saveDocument(event) {
  event.preventDefault();
  if (!validateForm()) {
    elements.form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  state.submitting = true;
  setButtonLoading(elements.save, true, "Salvando…");
  try {
    const coverFile = elements.cover.files[0];
    const values = {
      title: elements.title.value,
      description: elements.description.value,
      coverFile,
      pdfFile: elements.pdf.files[0],
      coverUrl: coverFile ? await readAsDataUrl(coverFile) : undefined
    };
    if (state.editing) {
      await documentosService.update(state.editing.id, values);
    } else {
      await documentosService.create(values);
    }
    const message = state.editing ? "Documento atualizado com sucesso." : "Documento adicionado com sucesso.";
    state.formDirty = false;
    documentModal.close();
    showToast(elements.toast, message);
    state.page = 1;
    await loadDocuments();
  } catch {
    elements.formFeedback.textContent = "Não foi possível salvar o documento. Tente novamente.";
  } finally {
    state.submitting = false;
    setButtonLoading(elements.save, false);
  }
}

function openDelete(documentData) {
  state.deleting = documentData;
  elements.deleteTitle.textContent = `“${documentData.title}”`;
  elements.deleteFeedback.textContent = "";
  deleteModal.open();
}

async function deleteDocument() {
  if (!state.deleting) return;
  setButtonLoading(elements.confirmDelete, true, "Excluindo…");
  try {
    await documentosService.remove(state.deleting.id);
    deleteModal.close();
    showToast(elements.toast, "Documento excluído da biblioteca.");
    if (state.items.length === 1 && state.page > 1) state.page -= 1;
    await loadDocuments();
  } catch {
    elements.deleteFeedback.textContent = "Não foi possível excluir o documento. Tente novamente.";
  } finally {
    setButtonLoading(elements.confirmDelete, false);
    state.deleting = null;
  }
}

elements.add.addEventListener("click", openCreate);
elements.retry.addEventListener("click", () => loadDocuments());
elements.search.addEventListener("input", debounce(() => {
  state.search = elements.search.value.trim();
  state.page = 1;
  loadDocuments();
}, 350));
elements.form.addEventListener("submit", saveDocument);
elements.cover.addEventListener("change", previewCover);
elements.pdf.addEventListener("change", previewPdf);
[elements.title, elements.description].forEach((field) => field.addEventListener("input", () => {
  state.formDirty = true;
  field.removeAttribute("aria-invalid");
  document.querySelector(`#${field.id}-error`).textContent = "";
}));
elements.confirmDelete.addEventListener("click", deleteDocument);
elements.logout.addEventListener("click", async () => {
  setButtonLoading(elements.logout, true, "Saindo…");
  try {
    await authService.logout();
  } finally {
    redirectToLogin();
  }
});

ensureSession().then(() => loadDocuments());
