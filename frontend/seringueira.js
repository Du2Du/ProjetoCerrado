const P = ["#2d5c24","#c8943a","#a0622b","#4a7c3f","#6fa65e","#e8a84c","#7fb069","#5c4033","#1a4a18","#d4a843"];

let anosSeringueira = [];
let ufsSeringueira  = [];
const coresUf = {
  "Centro-Oeste":       P[0],
  "Mato Grosso do Sul": P[1],
  "Mato Grosso":        P[2],
  "Goiás":              P[3]
};
const rootsSeringueira = [];

// ── ESTADO CENTRAL ───────────────────────────────────────────────────
const estadoFiltros = { anoInicio: null, anoFim: null, ufs: new Set(), produto: new Set() };
const graficosUF    = {};  // id → { eixoX, seriesMap:{uf→serie}, dados, campoValor }
const graficosFixos = {};  // id → { eixoX, seriesList, getDados } ou { isEstab, seriesMap }

// ── DADOS ────────────────────────────────────────────────────────────
let dadosProducao = [];
let dadosAreaColhida = [];
let dadosAreaDestinada = [];
let dadosAreaPerda = [];
let dadosProdutividade = [];
let dadosValorProducao = [];
let dadosEstabelecimentos = [];
let dadosIndicadores = [];

const API_SERINGUEIRA = "https://api.projetocerradoifg.org/webhook/seringueira";
const ENDPOINTS_SERINGUEIRA = ["pam", "censo"];
const VALORES_SIDRA_AUSENTES = new Set(["...", "..", "-", "X", ""]);
const requisicoesSeringueira = new Map();
const PRODUTO_BORRACHA = "Borracha (látex coagulado)";
const ORDEM_LOCALIDADES = ["Centro-Oeste", "Mato Grosso do Sul", "Mato Grosso", "Goiás"];
const ALVOS_API = Object.freeze({
  producao: ["chartProducaoSeringueira"],
  areas: ["chartAreaColhidaSeringueira", "chartAreaDestinadaSeringueira", "chartAreaPerdaSeringueira"],
  produtividade: ["chartProdutividadeSeringueira"],
  valor: ["chartValorProducaoSeringueira"],
  estabelecimentos: ["chartEstabelecimentosSeringueira"],
  indicadores: ["chartIndicadoresBorracha"]
});
const VISUALIZACOES_SEM_ENDPOINT = [
  "chartCustoBorracha", "chartMundo", "tabelaRankingMundial", "chartMundoPie", "chartCustoComp"
];
let periodoPadrao = { inicio: null, fim: null };

class ErroDadosVazios extends Error {}

function numeroSidra(valor) {
  const texto = String(valor ?? "").trim();
  if (VALORES_SIDRA_AUSENTES.has(texto)) return null;
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : null;
}

function ordenarAnos(anos) {
  return Array.from(new Set(anos.map(Number).filter(Number.isInteger))).sort((a, b) => a - b);
}

function periodoTexto(anos) {
  if (!anos.length) return "";
  return anos.length === 1 ? String(anos[0]) : `${anos[0]}–${anos.at(-1)}`;
}

function containerVisualizacao(id) {
  const elemento = document.getElementById(id);
  if (!elemento) return null;
  if (elemento.classList.contains("chart-card") || elemento.classList.contains("table-card")) return elemento;
  return elemento.closest(".chart-card, .table-card");
}

function definirEstadoVisualizacao(ids, estado, mensagem = "") {
  ids.forEach(id => {
    const container = containerVisualizacao(id);
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

function comentarVisualizacoesSemEndpoint() {
  VISUALIZACOES_SEM_ENDPOINT.forEach(id => {
    const container = containerVisualizacao(id);
    if (!container) return;
    const bloco = container.closest("[data-category]") || container.closest("[class*='col-']") || container;
    const titulo = container.querySelector(".chart-card__title")?.textContent.trim() || id;
    bloco.replaceWith(document.createComment(` Visualização comentada: ${titulo} — endpoint não documentado. `));
  });
}

async function buscarEndpointSeringueira(nome) {
  if (requisicoesSeringueira.has(nome)) return requisicoesSeringueira.get(nome);
  const requisicao = (async () => {
    if (window.simularErroApi) throw new Error("Falha simulada para teste da interface.");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const resposta = await fetch(`${API_SERINGUEIRA}/${nome}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!resposta.ok) throw new Error(`${nome}: HTTP ${resposta.status}`);
      const payload = await resposta.json();
      if (!Array.isArray(payload) || !payload.length) throw new ErroDadosVazios("O Servidor não retornou registros.");
      return payload;
    } finally {
      window.clearTimeout(timeout);
    }
  })();
  requisicoesSeringueira.set(nome, requisicao);
  return requisicao;
}

function validarLinhasSidra(linhas, { unidade, produto, variaveis } = {}) {
  if (!Array.isArray(linhas) || !linhas.length) throw new ErroDadosVazios("O Servidor não retornou registros.");
  if (unidade && linhas.some(linha => linha.MN !== unidade)) throw new Error(`Unidade inesperada no SIDRA: ${unidade}.`);
  if (produto && linhas.some(linha => linha.D4N !== produto)) throw new Error(`Produto inesperado no SIDRA: ${produto}.`);
  if (variaveis && linhas.some(linha => !variaveis.includes(linha.D2C))) throw new Error("Variável inesperada na resposta do Servidor.");
  const validas = linhas.filter(linha => numeroSidra(linha.V) !== null);
  if (!validas.length) throw new ErroDadosVazios("O Servidor não retornou valores válidos.");
  return validas;
}

function mapearSerieSidra(linhas, { campo, unidade, variavel }) {
  const validas = validarLinhasSidra(linhas, { unidade, produto: PRODUTO_BORRACHA, variaveis: [variavel] });
  return validas.map(linha => ({
    ano: Number(linha.D3N),
    uf: linha.D1N,
    produto: linha.D4N,
    unidadeMedida: linha.MN,
    [campo]: numeroSidra(linha.V)
  })).sort((a, b) => a.ano - b.ano || ORDEM_LOCALIDADES.indexOf(a.uf) - ORDEM_LOCALIDADES.indexOf(b.uf));
}

function mapearAreas(linhas) {
  validarLinhasSidra(linhas, { unidade: "Hectares", produto: PRODUTO_BORRACHA, variaveis: ["8331", "216"] });
  const colhida = mapearSerieSidra(linhas.filter(linha => linha.D2C === "216"), {
    campo: "areaColhidaHectares", unidade: "Hectares", variavel: "216"
  });
  const destinada = mapearSerieSidra(linhas.filter(linha => linha.D2C === "8331"), {
    campo: "areaDestinadaColheitaHectares", unidade: "Hectares", variavel: "8331"
  });
  const colhidaPorChave = new Map(colhida.map(item => [`${item.ano}|${item.uf}`, item.areaColhidaHectares]));
  const perda = destinada.map(item => {
    const areaColhida = colhidaPorChave.get(`${item.ano}|${item.uf}`);
    if (areaColhida === undefined || !item.areaDestinadaColheitaHectares) return null;
    return {
      ano: item.ano,
      uf: item.uf,
      produto: item.produto,
      unidadeMedida: "%",
      percentualPerdaArea: (item.areaDestinadaColheitaHectares - areaColhida) / item.areaDestinadaColheitaHectares * 100
    };
  }).filter(Boolean);
  if (!perda.length) throw new ErroDadosVazios("Não foi possível calcular a perda de área.");
  return { colhida, destinada, perda };
}

function mapearEstabelecimentos(linhas) {
  const validas = validarLinhasSidra(linhas, { unidade: "Unidades", variaveis: ["9504"] });
  const dados = validas.map(linha => ({
    ano: Number(linha.D3N),
    condicaoProdutor: linha.D5N,
    produto: linha.D4N,
    numeroEstabelecimentos: numeroSidra(linha.V)
  }));
  if (!dados.length) throw new ErroDadosVazios("O Servidor não retornou estabelecimentos válidos.");
  return dados;
}

function montarIndicadores() {
  const somenteCo = dados => new Map(dados.filter(item => item.uf === "Centro-Oeste").map(item => [item.ano, item]));
  const producao = somenteCo(dadosProducao);
  const destinada = somenteCo(dadosAreaDestinada);
  const colhida = somenteCo(dadosAreaColhida);
  const produtividade = somenteCo(dadosProdutividade);
  const anos = ordenarAnos([...producao.keys(), ...destinada.keys(), ...colhida.keys(), ...produtividade.keys()]);
  const indicadores = anos.map(ano => {
    const p = producao.get(ano);
    const d = destinada.get(ano);
    const c = colhida.get(ano);
    const r = produtividade.get(ano);
    if (!p || !d || !c || !r) return null;
    return {
      ano,
      producaoToneladas: p.quantidadeProduzidaToneladas,
      areaPlantadaHectares: d.areaDestinadaColheitaHectares,
      areaColhidaHectares: c.areaColhidaHectares,
      produtividadeKgPorHectare: r.produtividadeKgPorHectare
    };
  }).filter(Boolean);
  if (!indicadores.length) throw new ErroDadosVazios("Não foi possível combinar os indicadores produtivos.");
  return indicadores;
}

function atualizarTextoVisualizacao(id, { subtitulo, ariaLabel } = {}) {
  const container = containerVisualizacao(id);
  if (!container) return;
  if (subtitulo) container.querySelector(".chart-card__sub").textContent = subtitulo;
  if (ariaLabel) container.setAttribute("aria-label", ariaLabel);
}

function marcarFonteApi(ids) {
  ids.forEach(id => {
    const container = containerVisualizacao(id);
    if (!container || container.querySelector(".data-source-note--live")) return;
    const nota = document.createElement("div");
    nota.className = "data-source-note data-source-note--live";
    nota.textContent = "Fonte: SIDRA/IBGE";
    container.querySelector(".chart-card__sub")?.insertAdjacentElement("afterend", nota);
  });
}

function registrarFalhaApi(alvos, erro) {
  const semDados = erro instanceof ErroDadosVazios;
  definirEstadoVisualizacao(alvos, semDados ? "empty" : "error", semDados ? erro.message : "Não foi possível carregar os dados do Servidor.");
  console.error("Falha ao carregar dados de Seringueira:", erro);
}

function atualizarPeriodoDinamico() {
  anosSeringueira = ordenarAnos([
    ...dadosProducao.map(item => item.ano),
    ...dadosAreaColhida.map(item => item.ano),
    ...dadosProdutividade.map(item => item.ano),
    ...dadosValorProducao.map(item => item.ano)
  ]);
  ufsSeringueira = ORDEM_LOCALIDADES.filter(uf => [
    ...dadosProducao, ...dadosAreaColhida, ...dadosProdutividade, ...dadosValorProducao
  ].some(item => item.uf === uf));
  if (anosSeringueira.length) {
    periodoPadrao = { inicio: anosSeringueira[0], fim: anosSeringueira.at(-1) };
    estadoFiltros.anoInicio = periodoPadrao.inicio;
    estadoFiltros.anoFim = periodoPadrao.fim;
  }
}

function formatarNumeroKpi(valor, casas = 1) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  }).format(valor);
}

function variacaoKpiSeringueira(serie, campo) {
  const ordenada = [...serie].sort((a, b) => a.ano - b.ano);
  const inicial = ordenada[0];
  const atual = ordenada.at(-1);
  if (!inicial || !atual || !Number.isFinite(inicial[campo]) || inicial[campo] === 0) {
    return { badge: "Série disponível no SIDRA", tone: "neutral" };
  }
  const percentual = (atual[campo] - inicial[campo]) / inicial[campo] * 100;
  return {
    badge: `${percentual >= 0 ? "▲" : "▼"} ${percentual > 0 ? "+" : ""}${formatarNumeroKpi(percentual, 1)}% vs ${inicial.ano}`,
    tone: percentual >= 0 ? "up" : "down"
  };
}

function atualizarCardSerieSeringueira({ id, label, dados, campo, divisor = 1, casas = 1, prefixo = "", unidade }) {
  const serie = dados.filter(item => item.uf === "Centro-Oeste" && Number.isFinite(item[campo]));
  const atual = [...serie].sort((a, b) => a.ano - b.ano).at(-1);
  if (!atual) {
    window.atualizarKpiComApi(id, { label, state: "error" });
    return;
  }
  window.atualizarKpiComApi(id, {
    label: `${label} ${atual.ano}`,
    value: `${prefixo}${formatarNumeroKpi(atual[campo] / divisor, casas)}`,
    unit: unidade,
    ...variacaoKpiSeringueira(serie, campo)
  });
}

function atualizarCardsSeringueira() {
  atualizarCardSerieSeringueira({
    id: "kpiSeringueiraProducao", label: "Produção Centro-Oeste", dados: dadosProducao,
    campo: "quantidadeProduzidaToneladas", divisor: 1_000, casas: 1, unidade: "mil t"
  });
  atualizarCardSerieSeringueira({
    id: "kpiSeringueiraValor", label: "Valor da produção Centro-Oeste", dados: dadosValorProducao,
    campo: "valorProducaoMilReais", divisor: 1_000, casas: 1, prefixo: "R$ ", unidade: "mi"
  });
  atualizarCardSerieSeringueira({
    id: "kpiSeringueiraArea", label: "Área colhida Centro-Oeste", dados: dadosAreaColhida,
    campo: "areaColhidaHectares", divisor: 1_000, casas: 1, unidade: "mil ha"
  });
  atualizarCardSerieSeringueira({
    id: "kpiSeringueiraProdutividade", label: "Produtividade Centro-Oeste", dados: dadosProdutividade,
    campo: "produtividadeKgPorHectare", casas: 0, unidade: "kg/ha"
  });
}

async function carregarDadosApiSeringueira() {
  Object.values(ALVOS_API).flat().forEach(id => definirEstadoVisualizacao([id], "loading"));
  const nomes = ENDPOINTS_SERINGUEIRA;
  const resultados = await Promise.allSettled(nomes.map(buscarEndpointSeringueira));
  const resposta = Object.fromEntries(nomes.map((nome, indice) => [nome, resultados[indice]]));

  if (resposta.pam.status === "fulfilled") {
    try {
      const pam = resposta.pam.value;
      const mapear = (campoOrigem, campoDestino, unidadeMedida) => pam
        .filter(item => Number.isFinite(Number(item[campoOrigem])))
        .map(item => ({
          ano: Number(item.ano), uf: item.uf, produto: PRODUTO_BORRACHA,
          unidadeMedida, [campoDestino]: Number(item[campoOrigem])
        }));
      dadosProducao = mapear("producao", "quantidadeProduzidaToneladas", "Toneladas");
      dadosAreaColhida = mapear("areaColhida", "areaColhidaHectares", "Hectares");
      dadosAreaDestinada = mapear("areaDestinada", "areaDestinadaColheitaHectares", "Hectares");
      dadosProdutividade = mapear("rendimento", "produtividadeKgPorHectare", "Quilogramas por Hectare");
      dadosValorProducao = mapear("valor", "valorProducaoMilReais", "Mil Reais");
      dadosAreaPerda = pam.filter(item => Number(item.areaDestinada) > 0 && Number.isFinite(Number(item.areaColhida))).map(item => ({
        ano: Number(item.ano), uf: item.uf, produto: PRODUTO_BORRACHA, unidadeMedida: "%",
        percentualPerdaArea: Math.max(0, (Number(item.areaDestinada) - Number(item.areaColhida)) / Number(item.areaDestinada) * 100)
      }));
      dadosIndicadores = montarIndicadores();
      const alvosPam = [...ALVOS_API.producao, ...ALVOS_API.areas, ...ALVOS_API.produtividade, ...ALVOS_API.valor, ...ALVOS_API.indicadores];
      definirEstadoVisualizacao(alvosPam, "ready");
      marcarFonteApi(alvosPam);
      const periodo = periodoTexto(ordenarAnos(pam.map(item => item.ano)));
      atualizarTextoVisualizacao("chartProducaoSeringueira", { subtitulo: `Borracha (látex coagulado), toneladas (${periodo})` });
      atualizarTextoVisualizacao("chartAreaColhidaSeringueira", { subtitulo: `Hectares (${periodo})` });
      atualizarTextoVisualizacao("chartAreaDestinadaSeringueira", { subtitulo: `Hectares (${periodo})` });
      atualizarTextoVisualizacao("chartAreaPerdaSeringueira", { subtitulo: `Percentual da área destinada à colheita (${periodo})` });
      atualizarTextoVisualizacao("chartProdutividadeSeringueira", { subtitulo: `Quilogramas por hectare (${periodo})` });
      atualizarTextoVisualizacao("chartValorProducaoSeringueira", { subtitulo: `Mil reais (${periodo})` });
      atualizarTextoVisualizacao("chartIndicadoresBorracha", { subtitulo: `Produção, área e produtividade no Centro-Oeste (${periodo})` });
    } catch (erro) {
      [...ALVOS_API.producao, ...ALVOS_API.areas, ...ALVOS_API.produtividade, ...ALVOS_API.valor, ...ALVOS_API.indicadores]
        .forEach(id => registrarFalhaApi([id], erro));
    }
  } else {
    [...ALVOS_API.producao, ...ALVOS_API.areas, ...ALVOS_API.produtividade, ...ALVOS_API.valor, ...ALVOS_API.indicadores]
      .forEach(id => registrarFalhaApi([id], resposta.pam.reason));
  }

  if (resposta.censo.status === "fulfilled") {
    dadosEstabelecimentos = resposta.censo.value.map(item => ({
      ano: Number(item.ano), produto: item.produto, condicaoProdutor: item.condicaoProdutor,
      numeroEstabelecimentos: Number(item.numeroEstabelecimentos)
    }));
    definirEstadoVisualizacao(ALVOS_API.estabelecimentos, "ready");
    marcarFonteApi(ALVOS_API.estabelecimentos);
  } else {
    registrarFalhaApi(ALVOS_API.estabelecimentos, resposta.censo.reason);
  }
  atualizarPeriodoDinamico();
  atualizarCardsSeringueira();
}

const dadosCusto = anosSeringueira.map((ano, i) => ({
  ano,
  custoProducaoPorHectare: [3151.2,3307.99,3692.58,3905.03,4117.57,7941.73,7736.33,8388.31,8833.52,8873.64][i],
  custoProducaoPorKg:      [2.52,2.24,2.93,3.1,3.3,3.2,3.15,3.4,3.54,3.89][i]
}));

const dadosRankingMundial = [
  { pais:"Nigéria",   area:1.5,  isBrasil:false },
  { pais:"Colômbia",  area:1.6,  isBrasil:false },
  { pais:"Brasil",    area:1.7,  isBrasil:true  },
  { pais:"Índia",     area:1.9,  isBrasil:false },
  { pais:"China",     area:2.1,  isBrasil:false },
  { pais:"Malásia",   area:2.2,  isBrasil:false },
  { pais:"Vietnã",    area:4.2,  isBrasil:false },
  { pais:"Tailândia", area:5.2,  isBrasil:false },
  { pais:"Indonésia", area:12.5, isBrasil:false }
];

// ── FILTRO HELPERS ───────────────────────────────────────────────────
function anosVisiveis() {
  return anosSeringueira.filter(a => a >= estadoFiltros.anoInicio && a <= estadoFiltros.anoFim);
}

function buildDadosUF(dados, campoValor) {
  return anosVisiveis().map(ano => {
    const item = { ano: String(ano) };
    ufsSeringueira.forEach(uf => {
      const linha = dados.find(r => r.ano === ano && r.uf === uf);
      item[uf] = linha ? linha[campoValor] : null;
    });
    return item;
  });
}

// ── AMCHARTS HELPERS ─────────────────────────────────────────────────
function configurarEixo(eixo) {
  eixo.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif", fill: am5.color("#5a5a5a") });
}
function criarLegenda(chart, root) {
  const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  l.labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif" });
  return l;
}
function inicializarXY(containerId, opcoes = {}) {
  if (!document.getElementById(containerId)) return null;
  const root = am5.Root.new(containerId);
  root.setThemes([am5themes_Animated.new(root)]);
  root.numberFormatter.set("numberFormat", "#,###.##");
  rootsSeringueira.push(root);
  const chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false, panY: false,
    layout: opcoes.layoutVertical ? root.verticalLayout : undefined
  }));
  return { root, chart };
}

// ── CRIADORES DE GRÁFICO ─────────────────────────────────────────────
function criarGraficoLinhasUF(containerId, dados, campoValor, sufixoTooltip) {
  const ctx = inicializarXY(containerId, { layoutVertical: true });
  if (!ctx) return;
  const { root, chart } = ctx;
  const dadosGrafico = buildDadosUF(dados, campoValor);

  const eixoX = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "ano",
    renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
    tooltip: am5.Tooltip.new(root, {})
  }));
  const eixoY = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoX.data.setAll(dadosGrafico);

  const seriesMap = {};
  ufsSeringueira.forEach(uf => {
    const serie = chart.series.push(am5xy.LineSeries.new(root, {
      name: uf, xAxis: eixoX, yAxis: eixoY,
      valueYField: uf, categoryXField: "ano", connect: false,
      stroke: am5.color(coresUf[uf]), fill: am5.color(coresUf[uf]),
      tooltip: am5.Tooltip.new(root, { labelText: `${uf}: {valueY} ${sufixoTooltip}` })
    }));
    serie.strokes.template.setAll({ strokeWidth: uf === "Centro-Oeste" ? 3 : 2 });
    serie.bullets.push(() => am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, { radius: uf === "Centro-Oeste" ? 4 : 3, fill: serie.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 })
    }));
    serie.data.setAll(dadosGrafico);
    seriesMap[uf] = serie;
  });

  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(1000, 100);
  graficosUF[containerId] = { eixoX, seriesMap, dados, campoValor };
}

function criarGraficoEstabelecimentos() {
  const ctx = inicializarXY("chartEstabelecimentosSeringueira", { layoutVertical: true });
  if (!ctx) return;
  const { root, chart } = ctx;

  const buildDados = () => Object.values(
    dadosEstabelecimentos.reduce((acc, item) => {
      if (!acc[item.condicaoProdutor]) acc[item.condicaoProdutor] = { condicaoProdutor: item.condicaoProdutor, latexLiquido: 0, latexCoagulado: 0 };
      if (item.produto.includes("líquido"))   acc[item.condicaoProdutor].latexLiquido   += item.numeroEstabelecimentos;
      if (item.produto.includes("coagulado")) acc[item.condicaoProdutor].latexCoagulado += item.numeroEstabelecimentos;
      return acc;
    }, {})
  ).filter(i => i.condicaoProdutor !== "Total").reverse();

  const dados = buildDados();
  const eixoY = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "condicaoProdutor", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 18 }) }));
  const eixoX = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoY.data.setAll(dados);

  const seriesMap = {};
  [{ campo: "latexCoagulado", nome: "Látex coagulado", cor: P[0] },
   { campo: "latexLiquido",   nome: "Látex líquido",   cor: P[1] }
  ].forEach(cfg => {
    const serie = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: cfg.nome, xAxis: eixoX, yAxis: eixoY,
      valueXField: cfg.campo, categoryYField: "condicaoProdutor", stacked: true,
      fill: am5.color(cfg.cor), stroke: am5.color(cfg.cor),
      tooltip: am5.Tooltip.new(root, { labelText: `${cfg.nome}: {valueX}` })
    }));
    serie.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
    serie.data.setAll(dados);
    seriesMap[cfg.campo] = serie;
  });

  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(1000, 100);
  graficosFixos["chartEstabelecimentosSeringueira"] = { isEstab: true, seriesMap };
}

function criarGraficoIndicadores() {
  const ctx = inicializarXY("chartIndicadoresBorracha", { layoutVertical: true });
  if (!ctx) return;
  const { root, chart } = ctx;
  const getDados = () => dadosIndicadores.filter(d => d.ano >= estadoFiltros.anoInicio && d.ano <= estadoFiltros.anoFim).map(d => ({ ...d, ano: String(d.ano) }));
  const dados = getDados();

  const eixoX  = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY  = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  const eixoY2 = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }));
  configurarEixo(eixoX); configurarEixo(eixoY); configurarEixo(eixoY2);
  eixoX.data.setAll(dados);

  const seriesList = [
    { campo: "producaoToneladas",         nome: "Produção (t)",          cor: P[0], eixo: eixoY  },
    { campo: "areaPlantadaHectares",      nome: "Área plantada (ha)",     cor: P[2], eixo: eixoY  },
    { campo: "areaColhidaHectares",       nome: "Área colhida (ha)",      cor: P[3], eixo: eixoY  },
    { campo: "produtividadeKgPorHectare", nome: "Produtividade (kg/ha)",  cor: P[1], eixo: eixoY2 }
  ].map(cfg => {
    const serie = chart.series.push(am5xy.LineSeries.new(root, {
      name: cfg.nome, xAxis: eixoX, yAxis: cfg.eixo,
      valueYField: cfg.campo, categoryXField: "ano",
      stroke: am5.color(cfg.cor), fill: am5.color(cfg.cor),
      tooltip: am5.Tooltip.new(root, { labelText: `${cfg.nome}: {valueY}` })
    }));
    serie.strokes.template.setAll({ strokeWidth: 2.5 });
    serie.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: serie.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    serie.data.setAll(dados);
    return serie;
  });

  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(1000, 100);
  graficosFixos["chartIndicadoresBorracha"] = { eixoX, seriesList, getDados };
}

function criarGraficoCusto(containerId) {
  const ctx = inicializarXY(containerId, { layoutVertical: true });
  if (!ctx) return;
  const { root, chart } = ctx;
  const getDados = () => dadosCusto.filter(d => d.ano >= estadoFiltros.anoInicio && d.ano <= estadoFiltros.anoFim).map(d => ({ ...d, ano: String(d.ano) }));
  const dados = getDados();

  const eixoX  = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY  = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  const eixoY2 = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }));
  configurarEixo(eixoX); configurarEixo(eixoY); configurarEixo(eixoY2);
  eixoX.data.setAll(dados);

  const colunas = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "R$/ha", xAxis: eixoX, yAxis: eixoY,
    valueYField: "custoProducaoPorHectare", categoryXField: "ano",
    fill: am5.color(P[0]), stroke: am5.color(P[0]),
    tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/ha" })
  }));
  colunas.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(55) });
  colunas.data.setAll(dados);

  const linha = chart.series.push(am5xy.LineSeries.new(root, {
    name: "R$/kg", xAxis: eixoX, yAxis: eixoY2,
    valueYField: "custoProducaoPorKg", categoryXField: "ano",
    stroke: am5.color(P[1]), fill: am5.color(P[1]),
    tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/kg" })
  }));
  linha.strokes.template.setAll({ strokeWidth: 2.5 });
  linha.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 4, fill: linha.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
  linha.data.setAll(dados);

  criarLegenda(chart, root).data.setAll(chart.series.values);
  chart.appear(1000, 100);
  graficosFixos[containerId] = { eixoX, seriesList: [colunas, linha], getDados };
}

function criarGraficoRankingMundial() {
  const ctx = inicializarXY("chartMundo");
  if (!ctx) return;
  const { root, chart } = ctx;
  const eixoY = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "pais", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 20 }) }));
  const eixoX = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoY.data.setAll(dadosRankingMundial);
  const serie = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Área (mi ha)", xAxis: eixoX, yAxis: eixoY,
    valueXField: "area", categoryYField: "pais",
    tooltip: am5.Tooltip.new(root, { labelText: "{categoryY}: {valueX} mi ha" })
  }));
  serie.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
  serie.columns.template.adapters.add("fill",   (_, t) => am5.color(t.dataItem?.dataContext?.isBrasil ? P[2] : P[0]));
  serie.columns.template.adapters.add("stroke",  (_, t) => am5.color(t.dataItem?.dataContext?.isBrasil ? P[2] : P[0]));
  serie.data.setAll(dadosRankingMundial);
  chart.appear(1000, 100);
}

function criarGraficoParticipacaoMundial() {
  if (!document.getElementById("chartMundoPie")) return;
  const root = am5.Root.new("chartMundoPie");
  root.setThemes([am5themes_Animated.new(root)]);
  root.numberFormatter.set("numberFormat", "#,###.##");
  rootsSeringueira.push(root);
  const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
  const serie = chart.series.push(am5percent.PieSeries.new(root, { valueField: "area", categoryField: "pais" }));
  serie.labels.template.setAll({ fontSize: 10, fontFamily: "Arial,sans-serif" });
  serie.data.setAll([...dadosRankingMundial].reverse());
  serie.get("colors").set("colors", P.map(c => am5.color(c)));
  const legenda = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 }));
  legenda.labels.template.setAll({ fontSize: 10, fontFamily: "Arial,sans-serif" });
  legenda.data.setAll(serie.dataItems);
  chart.appear(1000, 100);
}

// ── APLICAR FILTROS ──────────────────────────────────────────────────
function atualizarGraficosUF() {
  Object.values(graficosUF).forEach(g => {
    const novos = buildDadosUF(g.dados, g.campoValor);
    g.eixoX.data.setAll(novos);
    Object.entries(g.seriesMap).forEach(([uf, serie]) => {
      serie.data.setAll(novos);
      serie.set("visible", estadoFiltros.ufs.size === 0 || estadoFiltros.ufs.has(uf));
    });
  });
}

function atualizarGraficosFixos() {
  Object.entries(graficosFixos).forEach(([, g]) => {
    if (g.isEstab) {
      const sel = estadoFiltros.produto;
      g.seriesMap.latexCoagulado.set("visible", sel.size === 0 || sel.has("Borracha (látex coagulado)"));
      g.seriesMap.latexLiquido.set("visible",   sel.size === 0 || sel.has("Borracha (látex líquido)"));
      return;
    }
    const dados = g.getDados();
    g.eixoX.data.setAll(dados);
    g.seriesList.forEach(s => s.data.setAll(dados));
  });
}

function aplicarFiltros() {
  atualizarGraficosUF();
  atualizarGraficosFixos();
  renderizarChips();
}

// ── CHIPS ────────────────────────────────────────────────────────────
function renderizarChips() {
  const container = document.getElementById("seriChips");
  if (!container) return;
  const chips = [];

  if (estadoFiltros.anoInicio !== periodoPadrao.inicio || estadoFiltros.anoFim !== periodoPadrao.fim) {
    chips.push(`<span class="filter-chip">Período: ${estadoFiltros.anoInicio}–${estadoFiltros.anoFim}<button class="filter-chip__x" data-clear="periodo" aria-label="Remover filtro de período">×</button></span>`);
  }
  estadoFiltros.ufs.forEach(uf => {
    chips.push(`<span class="filter-chip">${uf}<button class="filter-chip__x" data-clear="uf" data-value="${uf}" aria-label="Remover ${uf}">×</button></span>`);
  });
  estadoFiltros.produto.forEach(p => {
    const label = p.replace("Borracha (", "").replace(")", "");
    chips.push(`<span class="filter-chip">${label}<button class="filter-chip__x" data-clear="produto" data-value="${p}" aria-label="Remover ${p}">×</button></span>`);
  });

  container.innerHTML = chips.length
    ? chips.join("")
    : '<span class="filter-chip-vazio">Nenhum filtro ativo</span>';

  container.querySelectorAll(".filter-chip__x").forEach(btn => {
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.clear;
      if (tipo === "periodo") {
        estadoFiltros.anoInicio = periodoPadrao.inicio; estadoFiltros.anoFim = periodoPadrao.fim;
        const si = document.getElementById("seriAnoInicio");
        const sf = document.getElementById("seriAnoFim");
        if (si) si.value = String(periodoPadrao.inicio); if (sf) sf.value = String(periodoPadrao.fim);
      } else if (tipo === "uf") {
        estadoFiltros.ufs.delete(btn.dataset.value);
        const cb = document.querySelector(`#seriUfMenu input[value="${btn.dataset.value}"]`);
        if (cb) cb.checked = false;
        labelDropdown("seriUfBtn", [...estadoFiltros.ufs], "Todas");
      } else if (tipo === "produto") {
        estadoFiltros.produto.delete(btn.dataset.value);
        const cb = document.querySelector(`#seriProdutoMenu input[value="${btn.dataset.value}"]`);
        if (cb) cb.checked = false;
        labelDropdown("seriProdutoBtn", [...estadoFiltros.produto], "Todos");
      }
      aplicarFiltros();
    });
  });
}

// ── INIT FILTROS UI ──────────────────────────────────────────────────
function labelDropdown(btnId, valores, vazio) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.textContent = valores.length ? `${valores.length} selecionado${valores.length > 1 ? "s" : ""}` : vazio;
}

function montarDropdownCheckbox(menuId, opcoes) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.innerHTML = opcoes.map(v => `
    <label class="filter-option" data-filter-option>
      <input class="form-check-input mt-0" type="checkbox" value="${v}">
      <span>${v}</span>
    </label>`).join("");
}

function conectarBusca(inputId, menuId) {
  const input = document.getElementById(inputId);
  const menu  = document.getElementById(menuId);
  if (!input || !menu) return;
  input.addEventListener("input", () => {
    const t = input.value.toLocaleLowerCase("pt-BR");
    menu.querySelectorAll("[data-filter-option]").forEach(el => {
      el.style.display = el.textContent.toLocaleLowerCase("pt-BR").includes(t) ? "" : "none";
    });
  });
}

function inicializarFiltrosUI() {
  // Período
  const selectInicio = document.getElementById("seriAnoInicio");
  const selectFim    = document.getElementById("seriAnoFim");
  if (selectInicio && selectFim) {
    selectInicio.replaceChildren();
    selectFim.replaceChildren();
    anosSeringueira.forEach(ano => {
      const criarOpt = (sel) => {
        const o = document.createElement("option"); o.value = String(ano); o.textContent = String(ano); o.selected = sel; return o;
      };
      selectInicio.appendChild(criarOpt(ano === periodoPadrao.inicio));
      selectFim.appendChild(criarOpt(ano === periodoPadrao.fim));
    });
    selectInicio.addEventListener("change", () => {
      estadoFiltros.anoInicio = Number(selectInicio.value);
      if (estadoFiltros.anoFim < estadoFiltros.anoInicio) { estadoFiltros.anoFim = estadoFiltros.anoInicio; selectFim.value = String(estadoFiltros.anoInicio); }
      aplicarFiltros();
    });
    selectFim.addEventListener("change", () => {
      estadoFiltros.anoFim = Number(selectFim.value);
      if (estadoFiltros.anoInicio > estadoFiltros.anoFim) { estadoFiltros.anoInicio = estadoFiltros.anoFim; selectInicio.value = String(estadoFiltros.anoFim); }
      aplicarFiltros();
    });
  }

  // UF dropdown
  montarDropdownCheckbox("seriUfMenu", ufsSeringueira);
  conectarBusca("buscaUfSeri", "seriUfMenu");
  document.getElementById("seriUfMenu")?.addEventListener("change", () => {
    estadoFiltros.ufs = new Set(Array.from(document.querySelectorAll("#seriUfMenu input:checked")).map(i => i.value));
    labelDropdown("seriUfBtn", [...estadoFiltros.ufs], "Todas");
    aplicarFiltros();
  });

  // Produto dropdown
  montarDropdownCheckbox("seriProdutoMenu", ["Borracha (látex coagulado)", "Borracha (látex líquido)"]);
  document.getElementById("seriProdutoMenu")?.addEventListener("change", () => {
    estadoFiltros.produto = new Set(Array.from(document.querySelectorAll("#seriProdutoMenu input:checked")).map(i => i.value));
    labelDropdown("seriProdutoBtn", [...estadoFiltros.produto], "Todos");
    aplicarFiltros();
  });

  // Limpar
  document.getElementById("seriLimparFiltros")?.addEventListener("click", () => {
    estadoFiltros.anoInicio = periodoPadrao.inicio; estadoFiltros.anoFim = periodoPadrao.fim;
    estadoFiltros.ufs = new Set(); estadoFiltros.produto = new Set();
    if (selectInicio) selectInicio.value = String(periodoPadrao.inicio);
    if (selectFim)    selectFim.value    = String(periodoPadrao.fim);
    document.querySelectorAll("#seriUfMenu input, #seriProdutoMenu input").forEach(i => i.checked = false);
    labelDropdown("seriUfBtn",     [], "Todas");
    labelDropdown("seriProdutoBtn", [], "Todos");
    // reset indicador
    document.querySelectorAll('[data-filter-group="ind"] .filter-btn').forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
    document.querySelectorAll("[data-category]").forEach(el => { el.style.display = ""; });
    aplicarFiltros();
  });

  renderizarChips();
}

// ── MAIN ─────────────────────────────────────────────────────────────
async function inicializarDashboard() {
  comentarVisualizacoesSemEndpoint();
  await carregarDadosApiSeringueira();
  criarGraficoLinhasUF("chartProducaoSeringueira",   dadosProducao,     "quantidadeProduzidaToneladas",    "t");
  criarGraficoLinhasUF("chartAreaColhidaSeringueira",dadosAreaColhida,  "areaColhidaHectares",             "ha");
  criarGraficoLinhasUF("chartAreaDestinadaSeringueira",dadosAreaDestinada,"areaDestinadaColheitaHectares", "ha");
  criarGraficoLinhasUF("chartAreaPerdaSeringueira",  dadosAreaPerda,    "percentualPerdaArea",             "%");
  criarGraficoLinhasUF("chartProdutividadeSeringueira",dadosProdutividade,"produtividadeKgPorHectare",     "kg/ha");
  criarGraficoLinhasUF("chartValorProducaoSeringueira",dadosValorProducao,"valorProducaoMilReais",         "mil R$");
  criarGraficoEstabelecimentos();
  criarGraficoIndicadores();
  inicializarFiltrosUI();
}

window.onFilterChange = function (filterId, group) {
  if (group === "escala") {
    const tabMap = { co: "fl-co", mundial: "fl-mundo" };
    if (tabMap[filterId]) document.querySelector(`[data-tab="${tabMap[filterId]}"]`)?.click();
    document.querySelectorAll('[data-filter-group="ind"] .filter-btn').forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
    document.querySelectorAll("[data-category]").forEach(el => { el.style.display = ""; });
    return;
  }
  if (group === "ind") {
    const tab = document.querySelector("[data-tab-content].active");
    if (!tab) return;
    tab.querySelectorAll("[data-category]").forEach(el => {
      el.style.display = (filterId === "all" || el.dataset.category === filterId) ? "" : "none";
    });
  }
};

document.addEventListener("click", e => {
  if (!e.target.closest("[data-tab]")) return;
  window.setTimeout(() => { rootsSeringueira.forEach(r => r.resize()); }, 80);
});

am5.ready(inicializarDashboard);
