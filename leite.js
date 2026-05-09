const P = ["#4a7c3f", "#c8943a", "#a0622b", "#6fa65e", "#2d5c24", "#e8a84c", "#7fb069", "#5c4033", "#3a6b4a", "#d4a843"];

const DADOS_LEITE = {
  producaoBilhoes: [{"Ano":2013,"Brasil":34.26,"Minas Gerais":9.3092,"Paraná":4.3475,"Rio Grande do Sul":4.5085,"Goiás":3.7768,"Santa Catarina":2.9183},{"Ano":2014,"Brasil":35.12,"Minas Gerais":9.3705,"Paraná":4.5407,"Rio Grande do Sul":4.6875,"Goiás":3.6592,"Santa Catarina":2.9832},{"Ano":2015,"Brasil":34.61,"Minas Gerais":9.145,"Paraná":4.6596,"Rio Grande do Sul":4.5999,"Goiás":3.4055,"Santa Catarina":3.0599},{"Ano":2016,"Brasil":33.68,"Minas Gerais":8.9138,"Paraná":4.7263,"Rio Grande do Sul":4.6138,"Goiás":2.9334,"Santa Catarina":3.1138},{"Ano":2017,"Brasil":33.31,"Minas Gerais":8.8682,"Paraná":4.4327,"Rio Grande do Sul":4.3632,"Goiás":2.9898,"Santa Catarina":2.9846},{"Ano":2018,"Brasil":33.92,"Minas Gerais":8.9392,"Paraná":4.3877,"Rio Grande do Sul":4.2423,"Goiás":3.0841,"Santa Catarina":2.9685},{"Ano":2019,"Brasil":34.85,"Minas Gerais":9.4475,"Paraná":4.3492,"Rio Grande do Sul":4.303,"Goiás":3.165,"Santa Catarina":3.0402},{"Ano":2020,"Brasil":35.37,"Minas Gerais":9.6924,"Paraná":4.6387,"Rio Grande do Sul":4.2498,"Goiás":3.1889,"Santa Catarina":3.1372},{"Ano":2021,"Brasil":35.31,"Minas Gerais":9.6117,"Paraná":4.4156,"Rio Grande do Sul":4.3852,"Goiás":3.1214,"Santa Catarina":3.162}],
  participacaoRegiao: [{"regiao":"Norte","producaoLeiteMilhoesLitros":1858978,"percentualParticipacao":5.2655},{"regiao":"Nordeste","producaoLeiteMilhoesLitros":5547029,"percentualParticipacao":15.7117},{"regiao":"Sudeste","producaoLeiteMilhoesLitros":11954216,"percentualParticipacao":33.8598},{"regiao":"Sul","producaoLeiteMilhoesLitros":11962826,"percentualParticipacao":33.8842},{"regiao":"Centro-Oeste","producaoLeiteMilhoesLitros":3981998,"percentualParticipacao":11.2788}],
  producaoCO: [{"uf":"Mato Grosso do Sul","producaoLeiteMilhoesLitros":284823,"percentualParticipacao":7.2068},{"uf":"Mato Grosso","producaoLeiteMilhoesLitros":545924,"percentualParticipacao":13.8134},{"uf":"Goiás","producaoLeiteMilhoesLitros":3121391,"percentualParticipacao":78.9798}],
  producaoMeso: [{"ano":2013,"Noroeste goiano":302402,"Norte goiano":227167,"Centro goiano":983197,"Leste goiano":317277,"Sul goiano":1946760},{"ano":2014,"Noroeste goiano":294984,"Norte goiano":149130,"Centro goiano":1037974,"Leste goiano":309287,"Sul goiano":1867817},{"ano":2015,"Noroeste goiano":265306,"Norte goiano":141152,"Centro goiano":1000323,"Leste goiano":306458,"Sul goiano":1692274},{"ano":2016,"Noroeste goiano":239519,"Norte goiano":136726,"Centro goiano":946816,"Leste goiano":245780,"Sul goiano":1364600},{"ano":2017,"Noroeste goiano":219930,"Norte goiano":118696,"Centro goiano":992101,"Leste goiano":250031,"Sul goiano":1409074},{"ano":2018,"Noroeste goiano":218721,"Norte goiano":117443,"Centro goiano":1030281,"Leste goiano":272550,"Sul goiano":1445085},{"ano":2019,"Noroeste goiano":222374,"Norte goiano":120718,"Centro goiano":1051259,"Leste goiano":337869,"Sul goiano":1432743},{"ano":2020,"Noroeste goiano":221802,"Norte goiano":135239,"Centro goiano":1030888,"Leste goiano":342818,"Sul goiano":1442764},{"ano":2021,"Noroeste goiano":230043,"Norte goiano":145770,"Centro goiano":998924,"Leste goiano":295256,"Sul goiano":1451399}],
  municipiosProducao: [{"ano":2013,"Orizona":80000,"Piracanjuba":147490,"Jataí":143100,"Bela Vista de Goiás":44250,"Rio Verde":70000,"Pontalina":46690,"Silvânia":48000,"Pirenópolis":39165,"Itapuranga":30147,"Vianópolis":30610,"Morrinhos":165495},{"ano":2014,"Orizona":82500,"Piracanjuba":154800,"Jataí":144700,"Bela Vista de Goiás":71000,"Rio Verde":91000,"Pontalina":77000,"Silvânia":48500,"Pirenópolis":39230,"Itapuranga":31654,"Vianópolis":40000,"Morrinhos":80000},{"ano":2015,"Orizona":90000,"Piracanjuba":105805,"Jataí":98000,"Bela Vista de Goiás":71500,"Rio Verde":90000,"Pontalina":70020,"Silvânia":49000,"Pirenópolis":36000,"Itapuranga":33273,"Vianópolis":40500,"Morrinhos":75800},{"ano":2016,"Orizona":88000,"Piracanjuba":85500,"Jataí":87000,"Bela Vista de Goiás":70000,"Rio Verde":70000,"Pontalina":53515,"Silvânia":46500,"Pirenópolis":28000,"Itapuranga":34895,"Vianópolis":40000,"Morrinhos":56500},{"ano":2017,"Orizona":93000,"Piracanjuba":95000,"Jataí":85000,"Bela Vista de Goiás":73500,"Rio Verde":71300,"Pontalina":64200,"Silvânia":54000,"Pirenópolis":29720,"Itapuranga":54000,"Vianópolis":43500,"Morrinhos":56550},{"ano":2018,"Orizona":110000,"Piracanjuba":94878,"Jataí":86100,"Bela Vista de Goiás":79000,"Rio Verde":65800,"Pontalina":63800,"Silvânia":63500,"Pirenópolis":41272,"Itapuranga":55620,"Vianópolis":60000,"Morrinhos":59060},{"ano":2019,"Orizona":110500,"Piracanjuba":94975,"Jataí":88400,"Bela Vista de Goiás":78000,"Rio Verde":65950,"Pontalina":63500,"Silvânia":63000,"Pirenópolis":62611,"Itapuranga":61980,"Vianópolis":61000,"Morrinhos":60000},{"ano":2020,"Orizona":113000,"Piracanjuba":95100,"Jataí":88700,"Bela Vista de Goiás":77839,"Rio Verde":72122,"Pontalina":63600,"Silvânia":64500,"Pirenópolis":64324,"Itapuranga":62090,"Vianópolis":61325,"Morrinhos":60700},{"ano":2021,"Orizona":115826,"Piracanjuba":95800,"Jataí":89500,"Bela Vista de Goiás":78799,"Rio Verde":71450,"Pontalina":63890,"Silvânia":66000,"Pirenópolis":54904,"Itapuranga":64105,"Vianópolis":61649,"Morrinhos":60625}],
  produtividadeMunicipios: [{"municipio":"Orizona","2019":2833.3333,"2020":2825},{"municipio":"Piracanjuba","2019":2638.1944,"2020":2616.2311},{"municipio":"Jataí","2019":1890.9091,"2020":1879.2373},{"municipio":"Bela Vista de Goiás","2019":3095.2381,"2020":3094.9901},{"municipio":"Rio Verde","2019":1730.9711,"2020":1892.9659},{"municipio":"Pontalina","2019":2595.0143,"2020":2595.9184},{"municipio":"Silvânia","2019":3000,"2020":3000},{"municipio":"Pirenópolis","2019":2879.9908,"2020":2859.9884},{"municipio":"Itapuranga","2019":2574.9896,"2020":2563.5838},{"municipio":"Vianópolis","2019":3230.9322,"2020":3244.709},{"municipio":"Morrinhos","2019":1935.4839,"2020":1908.805}],
  rebanhoCO: [{"uf":"Centro-Oeste","2013":71124329,"2014":71234141,"2015":72705736,"2016":75112421,"2017":74128217,"2018":73838407,"2019":73970616,"2020":75075950,"2021":75413186},{"uf":"Mato Grosso do Sul","2013":21047274,"2014":21003830,"2015":21357398,"2016":21800990,"2017":21474693,"2018":20896700,"2019":19407908,"2020":19027086,"2021":18608503},{"uf":"Mato Grosso","2013":28395205,"2014":28592183,"2015":29364042,"2016":30296096,"2017":29725378,"2018":30199598,"2019":31654882,"2020":32338031,"2021":32424958},{"uf":"Goiás","2013":21580398,"2014":21538072,"2015":21887720,"2016":22919070,"2017":22835005,"2018":22651910,"2019":22823401,"2020":23626608,"2021":24293954}],
  vacasRegiao2021: [{"regiao":"Norte","quantidadeVacasOrdenhadas":1949264,"percentualParticipacao":12.2252},{"regiao":"Nordeste","quantidadeVacasOrdenhadas":3735137,"percentualParticipacao":23.4257},{"regiao":"Sudeste","quantidadeVacasOrdenhadas":4711149,"percentualParticipacao":29.547},{"regiao":"Sul","quantidadeVacasOrdenhadas":3232918,"percentualParticipacao":20.276},{"regiao":"Centro-Oeste","quantidadeVacasOrdenhadas":2316116,"percentualParticipacao":14.526}],
  produtividadeRegiao: [{"regiao":"Norte","produtividadeLitrosPorVacaAno":953.682},{"regiao":"Nordeste","produtividadeLitrosPorVacaAno":1485.0939},{"regiao":"Sudeste","produtividadeLitrosPorVacaAno":2537.4311},{"regiao":"Sul","produtividadeLitrosPorVacaAno":3700.3184},{"regiao":"Centro-Oeste","produtividadeLitrosPorVacaAno":1719.2567}],
  vacasRegiaoSerie: [{"regiao":"Norte","2013":1976069,"2014":2222028,"2015":2073447,"2016":2080854,"2017":2180729,"2018":2254396,"2019":2285298,"2020":2048306,"2021":1949264},{"regiao":"Nordeste","2013":4633952,"2014":4751321,"2015":3863103,"2016":3504069,"2017":3319308,"2018":3358080,"2019":3469980,"2020":3462555,"2021":3735137},{"regiao":"Sudeste","2013":8106560,"2014":7917946,"2015":7449822,"2016":6727947,"2017":5049011,"2018":4761728,"2019":4736573,"2020":4709525,"2021":4711149},{"regiao":"Sul","2013":4403259,"2014":4377231,"2015":4248380,"2016":4177491,"2017":3575268,"2018":3369468,"2019":3294883,"2020":3300322,"2021":3232918},{"regiao":"Centro-Oeste","2013":3834697,"2014":3759425,"2015":3476164,"2016":3068734,"2017":2727961,"2018":2609419,"2019":2504993,"2020":2433227,"2021":2316116}],
  vacasMeso: [{"mesorregiao":"Noroeste Goiano","2013":276437,"2014":276837,"2015":245128,"2016":219901,"2017":188501,"2018":181685,"2019":174503,"2020":171367,"2021":176931},{"mesorregiao":"Norte Goiano","2013":217279,"2014":155111,"2015":151212,"2016":150515,"2017":112101,"2018":109271,"2019":111000,"2020":123643,"2021":133462},{"mesorregiao":"Centro Goiano","2013":755684,"2014":784678,"2015":798556,"2016":745602,"2017":643948,"2018":645267,"2019":615727,"2020":594697,"2021":564432},{"mesorregiao":"Leste Goiano","2013":254484,"2014":249397,"2015":260516,"2016":224252,"2017":192997,"2018":181567,"2019":179845,"2020":187644,"2021":182744},{"mesorregiao":"Sul Goiano","2013":1219710,"2014":1172350,"2015":1063519,"2016":897602,"2017":847434,"2018":812804,"2019":799946,"2020":784705,"2021":748152}],
  precos: [{"produto":"Leite pasteurizado","go2020":3.01,"br2020":2.72,"go2021":3.68,"br2021":3.28},{"produto":"Leite UHT","go2020":3.3,"br2020":3.23,"go2021":3.32,"br2021":3.44},{"produto":"Queijo prato","go2020":29.45,"br2020":28.45,"go2021":30.87,"br2021":28.86},{"produto":"Leite em pó integral","go2020":22,"br2020":22.84,"go2021":24.06,"br2021":24.95},{"produto":"Manteiga","go2020":31.13,"br2020":29.12,"go2021":33.42,"br2021":32.7},{"produto":"Queijo muçarela","go2020":25.28,"br2020":26.29,"go2021":27.72,"br2021":25.55}],
  consumo: [{"produto":"Leite Pasteurizado","taxaCrescimento":-4.2732,"2011":1625,"2012":1430,"2013":1340,"2014":1220,"2015":1094,"2016":1105,"2017":1120,"2018":1090,"2019":1080,"2020":1050},{"produto":"Leite UHT","taxaCrescimento":1.8332,"2011":5818,"2012":6132,"2013":6385,"2014":6600,"2015":6730,"2016":6832,"2017":7026,"2018":6880,"2019":6858,"2020":6977},{"produto":"Leite em Pó","taxaCrescimento":1.557,"2011":6099,"2012":6252,"2013":6370,"2014":6260,"2015":6340,"2016":6607,"2017":6638,"2018":6708,"2019":6853,"2020":7118},{"produto":"Queijos","taxaCrescimento":2.5021,"2011":7059,"2012":7253,"2013":7763,"2014":8173,"2015":8198,"2016":8243,"2017":8406,"2018":8587,"2019":8776,"2020":9038},{"produto":"Demais Produtos","taxaCrescimento":1.0521,"2011":2293,"2012":2361,"2013":2573,"2014":2728,"2015":2287,"2016":1954,"2017":2221,"2018":2254,"2019":2414,"2020":2546}],
  rankingConsumo: [{"produto":"Total de lácteos","1º":"SC","2º":"RS","3º":"MG","4º":"SP","5º":"PR"},{"produto":"Creme de leite","1º":"SC","2º":"PR","3º":"DF","4º":"SP","5º":"GO/RN"},{"produto":"Leite condensado","1º":"RS","2º":"SC","3º":"SP","4º":"RJ","5º":"PR"},{"produto":"Leite de vaca pasteurizado","1º":"SC","2º":"RS","3º":"SP","4º":"MG","5º":"PR"},{"produto":"Queijos","1º":"RJ","2º":"SC","3º":"PE","4º":"SP","5º":"RS"},{"produto":"Iogurte","1º":"RS","2º":"SC","3º":"SP","4º":"MS","5º":"PR"},{"produto":"Leite fermentado","1º":"SC","2º":"PR","3º":"SP","4º":"RS","5º":"RN"},{"produto":"Manteiga","1º":"GO","2º":"AP","3º":"BA","4º":"AC","5º":"SE"}],
  vbpEstados: [{"estado":"Mato Grosso do Sul","2012":183172650,"2021":234892530},{"estado":"Mato Grosso","2012":509866315,"2021":769173432},{"estado":"Goiás","2012":1723678757.5,"2021":5435097100}],
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

// Atributos ausentes no Excel: quantidadeVacasOrdenhadas e valorProducaoLeite na aba
// "Características dos produtores"; quantidadeLeiteVendido e valorVendaLeite no bloco
// "Produtos lácteos importados". Foram usados os atributos disponíveis mais próximos.

const ANOS_PRODUCAO = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"];
const ANOS_CONSUMO = ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
const ANOS_PROJECAO = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"];
const SERIES_PRODUCAO_UF = ["Brasil", "Minas Gerais", "Paraná", "Rio Grande do Sul", "Goiás", "Santa Catarina"];
const SERIES_MESO = ["Noroeste goiano", "Norte goiano", "Centro goiano", "Leste goiano", "Sul goiano"];
const SERIES_MESO_LABEL = ["Noroeste Goiano", "Norte Goiano", "Centro Goiano", "Leste Goiano", "Sul Goiano"];
const SERIES_REGIAO = DADOS_LEITE.vacasRegiaoSerie.map(d => d.regiao);
const SERIES_UF_CO = DADOS_LEITE.rebanhoCO.filter(d => d.uf !== "Centro-Oeste").map(d => d.uf);
const TODOS_MUNICIPIOS = Object.keys(DADOS_LEITE.municipiosProducao[0]).filter(k => k !== "ano");
const PRODUTOS_FILTRO = Array.from(new Set([
  ...DADOS_LEITE.precos.map(d => d.produto),
  ...DADOS_LEITE.consumo.map(d => d.produto),
  ...DADOS_LEITE.rankingConsumo.map(d => d.produto),
  ...DADOS_LEITE.produtosExportados.map(d => d.produto),
  ...DADOS_LEITE.produtosImportados.map(d => d.produto),
  ...DADOS_LEITE.caracteristicasGrupo.map(d => d.grupoCabecasBovinos),
  ...DADOS_LEITE.caracteristicasCondicao.map(d => d.condicaoProdutor)
])).sort((a, b) => a.localeCompare(b, "pt-BR"));

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

function existe(id) { return !!document.getElementById(id); }
function eixo(axis) {
  axis.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif", fill: am5.color("#5a5a5a") });
}
function criarRoot(id) {
  const root = am5.Root.new(id);
  root.setThemes([am5themes_Animated.new(root)]);
  return root;
}
function criarLegenda(chart, root) {
  const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
  l.labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif" });
  return l;
}
function cardDoGrafico(id) {
  return document.getElementById(id)?.closest("[class*='col-']");
}
function alternarCard(id, visivel) {
  cardDoGrafico(id)?.classList.toggle("is-chart-empty", !visivel);
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
  const lista = anos.length ? anos : ANOS_PRODUCAO;
  return [
    { nome: `${nomeInicio} ${lista[0]}`, ano: lista[0] },
    { nome: `${nomeFim} ${lista[lista.length - 1]}`, ano: lista[lista.length - 1] }
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
  s.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
  s.get("colors").set("colors", P.map(c => am5.color(c)));
  const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 }));
  l.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
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
  graficoBarrasAgrupadas("chartProdutividadeMunicipios", "municipio", [{ nome: "2019", campo: "2019" }, { nome: "2020", campo: "2020" }], " L/vaca/ano");
  graficoBarrasAgrupadas("chartPrecosLacteos", "produto", [{ nome: "GO 2020", campo: "go2020" }, { nome: "BR 2020", campo: "br2020" }, { nome: "GO 2021", campo: "go2021" }, { nome: "BR 2021", campo: "br2021" }], " R$");
  graficoLinhas("chartConsumoLacteos", "ano", DADOS_LEITE.consumo.map(d => d.produto));
  graficoBarras("chartRankingConsumo", "produto", "melhorPosicao", true);
  graficoBarrasAgrupadas("chartVbpLeite", "estado", [{ nome: "2012", campo: "2012" }, { nome: "2021", campo: "2021" }], " R$");
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
  const anosProducao = anosNoPeriodo(ANOS_PRODUCAO);
  const anosConsumo = anosNoPeriodo(ANOS_CONSUMO);
  const anosExportacao = anosNoPeriodo(DADOS_LEITE.exportacoesAno.map(d => String(d.ano)));
  const anosImportacao = anosNoPeriodo(DADOS_LEITE.importacoesAno.map(d => String(d.ano)));
  const regioes = seriesSelecionadas(SERIES_REGIAO, estadoFiltros.regioes);
  const mesorregioes = SERIES_MESO.filter((_, i) => !estadoFiltros.regioes.length || estadoFiltros.regioes.includes(SERIES_MESO_LABEL[i]));
  const mesorregioesLabel = SERIES_MESO_LABEL.filter(label => !estadoFiltros.regioes.length || estadoFiltros.regioes.includes(label));
  const ufsProducao = seriesSelecionadas(SERIES_PRODUCAO_UF, estadoFiltros.ufs);
  const ufsCO = seriesSelecionadas(SERIES_UF_CO, estadoFiltros.ufs);
  const municipios = seriesSelecionadas(TODOS_MUNICIPIOS, estadoFiltros.municipios);
  const comparacaoProducao = serieComparativa(anosProducao);

  graficos.chartLeiteSeries?.update(filtrarLinhasPorAno(DADOS_LEITE.producaoBilhoes, "Ano").map(d => ({ ...d, ano: String(d.Ano) })), ufsProducao);
  graficos.chartLeiteRegiao?.update(filtrarPorCampo(DADOS_LEITE.participacaoRegiao, "regiao", estadoFiltros.regioes));
  graficos.chartProdutividade?.update(filtrarPorCampo(DADOS_LEITE.produtividadeRegiao, "regiao", estadoFiltros.regioes));
  graficos.chartVacasRegiao?.update(filtrarPorCampo(DADOS_LEITE.vacasRegiao2021, "regiao", estadoFiltros.regioes));
  graficos.chartVacasRegiaoSerie?.update(dadosPorAno(DADOS_LEITE.vacasRegiaoSerie, "regiao", anosProducao, regioes), regioes);

  graficos.chartGoiasMeso?.update(filtrarLinhasPorAno(DADOS_LEITE.producaoMeso).map(d => ({ ...d, ano: String(d.ano) })), mesorregioes);
  graficos.chartGoiasMesoPie?.update(Object.entries(DADOS_LEITE.producaoMeso.find(d => String(d.ano) === (anosProducao.at(-1) || "2021")) || {}).filter(([k]) => k !== "ano" && mesorregioes.includes(k)).map(([mesorregiao, producao]) => ({ mesorregiao, producao })));
  graficos.chartVacasGoias?.update(dadosAgrupadosPorAnos(DADOS_LEITE.vacasMeso.filter(d => mesorregioesLabel.includes(d.mesorregiao)), "mesorregiao", anosProducao, comparacaoProducao), [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  graficos.chartVacasMesoSerie?.update(dadosPorAno(DADOS_LEITE.vacasMeso, "mesorregiao", anosProducao, mesorregioesLabel), mesorregioesLabel);
  const producaoCO = filtrarPorCampo(DADOS_LEITE.producaoCO, "uf", estadoFiltros.ufs);
  graficos.chartLeiteProducaoCO?.update(producaoCO);
  graficos.chartProducaoCentroOesteUf?.update(producaoCO);
  graficos.chartRebanhoCO?.update(dadosPorAno(DADOS_LEITE.rebanhoCO.filter(d => d.uf !== "Centro-Oeste"), "uf", anosProducao, ufsCO), ufsCO);

  graficos.chartMunicipios?.update(filtrarLinhasPorAno(DADOS_LEITE.municipiosProducao).map(d => ({ ...d, ano: String(d.ano) })), municipios);
  graficos.chartMunicipiosBars?.update(municipios.map(municipio => ({ municipio, "Início": DADOS_LEITE.municipiosProducao.find(d => String(d.ano) === (anosProducao[0] || "2013"))?.[municipio], "Fim": DADOS_LEITE.municipiosProducao.find(d => String(d.ano) === (anosProducao.at(-1) || "2021"))?.[municipio] })).sort((a, b) => (b.Fim || 0) - (a.Fim || 0)).slice(0, 10), [{ nome: "Início", campo: "Início" }, { nome: "Fim", campo: "Fim" }]);
  graficos.chartProdutividadeMunicipios?.update(DADOS_LEITE.produtividadeMunicipios.filter(d => municipios.includes(d.municipio)).sort((a, b) => b["2020"] - a["2020"]), [{ nome: "2019", campo: "2019" }, { nome: "2020", campo: "2020" }]);

  const precos = DADOS_LEITE.precos.filter(d => temIntersecaoProduto(d.produto));
  const consumo = DADOS_LEITE.consumo.filter(d => temIntersecaoProduto(d.produto));
  graficos.chartPrecosLacteos?.update(precos, [{ nome: "GO 2020", campo: "go2020" }, { nome: "BR 2020", campo: "br2020" }, { nome: "GO 2021", campo: "go2021" }, { nome: "BR 2021", campo: "br2021" }]);
  graficos.chartConsumoLacteos?.update(dadosPorAno(consumo, "produto", anosConsumo, consumo.map(d => d.produto)), consumo.map(d => d.produto));
  graficos.chartRankingConsumo?.update(DADOS_LEITE.rankingConsumo.filter(d => temIntersecaoProduto(d.produto)).map(d => ({ produto: d.produto, melhorPosicao: Math.min(...["1º", "2º", "3º", "4º", "5º"].filter(pos => String(d[pos]).includes("GO")).map(pos => Number(pos[0])).concat([6])) })).filter(d => d.melhorPosicao <= 5));
  graficos.chartVbpLeite?.update(filtrarPorCampo(DADOS_LEITE.vbpEstados, "estado", estadoFiltros.ufs), [{ nome: "2012", campo: "2012" }, { nome: "2021", campo: "2021" }]);
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
  if (destino) document.querySelector(`[data-tab="${destino}"]`)?.click();
}
function limparFiltros() {
  Object.assign(estadoFiltros, { escala: "all", indicador: "all", anoInicio: "2013", anoFim: "2021", regioes: [], ufs: [], municipios: [], produtos: [] });
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
  document.getElementById("btnAplicarFoco")?.addEventListener("click", navegarParaFoco);
}
function inicializarDashboardLeite() {
  inicializarFiltros();
  inicializarEstruturaGraficos();
  aplicarFiltros();
}

window.onFilterChange = function () {};
am5.ready(inicializarDashboardLeite);
