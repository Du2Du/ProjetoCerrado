const P = ["#2d5c24","#c8943a","#a0622b","#4a7c3f","#6fa65e","#e8a84c","#7fb069","#5c4033","#1a4a18","#d4a843"];

/**
 * Dashboard da seringueira.
 *
 * Os endpoints alimentam coleções separadas por indicador. Depois da carga,
 * filtros e gráficos compartilham `estadoFiltros`; `aplicarFiltros` atualiza as
 * séries já criadas em vez de reconstruir toda a página a cada interação.
 */
let anosSeringueira = [];
const rootsSeringueira = [];

// ── ESTADO CENTRAL ───────────────────────────────────────────────────
const estadoFiltros = { anoInicio: null, anoFim: null, ufs: new Set(), produto: new Set() };
const graficosUF    = {};  // id → { eixoX, seriesMap:{uf→serie}, dados, campoValor }
// Guarda referências dos gráficos para atualizar dados sem recriar roots do amCharts.
const graficosFixos = {};  // id → gráfico consolidado ou gráfico de estabelecimentos

// ── DADOS ────────────────────────────────────────────────────────────
let dadosProducao = [];
let dadosAreaColhida = [];
let dadosAreaDestinada = [];
let dadosAreaPerda = [];
let dadosProdutividade = [];
let dadosValorProducao = [];
let dadosEstabelecimentos = [];

const API_SERINGUEIRA = "https://api.projetocerradoifg.org/webhook/seringueira";
const ENDPOINTS_SERINGUEIRA = ["pam", "censo"];
const requisicoesSeringueira = new Map();
const PRODUTO_BORRACHA = "Borracha (látex coagulado)";
const ALVOS_API = Object.freeze({
  producao: ["chartProducaoSeringueira"],
  areas: ["chartAreaColhidaSeringueira", "chartAreaDestinadaSeringueira", "chartAreaPerdaSeringueira"],
  produtividade: ["chartProdutividadeSeringueira"],
  valor: ["chartValorProducaoSeringueira"],
  estabelecimentos: ["chartEstabelecimentosSeringueira"],
  indicadores: ["chartIndicadoresBorracha"]
});
let periodoPadrao = { inicio: null, fim: null };

class ErroDadosVazios extends Error {}

// Remove duplicidades e ordena anos recebidos de diferentes endpoints.
function ordenarAnos(anos) {
  return Array.from(new Set(anos.map(Number).filter(Number.isInteger))).sort((a, b) => a - b);
}

// Resume uma lista de anos como intervalo legível.
function periodoTexto(anos) {
  if (!anos.length) return "";
  return anos.length === 1 ? String(anos[0]) : `${anos[0]}–${anos.at(-1)}`;
}

// Encontra o card externo responsável pelo estado de um componente.
function containerVisualizacao(id) {
  const elemento = document.getElementById(id);
  if (!elemento) return null;
  if (elemento.classList.contains("chart-card") || elemento.classList.contains("table-card")) return elemento;
  return elemento.closest(".chart-card, .table-card");
}

// Alterna componentes entre pronto, carregando, vazio e erro.
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

// Busca um endpoint uma única vez, valida a resposta e reutiliza a Promise.
async function buscarEndpointSeringueira(nome) {
  // Timeout e validação evitam que respostas pendentes ou vazias sejam tratadas
  // como dados válidos pelo restante do dashboard.
  if (requisicoesSeringueira.has(nome)) return requisicoesSeringueira.get(nome);
  const requisicao = (async () => {
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

function produtoSelecionado(produto) {
  return !estadoFiltros.produto.size || estadoFiltros.produto.has(produto);
}

function ufSelecionada(uf) {
  return !estadoFiltros.ufs.size || estadoFiltros.ufs.has(uf);
}

function recortePam() {
  const ufs = [...estadoFiltros.ufs];
  return !ufs.length || ufs.includes("Centro-Oeste") ? ["Centro-Oeste"] : ufs;
}

function seriePamDoRecorte(dados, campo) {
  const ufs = recortePam();
  const porAno = new Map();
  for (const item of dados) {
    if (!ufs.includes(item.uf) || !produtoSelecionado(item.produto)
      || item.ano < estadoFiltros.anoInicio || item.ano > estadoFiltros.anoFim) continue;
    if (!porAno.has(item.ano)) porAno.set(item.ano, new Map());
    porAno.get(item.ano).set(item.uf, item[campo]);
  }
  return new Map([...porAno].filter(([, valores]) => valores.size === ufs.length)
    .map(([ano, valores]) => [ano, [...valores.values()].reduce((soma, valor) => soma + valor, 0)]));
}

function serieProdutividadeDoRecorte(producao, colhida) {
  if (recortePam().length === 1) {
    return seriePamDoRecorte(dadosProdutividade, "produtividadeKgPorHectare");
  }
  return new Map([...producao].filter(([ano]) => colhida.get(ano) > 0)
    .map(([ano, toneladas]) => [ano, toneladas * 1000 / colhida.get(ano)]));
}

// Consolida os indicadores no recorte geográfico selecionado.
function montarIndicadores() {
  const producao = seriePamDoRecorte(dadosProducao, "quantidadeProduzidaToneladas");
  const destinada = seriePamDoRecorte(dadosAreaDestinada, "areaDestinadaColheitaHectares");
  const colhida = seriePamDoRecorte(dadosAreaColhida, "areaColhidaHectares");
  const produtividade = serieProdutividadeDoRecorte(producao, colhida);
  const anos = ordenarAnos([...producao.keys(), ...destinada.keys(), ...colhida.keys(), ...produtividade.keys()]);
  return anos.map(ano => ({
    ano: String(ano),
    producaoToneladas: producao.get(ano),
    areaPlantadaHectares: destinada.get(ano),
    areaColhidaHectares: colhida.get(ano),
    produtividadeKgPorHectare: produtividade.get(ano)
  }));
}

function atualizarAvisoSeringueira(id, temDados, indicador, mensagem = avisoSemDadosGrafico) {
  mostrarAvisoGrafico(id, avisoIndicadorGrafico(id, indicador) || (temDados ? "" : mensagem));
}

// Atualiza subtítulo e descrição acessível de um card.
function atualizarTextoVisualizacao(id, { subtitulo, ariaLabel } = {}) {
  const container = containerVisualizacao(id);
  if (!container) return;
  if (subtitulo) container.querySelector(".chart-card__sub").textContent = subtitulo;
  if (ariaLabel) container.setAttribute("aria-label", ariaLabel);
}

// Identifica visualmente componentes abastecidos pela API ativa.
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

// Registra a causa técnica e apresenta erro nos cards afetados.
function registrarFalhaApi(alvos, erro) {
  const semDados = erro instanceof ErroDadosVazios;
  definirEstadoVisualizacao(alvos, semDados ? "empty" : "error", semDados ? erro.message : "Não foi possível carregar os dados do Servidor.");
  console.error("Falha ao carregar dados de Seringueira:", erro);
}

// Deriva anos, UFs e período padrão dos conjuntos carregados com sucesso.
function atualizarPeriodoDinamico() {
  anosSeringueira = ordenarAnos([
    ...dadosProducao.map(item => item.ano),
    ...dadosAreaColhida.map(item => item.ano),
    ...dadosAreaDestinada.map(item => item.ano),
    ...dadosProdutividade.map(item => item.ano),
    ...dadosValorProducao.map(item => item.ano),
    ...dadosEstabelecimentos.map(item => item.ano)
  ]);
  if (anosSeringueira.length) {
    periodoPadrao = { inicio: anosSeringueira[0], fim: anosSeringueira.at(-1) };
    estadoFiltros.anoInicio = periodoPadrao.inicio;
    estadoFiltros.anoFim = periodoPadrao.fim;
  }
}

// Formata números de KPI no padrão brasileiro.
function formatarNumeroKpi(valor, casas = 1) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  }).format(valor);
}

// Calcula a variação da série entre o primeiro e o último ano disponível.
function variacaoKpiSeringueira(serie) {
  const inicial = serie[0];
  const atual = serie.at(-1);
  if (serie.length < 2 || inicial.valor === 0) {
    return { badge: "Série disponível no SIDRA", tone: "neutral" };
  }
  const percentual = (atual.valor - inicial.valor) / inicial.valor * 100;
  return {
    badge: `${percentual >= 0 ? "▲" : "▼"} ${percentual > 0 ? "+" : ""}${formatarNumeroKpi(percentual, 1)}% vs ${inicial.ano}`,
    tone: percentual >= 0 ? "up" : "down"
  };
}

// Preenche um KPI com o último valor da série e sua tendência histórica.
function atualizarCardSerieSeringueira({ id, label, valores, divisor = 1, casas = 1, prefixo = "", unidade }) {
  const ufs = recortePam();
  const recorte = ufs.length > 1 ? "UFs selecionadas" : ufs[0];
  label = `${label} — ${recorte}`;
  const serie = [...valores].map(([ano, valor]) => ({ ano, valor })).sort((a, b) => a.ano - b.ano);
  const atual = serie.at(-1);
  if (!atual) {
    window.atualizarKpiComApi(id, { label, state: "error" });
    return;
  }
  window.atualizarKpiComApi(id, {
    label: `${label} ${atual.ano}`,
    value: `${prefixo}${formatarNumeroKpi(atual.valor / divisor, casas)}`,
    unit: unidade,
    ...variacaoKpiSeringueira(serie)
  });
}

// Atualiza todos os KPIs após a carga das fontes.
function atualizarCardsSeringueira() {
  const producao = seriePamDoRecorte(dadosProducao, "quantidadeProduzidaToneladas");
  const colhida = seriePamDoRecorte(dadosAreaColhida, "areaColhidaHectares");
  atualizarCardSerieSeringueira({
    id: "kpiSeringueiraProducao", label: "Produção", valores: producao, divisor: 1_000, unidade: "mil t"
  });
  atualizarCardSerieSeringueira({
    id: "kpiSeringueiraValor", label: "Valor da produção",
    valores: seriePamDoRecorte(dadosValorProducao, "valorProducaoMilReais"), divisor: 1_000, prefixo: "R$ ", unidade: "mi"
  });
  atualizarCardSerieSeringueira({
    id: "kpiSeringueiraArea", label: "Área colhida", valores: colhida, divisor: 1_000, unidade: "mil ha"
  });
  atualizarCardSerieSeringueira({
    id: "kpiSeringueiraProdutividade", label: "Produtividade",
    valores: serieProdutividadeDoRecorte(producao, colhida), casas: 0, unidade: "kg/ha"
  });
}

// Carrega PAM e Censo em paralelo e trata seus grupos visuais separadamente.
async function carregarDadosApiSeringueira() {
  // `Promise.allSettled` permite sucesso parcial: cada resposta atualiza suas
  // coleções; cada falha afeta apenas os cards associados ao endpoint.
  Object.values(ALVOS_API).flat().forEach(id => definirEstadoVisualizacao([id], "loading"));
  const nomes = ENDPOINTS_SERINGUEIRA;
  const resultados = await Promise.allSettled(nomes.map(buscarEndpointSeringueira));
  const resposta = Object.fromEntries(nomes.map((nome, indice) => [nome, resultados[indice]]));

  if (resposta.pam.status === "fulfilled") {
    try {
      const pam = resposta.pam.value;
      const mapear = (campoOrigem, campoDestino, unidadeMedida) => pam
        .filter(item => item.uf && temMedicao(item[campoOrigem]))
        .map(item => ({
          ano: Number(item.ano), uf: item.uf, produto: PRODUTO_BORRACHA,
          unidadeMedida, [campoDestino]: Number(item[campoOrigem])
        }));
      dadosProducao = mapear("producao", "quantidadeProduzidaToneladas", "Toneladas");
      dadosAreaColhida = mapear("areaColhida", "areaColhidaHectares", "Hectares");
      dadosAreaDestinada = mapear("areaDestinada", "areaDestinadaColheitaHectares", "Hectares");
      dadosProdutividade = mapear("rendimento", "produtividadeKgPorHectare", "Quilogramas por Hectare");
      dadosValorProducao = mapear("valor", "valorProducaoMilReais", "Mil Reais");
      dadosAreaPerda = pam.filter(item => Number(item.areaDestinada) > 0 && temMedicao(item.areaColhida)).map(item => ({
        ano: Number(item.ano), uf: item.uf, produto: PRODUTO_BORRACHA, unidadeMedida: "%",
        percentualPerdaArea: Math.max(0, (Number(item.areaDestinada) - Number(item.areaColhida)) / Number(item.areaDestinada) * 100)
      }));
      const alvosPam = [...ALVOS_API.producao, ...ALVOS_API.areas, ...ALVOS_API.produtividade, ...ALVOS_API.valor, ...ALVOS_API.indicadores];
      definirEstadoVisualizacao(alvosPam, "ready");
      marcarFonteApi(alvosPam);
    } catch (erro) {
      [...ALVOS_API.producao, ...ALVOS_API.areas, ...ALVOS_API.produtividade, ...ALVOS_API.valor, ...ALVOS_API.indicadores]
        .forEach(id => registrarFalhaApi([id], erro));
    }
  } else {
    [...ALVOS_API.producao, ...ALVOS_API.areas, ...ALVOS_API.produtividade, ...ALVOS_API.valor, ...ALVOS_API.indicadores]
      .forEach(id => registrarFalhaApi([id], resposta.pam.reason));
  }

  if (resposta.censo.status === "fulfilled") {
    dadosEstabelecimentos = resposta.censo.value.filter(item => temMedicao(item.numeroEstabelecimentos)).map(item => ({
      ano: Number(item.ano), produto: item.produto, condicaoProdutor: item.condicaoProdutor,
      numeroEstabelecimentos: Number(item.numeroEstabelecimentos)
    })).filter(item => item.produto && Number.isFinite(item.numeroEstabelecimentos));
    definirEstadoVisualizacao(ALVOS_API.estabelecimentos, "ready");
    marcarFonteApi(ALVOS_API.estabelecimentos);
  } else {
    registrarFalhaApi(ALVOS_API.estabelecimentos, resposta.censo.reason);
  }
  atualizarPeriodoDinamico();
}

// Transpõe linhas da API para uma linha anual com uma coluna por UF.
function buildDadosUF(dados, campoValor) {
  const porAno = new Map();
  for (const item of dados) {
    if (!produtoSelecionado(item.produto) || !ufSelecionada(item.uf)
      || item.ano < estadoFiltros.anoInicio || item.ano > estadoFiltros.anoFim) continue;
    if (!porAno.has(item.ano)) porAno.set(item.ano, { ano: String(item.ano) });
    porAno.get(item.ano)[item.uf] = item[campoValor];
  }
  return [...porAno.values()].sort((a, b) => Number(a.ano) - Number(b.ano));
}

// ── AMCHARTS HELPERS ─────────────────────────────────────────────────
// Padroniza os rótulos dos eixos do amCharts.
function configurarEixo(eixo) {
  eixo.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif", fill: am5.color("#5a5a5a") });
}
// Adiciona uma legenda comum ao gráfico informado.
function criarLegenda(chart, root) {
  const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  l.labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif" });
  return l;
}
// Cria a estrutura base de gráfico XY e guarda seu root para redimensionamento.
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
// Cria uma linha por UF e registra referências para atualizações incrementais.
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
  [...new Set(dados.map(item => item.uf))].sort((a, b) => a.localeCompare(b, "pt-BR")).forEach((uf, indice) => {
    const cor = P[indice % P.length];
    const serie = chart.series.push(am5xy.LineSeries.new(root, {
      name: uf, xAxis: eixoX, yAxis: eixoY,
      valueYField: uf, categoryXField: "ano", connect: false,
      stroke: am5.color(cor), fill: am5.color(cor),
      tooltip: am5.Tooltip.new(root, { labelText: `${uf}: {valueY} ${sufixoTooltip}` })
    }));
    serie.strokes.template.setAll({ strokeWidth: uf === "Centro-Oeste" ? 3 : 2 });
    serie.bullets.push(() => am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, { radius: uf === "Centro-Oeste" ? 4 : 3, fill: serie.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 })
    }));
    serie.data.setAll(dadosGrafico);
    seriesMap[uf] = serie;
  });

  const legenda = criarLegenda(chart, root);
  chart.appear(1000, 100);
  const subtitulo = containerVisualizacao(containerId).querySelector(".chart-card__sub").textContent;
  graficosUF[containerId] = { eixoX, seriesMap, dados, campoValor, legenda, subtitulo };
}

// Consolida estabelecimentos por condição do produtor e tipo de látex.
function criarGraficoEstabelecimentos() {
  const ctx = inicializarXY("chartEstabelecimentosSeringueira", { layoutVertical: true });
  if (!ctx) return;
  const { root, chart } = ctx;

  const produtos = [...new Set(dadosEstabelecimentos.map(item => item.produto).filter(Boolean))];
  const buildDados = () => {
    if (!ufSelecionada("Centro-Oeste")) return [];
    const porCondicao = new Map();
    dadosEstabelecimentos.filter(item => item.ano >= estadoFiltros.anoInicio && item.ano <= estadoFiltros.anoFim)
      .filter(item => produtoSelecionado(item.produto) && item.condicaoProdutor && item.condicaoProdutor !== "Total")
      .forEach(item => {
        if (!porCondicao.has(item.condicaoProdutor)) porCondicao.set(item.condicaoProdutor, { condicaoProdutor: item.condicaoProdutor });
        const d = porCondicao.get(item.condicaoProdutor);
        d[item.produto] = (d[item.produto] || 0) + item.numeroEstabelecimentos;
      });
    return [...porCondicao.values()].reverse();
  };
  const dados = buildDados();
  const eixoY = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "condicaoProdutor", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 18 }) }));
  const eixoX = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoY.data.setAll(dados);

  const seriesMap = {};
  produtos.forEach((produto, indice) => {
    const cor = am5.color(P[indice % P.length]);
    const serie = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: produto, xAxis: eixoX, yAxis: eixoY,
      valueXField: produto, categoryYField: "condicaoProdutor", stacked: true,
      fill: cor, stroke: cor,
      tooltip: am5.Tooltip.new(root, { labelText: `${produto}: {valueX}` })
    }));
    serie.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
    serie.data.setAll(dados);
    seriesMap[produto] = serie;
  });

  const legenda = criarLegenda(chart, root);
  chart.appear(1000, 100);
  graficosFixos["chartEstabelecimentosSeringueira"] = { isEstab: true, seriesMap, eixoY, buildDados, legenda };
}

// Monta as séries anuais consolidadas de produção, área e produtividade.
function criarGraficoIndicadores() {
  const ctx = inicializarXY("chartIndicadoresBorracha", { layoutVertical: true });
  if (!ctx) return;
  const { root, chart } = ctx;
  const dados = montarIndicadores();

  const eixoX  = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY  = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  const eixoY2 = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }));
  configurarEixo(eixoX); configurarEixo(eixoY); configurarEixo(eixoY2);
  eixoX.data.setAll(dados);

  const seriesMap = Object.fromEntries([
    { campo: "producaoToneladas",         nome: "Produção (t)",          cor: P[0], eixo: eixoY  },
    { campo: "areaPlantadaHectares",      nome: "Área destinada (ha)",    cor: P[2], eixo: eixoY  },
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
    return [cfg.campo, serie];
  }));

  const legenda = criarLegenda(chart, root);
  chart.appear(1000, 100);
  graficosFixos["chartIndicadoresBorracha"] = { eixoX, eixoY2, seriesMap, legenda };
}

// ── APLICAR FILTROS ──────────────────────────────────────────────────
// Atualiza dados e visibilidade das séries estaduais segundo os filtros.
function atualizarGraficosUF(indicador) {
  Object.entries(graficosUF).forEach(([id, g]) => {
    const novos = buildDadosUF(g.dados, g.campoValor);
    g.eixoX.data.setAll(novos);
    atualizarSeriesFiltradas(g, novos);
    atualizarTextoVisualizacao(id, {
      subtitulo: ["Látex coagulado", g.subtitulo, periodoTexto(novos.map(item => item.ano))].filter(Boolean).join(" · ")
    });
    atualizarAvisoSeringueira(id, novos.length > 0, indicador, mensagemSemDadosPam());
  });
}

function atualizarSeriesFiltradas(grafico, dados, campos) {
  const visiveis = [];
  Object.entries(grafico.seriesMap).forEach(([chave, serie]) => {
    const visivel = (!campos || campos.includes(chave)) && dados.some(item => temMedicao(item[chave]));
    serie.data.setAll(visivel ? dados : []);
    serie.set("forceHidden", !visivel);
    if (visivel) visiveis.push(serie);
  });
  grafico.legenda.data.setAll(visiveis);
  return visiveis.length > 0;
}

function mensagemSemDadosPam() {
  return produtoSelecionado(PRODUTO_BORRACHA) ? avisoSemDadosGrafico : "Sem dados históricos para látex líquido.";
}

function mensagemSemDadosCenso() {
  if (!ufSelecionada("Centro-Oeste")) return "O Censo não tem dados de estabelecimentos por estado.";
  const anos = ordenarAnos(dadosEstabelecimentos.filter(item => produtoSelecionado(item.produto)).map(item => item.ano));
  return anos.length === 1 && (anos[0] < estadoFiltros.anoInicio || anos[0] > estadoFiltros.anoFim)
    ? `O Censo só tem dados de estabelecimentos de ${anos[0]}.` : avisoSemDadosGrafico;
}

// Atualiza os gráficos especiais que não seguem o formato comum por UF.
function atualizarGraficosFixos(indicador) {
  Object.entries(graficosFixos).forEach(([id, g]) => {
    if (g.isEstab) {
      const dados = g.buildDados();
      g.eixoY.data.setAll(dados);
      atualizarSeriesFiltradas(g, dados);
      atualizarAvisoSeringueira(id, dados.length > 0, indicador, mensagemSemDadosCenso());
      return;
    }
    const dados = montarIndicadores();
    const campos = {
      area: ["areaPlantadaHectares", "areaColhidaHectares"],
      producao: ["producaoToneladas", "produtividadeKgPorHectare"]
    }[indicador];
    g.eixoX.data.setAll(dados);
    g.eixoY2.set("forceHidden", indicador === "area");
    const temDados = atualizarSeriesFiltradas(g, dados, campos);
    const recorte = recortePam().join(", ");
    atualizarTextoVisualizacao(id, {
      subtitulo: ["Látex coagulado", recorte, periodoTexto(dados.map(item => item.ano))].filter(Boolean).join(" · "),
      ariaLabel: `Indicadores produtivos de látex coagulado — ${recorte}`
    });
    atualizarAvisoSeringueira(id, temDados, indicador, mensagemSemDadosPam());
  });
}

// Atualiza gráficos por UF, gráficos especiais e chips usando o mesmo estado.
function aplicarFiltros() {
  // Recalcula o período visível e repassa os dados filtrados a todos os gráficos
  // registrados, mantendo chips e KPIs alinhados com a mesma seleção.
  const indicador = document.querySelector('[data-filter-group="ind"] .filter-btn.active')?.dataset.filter || "all";
  atualizarOpcoesSeringueira();
  atualizarGraficosUF(indicador);
  atualizarGraficosFixos(indicador);
  document.querySelectorAll("#fl-co [data-category] > .kpi-card").forEach(card => {
    const coluna = card.parentElement;
    coluna.style.display = indicador === "all" || coluna.dataset.category === indicador ? "" : "none";
  });
  atualizarCardsSeringueira();
  renderizarChips();
}

// ── CHIPS ────────────────────────────────────────────────────────────
// Materializa período, UFs e produtos como chips removíveis.
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
// Resume uma seleção múltipla no botão do dropdown.
function labelDropdown(btnId, valores, vazio) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.textContent = valores.length ? `${valores.length} selecionado${valores.length > 1 ? "s" : ""}` : vazio;
}

// Reconstrói as opções marcáveis de um dropdown.
function montarDropdownCheckbox(menuId, opcoes) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.innerHTML = opcoes.map(v => `
    <label class="filter-option" data-filter-option>
      <input class="form-check-input mt-0" type="checkbox" value="${v}">
      <span>${v}</span>
    </label>`).join("");
}

// Filtra as opções do dropdown enquanto o usuário digita.
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

function atualizarOpcoesSeringueira() {
  const aba = document.querySelector("[data-tab-content].active")?.id || "fl-co";
  const temGraficos = aba === "fl-co";
  document.querySelectorAll('[data-filter-group="ind"] .filter-btn').forEach(btn => { btn.disabled = !temGraficos; });
  document.getElementById("seriChips").hidden = !temGraficos;
  if (!temGraficos) {
    ["seriAnoInicio", "seriAnoFim", "seriUfBtn", "seriProdutoBtn"].forEach(id => {
      document.getElementById(id).disabled = true;
    });
    return;
  }

  const dados = [...dadosProducao, ...dadosAreaColhida, ...dadosAreaDestinada, ...dadosAreaPerda, ...dadosProdutividade, ...dadosValorProducao];
  const anos = anosSeringueira;
  ["Inicio", "Fim"].forEach((extremo, indice) => {
    const select = document.getElementById(`seriAno${extremo}`);
    select.replaceChildren(...anos.map(ano => new Option(String(ano), String(ano))));
    select.value = indice === 0 ? estadoFiltros.anoInicio : estadoFiltros.anoFim;
    select.disabled = !anos.length;
  });
  const localidades = dados.map(item => item.uf);
  const produtos = [...dados, ...dadosEstabelecimentos].map(item => item.produto);
  [
    ["Uf", "ufs", localidades, "Todas"],
    ["Produto", "produto", produtos, "Todos"]
  ].forEach(([nome, chave, valores, vazio]) => {
    const opcoes = [...new Set(valores.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    estadoFiltros[chave] = new Set([...estadoFiltros[chave]].filter(valor => opcoes.includes(valor)));
    montarDropdownCheckbox(`seri${nome}Menu`, opcoes);
    const menu = document.getElementById(`seri${nome}Menu`);
    menu.querySelectorAll("input").forEach(input => { input.checked = estadoFiltros[chave].has(input.value); });
    document.getElementById(`seri${nome}Btn`).disabled = !opcoes.length;
    labelDropdown(`seri${nome}Btn`, [...estadoFiltros[chave]], vazio);
    document.getElementById(`busca${nome}Seri`)?.dispatchEvent(new Event("input"));
  });
}

// Preenche controles e liga suas mudanças ao estado central de filtros.
function inicializarFiltrosUI() {
  // Período
  const selectInicio = document.getElementById("seriAnoInicio");
  const selectFim    = document.getElementById("seriAnoFim");
  if (selectInicio && selectFim) {
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
  conectarBusca("buscaUfSeri", "seriUfMenu");
  document.getElementById("seriUfMenu")?.addEventListener("change", () => {
    estadoFiltros.ufs = new Set(Array.from(document.querySelectorAll("#seriUfMenu input:checked")).map(i => i.value));
    labelDropdown("seriUfBtn", [...estadoFiltros.ufs], "Todas");
    aplicarFiltros();
  });

  // Produto dropdown
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
  // Carregar antes de criar os gráficos garante que eixos e séries nasçam com
  // anos e UFs realmente disponíveis na API.
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
  aplicarFiltros();
}

function marcarEscala(filterId) {
  document.querySelectorAll('[data-filter-group="escala"] .filter-btn').forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filterId);
  });
}

window.onTabChange = aba => {
  const escalas = { "fl-co": "co", "fl-mundo": "mundial" };
  marcarEscala(escalas[aba] || "all");
  requestAnimationFrame(aplicarFiltros);
};

window.onFilterChange = function (filterId, group) {
  if (group === "escala") {
    const aba = filterId === "mundial" ? "fl-mundo" : "fl-co";
    document.querySelector(`[data-tab="${aba}"]`)?.click();
    marcarEscala(filterId);
    return;
  }
  if (group === "ind") {
    aplicarFiltros();
  }
};

document.addEventListener("click", e => {
  if (!e.target.closest("[data-tab]")) return;
  window.setTimeout(() => { rootsSeringueira.forEach(r => r.resize()); }, 80);
});

am5.ready(inicializarDashboard);
