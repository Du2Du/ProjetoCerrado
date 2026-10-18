const P = ["#4a7c3f", "#c8943a", "#a0622b", "#6fa65e", "#2d5c24", "#e8a84c", "#7fb069", "#5c4033", "#3a6b4a", "#d4a843"];

const DADOS_LEITE = {
  producaoBilhoes: [],
  participacaoRegiao: [],
  producaoCO: [],
  producaoMeso: [],
  municipiosProducao: [],
  produtividadeMunicipios: [],
  rebanhoCO: [],
  vacasRegiao2021: [],
  produtividadeRegiao: [],
  vacasRegiaoSerie: [],
  vacasMeso: [],
  rankingConsumo: []
};

let ANOS_PRODUCAO = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"];
const SERIES_PRODUCAO_UF = ["Brasil", "Minas Gerais", "Paraná", "Rio Grande do Sul", "Goiás", "Santa Catarina"];
const SERIES_MESO = ["Noroeste goiano", "Norte goiano", "Centro goiano", "Leste goiano", "Sul goiano"];
const SERIES_MESO_LABEL = ["Noroeste Goiano", "Norte Goiano", "Centro Goiano", "Leste Goiano", "Sul Goiano"];
let SERIES_REGIAO = [];
let SERIES_UF_CO = [];
let TODOS_MUNICIPIOS = [];
let ANOS_PRODUTIVIDADE_MUNICIPIOS = [];
let PRODUTOS_FILTRO = [];
let PERIODO_PADRAO = { inicio: "2013", fim: "2021" };

const estadoFiltros = {
  escala: "all",
  indicador: "all",
  anoInicio: "2013",
  anoFim: "2021",
  regioes: [],
  ufs: [],
  municipios: [],
  produtos: []
};

const graficos = {};

const metadadosApi = {};
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

function ordenarAnos(anos) {
  return Array.from(new Set(anos.map(String).filter(ano => /^\d{4}$/.test(ano))))
    .sort((a, b) => Number(a) - Number(b));
}

function periodoTexto(anos) {
  if (!anos.length) return "";
  return anos.length === 1 ? anos[0] : `${anos[0]}–${anos.at(-1)}`;
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
  definirEstadoVisualizacao(
    alvos,
    semDados ? "empty" : "error",
    semDados ? erro.message : "Não foi possível carregar os dados."
  );
  console.error("Falha ao carregar dados de Leite:", erro);
}

function atualizarColecoesDinamicas() {
  const anosApi = ordenarAnos(DADOS_LEITE.producaoBilhoes.map(item => item.Ano));
  const anosLocais = ordenarAnos([
    ...DADOS_LEITE.producaoMeso.map(item => item.ano),
    ...DADOS_LEITE.municipiosProducao.map(item => item.ano),
    ...DADOS_LEITE.rebanhoCO.flatMap(item => Object.keys(item).filter(chave => /^\d{4}$/.test(chave)))
  ]);
  ANOS_PRODUCAO = ordenarAnos([...anosLocais, ...anosApi]);
  SERIES_REGIAO = Array.from(new Set([
    ...DADOS_LEITE.vacasRegiaoSerie.map(item => item.regiao),
    ...DADOS_LEITE.participacaoRegiao.map(item => item.regiao)
  ]));
  PRODUTOS_FILTRO = Array.from(new Set(DADOS_LEITE.rankingConsumo.map(d => d.produto)))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  if (anosApi.length) {
    PERIODO_PADRAO = { inicio: anosApi[0], fim: anosApi.at(-1) };
    estadoFiltros.anoInicio = PERIODO_PADRAO.inicio;
    estadoFiltros.anoFim = PERIODO_PADRAO.fim;
  }
}

async function buscarEndpointLeite(nome) {
  if (window.simularErroApi) throw new Error("Falha simulada para teste da interface.");
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

function pivotarLeitePorAno(linhas, campoNome, campoValor, campoAno = "ano", transformarNome = nome => nome) {
  return ordenarAnos(linhas.map(item => item.ano)).map(ano => {
    const linhaAno = { [campoAno]: Number(ano) };
    linhas.filter(item => String(item.ano) === ano).forEach(item => {
      linhaAno[transformarNome(item[campoNome])] = Number(item[campoValor]);
    });
    return linhaAno;
  });
}

function pivotarLeitePorNome(linhas, campoNome, campoValor, nomeSaida) {
  return Array.from(new Set(linhas.map(item => item[campoNome]))).map(nome => {
    const linhaNome = { [nomeSaida]: nome };
    linhas.filter(item => item[campoNome] === nome).forEach(item => {
      linhaNome[String(item.ano)] = Number(item[campoValor]);
    });
    return linhaNome;
  });
}

function renderizarTabelaProdutividadeMunicipios() {
  const tabela = document.querySelector("#tabelaProdutividadeMunicipios table");
  if (!tabela || ANOS_PRODUTIVIDADE_MUNICIPIOS.length < 2) return;
  const [anoInicial, anoFinal] = ANOS_PRODUTIVIDADE_MUNICIPIOS;
  const cabecalho = tabela.querySelectorAll("thead th");
  cabecalho[2].textContent = anoInicial;
  cabecalho[3].textContent = anoFinal;
  const dados = [...DADOS_LEITE.produtividadeMunicipios]
    .filter(item => Number.isFinite(item[anoFinal]))
    .sort((a, b) => b[anoFinal] - a[anoFinal]);
  tabela.querySelector("tbody").innerHTML = dados.map((item, indice) => {
    const classe = indice === 1 ? " badge-rank--2" : indice === 2 ? " badge-rank--3" : "";
    const posicao = indice < 3 ? `<span class="badge-rank${classe}">${indice + 1}</span>` : indice + 1;
    return `<tr><td>${posicao}</td><td>${item.municipio}</td><td class="text-end num">${Math.round(item[anoInicial]).toLocaleString("pt-BR")}</td><td class="text-end num">${Math.round(item[anoFinal]).toLocaleString("pt-BR")}</td></tr>`;
  }).join("");
  document.querySelector("#tabelaProdutividadeMunicipios .chart-card__sub").textContent = `Litros / vaca / ano — ${anoInicial} & ${anoFinal}`;
}

async function carregarDadosNovaApiLeite() {
  Object.values(ALVOS_API).flat().forEach(id => definirEstadoVisualizacao([id], "loading"));
  [
    "kpiLeiteBrasil", "kpiLeiteGoias", "kpiLeiteRegiao", "kpiLeiteProdutividade",
    "kpiLeiteMesoSul", "kpiLeiteMesoCentro", "kpiLeiteMesoLeste", "kpiLeiteMesoNorte",
    "kpiLeitePlanoProducaoCo", "kpiLeitePlanoGoias", "kpiLeitePlanoProdutividadeCo", "kpiLeitePlanoProdutividadeSul"
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
    DADOS_LEITE.producaoBilhoes = pivotarLeitePorAno(linhas, "uf", "producaoBilhoesLitros", "Ano");
    metadadosApi.anosProducao = ordenarAnos(linhas.map(item => item.ano));
    atualizarTextoVisualizacao("chartLeiteSeries", {
      subtitulo: `Bilhões de litros por ano (${periodoTexto(metadadosApi.anosProducao)})`
    });
  });

  processar("regioes", linhas => {
    const anos = ordenarAnos(linhas.map(item => item.ano));
    const anoAtual = [...anos].reverse().find(ano => {
      const atuais = linhas.filter(item => String(item.ano) === ano);
      return atuais.length >= 5 && atuais.every(item => Number.isFinite(Number(item.producao)) && Number.isFinite(Number(item.vacas)));
    });
    if (!anoAtual) throw new ErroDadosVazios("Não há um ano regional completo.");
    const atuais = linhas.filter(item => String(item.ano) === anoAtual);
    const totalProducao = atuais.reduce((soma, item) => soma + Number(item.producao), 0);
    const totalVacas = atuais.reduce((soma, item) => soma + Number(item.vacas), 0);
    DADOS_LEITE.participacaoRegiao = atuais.map(item => ({
      regiao: item.regiao,
      producaoLeiteMilhoesLitros: Number(item.producao) / 1_000,
      percentualParticipacao: Number(item.producao) / totalProducao * 100
    }));
    DADOS_LEITE.produtividadeRegiao = atuais.map(item => ({
      regiao: item.regiao,
      produtividadeLitrosPorVacaAno: Number(item.producao) * 1_000 / Number(item.vacas)
    }));
    DADOS_LEITE.vacasRegiao2021 = atuais.map(item => ({
      regiao: item.regiao,
      quantidadeVacasOrdenhadas: Number(item.vacas),
      percentualParticipacao: Number(item.vacas) / totalVacas * 100
    }));
    DADOS_LEITE.vacasRegiaoSerie = pivotarLeitePorNome(linhas, "regiao", "vacas", "regiao");
    metadadosApi.anoRegioes = anoAtual;
    metadadosApi.anoVacas = anoAtual;
    metadadosApi.anosVacas = anos;
    atualizarTextoVisualizacao("chartLeiteRegiao", { titulo: `Participação Regional (${anoAtual})` });
    atualizarTextoVisualizacao("chartProdutividade", { titulo: `Produtividade por Região (${anoAtual})` });
    atualizarTextoVisualizacao("chartVacasRegiao", { titulo: `Vacas Ordenhadas por Região (${anoAtual})` });
    atualizarTextoVisualizacao("chartVacasRegiaoSerie", { subtitulo: `Cabeças — ${periodoTexto(anos)}` });
    atualizarTextoVisualizacao("tabelaRegioesLeite", { titulo: `Regiões Brasileiras — ${anoAtual}` });
  });

  processar("centroOeste", linhas => {
    const ufs = ["Mato Grosso do Sul", "Mato Grosso", "Goiás"];
    const anos = ordenarAnos(linhas.map(item => item.ano));
    const anoAtual = [...anos].reverse().find(ano => ufs.every(uf => linhas.some(item => item.uf === uf && String(item.ano) === ano && Number.isFinite(Number(item.producao)))));
    if (!anoAtual) throw new ErroDadosVazios("Não há um ano completo para o Centro-Oeste.");
    const atuais = ufs.map(uf => linhas.find(item => item.uf === uf && String(item.ano) === anoAtual));
    const total = atuais.reduce((soma, item) => soma + Number(item.producao), 0);
    DADOS_LEITE.producaoCO = atuais.map(item => ({
      uf: item.uf, producaoLeiteMilhoesLitros: Number(item.producao),
      percentualParticipacao: Number(item.producao) / total * 100
    }));
    const linhasRebanho = linhas.filter(item => ["Centro-Oeste", ...ufs].includes(item.uf) && Number.isFinite(Number(item.rebanho)));
    DADOS_LEITE.rebanhoCO = pivotarLeitePorNome(linhasRebanho, "uf", "rebanho", "uf");
    SERIES_UF_CO = ufs.filter(uf => DADOS_LEITE.rebanhoCO.some(item => item.uf === uf));
    metadadosApi.anoCentroOeste = anoAtual;
    metadadosApi.centroOesteSerie = linhas.filter(item => item.uf === "Centro-Oeste").sort((a, b) => Number(a.ano) - Number(b.ano));
    metadadosApi.centroOesteLinhasAtuais = linhas.filter(item => String(item.ano) === anoAtual);
    atualizarTextoVisualizacao("chartLeiteProducaoCO", { titulo: `Produção de Leite — Centro-Oeste (${anoAtual})`, subtitulo: "Mil litros por estado" });
    atualizarTextoVisualizacao("chartProducaoCentroOesteUf", { subtitulo: `Produção de leite em ${anoAtual} — mil litros` });
  });

  processar("mesorregioes", linhas => {
    const nomeGrafico = nome => String(nome).replace("Goiano", "goiano");
    const producaoMilhoes = linhas.filter(item => Number.isFinite(Number(item.producao))).map(item => ({
      ...item, producaoMilhoes: Number(item.producao) / 1_000
    }));
    DADOS_LEITE.producaoMeso = pivotarLeitePorAno(producaoMilhoes, "mesorregiao", "producaoMilhoes", "ano", nomeGrafico);
    DADOS_LEITE.vacasMeso = pivotarLeitePorNome(linhas.filter(item => Number.isFinite(Number(item.vacas))), "mesorregiao", "vacas", "mesorregiao");
    const anos = ordenarAnos(linhas.map(item => item.ano));
    atualizarTextoVisualizacao("chartGoiasMeso", { subtitulo: `Milhões de litros (${periodoTexto(anos)})` });
    atualizarTextoVisualizacao("chartGoiasMesoPie", { titulo: `Distribuição Mesorregiões (${anos.at(-1)})` });
  });

  processar("municipios", linhas => {
    TODOS_MUNICIPIOS = Array.from(new Set(linhas.map(item => item.municipio))).sort((a, b) => a.localeCompare(b, "pt-BR"));
    DADOS_LEITE.municipiosProducao = pivotarLeitePorAno(linhas.filter(item => Number.isFinite(Number(item.producao))), "municipio", "producao");
    const anosCompletos = ordenarAnos(linhas.filter(item => Number(item.vacas) > 0 && Number.isFinite(Number(item.producao))).map(item => item.ano));
    ANOS_PRODUTIVIDADE_MUNICIPIOS = anosCompletos.slice(-2);
    DADOS_LEITE.produtividadeMunicipios = TODOS_MUNICIPIOS.map(municipio => {
      const item = { municipio };
      ANOS_PRODUTIVIDADE_MUNICIPIOS.forEach(ano => {
        const linha = linhas.find(registro => registro.municipio === municipio && String(registro.ano) === ano);
        if (linha && Number(linha.vacas) > 0) item[ano] = Number(linha.producao) * 1_000 / Number(linha.vacas);
      });
      return item;
    });
    renderizarTabelaProdutividadeMunicipios();
    const anos = ordenarAnos(linhas.map(item => item.ano));
    atualizarTextoVisualizacao("chartMunicipios", { titulo: `Evolução dos Principais Municípios (${periodoTexto(anos)})` });
    atualizarTextoVisualizacao("chartMunicipiosBars", { titulo: `Produção ${anos[0]} vs ${anos.at(-1)} — Top 5 Municípios` });
    atualizarTextoVisualizacao("chartProdutividadeMunicipios", { subtitulo: `Litros / vaca / ano — ${ANOS_PRODUTIVIDADE_MUNICIPIOS.join(" vs ")}` });
  });

  processar("ranking", linhas => {
    DADOS_LEITE.rankingConsumo = linhas.filter(item => item.uf === "GO").map(item => ({
      produto: item.produto, melhorPosicao: Number(item.posicao), ano: Number(item.ano), valor: Number(item.valor)
    }));
    if (!DADOS_LEITE.rankingConsumo.length) throw new ErroDadosVazios("Goiás não aparece no ranking retornado.");
    metadadosApi.anoRanking = DADOS_LEITE.rankingConsumo[0].ano;
    atualizarTextoVisualizacao("chartRankingConsumo", { subtitulo: `Posição de Goiás na aquisição domiciliar per capita — POF ${metadadosApi.anoRanking}` });
  });

  atualizarColecoesDinamicas();
  atualizarCardsLeite();
  atualizarCardsSecundariosLeite();
}

function formatarNumeroKpi(valor, casas = 1) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  }).format(valor);
}

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

function atualizarCardsLeite() {
  const serie = [...DADOS_LEITE.producaoBilhoes].sort((a, b) => Number(a.Ano) - Number(b.Ano));
  const inicial = serie[0];
  const atual = serie.at(-1);

  if (atual && Number.isFinite(atual.Brasil)) {
    const variacao = variacaoKpi(atual.Brasil, inicial?.Brasil, inicial?.Ano);
    window.atualizarKpiComApi("kpiLeiteBrasil", {
      label: `Produção Brasil ${atual.Ano}`,
      value: formatarNumeroKpi(atual.Brasil, 1),
      unit: "bi L",
      ...variacao
    });
  } else {
    window.atualizarKpiComApi("kpiLeiteBrasil", { label: "Produção Brasil", state: "error" });
  }

  if (atual && Number.isFinite(atual.Goiás)) {
    const variacao = variacaoKpi(atual.Goiás, inicial?.Goiás, inicial?.Ano);
    window.atualizarKpiComApi("kpiLeiteGoias", {
      label: `Produção Goiás ${atual.Ano}`,
      value: formatarNumeroKpi(atual.Goiás, 2),
      unit: "bi L",
      ...variacao
    });
  } else {
    window.atualizarKpiComApi("kpiLeiteGoias", { label: "Produção Goiás", state: "error" });
  }

  const maiorRegiao = [...DADOS_LEITE.participacaoRegiao]
    .filter(item => Number.isFinite(item.percentualParticipacao))
    .sort((a, b) => b.percentualParticipacao - a.percentualParticipacao)[0];
  if (maiorRegiao) {
    window.atualizarKpiComApi("kpiLeiteRegiao", {
      label: `Maior região — ${maiorRegiao.regiao}`,
      value: formatarNumeroKpi(maiorRegiao.percentualParticipacao, 1),
      unit: "%",
      badge: `${metadadosApi.anoRegioes} · ${formatarNumeroKpi(maiorRegiao.producaoLeiteMilhoesLitros / 1_000, 1)} bi L`,
      tone: "up"
    });
  } else {
    window.atualizarKpiComApi("kpiLeiteRegiao", { label: "Maior região produtora", state: "error" });
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

function atualizarCardsSecundariosLeite() {
  const anosMeso = ordenarAnos(DADOS_LEITE.producaoMeso.map(item => item.ano));
  const mesoInicial = DADOS_LEITE.producaoMeso.find(item => String(item.ano) === anosMeso[0]);
  const mesoAtual = DADOS_LEITE.producaoMeso.find(item => String(item.ano) === anosMeso.at(-1));
  const cardsMeso = [
    ["kpiLeiteMesoSul", "Sul Goiano", "Sul goiano"],
    ["kpiLeiteMesoCentro", "Centro Goiano", "Centro goiano"],
    ["kpiLeiteMesoLeste", "Leste Goiano", "Leste goiano"],
    ["kpiLeiteMesoNorte", "Norte Goiano", "Norte goiano"]
  ];
  const rankingMeso = mesoAtual ? SERIES_MESO.slice().sort((a, b) => (mesoAtual[b] || 0) - (mesoAtual[a] || 0)) : [];
  cardsMeso.forEach(([id, label, campo]) => {
    if (!mesoAtual || !Number.isFinite(mesoAtual[campo])) {
      window.atualizarKpiComApi(id, { label, state: "error" });
      return;
    }
    const posicao = rankingMeso.indexOf(campo) + 1;
    window.atualizarKpiComApi(id, {
      label: `${label} ${mesoAtual.ano}`,
      value: formatarNumeroKpi(mesoAtual[campo], 0),
      unit: "mi L",
      ...(posicao <= 2
        ? { badge: posicao === 1 ? "maior região" : "2ª região", tone: posicao === 1 ? "up" : "neutral" }
        : variacaoKpi(mesoAtual[campo], mesoInicial?.[campo], mesoInicial?.ano))
    });
  });

  const serieCo = metadadosApi.centroOesteSerie || [];
  const coInicial = serieCo[0];
  const coAtual = serieCo.at(-1);
  const goiasAtual = metadadosApi.centroOesteLinhasAtuais?.find(item => item.uf === "Goiás");
  if (coAtual && goiasAtual) {
    window.atualizarKpiComApi("kpiLeitePlanoProducaoCo", {
      label: `Produção no Centro-Oeste ${coAtual.ano}`,
      value: formatarNumeroKpi(Number(coAtual.producao) / 1_000_000, 1),
      unit: "bi L",
      ...variacaoKpi(Number(coAtual.producao), Number(coInicial?.producao), coInicial?.ano)
    });
    window.atualizarKpiComApi("kpiLeitePlanoGoias", {
      label: `Goiás no Centro-Oeste ${coAtual.ano}`,
      value: formatarNumeroKpi(Number(goiasAtual.producao) / Number(coAtual.producao) * 100, 1),
      unit: "%",
      badge: "participação regional",
      tone: "up"
    });
  } else {
    ["kpiLeitePlanoProducaoCo", "kpiLeitePlanoGoias"].forEach(id => window.atualizarKpiComApi(id, { state: "error" }));
  }

  [["kpiLeitePlanoProdutividadeCo", "Centro-Oeste"], ["kpiLeitePlanoProdutividadeSul", "Sul"]].forEach(([id, regiao]) => {
    const item = DADOS_LEITE.produtividadeRegiao.find(registro => registro.regiao === regiao);
    window.atualizarKpiComApi(id, item ? {
      label: `Produtividade ${regiao} ${metadadosApi.anoRegioes}`,
      value: formatarNumeroKpi(item.produtividadeLitrosPorVacaAno, 0),
      unit: "L/vaca/ano",
      badge: regiao === "Sul" ? "referência regional" : "média regional",
      tone: regiao === "Sul" ? "up" : "neutral"
    } : { state: "error" });
  });

  const produtividadeCo = DADOS_LEITE.produtividadeRegiao.find(item => item.regiao === "Centro-Oeste");
  const produtividadeSul = DADOS_LEITE.produtividadeRegiao.find(item => item.regiao === "Sul");
  const resumoPlano = document.querySelector("#lt-plano .info-bar");
  if (resumoPlano && coAtual && coInicial && goiasAtual && produtividadeCo && produtividadeSul) {
    const variacao = (Number(coAtual.producao) / Number(coInicial.producao) - 1) * 100;
    const participacaoGoias = Number(goiasAtual.producao) / Number(coAtual.producao) * 100;
    resumoPlano.innerHTML = `<span aria-hidden="true">📋</span>A produção de leite no Centro-Oeste variou ${formatarNumeroKpi(variacao, 1)}% entre ${coInicial.ano} e ${coAtual.ano}. Goiás representa ${formatarNumeroKpi(participacaoGoias, 1)}% da produção regional. A produtividade média é de ${formatarNumeroKpi(produtividadeCo.produtividadeLitrosPorVacaAno, 0)} L/vaca/ano no Centro-Oeste e ${formatarNumeroKpi(produtividadeSul.produtividadeLitrosPorVacaAno, 0)} L/vaca/ano no Sul.`;
  }
}

function classePercentual(percentual) {
  if (percentual >= 25) return "kpi-badge--up";
  if (percentual >= 10) return "kpi-badge--neutral";
  return "kpi-badge--down";
}

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

function existe(id) { return !!document.getElementById(id); }
function eixo(axis) {
  axis.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif", fill: am5.color("#5a5a5a") });
}
function criarRoot(id) {
  const root = am5.Root.new(id);
  root.setThemes([am5themes_Animated.new(root)]);
  return root;
}
function criarLegenda(chart, root) {
  const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  l.labels.template.setAll({ fontSize: 11, fontFamily: "Arial,sans-serif" });
  return l;
}
function cardDoGrafico(id) {
  return document.getElementById(id)?.closest("[class*='col-']");
}
function alternarCard(id, visivel) {
  const coluna = cardDoGrafico(id);
  const container = containerVisualizacao(id);
  const preservaEstado = container?.classList.contains("data-card--error") || container?.classList.contains("data-card--empty");
  coluna?.classList.toggle("is-chart-empty", !visivel && !preservaEstado);
}
function setSelectOptions(id, valores) {
  const select = document.getElementById(id);
  if (!select) return;
  const selecionadosAtuais = new Set(Array.from(select.selectedOptions || []).map(o => o.value));
  select.innerHTML = valores.map(v => `<option value="${v}"${selecionadosAtuais.has(v) ? " selected" : ""}>${v}</option>`).join("");
}
function setDropdownOptions(menuId, valores) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.innerHTML = valores.map(valor => `
    <label class="filter-option" data-filter-option>
      <input class="form-check-input mt-0" type="checkbox" value="${valor}">
      <span>${valor}</span>
    </label>
  `).join("");
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
function anosNoPeriodo(anos) {
  const inicio = Number(estadoFiltros.anoInicio);
  const fim = Number(estadoFiltros.anoFim);
  return anos.filter(ano => Number(ano) >= inicio && Number(ano) <= fim);
}
function filtrarLinhasPorAno(data, campo = "ano") {
  const inicio = Number(estadoFiltros.anoInicio);
  const fim = Number(estadoFiltros.anoFim);
  return data.filter(d => Number(d[campo]) >= inicio && Number(d[campo]) <= fim);
}
function seriesSelecionadas(todas, filtro) {
  return filtro.length ? todas.filter(v => filtro.includes(v)) : todas;
}
function filtrarPorCampo(data, campo, filtro) {
  return filtro.length ? data.filter(d => filtro.includes(d[campo])) : data;
}
function temIntersecaoProduto(nome) {
  return !estadoFiltros.produtos.length || estadoFiltros.produtos.includes(nome);
}
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
function dadosAgrupadosPorAnos(data, categoria, anos, series) {
  return data.map(item => {
    const row = { [categoria]: item[categoria] };
    series.forEach(serie => { row[serie.nome] = item[serie.ano]; });
    return row;
  });
}
function serieComparativa(anos, nomeInicio = "Início", nomeFim = "Fim") {
  if (!anos.length) return [];
  return [
    { nome: nomeInicio, ano: anos[0] },
    { nome: nomeFim, ano: anos.at(-1) }
  ];
}

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
    update(data, seriesAtivas = series) {
      const ativos = new Set(seriesAtivas);
      xA.data.setAll(data);
      Object.entries(seriesMap).forEach(([nome, s]) => {
        const visivel = ativos.has(nome);
        s.data.setAll(data);
        s.set("visible", visivel);
        s.set("forceHidden", !visivel);
      });
      alternarCard(id, data.length > 0 && seriesAtivas.length > 0);
    }
  };
  chart.appear(800, 80);
}
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
    update(data) {
      cA.data.setAll(data);
      s.data.setAll(data);
      alternarCard(id, data.length > 0);
    }
  };
  chart.appear(800, 80);
}
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
    update(data) {
      s.data.setAll(data);
      l.data.setAll(s.dataItems);
      alternarCard(id, data.length > 0);
    }
  };
  chart.appear(800, 80);
}

function inicializarEstruturaGraficos() {
  graficoLinhas("chartLeiteSeries", "ano", SERIES_PRODUCAO_UF, " bi L");
  graficoPizza("chartLeiteRegiao", "regiao", "percentualParticipacao");
  graficoBarras("chartProdutividade", "regiao", "produtividadeLitrosPorVacaAno", true, " L/vaca/ano");
  graficoBarras("chartVacasRegiao", "regiao", "quantidadeVacasOrdenhadas", true);
  graficoLinhas("chartVacasRegiaoSerie", "ano", SERIES_REGIAO);
  graficoLinhas("chartGoiasMeso", "ano", SERIES_MESO);
  graficoPizza("chartGoiasMesoPie", "mesorregiao", "producao");
  graficoBarrasAgrupadas("chartVacasGoias", "mesorregiao", [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  graficoLinhas("chartVacasMesoSerie", "ano", SERIES_MESO_LABEL);
  graficoBarras("chartLeiteProducaoCO", "uf", "producaoLeiteMilhoesLitros", false, " mil L");
  graficoBarras("chartProducaoCentroOesteUf", "uf", "producaoLeiteMilhoesLitros", false, " mil L");
  graficoLinhas("chartRebanhoCO", "ano", SERIES_UF_CO);
  graficoLinhas("chartMunicipios", "ano", TODOS_MUNICIPIOS);
  graficoBarrasAgrupadas("chartMunicipiosBars", "municipio", [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  graficoBarrasAgrupadas("chartProdutividadeMunicipios", "municipio", ANOS_PRODUTIVIDADE_MUNICIPIOS.map(ano => ({ nome: ano, campo: ano })), " L/vaca/ano");
  graficoBarras("chartRankingConsumo", "produto", "melhorPosicao", true);
}

function aplicarFiltros() {
  const anosVacasRegiao = anosNoPeriodo(metadadosApi.anosVacas || []);
  const anosMeso = anosNoPeriodo(ordenarAnos(DADOS_LEITE.producaoMeso.map(d => d.ano)));
  const anosVacasMeso = anosNoPeriodo(ordenarAnos(DADOS_LEITE.vacasMeso.flatMap(d => Object.keys(d).filter(k => /^\d{4}$/.test(k)))));
  const anosRebanho = anosNoPeriodo(ordenarAnos(DADOS_LEITE.rebanhoCO.flatMap(d => Object.keys(d).filter(k => /^\d{4}$/.test(k)))));
  const anosMunicipios = anosNoPeriodo(ordenarAnos(DADOS_LEITE.municipiosProducao.map(d => d.ano)));
  const regioes = seriesSelecionadas(SERIES_REGIAO, estadoFiltros.regioes);
  const mesorregioes = SERIES_MESO.filter((_, i) => !estadoFiltros.regioes.length || estadoFiltros.regioes.includes(SERIES_MESO_LABEL[i]));
  const mesorregioesLabel = SERIES_MESO_LABEL.filter(label => !estadoFiltros.regioes.length || estadoFiltros.regioes.includes(label));
  const ufsProducao = seriesSelecionadas(SERIES_PRODUCAO_UF, estadoFiltros.ufs);
  const ufsCO = seriesSelecionadas(SERIES_UF_CO, estadoFiltros.ufs);
  const municipios = seriesSelecionadas(TODOS_MUNICIPIOS, estadoFiltros.municipios);
  const comparacaoVacasMeso = serieComparativa(anosVacasMeso);

  graficos.chartLeiteSeries?.update(filtrarLinhasPorAno(DADOS_LEITE.producaoBilhoes, "Ano").map(d => ({ ...d, ano: String(d.Ano) })), ufsProducao);
  graficos.chartLeiteRegiao?.update(filtrarPorCampo(DADOS_LEITE.participacaoRegiao, "regiao", estadoFiltros.regioes));
  renderizarTabelaRegioes(filtrarPorCampo(DADOS_LEITE.participacaoRegiao, "regiao", estadoFiltros.regioes));
  graficos.chartProdutividade?.update(filtrarPorCampo(DADOS_LEITE.produtividadeRegiao, "regiao", estadoFiltros.regioes));
  graficos.chartVacasRegiao?.update(filtrarPorCampo(DADOS_LEITE.vacasRegiao2021, "regiao", estadoFiltros.regioes));
  graficos.chartVacasRegiaoSerie?.update(dadosPorAno(DADOS_LEITE.vacasRegiaoSerie, "regiao", anosVacasRegiao, regioes), regioes);

  graficos.chartGoiasMeso?.update(filtrarLinhasPorAno(DADOS_LEITE.producaoMeso).map(d => ({ ...d, ano: String(d.ano) })), mesorregioes);
  graficos.chartGoiasMesoPie?.update(Object.entries(DADOS_LEITE.producaoMeso.find(d => String(d.ano) === anosMeso.at(-1)) || {}).filter(([k]) => k !== "ano" && mesorregioes.includes(k)).map(([mesorregiao, producao]) => ({ mesorregiao, producao })));
  graficos.chartVacasGoias?.update(dadosAgrupadosPorAnos(DADOS_LEITE.vacasMeso.filter(d => mesorregioesLabel.includes(d.mesorregiao)), "mesorregiao", anosVacasMeso, comparacaoVacasMeso), [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  graficos.chartVacasMesoSerie?.update(dadosPorAno(DADOS_LEITE.vacasMeso, "mesorregiao", anosVacasMeso, mesorregioesLabel), mesorregioesLabel);
  const producaoCO = filtrarPorCampo(DADOS_LEITE.producaoCO, "uf", estadoFiltros.ufs);
  graficos.chartLeiteProducaoCO?.update(producaoCO);
  graficos.chartProducaoCentroOesteUf?.update(producaoCO);
  graficos.chartRebanhoCO?.update(dadosPorAno(DADOS_LEITE.rebanhoCO.filter(d => d.uf !== "Centro-Oeste"), "uf", anosRebanho, ufsCO), ufsCO);

  graficos.chartMunicipios?.update(filtrarLinhasPorAno(DADOS_LEITE.municipiosProducao).map(d => ({ ...d, ano: String(d.ano) })), municipios);
  graficos.chartMunicipiosBars?.update(municipios.map(municipio => ({ municipio, "Início": DADOS_LEITE.municipiosProducao.find(d => String(d.ano) === anosMunicipios[0])?.[municipio], "Fim": DADOS_LEITE.municipiosProducao.find(d => String(d.ano) === anosMunicipios.at(-1))?.[municipio] })).filter(d => d.Início !== undefined || d.Fim !== undefined).sort((a, b) => (b.Fim || 0) - (a.Fim || 0)).slice(0, 10), [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  const seriesProdutividadeMunicipios = ANOS_PRODUTIVIDADE_MUNICIPIOS.map(ano => ({ nome: ano, campo: ano }));
  const anoProdutividadeAtual = ANOS_PRODUTIVIDADE_MUNICIPIOS.at(-1);
  graficos.chartProdutividadeMunicipios?.update(
    DADOS_LEITE.produtividadeMunicipios.filter(d => municipios.includes(d.municipio)).sort((a, b) => (b[anoProdutividadeAtual] || 0) - (a[anoProdutividadeAtual] || 0)),
    seriesProdutividadeMunicipios
  );

  graficos.chartRankingConsumo?.update(DADOS_LEITE.rankingConsumo.filter(d => temIntersecaoProduto(d.produto)));

  atualizarVisibilidadeCards();
  atualizarResumoFiltros();
}

function atualizarVisibilidadeCards() {
  document.querySelectorAll("[data-category]").forEach(el => {
    const categoriaOk = estadoFiltros.indicador === "all" || el.dataset.category === estadoFiltros.indicador;
    el.classList.toggle("is-filter-hidden", !categoriaOk);
  });
  const visiveis = Array.from(document.querySelectorAll("[data-tab-content].active [data-category]")).some(el => !el.classList.contains("is-filter-hidden") && !el.classList.contains("is-chart-empty"));
  document.getElementById("semDadosLeite")?.style.setProperty("display", visiveis ? "none" : "block");
}
function atualizarResumoFiltros() {
  const target = document.getElementById("filtrosAtivosLeite");
  if (!target) return;
  const chips = [
    `Escala: ${estadoFiltros.escala === "all" ? "todas" : estadoFiltros.escala}`,
    `Indicador: ${estadoFiltros.indicador === "all" ? "todos" : estadoFiltros.indicador}`,
    `Período: ${estadoFiltros.anoInicio}-${estadoFiltros.anoFim}`,
    estadoFiltros.regioes.length ? `Região: ${estadoFiltros.regioes.length}` : "",
    estadoFiltros.ufs.length ? `UF: ${estadoFiltros.ufs.length}` : "",
    estadoFiltros.municipios.length ? `Municípios: ${estadoFiltros.municipios.length}` : "",
    estadoFiltros.produtos.length ? `Produto/perfil: ${estadoFiltros.produtos.length}` : ""
  ].filter(Boolean);
  target.innerHTML = chips.map(texto => `<span class="filter-chip">${texto}</span>`).join("");
}
function lerFiltrosDeFormulario() {
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
  atualizarLabelsDropdowns();
  aplicarFiltros();
}
function navegarParaFoco() {
  const destino = { brasil: "lt-brasil", goias: "lt-goias", municipio: "lt-municipios" }[estadoFiltros.escala];
  if (!destino) return;

  const botao = document.querySelector(`[data-tab="${destino}"]`);
  if (botao) {
    botao.click();
    return;
  }

  const painel = document.querySelector(`[data-tab-content="${destino}"]`);
  if (!painel) return;
  document.querySelectorAll("[data-tab]").forEach(item => {
    item.classList.remove("active");
    item.setAttribute("aria-selected", "false");
  });
  document.querySelectorAll("[data-tab-content]").forEach(item => item.classList.remove("active"));
  painel.classList.add("active");
}
function limparFiltros() {
  Object.assign(estadoFiltros, { escala: "all", indicador: "all", anoInicio: PERIODO_PADRAO.inicio, anoFim: PERIODO_PADRAO.fim, regioes: [], ufs: [], municipios: [], produtos: [] });
  document.querySelectorAll("[data-filter-group] .filter-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === "all"));
  document.querySelectorAll(".filter-dropdown-menu input[type='checkbox']").forEach(input => { input.checked = false; });
  ["buscaRegiao", "buscaUf", "buscaMunicipio", "buscaProduto"].forEach(id => { document.getElementById(id).value = ""; });
  document.querySelectorAll("[data-filter-option]").forEach(option => { option.style.display = ""; });
  document.getElementById("filtroAnoInicio").value = estadoFiltros.anoInicio;
  document.getElementById("filtroAnoFim").value = estadoFiltros.anoFim;
  atualizarLabelsDropdowns();
  aplicarFiltros();
}
function atualizarLabelsDropdowns() {
  atualizarLabelDropdown("filtroRegiaoBtn", estadoFiltros.regioes, "Todas");
  atualizarLabelDropdown("filtroUfBtn", estadoFiltros.ufs, "Todas");
  atualizarLabelDropdown("filtroMunicipioBtn", estadoFiltros.municipios, "Todos");
  atualizarLabelDropdown("filtroProdutoBtn", estadoFiltros.produtos, "Todos");
}
function inicializarFiltros() {
  setSelectOptions("filtroAnoInicio", ANOS_PRODUCAO);
  setSelectOptions("filtroAnoFim", ANOS_PRODUCAO);
  document.getElementById("filtroAnoInicio").value = estadoFiltros.anoInicio;
  document.getElementById("filtroAnoFim").value = estadoFiltros.anoFim;
  setDropdownOptions("filtroRegiaoMenu", [...SERIES_REGIAO, ...SERIES_MESO_LABEL]);
  setDropdownOptions("filtroUfMenu", Array.from(new Set([...SERIES_PRODUCAO_UF, ...DADOS_LEITE.producaoCO.map(d => d.uf)])).sort((a, b) => a.localeCompare(b, "pt-BR")));
  const municipiosOrdenados = TODOS_MUNICIPIOS.sort((a, b) => a.localeCompare(b, "pt-BR"));
  setDropdownOptions("filtroMunicipioMenu", municipiosOrdenados);
  setDropdownOptions("filtroProdutoMenu", PRODUTOS_FILTRO);
  conectarBuscaDropdown("buscaRegiao", "filtroRegiaoMenu");
  conectarBuscaDropdown("buscaUf", "filtroUfMenu");
  conectarBuscaDropdown("buscaMunicipio", "filtroMunicipioMenu");
  conectarBuscaDropdown("buscaProduto", "filtroProdutoMenu");
  document.querySelectorAll("[data-filter-group] .filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest("[data-filter-group]").dataset.filterGroup;
      estadoFiltros[group] = btn.dataset.filter;
      btn.closest("[data-filter-group]").querySelectorAll(".filter-btn").forEach(item => item.classList.toggle("active", item === btn));
      if (group === "escala") navegarParaFoco();
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
async function inicializarDashboardLeite() {
  await carregarDadosNovaApiLeite();
  inicializarFiltros();
  inicializarEstruturaGraficos();
  aplicarFiltros();
}

window.onFilterChange = function () {};
am5.ready(() => {
  inicializarDashboardLeite().catch(erro => {
    Object.values(ALVOS_API).flat().forEach(id => registrarFalhaApi([id], erro));
  });
});
