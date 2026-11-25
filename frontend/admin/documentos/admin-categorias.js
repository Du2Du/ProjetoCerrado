import { sortCategories, validateCategory } from "../../components/categorias-ui.js";
import {
  createListRequest,
  createModalController,
  debounce,
  renderPagination,
  setButtonLoading,
  showToast
} from "../../components/documentos-ui.js";

export function createCategoryAdmin({ list, create, update, remove, onChanged, errorMessage }) {
  const element = (id) => document.getElementById(id);
  const search = element("category-admin-search");
  const add = element("category-add");
  const table = element("category-table");
  const tbody = element("category-table-body");
  const summary = element("category-summary");
  const listError = element("category-list-error");
  const pagination = element("category-pagination");
  const form = element("category-form");
  const fields = { name: element("category-name"), description: element("category-description") };
  const save = element("category-save");
  const confirm = element("category-delete-confirm");
  const formError = element("category-form-error");
  const deleteError = element("category-delete-error");
  const toast = element("app-toast");
  const request = createListRequest();
  const editModal = createModalController(element("category-modal"), { onRequestClose: () => !save.disabled });
  const deleteModal = createModalController(element("category-delete-modal"), { onRequestClose: () => !confirm.disabled });
  let categories = [];
  let editing = null;
  let deleting = null;
  let page = 1;

  function setFieldErrors(errors = {}) {
    for (const [name, field] of Object.entries(fields)) {
      if (errors[name]) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
      element(`${field.id}-error`).textContent = errors[name] || "";
    }
  }

  function openEditor(category = null) {
    editing = category;
    fields.name.value = category?.name || "";
    fields.description.value = category?.description || "";
    element("category-modal-title").textContent = category ? "Editar categoria" : "Adicionar categoria";
    setFieldErrors();
    formError.textContent = "";
    editModal.open();
  }

  function openDelete(category) {
    deleting = category;
    element("category-delete-description").textContent =
      `Excluir “${category.name}”? Documentos ativos vinculados (${category.documentCount}) serão preservados.`;
    deleteError.textContent = "";
    deleteModal.open();
  }

  function createRow(category) {
    const row = document.createElement("tr");
    for (const value of [category.name, category.description, category.documentCount]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    const actions = document.createElement("td");
    const controls = document.createElement("div");
    controls.className = "admin-table__actions";
    for (const [label, action] of [["Editar", openEditor], ["Excluir", openDelete]]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "app-button app-button--secondary";
      button.textContent = label;
      button.setAttribute("aria-label", `${label} categoria ${category.name}`);
      button.addEventListener("click", () => action(category));
      controls.append(button);
    }
    actions.append(controls);
    row.append(actions);
    return row;
  }

  function render(result, focusPage) {
    page = result.pagination.page;
    tbody.replaceChildren(...categories.map(createRow));
    table.hidden = !result.items.length;
    const count = result.pagination.totalItems;
    summary.textContent = count === 1 ? "1 categoria encontrada" : `${count} categorias encontradas`;
    renderPagination(pagination, result.pagination, (next) => {
      page = next;
      load(true);
    });
    if (focusPage) (pagination.querySelector('[aria-current="page"]') || search).focus();
  }

  async function load(focusPage = false) {
    const isCurrent = request.start();
    listError.hidden = true;
    table.hidden = true;
    pagination.replaceChildren();
    summary.textContent = "Carregando categorias…";
    try {
      const result = await list({ page, search: search.value.trim() });
      if (!isCurrent()) return;
      const lastPage = Math.max(1, result.pagination.totalPages);
      if (page > lastPage) {
        page = lastPage;
        return load(focusPage);
      }
      categories = sortCategories(result.items);
      render(result, focusPage);
    } catch (error) {
      if (!isCurrent() || error.status === 401) return;
      summary.textContent = "";
      element("category-list-error-message").textContent = errorMessage(error, "carregar as categorias");
      listError.hidden = false;
    }
  }

  add.addEventListener("click", () => openEditor());
  element("category-retry").addEventListener("click", () => load());
  const searchCategories = debounce(() => load(), 350);
  search.addEventListener("input", () => {
    page = 1;
    request.invalidate();
    searchCategories();
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (save.disabled) return;
    const values = { name: fields.name.value.trim(), description: fields.description.value.trim() };
    const errors = validateCategory(values, categories, editing?.id);
    setFieldErrors(errors);
    formError.textContent = "";
    if (Object.keys(errors).length) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    setButtonLoading(save, true, "Salvando…");
    try {
      if (editing) await update(editing.id, values);
      else await create(values);
    } catch (error) {
      if (error.status === 409) {
        setFieldErrors({ name: error.message });
        fields.name.focus();
      } else if (error.status !== 401) {
        formError.textContent = errorMessage(error, "salvar a categoria");
      }
      return;
    } finally {
      setButtonLoading(save, false);
    }
    editModal.close();
    showToast(toast, editing ? "Categoria atualizada." : "Categoria cadastrada.");
    onChanged();
    await load();
    if (add.offsetParent && !add.disabled) add.focus();
  });
  confirm.addEventListener("click", async () => {
    if (confirm.disabled) return;
    deleteError.textContent = "";
    setButtonLoading(confirm, true, "Excluindo…");
    try {
      await remove(deleting.id);
    } catch (error) {
      if (error.status !== 401) deleteError.textContent = errorMessage(error, "excluir a categoria");
      return;
    } finally {
      setButtonLoading(confirm, false);
    }
    deleteModal.close();
    showToast(toast, "Categoria excluída.");
    onChanged();
    await load();
    if (add.offsetParent && !add.disabled) add.focus();
  });

  return {
    load,
    reset() {
      search.value = "";
      page = 1;
      request.invalidate();
    }
  };
}
