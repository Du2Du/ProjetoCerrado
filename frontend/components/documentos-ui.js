export function debounce(callback, delay = 300) {
  let timeout;
  return (...args) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), delay);
  };
}

export function formatDate(dateValue) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(dateValue));
}

export function renderPagination(container, pagination, onPageChange) {
  container.replaceChildren();
  if (pagination.totalPages <= 1) return;

  const label = document.createElement("span");
  label.className = "pagination__summary";
  label.textContent = `Página ${pagination.page} de ${pagination.totalPages}`;

  const controls = document.createElement("div");
  controls.className = "pagination__controls";

  const addButton = (text, page, disabled, current = false, ariaLabel = "") => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pagination__button";
    button.textContent = text;
    button.disabled = disabled;
    if (current) {
      button.classList.add("is-current");
      button.setAttribute("aria-current", "page");
    }
    if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
    button.addEventListener("click", () => onPageChange(page));
    controls.append(button);
  };

  addButton("‹", pagination.page - 1, pagination.page === 1, false, "Página anterior");
  for (let page = 1; page <= pagination.totalPages; page += 1) {
    if (pagination.totalPages > 7 && Math.abs(page - pagination.page) > 2 && page !== 1 && page !== pagination.totalPages) {
      if (page === 2 || page === pagination.totalPages - 1) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "pagination__ellipsis";
        ellipsis.textContent = "…";
        controls.append(ellipsis);
      }
      continue;
    }
    addButton(String(page), page, false, page === pagination.page, `Ir para a página ${page}`);
  }
  addButton("›", pagination.page + 1, pagination.page === pagination.totalPages, false, "Próxima página");

  container.append(label, controls);
}

export function setButtonLoading(button, loading, loadingLabel = "Aguarde…") {
  if (loading) {
    button.dataset.defaultLabel = button.textContent;
    button.textContent = loadingLabel;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  } else {
    button.textContent = button.dataset.defaultLabel || button.textContent;
    button.disabled = false;
    button.removeAttribute("aria-busy");
  }
}

export function createModalController(element, { onRequestClose = () => true } = {}) {
  let opener = null;
  const focusableSelector = [
    "a[href]", "button:not([disabled])", "input:not([disabled])",
    "textarea:not([disabled])", "select:not([disabled])", "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  const close = () => {
    element.classList.remove("is-open");
    element.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-is-open");
    opener?.focus();
  };

  const requestClose = () => {
    if (onRequestClose() !== false) close();
  };

  const open = (trigger = document.activeElement) => {
    opener = trigger;
    element.classList.add("is-open");
    element.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-is-open");
    window.requestAnimationFrame(() => element.querySelector(focusableSelector)?.focus());
  };

  element.addEventListener("mousedown", (event) => {
    if (event.target === element || event.target.closest("[data-modal-close]")) requestClose();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      requestClose();
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(element.querySelectorAll(focusableSelector));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  return Object.freeze({ open, close, requestClose });
}

export function showToast(element, message, tone = "success") {
  element.textContent = message;
  element.className = `app-toast app-toast--${tone} is-visible`;
  element.setAttribute("role", tone === "error" ? "alert" : "status");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => element.classList.remove("is-visible"), 4200);
}
