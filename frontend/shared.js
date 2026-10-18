function atualizarKpiComApi(id, { label, value, unit = "", badge = "", tone = "neutral", state = "ready" } = {}) {
    const card = document.getElementById(id);
    if (!card) return;

    const labelEl = card.querySelector(".kpi-label");
    const valueEl = card.querySelector(".kpi-value");
    const badgeEl = card.querySelector(".kpi-badge");
    if (label && labelEl) labelEl.textContent = label;

    if (valueEl) {
        valueEl.replaceChildren(document.createTextNode(state === "ready" ? String(value) : "—"));
        if (state === "ready" && unit) {
            const unitEl = document.createElement("span");
            unitEl.className = "kpi-unit";
            unitEl.textContent = unit;
            valueEl.append(unitEl);
        }
    }

    if (badgeEl) {
        badgeEl.classList.remove("kpi-badge--up", "kpi-badge--neutral", "kpi-badge--down");
        badgeEl.classList.add(`kpi-badge--${state === "ready" ? tone : "down"}`);
        badgeEl.textContent = state === "ready" ? badge : "Dados indisponíveis";
    }

    card.dataset.apiState = state;
    card.removeAttribute("aria-busy");
}

window.atualizarKpiComApi = atualizarKpiComApi;
window.simularErroApi = new URLSearchParams(window.location.search).get("simularErroApi") === "1";

function containerDeDados(id) {
    const elemento = document.getElementById(id);
    if (!elemento) return null;
    if (elemento.matches(".chart-card, .table-card, .kpi-card")) return elemento;
    return elemento.closest(".chart-card, .table-card, .kpi-card");
}

function definirEstadoDeDados(ids, estado, mensagem = "") {
    ids.forEach(id => {
        const container = containerDeDados(id);
        if (!container) return;
        container.classList.remove("data-card--loading", "data-card--error", "data-card--empty");
        container.querySelector(":scope > .data-state")?.remove();
        container.removeAttribute("aria-busy");
        if (estado === "ready") return;

        container.classList.add(`data-card--${estado}`);
        if (estado === "loading") container.setAttribute("aria-busy", "true");
        const status = document.createElement("div");
        status.className = "data-state";
        status.setAttribute("role", estado === "error" ? "alert" : "status");
        const icone = document.createElement("span");
        icone.className = estado === "loading" ? "data-state__spinner" : "data-state__icon";
        icone.setAttribute("aria-hidden", "true");
        if (estado !== "loading") icone.textContent = estado === "empty" ? "○" : "!";
        const texto = document.createElement("span");
        texto.textContent = mensagem || (estado === "loading" ? "Carregando dados…" : "Dados indisponíveis.");
        status.append(icone, texto);
        if (estado === "error") {
            const retry = document.createElement("button");
            retry.type = "button";
            retry.className = "data-state__retry";
            retry.textContent = "Tentar novamente";
            retry.addEventListener("click", () => window.location.reload());
            status.append(retry);
        }
        container.append(status);
    });
}

function marcarFonteDeDados(ids, fonte) {
    ids.forEach(id => {
        const container = containerDeDados(id);
        if (!container || container.querySelector(".data-source-note--live")) return;
        const nota = document.createElement("div");
        nota.className = "data-source-note data-source-note--live";
        nota.textContent = `Fonte: ${fonte}`;
        container.querySelector(".chart-card__sub")?.insertAdjacentElement("afterend", nota);
    });
}

window.dashboardDataUi = Object.freeze({
    definirEstado: definirEstadoDeDados,
    marcarFonte: marcarFonteDeDados
});

// Tab system
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".filter-bar").forEach((bar, index) => {
        if (bar.dataset.collapsibleReady === "true") return;

        const content = document.createElement("div");
        content.className = "filter-bar__content";
        content.id = `filter-bar-content-${index + 1}`;
        while (bar.firstChild) content.appendChild(bar.firstChild);

        const toolbar = document.createElement("div");
        toolbar.className = "filter-bar__toolbar";

        const title = document.createElement("span");
        title.className = "filter-bar__title";
        title.textContent = "Filtros";

        const toggle = document.createElement("button");
        toggle.className = "filter-bar__toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-controls", content.id);
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Recolher filtros");
        toggle.title = "Recolher filtros";

        const toggleText = document.createElement("span");
        toggleText.className = "filter-bar__toggle-text";
        toggleText.textContent = "Recolher filtros";

        const toggleIcon = document.createElement("span");
        toggleIcon.className = "filter-bar__toggle-icon";
        toggleIcon.setAttribute("aria-hidden", "true");
        toggle.append(toggleText, toggleIcon);
        toolbar.append(title, toggle);
        bar.append(toolbar, content);
        bar.dataset.collapsibleReady = "true";

        toggle.addEventListener("click", () => {
            const collapsed = !bar.classList.contains("is-collapsed");
            const label = collapsed ? "Mostrar filtros" : "Recolher filtros";
            bar.classList.toggle("is-collapsed", collapsed);
            content.hidden = collapsed;
            toggle.setAttribute("aria-expanded", String(!collapsed));
            toggle.setAttribute("aria-label", label);
            toggle.title = label;
            toggleText.textContent = label;
        });
    });

    let pendingFilterRowUpdate = false;
    const updateFilterContentRows = () => {
        pendingFilterRowUpdate = false;
        document.querySelectorAll(".filter-content-row").forEach(row => {
            const hasVisibleItem = Array.from(row.querySelectorAll("[data-category]")).some(el => {
                return !el.classList.contains("is-filter-hidden") && getComputedStyle(el).display !== "none";
            });
            row.classList.toggle("filter-content-row--visible", hasVisibleItem);
        });
    };
    const scheduleFilterRowUpdate = () => {
        if (pendingFilterRowUpdate) return;
        pendingFilterRowUpdate = true;
        requestAnimationFrame(updateFilterContentRows);
    };

    document.querySelectorAll("[data-category]").forEach(el => {
        el.closest(".row")?.classList.add("filter-content-row");
    });
    const filterRowObserver = new MutationObserver(scheduleFilterRowUpdate);
    document.querySelectorAll("[data-category]").forEach(el => {
        filterRowObserver.observe(el, { attributes: true, attributeFilter: ["class", "style"] });
    });
    updateFilterContentRows();

    document.querySelectorAll("[data-tab]").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.dataset.tab;
            const parent = btn.closest("section, .tab-scope") || document;
            parent.querySelectorAll("[data-tab]").forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");
            parent.querySelectorAll("[data-tab-content]").forEach(c => c.classList.remove("active"));
            const content = parent.querySelector(`[data-tab-content="${tabId}"]`);
            if (content) content.classList.add("active");
            if (typeof window.onTabChange === "function") window.onTabChange(tabId);
            // Reset indicator filter and show all categorised items
            document.querySelectorAll('[data-filter-group="ind"] .filter-btn')
                .forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
            document.querySelectorAll("[data-category]").forEach(el => { el.style.display = ""; });
            scheduleFilterRowUpdate();
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            const t = document.querySelector(a.getAttribute("href"));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
        });
    });

    // Filter system
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".filter-group").querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filterId = btn.dataset.filter;
            const group = btn.closest("[data-filter-group]")?.dataset.filterGroup || "";
            if (typeof window.onFilterChange === "function") window.onFilterChange(filterId, group);
        });
    });
});
