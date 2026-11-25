const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

export function sortCategories(categories) {
  return [...categories].sort((a, b) => collator.compare(a.name, b.name));
}

export function validateCategory({ name, description }, categories, editingId) {
  const errors = {};
  const trimmedName = name.trim();
  if (!trimmedName) errors.name = "Informe o nome.";
  else if (trimmedName.length > 100) errors.name = "Use até 100 caracteres no nome.";
  else if (categories.some((category) => category.id !== editingId
    && category.name.trim().toLocaleLowerCase("pt-BR") === trimmedName.toLocaleLowerCase("pt-BR"))) {
    errors.name = "Já existe uma categoria ativa com esse nome.";
  }
  if (description.trim().length > 500) errors.description = "Use até 500 caracteres na descrição.";
  return errors;
}

function button(text, onClick) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "app-button app-button--secondary";
  element.textContent = text;
  element.addEventListener("click", onClick);
  return element;
}

function checkbox(category, checked, labelText, onChange) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  input.dataset.categoryId = category.id;
  input.addEventListener("change", () => onChange(input.checked));
  label.append(input, document.createTextNode(labelText));
  return label;
}

export function categoryTags(categories = []) {
  const tags = document.createElement("div");
  tags.className = "category-tags";
  const ordered = sortCategories(categories);
  const tag = ({ name }) => {
    const element = document.createElement("span");
    element.className = "category-tag";
    element.textContent = name;
    return element;
  };
  tags.append(...ordered.slice(0, 3).map(tag));

  if (ordered.length > 3) {
    const more = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = `+${ordered.length - 3}`;
    summary.setAttribute("aria-label", `${ordered.length - 3} categorias adicionais`);
    const extra = document.createElement("div");
    extra.className = "category-tags";
    extra.append(...ordered.slice(3).map(tag));
    more.append(summary, extra);
    tags.append(more);
  }
  return tags;
}

export function categoryFilterState(categories, selected, expanded) {
  const visible = expanded ? categories : categories.slice(0, 10);
  const hiddenCount = categories.slice(visible.length)
    .filter(({ id }) => selected.has(id)).length;
  return { visible, hiddenCount };
}

export function createCategoryFilter(root, { counts = false, onChange }) {
  const selected = new Set();
  let categories = [];
  let expanded = false;

  const panel = document.createElement("div");
  panel.id = `${root.id}-panel`;
  const toggle = button("Filtrar por categorias", () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
  });
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-controls", panel.id);

  const group = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.className = "visually-hidden";
  legend.textContent = "Filtrar por categorias";
  const choices = document.createElement("div");
  choices.className = "category-options";
  const status = document.createElement("span");
  status.setAttribute("role", "status");
  const more = button("Mostrar mais", () => {
    expanded = !expanded;
    render();
  });
  choices.id = `${root.id}-options`;
  more.setAttribute("aria-controls", choices.id);
  const clear = button("Limpar categorias", () => {
    selected.clear();
    render();
    toggle.focus();
    onChange([]);
  });

  function updateStatus(hiddenCount) {
    clear.hidden = selected.size === 0;
    status.textContent = hiddenCount ? `${hiddenCount} seleções ocultas` : "";
  }

  function render() {
    const { visible, hiddenCount } = categoryFilterState(categories, selected, expanded);
    choices.replaceChildren(...visible.map((category) => checkbox(
      category,
      selected.has(category.id),
      counts ? `${category.name} (${category.documentCount})` : category.name,
      (checked) => {
        if (checked) selected.add(category.id);
        else selected.delete(category.id);
        updateStatus(hiddenCount);
        onChange([...selected]);
      }
    )));
    more.hidden = categories.length <= 10;
    more.textContent = expanded ? "Mostrar menos" : "Mostrar mais";
    more.setAttribute("aria-expanded", String(expanded));
    updateStatus(hiddenCount);
  }

  group.append(legend, choices, more, clear, status);
  panel.append(group);
  root.append(toggle, panel);
  root.hidden = true;
  return {
    setCategories(items) {
      categories = sortCategories(items.filter(({ documentCount }) => documentCount > 0));
      const available = new Set(categories.map(({ id }) => id));
      const previousSize = selected.size;
      for (const id of selected) {
        if (!available.has(id)) selected.delete(id);
      }
      render();
      root.hidden = categories.length === 0;
      if (previousSize !== selected.size) onChange([...selected]);
    },
    reset() {
      const hadSelection = selected.size > 0;
      selected.clear();
      expanded = false;
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      render();
      if (hadSelection) onChange([]);
    }
  };
}

export function createCategoryPicker({ search, options, tags, status, onChange }) {
  let categories = [];
  let selected = new Map();

  function render() {
    const query = search.value.trim().toLocaleLowerCase("pt-BR");
    const matches = categories.filter(({ name }) => name.toLocaleLowerCase("pt-BR").includes(query));
    options.replaceChildren(...matches.map((category) => checkbox(
      category,
      selected.has(category.id),
      category.name,
      (checked) => {
        if (checked) selected.set(category.id, category);
        else selected.delete(category.id);
        renderTags();
        onChange();
      }
    )));
    status.textContent = matches.length ? "" : "Nenhuma categoria disponível para esta pesquisa.";
    renderTags();
  }

  function renderTags() {
    tags.replaceChildren(...sortCategories(selected.values()).map((category) => {
      const remove = button(`${category.name} ×`, () => {
        selected.delete(category.id);
        render();
        search.focus();
        onChange();
      });
      remove.className = "category-tag";
      remove.setAttribute("aria-label", `Remover categoria ${category.name}`);
      return remove;
    }));
  }

  search.addEventListener("input", render);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
  });

  return {
    setAvailable(available) {
      categories = sortCategories(available);
      render();
    },
    reset(available, current) {
      categories = sortCategories(available);
      selected = new Map(current.map((category) => [category.id, category]));
      search.value = "";
      render();
    },
    getIds() {
      return [...selected.keys()];
    }
  };
}

export function setupAdminTabs(tablist, onActivate) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];

  function activate(tab) {
    for (const candidate of tabs) {
      const active = candidate === tab;
      candidate.tabIndex = active ? 0 : -1;
      candidate.setAttribute("aria-selected", String(active));
      document.getElementById(candidate.getAttribute("aria-controls")).hidden = !active;
    }
    onActivate(tab.id);
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      const index = tabs.indexOf(tab);
      let next;
      switch (event.key) {
        case "ArrowLeft": next = (index + tabs.length - 1) % tabs.length; break;
        case "ArrowRight": next = (index + 1) % tabs.length; break;
        case "Home": next = 0; break;
        case "End": next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      tabs[next].focus();
      activate(tabs[next]);
    });
  }
}
