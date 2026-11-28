/**
 * Dashboard do eucalipto.
 *
 * A carga da API preenche cada conjunto disponível, recalcula anos e filtros e,
 * por fim, atualiza gráficos, KPIs e textos a partir de `filtrosAtivos`.
 */
const P = ["#2d5c24", "#c8943a", "#a0622b", "#4a7c3f", "#6fa65e", "#e8a84c", "#7fb069", "#5c4033", "#1a4a18", "#d4a843"];

const produtosEucalipto = [
  { campo: "carvao", nome: "Carvão vegetal de eucalipto", nomeCurto: "Carvão vegetal", unidade: "t", cor: P[2] },
  { campo: "lenha", nome: "Lenha de eucalipto", nomeCurto: "Lenha", unidade: "m³", cor: P[1] },
  { campo: "papelCelulose", nome: "Madeira para papel e celulose", nomeCurto: "Papel e celulose", unidade: "m³", cor: P[0] },
  { campo: "outrasFinalidades", nome: "Madeira para outras finalidades", nomeCurto: "Outras finalidades", unidade: "m³", cor: P[3] },
  { campo: "folha", nome: "Eucalipto (folha)", nomeCurto: "Folha", unidade: "t", cor: P[4] }
];

let dadosRankingProducao = [];
let dadosQuantidadeProduzida = [];
let dadosValorProducao = [];
let dadosParticipacaoValor = [];

let anosDisponiveis = [];
// Estado canônico dos filtros; os controles do DOM apenas leem e escrevem aqui.
const filtrosAtivos = {
  indicador: "all",
  anoInicio: anosDisponiveis[0],
  anoFim: anosDisponiveis[anosDisponiveis.length - 1],
  produtos: [],
  ufs: [],
  municipios: [],
  topRanking: 10,
  minimoRanking: 0
};
const graficos = {};

// Verifica se um container opcional existe antes de tentar criar seu gráfico.
function existe(id) {
  return !!document.getElementById(id);
}

// Formata números no padrão brasileiro com quantidade controlada de casas.
function formatarNumero(valor, casas = 0) {
  return Number(valor || 0).toLocaleString("pt-BR", { maximumFractionDigits: casas, minimumFractionDigits: casas });
}

// Abrevia valores grandes e devolve também a unidade usada no cartão de KPI.
function formatarCompacto(valor, unidade) {
  const numero = Number(valor || 0);
  if (numero >= 1000000000) return `${formatarNumero(numero / 1000000000, 2)}<span class="kpi-unit">bi ${unidade}</span>`;
  if (numero >= 1000000) return `${formatarNumero(numero / 1000000, 2)}<span class="kpi-unit">mi ${unidade}</span>`;
  if (numero >= 1000) return `${formatarNumero(numero / 1000, 1)}<span class="kpi-unit">mil ${unidade}</span>`;
  return `${formatarNumero(numero)}<span class="kpi-unit">${unidade}</span>`;
}

// Padroniza a apresentação dos rótulos dos eixos.
function configurarEixo(eixo) {
  eixo.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif", fill: am5.color("#5a5a5a") });
}

// Cria e configura a raiz do amCharts para um container.
function criarRoot(containerId) {
  const root = am5.Root.new(containerId);
  root.setThemes([am5themes_Animated.new(root)]);
  root.numberFormatter.set("numberFormat", "#,###.##");
  return root;
}

// Adiciona uma legenda com estilo comum aos gráficos.
function criarLegenda(chart, root) {
  const legenda = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  legenda.labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif" });
  return legenda;
}

// Cria a estrutura base de um gráfico XY e devolve suas referências.
function inicializarXY(containerId, opcoes = {}) {
  const root = criarRoot(containerId);
  const chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    layout: opcoes.layoutVertical ? root.verticalLayout : undefined
  }));
  return { root, chart };
}

// Preenche um select simples preservando os valores recebidos.
function setSelectOptions(id, valores) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = valores.map(valor => `<option value="${valor}">${valor}</option>`).join("");
}

// Reconstrói as opções de um dropdown de checkboxes.
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

// Restaura no DOM quais opções de um dropdown estão selecionadas.
function marcarDropdown(menuId, valores) {
  const selecionados = new Set(valores);
  document.querySelectorAll(`#${menuId} input[type='checkbox']`).forEach(input => {
    input.checked = selecionados.has(input.value);
  });
}

// Lê do dropdown os valores atualmente marcados.
function selecionadosDropdown(menuId) {
  return Array.from(document.querySelectorAll(`#${menuId} input:checked`)).map(input => input.value);
}

// Resume a quantidade de opções escolhidas no botão que abre o dropdown.
function atualizarLabelDropdown(btnId, valores, labelVazio) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.textContent = valores.length ? `${valores.length} selecionado${valores.length > 1 ? "s" : ""}` : labelVazio;
}

// Filtra visualmente as opções de um dropdown conforme o texto digitado.
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

function fontesEucalipto() {
  const fontes = {
    producao: dadosQuantidadeProduzida,
    valor: [...dadosValorProducao, ...dadosParticipacaoValor],
    ranking: dadosRankingProducao,
    all: [...dadosQuantidadeProduzida, ...dadosValorProducao, ...dadosParticipacaoValor, ...dadosRankingProducao]
  };
  return fontes[filtrosAtivos.indicador] || [];
}

function sincronizarAnosEucalipto() {
  const anos = anosDisponiveis;
  const noIntervalo = anos.filter(ano => Number(ano) >= Number(filtrosAtivos.anoInicio) && Number(ano) <= Number(filtrosAtivos.anoFim));
  filtrosAtivos.anoInicio = noIntervalo[0] || anos[0] || "";
  filtrosAtivos.anoFim = noIntervalo.at(-1) || anos.at(-1) || "";
  ["Inicio", "Fim"].forEach((extremo, indice) => {
    const id = `filtroAno${extremo}Eucalipto`;
    setSelectOptions(id, anos);
    const select = document.getElementById(id);
    select.value = indice === 0 ? filtrosAtivos.anoInicio : filtrosAtivos.anoFim;
    select.disabled = !anos.length;
  });
}

function produtosDisponiveisEucalipto() {
  const indicador = filtrosAtivos.indicador;
  const series = filtrarPeriodo(fontesEucalipto());
  return produtosEucalipto.filter(produto => filtrosAtivos.produtos.includes(produto.campo)
    || series.some(item => temMedicao(item[produto.campo]))
    || ((indicador === "all" || indicador === "ranking") && produto.campo === "papelCelulose"
      && dadosRankingProducao.length));
}

function dadosRankingNoPeriodo() {
  return dadosRankingProducao.filter(item => item.ano >= Number(filtrosAtivos.anoInicio)
    && item.ano <= Number(filtrosAtivos.anoFim) && temMedicao(item.quantidadeProduzida));
}

function produtoCompativelComRanking() {
  return !filtrosAtivos.produtos.length || filtrosAtivos.produtos.includes("papelCelulose");
}

// Resolve os metadados completos dos produtos selecionados pelo usuário.
function produtosSelecionados() {
  return produtosDisponiveisEucalipto().filter(produto => !filtrosAtivos.produtos.length || filtrosAtivos.produtos.includes(produto.campo));
}

// Mantém somente registros cujo ano pertence ao período ativo.
function filtrarPeriodo(data) {
  const inicio = Number(filtrosAtivos.anoInicio);
  const fim = Number(filtrosAtivos.anoFim);
  return data.filter(item => item.ano >= inicio && item.ano <= fim).map(item => ({ ...item, ano: String(item.ano) }));
}

// Obtém o último ano do intervalo para cálculos de fotografia atual.
function anoFinalSelecionado() {
  const anos = filtrarPeriodo(dadosParticipacaoValor).map(item => Number(item.ano));
  return anos.length ? Math.max(...anos) : Number(filtrosAtivos.anoFim);
}

// Alterna entre o gráfico e sua mensagem de ausência de dados.
function atualizarAvisoEucalipto(id, temDados) {
  let mensagem = temDados ? "" : avisoSemDadosGrafico;
  if (!temDados && id === "chartRankingProducaoEucalipto") {
    mensagem = dadosRankingNoPeriodo().length ? "Nenhum município do ranking atende aos filtros escolhidos."
      : "Não há dados do ranking no período escolhido.";
  }
  const filtroAtivo = filtrosAtivos.indicador !== "all" || filtrosAtivos.produtos.length || filtrosAtivos.ufs.length
    || filtrosAtivos.municipios.length || filtrosAtivos.topRanking !== 10 || filtrosAtivos.minimoRanking !== 0
    || periodoGraficoFiltrado("filtroAnoInicioEucalipto", "filtroAnoFimEucalipto");
  mostrarAvisoGrafico(id, mensagem, filtroAtivo);
}

// Cria um gráfico de linhas reutilizável para os diferentes produtos.
function criarGraficoLinhasProdutos(containerId, dataSource, unidadePadrao) {
  if (!existe(containerId)) return;
  const { root, chart } = inicializarXY(containerId, { layoutVertical: true });
  ativarTooltipDeSeries(chart, root);
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
  const legenda = criarLegenda(chart, root);

  graficos[containerId] = {
    // Atualiza o período e alterna os produtos selecionados.
    update(data, produtos) {
      const ativos = new Set(produtos.filter(produto => data.some(row => temMedicao(row[produto.campo])))
        .map(produto => produto.campo));
      eixoX.data.setAll(data);
      Object.entries(series).forEach(([campo, serie]) => {
        const visivel = ativos.has(campo);
        serie.data.setAll(visivel ? data : []);
        serie.set("visible", visivel);
        serie.set("forceHidden", !visivel);
      });
      legenda.data.setAll([...ativos].map(campo => series[campo]));
      atualizarAvisoEucalipto(containerId, ativos.size > 0);
    }
  };
  graficos[containerId].update(filtrarPeriodo(dataSource), produtosSelecionados());
  chart.appear(800, 80);
}

// Cria as séries do valor de produção e registra sua função de atualização.
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
      stroke: am5.color(produto.cor)
    }));
    serie.columns.template.setAll({
      cornerRadiusTL: 2, cornerRadiusTR: 2, width: am5.percent(60), interactive: true,
      tooltipText: `${produto.nome} ({categoryX}): R$ {valueY} mil`
    });
    series[produto.campo] = serie;
  });
  const legenda = criarLegenda(chart, root);

  graficos[containerId] = {
    // Cada produto visível ocupa uma posição no grupo de colunas do ano.
    update(data, produtos) {
      const ativos = new Set(produtos.filter(produto => data.some(row => temMedicao(row[produto.campo])))
        .map(produto => produto.campo));
      eixoX.data.setAll(data);
      Object.entries(series).forEach(([campo, serie]) => {
        const visivel = ativos.has(campo);
        serie.data.setAll(visivel ? data : []);
        serie.setAll({ visible: visivel, forceHidden: !visivel, clustered: visivel });
      });
      legenda.data.setAll([...ativos].map(campo => series[campo]));
      atualizarAvisoEucalipto(containerId, ativos.size > 0);
    }
  };
  graficos[containerId].update(filtrarPeriodo(dadosValorProducao), produtosSelecionados());
  chart.appear(800, 80);
}

// Cria o ranking horizontal de municípios por quantidade produzida.
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
    baseAxis: eixoY,
    fill: am5.color(P[0]),
    stroke: am5.color(P[0]),
    tooltip: am5.Tooltip.new(root, { labelText: "#{ranking} {localidade}: {valueX} m³" })
  }));
  serie.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
  ativarTooltipDeSeries(chart, root);

  graficos[containerId] = {
    // Atualiza categorias, colunas e estado vazio do ranking.
    update(data) {
      const dados = [...data].reverse();
      eixoY.data.setAll(dados);
      serie.data.setAll(dados);
      atualizarAvisoEucalipto(containerId, dados.length > 0);
    }
  };
  graficos[containerId].update(dadosRankingFiltrados());
  chart.appear(800, 80);
}

// Cria a composição percentual do valor no ano final selecionado.
function criarGraficoParticipacaoValor() {
  const containerId = "chartParticipacaoValorEucalipto";
  const { root, chart } = inicializarXY(containerId);
  const eixoY = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "produto", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 16 }) }));
  const eixoX = chart.xAxes.push(am5xy.ValueAxis.new(root, { min: 0, max: 100, strictMinMax: true, renderer: am5xy.AxisRendererX.new(root, {}) }));
  configurarEixo(eixoX); configurarEixo(eixoY);
  eixoY.get("renderer").labels.template.setAll({ oversizedBehavior: "truncate", maxWidth: 145 });

  const serie = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Participação no valor",
    xAxis: eixoX,
    yAxis: eixoY,
    valueXField: "percentualParticipacaoValor",
    categoryYField: "produto",
    baseAxis: eixoY,
    tooltip: am5.Tooltip.new(root, { labelText: "{categoryY}: {valueX}%" })
  }));
  serie.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
  ativarTooltipDeSeries(chart, root);
  serie.columns.template.adapters.add("fill", (fill, target) => am5.color(target.dataItem?.dataContext?.cor || P[0]));
  serie.columns.template.adapters.add("stroke", (stroke, target) => am5.color(target.dataItem?.dataContext?.cor || P[0]));

  graficos[containerId] = {
    // Atualiza percentuais e estado vazio da participação.
    update(data) {
      const dados = [...data].reverse();
      eixoY.data.setAll(dados);
      serie.data.setAll(dados);
      atualizarAvisoEucalipto(containerId, dados.length > 0);
    }
  };
  graficos[containerId].update(dadosParticipacaoFiltrados());
  chart.appear(800, 80);
}

// Aplica UF, município, faixa e limite de posições ao ranking.
function dadosRankingFiltrados() {
  if (!produtoCompativelComRanking()) return [];
  return dadosRankingNoPeriodo()
    .filter(item => !filtrosAtivos.ufs.length || filtrosAtivos.ufs.includes(item.estado))
    .filter(item => !filtrosAtivos.municipios.length || filtrosAtivos.municipios.includes(item.municipio))
    .filter(item => item.quantidadeProduzida >= filtrosAtivos.minimoRanking)
    .sort((a, b) => b.quantidadeProduzida - a.quantidadeProduzida)
    .slice(0, filtrosAtivos.topRanking)
    .map((item, indice) => ({ ...item, ranking: indice + 1 }));
}

// Prepara as fatias de participação dos produtos no último ano do período.
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
      estado: itemAno.estado
    }))
    .filter(item => item.percentualParticipacaoValor !== null && item.percentualParticipacaoValor !== undefined);
}

// Recalcula cartões de destaque usando somente conjuntos recebidos com sucesso.
function atualizarKpis() {
  const ano = anoFinalSelecionado();
  const produtos = produtosSelecionados();
  const quantidadeAno = dadosQuantidadeProduzida.find(item => Number(item.ano) === ano) || {};
  const valorAno = dadosValorProducao.find(item => Number(item.ano) === ano) || {};
  const participacaoAno = dadosParticipacaoValor.find(item => Number(item.ano) === ano) || {};

  const liderQuantidade = produtos
    .filter(produto => temMedicao(quantidadeAno[produto.campo]))
    .map(produto => ({ produto, valor: Number(quantidadeAno[produto.campo]) }))
    .sort((a, b) => b.valor - a.valor)[0];
  const valorDisponivel = produtos.length && produtos.every(produto => temMedicao(valorAno[produto.campo]));
  const valorTotal = produtos.reduce((total, produto) => total + Number(valorAno[produto.campo]), 0);
  const liderParticipacao = produtos
    .filter(produto => temMedicao(participacaoAno[produto.campo]))
    .map(produto => ({ produto, valor: Number(participacaoAno[produto.campo]) }))
    .sort((a, b) => b.valor - a.valor)[0];
  const ranking = dadosRankingFiltrados()[0];

  if (estadoApiEucalipto.quantidade) {
    document.getElementById("kpiQuantidadeLider").innerHTML = liderQuantidade ? formatarCompacto(liderQuantidade.valor, liderQuantidade.produto.unidade) : "—";
    document.getElementById("kpiQuantidadeLiderBadge").textContent = liderQuantidade ? `${liderQuantidade.produto.nomeCurto} · ${ano}` : "Dados indisponíveis";
  }
  if (estadoApiEucalipto.ranking) {
    document.getElementById("kpiRankingLider").innerHTML = ranking ? formatarCompacto(ranking.quantidadeProduzida, "m³") : "—";
    document.getElementById("kpiRankingLiderBadge").textContent = ranking ? `${ranking.localidade} · ${ranking.ano}` : "Dados indisponíveis";
  }
  if (estadoApiEucalipto.valor) {
    document.getElementById("kpiValorTotal").innerHTML = valorDisponivel ? formatarCompacto(valorTotal * 1000, "R$") : "—";
    document.getElementById("kpiValorTotalBadge").textContent = valorDisponivel ? `Tabela 2 · ${ano}` : "Dados indisponíveis";
  }
  if (estadoApiEucalipto.participacao) {
    document.getElementById("kpiParticipacaoLider").innerHTML = liderParticipacao ? `${formatarNumero(liderParticipacao.valor, 2)}<span class="kpi-unit">%</span>` : "—";
    document.getElementById("kpiParticipacaoLiderBadge").textContent = liderParticipacao ? `${liderParticipacao.produto.nomeCurto} · ${ano}` : "Dados indisponíveis";
  }
}

// Atualiza séries, KPIs, chips e visibilidade a partir do estado corrente.
function atualizarGraficos() {
  atualizarVisibilidadeCards();
  const produtos = produtosSelecionados();
  graficos.chartQuantidadeProduzidaEucalipto?.update(filtrarPeriodo(dadosQuantidadeProduzida), produtos);
  graficos.chartRankingProducaoEucalipto?.update(dadosRankingFiltrados());
  graficos.chartValorProducaoEucalipto?.update(filtrarPeriodo(dadosValorProducao), produtos);
  graficos.chartParticipacaoValorEucalipto?.update(dadosParticipacaoFiltrados());
  atualizarKpis();
  atualizarResumoFiltros();
}

// Mantém os gráficos e destaques alinhados com os filtros do painel.
function atualizarVisibilidadeCards() {
  const filtroLocal = filtrosAtivos.ufs.length || filtrosAtivos.municipios.length;
  const rankingCompativel = produtoCompativelComRanking();
  document.querySelectorAll("[data-category]").forEach(coluna => {
    const ranking = coluna.dataset.category === "ranking";
    const recorteOk = ranking ? rankingCompativel : !filtroLocal;
    coluna.classList.toggle("is-filter-hidden", !correspondeAoIndicador(coluna, filtrosAtivos.indicador) || !recorteOk);
  });
}

// Converte o estado atual em chips exibidos acima dos resultados.
function atualizarResumoFiltros() {
  const target = document.getElementById("filtrosAtivosEucalipto");
  if (!target) return;
  const chips = [
    `Indicador: ${filtrosAtivos.indicador === "all" ? "todos" : filtrosAtivos.indicador}`,
    filtrosAtivos.anoInicio ? `Período: ${filtrosAtivos.anoInicio}-${filtrosAtivos.anoFim}` : "",
    filtrosAtivos.produtos.length ? `Produtos: ${filtrosAtivos.produtos.length}` : "",
    filtrosAtivos.ufs.length ? `UF do ranking: ${filtrosAtivos.ufs.join(", ")}` : "",
    filtrosAtivos.municipios.length ? `Municípios do ranking: ${filtrosAtivos.municipios.length}` : ""
  ].filter(Boolean);
  target.innerHTML = chips.map(texto => `<span class="filter-chip">${texto}</span>`).join("");
}

// Copia controles do DOM para o estado e inicia uma nova renderização.
function lerFiltrosFormulario() {
  // Normaliza o intervalo antes de renderizar. Isso permite que o usuário
  // escolha as datas em qualquer ordem sem deixar o dashboard inconsistente.
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
  atualizarOpcoesRankingEucalipto();
  filtrosAtivos.topRanking = Number(document.getElementById("filtroTopRankingEucalipto")?.value || 10);
  filtrosAtivos.minimoRanking = Number(document.getElementById("filtroFaixaRankingEucalipto")?.value || 0);
  atualizarLabelsDropdowns();
  atualizarGraficos();
}

// Atualiza os rótulos dos três dropdowns após qualquer mudança.
function atualizarLabelsDropdowns() {
  atualizarLabelDropdown("filtroProdutoEucaliptoBtn", filtrosAtivos.produtos, "Todos");
  atualizarLabelDropdown("filtroUfEucaliptoBtn", filtrosAtivos.ufs, "Todas");
  atualizarLabelDropdown("filtroMunicipioEucaliptoBtn", filtrosAtivos.municipios, "Todos");
}

// Atualiza os controles do ranking e preserva filtros já selecionados.
function atualizarOpcoesRankingEucalipto() {
  const ranking = dadosRankingProducao;
  const filtrarRanking = (filtrosAtivos.indicador === "all" || filtrosAtivos.indicador === "ranking")
    && dadosRankingNoPeriodo().length > 0 && produtoCompativelComRanking();
  const ufs = [...new Set(ranking.map(item => item.estado).filter(Boolean))].sort();
  filtrosAtivos.ufs = filtrosAtivos.ufs.filter(uf => ufs.includes(uf));
  setDropdownOptions("filtroUfEucaliptoMenu", ufs);
  marcarDropdown("filtroUfEucaliptoMenu", filtrosAtivos.ufs);
  atualizarMunicipiosDisponiveis(ranking);
  const produtos = produtosDisponiveisEucalipto();
  setDropdownOptions("filtroProdutoEucaliptoMenu", produtos.map(produto => produto.campo), campo => produtos.find(produto => produto.campo === campo).nome);
  marcarDropdown("filtroProdutoEucaliptoMenu", filtrosAtivos.produtos);
  [
    ["Produto", produtos], ["Uf", ufs],
    ["Municipio", document.querySelectorAll("#filtroMunicipioEucaliptoMenu input")]
  ].forEach(([nome, opcoes]) => {
    document.getElementById(`filtro${nome}EucaliptoBtn`).disabled = !opcoes.length;
    document.getElementById(`busca${nome}Eucalipto`)?.dispatchEvent(new Event("input"));
  });
  ["filtroTopRankingEucalipto", "filtroFaixaRankingEucalipto"].forEach(id => {
    document.getElementById(id).disabled = !filtrarRanking;
  });
}

function atualizarMunicipiosDisponiveis(ranking) {
  // As escolhas atuais continuam disponíveis para desmarcar mesmo fora da UF selecionada.
  const municipiosDisponiveis = [...new Set(ranking
    .filter(item => !filtrosAtivos.ufs.length || filtrosAtivos.ufs.includes(item.estado)
      || filtrosAtivos.municipios.includes(item.municipio))
    .map(item => item.municipio).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  filtrosAtivos.municipios = filtrosAtivos.municipios.filter(municipio => municipiosDisponiveis.includes(municipio));
  setDropdownOptions("filtroMunicipioEucaliptoMenu", municipiosDisponiveis);
  marcarDropdown("filtroMunicipioEucaliptoMenu", filtrosAtivos.municipios);
}

// Restaura todos os filtros aos valores derivados da carga atual.
function limparFiltros() {
  Object.assign(filtrosAtivos, {
    indicador: "all",
    anoInicio: anosDisponiveis[0],
    anoFim: anosDisponiveis[anosDisponiveis.length - 1],
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
  sincronizarAnosEucalipto();
  atualizarOpcoesRankingEucalipto();
  document.getElementById("filtroTopRankingEucalipto").value = String(filtrosAtivos.topRanking);
  document.getElementById("filtroFaixaRankingEucalipto").value = String(filtrosAtivos.minimoRanking);
  atualizarLabelsDropdowns();
  atualizarGraficos();
}

// Popula os controles e registra seus eventos uma única vez.
function inicializarFiltros() {
  sincronizarAnosEucalipto();
  atualizarOpcoesRankingEucalipto();
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
    botao.addEventListener("click", () => {
      document.querySelector(".filter-bar--eucalipto").hidden = botao.dataset.tab !== "fl-co";
    });
  });
  document.getElementById("btnLimparFiltrosEucalipto")?.addEventListener("click", limparFiltros);
  atualizarLabelsDropdowns();
}

// Cria cada gráfico e armazena controladores de atualização em `graficos`.
function inicializarGraficos() {
  criarGraficoLinhasProdutos("chartQuantidadeProduzidaEucalipto", dadosQuantidadeProduzida, "un.");
  criarGraficoRankingProducao();
  criarGraficoValorProducao();
  criarGraficoParticipacaoValor();
}

// Prepara filtros, instancia gráficos e executa a primeira atualização.
function inicializarDashboardEucalipto() {
  // A ordem é importante: os gráficos precisam dos controles populados e só
  // depois recebem a primeira atualização completa.
  inicializarFiltros();
  inicializarGraficos();
  atualizarGraficos();
}

window.onFilterChange = function (filterId, group) {
  if (group !== "indicador") return;
  filtrosAtivos.indicador = filterId;
  sincronizarAnosEucalipto();
  atualizarOpcoesRankingEucalipto();
  atualizarLabelsDropdowns();
  atualizarGraficos();
};

const API_EUCALIPTO = "https://api.projetocerradoifg.org/webhook/eucalipto";
const ALVOS_API_EUCALIPTO = Object.freeze({
  quantidade: ["chartQuantidadeProduzidaEucalipto"],
  ranking: ["chartRankingProducaoEucalipto"],
  valor: ["chartValorProducaoEucalipto"],
  participacao: ["chartParticipacaoValorEucalipto"]
});
const estadoApiEucalipto = { quantidade: false, ranking: false, valor: false, participacao: false };

// Busca e valida um conjunto da API de eucalipto com limite de espera.
async function buscarEndpointEucalipto(nome) {
  // Cada recurso possui timeout próprio para que uma API lenta não trave a tela.
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const resposta = await fetch(`${API_EUCALIPTO}/${nome}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!resposta.ok) throw new Error(`${nome}: HTTP ${resposta.status}`);
    const dados = await resposta.json();
    if (!Array.isArray(dados) || !dados.length) throw new Error(`${nome}: resposta vazia`);
    return normalizarEstadoDaApi(dados);
  } finally {
    window.clearTimeout(timeout);
  }
}

// Coloca o KPI relacionado a um endpoint em loading ou indisponível.
function definirKpiEucalipto(chave, estado) {
  const ids = {
    quantidade: ["kpiQuantidadeLider", "kpiQuantidadeLiderBadge"],
    ranking: ["kpiRankingLider", "kpiRankingLiderBadge"],
    valor: ["kpiValorTotal", "kpiValorTotalBadge"],
    participacao: ["kpiParticipacaoLider", "kpiParticipacaoLiderBadge"]
  }[chave];
  ids?.forEach((id, indice) => {
    const elemento = document.getElementById(id);
    if (!elemento) return;
    elemento.textContent = indice === 0 ? "—" : (estado === "loading" ? "Carregando…" : "Dados indisponíveis");
  });
}

// Atualiza subtítulos e acessibilidade com o intervalo retornado pela API.
function atualizarTextosPeriodo() {
  if (!anosDisponiveis.length) return;
  const periodo = `${anosDisponiveis[0]}–${anosDisponiveis.at(-1)}`;
  const meta = document.querySelector(".page-hero__meta");
  if (meta) meta.textContent = `Fonte: IBGE — Tabela 291 · ${periodo}`;
  document.querySelectorAll("p").forEach(p => {
    if (p.textContent.includes("Tabela 291, quantidade produzida")) {
      p.textContent = `IBGE — Tabela 291, quantidade produzida e valor da produção na silvicultura · ${periodo}`;
    }
  });
  const subRanking = document.getElementById("chartRankingProducaoEucalipto")?.closest(".chart-card")?.querySelector(".chart-card__sub");
  const anoRanking = dadosRankingProducao[0]?.ano;
  if (subRanking && anoRanking) subRanking.textContent = `Tabela 1 — madeira para papel e celulose, municípios em ${anoRanking}`;
}

// Carrega endpoints independentes e aplica cada resposta ao seu grupo de cards.
async function carregarDadosEucalipto() {
  // As respostas são tratadas separadamente; um endpoint com erro não impede
  // que os demais gráficos sejam atualizados com dados válidos.
  Object.entries(ALVOS_API_EUCALIPTO).forEach(([nome, alvos]) => {
    window.dashboardDataUi.definirEstado(alvos, "loading");
    definirKpiEucalipto(nome, "loading");
  });
  dadosQuantidadeProduzida = [];
  dadosValorProducao = [];
  dadosParticipacaoValor = [];
  dadosRankingProducao = [];

  const nomes = Object.keys(ALVOS_API_EUCALIPTO);
  const resultados = await Promise.allSettled(nomes.map(buscarEndpointEucalipto));
  resultados.forEach((resultado, indice) => {
    const nome = nomes[indice];
    if (resultado.status === "fulfilled") {
      if (nome === "quantidade") dadosQuantidadeProduzida = resultado.value;
      if (nome === "ranking") dadosRankingProducao = resultado.value;
      if (nome === "valor") dadosValorProducao = resultado.value;
      if (nome === "participacao") dadosParticipacaoValor = resultado.value;
      estadoApiEucalipto[nome] = true;
      window.dashboardDataUi.definirEstado(ALVOS_API_EUCALIPTO[nome], "ready");
      window.dashboardDataUi.marcarFonte(ALVOS_API_EUCALIPTO[nome], "IBGE");
    } else {
      definirKpiEucalipto(nome, "error");
      window.dashboardDataUi.definirEstado(ALVOS_API_EUCALIPTO[nome], "error", "Não foi possível carregar os dados.");
      console.error(`Falha ao carregar dados de eucalipto (${nome}):`, resultado.reason);
    }
  });

  anosDisponiveis = Array.from(new Set([
    ...dadosQuantidadeProduzida, ...dadosValorProducao, ...dadosParticipacaoValor, ...dadosRankingProducao
  ].map(item => String(item.ano)).filter(ano => /^\d{4}$/.test(ano)))).sort((a, b) => Number(a) - Number(b));
  filtrosAtivos.anoInicio = anosDisponiveis[0] || "";
  filtrosAtivos.anoFim = anosDisponiveis.at(-1) || "";
  atualizarTextosPeriodo();
}

carregarDadosEucalipto().finally(() => am5.ready(inicializarDashboardEucalipto));
