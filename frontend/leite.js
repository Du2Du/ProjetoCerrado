const P = ["#4a7c3f", "#c8943a", "#a0622b", "#6fa65e", "#2d5c24", "#e8a84c", "#7fb069", "#5c4033", "#3a6b4a", "#d4a843"];

/**
 * Dashboard da pecuária de leite.
 *
 * A inicialização carrega os endpoints, converte as respostas para as estruturas
 * usadas pelos gráficos, deriva opções de filtro e então cria a interface. Toda
 * mudança posterior passa por `aplicarFiltros`, que mantém gráficos, tabelas,
 * KPIs e resumo visual sincronizados.
 */
const DADOS_LEITE = {
  producaoBilhoes: [],
  participacaoRegiao: [],
  producaoMeso: [],
  municipiosProducao: [],
  produtividadeMunicipios: [],
  rebanhoCO: [],
  vacasRegiao: [],
  produtividadeRegiao: [],
  vacasRegiaoSerie: [],
  vacasMeso: [],
  rankingConsumo: []
};

let SERIES_PRODUCAO_UF = [];
let SERIES_MESO = [];
let SERIES_VACAS_MESO = [];
let linhasMunicipais = [];
let linhasMesorregionais = [];
let SERIES_REGIAO = [];
let SERIES_UF_CO = [];
let TODOS_MUNICIPIOS = [];
let ANOS_PRODUTIVIDADE_MUNICIPIOS = [];
let PERIODO_PADRAO = { inicio: "", fim: "" };

const estadoFiltros = {
  indicador: "all",
  anoInicio: "",
  anoFim: "",
  regioes: [],
  ufs: [],
  municipios: [],
  produtos: []
};

const graficos = {};
const regioesPorUf = {
  Norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  Nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  Sudeste: ["ES", "MG", "RJ", "SP"],
  Sul: ["PR", "RS", "SC"]
};

const metadadosApi = {};

// `metadadosApi` registra a origem/estado de cada conjunto para que falhas
// parciais possam ser mostradas sem inutilizar o restante do dashboard.
const API_LEITE = "https://api.projetocerradoifg.org/webhook/leite";
const ENDPOINTS_LEITE = Object.freeze({
  producao: "producao-uf",
  regioes: "regioes",
  centroOeste: "centro-oeste",
  mesorregioes: "goias-meso",
  municipios: "goias-municipios",
  ranking: "ranking-consumo"
});

const ALVOS_API = Object.freeze({
  producao: ["chartLeiteSeries"],
  regioes: ["chartLeiteRegiao", "tabelaRegioesLeite", "chartVacasRegiao", "chartVacasRegiaoSerie", "chartProdutividade"],
  centroOeste: ["chartLeiteProducaoCO", "chartProducaoCentroOesteUf", "chartRebanhoCO"],
  mesorregioes: ["chartGoiasMeso", "chartGoiasMesoPie", "chartVacasGoias", "chartVacasMesoSerie"],
  municipios: ["chartMunicipios", "chartMunicipiosBars", "chartProdutividadeMunicipios", "tabelaProdutividadeMunicipios"],
  ranking: ["chartRankingConsumo"]
});

class ErroDadosVazios extends Error {}

// Remove duplicidades e devolve anos como strings em ordem crescente.
function ordenarAnos(anos) {
  return Array.from(new Set(anos.map(String).filter(ano => /^\d{4}$/.test(ano))))
    .sort((a, b) => Number(a) - Number(b));
}

// Resume uma coleção de anos como intervalo ou mensagem de indisponibilidade.
function periodoTexto(anos) {
  if (!anos.length) return "";
  return anos.length === 1 ? anos[0] : `${anos[0]}–${anos.at(-1)}`;
}

// Localiza o card visual associado a um id de gráfico, tabela ou KPI.
function containerVisualizacao(id) {
  const elemento = document.getElementById(id);
  if (!elemento) return null;
  if (elemento.classList.contains("chart-card") || elemento.classList.contains("table-card")) return elemento;
  return elemento.closest(".chart-card, .table-card");
}

// Aplica loading, erro ou vazio aos componentes relacionados a uma fonte.
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
    texto.textContent = mensagem || (estado === "loading" ? "Carregando dados do Servidor…" : "Dados indisponíveis.");
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

// Atualiza título, subtítulo e descrição acessível sem exigir todos os campos.
function atualizarTextoVisualizacao(id, { titulo, subtitulo, ariaLabel } = {}) {
  const container = containerVisualizacao(id);
  if (!container) return;
  if (titulo) container.querySelector(".chart-card__title").textContent = titulo;
  if (subtitulo) container.querySelector(".chart-card__sub").textContent = subtitulo;
  if (ariaLabel) {
    const figura = container.matches("[role='figure']") ? container : container.querySelector("[role='figure']");
    figura?.setAttribute("aria-label", ariaLabel);
    container.querySelector("table")?.setAttribute("aria-label", ariaLabel);
  }
}

// Acrescenta a identificação da API apenas uma vez em cada componente.
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

// Registra uma falha e converte os alvos correspondentes para o estado de erro.
function registrarFalhaApi(alvos, erro) {
  const semDados = erro instanceof ErroDadosVazios;
  definirEstadoVisualizacao(
    alvos,
    semDados ? "empty" : "error",
    semDados ? erro.message : "Não foi possível carregar os dados."
  );
  console.error("Falha ao carregar dados de Leite:", erro);
}

// Recalcula anos, séries, municípios e produtos após receber novos conjuntos.
function atualizarColecoesDinamicas() {
  const anos = ordenarAnos([
    ...DADOS_LEITE.producaoBilhoes.map(item => item.Ano),
    ...(metadadosApi.anosVacas || []),
    ...(metadadosApi.centroOesteLinhas || []).map(item => item.ano),
    ...linhasMesorregionais.map(item => item.ano),
    ...linhasMunicipais.map(item => item.ano),
    ...DADOS_LEITE.rankingConsumo.map(item => item.ano)
  ]);
  SERIES_REGIAO = Array.from(new Set([
    ...DADOS_LEITE.vacasRegiaoSerie.map(item => item.regiao),
    ...(metadadosApi.linhasRegioes || []).filter(item => temMedicao(item.producao)).map(item => item.regiao)
  ]));

  PERIODO_PADRAO = { inicio: anos[0] || "", fim: anos.at(-1) || "" };
  estadoFiltros.anoInicio = PERIODO_PADRAO.inicio;
  estadoFiltros.anoFim = PERIODO_PADRAO.fim;
}

// Busca e valida um conjunto da API de leite com limite de espera.
async function buscarEndpointLeite(nome) {
  // Aborta requisições demoradas e valida o contrato mínimo antes de entregar
  // os dados às funções de transformação.
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const resposta = await fetch(`${API_LEITE}/${nome}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!resposta.ok) throw new Error(`${nome}: HTTP ${resposta.status}`);
    const dados = await resposta.json();
    if (!Array.isArray(dados) || !dados.length) throw new ErroDadosVazios(`${nome}: resposta vazia`);
    return dados;
  } finally {
    window.clearTimeout(timeout);
  }
}

// Transpõe registros da API para uma linha anual com uma coluna por série.
function pivotarLeitePorAno(linhas, campoNome, campoValor, campoAno = "ano", transformarNome = nome => nome) {
  // Transforma linhas da API em uma matriz por ano, formato compartilhado pelas
  // séries de linha e barras do amCharts.
  return ordenarAnos(linhas.map(item => item.ano)).map(ano => {
    const linhaAno = { [campoAno]: Number(ano) };
    linhas.filter(item => String(item.ano) === ano && temMedicao(item[campoValor])).forEach(item => {
      linhaAno[transformarNome(item[campoNome])] = Number(item[campoValor]);
    });
    return linhaAno;
  });
}

// Agrupa registros por nome e preserva o valor informado em `nomeSaida`.
function pivotarLeitePorNome(linhas, campoNome, campoValor, nomeSaida) {
  return Array.from(new Set(linhas.map(item => item[campoNome]))).map(nome => {
    const linhaNome = { [nomeSaida]: nome };
    linhas.filter(item => item[campoNome] === nome && temMedicao(item[campoValor])).forEach(item => {
      linhaNome[String(item.ano)] = Number(item[campoValor]);
    });
    return linhaNome;
  });
}

// Preenche a tabela municipal respeitando período, municípios e produtos ativos.
function renderizarTabelaProdutividadeMunicipios(municipios) {
  const tabela = document.querySelector("#tabelaProdutividadeMunicipios table");
  if (!tabela) return;
  tabela.querySelector("tbody").replaceChildren();
  alternarCard("tabelaProdutividadeMunicipios", ANOS_PRODUTIVIDADE_MUNICIPIOS.length > 0 && municipios.length > 0);
  if (!ANOS_PRODUTIVIDADE_MUNICIPIOS.length) return;
  const anoInicial = ANOS_PRODUTIVIDADE_MUNICIPIOS[0];
  const anoFinal = ANOS_PRODUTIVIDADE_MUNICIPIOS.at(-1);
  const cabecalho = tabela.querySelectorAll("thead th");
  cabecalho[2].textContent = anoInicial;
  cabecalho[3].textContent = anoFinal;
  const dados = [...DADOS_LEITE.produtividadeMunicipios]
    .filter(item => municipios.includes(item.municipio) && Number.isFinite(item[anoFinal]))
    .sort((a, b) => b[anoFinal] - a[anoFinal]);
  dados.forEach((item, indice) => {
    const classe = indice === 1 ? " badge-rank--2" : indice === 2 ? " badge-rank--3" : "";
    const posicao = indice < 3 ? `<span class="badge-rank${classe}">${indice + 1}</span>` : indice + 1;
    const linha = tabela.querySelector("tbody").insertRow();
    linha.insertCell().innerHTML = posicao;
    linha.insertCell().textContent = item.municipio;
    [anoInicial, anoFinal].forEach(ano => {
      const celula = linha.insertCell();
      celula.className = "text-end num";
      celula.textContent = Number.isFinite(item[ano]) ? formatarNumeroKpi(item[ano], 0) : "—";
    });
  });
  document.querySelector("#tabelaProdutividadeMunicipios .chart-card__sub").textContent = `Litros / vaca / ano — ${anoInicial} & ${anoFinal}`;
}

// Carrega todas as fontes, normaliza sucessos e isola falhas por componente.
async function carregarDadosNovaApiLeite() {
  // Os endpoints são independentes. O resultado de cada um atualiza somente os
  // conjuntos e componentes relacionados àquela resposta.
  Object.values(ALVOS_API).flat().forEach(id => definirEstadoVisualizacao([id], "loading"));
  [
    "kpiLeiteBrasil", "kpiLeiteRecorte", "kpiLeiteRegiao", "kpiLeiteProdutividade",
    "kpiLeitePlanoProducaoCo", "kpiLeitePlanoProdutividadeCo", "kpiLeitePlanoProdutividadeSul"
  ].forEach(id => {
    document.getElementById(id)?.setAttribute("aria-busy", "true");
  });

  const nomes = Object.keys(ENDPOINTS_LEITE);
  const resultados = await Promise.allSettled(nomes.map(nome => buscarEndpointLeite(ENDPOINTS_LEITE[nome])));
  const resposta = Object.fromEntries(nomes.map((nome, indice) => [nome, resultados[indice]]));

  const processar = (nome, aplicar) => {
    if (resposta[nome].status !== "fulfilled") {
      registrarFalhaApi(ALVOS_API[nome], resposta[nome].reason);
      return false;
    }
    try {
      aplicar(resposta[nome].value);
      definirEstadoVisualizacao(ALVOS_API[nome], "ready");
      marcarFonteApi(ALVOS_API[nome]);
      return true;
    } catch (erro) {
      registrarFalhaApi(ALVOS_API[nome], erro);
      return false;
    }
  };

  processar("producao", linhas => {
    linhas = linhas.filter(item => item.uf && temMedicao(item.producaoBilhoesLitros));
    SERIES_PRODUCAO_UF = [...new Set(linhas.map(item => item.uf))];
    DADOS_LEITE.producaoBilhoes = pivotarLeitePorAno(linhas, "uf", "producaoBilhoesLitros", "Ano");
    metadadosApi.anosProducao = ordenarAnos(linhas.map(item => item.ano));
    atualizarTextoVisualizacao("chartLeiteSeries", {
      subtitulo: `Bilhões de litros por ano (${periodoTexto(metadadosApi.anosProducao)})`
    });
  });

  processar("regioes", linhas => {
    const anos = ordenarAnos(linhas.map(item => item.ano));
    DADOS_LEITE.vacasRegiaoSerie = pivotarLeitePorNome(linhas, "regiao", "vacas", "regiao");
    metadadosApi.anosVacas = anos;
    metadadosApi.linhasRegioes = linhas;
    atualizarTextoVisualizacao("chartVacasRegiaoSerie", { subtitulo: `Cabeças — ${periodoTexto(anos)}` });
  });

  processar("centroOeste", linhas => {
    metadadosApi.centroOesteLinhas = linhas;
    const linhasRebanho = linhas.filter(item => item.uf && temMedicao(item.rebanho));
    DADOS_LEITE.rebanhoCO = pivotarLeitePorNome(linhasRebanho, "uf", "rebanho", "uf");
    SERIES_UF_CO = DADOS_LEITE.rebanhoCO.map(item => item.uf).filter(uf => uf !== "Centro-Oeste");
  });

  processar("mesorregioes", linhas => {
    // Este endpoint só contém Goiás e não inclui UF no contrato atual.
    linhasMesorregionais = linhas.map(item => ({ ...item, uf: item.uf || "GO" }));
    SERIES_MESO = [...new Set(linhasMesorregionais.filter(item => temMedicao(item.producao)).map(item => item.mesorregiao))];
    SERIES_VACAS_MESO = [...new Set(linhasMesorregionais.filter(item => temMedicao(item.vacas)).map(item => item.mesorregiao))];
    const producaoMilhoes = linhasMesorregionais.filter(item => temMedicao(item.producao)).map(item => ({
      ...item, producaoMilhoes: Number(item.producao) / 1_000
    }));
    DADOS_LEITE.producaoMeso = pivotarLeitePorAno(producaoMilhoes, "mesorregiao", "producaoMilhoes");
    DADOS_LEITE.vacasMeso = pivotarLeitePorNome(linhasMesorregionais, "mesorregiao", "vacas", "mesorregiao");
  });

  processar("municipios", linhas => {
    // O endpoint atual oferece somente municípios selecionados de Goiás.
    linhasMunicipais = linhas.map(item => ({ ...item, uf: item.uf || "GO" }));
    TODOS_MUNICIPIOS = [...new Set(linhasMunicipais.filter(item => temMedicao(item.producao)).map(item => item.municipio))];
    DADOS_LEITE.municipiosProducao = pivotarLeitePorAno(linhasMunicipais, "municipio", "producao");
    DADOS_LEITE.produtividadeMunicipios = pivotarLeitePorNome(
      linhasMunicipais.filter(item => Number(item.vacas) > 0 && temMedicao(item.producao))
        .map(item => ({ ...item, produtividade: Number(item.producao) * 1_000 / Number(item.vacas) })),
      "municipio", "produtividade", "municipio"
    );
  });

  processar("ranking", linhas => {
    DADOS_LEITE.rankingConsumo = linhas.filter(item => item.uf && item.produto && temMedicao(item.posicao)).map(item => ({
      produto: item.produto, uf: item.uf, melhorPosicao: Number(item.posicao), ano: Number(item.ano),
      categoria: `${item.produto} — ${item.uf}`
    }));
  });

  atualizarColecoesDinamicas();
}

function atualizarRetratoRegionalLeite() {
  const linhas = filtrarLinhasPorAno(metadadosApi.linhasRegioes || []);
  const ano = ordenarAnos(linhas.filter(item => temMedicao(item.producao) || temMedicao(item.vacas)).map(item => item.ano)).at(-1);
  const atuais = linhas.filter(item => String(item.ano) === ano);
  const producao = atuais.filter(item => temMedicao(item.producao));
  const totalProducao = producao.reduce((soma, item) => soma + Number(item.producao), 0);
  const cobertura = new Set((metadadosApi.linhasRegioes || []).filter(item => temMedicao(item.producao)).map(item => item.regiao));
  const completa = totalProducao > 0 && new Set(producao.map(item => item.regiao)).size === cobertura.size;
  metadadosApi.anoRegioes = ano;
  DADOS_LEITE.participacaoRegiao = completa ? producao.map(item => ({
    regiao: item.regiao,
    producaoLeiteMilhoesLitros: Number(item.producao) / 1_000,
    percentualParticipacao: Number(item.producao) / totalProducao * 100
  })) : [];
  DADOS_LEITE.produtividadeRegiao = producao.filter(item => Number(item.vacas) > 0).map(item => ({
    regiao: item.regiao,
    produtividadeLitrosPorVacaAno: Number(item.producao) * 1_000 / Number(item.vacas)
  }));
  DADOS_LEITE.vacasRegiao = atuais.filter(item => temMedicao(item.vacas)).map(item => ({
    regiao: item.regiao,
    quantidadeVacasOrdenhadas: Number(item.vacas)
  }));
  [
    ["chartLeiteRegiao", "Participação Regional"],
    ["chartProdutividade", "Produtividade por Região"],
    ["chartVacasRegiao", "Vacas Ordenhadas por Região"],
    ["tabelaRegioesLeite", "Regiões Brasileiras"]
  ].forEach(([id, titulo]) => atualizarTextoVisualizacao(id, { titulo: ano ? `${titulo} (${ano})` : titulo }));
}

// Formata valores numéricos usados nos KPIs segundo a localidade brasileira.
function formatarNumeroKpi(valor, casas = 1) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  }).format(valor);
}

// Calcula e descreve a variação percentual entre a primeira e a última medição.
function variacaoKpi(atual, inicial, anoInicial) {
  if (!Number.isFinite(atual) || !Number.isFinite(inicial) || inicial === 0) {
    return { badge: "Série disponível no SIDRA", tone: "neutral" };
  }
  const percentual = (atual - inicial) / inicial * 100;
  const seta = percentual >= 0 ? "▲" : "▼";
  const sinal = percentual > 0 ? "+" : "";
  return {
    badge: `${seta} ${sinal}${formatarNumeroKpi(percentual, 1)}% vs ${anoInicial}`,
    tone: percentual >= 0 ? "up" : "down"
  };
}

// Atualiza os KPIs principais de produção, participação e produtividade.
function atualizarCardsLeite() {
  function preencherProducao(id, localidade) {
    const label = `Produção ${localidade}`;
    const codigo = codigoUfPainel(localidade);
    const nomeSerie = SERIES_PRODUCAO_UF.find(uf => codigoUfPainel(uf) === codigo);
    const regional = (metadadosApi.centroOesteLinhas || [])
      .filter(item => codigoUfPainel(item.uf) === codigo && temMedicao(item.producao))
      .map(item => ({ ano: item.ano, valor: Number(item.producao) / 1_000_000 }));
    const nacional = DADOS_LEITE.producaoBilhoes
      .filter(item => Number.isFinite(item[nomeSerie]))
      .map(item => ({ ano: item.Ano, valor: item[nomeSerie] }));
    const dados = new Map([...nacional, ...regional].map(item => [Number(item.ano), item]));
    if (localidade === "Centro-Oeste") {
      (metadadosApi.linhasRegioes || []).filter(item => item.regiao === localidade && temMedicao(item.producao)).forEach(item => {
        if (!dados.has(Number(item.ano))) dados.set(Number(item.ano), { ano: item.ano, valor: Number(item.producao) / 1_000_000 });
      });
    }
    const serie = filtrarLinhasPorAno([...dados.values()]).sort((a, b) => a.ano - b.ano);
    const atual = serie.at(-1);
    window.atualizarKpiComApi(id, atual ? {
      label: `${label} ${atual.ano}`,
      value: formatarNumeroKpi(atual.valor, 2),
      unit: "bi L",
      ...variacaoKpi(atual.valor, serie[0].valor, serie[0].ano)
    } : { label, state: "error" });
  }

  preencherProducao("kpiLeiteBrasil", "Brasil");
  const [uf] = estadoFiltros.ufs;
  if (estadoFiltros.ufs.length > 1) {
    window.atualizarKpiComApi("kpiLeiteRecorte", { label: "Produção das UFs selecionadas", state: "error" });
  } else {
    preencherProducao("kpiLeiteRecorte", uf || "Centro-Oeste");
  }
  preencherProducao("kpiLeitePlanoProducaoCo", "Centro-Oeste");

  const participacao = DADOS_LEITE.participacaoRegiao.find(item => item.regiao === "Centro-Oeste");
  if (participacao) {
    window.atualizarKpiComApi("kpiLeiteRegiao", {
      label: "Centro-Oeste na produção nacional",
      value: formatarNumeroKpi(participacao.percentualParticipacao, 1),
      unit: "%",
      badge: `${metadadosApi.anoRegioes} · ${formatarNumeroKpi(participacao.producaoLeiteMilhoesLitros / 1_000, 1)} bi L`,
      tone: "up"
    });
  } else {
    window.atualizarKpiComApi("kpiLeiteRegiao", { label: "Centro-Oeste na produção nacional", state: "error" });
  }

  const produtividadeCo = DADOS_LEITE.produtividadeRegiao.find(item => item.regiao === "Centro-Oeste");
  if (produtividadeCo && Number.isFinite(produtividadeCo.produtividadeLitrosPorVacaAno)) {
    window.atualizarKpiComApi("kpiLeiteProdutividade", {
      label: `Produtividade Centro-Oeste ${metadadosApi.anoRegioes}`,
      value: formatarNumeroKpi(produtividadeCo.produtividadeLitrosPorVacaAno, 0),
      unit: "L/vaca/ano",
      badge: "produção ÷ vacas ordenhadas",
      tone: "neutral"
    });
  } else {
    window.atualizarKpiComApi("kpiLeiteProdutividade", { label: "Produtividade Centro-Oeste", state: "error" });
  }
}

// Atualiza as comparações regionais do plano de intervenção.
function atualizarCardsSecundariosLeite() {
  [["kpiLeitePlanoProdutividadeCo", "Centro-Oeste"], ["kpiLeitePlanoProdutividadeSul", "Sul"]].forEach(([id, regiao]) => {
    const item = DADOS_LEITE.produtividadeRegiao.find(registro => registro.regiao === regiao);
    window.atualizarKpiComApi(id, item ? {
      label: `Produtividade ${regiao} ${metadadosApi.anoRegioes}`,
      value: formatarNumeroKpi(item.produtividadeLitrosPorVacaAno, 0),
      unit: "L/vaca/ano",
      badge: regiao === "Sul" ? "referência regional" : "média regional",
      tone: regiao === "Sul" ? "up" : "neutral"
    } : { label: `Produtividade ${regiao}`, state: "error" });
  });

  const produtividadeCo = DADOS_LEITE.produtividadeRegiao.find(item => item.regiao === "Centro-Oeste");
  const produtividadeSul = DADOS_LEITE.produtividadeRegiao.find(item => item.regiao === "Sul");
  const resumoPlano = document.getElementById("resumoPlanoLeite");
  if (resumoPlano) {
    const disponivel = Number.isFinite(produtividadeCo?.produtividadeLitrosPorVacaAno)
      && Number.isFinite(produtividadeSul?.produtividadeLitrosPorVacaAno);
    resumoPlano.classList.toggle("d-none", !disponivel);
    if (disponivel) {
      resumoPlano.textContent = `Em ${metadadosApi.anoRegioes}, a produtividade média foi de ${formatarNumeroKpi(produtividadeCo.produtividadeLitrosPorVacaAno, 0)} L/vaca/ano no Centro-Oeste e ${formatarNumeroKpi(produtividadeSul.produtividadeLitrosPorVacaAno, 0)} L/vaca/ano no Sul.`;
    }
  }
}

// Escolhe a classe visual positiva, negativa ou neutra para um percentual.
function classePercentual(percentual) {
  if (percentual >= 25) return "kpi-badge--up";
  if (percentual >= 10) return "kpi-badge--neutral";
  return "kpi-badge--down";
}

// Reconstrói a tabela regional e calcula sua variação no período exibido.
function renderizarTabelaRegioes(dados) {
  const tbody = document.getElementById("tabelaRegioesBody");
  if (!tbody) return;
  tbody.replaceChildren();

  const ordenados = [...dados].sort((a, b) => b.producaoLeiteMilhoesLitros - a.producaoLeiteMilhoesLitros);
  if (!ordenados.length) {
    const row = tbody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 3;
    cell.className = "table-empty-cell";
    cell.textContent = "Nenhuma região corresponde aos filtros selecionados.";
    return;
  }

  const formatoNumero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
  const formatoPercentual = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  ordenados.forEach(item => {
    const row = tbody.insertRow();
    row.insertCell().textContent = item.regiao;
    const producao = row.insertCell();
    producao.className = "text-end num";
    producao.textContent = formatoNumero.format(item.producaoLeiteMilhoesLitros);
    const participacao = row.insertCell();
    participacao.className = "text-end";
    const badge = document.createElement("span");
    badge.className = `kpi-badge ${classePercentual(item.percentualParticipacao)}`;
    badge.textContent = `${formatoPercentual.format(item.percentualParticipacao)}%`;
    participacao.append(badge);
  });

  const totalProducao = ordenados.reduce((soma, item) => soma + item.producaoLeiteMilhoesLitros, 0);
  const totalPercentual = ordenados.reduce((soma, item) => soma + item.percentualParticipacao, 0);
  const total = tbody.insertRow();
  total.className = "table-total-row";
  const titulo = total.insertCell();
  titulo.innerHTML = `<strong>${ordenados.length < DADOS_LEITE.participacaoRegiao.length ? "Total selecionado" : "Total"}</strong>`;
  const producao = total.insertCell();
  producao.className = "text-end num";
  producao.innerHTML = `<strong>${formatoNumero.format(totalProducao)}</strong>`;
  const percentual = total.insertCell();
  percentual.className = "text-end";
  percentual.innerHTML = `<strong>${formatoPercentual.format(totalPercentual)}%</strong>`;
}

// Verifica a presença de containers opcionais usados em páginas diferentes.
function existe(id) { return !!document.getElementById(id); }
// Padroniza tipografia e cor de um eixo do amCharts.
function eixo(axis) {
  axis.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif", fill: am5.color("#5a5a5a") });
}
// Cria a raiz de gráfico que hospedará eixos e séries.
function criarRoot(id) {
  const root = am5.Root.new(id);
  root.setThemes([am5themes_Animated.new(root)]);
  return root;
}
// Adiciona uma legenda centralizada ao gráfico informado.
function criarLegenda(chart, root) {
  const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  l.labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif" });
  return l;
}
// Resolve o card externo que controla a visibilidade do gráfico.
function cardDoGrafico(id) {
  return document.getElementById(id)?.closest("[class*='col-']");
}
// Oculta o card sem dados, preservando mensagens explícitas de erro ou vazio.
function alternarCard(id, visivel) {
  const coluna = cardDoGrafico(id);
  const container = containerVisualizacao(id);
  const preservaEstado = container?.classList.contains("data-card--error") || container?.classList.contains("data-card--empty");
  coluna?.classList.toggle("is-chart-empty", !visivel && !preservaEstado);
}
// Preenche um select e tenta preservar opções que já estavam marcadas.
function setSelectOptions(id, valores) {
  const select = document.getElementById(id);
  if (!select) return;
  const selecionadosAtuais = new Set(Array.from(select.selectedOptions || []).map(o => o.value));
  select.innerHTML = valores.map(v => `<option value="${v}"${selecionadosAtuais.has(v) ? " selected" : ""}>${v}</option>`).join("");
}
// Reconstrói as opções marcáveis de um dropdown.
function setDropdownOptions(menuId, valores, selecionados = []) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.replaceChildren(...valores.map(valor => {
    const label = document.createElement("label");
    label.className = "filter-option";
    label.dataset.filterOption = "";
    const input = document.createElement("input");
    input.className = "form-check-input mt-0";
    input.type = "checkbox";
    input.value = valor;
    input.checked = selecionados.includes(valor);
    const texto = document.createElement("span");
    texto.textContent = valor;
    label.append(input, texto);
    return label;
  }));
}
// Lê os valores selecionados em um dropdown de checkboxes.
function selecionadosDropdown(menuId) {
  return Array.from(document.querySelectorAll(`#${menuId} input:checked`)).map(input => input.value);
}
// Resume a seleção no texto do botão que abre o dropdown.
function atualizarLabelDropdown(btnId, valores, labelVazio) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.textContent = valores.length ? `${valores.length} selecionado${valores.length > 1 ? "s" : ""}` : labelVazio;
}
// Implementa pesquisa local entre as opções do dropdown.
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
// Recorta uma lista de anos segundo o período mantido no estado.
function anosNoPeriodo(anos) {
  const inicio = Number(estadoFiltros.anoInicio);
  const fim = Number(estadoFiltros.anoFim);
  return anos.filter(ano => Number(ano) >= inicio && Number(ano) <= fim);
}
// Filtra registros usando um campo de ano configurável.
function filtrarLinhasPorAno(data, campo = "ano") {
  const inicio = Number(estadoFiltros.anoInicio);
  const fim = Number(estadoFiltros.anoFim);
  return data.filter(d => Number(d[campo]) >= inicio && Number(d[campo]) <= fim);
}
// Retorna todas as séries quando o filtro está vazio ou somente as escolhidas.
function seriesSelecionadas(todas, filtro) {
  return filtro.length ? todas.filter(v => filtro.includes(v)) : todas;
}
// Verifica se uma série corresponde aos produtos atualmente selecionados.
function temIntersecaoProduto(nome) {
  return !estadoFiltros.produtos.length || estadoFiltros.produtos.includes(nome);
}

function regiaoDaUfLeite(uf) {
  const codigo = codigoUfPainel(uf);
  return Object.keys(regioesPorUf).find(regiao => regiao === uf || regioesPorUf[regiao].includes(codigo));
}

function ufNoRecorteRegionalLeite(uf) {
  const regioes = estadoFiltros.regioes.filter(regiao => Object.hasOwn(regioesPorUf, regiao));
  return !regioes.length || regioes.includes(regiaoDaUfLeite(uf));
}

function ufNoRankingLeite(uf) {
  if (!estadoFiltros.ufs.length && !estadoFiltros.regioes.length) return localidadeCentroOeste(uf);
  return ufSelecionadaLeite(uf) && ufNoRecorteRegionalLeite(uf);
}

function participacaoComComplemento(dados, recorte, categoria, medida, complemento) {
  if (!recorte.length || recorte.length === dados.length) return recorte;
  const restantes = dados.filter(item => !recorte.includes(item)).reduce((total, item) => total + item[medida], 0);
  return restantes > 0 ? [...recorte, { [categoria]: complemento, [medida]: restantes }] : recorte;
}
// Transpõe séries para linhas anuais prontas para os gráficos de evolução.
function dadosPorAno(data, campoNome, anos, series) {
  return anos.map(ano => {
    const row = { ano };
    series.forEach(nome => {
      const item = data.find(d => d[campoNome] === nome);
      row[nome] = item?.[ano];
    });
    return row;
  });
}
// Remapeia campos anuais para nomes comparativos como "Início" e "Fim".
function dadosAgrupadosPorAnos(data, categoria, series) {
  return data.map(item => {
    const row = { [categoria]: item[categoria] };
    series.forEach(serie => { row[serie.nome] = item[serie.ano]; });
    return row;
  }).filter(row => series.some(serie => Number.isFinite(row[serie.nome])));
}
// Monta duas referências usando os extremos do período selecionado.
function serieComparativa(anos, nomeInicio = "Início", nomeFim = "Fim") {
  if (!anos.length) return [];
  return [
    { nome: nomeInicio, ano: anos[0] },
    { nome: nomeFim, ano: anos.at(-1) }
  ];
}

// Cria um gráfico de linhas reutilizável e registra seu método de atualização.
function graficoLinhas(id, categoria, series, sufixo = "") {
  if (!existe(id)) return;
  const root = criarRoot(id);
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
  const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: categoria, renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 35 }), tooltip: am5.Tooltip.new(root, {}) }));
  const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  eixo(xA); eixo(yA);
  const seriesMap = {};
  series.forEach((nome, idx) => {
    const s = chart.series.push(am5xy.LineSeries.new(root, {
      name: nome, xAxis: xA, yAxis: yA, valueYField: nome, categoryXField: categoria,
      stroke: am5.color(P[idx % P.length]), fill: am5.color(P[idx % P.length]),
      tooltip: am5.Tooltip.new(root, { labelText: `{name}: {valueY}${sufixo}` })
    }));
    s.strokes.template.setAll({ strokeWidth: 2 });
    s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    seriesMap[nome] = s;
  });
  criarLegenda(chart, root).data.setAll(chart.series.values);
  graficos[id] = {
    // Substitui dados e alterna apenas as séries selecionadas no filtro.
    update(data, seriesAtivas = series) {
      const ativos = new Set(seriesAtivas.filter(nome => data.some(item => Number.isFinite(item[nome]))));
      xA.data.setAll(data);
      Object.entries(seriesMap).forEach(([nome, s]) => {
        const visivel = ativos.has(nome);
        s.data.setAll(data);
        s.set("visible", visivel);
        s.set("forceHidden", !visivel);
      });
      alternarCard(id, ativos.size > 0);
    }
  };
  chart.appear(800, 80);
}
// Cria barras verticais ou horizontais para uma única medida.
function graficoBarras(id, categoria, valor, horizontal = false, sufixo = "") {
  if (!existe(id)) return;
  const root = criarRoot(id);
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
  const cA = (horizontal ? chart.yAxes : chart.xAxes).push(am5xy.CategoryAxis.new(root, {
    categoryField: categoria,
    renderer: horizontal ? am5xy.AxisRendererY.new(root, { minGridDistance: 18 }) : am5xy.AxisRendererX.new(root, { minGridDistance: 12 })
  }));
  const vA = (horizontal ? chart.xAxes : chart.yAxes).push(am5xy.ValueAxis.new(root, { renderer: horizontal ? am5xy.AxisRendererX.new(root, {}) : am5xy.AxisRendererY.new(root, {}) }));
  eixo(cA); eixo(vA);
  cA.get("renderer").labels.template.setAll({ oversizedBehavior: "truncate", maxWidth: horizontal ? 130 : 90 });
  const s = chart.series.push(am5xy.ColumnSeries.new(root, {
    xAxis: horizontal ? vA : cA, yAxis: horizontal ? cA : vA,
    valueXField: horizontal ? valor : undefined, valueYField: horizontal ? undefined : valor,
    categoryYField: horizontal ? categoria : undefined, categoryXField: horizontal ? undefined : categoria,
    tooltip: am5.Tooltip.new(root, { labelText: `{categoryX}{categoryY}: {valueX}{valueY}${sufixo}` })
  }));
  s.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, cornerRadiusBR: horizontal ? 3 : 0 });
  s.columns.template.adapters.add("fill", (_fill, target) => am5.color(P[(target.dataItem?.get("index") || 0) % P.length]));
  s.columns.template.adapters.add("stroke", (_stroke, target) => am5.color(P[(target.dataItem?.get("index") || 0) % P.length]));
  graficos[id] = {
    // Atualiza categorias, colunas e estado vazio do gráfico.
    update(data) {
      cA.data.setAll(data);
      s.data.setAll(data);
      alternarCard(id, data.length > 0);
    }
  };
  chart.appear(800, 80);
}
// Cria barras lado a lado para comparar várias séries por categoria.
function graficoBarrasAgrupadas(id, categoria, series, sufixo = "") {
  if (!existe(id)) return;
  const root = criarRoot(id);
  const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
  const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: categoria, renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 12 }) }));
  const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
  eixo(xA); eixo(yA);
  xA.get("renderer").labels.template.setAll({ oversizedBehavior: "truncate", maxWidth: 100 });
  const seriesMap = {};
  series.forEach((cfg, idx) => {
    const s = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: cfg.nome, xAxis: xA, yAxis: yA, valueYField: cfg.campo, categoryXField: categoria, clustered: true,
      tooltip: am5.Tooltip.new(root, { labelText: `${cfg.nome}: {valueY}${sufixo}` })
    }));
    s.columns.template.setAll({ width: am5.percent(55), cornerRadiusTL: 3, cornerRadiusTR: 3, fill: am5.color(P[idx]), stroke: am5.color(P[idx]) });
    seriesMap[cfg.nome] = s;
  });
  criarLegenda(chart, root).data.setAll(chart.series.values);
  graficos[id] = {
    // Atualiza dados e mostra somente séries comparativas ainda aplicáveis.
    update(data, novasSeries = series) {
      xA.data.setAll(data);
      Object.entries(seriesMap).forEach(([nome, s]) => {
        const cfg = novasSeries.find(item => item.nome === nome);
        s.set("visible", !!cfg);
        s.set("forceHidden", !cfg);
        s.data.setAll(data);
      });
      alternarCard(id, data.length > 0 && novasSeries.length > 0);
    }
  };
  chart.appear(800, 80);
}
// Cria uma pizza e mantém legenda e fatias sincronizadas nas atualizações.
function graficoPizza(id, categoria, valor) {
  if (!existe(id)) return;
  const root = criarRoot(id);
  const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
  const s = chart.series.push(am5percent.PieSeries.new(root, { valueField: valor, categoryField: categoria }));
  s.labels.template.setAll({ fontSize: 10, fontFamily: "Arial,sans-serif" });
  s.get("colors").set("colors", P.map(c => am5.color(c)));
  const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 }));
  l.labels.template.setAll({ fontSize: 10, fontFamily: "Arial,sans-serif" });
  graficos[id] = {
    // Substitui fatias e reconstrói a legenda com os novos itens.
    update(data) {
      s.data.setAll(data);
      l.data.setAll(s.dataItems);
      alternarCard(id, data.length > 0);
    }
  };
  chart.appear(800, 80);
}

// Instancia todos os gráficos e seus controladores antes da primeira filtragem.
function inicializarEstruturaGraficos() {
  graficoLinhas("chartLeiteSeries", "ano", SERIES_PRODUCAO_UF, " bi L");
  graficoPizza("chartLeiteRegiao", "regiao", "percentualParticipacao");
  graficoBarras("chartProdutividade", "regiao", "produtividadeLitrosPorVacaAno", true, " L/vaca/ano");
  graficoBarras("chartVacasRegiao", "regiao", "quantidadeVacasOrdenhadas", true);
  graficoLinhas("chartVacasRegiaoSerie", "ano", SERIES_REGIAO);
  graficoLinhas("chartGoiasMeso", "ano", SERIES_MESO);
  graficoPizza("chartGoiasMesoPie", "mesorregiao", "producao");
  graficoBarrasAgrupadas("chartVacasGoias", "mesorregiao", [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  graficoLinhas("chartVacasMesoSerie", "ano", SERIES_VACAS_MESO);
  graficoBarras("chartLeiteProducaoCO", "uf", "producaoLeiteMilhoesLitros", false, " mil L");
  graficoBarras("chartProducaoCentroOesteUf", "uf", "producaoLeiteMilhoesLitros", false, " mil L");
  graficoLinhas("chartRebanhoCO", "ano", SERIES_UF_CO);
  graficoLinhas("chartMunicipios", "ano", TODOS_MUNICIPIOS);
  graficoBarrasAgrupadas("chartMunicipiosBars", "municipio", [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  graficoBarrasAgrupadas("chartProdutividadeMunicipios", "municipio", [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }], " L/vaca/ano");
  graficoBarras("chartRankingConsumo", "categoria", "melhorPosicao", true);
}

// Distribui dados filtrados a gráficos, tabelas, KPIs e estados visuais.
function aplicarFiltros() {
  // Este é o ciclo central de renderização do dashboard. Ele parte sempre de
  // `estadoFiltros`, filtra as coleções originais e distribui os resultados aos
  // gráficos, tabelas, KPIs e indicadores de visibilidade.
  atualizarRetratoRegionalLeite();
  const anosVacasRegiao = anosNoPeriodo(metadadosApi.anosVacas || []);
  const anosMeso = anosNoPeriodo(ordenarAnos(DADOS_LEITE.producaoMeso.map(d => d.ano)));
  const anosVacasMeso = anosNoPeriodo(ordenarAnos(DADOS_LEITE.vacasMeso.flatMap(d => Object.keys(d).filter(k => /^\d{4}$/.test(k)))));
  const anosRebanho = anosNoPeriodo(ordenarAnos(DADOS_LEITE.rebanhoCO.flatMap(d => Object.keys(d).filter(k => /^\d{4}$/.test(k)))));
  const anosMunicipios = anosNoPeriodo(ordenarAnos(DADOS_LEITE.municipiosProducao.map(d => d.ano)));
  const regioesSelecionadas = estadoFiltros.regioes;
  const regioes = estadoFiltros.ufs.length ? [] : seriesSelecionadas(SERIES_REGIAO, regioesSelecionadas);
  const retratoRegional = dados => dados.filter(item => regioes.includes(item.regiao));
  const mesorregioesComDados = new Set(filtrarLinhasPorAno(linhasMesorregionais)
    .filter(item => ufSelecionadaLeite(item.uf)).map(item => item.mesorregiao));
  const mesorregioes = seriesSelecionadas(SERIES_MESO, regioesSelecionadas).filter(nome => mesorregioesComDados.has(nome));
  const mesorregioesVacas = seriesSelecionadas(SERIES_VACAS_MESO, regioesSelecionadas).filter(nome => mesorregioesComDados.has(nome));
  const ufsProducao = SERIES_PRODUCAO_UF.filter(uf => ufSelecionadaLeite(uf) && ufNoRecorteRegionalLeite(uf));
  const recorteSoMesorregioes = regioesSelecionadas.some(regiao => !Object.hasOwn(regioesPorUf, regiao));
  const ufsCO = recorteSoMesorregioes ? [] : SERIES_UF_CO.filter(ufSelecionadaLeite);
  const municipios = seriesSelecionadas(municipiosDisponiveisLeite(), estadoFiltros.municipios);
  ANOS_PRODUTIVIDADE_MUNICIPIOS = anosNoPeriodo(ordenarAnos(DADOS_LEITE.produtividadeMunicipios
    .filter(item => municipios.includes(item.municipio))
    .flatMap(item => Object.keys(item).filter(chave => /^\d{4}$/.test(chave))))).slice(-2);
  const comparacaoVacasMeso = serieComparativa(anosVacasMeso);
  atualizarTextoVisualizacao("chartVacasGoias", {
    subtitulo: ["Cabeças", periodoTexto(anosVacasMeso)].filter(Boolean).join(" — ")
  });

  graficos.chartLeiteSeries?.update(filtrarLinhasPorAno(DADOS_LEITE.producaoBilhoes, "Ano").map(d => ({ ...d, ano: String(d.Ano) })), ufsProducao);
  const participacao = DADOS_LEITE.participacaoRegiao;
  const participacaoFiltrada = retratoRegional(participacao);
  graficos.chartLeiteRegiao?.update(participacaoComComplemento(
    participacao, participacaoFiltrada, "regiao", "percentualParticipacao", "Demais regiões"
  ));
  renderizarTabelaRegioes(participacaoFiltrada);
  alternarCard("tabelaRegioesLeite", participacaoFiltrada.length > 0);
  graficos.chartProdutividade?.update(retratoRegional(DADOS_LEITE.produtividadeRegiao));
  graficos.chartVacasRegiao?.update(retratoRegional(DADOS_LEITE.vacasRegiao));
  graficos.chartVacasRegiaoSerie?.update(dadosPorAno(DADOS_LEITE.vacasRegiaoSerie, "regiao", anosVacasRegiao, regioes), regioes);

  graficos.chartGoiasMeso?.update(filtrarLinhasPorAno(DADOS_LEITE.producaoMeso).map(d => ({ ...d, ano: String(d.ano) })), mesorregioes);
  const producaoMeso = Object.entries(DADOS_LEITE.producaoMeso.find(d => String(d.ano) === anosMeso.at(-1)) || {})
    .filter(([chave]) => chave !== "ano").map(([mesorregiao, producao]) => ({ mesorregiao, producao }));
  graficos.chartGoiasMesoPie?.update(participacaoComComplemento(
    producaoMeso, producaoMeso.filter(item => mesorregioes.includes(item.mesorregiao)),
    "mesorregiao", "producao", "Demais mesorregiões"
  ));
  graficos.chartVacasGoias?.update(dadosAgrupadosPorAnos(DADOS_LEITE.vacasMeso.filter(d => mesorregioesVacas.includes(d.mesorregiao)), "mesorregiao", comparacaoVacasMeso), [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  graficos.chartVacasMesoSerie?.update(dadosPorAno(DADOS_LEITE.vacasMeso, "mesorregiao", anosVacasMeso, mesorregioesVacas), mesorregioesVacas);
  const linhasCO = filtrarLinhasPorAno(metadadosApi.centroOesteLinhas || [])
    .filter(item => !recorteSoMesorregioes && item.uf !== "Centro-Oeste" && temMedicao(item.producao));
  const anoCO = ordenarAnos(linhasCO.filter(item => ufSelecionadaLeite(item.uf)).map(item => item.ano)).at(-1);
  const producaoCO = linhasCO.filter(item => String(item.ano) === anoCO && ufSelecionadaLeite(item.uf))
    .map(item => ({ uf: item.uf, producaoLeiteMilhoesLitros: Number(item.producao) }));
  ["chartLeiteProducaoCO", "chartProducaoCentroOesteUf"].forEach(id => {
    atualizarTextoVisualizacao(id, { subtitulo: anoCO ? `Mil litros — ${anoCO}` : "Mil litros" });
  });
  graficos.chartLeiteProducaoCO?.update(producaoCO);
  graficos.chartProducaoCentroOesteUf?.update(producaoCO);
  graficos.chartRebanhoCO?.update(dadosPorAno(DADOS_LEITE.rebanhoCO.filter(d => d.uf !== "Centro-Oeste"), "uf", anosRebanho, ufsCO), ufsCO);

  graficos.chartMunicipios?.update(filtrarLinhasPorAno(DADOS_LEITE.municipiosProducao).map(d => ({ ...d, ano: String(d.ano) })), municipios);
  graficos.chartMunicipiosBars?.update(municipios.map(municipio => ({ municipio, "Início": DADOS_LEITE.municipiosProducao.find(d => String(d.ano) === anosMunicipios[0])?.[municipio], "Fim": DADOS_LEITE.municipiosProducao.find(d => String(d.ano) === anosMunicipios.at(-1))?.[municipio] })).filter(d => d.Início !== undefined || d.Fim !== undefined).sort((a, b) => (b.Fim || 0) - (a.Fim || 0)).slice(0, 10), [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  const anoProdutividadeAtual = ANOS_PRODUTIVIDADE_MUNICIPIOS.at(-1);
  const produtividadeMunicipal = DADOS_LEITE.produtividadeMunicipios
    .filter(item => municipios.includes(item.municipio) && ANOS_PRODUTIVIDADE_MUNICIPIOS.some(ano => Number.isFinite(item[ano])))
    .sort((a, b) => (b[anoProdutividadeAtual] ?? -1) - (a[anoProdutividadeAtual] ?? -1));
  const comparacaoProdutividade = serieComparativa(ANOS_PRODUTIVIDADE_MUNICIPIOS);
  graficos.chartProdutividadeMunicipios?.update(
    dadosAgrupadosPorAnos(produtividadeMunicipal, "municipio", comparacaoProdutividade),
    comparacaoProdutividade
  );
  atualizarTextoVisualizacao("chartProdutividadeMunicipios", {
    subtitulo: ["Litros / vaca / ano", periodoTexto(ANOS_PRODUTIVIDADE_MUNICIPIOS)].filter(Boolean).join(" — ")
  });
  atualizarTextoVisualizacao("chartGoiasMesoPie", {
    titulo: anosMeso.length ? `Distribuição por Mesorregião (${anosMeso.at(-1)})` : "Distribuição por Mesorregião"
  });

  renderizarTabelaProdutividadeMunicipios(municipios);
  const ranking = filtrarLinhasPorAno(DADOS_LEITE.rankingConsumo)
    .filter(item => temIntersecaoProduto(item.produto) && ufNoRankingLeite(item.uf));
  const anoRanking = ordenarAnos(ranking.map(item => item.ano)).at(-1);
  const recorteRanking = estadoFiltros.ufs.length ? "UFs selecionadas" : estadoFiltros.regioes.join(", ") || "Centro-Oeste";
  atualizarTextoVisualizacao("chartRankingConsumo", {
    subtitulo: `Aquisição domiciliar per capita — ${recorteRanking}${anoRanking ? ` · POF ${anoRanking}` : ""}`
  });
  graficos.chartRankingConsumo?.update(ranking.filter(item => String(item.ano) === anoRanking));
  atualizarCardsLeite();
  atualizarCardsSecundariosLeite();

  atualizarVisibilidadeCards();
  atualizarResumoFiltros();
}

// Exibe apenas cards pertencentes ao indicador escolhido na barra de filtros.
function atualizarVisibilidadeCards() {
  const aba = document.querySelector("[data-tab-content].active");
  const categorias = new Set(Array.from(aba?.querySelectorAll("[data-category]") || [], el => el.dataset.category));
  document.querySelectorAll('[data-filter-group="indicador"] .filter-btn').forEach(btn => {
    btn.hidden = btn.dataset.filter !== "all" && !categorias.has(btn.dataset.filter);
  });
  document.querySelectorAll("[data-category]").forEach(el => {
    const categoriaOk = estadoFiltros.indicador === "all" || el.dataset.category === estadoFiltros.indicador;
    const produtoOk = !estadoFiltros.produtos.length || el.dataset.category === "mercado";
    el.classList.toggle("is-filter-hidden", !categoriaOk || !produtoOk);
  });
  const visiveis = [...(aba?.querySelectorAll("[data-category]") || [])].some(el =>
    el.querySelector(".chart-card, .table-card") && !el.matches(".is-filter-hidden, .is-chart-empty"));
  document.getElementById("semDadosLeite")?.style.setProperty("display", visiveis ? "none" : "block");
}
// Converte o estado atual em chips de leitura rápida.
function atualizarResumoFiltros() {
  const target = document.getElementById("filtrosAtivosLeite");
  if (!target) return;
  const chips = [
    `Indicador: ${estadoFiltros.indicador === "all" ? "todos" : estadoFiltros.indicador}`,
    estadoFiltros.anoInicio ? `Período: ${estadoFiltros.anoInicio}-${estadoFiltros.anoFim}` : "",
    estadoFiltros.regioes.length ? `Região: ${estadoFiltros.regioes.length}` : "",
    estadoFiltros.ufs.length ? `UF: ${estadoFiltros.ufs.length}` : "",
    estadoFiltros.municipios.length ? `Municípios: ${estadoFiltros.municipios.length}` : "",
    estadoFiltros.produtos.length ? `Produto do ranking: ${estadoFiltros.produtos.length}` : ""
  ].filter(Boolean);
  target.innerHTML = chips.map(texto => `<span class="filter-chip">${texto}</span>`).join("");
}
// Copia valores dos controles para `estadoFiltros` e redesenha o dashboard.
function lerFiltrosDeFormulario() {
  // Copia os valores do DOM para o estado antes de redesenhar; assim as funções
  // de gráfico não dependem diretamente dos controles HTML.
  estadoFiltros.anoInicio = document.getElementById("filtroAnoInicio")?.value || estadoFiltros.anoInicio;
  estadoFiltros.anoFim = document.getElementById("filtroAnoFim")?.value || estadoFiltros.anoFim;
  if (Number(estadoFiltros.anoInicio) > Number(estadoFiltros.anoFim)) {
    [estadoFiltros.anoInicio, estadoFiltros.anoFim] = [estadoFiltros.anoFim, estadoFiltros.anoInicio];
    document.getElementById("filtroAnoInicio").value = estadoFiltros.anoInicio;
    document.getElementById("filtroAnoFim").value = estadoFiltros.anoFim;
  }
  estadoFiltros.regioes = selecionadosDropdown("filtroRegiaoMenu");
  estadoFiltros.ufs = selecionadosDropdown("filtroUfMenu");
  estadoFiltros.municipios = selecionadosDropdown("filtroMunicipioMenu");
  estadoFiltros.produtos = selecionadosDropdown("filtroProdutoMenu");
  atualizarOpcoesDependentesLeite();
  atualizarLabelsDropdowns();
  aplicarFiltros();
}
function ufSelecionadaLeite(uf) {
  return !estadoFiltros.ufs.length || estadoFiltros.ufs.some(nome => codigoUfPainel(nome) === codigoUfPainel(uf));
}

function municipiosDisponiveisLeite() {
  const produtividade = estadoFiltros.indicador === "produtividade";
  return [...new Set(filtrarLinhasPorAno(linhasMunicipais)
    .filter(item => ufSelecionadaLeite(item.uf) && temMedicao(item.producao) && (!produtividade || Number(item.vacas) > 0))
    .map(item => item.municipio))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function fontesFiltrosLeite() {
  const aba = document.querySelector("[data-tab-content].active")?.id || "lt-brasil";
  const indicador = estadoFiltros.indicador;
  const aceita = (...indicadores) => indicador === "all" || indicadores.includes(indicador);
  const centroOeste = metadadosApi.centroOesteLinhas || [];
  const fontes = {};
  if (aba === "lt-brasil") {
    if (aceita("producao")) fontes.producao = DADOS_LEITE.producaoBilhoes;
    if (aceita("producao", "vacas", "produtividade")) {
      fontes.regioes = (metadadosApi.linhasRegioes || []).filter(item =>
        (aceita("producao") && temMedicao(item.producao))
        || (aceita("vacas") && temMedicao(item.vacas))
        || (aceita("produtividade") && temMedicao(item.producao) && Number(item.vacas) > 0));
    }
    if (aceita("mercado")) fontes.ranking = DADOS_LEITE.rankingConsumo;
    if (aceita("producao")) fontes.centroOeste = centroOeste.filter(item => temMedicao(item.producao));
  } else if (aba === "lt-mesorregioes") {
    if (aceita("producao", "vacas")) {
      fontes.mesorregioes = linhasMesorregionais.filter(item =>
        (aceita("producao") && temMedicao(item.producao)) || (aceita("vacas") && temMedicao(item.vacas)));
    }
    if (aceita("producao", "mercado")) {
      fontes.centroOeste = centroOeste.filter(item =>
        (aceita("producao") && temMedicao(item.producao)) || (aceita("mercado") && temMedicao(item.rebanho)));
    }
  } else if (aba === "lt-municipios" && aceita("producao", "produtividade")) {
    fontes.municipios = linhasMunicipais.filter(item => temMedicao(item.producao)
      && (aceita("producao") || Number(item.vacas) > 0));
  } else if (aba === "lt-plano" && aceita("producao")) {
    fontes.centroOeste = centroOeste.filter(item => temMedicao(item.producao));
  }
  return fontes;
}

function atualizarOpcoesDependentesLeite() {
  const fontes = fontesFiltrosLeite();
  const anos = ordenarAnos(Object.values(fontes).flat().map(item => item.ano ?? item.Ano));
  const noIntervalo = anosNoPeriodo(anos);
  estadoFiltros.anoInicio = noIntervalo[0] || anos[0] || "";
  estadoFiltros.anoFim = noIntervalo.at(-1) || anos.at(-1) || "";
  ["filtroAnoInicio", "filtroAnoFim"].forEach((id, indice) => {
    setSelectOptions(id, anos);
    const select = document.getElementById(id);
    select.value = indice === 0 ? estadoFiltros.anoInicio : estadoFiltros.anoFim;
    select.disabled = !anos.length;
  });

  const ufs = new Map();
  [
    ...filtrarLinhasPorAno(fontes.ranking || []).map(item => item.uf),
    ...filtrarLinhasPorAno(fontes.mesorregioes || []).map(item => item.uf),
    ...filtrarLinhasPorAno(fontes.municipios || []).map(item => item.uf),
    ...filtrarLinhasPorAno(fontes.producao || [], "Ano").flatMap(item => Object.keys(item).filter(chave => chave !== "Ano")),
    ...filtrarLinhasPorAno(fontes.centroOeste || []).map(item => item.uf)
  ].filter(uf => uf && uf !== "Centro-Oeste").forEach(uf => ufs.set(codigoUfPainel(uf), uf));

  const opcoesUf = [...ufs.values()];
  estadoFiltros.ufs = [...new Set(estadoFiltros.ufs.map(uf => ufs.get(codigoUfPainel(uf))).filter(Boolean))];
  const mesorregioes = filtrarLinhasPorAno(fontes.mesorregioes || [])
    .filter(item => ufSelecionadaLeite(item.uf)).map(item => item.mesorregiao);
  const regioes = [
    ...filtrarLinhasPorAno(fontes.regioes || []).map(item => item.regiao),
    ...filtrarLinhasPorAno(fontes.ranking || []).map(item => regiaoDaUfLeite(item.uf)).filter(Boolean)
  ];
  const produtos = (fontes.ranking || [])
    .filter(item => ufNoRankingLeite(item.uf) || estadoFiltros.produtos.includes(item.produto))
    .map(item => item.produto);
  const municipios = fontes.municipios ? municipiosDisponiveisLeite() : [];
  [
    ["Regiao", "regioes", [...regioes, ...mesorregioes]],
    ["Uf", "ufs", opcoesUf],
    ["Municipio", "municipios", municipios],
    ["Produto", "produtos", produtos]
  ].forEach(([controle, chave, valores]) => {
    const opcoes = [...new Set(valores)].sort((a, b) => a.localeCompare(b, "pt-BR"));
    estadoFiltros[chave] = estadoFiltros[chave].filter(item => opcoes.includes(item));
    setDropdownOptions(`filtro${controle}Menu`, opcoes, estadoFiltros[chave]);
    document.getElementById(`filtro${controle}Btn`).disabled = !opcoes.length;
    document.getElementById(`busca${controle}`)?.dispatchEvent(new Event("input"));
  });
}

// Restaura período e seleções múltiplas aos valores padrão.
function limparFiltros() {
  Object.assign(estadoFiltros, { indicador: "all", anoInicio: PERIODO_PADRAO.inicio, anoFim: PERIODO_PADRAO.fim, regioes: [], ufs: [], municipios: [], produtos: [] });
  document.querySelectorAll("[data-filter-group] .filter-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === "all"));
  document.querySelectorAll(".filter-dropdown-menu input[type='checkbox']").forEach(input => { input.checked = false; });
  ["buscaRegiao", "buscaUf", "buscaMunicipio", "buscaProduto"].forEach(id => { document.getElementById(id).value = ""; });
  document.querySelectorAll("[data-filter-option]").forEach(option => { option.style.display = ""; });
  document.getElementById("filtroAnoInicio").value = estadoFiltros.anoInicio;
  document.getElementById("filtroAnoFim").value = estadoFiltros.anoFim;
  atualizarOpcoesDependentesLeite();
  atualizarLabelsDropdowns();
  aplicarFiltros();
}
// Sincroniza os textos dos dropdowns com `estadoFiltros`.
function atualizarLabelsDropdowns() {
  atualizarLabelDropdown("filtroRegiaoBtn", estadoFiltros.regioes, "Todas");
  atualizarLabelDropdown("filtroUfBtn", estadoFiltros.ufs, "Todas");
  atualizarLabelDropdown("filtroMunicipioBtn", estadoFiltros.municipios, "Todos");
  atualizarLabelDropdown("filtroProdutoBtn", estadoFiltros.produtos, "Todos");
}
// Popula controles e conecta todos os eventos que alteram filtros.
function inicializarFiltros() {
  conectarBuscaDropdown("buscaRegiao", "filtroRegiaoMenu");
  conectarBuscaDropdown("buscaUf", "filtroUfMenu");
  conectarBuscaDropdown("buscaMunicipio", "filtroMunicipioMenu");
  conectarBuscaDropdown("buscaProduto", "filtroProdutoMenu");
  document.querySelectorAll("[data-filter-group] .filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest("[data-filter-group]").dataset.filterGroup;
      estadoFiltros[group] = btn.dataset.filter;
      btn.closest("[data-filter-group]").querySelectorAll(".filter-btn").forEach(item => item.classList.toggle("active", item === btn));
      atualizarOpcoesDependentesLeite();
      atualizarLabelsDropdowns();
      aplicarFiltros();
    });
  });
  ["filtroAnoInicio", "filtroAnoFim"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", lerFiltrosDeFormulario);
  });
  ["filtroRegiaoMenu", "filtroUfMenu", "filtroMunicipioMenu", "filtroProdutoMenu"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", lerFiltrosDeFormulario);
  });
  document.getElementById("btnLimparFiltros")?.addEventListener("click", limparFiltros);
}
// Aguarda os dados, cria controles e gráficos e aplica o estado inicial.
async function inicializarDashboardLeite() {
  // Aguarda a API para que anos, produtos e municípios dos filtros reflitam os
  // dados reais antes da criação da primeira visualização.
  await carregarDadosNovaApiLeite();
  inicializarFiltros();
  inicializarEstruturaGraficos();
  metadadosApi.dashboardPronto = true;
  atualizarOpcoesDependentesLeite();
  atualizarLabelsDropdowns();
  aplicarFiltros();
}

window.onTabChange = function () {
  if (!metadadosApi.dashboardPronto) return;
  estadoFiltros.indicador = "all";
  document.querySelectorAll('[data-filter-group="indicador"] .filter-btn').forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === "all");
  });
  atualizarOpcoesDependentesLeite();
  atualizarLabelsDropdowns();
  aplicarFiltros();
};
am5.ready(() => {
  inicializarDashboardLeite().catch(erro => {
    Object.values(ALVOS_API).flat().forEach(id => registrarFalhaApi([id], erro));
  });
});
