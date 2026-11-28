/**
 * Comportamentos compartilhados pelos dashboards públicos.
 * Centraliza estados de carregamento/erro, KPIs, filtros recolhíveis e abas para
 * que cada página de cadeia produtiva cuide apenas de seus próprios dados.
 */
function atualizarKpiComApi(id, { label, value, unit = "", badge = "", badgeIcon = "", tone = "neutral", state = "ready" } = {}) {
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
        if (state === "ready" && badgeIcon) {
            const icon = document.createElement("span");
            icon.className = "material-symbol";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = badgeIcon;
            badgeEl.prepend(icon);
        }
    }

    card.dataset.apiState = state;
    card.removeAttribute("aria-busy");
}

// Zero é uma medição válida. Campos vazios representam ausência de dados.
function temMedicao(valor) {
    return (typeof valor === "number" || (typeof valor === "string" && valor.trim() !== ""))
        && Number.isFinite(Number(valor));
}

// Dá prioridade a estado e aceita o campo anterior durante a transição das APIs.
function normalizarEstadoDaApi(registros) {
    return registros.map(registro => {
        if (!registro || !Object.hasOwn(registro, "uf")) return registro;
        const { uf, ...dados } = registro;
        return { ...dados, estado: dados.estado ?? uf };
    });
}

const codigosUfPainel = new Map([
    ["Acre", "AC"], ["Alagoas", "AL"], ["Amapá", "AP"], ["Amazonas", "AM"],
    ["Bahia", "BA"], ["Ceará", "CE"], ["Distrito Federal", "DF"], ["Espírito Santo", "ES"],
    ["Goiás", "GO"], ["Maranhão", "MA"], ["Mato Grosso", "MT"], ["Mato Grosso do Sul", "MS"],
    ["Minas Gerais", "MG"], ["Pará", "PA"], ["Paraíba", "PB"], ["Paraná", "PR"],
    ["Pernambuco", "PE"], ["Piauí", "PI"], ["Rio de Janeiro", "RJ"], ["Rio Grande do Norte", "RN"],
    ["Rio Grande do Sul", "RS"], ["Rondônia", "RO"], ["Roraima", "RR"], ["Santa Catarina", "SC"],
    ["São Paulo", "SP"], ["Sergipe", "SE"], ["Tocantins", "TO"]
]);
const codigosCentroOeste = new Set(["DF", "GO", "MT", "MS"]);

function codigoUfPainel(uf) {
    return codigosUfPainel.get(uf) || uf;
}

function localidadeCentroOeste(uf) {
    return codigosCentroOeste.has(codigoUfPainel(uf));
}

window.atualizarKpiComApi = atualizarKpiComApi;

// Resolve o card visual que deve receber loading, vazio ou erro.
function containerDeDados(id) {
    const elemento = document.getElementById(id);
    if (!elemento) return null;
    if (elemento.matches(".chart-card, .table-card, .kpi-card")) return elemento;
    return elemento.closest(".chart-card, .table-card, .kpi-card");
}

const avisoSemDadosGrafico = "Não há dados para os filtros escolhidos.";

function correspondeAoIndicador(coluna, indicador) {
    const indicadores = coluna.querySelector(".chart-area[data-indicadores]")?.dataset.indicadores.split(" ");
    return indicador === "all" || (indicadores || [coluna.dataset.category]).includes(indicador);
}

function mostrarAvisoGrafico(id, mensagem = "") {
    const grafico = document.getElementById(id);
    const card = grafico?.closest(".chart-card");
    if (!card) return;
    const texto = card.matches(".data-card--loading, .data-card--error, .data-card--empty") ? "" : mensagem;
    let aviso = card.querySelector(":scope > .chart-empty");
    if (texto && !aviso) {
        aviso = document.createElement("div");
        aviso.className = "chart-empty";
        aviso.setAttribute("role", "status");
        grafico.after(aviso);
    }
    grafico.hidden = Boolean(texto);
    if (aviso) {
        aviso.hidden = !texto;
        if (aviso.textContent !== texto) aviso.textContent = texto;
    }
}

// Substitui o estado visual anterior dos componentes indicados.
function definirEstadoDeDados(ids, estado, mensagem = "") {
    // Remove o estado anterior antes de aplicar o próximo; isso impede sobrepor
    // loaders e mensagens quando uma requisição é refeita.
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
        icone.className = estado === "loading" ? "data-state__spinner" : "data-state__icon material-symbol";
        icone.setAttribute("aria-hidden", "true");
        if (estado !== "loading") icone.textContent = estado === "empty" ? "info" : "error";
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

// Insere a fonte ao lado do subtítulo sem duplicar a nota.
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

// Inicializa componentes genéricos somente depois que todo o HTML está disponível.
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
        toggleIcon.className = "filter-bar__toggle-icon material-symbol";
        toggleIcon.textContent = "expand_more";
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
