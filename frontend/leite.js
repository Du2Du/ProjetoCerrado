const P = ["#4a7c3f", "#c8943a", "#a0622b", "#6fa65e", "#2d5c24", "#e8a84c", "#7fb069", "#5c4033", "#3a6b4a", "#d4a843"];

const DADOS_LEITE = {
  producaoBilhoes: [],
  participacaoRegiao: [],
  producaoCO: [{"uf":"Mato Grosso do Sul","producaoLeiteMilhoesLitros":284823,"percentualParticipacao":7.2068},{"uf":"Mato Grosso","producaoLeiteMilhoesLitros":545924,"percentualParticipacao":13.8134},{"uf":"Goiás","producaoLeiteMilhoesLitros":3121391,"percentualParticipacao":78.9798}],
  producaoMeso: [{"ano":2013,"Noroeste goiano":302402,"Norte goiano":227167,"Centro goiano":983197,"Leste goiano":317277,"Sul goiano":1946760},{"ano":2014,"Noroeste goiano":294984,"Norte goiano":149130,"Centro goiano":1037974,"Leste goiano":309287,"Sul goiano":1867817},{"ano":2015,"Noroeste goiano":265306,"Norte goiano":141152,"Centro goiano":1000323,"Leste goiano":306458,"Sul goiano":1692274},{"ano":2016,"Noroeste goiano":239519,"Norte goiano":136726,"Centro goiano":946816,"Leste goiano":245780,"Sul goiano":1364600},{"ano":2017,"Noroeste goiano":219930,"Norte goiano":118696,"Centro goiano":992101,"Leste goiano":250031,"Sul goiano":1409074},{"ano":2018,"Noroeste goiano":218721,"Norte goiano":117443,"Centro goiano":1030281,"Leste goiano":272550,"Sul goiano":1445085},{"ano":2019,"Noroeste goiano":222374,"Norte goiano":120718,"Centro goiano":1051259,"Leste goiano":337869,"Sul goiano":1432743},{"ano":2020,"Noroeste goiano":221802,"Norte goiano":135239,"Centro goiano":1030888,"Leste goiano":342818,"Sul goiano":1442764},{"ano":2021,"Noroeste goiano":230043,"Norte goiano":145770,"Centro goiano":998924,"Leste goiano":295256,"Sul goiano":1451399}],
  municipiosProducao: [{"ano":2013,"Orizona":80000,"Piracanjuba":147490,"Jataí":143100,"Bela Vista de Goiás":44250,"Rio Verde":70000,"Pontalina":46690,"Silvânia":48000,"Pirenópolis":39165,"Itapuranga":30147,"Vianópolis":30610,"Morrinhos":165495},{"ano":2014,"Orizona":82500,"Piracanjuba":154800,"Jataí":144700,"Bela Vista de Goiás":71000,"Rio Verde":91000,"Pontalina":77000,"Silvânia":48500,"Pirenópolis":39230,"Itapuranga":31654,"Vianópolis":40000,"Morrinhos":80000},{"ano":2015,"Orizona":90000,"Piracanjuba":105805,"Jataí":98000,"Bela Vista de Goiás":71500,"Rio Verde":90000,"Pontalina":70020,"Silvânia":49000,"Pirenópolis":36000,"Itapuranga":33273,"Vianópolis":40500,"Morrinhos":75800},{"ano":2016,"Orizona":88000,"Piracanjuba":85500,"Jataí":87000,"Bela Vista de Goiás":70000,"Rio Verde":70000,"Pontalina":53515,"Silvânia":46500,"Pirenópolis":28000,"Itapuranga":34895,"Vianópolis":40000,"Morrinhos":56500},{"ano":2017,"Orizona":93000,"Piracanjuba":95000,"Jataí":85000,"Bela Vista de Goiás":73500,"Rio Verde":71300,"Pontalina":64200,"Silvânia":54000,"Pirenópolis":29720,"Itapuranga":54000,"Vianópolis":43500,"Morrinhos":56550},{"ano":2018,"Orizona":110000,"Piracanjuba":94878,"Jataí":86100,"Bela Vista de Goiás":79000,"Rio Verde":65800,"Pontalina":63800,"Silvânia":63500,"Pirenópolis":41272,"Itapuranga":55620,"Vianópolis":60000,"Morrinhos":59060},{"ano":2019,"Orizona":110500,"Piracanjuba":94975,"Jataí":88400,"Bela Vista de Goiás":78000,"Rio Verde":65950,"Pontalina":63500,"Silvânia":63000,"Pirenópolis":62611,"Itapuranga":61980,"Vianópolis":61000,"Morrinhos":60000},{"ano":2020,"Orizona":113000,"Piracanjuba":95100,"Jataí":88700,"Bela Vista de Goiás":77839,"Rio Verde":72122,"Pontalina":63600,"Silvânia":64500,"Pirenópolis":64324,"Itapuranga":62090,"Vianópolis":61325,"Morrinhos":60700},{"ano":2021,"Orizona":115826,"Piracanjuba":95800,"Jataí":89500,"Bela Vista de Goiás":78799,"Rio Verde":71450,"Pontalina":63890,"Silvânia":66000,"Pirenópolis":54904,"Itapuranga":64105,"Vianópolis":61649,"Morrinhos":60625}],
  produtividadeMunicipios: [{"municipio":"Orizona","2019":2833.3333,"2020":2825},{"municipio":"Piracanjuba","2019":2638.1944,"2020":2616.2311},{"municipio":"Jataí","2019":1890.9091,"2020":1879.2373},{"municipio":"Bela Vista de Goiás","2019":3095.2381,"2020":3094.9901},{"municipio":"Rio Verde","2019":1730.9711,"2020":1892.9659},{"municipio":"Pontalina","2019":2595.0143,"2020":2595.9184},{"municipio":"Silvânia","2019":3000,"2020":3000},{"municipio":"Pirenópolis","2019":2879.9908,"2020":2859.9884},{"municipio":"Itapuranga","2019":2574.9896,"2020":2563.5838},{"municipio":"Vianópolis","2019":3230.9322,"2020":3244.709},{"municipio":"Morrinhos","2019":1935.4839,"2020":1908.805}],
  rebanhoCO: [{"uf":"Centro-Oeste","2013":71124329,"2014":71234141,"2015":72705736,"2016":75112421,"2017":74128217,"2018":73838407,"2019":73970616,"2020":75075950,"2021":75413186},{"uf":"Mato Grosso do Sul","2013":21047274,"2014":21003830,"2015":21357398,"2016":21800990,"2017":21474693,"2018":20896700,"2019":19407908,"2020":19027086,"2021":18608503},{"uf":"Mato Grosso","2013":28395205,"2014":28592183,"2015":29364042,"2016":30296096,"2017":29725378,"2018":30199598,"2019":31654882,"2020":32338031,"2021":32424958},{"uf":"Goiás","2013":21580398,"2014":21538072,"2015":21887720,"2016":22919070,"2017":22835005,"2018":22651910,"2019":22823401,"2020":23626608,"2021":24293954}],
  vacasRegiao2021: [],
  produtividadeRegiao: [],
  vacasRegiaoSerie: [],
  vacasMeso: [{"mesorregiao":"Noroeste Goiano","2013":276437,"2014":276837,"2015":245128,"2016":219901,"2017":188501,"2018":181685,"2019":174503,"2020":171367,"2021":176931},{"mesorregiao":"Norte Goiano","2013":217279,"2014":155111,"2015":151212,"2016":150515,"2017":112101,"2018":109271,"2019":111000,"2020":123643,"2021":133462},{"mesorregiao":"Centro Goiano","2013":755684,"2014":784678,"2015":798556,"2016":745602,"2017":643948,"2018":645267,"2019":615727,"2020":594697,"2021":564432},{"mesorregiao":"Leste Goiano","2013":254484,"2014":249397,"2015":260516,"2016":224252,"2017":192997,"2018":181567,"2019":179845,"2020":187644,"2021":182744},{"mesorregiao":"Sul Goiano","2013":1219710,"2014":1172350,"2015":1063519,"2016":897602,"2017":847434,"2018":812804,"2019":799946,"2020":784705,"2021":748152}],
  precos: [{"produto":"Leite pasteurizado","go2020":3.01,"br2020":2.72,"go2021":3.68,"br2021":3.28},{"produto":"Leite UHT","go2020":3.3,"br2020":3.23,"go2021":3.32,"br2021":3.44},{"produto":"Queijo prato","go2020":29.45,"br2020":28.45,"go2021":30.87,"br2021":28.86},{"produto":"Leite em pó integral","go2020":22,"br2020":22.84,"go2021":24.06,"br2021":24.95},{"produto":"Manteiga","go2020":31.13,"br2020":29.12,"go2021":33.42,"br2021":32.7},{"produto":"Queijo muçarela","go2020":25.28,"br2020":26.29,"go2021":27.72,"br2021":25.55}],
  consumo: [{"produto":"Leite Pasteurizado","taxaCrescimento":-4.2732,"2011":1625,"2012":1430,"2013":1340,"2014":1220,"2015":1094,"2016":1105,"2017":1120,"2018":1090,"2019":1080,"2020":1050},{"produto":"Leite UHT","taxaCrescimento":1.8332,"2011":5818,"2012":6132,"2013":6385,"2014":6600,"2015":6730,"2016":6832,"2017":7026,"2018":6880,"2019":6858,"2020":6977},{"produto":"Leite em Pó","taxaCrescimento":1.557,"2011":6099,"2012":6252,"2013":6370,"2014":6260,"2015":6340,"2016":6607,"2017":6638,"2018":6708,"2019":6853,"2020":7118},{"produto":"Queijos","taxaCrescimento":2.5021,"2011":7059,"2012":7253,"2013":7763,"2014":8173,"2015":8198,"2016":8243,"2017":8406,"2018":8587,"2019":8776,"2020":9038},{"produto":"Demais Produtos","taxaCrescimento":1.0521,"2011":2293,"2012":2361,"2013":2573,"2014":2728,"2015":2287,"2016":1954,"2017":2221,"2018":2254,"2019":2414,"2020":2546}],
  rankingConsumo: [],
  vbpEstados: [],
  vbpRanking: [{"ranking":"1º","atividadePecuaria":"Bovinos","valorBilhoesReais":150.94,"percentualParticipacao":41.8395},{"ranking":"2º","atividadePecuaria":"Frango","valorBilhoesReais":108.93,"percentualParticipacao":30.1946},{"ranking":"3º","atividadePecuaria":"Leite","valorBilhoesReais":51.77,"percentualParticipacao":14.3503},{"ranking":"4º","atividadePecuaria":"Suínos","valorBilhoesReais":31.39,"percentualParticipacao":8.7011},{"ranking":"5º","atividadePecuaria":"Ovos","valorBilhoesReais":17.73,"percentualParticipacao":4.9146}],
  exportacoesAno: [{"ano":2012,"valorExportacaoUsd":10924170,"pesoExportadoKg":4304563},{"ano":2013,"valorExportacaoUsd":1218145,"pesoExportadoKg":374633},{"ano":2014,"valorExportacaoUsd":603624,"pesoExportadoKg":265464},{"ano":2015,"valorExportacaoUsd":820447,"pesoExportadoKg":458725},{"ano":2016,"valorExportacaoUsd":584668,"pesoExportadoKg":266634},{"ano":2017,"valorExportacaoUsd":833625,"pesoExportadoKg":283540},{"ano":2018,"valorExportacaoUsd":945647,"pesoExportadoKg":306693},{"ano":2019,"valorExportacaoUsd":888546,"pesoExportadoKg":515183},{"ano":2020,"valorExportacaoUsd":1037428,"pesoExportadoKg":472961},{"ano":2021,"valorExportacaoUsd":890688,"pesoExportadoKg":358140},{"ano":2022,"valorExportacaoUsd":1069480,"pesoExportadoKg":360654}],
  destinoExportacoes: [{"paisDestino":"Bolívia","valorExportacaoUsd":2346875,"percentualParticipacao":23.85},{"paisDestino":"Argélia","valorExportacaoUsd":1642157,"percentualParticipacao":16.69},{"paisDestino":"Uruguai","valorExportacaoUsd":1329867,"percentualParticipacao":13.52},{"paisDestino":"Venezuela","valorExportacaoUsd":1019062,"percentualParticipacao":10.36},{"paisDestino":"Chile","valorExportacaoUsd":955975,"percentualParticipacao":9.72},{"paisDestino":"Paraguai","valorExportacaoUsd":788300,"percentualParticipacao":8.01},{"paisDestino":"Estados unidos","valorExportacaoUsd":614966,"percentualParticipacao":6.25},{"paisDestino":"Angola","valorExportacaoUsd":507037,"percentualParticipacao":5.15}],
  produtosExportados: [{"produto":"Manteiga e demais gorduras","valorExportacaoUsd":2784850,"percentualParticipacao":28.31},{"produto":"Creme de leite","valorExportacaoUsd":1524043,"percentualParticipacao":15.49},{"produto":"Leite em pó","valorExportacaoUsd":1222263,"percentualParticipacao":12.42},{"produto":"Queijo","valorExportacaoUsd":1080271,"percentualParticipacao":10.98},{"produto":"Leitelho","valorExportacaoUsd":1066682,"percentualParticipacao":10.84},{"produto":"Demais produtos lácteos","valorExportacaoUsd":1030045,"percentualParticipacao":10.47},{"produto":"Leite condensado","valorExportacaoUsd":917892,"percentualParticipacao":9.33}],
  importacoesAno: [{"ano":2011,"valorImportacaoUsd":122245},{"ano":2012,"valorImportacaoUsd":635914},{"ano":2013,"valorImportacaoUsd":2460000},{"ano":2015,"valorImportacaoUsd":425114},{"ano":2016,"valorImportacaoUsd":2176286},{"ano":2017,"valorImportacaoUsd":5544200},{"ano":2018,"valorImportacaoUsd":6638770},{"ano":2019,"valorImportacaoUsd":11085966},{"ano":2020,"valorImportacaoUsd":8318982}],
  origemImportacoes: [{"paisOrigem":"Uruguai","valorImportacaoUsd":31290231,"percentualParticipacao":83.65},{"paisOrigem":"Argentina","valorImportacaoUsd":4102857,"percentualParticipacao":10.97},{"paisOrigem":"Chile","valorImportacaoUsd":1567310,"percentualParticipacao":4.19},{"paisOrigem":"Estados unidos","valorImportacaoUsd":446265,"percentualParticipacao":1.19}],
  produtosImportados: [{"produto":"Demais produtos lácteos","valorImportacaoUsd":447079,"pesoImportadoKg":280335},{"produto":"Leite fluido e leite em pó","valorImportacaoUsd":36649318,"pesoImportadoKg":11810000},{"produto":"Soro de leite","valorImportacaoUsd":311080,"pesoImportadoKg":360000}],
  caracteristicasGrupo: [{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 1 a 2","numeroEstabelecimentos":548,"quantidadeLeiteProduzido":1580},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 3 a 5","numeroEstabelecimentos":2189,"quantidadeLeiteProduzido":9773},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 6 a 10","numeroEstabelecimentos":5635,"quantidadeLeiteProduzido":38080},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 11 a 20","numeroEstabelecimentos":11028,"quantidadeLeiteProduzido":127175},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 21 a 50","numeroEstabelecimentos":23361,"quantidadeLeiteProduzido":556959},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 51 a 100","numeroEstabelecimentos":13314,"quantidadeLeiteProduzido":591432},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 101 a 200","numeroEstabelecimentos":8055,"quantidadeLeiteProduzido":578630},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 201 a 500","numeroEstabelecimentos":5304,"quantidadeLeiteProduzido":499385},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 501 a 1000","numeroEstabelecimentos":1745,"quantidadeLeiteProduzido":156785},{"ano":2017,"uf":"Goiás","grupoCabecasBovinos":"De 1001 e mais","numeroEstabelecimentos":984,"quantidadeLeiteProduzido":107212}],
  caracteristicasCondicao: [{"ano":2017,"uf":"Goiás","condicaoProdutor":"Agricultura familiar - não","numeroEstabelecimentos":22297,"quantidadeLeiteProduzido":1258709},{"ano":2017,"uf":"Goiás","condicaoProdutor":"Agricultura familiar - sim","numeroEstabelecimentos":50056,"quantidadeLeiteProduzido":1411682},{"ano":2017,"uf":"Goiás","condicaoProdutor":"Pronamp - sim","numeroEstabelecimentos":22044,"quantidadeLeiteProduzido":1185175},{"ano":2017,"uf":"Goiás","condicaoProdutor":"Pronamp - não","numeroEstabelecimentos":50309,"quantidadeLeiteProduzido":1485216}]
};

// Conjuntos cobertos pelos endpoints atuais nunca usam os dados fixos acima como fallback.
Object.assign(DADOS_LEITE, {
  producaoCO: [], producaoMeso: [], municipiosProducao: [], produtividadeMunicipios: [],
  rebanhoCO: [], vacasMeso: []
});

// Atributos ausentes no Excel: quantidadeVacasOrdenhadas e valorProducaoLeite na aba
// "Características dos produtores"; quantidadeLeiteVendido e valorVendaLeite no bloco
// "Produtos lácteos importados". Foram usados os atributos disponíveis mais próximos.

let ANOS_PRODUCAO = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"];
const ANOS_CONSUMO = ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
const ANOS_PROJECAO = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"];
const SERIES_PRODUCAO_UF = ["Brasil", "Minas Gerais", "Paraná", "Rio Grande do Sul", "Goiás", "Santa Catarina"];
const SERIES_MESO = ["Noroeste goiano", "Norte goiano", "Centro goiano", "Leste goiano", "Sul goiano"];
const SERIES_MESO_LABEL = ["Noroeste Goiano", "Norte Goiano", "Centro Goiano", "Leste Goiano", "Sul Goiano"];
let SERIES_REGIAO = [];
let SERIES_UF_CO = [];
let TODOS_MUNICIPIOS = [];
let ANOS_PRODUTIVIDADE_MUNICIPIOS = [];
let PRODUTOS_FILTRO = [];
let SERIES_VBP = [];
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

const SIDRA_BASE_URL = "https://apisidra.ibge.gov.br/values";
const SIDRA_ENDPOINTS = Object.freeze({
  producaoBrasilEstados: "/t/74/n1/all/n3/31,41,43,52,42/v/106/p/last%2010/c80/2682",
  producaoRegioes: "/t/74/n2/all/v/106/p/last%201/c80/2682",
  vacasRegioes: "/t/94/n2/all/v/107/p/last%2010",
  rankingConsumo: "/t/2393/n3/all/v/all/p/2018/c217/4554,104442",
  vbpCentroOeste: "/t/74/n3/50,51,52/v/215/p/last%2010/c80/2682"
});
const VALORES_SIDRA_AUSENTES = new Set(["...", "..", "-", "X", ""]);
const requisicoesSidra = new Map();
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

const VISUALIZACOES_SEM_ENDPOINT = [
  "chartPrecosLacteos", "chartConsumoLacteos", "chartVbpLeite", "chartRankingVbp",
  "chartExportacoesAno", "chartDestinoExportacoes", "chartProdutosExportados",
  "chartImportacoesAno", "chartOrigemImportacoes", "chartProdutosImportados",
  "chartProducaoPorRebanho", "chartProducaoPorCondicao", "chartLeiteProjecoes"
];

class ErroDadosVazios extends Error {}

function numeroSidra(valor) {
  const texto = String(valor ?? "").trim();
  if (VALORES_SIDRA_AUSENTES.has(texto)) return null;
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : null;
}

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

function comentarVisualizacoesSemEndpoint() {
  VISUALIZACOES_SEM_ENDPOINT.forEach(id => {
    const container = containerVisualizacao(id);
    if (!container) return;
    const bloco = container.closest("[data-category]") || container;
    const titulo = container.querySelector(".chart-card__title")?.textContent.trim() || id;
    bloco.replaceWith(document.createComment(` Visualização comentada: ${titulo} — endpoint não documentado. `));
  });
}

async function buscarSidra(caminho) {
  if (requisicoesSidra.has(caminho)) return requisicoesSidra.get(caminho);

  const requisicao = (async () => {
    if (window.simularErroApi) throw new Error("Falha simulada para teste da interface.");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const resposta = await fetch(`${SIDRA_BASE_URL}${caminho}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!resposta.ok) throw new Error(`SIDRA respondeu com HTTP ${resposta.status}`);
      const payload = await resposta.json();
      if (!Array.isArray(payload) || payload.length < 2) {
        throw new ErroDadosVazios("O Servidor não retornou registros.");
      }
      return payload.slice(1);
    } finally {
      window.clearTimeout(timeout);
    }
  })();

  requisicoesSidra.set(caminho, requisicao);
  return requisicao;
}

function validarLinhasSidra(linhas, { unidade, produto } = {}) {
  const validas = linhas.filter(linha => numeroSidra(linha.V) !== null);
  if (!validas.length) throw new ErroDadosVazios("O Servidor não retornou valores válidos.");
  if (unidade && validas.some(linha => linha.MN !== unidade)) {
    throw new Error(`Unidade inesperada na resposta do SIDRA (esperado: ${unidade}).`);
  }
  if (produto && validas.some(linha => linha.D4N !== produto)) {
    throw new Error(`Produto inesperado na resposta do SIDRA (esperado: ${produto}).`);
  }
  return validas;
}

function mapearProducaoBrasilEstados(linhas) {
  const validas = validarLinhasSidra(linhas, { unidade: "Mil litros", produto: "Leite" });
  const porAno = new Map();
  validas.forEach(linha => {
    const ano = String(linha.D3N);
    if (!porAno.has(ano)) porAno.set(ano, { Ano: Number(ano) });
    porAno.get(ano)[linha.D1N] = numeroSidra(linha.V) / 1_000_000;
  });
  return Array.from(porAno.values()).sort((a, b) => a.Ano - b.Ano);
}

function mapearProducaoRegioes(linhas) {
  const validas = validarLinhasSidra(linhas, { unidade: "Mil litros", produto: "Leite" });
  const anos = ordenarAnos(validas.map(linha => linha.D3N));
  const ano = anos.at(-1);
  const atuais = validas.filter(linha => linha.D3N === ano);
  const totalMilLitros = atuais.reduce((soma, linha) => soma + numeroSidra(linha.V), 0);
  if (!totalMilLitros) throw new ErroDadosVazios("A produção regional retornou total zero.");
  return {
    ano,
    dados: atuais.map(linha => ({
      codigoRegiao: linha.D1C,
      regiao: linha.D1N,
      producaoLeiteMilhoesLitros: numeroSidra(linha.V) / 1_000,
      percentualParticipacao: numeroSidra(linha.V) / totalMilLitros * 100
    }))
  };
}

function mapearVacasRegioes(linhas) {
  const validas = validarLinhasSidra(linhas, { unidade: "Cabeças" });
  const anos = ordenarAnos(validas.map(linha => linha.D3N));
  const anoAtual = anos.at(-1);
  const porRegiao = new Map();

  validas.forEach(linha => {
    if (!porRegiao.has(linha.D1C)) {
      porRegiao.set(linha.D1C, { codigoRegiao: linha.D1C, regiao: linha.D1N });
    }
    porRegiao.get(linha.D1C)[linha.D3N] = numeroSidra(linha.V);
  });

  const atuais = validas.filter(linha => linha.D3N === anoAtual);
  const total = atuais.reduce((soma, linha) => soma + numeroSidra(linha.V), 0);
  if (!total) throw new ErroDadosVazios("O total de vacas ordenhadas retornou zero.");

  return {
    anos,
    anoAtual,
    serie: Array.from(porRegiao.values()),
    atuais: atuais.map(linha => ({
      codigoRegiao: linha.D1C,
      regiao: linha.D1N,
      quantidadeVacasOrdenhadas: numeroSidra(linha.V),
      percentualParticipacao: numeroSidra(linha.V) / total * 100
    }))
  };
}

function calcularProdutividadeRegional(producao, vacas) {
  if (!producao || !vacas || producao.ano !== vacas.anoAtual) {
    throw new ErroDadosVazios("Produção e vacas ordenhadas não possuem um ano comum.");
  }
  const vacasPorCodigo = new Map(vacas.atuais.map(item => [item.codigoRegiao, item.quantidadeVacasOrdenhadas]));
  const produtividade = producao.dados.map(item => {
    const quantidadeVacas = vacasPorCodigo.get(item.codigoRegiao);
    if (!quantidadeVacas) return null;
    return {
      regiao: item.regiao,
      produtividadeLitrosPorVacaAno: item.producaoLeiteMilhoesLitros * 1_000_000 / quantidadeVacas
    };
  }).filter(Boolean);
  if (!produtividade.length) throw new ErroDadosVazios("Não foi possível calcular a produtividade regional.");
  return produtividade;
}

function nomeProdutoPof(nome) {
  return String(nome).replace(/^\d+(?:\.\d+)*\s*/, "").trim();
}

function mapearRankingConsumo(linhas) {
  const validas = validarLinhasSidra(linhas, { unidade: "Quilogramas" });
  const porProduto = new Map();
  validas.forEach(linha => {
    if (!porProduto.has(linha.D4C)) porProduto.set(linha.D4C, []);
    porProduto.get(linha.D4C).push(linha);
  });

  const ranking = Array.from(porProduto.values()).map(produto => {
    const ordenado = produto.sort((a, b) => numeroSidra(b.V) - numeroSidra(a.V));
    const posicaoGoias = ordenado.findIndex(linha => linha.D1C === "52") + 1;
    return {
      produto: nomeProdutoPof(produto[0].D4N),
      melhorPosicao: posicaoGoias,
      ano: produto[0].D3N
    };
  }).filter(item => item.melhorPosicao > 0 && item.melhorPosicao <= 5);

  if (!ranking.length) throw new ErroDadosVazios("Goiás não aparece no Top 5 dos produtos consultados.");
  return ranking.sort((a, b) => a.melhorPosicao - b.melhorPosicao);
}

function mapearVbpCentroOeste(linhas) {
  const validas = validarLinhasSidra(linhas, { unidade: "Mil Reais", produto: "Leite" });
  const anos = ordenarAnos(validas.map(linha => linha.D3N));
  const comparados = [anos[0], anos.at(-1)];
  const porEstado = new Map();
  validas.filter(linha => comparados.includes(linha.D3N)).forEach(linha => {
    if (!porEstado.has(linha.D1C)) porEstado.set(linha.D1C, { estado: linha.D1N });
    porEstado.get(linha.D1C)[linha.D3N] = numeroSidra(linha.V) * 1_000;
  });
  const dados = Array.from(porEstado.values());
  if (!dados.length) throw new ErroDadosVazios("O Servidor não retornou dados de VBP.");
  return { anos: comparados, dados };
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
  PRODUTOS_FILTRO = Array.from(new Set([
    ...DADOS_LEITE.precos.map(d => d.produto),
    ...DADOS_LEITE.consumo.map(d => d.produto),
    ...DADOS_LEITE.rankingConsumo.map(d => d.produto),
    ...DADOS_LEITE.produtosExportados.map(d => d.produto),
    ...DADOS_LEITE.produtosImportados.map(d => d.produto),
    ...DADOS_LEITE.caracteristicasGrupo.map(d => d.grupoCabecasBovinos),
    ...DADOS_LEITE.caracteristicasCondicao.map(d => d.condicaoProdutor)
  ])).sort((a, b) => a.localeCompare(b, "pt-BR"));

  if (anosApi.length) {
    PERIODO_PADRAO = { inicio: anosApi[0], fim: anosApi.at(-1) };
    estadoFiltros.anoInicio = PERIODO_PADRAO.inicio;
    estadoFiltros.anoFim = PERIODO_PADRAO.fim;
  }
}

async function carregarDadosApiLeite() {
  Object.values(ALVOS_API).flat().forEach(id => definirEstadoVisualizacao([id], "loading"));

  const nomes = Object.keys(SIDRA_ENDPOINTS);
  const resultados = await Promise.allSettled(
    nomes.map(nome => buscarSidra(SIDRA_ENDPOINTS[nome]))
  );
  const resposta = Object.fromEntries(nomes.map((nome, indice) => [nome, resultados[indice]]));

  if (resposta.producaoBrasilEstados.status === "fulfilled") {
    try {
      DADOS_LEITE.producaoBilhoes = mapearProducaoBrasilEstados(resposta.producaoBrasilEstados.value);
      metadadosApi.anosProducao = ordenarAnos(DADOS_LEITE.producaoBilhoes.map(item => item.Ano));
      definirEstadoVisualizacao(ALVOS_API.producao, "ready");
      marcarFonteApi(ALVOS_API.producao);
      atualizarTextoVisualizacao("chartLeiteSeries", {
        subtitulo: `Bilhões de litros por ano (${periodoTexto(metadadosApi.anosProducao)})`,
        ariaLabel: `Gráfico: produção de leite no Brasil e estados, de ${periodoTexto(metadadosApi.anosProducao)}`
      });
    } catch (erro) {
      registrarFalhaApi(ALVOS_API.producao, erro);
    }
  } else {
    registrarFalhaApi(ALVOS_API.producao, resposta.producaoBrasilEstados.reason);
  }

  let producaoRegioes;
  if (resposta.producaoRegioes.status === "fulfilled") {
    try {
      producaoRegioes = mapearProducaoRegioes(resposta.producaoRegioes.value);
      DADOS_LEITE.participacaoRegiao = producaoRegioes.dados;
      metadadosApi.anoRegioes = producaoRegioes.ano;
      definirEstadoVisualizacao(ALVOS_API.regioes, "ready");
      marcarFonteApi(ALVOS_API.regioes);
      atualizarTextoVisualizacao("chartLeiteRegiao", {
        titulo: `Participação Regional (${producaoRegioes.ano})`,
        ariaLabel: `Gráfico: participação regional na produção de leite em ${producaoRegioes.ano}`
      });
      atualizarTextoVisualizacao("tabelaRegioesLeite", {
        titulo: `Regiões Brasileiras — ${producaoRegioes.ano}`,
        ariaLabel: `Produção de leite por região em ${producaoRegioes.ano}`
      });
    } catch (erro) {
      registrarFalhaApi(ALVOS_API.regioes, erro);
    }
  } else {
    registrarFalhaApi(ALVOS_API.regioes, resposta.producaoRegioes.reason);
  }

  let vacasRegioes;
  if (resposta.vacasRegioes.status === "fulfilled") {
    try {
      vacasRegioes = mapearVacasRegioes(resposta.vacasRegioes.value);
      DADOS_LEITE.vacasRegiaoSerie = vacasRegioes.serie;
      DADOS_LEITE.vacasRegiao2021 = vacasRegioes.atuais;
      metadadosApi.anosVacas = vacasRegioes.anos;
      metadadosApi.anoVacas = vacasRegioes.anoAtual;
      definirEstadoVisualizacao(ALVOS_API.vacas, "ready");
      marcarFonteApi(ALVOS_API.vacas);
      atualizarTextoVisualizacao("chartVacasRegiao", {
        titulo: `Vacas Ordenhadas por Região (${vacasRegioes.anoAtual})`,
        ariaLabel: `Gráfico: vacas ordenhadas por região em ${vacasRegioes.anoAtual}`
      });
      atualizarTextoVisualizacao("chartVacasRegiaoSerie", {
        subtitulo: `Cabeças — ${periodoTexto(vacasRegioes.anos)}`,
        ariaLabel: `Gráfico: série de vacas ordenhadas por região, de ${periodoTexto(vacasRegioes.anos)}`
      });
    } catch (erro) {
      registrarFalhaApi(ALVOS_API.vacas, erro);
    }
  } else {
    registrarFalhaApi(ALVOS_API.vacas, resposta.vacasRegioes.reason);
  }

  if (producaoRegioes && vacasRegioes) {
    try {
      DADOS_LEITE.produtividadeRegiao = calcularProdutividadeRegional(producaoRegioes, vacasRegioes);
      definirEstadoVisualizacao(ALVOS_API.produtividade, "ready");
      marcarFonteApi(ALVOS_API.produtividade);
      atualizarTextoVisualizacao("chartProdutividade", {
        titulo: `Produtividade por Região (${producaoRegioes.ano})`,
        ariaLabel: `Gráfico: produtividade por região em ${producaoRegioes.ano}`
      });
    } catch (erro) {
      registrarFalhaApi(ALVOS_API.produtividade, erro);
    }
  } else {
    registrarFalhaApi(ALVOS_API.produtividade, new Error("Falha nas fontes usadas para calcular a produtividade."));
  }

  if (resposta.rankingConsumo.status === "fulfilled") {
    try {
      DADOS_LEITE.rankingConsumo = mapearRankingConsumo(resposta.rankingConsumo.value);
      metadadosApi.anoRanking = DADOS_LEITE.rankingConsumo[0]?.ano;
      definirEstadoVisualizacao(ALVOS_API.ranking, "ready");
      marcarFonteApi(ALVOS_API.ranking);
      atualizarTextoVisualizacao("chartRankingConsumo", {
        subtitulo: `Posição de Goiás na aquisição domiciliar per capita — POF ${metadadosApi.anoRanking}`
      });
    } catch (erro) {
      registrarFalhaApi(ALVOS_API.ranking, erro);
    }
  } else {
    registrarFalhaApi(ALVOS_API.ranking, resposta.rankingConsumo.reason);
  }

  if (resposta.vbpCentroOeste.status === "fulfilled") {
    try {
      const vbp = mapearVbpCentroOeste(resposta.vbpCentroOeste.value);
      DADOS_LEITE.vbpEstados = vbp.dados;
      SERIES_VBP = vbp.anos.map(ano => ({ nome: ano, campo: ano }));
      metadadosApi.anosVbp = vbp.anos;
      definirEstadoVisualizacao(ALVOS_API.vbp, "ready");
      marcarFonteApi(ALVOS_API.vbp);
      atualizarTextoVisualizacao("chartVbpLeite", {
        subtitulo: `Centro-Oeste — ${vbp.anos[0]} vs ${vbp.anos.at(-1)}`,
        ariaLabel: `Gráfico: valor bruto da produção de leite no Centro-Oeste, ${vbp.anos[0]} e ${vbp.anos.at(-1)}`
      });
    } catch (erro) {
      registrarFalhaApi(ALVOS_API.vbp, erro);
    }
  } else {
    registrarFalhaApi(ALVOS_API.vbp, resposta.vbpCentroOeste.reason);
  }

  atualizarColecoesDinamicas();
  atualizarCardsLeite();
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
  graficoBarrasAgrupadas("chartPrecosLacteos", "produto", [{ nome: "GO 2020", campo: "go2020" }, { nome: "BR 2020", campo: "br2020" }, { nome: "GO 2021", campo: "go2021" }, { nome: "BR 2021", campo: "br2021" }], " R$");
  graficoLinhas("chartConsumoLacteos", "ano", DADOS_LEITE.consumo.map(d => d.produto));
  graficoBarras("chartRankingConsumo", "produto", "melhorPosicao", true);
  graficoBarrasAgrupadas("chartVbpLeite", "estado", SERIES_VBP, " R$");
  graficoBarras("chartRankingVbp", "atividadePecuaria", "valorBilhoesReais", true, " bi R$");
  graficoBarrasAgrupadas("chartExportacoesAno", "ano", [{ nome: "Valor US$", campo: "valorExportacaoUsd" }, { nome: "Peso kg", campo: "pesoExportadoKg" }]);
  graficoPizza("chartDestinoExportacoes", "paisDestino", "percentualParticipacao");
  graficoBarras("chartProdutosExportados", "produto", "valorExportacaoUsd", true, " US$");
  graficoBarras("chartImportacoesAno", "ano", "valorImportacaoUsd", false, " US$");
  graficoPizza("chartOrigemImportacoes", "paisOrigem", "percentualParticipacao");
  graficoBarras("chartProdutosImportados", "produto", "valorExportacaoUsd", true, " US$");
  graficoBarrasAgrupadas("chartProducaoPorRebanho", "grupoCabecasBovinos", [{ nome: "Estabelecimentos", campo: "numeroEstabelecimentos" }, { nome: "Leite produzido (mil L)", campo: "quantidadeLeiteProduzido" }]);
  graficoBarrasAgrupadas("chartProducaoPorCondicao", "condicaoProdutor", [{ nome: "Estabelecimentos", campo: "numeroEstabelecimentos" }, { nome: "Leite produzido (mil L)", campo: "quantidadeLeiteProduzido" }]);
  graficoLinhas("chartLeiteProjecoes", "ano", ["otimista", "base", "pessimista"], " bi L");
}

function aplicarFiltros() {
  const anosVacasRegiao = anosNoPeriodo(metadadosApi.anosVacas || []);
  const anosMeso = anosNoPeriodo(ordenarAnos(DADOS_LEITE.producaoMeso.map(d => d.ano)));
  const anosVacasMeso = anosNoPeriodo(ordenarAnos(DADOS_LEITE.vacasMeso.flatMap(d => Object.keys(d).filter(k => /^\d{4}$/.test(k)))));
  const anosRebanho = anosNoPeriodo(ordenarAnos(DADOS_LEITE.rebanhoCO.flatMap(d => Object.keys(d).filter(k => /^\d{4}$/.test(k)))));
  const anosMunicipios = anosNoPeriodo(ordenarAnos(DADOS_LEITE.municipiosProducao.map(d => d.ano)));
  const anosConsumo = anosNoPeriodo(ANOS_CONSUMO);
  const anosExportacao = anosNoPeriodo(DADOS_LEITE.exportacoesAno.map(d => String(d.ano)));
  const anosImportacao = anosNoPeriodo(DADOS_LEITE.importacoesAno.map(d => String(d.ano)));
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

  const precos = DADOS_LEITE.precos.filter(d => temIntersecaoProduto(d.produto));
  const consumo = DADOS_LEITE.consumo.filter(d => temIntersecaoProduto(d.produto));
  graficos.chartPrecosLacteos?.update(precos, [{ nome: "GO 2020", campo: "go2020" }, { nome: "BR 2020", campo: "br2020" }, { nome: "GO 2021", campo: "go2021" }, { nome: "BR 2021", campo: "br2021" }]);
  graficos.chartConsumoLacteos?.update(dadosPorAno(consumo, "produto", anosConsumo, consumo.map(d => d.produto)), consumo.map(d => d.produto));
  graficos.chartRankingConsumo?.update(DADOS_LEITE.rankingConsumo.filter(d => temIntersecaoProduto(d.produto)));
  graficos.chartVbpLeite?.update(filtrarPorCampo(DADOS_LEITE.vbpEstados, "estado", estadoFiltros.ufs), SERIES_VBP);
  graficos.chartRankingVbp?.update(DADOS_LEITE.vbpRanking.filter(d => temIntersecaoProduto(d.atividadePecuaria)));

  graficos.chartExportacoesAno?.update(DADOS_LEITE.exportacoesAno.filter(d => anosExportacao.includes(String(d.ano))), [{ nome: "Valor US$", campo: "valorExportacaoUsd" }, { nome: "Peso kg", campo: "pesoExportadoKg" }]);
  graficos.chartDestinoExportacoes?.update(DADOS_LEITE.destinoExportacoes);
  graficos.chartProdutosExportados?.update(DADOS_LEITE.produtosExportados.filter(d => temIntersecaoProduto(d.produto)));
  graficos.chartImportacoesAno?.update(DADOS_LEITE.importacoesAno.filter(d => anosImportacao.includes(String(d.ano))));
  graficos.chartOrigemImportacoes?.update(DADOS_LEITE.origemImportacoes);
  graficos.chartProdutosImportados?.update(DADOS_LEITE.produtosImportados.filter(d => temIntersecaoProduto(d.produto)));

  graficos.chartProducaoPorRebanho?.update(DADOS_LEITE.caracteristicasGrupo.filter(d => temIntersecaoProduto(d.grupoCabecasBovinos)), [{ nome: "Estabelecimentos", campo: "numeroEstabelecimentos" }, { nome: "Leite produzido (mil L)", campo: "quantidadeLeiteProduzido" }]);
  graficos.chartProducaoPorCondicao?.update(DADOS_LEITE.caracteristicasCondicao.filter(d => temIntersecaoProduto(d.condicaoProdutor)), [{ nome: "Estabelecimentos", campo: "numeroEstabelecimentos" }, { nome: "Leite produzido (mil L)", campo: "quantidadeLeiteProduzido" }]);
  const projecoes = ANOS_PROJECAO.map((ano, i) => ({ ano, otimista: [3.809,3.982,4.164,4.354,4.552,4.76,4.977,5.204,5.441,5.689,5.948,6.22][i], base: [3.809,3.927,4.049,4.175,4.304,4.438,4.576,4.718,4.863,5.014,5.17,5.33][i], pessimista: [3.809,3.836,3.864,3.891,3.919,3.948,3.976,4.005,4.034,4.063,4.092,4.122][i] }));
  graficos.chartLeiteProjecoes?.update(projecoes, ["otimista", "base", "pessimista"]);

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
  setSelectOptions("filtroAnoInicio", Array.from(new Set([...ANOS_CONSUMO, ...ANOS_PRODUCAO, ...DADOS_LEITE.exportacoesAno.map(d => String(d.ano)), ...DADOS_LEITE.importacoesAno.map(d => String(d.ano))])).sort());
  setSelectOptions("filtroAnoFim", Array.from(new Set([...ANOS_CONSUMO, ...ANOS_PRODUCAO, ...DADOS_LEITE.exportacoesAno.map(d => String(d.ano)), ...DADOS_LEITE.importacoesAno.map(d => String(d.ano))])).sort());
  document.getElementById("filtroAnoInicio").value = estadoFiltros.anoInicio;
  document.getElementById("filtroAnoFim").value = estadoFiltros.anoFim;
  setDropdownOptions("filtroRegiaoMenu", [...SERIES_REGIAO, ...SERIES_MESO_LABEL]);
  setDropdownOptions("filtroUfMenu", Array.from(new Set([...SERIES_PRODUCAO_UF, ...DADOS_LEITE.producaoCO.map(d => d.uf), ...DADOS_LEITE.vbpEstados.map(d => d.estado)])).sort((a, b) => a.localeCompare(b, "pt-BR")));
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
  comentarVisualizacoesSemEndpoint();
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
