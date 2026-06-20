const P = ["#2d5c24","#c8943a","#a0622b","#4a7c3f","#6fa65e","#e8a84c","#7fb069","#5c4033","#1a4a18","#d4a843"];

const anosSeringueira = [2012,2013,2014,2015,2016,2017,2018,2019,2020,2021];
const ufsSeringueira  = ["Centro-Oeste","Mato Grosso do Sul","Mato Grosso","Goiás"];
const coresUf = {
  "Centro-Oeste":       P[0],
  "Mato Grosso do Sul": P[1],
  "Mato Grosso":        P[2],
  "Goiás":              P[3]
};
const rootsSeringueira = [];

// ── ESTADO CENTRAL ───────────────────────────────────────────────────
const estadoFiltros = { anoInicio: 2012, anoFim: 2021, ufs: new Set(), produto: new Set() };
const graficosUF    = {};  // id → { eixoX, seriesMap:{uf→serie}, dados, campoValor }
const graficosFixos = {};  // id → { eixoX, seriesList, getDados } ou { isEstab, seriesMap }

// ── DADOS ────────────────────────────────────────────────────────────
function criarSerieAnual(linhas, valoresPorUf, campoValor, extras = {}) {
  Object.entries(valoresPorUf).forEach(([uf, valores]) => {
    anosSeringueira.forEach((ano, i) => {
      const v = valores[i];
      if (v === null || v === undefined) return;
      linhas.push({ ano, uf, produto: extras.produto || "Borracha (látex coagulado)", unidadeMedida: extras.unidadeMedida, [campoValor]: v });
    });
  });
  return linhas;
}

const dadosProducao = criarSerieAnual([], {
  "Centro-Oeste":       [42384,45038,45186,43497,46725,53215,44023,52379,55012,59404],
  "Mato Grosso do Sul": [1996,2178,2263,2105,4062,14562,6824,13942,14619,18724],
  "Mato Grosso":        [26328,31173,27857,23620,23751,17914,16189,14388,14365,13541],
  "Goiás":              [14060,11687,15066,17772,18912,20739,21010,24049,26028,27139]
}, "quantidadeProduzidaToneladas");

const dadosAreaColhida = criarSerieAnual([], {
  "Centro-Oeste":       [28565,27006,27945,25707,27670,31082,27843,29455,29747,33541],
  "Mato Grosso do Sul": [821,855,854,852,1413,5799,3415,5505,5760,9591],
  "Mato Grosso":        [23350,22201,21186,18615,19624,17963,16963,14907,14782,14430],
  "Goiás":              [4394,3950,5905,6240,6633,7320,7465,9043,9205,9520]
}, "areaColhidaHectares", { unidadeMedida: "Hectares" });

const dadosAreaDestinada = criarSerieAnual([], {
  "Centro-Oeste":       [28565,27006,46151,35103,36417,35236,27946,36618,30777,33644],
  "Mato Grosso do Sul": [821,855,854,852,1413,5799,3415,5505,5760,9591],
  "Mato Grosso":        [23350,22201,39392,28011,28105,22117,16976,22070,15802,14533],
  "Goiás":              [4394,3950,5905,6240,6899,7320,7555,9043,9215,9520]
}, "areaDestinadaColheitaHectares", { unidadeMedida: "Hectares" });

const dadosAreaPerda = criarSerieAnual([], {
  "Centro-Oeste":       [0,0,39.448766,26.766943,24.019002,11.789079,0.368568,19.561418,3.346655,0.306147],
  "Mato Grosso do Sul": [0,0,0,0,0,0,0,0,0,0],
  "Mato Grosso":        [0,0,46.217506,33.543965,30.176125,18.781932,0.076579,32.455822,6.454879,0.708732],
  "Goiás":              [0,0,0,0,3.855631,0,1.191264,0,0.108519,0]
}, "percentualPerdaArea", { unidadeMedida: "%" });

const dadosProdutividade = criarSerieAnual([], {
  "Centro-Oeste":       [1484,1668,1617,1692,1689,1712,1581,1778,1849,1771],
  "Mato Grosso do Sul": [2431,2547,2650,2471,2875,2511,1998,2533,2538,1952],
  "Mato Grosso":        [1128,1404,1315,1269,1210,997,954,965,972,938],
  "Goiás":              [3200,2959,2551,2848,2851,2833,2814,2659,2828,2851]
}, "produtividadeKgPorHectare");

const dadosValorProducao = criarSerieAnual([], {
  "Centro-Oeste":       [126300,113310,120868,88868,107178,136134,93166,117568,130546,196228],
  "Mato Grosso do Sul": [5572,6389,5408,4247,9693,44229,16149,33301,38114,78356],
  "Mato Grosso":        [77366,75483,77689,45895,56803,38454,34010,33085,33300,49058],
  "Goiás":              [43362,31438,37771,38726,40682,53451,43007,51182,59132,68815]
}, "valorProducaoMilReais");

const dadosEstabelecimentos = [
  { ano:2017, condicaoProdutor:"Total",                             produto:"Borracha (látex líquido)",   numeroEstabelecimentos:20  },
  { ano:2017, condicaoProdutor:"Total",                             produto:"Borracha (látex coagulado)", numeroEstabelecimentos:295 },
  { ano:2017, condicaoProdutor:"Proprietário(a)",                   produto:"Borracha (látex líquido)",   numeroEstabelecimentos:20  },
  { ano:2017, condicaoProdutor:"Proprietário(a)",                   produto:"Borracha (látex coagulado)", numeroEstabelecimentos:283 },
  { ano:2017, condicaoProdutor:"Concessionário(a) ou assentado(a)", produto:"Borracha (látex coagulado)", numeroEstabelecimentos:1   },
  { ano:2017, condicaoProdutor:"Arrendatário(a)",                   produto:"Borracha (látex coagulado)", numeroEstabelecimentos:6   },
  { ano:2017, condicaoProdutor:"Comodatário(a)",                    produto:"Borracha (látex coagulado)", numeroEstabelecimentos:4   },
  { ano:2017, condicaoProdutor:"Ocupante",                          produto:"Borracha (látex coagulado)", numeroEstabelecimentos:1   }
];

const dadosIndicadores = anosSeringueira.map((ano, i) => ({
  ano,
  producaoToneladas:        [42384,45038,45186,43497,46725,53215,44023,52379,55012,59404][i],
  valorProducaoMilReais:    [126300,113310,120868,88868,107178,136134,93166,117568,130546,196228][i],
  areaPlantadaHectares:     [28565,27006,46151,35103,36417,35236,27946,36618,30777,33644][i],
  areaColhidaHectares:      [28565,27006,27945,25707,27670,31082,27843,29455,29747,33541][i],
  produtividadeKgPorHectare:[1484,1668,1617,1692,1689,1712,1581,1778,1849,1771][i]
}));

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

  if (estadoFiltros.anoInicio !== 2012 || estadoFiltros.anoFim !== 2021) {
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
        estadoFiltros.anoInicio = 2012; estadoFiltros.anoFim = 2021;
        const si = document.getElementById("seriAnoInicio");
        const sf = document.getElementById("seriAnoFim");
        if (si) si.value = "2012"; if (sf) sf.value = "2021";
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
    anosSeringueira.forEach(ano => {
      const criarOpt = (sel) => {
        const o = document.createElement("option"); o.value = String(ano); o.textContent = String(ano); o.selected = sel; return o;
      };
      selectInicio.appendChild(criarOpt(ano === 2012));
      selectFim.appendChild(criarOpt(ano === 2021));
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
    estadoFiltros.anoInicio = 2012; estadoFiltros.anoFim = 2021;
    estadoFiltros.ufs = new Set(); estadoFiltros.produto = new Set();
    if (selectInicio) selectInicio.value = "2012";
    if (selectFim)    selectFim.value    = "2021";
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
function inicializarDashboard() {
  criarGraficoLinhasUF("chartProducaoSeringueira",   dadosProducao,     "quantidadeProduzidaToneladas",    "t");
  criarGraficoLinhasUF("chartAreaColhidaSeringueira",dadosAreaColhida,  "areaColhidaHectares",             "ha");
  criarGraficoLinhasUF("chartAreaDestinadaSeringueira",dadosAreaDestinada,"areaDestinadaColheitaHectares", "ha");
  criarGraficoLinhasUF("chartAreaPerdaSeringueira",  dadosAreaPerda,    "percentualPerdaArea",             "%");
  criarGraficoLinhasUF("chartProdutividadeSeringueira",dadosProdutividade,"produtividadeKgPorHectare",     "kg/ha");
  criarGraficoLinhasUF("chartValorProducaoSeringueira",dadosValorProducao,"valorProducaoMilReais",         "mil R$");
  criarGraficoEstabelecimentos();
  criarGraficoIndicadores();
  criarGraficoCusto("chartCustoBorracha");
  criarGraficoRankingMundial();
  criarGraficoParticipacaoMundial();
  criarGraficoCusto("chartCustoComp");
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
