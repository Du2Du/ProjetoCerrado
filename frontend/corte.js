const PALETA_CORTE = ["#8b3a1a", "#c8943a", "#4a7c3f", "#6fa65e", "#2d5c24", "#d4843a", "#a0622b", "#e8a84c", "#5c4033", "#3a6b4a"];

const DADOS_CORTE = {
  rebanhoCorte: [],
  abateBovinos: []
};

const rootsGraficosCorte = new Map();

const filtrosCorte = {
  indicador: "all",
  anoInicio: null,
  anoFim: null,
  ufs: new Set(),
  trimestre: "all",
  metricaAbate: "quantidade"
};

const ufCanonicaCorte = {
  Brasil: "Brasil",
  Goiás: "GO",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  Pará: "PA"
};

const indicadorParaAbaCorte = {
  rebanho: "ct-rebanho",
  abate: "ct-rebanho",
  pastagens: "ct-pastagens"
};

function porId(id) { return document.getElementById(id); }
function formatarMilhoes(valor) { return Math.round((valor / 1000000) * 100) / 100; }
function periodoLabel() { return `${filtrosCorte.anoInicio}-${filtrosCorte.anoFim}`; }
function dentroPeriodo(ano) { return Number(ano) >= filtrosCorte.anoInicio && Number(ano) <= filtrosCorte.anoFim; }
function canonUf(uf) { return ufCanonicaCorte[uf] || uf; }
function atualizarTexto(id, texto) { const el = porId(id); if (el) el.textContent = texto; }

function criarRoot(id) {
  limparGrafico(id);
  const root = am5.Root.new(id);
  root.setThemes([am5themes_Animated.new(root)]);
  rootsGraficosCorte.set(id, root);
  return root;
}

function limparGrafico(id) {
  const root = rootsGraficosCorte.get(id);
  if (root) root.dispose();
  rootsGraficosCorte.delete(id);
  const el = porId(id);
  if (el) el.innerHTML = "";
}

function mostrarSemDadosChart(id, mensagem = "Sem dados para os filtros selecionados.") {
  limparGrafico(id);
  const el = porId(id);
  if (!el) return;
  el.innerHTML = `<div class="filter-empty d-block h-100 d-flex align-items-center justify-content-center text-center">${mensagem}</div>`;
}

function configurarEixo(axis) {
  axis.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif", fill: am5.color("#5a5a5a") });
}

function criarLegenda(chart, root) {
  const legend = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  legend.labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif" });
  return legend;
}

function anosDeObjetoSerie(dados) {
  return [...new Set(dados.flatMap(item => Object.keys(item).filter(chave => /^\d{4}$/.test(chave)).map(Number)))].sort((a, b) => a - b);
}

function anosDisponiveisCorte() {
  const anos = new Set();
  anosDeObjetoSerie(DADOS_CORTE.rebanhoCorte).forEach(ano => anos.add(ano));
  DADOS_CORTE.abateBovinos.forEach(item => anos.add(item.ano));
  return [...anos].sort((a, b) => a - b);
}

function dadosSeriePorAno(dados, campoNome, anos, transformador = valor => valor) {
  return anos.map(ano => {
    const linha = { ano: String(ano) };
    dados.forEach(item => { linha[item[campoNome]] = transformador(item[String(ano)]); });
    return linha;
  });
}

function criarLinhas(id, dados, campoCategoria, series, sufixo = "") {
  const seriesValidas = series.filter(nome => dados.some(item => item[nome] !== null && item[nome] !== undefined));
  if (!dados.length || !seriesValidas.length) return mostrarSemDadosChart(id);
  const root = criarRoot(id);
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
  const eixoX = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: campoCategoria, renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 35 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY); eixoX.data.setAll(dados);
  seriesValidas.forEach((nome, idx) => {
    const serie = chart.series.push(am5xy.LineSeries.new(root, { name: nome, xAxis: eixoX, yAxis: eixoY, valueYField: nome, categoryXField: campoCategoria, connect: false, stroke: am5.color(PALETA_CORTE[idx % PALETA_CORTE.length]), fill: am5.color(PALETA_CORTE[idx % PALETA_CORTE.length]), tooltip: am5.Tooltip.new(root, { labelText: `{name}: {valueY}${sufixo}` }) }));
    serie.strokes.template.setAll({ strokeWidth: 2 });
    serie.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: serie.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    serie.data.setAll(dados);
  });
  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(600, 60);
}

function criarPizza(id, dados, categoria, valor) {
  const filtrados = dados.filter(item => Number(item[valor]) > 0);
  if (!filtrados.length) return mostrarSemDadosChart(id);
  const root = criarRoot(id);
  const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
  const serie = chart.series.push(am5percent.PieSeries.new(root, { valueField: valor, categoryField: categoria }));
  serie.labels.template.setAll({ fontSize: 10, fontFamily: "Arial,sans-serif" });
  serie.get("colors").set("colors", PALETA_CORTE.map(cor => am5.color(cor)));
  serie.data.setAll(filtrados);
  const legend = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 }));
  legend.labels.template.setAll({ fontSize: 10, fontFamily: "Arial,sans-serif" });
  legend.data.setAll(serie.dataItems);
  chart.appear(600, 60);
}

function criarGraficoRebanho() {
  const anos = anosDeObjetoSerie(DADOS_CORTE.rebanhoCorte).filter(dentroPeriodo);
  const dadosBase = filtrosCorte.ufs.size ? DADOS_CORTE.rebanhoCorte.filter(item => filtrosCorte.ufs.has(canonUf(item.uf))) : DADOS_CORTE.rebanhoCorte;
  const estados = dadosBase.map(item => item.uf);
  atualizarTexto("subRebanhoCorte", `Milhões de cabeças (${periodoLabel()})`);
  if (!anos.length) {
    atualizarTexto("tituloRebanhoPartic", "Participação no Rebanho Nacional");
    mostrarSemDadosChart("chartRebanhoCorte");
    mostrarSemDadosChart("chartRebanhoPartic");
    return;
  }
  criarLinhas("chartRebanhoCorte", dadosSeriePorAno(dadosBase, "uf", anos, formatarMilhoes), "ano", estados, " mi cab.");

  const anoFinal = Math.max(...anos);
  atualizarTexto("tituloRebanhoPartic", `Participação no Rebanho Nacional (${anoFinal || filtrosCorte.anoFim})`);
  criarPizza("chartRebanhoPartic", dadosBase.filter(item => item.uf !== "Brasil" && item[String(anoFinal)]).map(item => ({ uf: item.uf, quantidadeCabecas: item[String(anoFinal)] })), "uf", "quantidadeCabecas");
}

function criarGraficoAbate() {
  const ufsPadrao = ["Brasil", "Goiás", "Mato Grosso", "Mato Grosso do Sul"];
  const ufs = filtrosCorte.ufs.size ? ufsPadrao.filter(uf => filtrosCorte.ufs.has(canonUf(uf))) : ufsPadrao;
  const registrosFiltrados = DADOS_CORTE.abateBovinos.filter(item => dentroPeriodo(item.ano) && ufs.includes(item.uf) && (filtrosCorte.trimestre === "all" || item.trimestre === filtrosCorte.trimestre));
  const anos = [...new Set(registrosFiltrados.map(item => item.ano))]
    .sort((a, b) => a - b)
    .filter(ano => filtrosCorte.trimestre !== "all" || anoAbateCompleto(ano, ufs));
  const acumulado = anos.map(ano => {
    const linha = { ano: String(ano) };
    ufs.forEach(uf => {
      const registros = registrosFiltrados.filter(item => item.uf === uf && item.ano === ano);
      linha[uf] = filtrosCorte.metricaAbate === "peso"
        ? Math.round(registros.reduce((total, item) => total + item.pesoTotalCarcacas, 0) / 1000000)
        : formatarMilhoes(registros.reduce((total, item) => total + item.quantidadeAbatida, 0));
    });
    return linha;
  });
  const sufixo = filtrosCorte.metricaAbate === "peso" ? " mil t" : " mi cab.";
  const trimestre = filtrosCorte.trimestre === "all" ? "todos os trimestres" : `${filtrosCorte.trimestre} trimestre`;
  atualizarTexto("subAbateBovinos", `${filtrosCorte.metricaAbate === "peso" ? "Peso total das carcaças" : "Cabeças abatidas"} · ${trimestre} · ${periodoLabel()}`);
  criarLinhas("chartAbateBovinos", acumulado, "ano", ufs, sufixo);
}

function valoresUfsCorte() {
  const ufs = new Set();
  DADOS_CORTE.rebanhoCorte.forEach(item => ufs.add(canonUf(item.uf)));
  DADOS_CORTE.abateBovinos.forEach(item => ufs.add(canonUf(item.uf)));
  return [...ufs].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function labelSelecao(set, total, todosLabel) {
  if (!set.size || set.size === total) return todosLabel;
  if (set.size === 1) return [...set][0];
  return `${set.size} selecionados`;
}

function renderizarMultiselect({ menuId, buscaId, botaoId, valores, selecionados, todosLabel, label = v => v, onChange }) {
  const menu = porId(menuId);
  const busca = porId(buscaId);
  const botao = porId(botaoId);
  if (!menu || !botao) return;
  const termo = (busca?.value || "").toLocaleLowerCase("pt-BR");
  const visiveis = valores.filter(valor => label(valor).toLocaleLowerCase("pt-BR").includes(termo));
  botao.textContent = labelSelecao(selecionados, valores.length, todosLabel);
  menu.innerHTML = visiveis.map(valor => `
    <label class="filter-option">
      <input type="checkbox" value="${valor}" ${selecionados.has(valor) ? "checked" : ""} />
      <span>${label(valor)}</span>
    </label>
  `).join("") || '<div class="filter-chip">Nenhum resultado</div>';
  menu.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) selecionados.add(input.value); else selecionados.delete(input.value);
      onChange?.();
      atualizarDashboardCorte();
    });
  });
}

function renderizarFiltrosMultiselect() {
  renderizarMultiselect({
    menuId: "filtroUfCorteMenu",
    buscaId: "buscaUfCorte",
    botaoId: "filtroUfCorteBtn",
    valores: valoresUfsCorte(),
    selecionados: filtrosCorte.ufs,
    todosLabel: "Todas"
  });
}

function popularSelectAnos() {
  const anos = anosDisponiveisCorte();
  filtrosCorte.anoInicio = anos[0];
  filtrosCorte.anoFim = anos[anos.length - 1];
  ["filtroAnoInicioCorte", "filtroAnoFimCorte"].forEach(id => {
    const select = porId(id);
    if (!select) return;
    select.innerHTML = anos.map(ano => `<option value="${ano}">${ano}</option>`).join("");
  });
  porId("filtroAnoInicioCorte").value = filtrosCorte.anoInicio;
  porId("filtroAnoFimCorte").value = filtrosCorte.anoFim;
}

function atualizarChipsFiltros() {
  const el = porId("filtrosAtivosCorte");
  if (!el) return;
  const chips = [];
  chips.push(`Período: ${periodoLabel()}`);
  if (filtrosCorte.indicador !== "all") chips.push(`Indicador: ${filtrosCorte.indicador}`);
  if (filtrosCorte.ufs.size) chips.push(`UF: ${[...filtrosCorte.ufs].join(", ")}`);
  if (filtrosCorte.trimestre !== "all") chips.push(`Trimestre: ${filtrosCorte.trimestre}`);
  el.innerHTML = chips.map(chip => `<span class="filter-chip">${chip}</span>`).join("");
}

function atualizarVisibilidadeIndicador() {
  document.querySelectorAll('[data-filter-group="indicador"] .filter-btn').forEach(btn => btn.classList.toggle("active", btn.dataset.filter === filtrosCorte.indicador));
  document.querySelectorAll("[data-category]").forEach(el => {
    el.style.display = filtrosCorte.indicador === "all" || el.dataset.category === filtrosCorte.indicador ? "" : "none";
  });
}

function switchTabCorte(id) {
  const btn = document.querySelector(`[data-tab="${id}"]`);
  if (btn) btn.click();
}

function renderizarAbaAtivaCorte() {
  const activeTab = document.querySelector("[data-tab-content].active");
  const tabId = activeTab?.id || "ct-rebanho";
  if (tabId === "ct-rebanho") {
    criarGraficoRebanho();
    criarGraficoAbate();
  }
}

function atualizarDashboardCorte() {
  if (filtrosCorte.anoInicio > filtrosCorte.anoFim) {
    [filtrosCorte.anoInicio, filtrosCorte.anoFim] = [filtrosCorte.anoFim, filtrosCorte.anoInicio];
    porId("filtroAnoInicioCorte").value = filtrosCorte.anoInicio;
    porId("filtroAnoFimCorte").value = filtrosCorte.anoFim;
  }
  renderizarAbaAtivaCorte();
  renderizarFiltrosMultiselect();
  atualizarChipsFiltros();
  atualizarVisibilidadeIndicador();
}

function limparFiltrosCorte() {
  const anos = anosDisponiveisCorte();
  filtrosCorte.indicador = "all";
  filtrosCorte.anoInicio = anos[0];
  filtrosCorte.anoFim = anos[anos.length - 1];
  filtrosCorte.ufs.clear();
  filtrosCorte.trimestre = "all";
  filtrosCorte.metricaAbate = "quantidade";
  porId("filtroAnoInicioCorte").value = filtrosCorte.anoInicio;
  porId("filtroAnoFimCorte").value = filtrosCorte.anoFim;
  porId("filtroTrimestreCorte").value = "all";
  porId("filtroMetricaAbate").value = "quantidade";
  const buscaUf = porId("buscaUfCorte");
  if (buscaUf) buscaUf.value = "";
  atualizarDashboardCorte();
}

function configurarEventosFiltrosCorte() {
  document.querySelectorAll('[data-filter-group="indicador"] .filter-btn').forEach(btn => {
    btn.addEventListener("click", () => {
      filtrosCorte.indicador = btn.dataset.filter;
      if (filtrosCorte.indicador !== "all") switchTabCorte(indicadorParaAbaCorte[filtrosCorte.indicador]);
      atualizarDashboardCorte();
    });
  });
  porId("filtroAnoInicioCorte")?.addEventListener("change", event => { filtrosCorte.anoInicio = Number(event.target.value); atualizarDashboardCorte(); });
  porId("filtroAnoFimCorte")?.addEventListener("change", event => { filtrosCorte.anoFim = Number(event.target.value); atualizarDashboardCorte(); });
  porId("filtroTrimestreCorte")?.addEventListener("change", event => { filtrosCorte.trimestre = event.target.value; atualizarDashboardCorte(); });
  porId("filtroMetricaAbate")?.addEventListener("change", event => { filtrosCorte.metricaAbate = event.target.value; atualizarDashboardCorte(); });
  porId("btnLimparFiltrosCorte")?.addEventListener("click", limparFiltrosCorte);
  porId("buscaUfCorte")?.addEventListener("input", renderizarFiltrosMultiselect);
}

function inicializarGraficosCorte() {
  popularSelectAnos();
  configurarEventosFiltrosCorte();
  renderizarFiltrosMultiselect();
  atualizarDashboardCorte();
}

window.onFilterChange = function (filterId, group) {
  if (group === "indicador" || group === "ind") {
    filtrosCorte.indicador = filterId;
    atualizarDashboardCorte();
  }
};

window.onTabChange = function () {
  requestAnimationFrame(renderizarAbaAtivaCorte);
};

const API_CORTE = "https://api.projetocerradoifg.org/webhook/corte";
const UFS_REBANHO_CORTE = ["Brasil", "Mato Grosso", "Goiás", "Pará", "Minas Gerais", "Mato Grosso do Sul"];
const ALVOS_API_CORTE = Object.freeze({
  rebanho: ["chartRebanhoCorte", "chartRebanhoPartic", "tabelaRebanhoCorte"],
  abate: ["chartAbateBovinos", "tabelaAbateCorte"]
});
async function buscarEndpointCorte(nome) {
  if (window.simularErroApi) throw new Error("Falha simulada para teste da interface.");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const resposta = await fetch(`${API_CORTE}/${nome}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!resposta.ok) throw new Error(`${nome}: HTTP ${resposta.status}`);
    const dados = await resposta.json();
    if (!Array.isArray(dados) || !dados.length) throw new Error(`${nome}: resposta vazia`);
    return dados;
  } finally {
    window.clearTimeout(timeout);
  }
}

function montarRebanhoLargo(linhas) {
  return UFS_REBANHO_CORTE.map(uf => {
    const item = { uf };
    linhas.filter(linha => linha.uf === uf).forEach(linha => {
      if (Number.isFinite(Number(linha.quantidadeCabecas))) item[String(linha.ano)] = Number(linha.quantidadeCabecas);
    });
    return item;
  }).filter(item => Object.keys(item).length > 1);
}

function anoAbateCompleto(ano, ufs) {
  return ufs.every(uf => new Set(
    DADOS_CORTE.abateBovinos
      .filter(item => item.uf === uf && item.ano === ano)
      .map(item => item.trimestre)
  ).size === 4);
}

const numeroMiCorte = valor => (Number(valor) / 1_000_000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const percentualCorte = valor => `${valor >= 0 ? "+" : ""}${valor.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

function preencherKpiCorte(id, rotulo, valor, badge, tone = "neutral") {
  window.atualizarKpiComApi(id, {
    label: rotulo,
    value: numeroMiCorte(valor),
    unit: "mi cab.",
    badge,
    tone
  });
}

function atualizarRebanhoCorte() {
  const rebanho = DADOS_CORTE.rebanhoCorte;
  const anos = anosDeObjetoSerie(rebanho);
  const primeiro = anos[0];
  const ultimo = anos.at(-1);
  const porUf = uf => rebanho.find(item => item.uf === uf);
  if (!primeiro || !ultimo || !porUf("Brasil") || !porUf("Goiás")) return;

  [["Brasil", "kpiCorteRebanhoBrasil"], ["Goiás", "kpiCorteRebanhoGoias"]].forEach(([uf, id]) => {
    const variacao = (porUf(uf)[String(ultimo)] / porUf(uf)[String(primeiro)] - 1) * 100;
    preencherKpiCorte(id, `Rebanho ${uf} ${ultimo}`, porUf(uf)[String(ultimo)],
      `${variacao >= 0 ? "▲" : "▼"} ${percentualCorte(variacao)} desde ${primeiro}`, variacao >= 0 ? "up" : "down");
  });

  const tabela = document.querySelector("#tabelaRebanhoCorte table");
  if (tabela) {
    const meio = anos[Math.floor((anos.length - 1) / 2)];
    const colunas = [primeiro, meio, ultimo];
    tabela.querySelectorAll("thead th").forEach((th, indice) => {
      if (indice > 0 && indice < 4) th.textContent = String(colunas[indice - 1]);
    });
    const ordem = ["Brasil", "Mato Grosso", "Goiás", "Minas Gerais", "Pará", "Mato Grosso do Sul"];
    tabela.querySelector("tbody").innerHTML = ordem.filter(porUf).map(uf => {
      const variacao = (porUf(uf)[String(ultimo)] / porUf(uf)[String(primeiro)] - 1) * 100;
      return `<tr><td>${uf === "Brasil" ? `<strong>${uf}</strong>` : uf}</td>${colunas.map(ano => `<td class="text-end num">${numeroMiCorte(porUf(uf)[String(ano)])}</td>`).join("")}<td class="text-end"><span class="kpi-badge ${variacao >= 0 ? "kpi-badge--up" : "kpi-badge--down"}">${percentualCorte(variacao)}</span></td></tr>`;
    }).join("");
    document.querySelector("#tabelaRebanhoCorte .chart-card__sub").textContent = `Milhões de cabeças (${primeiro}–${ultimo})`;
  }
}

function atualizarAbateCorte() {
  const ufs = ["Brasil", "Goiás", "Mato Grosso", "Mato Grosso do Sul"];
  const anos = [...new Set(DADOS_CORTE.abateBovinos.map(item => item.ano))]
    .sort((a, b) => a - b).filter(ano => anoAbateCompleto(ano, ufs));
  const atual = anos.at(-1);
  const anterior = anos.at(-2);
  const total = (uf, ano) => DADOS_CORTE.abateBovinos
    .filter(item => item.uf === uf && item.ano === ano)
    .reduce((soma, item) => soma + Number(item.quantidadeAbatida || 0), 0);
  if (!atual) return;
  const brasil = total("Brasil", atual);
  const variacao = anterior ? (brasil / total("Brasil", anterior) - 1) * 100 : null;
  preencherKpiCorte("kpiCorteAbateBrasil", `Abate Brasil ${atual}`, brasil,
    variacao === null ? "Série disponível" : `${variacao >= 0 ? "↗" : "↘"} ${percentualCorte(variacao)} vs ${anterior}`);
  preencherKpiCorte("kpiCorteAbateGoias", `Abate Goiás ${atual}`, total("Goiás", atual), `${Math.round(total("Goiás", atual) / brasil * 100)}% do Brasil`);

  const tabela = document.querySelector("#tabelaAbateCorte table");
  if (tabela) {
    const exibidos = anos.filter((_ano, indice) => indice % 2 === 0);
    if (exibidos.at(-1) !== atual) exibidos.push(atual);
    tabela.querySelector("tbody").innerHTML = exibidos.map(ano =>
      `<tr><td>${ano}</td>${ufs.map(uf => `<td class="text-end num">${numeroMiCorte(total(uf, ano))}</td>`).join("")}</tr>`
    ).join("");
    document.querySelector("#tabelaAbateCorte .chart-card__sub").textContent = `Milhões de cabeças (${anos[0]}–${atual})`;
  }
}

async function carregarDadosCorte() {
  Object.values(ALVOS_API_CORTE).flat().forEach(id => window.dashboardDataUi.definirEstado([id], "loading"));
  ["kpiCorteRebanhoBrasil", "kpiCorteRebanhoGoias", "kpiCorteAbateBrasil", "kpiCorteAbateGoias"].forEach(id => {
    document.getElementById(id)?.setAttribute("aria-busy", "true");
  });
  DADOS_CORTE.rebanhoCorte = [];
  DADOS_CORTE.abateBovinos = [];

  const nomes = Object.keys(ALVOS_API_CORTE);
  const resultados = await Promise.allSettled(nomes.map(buscarEndpointCorte));
  resultados.forEach((resultado, indice) => {
    const nome = nomes[indice];
    if (resultado.status === "fulfilled") {
      if (nome === "rebanho") {
        DADOS_CORTE.rebanhoCorte = montarRebanhoLargo(resultado.value);
        atualizarRebanhoCorte();
      } else {
        DADOS_CORTE.abateBovinos = resultado.value;
        atualizarAbateCorte();
      }
      window.dashboardDataUi.definirEstado(ALVOS_API_CORTE[nome], "ready");
      window.dashboardDataUi.marcarFonte(ALVOS_API_CORTE[nome], nome === "rebanho" ? "IBGE — PPM" : "IBGE — PTA");
    } else {
      const kpis = nome === "rebanho" ? ["kpiCorteRebanhoBrasil", "kpiCorteRebanhoGoias"] : ["kpiCorteAbateBrasil", "kpiCorteAbateGoias"];
      kpis.forEach(id => window.atualizarKpiComApi(id, { state: "error" }));
      window.dashboardDataUi.definirEstado(ALVOS_API_CORTE[nome], "error", "Não foi possível carregar os dados.");
      console.error(`Falha ao carregar dados de corte (${nome}):`, resultado.reason);
    }
  });
}

carregarDadosCorte().finally(() => am5.ready(inicializarGraficosCorte));
