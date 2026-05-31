const P = ["#2d5c24", "#c8943a", "#a0622b", "#4a7c3f", "#6fa65e", "#e8a84c", "#7fb069", "#5c4033", "#1a4a18", "#d4a843"];

const produtosEucalipto = [
  { campo: "carvao", nome: "Carvão vegetal de eucalipto", nomeCurto: "Carvão vegetal", unidade: "t", cor: P[2] },
  { campo: "lenha", nome: "Lenha de eucalipto", nomeCurto: "Lenha", unidade: "m³", cor: P[1] },
  { campo: "papelCelulose", nome: "Madeira para papel e celulose", nomeCurto: "Papel e celulose", unidade: "m³", cor: P[0] },
  { campo: "outrasFinalidades", nome: "Madeira para outras finalidades", nomeCurto: "Outras finalidades", unidade: "m³", cor: P[3] },
  { campo: "folha", nome: "Eucalipto (folha)", nomeCurto: "Folha", unidade: "t", cor: P[4] }
];

// DASHBOARD_EUCALIPTO.txt pede uf, municipio e ranking na Tabela 1.
// A planilha traz esses dados como localidade hierárquica, não como colunas explícitas;
// por isso uf/municipio foram extraídos do texto "Município (UF)" e ranking foi calculado por quantidade.
const dadosRankingProducao = [
  { localidade: "Três Lagoas (MS)", uf: "MS", municipio: "Três Lagoas", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 4729905, unidadeMedida: "Metros cúbicos", ranking: 1 },
  { localidade: "Ribas do Rio Pardo (MS)", uf: "MS", municipio: "Ribas do Rio Pardo", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 3692019, unidadeMedida: "Metros cúbicos", ranking: 2 },
  { localidade: "Brasilândia (MS)", uf: "MS", municipio: "Brasilândia", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 1475643, unidadeMedida: "Metros cúbicos", ranking: 3 },
  { localidade: "Água Clara (MS)", uf: "MS", municipio: "Água Clara", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 826607, unidadeMedida: "Metros cúbicos", ranking: 4 },
  { localidade: "Selvíria (MS)", uf: "MS", municipio: "Selvíria", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 725741, unidadeMedida: "Metros cúbicos", ranking: 5 },
  { localidade: "Nova Andradina (MS)", uf: "MS", municipio: "Nova Andradina", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 562963, unidadeMedida: "Metros cúbicos", ranking: 6 },
  { localidade: "Santa Rita do Pardo (MS)", uf: "MS", municipio: "Santa Rita do Pardo", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 414375, unidadeMedida: "Metros cúbicos", ranking: 7 },
  { localidade: "Campo Grande (MS)", uf: "MS", municipio: "Campo Grande", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 302858, unidadeMedida: "Metros cúbicos", ranking: 8 },
  { localidade: "Inocência (MS)", uf: "MS", municipio: "Inocência", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 210809, unidadeMedida: "Metros cúbicos", ranking: 9 },
  { localidade: "Paranaíba (MS)", uf: "MS", municipio: "Paranaíba", produtoSilvicultura: "Madeira em tora de eucalipto para papel e celulose", quantidadeProduzida: 203124, unidadeMedida: "Metros cúbicos", ranking: 10 }
];

const dadosQuantidadeProduzida = [
  { ano: 2012, localidade: "Centro-Oeste", carvao: 93462, lenha: 4065556, papelCelulose: 4968944, outrasFinalidades: null, folha: 3975 },
  { ano: 2013, localidade: "Centro-Oeste", carvao: 145073, lenha: 6230147, papelCelulose: 8033052, outrasFinalidades: 863064, folha: 2400 },
  { ano: 2014, localidade: "Centro-Oeste", carvao: 139192, lenha: 6472880, papelCelulose: 8293047, outrasFinalidades: 790701, folha: 1700 },
  { ano: 2015, localidade: "Centro-Oeste", carvao: 70908, lenha: 5358997, papelCelulose: 9419761, outrasFinalidades: 787463, folha: 1556 },
  { ano: 2016, localidade: "Centro-Oeste", carvao: 52945, lenha: 4994371, papelCelulose: 9958927, outrasFinalidades: 788761, folha: 2000 },
  { ano: 2017, localidade: "Centro-Oeste", carvao: 65997, lenha: 4910293, papelCelulose: 12860798, outrasFinalidades: 831846, folha: 4700 },
  { ano: 2018, localidade: "Centro-Oeste", carvao: 134453, lenha: 4795454, papelCelulose: 17511680, outrasFinalidades: 1056519, folha: 2858 },
  { ano: 2019, localidade: "Centro-Oeste", carvao: 169969, lenha: 5369619, papelCelulose: 14602994, outrasFinalidades: 1163830, folha: 3386 },
  { ano: 2020, localidade: "Centro-Oeste", carvao: 187119, lenha: 5883302, papelCelulose: 14661653, outrasFinalidades: 1061103, folha: 3075 },
  { ano: 2021, localidade: "Centro-Oeste", carvao: 179191, lenha: 5998155, papelCelulose: 13144044, outrasFinalidades: 1069066, folha: 3071 }
];

// Em Tabela 2, algumas células de 2021 estavam gravadas 1000x acima da unidade "Mil Reais".
// Foram normalizadas para manter a unidade dos demais anos e coerência com Tabela 3.
const dadosValorProducao = [
  { ano: 2012, uf: "Centro-Oeste", carvao: 42518, lenha: 253003, papelCelulose: 273169, outrasFinalidades: 143563, folha: 190 },
  { ano: 2013, uf: "Centro-Oeste", carvao: 70016, lenha: 361651, papelCelulose: 427042, outrasFinalidades: 97468, folha: 121 },
  { ano: 2014, uf: "Centro-Oeste", carvao: 64846, lenha: 391061, papelCelulose: 580513, outrasFinalidades: 85478, folha: 186 },
  { ano: 2015, uf: "Centro-Oeste", carvao: 36815, lenha: 278142, papelCelulose: 565186, outrasFinalidades: 89909, folha: 93 },
  { ano: 2016, uf: "Centro-Oeste", carvao: 24912, lenha: 260380, papelCelulose: 684781, outrasFinalidades: 90014, folha: 120 },
  { ano: 2017, uf: "Centro-Oeste", carvao: 33395, lenha: 269547, papelCelulose: 885803, outrasFinalidades: 103723, folha: 376 },
  { ano: 2018, uf: "Centro-Oeste", carvao: 69110, lenha: 251432, papelCelulose: 951141, outrasFinalidades: 130174, folha: 259 },
  { ano: 2019, uf: "Centro-Oeste", carvao: 93036, lenha: 279023, papelCelulose: 760308, outrasFinalidades: 146211, folha: 440 },
  { ano: 2020, uf: "Centro-Oeste", carvao: 104815, lenha: 315150, papelCelulose: 875828, outrasFinalidades: 124043, folha: 400 },
  { ano: 2021, uf: "Centro-Oeste", carvao: 127258, lenha: 406334, papelCelulose: 1072734, outrasFinalidades: 138784, folha: 399 }
];

// Tabela 3 tem apenas percentuais de participação por produto.
// principalProdutoPorQuantidade e valorTotalProducaoMilReais não existem nesta aba; ficam nulos e o gráfico usa os percentuais disponíveis.
const dadosParticipacaoValor = [
  { ano: 2012, uf: "Centro-Oeste", carvao: 5.93, lenha: 35.26, papelCelulose: 38.07, outrasFinalidades: 20.01, folha: 0.03, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 38.07, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2013, uf: "Centro-Oeste", carvao: 6.6, lenha: 34.11, papelCelulose: 40.28, outrasFinalidades: 9.19, folha: 0.01, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 40.28, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2014, uf: "Centro-Oeste", carvao: 5.33, lenha: 32.14, papelCelulose: 47.72, outrasFinalidades: 7.03, folha: 0.02, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 47.72, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2015, uf: "Centro-Oeste", carvao: 3.37, lenha: 25.43, papelCelulose: 51.68, outrasFinalidades: 8.22, folha: 0.01, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 51.68, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2016, uf: "Centro-Oeste", carvao: 2.05, lenha: 21.44, papelCelulose: 56.56, outrasFinalidades: 7.41, folha: 0.01, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 56.56, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2017, uf: "Centro-Oeste", carvao: 2.35, lenha: 18.96, papelCelulose: 62.3, outrasFinalidades: 7.3, folha: 0.03, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 62.3, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2018, uf: "Centro-Oeste", carvao: 4.55, lenha: 16.55, papelCelulose: 62.63, outrasFinalidades: 8.57, folha: 0.02, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 62.63, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2019, uf: "Centro-Oeste", carvao: 6.65, lenha: 19.95, papelCelulose: 54.37, outrasFinalidades: 10.46, folha: 0.03, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 54.37, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2020, uf: "Centro-Oeste", carvao: 6.81, lenha: 20.47, papelCelulose: 56.88, outrasFinalidades: 8.06, folha: 0.03, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 56.88, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null },
  { ano: 2021, uf: "Centro-Oeste", carvao: 6.57, lenha: 20.98, papelCelulose: 55.39, outrasFinalidades: 7.17, folha: 0.02, principalProdutoPorValor: "papelCelulose", percentualPrincipalProduto: 55.39, principalProdutoPorQuantidade: null, valorTotalProducaoMilReais: null }
];

const anosDisponiveis = dadosQuantidadeProduzida.map(item => String(item.ano));
const filtrosAtivos = {
  indicador: "all",
  anoInicio: "2012",
  anoFim: "2021",
  produtos: [],
  ufs: [],
  municipios: [],
  topRanking: 10,
  minimoRanking: 0
};
const graficos = {};

function existe(id) {
  return !!document.getElementById(id);
}

function formatarNumero(valor, casas = 0) {
  return Number(valor || 0).toLocaleString("pt-BR", { maximumFractionDigits: casas, minimumFractionDigits: casas });
}

function formatarCompacto(valor, unidade) {
  const numero = Number(valor || 0);
  if (numero >= 1000000000) return `${formatarNumero(numero / 1000000000, 2)}<span class="kpi-unit">bi ${unidade}</span>`;
  if (numero >= 1000000) return `${formatarNumero(numero / 1000000, 2)}<span class="kpi-unit">mi ${unidade}</span>`;
  if (numero >= 1000) return `${formatarNumero(numero / 1000, 1)}<span class="kpi-unit">mil ${unidade}</span>`;
  return `${formatarNumero(numero)}<span class="kpi-unit">${unidade}</span>`;
}

function configurarEixo(eixo) {
  eixo.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif", fill: am5.color("#5a5a5a") });
}

function criarRoot(containerId) {
  const root = am5.Root.new(containerId);
  root.setThemes([am5themes_Animated.new(root)]);
  root.numberFormatter.set("numberFormat", "#,###.##");
  return root;
}

function criarLegenda(chart, root) {
  const legenda = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  legenda.labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif" });
  return legenda;
}

function inicializarXY(containerId, opcoes = {}) {
  const root = criarRoot(containerId);
  const chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    layout: opcoes.layoutVertical ? root.verticalLayout : undefined
  }));
  return { root, chart };
}

function setSelectOptions(id, valores) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = valores.map(valor => `<option value="${valor}">${valor}</option>`).join("");
}

function setDropdownOptions(menuId, valores, labelFn = valor => valor) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.innerHTML = valores.map(valor => `
    <label class="filter-option" data-filter-option>
      <input class="form-check-input mt-0" type="checkbox" value="${valor}">
      <span>${labelFn(valor)}</span>
    </label>
  `).join("");
}

function marcarDropdown(menuId, valores) {
  const selecionados = new Set(valores);
  document.querySelectorAll(`#${menuId} input[type='checkbox']`).forEach(input => {
    input.checked = selecionados.has(input.value);
  });
}

function selecionadosDropdown(menuId) {
  return Array.from(document.querySelectorAll(`#${menuId} input:checked`)).map(input => input.value);
}

function atualizarLabelDropdown(btnId, valores, labelVazio) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.textContent = valores.length ? `${valores.length} selecionado${valores.length > 1 ? "s" : ""}` : labelVazio;
}

function conectarBuscaDropdown(inputId, menuId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener("input", () => {
    const termo = input.value.trim().toLocaleLowerCase("pt-BR");
    document.querySelectorAll(`#${menuId} [data-filter-option]`).forEach(option => {
      option.style.display = option.textContent.trim().toLocaleLowerCase("pt-BR").includes(termo) ? "" : "none";
    });
  });
}

function produtosSelecionados() {
  return filtrosAtivos.produtos.length
    ? produtosEucalipto.filter(produto => filtrosAtivos.produtos.includes(produto.campo))
    : produtosEucalipto;
}

function filtrarPeriodo(data) {
  const inicio = Number(filtrosAtivos.anoInicio);
  const fim = Number(filtrosAtivos.anoFim);
  return data.filter(item => item.ano >= inicio && item.ano <= fim).map(item => ({ ...item, ano: String(item.ano) }));
}

function anoFinalSelecionado() {
  const anos = filtrarPeriodo(dadosParticipacaoValor).map(item => Number(item.ano));
  return anos.length ? Math.max(...anos) : Number(filtrosAtivos.anoFim);
}

function alternarEstadoVazio(containerId, vazio) {
  const chart = document.getElementById(containerId);
  const empty = document.getElementById(`empty${containerId.replace(/^chart/, "")}`);
  if (chart) chart.style.display = vazio ? "none" : "";
  if (empty) empty.style.display = vazio ? "flex" : "none";
  chart?.closest("[data-category]")?.classList.toggle("is-chart-empty", vazio);
}

function criarGraficoLinhasProdutos(containerId, dataSource, unidadePadrao) {
  if (!existe(containerId)) return;
  const { root, chart } = inicializarXY(containerId, { layoutVertical: true });
  const eixoX = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);

  const series = {};
  produtosEucalipto.forEach(produto => {
    const serie = chart.series.push(am5xy.LineSeries.new(root, {
      name: produto.nome,
      xAxis: eixoX,
      yAxis: eixoY,
      valueYField: produto.campo,
      categoryXField: "ano",
      connect: false,
      stroke: am5.color(produto.cor),
      fill: am5.color(produto.cor),
      tooltip: am5.Tooltip.new(root, { labelText: `${produto.nome}: {valueY} ${produto.unidade || unidadePadrao}` })
    }));
    serie.strokes.template.setAll({ strokeWidth: 2.5 });
    serie.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: serie.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    series[produto.campo] = serie;
  });
  criarLegenda(chart, root).data.setAll(chart.series.values);

  graficos[containerId] = {
    update(data, produtos) {
      const ativos = new Set(produtos.map(produto => produto.campo));
      eixoX.data.setAll(data);
      Object.entries(series).forEach(([campo, serie]) => {
        const visivel = ativos.has(campo);
        serie.data.setAll(data);
        serie.set("visible", visivel);
        serie.set("forceHidden", !visivel);
      });
      const temDados = data.some(row => produtos.some(produto => row[produto.campo] !== null && row[produto.campo] !== undefined));
      alternarEstadoVazio(containerId, !temDados);
    }
  };
  graficos[containerId].update(filtrarPeriodo(dataSource), produtosSelecionados());
  chart.appear(800, 80);
}

function criarGraficoValorProducao() {
  const containerId = "chartValorProducaoEucalipto";
  const { root, chart } = inicializarXY(containerId, { layoutVertical: true });
  const eixoX = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
  const eixoY = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);

  const series = {};
  produtosEucalipto.forEach(produto => {
    const serie = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: produto.nome,
      xAxis: eixoX,
      yAxis: eixoY,
      valueYField: produto.campo,
      categoryXField: "ano",
      fill: am5.color(produto.cor),
      stroke: am5.color(produto.cor),
      stacked: true,
      tooltip: am5.Tooltip.new(root, { labelText: `${produto.nome}: R$ {valueY} mil` })
    }));
    serie.columns.template.setAll({ cornerRadiusTL: 2, cornerRadiusTR: 2, width: am5.percent(60) });
    series[produto.campo] = serie;
  });
  criarLegenda(chart, root).data.setAll(chart.series.values);

  graficos[containerId] = {
    update(data, produtos) {
      const ativos = new Set(produtos.map(produto => produto.campo));
      eixoX.data.setAll(data);
      Object.entries(series).forEach(([campo, serie]) => {
        const visivel = ativos.has(campo);
        serie.data.setAll(data);
        serie.set("visible", visivel);
        serie.set("forceHidden", !visivel);
      });
      const temDados = data.some(row => produtos.some(produto => Number(row[produto.campo] || 0) > 0));
      alternarEstadoVazio(containerId, !temDados);
    }
  };
  graficos[containerId].update(filtrarPeriodo(dadosValorProducao), produtosSelecionados());
  chart.appear(800, 80);
}

function criarGraficoRankingProducao() {
  const containerId = "chartRankingProducaoEucalipto";
  const { root, chart } = inicializarXY(containerId);
  const eixoY = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "municipio", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 16 }) }));
  const eixoX = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoY.get("renderer").labels.template.setAll({ oversizedBehavior: "truncate", maxWidth: 130 });

  const serie = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Quantidade produzida",
    xAxis: eixoX,
    yAxis: eixoY,
    valueXField: "quantidadeProduzida",
    categoryYField: "municipio",
    fill: am5.color(P[0]),
    stroke: am5.color(P[0]),
    tooltip: am5.Tooltip.new(root, { labelText: "#{ranking} {localidade}: {valueX} m³" })
  }));
  serie.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });

  graficos[containerId] = {
    update(data) {
      const dados = [...data].reverse();
      eixoY.data.setAll(dados);
      serie.data.setAll(dados);
      alternarEstadoVazio(containerId, !dados.length);
    }
  };
  graficos[containerId].update(dadosRankingFiltrados());
  chart.appear(800, 80);
}

function criarGraficoParticipacaoValor() {
  const containerId = "chartParticipacaoValorEucalipto";
  const { root, chart } = inicializarXY(containerId);
  const eixoY = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "produto", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 16 }) }));
  const eixoX = chart.xAxes.push(am5xy.ValueAxis.new(root, { min: 0, max: 100, renderer: am5xy.AxisRendererX.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoY.get("renderer").labels.template.setAll({ oversizedBehavior: "truncate", maxWidth: 145 });

  const serie = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Participação no valor",
    xAxis: eixoX,
    yAxis: eixoY,
    valueXField: "percentualParticipacaoValor",
    categoryYField: "produto",
    tooltip: am5.Tooltip.new(root, { labelText: "{categoryY}: {valueX}%" })
  }));
  serie.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
  serie.columns.template.adapters.add("fill", (fill, target) => am5.color(target.dataItem?.dataContext?.cor || P[0]));
  serie.columns.template.adapters.add("stroke", (stroke, target) => am5.color(target.dataItem?.dataContext?.cor || P[0]));

  graficos[containerId] = {
    update(data) {
      const dados = [...data].reverse();
      eixoY.data.setAll(dados);
      serie.data.setAll(dados);
      alternarEstadoVazio(containerId, !dados.length);
    }
  };
  graficos[containerId].update(dadosParticipacaoFiltrados());
  chart.appear(800, 80);
}

function dadosRankingFiltrados() {
  const produtoRankingSelecionado = !filtrosAtivos.produtos.length || filtrosAtivos.produtos.includes("papelCelulose");
  if (!produtoRankingSelecionado) return [];
  return dadosRankingProducao
    .filter(item => !filtrosAtivos.ufs.length || filtrosAtivos.ufs.includes(item.uf))
    .filter(item => !filtrosAtivos.municipios.length || filtrosAtivos.municipios.includes(item.municipio))
    .filter(item => item.quantidadeProduzida >= filtrosAtivos.minimoRanking)
    .slice(0, filtrosAtivos.topRanking);
}

function dadosParticipacaoFiltrados() {
  const ano = anoFinalSelecionado();
  const itemAno = dadosParticipacaoValor.find(item => item.ano === ano);
  if (!itemAno) return [];
  return produtosSelecionados()
    .map(produto => ({
      produto: produto.nomeCurto,
      percentualParticipacaoValor: itemAno[produto.campo],
      cor: produto.cor,
      ano,
      uf: itemAno.uf
    }))
    .filter(item => item.percentualParticipacaoValor !== null && item.percentualParticipacaoValor !== undefined);
}

function atualizarKpis() {
  const ano = anoFinalSelecionado();
  const produtos = produtosSelecionados();
  const quantidadeAno = dadosQuantidadeProduzida.find(item => item.ano === ano) || {};
  const valorAno = dadosValorProducao.find(item => item.ano === ano) || {};
  const participacaoAno = dadosParticipacaoValor.find(item => item.ano === ano) || {};

  const liderQuantidade = produtos
    .map(produto => ({ produto, valor: quantidadeAno[produto.campo] || 0 }))
    .sort((a, b) => b.valor - a.valor)[0];
  const valorTotal = produtos.reduce((total, produto) => total + Number(valorAno[produto.campo] || 0), 0);
  const liderParticipacao = produtos
    .map(produto => ({ produto, valor: participacaoAno[produto.campo] || 0 }))
    .sort((a, b) => b.valor - a.valor)[0];
  const ranking = dadosRankingFiltrados()[0];

  document.getElementById("kpiQuantidadeLider").innerHTML = liderQuantidade ? formatarCompacto(liderQuantidade.valor, liderQuantidade.produto.unidade) : "0";
  document.getElementById("kpiQuantidadeLiderBadge").textContent = liderQuantidade ? `${liderQuantidade.produto.nomeCurto} · ${ano}` : `sem dados · ${ano}`;
  document.getElementById("kpiRankingLider").innerHTML = ranking ? formatarCompacto(ranking.quantidadeProduzida, "m³") : "0";
  document.getElementById("kpiRankingLiderBadge").textContent = ranking ? ranking.localidade : "sem município";
  document.getElementById("kpiValorTotal").innerHTML = formatarCompacto(valorTotal * 1000, "R$");
  document.getElementById("kpiValorTotalBadge").textContent = `Tabela 2 · ${ano}`;
  document.getElementById("kpiParticipacaoLider").innerHTML = liderParticipacao ? `${formatarNumero(liderParticipacao.valor, 2)}<span class="kpi-unit">%</span>` : "0";
  document.getElementById("kpiParticipacaoLiderBadge").textContent = liderParticipacao ? `${liderParticipacao.produto.nomeCurto} · ${ano}` : `sem dados · ${ano}`;
}

function atualizarGraficos() {
  const produtos = produtosSelecionados();
  graficos.chartQuantidadeProduzidaEucalipto?.update(filtrarPeriodo(dadosQuantidadeProduzida), produtos);
  graficos.chartRankingProducaoEucalipto?.update(dadosRankingFiltrados());
  graficos.chartValorProducaoEucalipto?.update(filtrarPeriodo(dadosValorProducao), produtos);
  graficos.chartParticipacaoValorEucalipto?.update(dadosParticipacaoFiltrados());
  atualizarKpis();
  atualizarResumoFiltros();
  atualizarVisibilidadeCards();
}

function atualizarVisibilidadeCards() {
  document.querySelectorAll("[data-category]").forEach(card => {
    const categoriaOk = filtrosAtivos.indicador === "all" || card.dataset.category === filtrosAtivos.indicador;
    card.classList.toggle("is-filter-hidden", !categoriaOk);
  });

  const existeVisivel = Array.from(document.querySelectorAll("[data-tab-content].active [data-category]"))
    .some(card => !card.classList.contains("is-filter-hidden") && !card.classList.contains("is-chart-empty"));
  const semDados = document.getElementById("semDadosEucalipto");
  if (semDados) semDados.style.display = existeVisivel ? "none" : "block";
}

function atualizarResumoFiltros() {
  const target = document.getElementById("filtrosAtivosEucalipto");
  if (!target) return;
  const chips = [
    `Indicador: ${filtrosAtivos.indicador === "all" ? "todos" : filtrosAtivos.indicador}`,
    `Período: ${filtrosAtivos.anoInicio}-${filtrosAtivos.anoFim}`,
    filtrosAtivos.produtos.length ? `Produtos: ${filtrosAtivos.produtos.length}` : "",
    filtrosAtivos.ufs.length ? `UF: ${filtrosAtivos.ufs.join(", ")}` : "",
    filtrosAtivos.municipios.length ? `Municípios: ${filtrosAtivos.municipios.length}` : "",
    `Ranking: Top ${filtrosAtivos.topRanking}`,
    filtrosAtivos.minimoRanking ? `Faixa: acima de ${formatarNumero(filtrosAtivos.minimoRanking)} m³` : ""
  ].filter(Boolean);
  target.innerHTML = chips.map(texto => `<span class="filter-chip">${texto}</span>`).join("");
}

function lerFiltrosFormulario() {
  filtrosAtivos.anoInicio = document.getElementById("filtroAnoInicioEucalipto")?.value || filtrosAtivos.anoInicio;
  filtrosAtivos.anoFim = document.getElementById("filtroAnoFimEucalipto")?.value || filtrosAtivos.anoFim;
  if (Number(filtrosAtivos.anoInicio) > Number(filtrosAtivos.anoFim)) {
    [filtrosAtivos.anoInicio, filtrosAtivos.anoFim] = [filtrosAtivos.anoFim, filtrosAtivos.anoInicio];
    document.getElementById("filtroAnoInicioEucalipto").value = filtrosAtivos.anoInicio;
    document.getElementById("filtroAnoFimEucalipto").value = filtrosAtivos.anoFim;
  }

  filtrosAtivos.produtos = selecionadosDropdown("filtroProdutoEucaliptoMenu");
  filtrosAtivos.ufs = selecionadosDropdown("filtroUfEucaliptoMenu");
  filtrosAtivos.municipios = selecionadosDropdown("filtroMunicipioEucaliptoMenu");
  atualizarMunicipiosDisponiveis();
  filtrosAtivos.topRanking = Number(document.getElementById("filtroTopRankingEucalipto")?.value || 10);
  filtrosAtivos.minimoRanking = Number(document.getElementById("filtroFaixaRankingEucalipto")?.value || 0);
  atualizarLabelsDropdowns();
  atualizarGraficos();
}

function atualizarLabelsDropdowns() {
  atualizarLabelDropdown("filtroProdutoEucaliptoBtn", filtrosAtivos.produtos, "Todos");
  atualizarLabelDropdown("filtroUfEucaliptoBtn", filtrosAtivos.ufs, "Todas");
  atualizarLabelDropdown("filtroMunicipioEucaliptoBtn", filtrosAtivos.municipios, "Todos");
}

function atualizarMunicipiosDisponiveis() {
  const municipiosDisponiveis = dadosRankingProducao
    .filter(item => !filtrosAtivos.ufs.length || filtrosAtivos.ufs.includes(item.uf))
    .map(item => item.municipio)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  filtrosAtivos.municipios = filtrosAtivos.municipios.filter(municipio => municipiosDisponiveis.includes(municipio));
  setDropdownOptions("filtroMunicipioEucaliptoMenu", municipiosDisponiveis);
  marcarDropdown("filtroMunicipioEucaliptoMenu", filtrosAtivos.municipios);
}

function limparFiltros() {
  Object.assign(filtrosAtivos, {
    indicador: "all",
    anoInicio: "2012",
    anoFim: "2021",
    produtos: [],
    ufs: [],
    municipios: [],
    topRanking: 10,
    minimoRanking: 0
  });
  document.querySelectorAll("[data-filter-group='indicador'] .filter-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === "all"));
  document.querySelectorAll(".filter-dropdown-menu input[type='checkbox']").forEach(input => { input.checked = false; });
  ["buscaProdutoEucalipto", "buscaUfEucalipto", "buscaMunicipioEucalipto"].forEach(id => { const input = document.getElementById(id); if (input) input.value = ""; });
  document.querySelectorAll("[data-filter-option]").forEach(option => { option.style.display = ""; });
  atualizarMunicipiosDisponiveis();
  document.getElementById("filtroAnoInicioEucalipto").value = filtrosAtivos.anoInicio;
  document.getElementById("filtroAnoFimEucalipto").value = filtrosAtivos.anoFim;
  document.getElementById("filtroTopRankingEucalipto").value = String(filtrosAtivos.topRanking);
  document.getElementById("filtroFaixaRankingEucalipto").value = String(filtrosAtivos.minimoRanking);
  atualizarLabelsDropdowns();
  atualizarGraficos();
}

function inicializarFiltros() {
  setSelectOptions("filtroAnoInicioEucalipto", anosDisponiveis);
  setSelectOptions("filtroAnoFimEucalipto", anosDisponiveis);
  document.getElementById("filtroAnoInicioEucalipto").value = filtrosAtivos.anoInicio;
  document.getElementById("filtroAnoFimEucalipto").value = filtrosAtivos.anoFim;
  setDropdownOptions("filtroProdutoEucaliptoMenu", produtosEucalipto.map(produto => produto.campo), campo => produtosEucalipto.find(produto => produto.campo === campo).nome);
  setDropdownOptions("filtroUfEucaliptoMenu", Array.from(new Set(dadosRankingProducao.map(item => item.uf))).sort());
  setDropdownOptions("filtroMunicipioEucaliptoMenu", dadosRankingProducao.map(item => item.municipio).sort((a, b) => a.localeCompare(b, "pt-BR")));
  conectarBuscaDropdown("buscaProdutoEucalipto", "filtroProdutoEucaliptoMenu");
  conectarBuscaDropdown("buscaUfEucalipto", "filtroUfEucaliptoMenu");
  conectarBuscaDropdown("buscaMunicipioEucalipto", "filtroMunicipioEucaliptoMenu");
  ["filtroAnoInicioEucalipto", "filtroAnoFimEucalipto", "filtroTopRankingEucalipto", "filtroFaixaRankingEucalipto"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", lerFiltrosFormulario);
  });
  ["filtroProdutoEucaliptoMenu", "filtroUfEucaliptoMenu", "filtroMunicipioEucaliptoMenu"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", lerFiltrosFormulario);
  });
  document.querySelectorAll("[data-tab]").forEach(botao => {
    botao.addEventListener("click", () => window.setTimeout(atualizarVisibilidadeCards, 0));
  });
  document.getElementById("btnLimparFiltrosEucalipto")?.addEventListener("click", limparFiltros);
  atualizarLabelsDropdowns();
}

function inicializarGraficos() {
  criarGraficoLinhasProdutos("chartQuantidadeProduzidaEucalipto", dadosQuantidadeProduzida, "un.");
  criarGraficoRankingProducao();
  criarGraficoValorProducao();
  criarGraficoParticipacaoValor();
}

function inicializarDashboardEucalipto() {
  inicializarFiltros();
  inicializarGraficos();
  atualizarGraficos();
}

window.onFilterChange = function (filterId, group) {
  if (group !== "indicador") return;
  filtrosAtivos.indicador = filterId;
  atualizarGraficos();
};

am5.ready(inicializarDashboardEucalipto);
