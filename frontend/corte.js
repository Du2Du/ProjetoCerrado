/**
 * Dashboard da pecuária de corte.
 *
 * Fluxo principal:
 * 1. `carregarDadosCorte` busca rebanho e abate em paralelo.
 * 2. As respostas são normalizadas e armazenadas em `DADOS_CORTE`.
 * 3. Após as requisições, `inicializarGraficosCorte` configura filtros e gráficos.
 * 4. Cada interação altera `filtrosCorte` e chama `atualizarDashboardCorte`.
 */
const PALETA_CORTE = ["#8b3a1a", "#c8943a", "#4a7c3f", "#6fa65e", "#2d5c24", "#d4843a", "#a0622b", "#e8a84c", "#5c4033", "#3a6b4a"];

const DADOS_CORTE = {
  rebanhoCorte: [],
  abateBovinos: []
};

const rootsGraficosCorte = new Map();

// Fonte única dos filtros. A interface é sempre redesenhada a partir deste objeto.
const filtrosCorte = {
  indicador: "all",
  anoInicio: null,
  anoFim: null,
  ufs: new Set(),
  trimestre: "all",
  metricaAbate: "quantidade"
};

const indicadorParaAbaCorte = {
  rebanho: "ct-rebanho",
  abate: "ct-rebanho",
  pastagens: "ct-pastagens"
};

// Atalho de consulta ao DOM usado para manter as funções de renderização compactas.
function porId(id) { return document.getElementById(id); }
// Converte valores absolutos de cabeças para a unidade exibida nos gráficos.
function formatarMilhoes(valor) { return Math.round((valor / 1000000) * 100) / 100; }
// Produz o texto padronizado do intervalo selecionado.
function periodoLabel() { return filtrosCorte.anoInicio ? `${filtrosCorte.anoInicio}–${filtrosCorte.anoFim}` : "sem período"; }
// Informa se um ano pertence ao intervalo atualmente selecionado.
function dentroPeriodo(ano) { return Number(ano) >= filtrosCorte.anoInicio && Number(ano) <= filtrosCorte.anoFim; }
// Normaliza nomes completos e siglas para a mesma chave de filtro.
// Atualiza um texto somente quando o elemento existe na página atual.
function atualizarTexto(id, texto) { const el = porId(id); if (el) el.textContent = texto; }

// Libera o gráfico anterior e cria uma nova raiz no container informado.
function criarRoot(id) {
  // Um root do amCharts só pode ocupar o container uma vez; descarte o anterior
  // antes de recriar o gráfico para evitar referências e eventos duplicados.
  limparGrafico(id);
  const root = am5.Root.new(id);
  root.setThemes([am5themes_Animated.new(root)]);
  rootsGraficosCorte.set(id, root);
  return root;
}

// Descarta recursos e conteúdo DOM associados a um gráfico existente.
function limparGrafico(id) {
  const root = rootsGraficosCorte.get(id);
  if (root) root.dispose();
  rootsGraficosCorte.delete(id);
  const el = porId(id);
  if (el) el.innerHTML = "";
}

// Substitui um gráfico sem conteúdo por uma mensagem de estado vazio.
function mostrarSemDadosChart(id, mensagem = "Sem dados para os filtros selecionados.") {
  limparGrafico(id);
  const el = porId(id);
  if (!el) return;
  el.innerHTML = `<div class="filter-empty d-block h-100 d-flex align-items-center justify-content-center text-center">${mensagem}</div>`;
}

// Aplica tipografia e cor comuns aos eixos do dashboard.
function configurarEixo(axis) {
  axis.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif", fill: am5.color("#5a5a5a") });
}

// Cria uma legenda centralizada e devolve sua referência para receber as séries.
function criarLegenda(chart, root) {
  const legend = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  legend.labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif" });
  return legend;
}

// Descobre dinamicamente os anos armazenados como propriedades dos registros.
function anosDeObjetoSerie(dados) {
  return [...new Set(dados.flatMap(item => Object.keys(item).filter(chave => /^\d{4}$/.test(chave)).map(Number)))].sort((a, b) => a - b);
}

// Une os anos existentes nas duas fontes para preencher os selects de período.
function anosDisponiveisCorte() {
  const anos = new Set();
  if (filtrosCorte.indicador === "all" || filtrosCorte.indicador === "rebanho") {
    anosDeObjetoSerie(DADOS_CORTE.rebanhoCorte).forEach(ano => anos.add(ano));
  }
  if (filtrosCorte.indicador === "all" || filtrosCorte.indicador === "abate") {
    anosDeObjetoSerie(seriesAbateCorte(filtrosCorte.trimestre, campoAbateCorte(), false))
      .forEach(ano => anos.add(ano));
  }
  return [...anos].sort((a, b) => a - b);
}

// Transpõe registros por UF para linhas anuais consumidas pelo amCharts.
function dadosSeriePorAno(dados, campoNome, anos, transformador = valor => valor) {
  return anos.map(ano => {
    const linha = { ano: String(ano) };
    dados.forEach(item => {
      if (Number.isFinite(item[ano])) linha[item[campoNome]] = transformador(item[ano]);
    });
    return linha;
  });
}

// Monta um gráfico de linhas genérico e ignora séries totalmente vazias.
function criarLinhas(id, dados, campoCategoria, series, sufixo = "") {
  const seriesValidas = series.filter(nome => dados.some(item => Number.isFinite(item[nome])));
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

// Monta o gráfico de participação usando somente fatias com valor positivo.
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

// Renderiza evolução do rebanho e participação estadual para o período ativo.
function criarGraficoRebanho() {
  // Converte a resposta "larga" (um campo para cada ano) no formato esperado
  // pelas séries do amCharts e usa o último ano na pizza de participação.
  const dadosBase = DADOS_CORTE.rebanhoCorte.filter(item => ufSelecionadaCorte(item.uf));
  const anos = anosDeObjetoSerie(dadosBase).filter(dentroPeriodo);
  const estados = dadosBase.map(item => item.uf);
  atualizarTexto("subRebanhoCorte", `Milhões de cabeças (${periodoLabel()})`);
  if (!anos.length) {
    atualizarTexto("tituloRebanhoPartic", "Participação no Rebanho das UFs Exibidas");
    mostrarSemDadosChart("chartRebanhoCorte");
    mostrarSemDadosChart("chartRebanhoPartic");
    return;
  }
  criarLinhas("chartRebanhoCorte", dadosSeriePorAno(dadosBase, "uf", anos, formatarMilhoes), "ano", estados, " mi cab.");

  const anoFinal = Math.max(...anos);
  atualizarTexto("tituloRebanhoPartic", `Participação no Rebanho das UFs Exibidas (${anoFinal || filtrosCorte.anoFim})`);
  criarPizza("chartRebanhoPartic", dadosBase.filter(item => !["Brasil", "Centro-Oeste"].includes(item.uf) && item[String(anoFinal)]).map(item => ({ uf: item.uf, quantidadeCabecas: item[String(anoFinal)] })), "uf", "quantidadeCabecas");
}

// Agrega os registros trimestrais de abate segundo a métrica selecionada.
function criarGraficoAbate() {
  // Quando todos os trimestres estão selecionados, anos incompletos são omitidos
  // para que a comparação anual não misture totais parciais com totais fechados.
  const series = seriesAbateCorte(filtrosCorte.trimestre, campoAbateCorte());
  const ufs = series.filter(item => ufSelecionadaCorte(item.uf)).map(item => item.uf);
  const dados = series.filter(item => ufs.includes(item.uf));
  const anos = anosDeObjetoSerie(dados);
  const acumulado = dadosSeriePorAno(dados, "uf", anos, formatarMilhoes);
  const sufixo = filtrosCorte.metricaAbate === "peso" ? " mil t" : " mi cab.";
  const trimestre = filtrosCorte.trimestre === "all" ? "todos os trimestres" : `${filtrosCorte.trimestre} trimestre`;
  atualizarTexto("subAbateBovinos", `${filtrosCorte.metricaAbate === "peso" ? "Peso total das carcaças" : "Cabeças abatidas"} · ${trimestre} · ${periodoLabel()}`);
  criarLinhas("chartAbateBovinos", acumulado, "ano", ufs, sufixo);
}

function ufSelecionadaCorte(uf) {
  return !filtrosCorte.ufs.size || filtrosCorte.ufs.has(codigoUfPainel(uf));
}

function campoAbateCorte() {
  return filtrosCorte.metricaAbate === "peso" ? "pesoTotalCarcacas" : "quantidadeAbatida";
}

function seriesAbateCorte(trimestre, campo, limitarPeriodo = true) {
  const porUf = new Map();
  for (const item of DADOS_CORTE.abateBovinos) {
    if ((limitarPeriodo && !dentroPeriodo(item.ano)) || !temMedicao(item[campo])) continue;
    if (trimestre !== "all" && item.trimestre !== trimestre) continue;
    if (!porUf.has(item.uf)) porUf.set(item.uf, new Map());
    const anos = porUf.get(item.uf);
    if (!anos.has(item.ano)) anos.set(item.ano, new Map());
    anos.get(item.ano).set(item.trimestre, Number(item[campo]));
  }
  return [...porUf].map(([uf, anos]) => {
    const linha = { uf };
    for (const [ano, trimestres] of anos) {
      if (trimestre !== "all" || trimestres.size === 4) {
        linha[ano] = [...trimestres.values()].reduce((total, valor) => total + valor, 0);
      }
    }
    return linha;
  }).filter(item => Object.keys(item).length > 1);
}

function valoresUfsCorte() {
  const { indicador } = filtrosCorte;
  const rebanho = indicador === "all" || indicador === "rebanho"
    ? DADOS_CORTE.rebanhoCorte : [];
  const abate = indicador === "all" || indicador === "abate"
    ? DADOS_CORTE.abateBovinos : [];
  return [...new Set([...rebanho, ...abate].map(item => codigoUfPainel(item.uf)))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

// Resume uma seleção múltipla no texto curto exibido pelo botão do dropdown.
function labelSelecao(set, total, todosLabel) {
  if (!set.size || set.size === total) return todosLabel;
  if (set.size === 1) return [...set][0];
  return `${set.size} selecionados`;
}

// Reconstrói um dropdown pesquisável e conecta cada checkbox ao estado central.
function renderizarMultiselect({ menuId, buscaId, botaoId, valores, selecionados, todosLabel, label = v => v, onChange }) {
  const menu = porId(menuId);
  const busca = porId(buscaId);
  const botao = porId(botaoId);
  if (!menu || !botao) return;
  const termo = (busca?.value || "").toLocaleLowerCase("pt-BR");
  const visiveis = valores.filter(valor => label(valor).toLocaleLowerCase("pt-BR").includes(termo));
  botao.textContent = labelSelecao(selecionados, valores.length, todosLabel);
  menu.replaceChildren(...visiveis.map(valor => {
    const opcao = document.createElement("label");
    opcao.className = "filter-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = valor;
    input.checked = selecionados.has(valor);
    const texto = document.createElement("span");
    texto.textContent = label(valor);
    opcao.append(input, texto);
    return opcao;
  }));
  if (!visiveis.length) menu.textContent = "Nenhum resultado";
  menu.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) selecionados.add(input.value); else selecionados.delete(input.value);
      onChange?.();
      atualizarDashboardCorte();
    });
  });
}

// Configura o multiselect de UF com os valores derivados das respostas da API.
function renderizarFiltrosMultiselect() {
  const valores = valoresUfsCorte();
  filtrosCorte.ufs = new Set([...filtrosCorte.ufs].filter(uf => valores.includes(uf)));
  porId("filtroUfCorteBtn").disabled = !valores.length;
  renderizarMultiselect({
    menuId: "filtroUfCorteMenu",
    buscaId: "buscaUfCorte",
    botaoId: "filtroUfCorteBtn",
    valores,
    selecionados: filtrosCorte.ufs,
    todosLabel: "Todas"
  });
}

// Mantém o período escolhido quando ele ainda existe no indicador ativo.
function sincronizarAnosCorte() {
  const anos = anosDisponiveisCorte();
  const noIntervalo = anos.filter(dentroPeriodo);
  filtrosCorte.anoInicio = noIntervalo[0] ?? anos[0] ?? null;
  filtrosCorte.anoFim = noIntervalo.at(-1) ?? anos.at(-1) ?? null;
  ["filtroAnoInicioCorte", "filtroAnoFimCorte"].forEach((id, indice) => {
    const select = porId(id);
    select.innerHTML = anos.map(ano => `<option value="${ano}">${ano}</option>`).join("");
    select.disabled = !anos.length;
    select.value = indice === 0 ? filtrosCorte.anoInicio : filtrosCorte.anoFim;
  });
}

// Materializa os filtros ativos em chips de leitura rápida.
function atualizarChipsFiltros() {
  const el = porId("filtrosAtivosCorte");
  if (!el) return;
  const chips = [];
  if (filtrosCorte.anoInicio) chips.push(`Período: ${periodoLabel()}`);
  if (filtrosCorte.indicador !== "all") chips.push(`Indicador: ${filtrosCorte.indicador}`);
  if (filtrosCorte.ufs.size) chips.push(`UF: ${[...filtrosCorte.ufs].join(", ")}`);
  if (filtrosCorte.indicador !== "rebanho" && filtrosCorte.trimestre !== "all") {
    chips.push(`Trimestre do abate: ${filtrosCorte.trimestre}`);
  }
  el.innerHTML = chips.map(chip => `<span class="filter-chip">${chip}</span>`).join("");
}

// Exibe somente os cards compatíveis com o indicador selecionado.
function atualizarVisibilidadeIndicador() {
  document.querySelectorAll('[data-filter-group="indicador"] .filter-btn').forEach(btn => btn.classList.toggle("active", btn.dataset.filter === filtrosCorte.indicador));
  document.querySelectorAll("[data-category]").forEach(el => {
    el.classList.toggle("is-filter-hidden", filtrosCorte.indicador !== "all" && el.dataset.category !== filtrosCorte.indicador);
  });
}

// Reaproveita o sistema de abas compartilhado disparando o botão correspondente.
function switchTabCorte(id) {
  const btn = document.querySelector(`[data-tab="${id}"]`);
  if (btn) btn.click();
}

// Redesenha apenas os gráficos pertencentes à aba que está visível.
function renderizarAbaAtivaCorte() {
  const activeTab = document.querySelector("[data-tab-content].active");
  const tabId = activeTab?.id || "ct-rebanho";
  if (tabId === "ct-rebanho") {
    criarGraficoRebanho();
    criarGraficoAbate();
  }
}

// Sincroniza período, gráficos visíveis, multiselects e resumo dos filtros.
function atualizarDashboardCorte() {
  const abaDados = document.querySelector("[data-tab-content].active")?.id === "ct-rebanho";
  ["filtroAnoInicioCorte", "filtroUfCorteBtn"].forEach(id => {
    porId(id)?.closest(".filter-cluster").classList.toggle("is-filter-hidden", !abaDados);
  });
  porId("filtroTrimestreCorte")?.closest(".filter-cluster").classList
    .toggle("is-filter-hidden", !abaDados || filtrosCorte.indicador === "rebanho");
  porId("filtrosAtivosCorte").classList.toggle("is-filter-hidden", !abaDados);
  atualizarVisibilidadeIndicador();
  if (!abaDados) return;

  // Centraliza toda atualização visual: corrige o período, redesenha a aba
  // visível e sincroniza os controles e o resumo dos filtros.
  if (filtrosCorte.anoInicio !== null && filtrosCorte.anoFim !== null && filtrosCorte.anoInicio > filtrosCorte.anoFim) {
    [filtrosCorte.anoInicio, filtrosCorte.anoFim] = [filtrosCorte.anoFim, filtrosCorte.anoInicio];
    porId("filtroAnoInicioCorte").value = filtrosCorte.anoInicio;
    porId("filtroAnoFimCorte").value = filtrosCorte.anoFim;
  }
  sincronizarAnosCorte();
  renderizarFiltrosMultiselect();
  atualizarRebanhoCorte();
  atualizarAbateCorte();
  renderizarAbaAtivaCorte();
  atualizarChipsFiltros();
}

// Restaura o estado inicial dos filtros e solicita uma renderização completa.
function limparFiltrosCorte() {
  filtrosCorte.indicador = "all";
  filtrosCorte.anoInicio = null;
  filtrosCorte.anoFim = null;
  filtrosCorte.ufs.clear();
  filtrosCorte.trimestre = "all";
  filtrosCorte.metricaAbate = "quantidade";
  porId("filtroTrimestreCorte").value = "all";
  porId("filtroMetricaAbate").value = "quantidade";
  const buscaUf = porId("buscaUfCorte");
  if (buscaUf) buscaUf.value = "";
  atualizarDashboardCorte();
}

// Conecta controles de filtro às respectivas propriedades de `filtrosCorte`.
function configurarEventosFiltrosCorte() {
  porId("filtroAnoInicioCorte")?.addEventListener("change", event => { filtrosCorte.anoInicio = Number(event.target.value); atualizarDashboardCorte(); });
  porId("filtroAnoFimCorte")?.addEventListener("change", event => { filtrosCorte.anoFim = Number(event.target.value); atualizarDashboardCorte(); });
  porId("filtroTrimestreCorte")?.addEventListener("change", event => { filtrosCorte.trimestre = event.target.value; atualizarDashboardCorte(); });
  porId("filtroMetricaAbate")?.addEventListener("change", event => { filtrosCorte.metricaAbate = event.target.value; atualizarDashboardCorte(); });
  porId("btnLimparFiltrosCorte")?.addEventListener("click", limparFiltrosCorte);
  porId("buscaUfCorte")?.addEventListener("input", renderizarFiltrosMultiselect);
}

// Prepara filtros e dispara a primeira renderização após a carga dos dados.
function inicializarGraficosCorte() {
  configurarEventosFiltrosCorte();
  atualizarDashboardCorte();
}

window.onFilterChange = function (filterId, group) {
  if (group !== "indicador") return;
  filtrosCorte.indicador = filterId;
  const aba = indicadorParaAbaCorte[filterId] || "ct-rebanho";
  if (document.getElementById(aba)?.classList.contains("active")) atualizarDashboardCorte();
  else switchTabCorte(aba);
};

window.onTabChange = function (aba) {
  if (aba === "ct-pastagens") filtrosCorte.indicador = "pastagens";
  else if (aba !== "ct-rebanho" || filtrosCorte.indicador === "pastagens") filtrosCorte.indicador = "all";
  atualizarDashboardCorte();
};

const API_CORTE = "https://api.projetocerradoifg.org/webhook/corte";
const ALVOS_API_CORTE = Object.freeze({
  rebanho: ["chartRebanhoCorte", "chartRebanhoPartic", "tabelaRebanhoCorte"],
  abate: ["chartAbateBovinos", "tabelaAbateCorte"]
});
// Busca e valida um conjunto da API de corte com limite de espera.
async function buscarEndpointCorte(nome) {
  // O timeout impede que o dashboard permaneça indefinidamente em "Carregando".
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

// Converte as localidades presentes na resposta em séries anuais.
function montarRebanhoLargo(linhas) {
  const series = new Map();
  for (const linha of linhas) {
    if (!linha.uf || !/^\d{4}$/.test(linha.ano) || !temMedicao(linha.quantidadeCabecas)) continue;
    if (!series.has(linha.uf)) series.set(linha.uf, { uf: linha.uf });
    series.get(linha.uf)[linha.ano] = Number(linha.quantidadeCabecas);
  }
  return [...series.values()];
}

const numeroMiCorte = valor => (Number(valor) / 1_000_000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const percentualCorte = valor => `${valor >= 0 ? "+" : ""}${valor.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

// Encaminha valores de corte ao componente compartilhado de KPI.
function preencherKpiCorte(id, rotulo, valor, badge, tone = "neutral") {
  window.atualizarKpiComApi(id, {
    label: rotulo,
    value: numeroMiCorte(valor),
    unit: "mi cab.",
    badge,
    tone
  });
}

function atualizarKpiSerieCorte(id, titulo, serie, sufixo = "", compararCobertura = false) {
  const anos = anosDeObjetoSerie([serie]).filter(dentroPeriodo);
  const atual = anos.at(-1);
  if (!atual) {
    window.atualizarKpiComApi(id, { label: titulo, state: "error" });
    return;
  }
  const inicial = anos[0];
  const cobertura = serie.cobertura?.[atual];
  const coberturaConstante = !compararCobertura || serie.cobertura?.[inicial] === cobertura;
  const variacao = inicial !== atual && serie[inicial] > 0 && coberturaConstante
    ? `${percentualCorte((serie[atual] / serie[inicial] - 1) * 100)} desde ${inicial}` : "";
  const badge = [cobertura, variacao].filter(Boolean).join(" · ") || "Série disponível";
  preencherKpiCorte(id, `${titulo} ${atual}${sufixo}`, serie[atual], badge);
}

function serieRecorteCorte(series) {
  const selecionadas = [...filtrosCorte.ufs];
  const oficial = series.find(item => item.uf === "Centro-Oeste");
  if (!selecionadas.length && oficial) return oficial;
  if (selecionadas.length === 1) {
    return series.find(item => ufSelecionadaCorte(item.uf)) || { uf: selecionadas[0] };
  }

  const regional = !selecionadas.length;
  const localidades = series.filter(item => regional ? localidadeCentroOeste(item.uf)
    : !["Brasil", "Centro-Oeste"].includes(item.uf) && ufSelecionadaCorte(item.uf));
  const resumo = { uf: regional ? "Centro-Oeste" : "UFs selecionadas", cobertura: {} };
  anosDeObjetoSerie(localidades).forEach(ano => {
    const fontes = localidades.filter(item => Number.isFinite(item[ano]));
    if (!regional && fontes.length !== selecionadas.length) return;
    resumo[ano] = fontes.reduce((total, item) => total + item[ano], 0);
    if (regional) resumo.cobertura[ano] = fontes.map(item => codigoUfPainel(item.uf)).sort().join(", ");
  });
  return resumo;
}

function atualizarRebanhoCorte() {
  const series = DADOS_CORTE.rebanhoCorte;
  atualizarKpiSerieCorte("kpiCorteRebanhoBrasil", "Rebanho Brasil", series.find(item => item.uf === "Brasil") || {});
  const recorte = serieRecorteCorte(series);
  atualizarKpiSerieCorte("kpiCorteRebanhoRecorte", `Rebanho ${recorte.uf}`, recorte, "", true);

  const tabela = document.querySelector("#tabelaRebanhoCorte table");
  if (!tabela) return;
  const dados = series.filter(uf => ufSelecionadaCorte(uf.uf));
  const anos = anosDeObjetoSerie(dados).filter(dentroPeriodo);
  const primeiro = anos[0];
  const ultimo = anos.at(-1);
  const colunas = [primeiro, anos[Math.floor((anos.length - 1) / 2)], ultimo];
  tabela.querySelectorAll("thead th").forEach((th, indice) => {
    if (indice > 0 && indice < 4) th.textContent = colunas[indice - 1] || "—";
  });
  const tbody = tabela.querySelector("tbody");
  tbody.replaceChildren();
  dados.filter(item => anos.some(ano => Number.isFinite(item[ano]))).forEach(item => {
    const variacao = item[primeiro] > 0 && Number.isFinite(item[ultimo]) && primeiro !== ultimo
      ? percentualCorte((item[ultimo] / item[primeiro] - 1) * 100) : "—";
    const linha = tbody.insertRow();
    linha.insertCell().textContent = item.uf;
    [...colunas.map(ano => Number.isFinite(item[ano]) ? numeroMiCorte(item[ano]) : "—"), variacao].forEach(valor => {
      const celula = linha.insertCell();
      celula.className = "text-end num";
      celula.textContent = valor;
    });
  });
}

function atualizarAbateCorte() {
  const trimestre = filtrosCorte.trimestre;
  const series = seriesAbateCorte(trimestre, "quantidadeAbatida");
  const sufixo = trimestre === "all" ? "" : ` · ${trimestre} trimestre`;
  atualizarTexto("subTabelaAbateCorte", trimestre === "all" ? "Milhões de cabeças · totais anuais" : `Milhões de cabeças · ${trimestre} trimestre`);
  atualizarKpiSerieCorte("kpiCorteAbateBrasil", "Abate Brasil", series.find(item => item.uf === "Brasil") || {}, sufixo);
  const recorte = serieRecorteCorte(series);
  atualizarKpiSerieCorte("kpiCorteAbateRecorte", `Abate ${recorte.uf}`, recorte, sufixo, true);

  const tabela = document.querySelector("#tabelaAbateCorte table");
  if (!tabela) return;
  const dados = series.filter(item => ufSelecionadaCorte(item.uf));
  const anos = anosDeObjetoSerie(dados);
  const exibidos = anos.filter((_ano, indice) => indice % 2 === 0);
  if (anos.length && exibidos.at(-1) !== anos.at(-1)) exibidos.push(anos.at(-1));
  const cabecalho = tabela.querySelector("thead tr");
  cabecalho.replaceChildren(cabecalho.firstElementChild);
  dados.forEach(item => {
    const th = document.createElement("th");
    th.scope = "col";
    th.className = "text-end";
    th.textContent = item.uf;
    cabecalho.append(th);
  });
  const tbody = tabela.querySelector("tbody");
  tbody.replaceChildren();
  exibidos.forEach(ano => {
    const linha = tbody.insertRow();
    linha.insertCell().textContent = ano;
    dados.forEach(item => {
      const celula = linha.insertCell();
      celula.className = "text-end num";
      celula.textContent = Number.isFinite(item[ano]) ? numeroMiCorte(item[ano]) : "—";
    });
  });
}

async function carregarDadosCorte() {
  // `allSettled` mantém os blocos independentes: se um endpoint falhar, os dados
  // do outro continuam disponíveis e apenas os seus próprios alvos exibem erro.
  Object.values(ALVOS_API_CORTE).flat().forEach(id => window.dashboardDataUi.definirEstado([id], "loading"));
  ["kpiCorteRebanhoBrasil", "kpiCorteRebanhoRecorte", "kpiCorteAbateBrasil", "kpiCorteAbateRecorte"].forEach(id => {
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
      } else {
        DADOS_CORTE.abateBovinos = resultado.value.filter(item => item.uf && temMedicao(item.ano))
          .map(item => ({ ...item, ano: Number(item.ano) }));
      }
      window.dashboardDataUi.definirEstado(ALVOS_API_CORTE[nome], "ready");
      window.dashboardDataUi.marcarFonte(ALVOS_API_CORTE[nome], nome === "rebanho" ? "IBGE — PPM" : "IBGE — PTA");
    } else {
      const kpis = nome === "rebanho" ? ["kpiCorteRebanhoBrasil", "kpiCorteRebanhoRecorte"] : ["kpiCorteAbateBrasil", "kpiCorteAbateRecorte"];
      kpis.forEach(id => window.atualizarKpiComApi(id, { state: "error" }));
      window.dashboardDataUi.definirEstado(ALVOS_API_CORTE[nome], "error", "Não foi possível carregar os dados.");
      console.error(`Falha ao carregar dados de corte (${nome}):`, resultado.reason);
    }
  });
}

// Os gráficos só são criados depois da primeira tentativa de carga, inclusive
// quando há falha, para que os estados vazios/erro possam ser renderizados.
carregarDadosCorte().finally(() => am5.ready(inicializarGraficosCorte));
