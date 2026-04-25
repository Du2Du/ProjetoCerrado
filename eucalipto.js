const P = ["#2d5c24", "#c8943a", "#a0622b", "#4a7c3f", "#6fa65e", "#e8a84c", "#7fb069", "#5c4033", "#1a4a18", "#d4a843"];
function ax(a) { a.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif", fill: am5.color("#5a5a5a") }); }
function leg(chart, root) { const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 })); l.labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif" }); return l; }

// IBGE Tabela 5930 — Área plantada CO por estado (ha)
const anosArea = ["2013","2015","2016","2017","2018","2019","2020","2021"];
const areaMS = [651088,921404,993807,1117740,1117935,1124969,1135543,1045765];
const areaMT = [202490,213838,191995,189297,187947,218563,214903,218883];
const areaGO = [133018,133907,164830,167755,168610,159943,128798,119300];
const areaDF = [2585,2809,2700,3492,3200,3000,1450,1500];

// IBÁ / FGV IBRE — Produtividade Brasil (m³/ha/ano)
const anosProdut = ["2014","2015","2016","2017","2018","2019","2020","2021"];
const produtBR = [35.8,35.8,35.7,35.3,36.0,38.6,36.8,38.9];

// IBÁ — Consumo industrial Brasil (milhões de m³)
const anosConsumo = ["2013","2014","2015","2016","2017","2018","2019","2020","2021"];
const consumoBR = [138.2,143.2,151.2,154.0,154.8,138.2,166.0,164.2,173.9];

// IBGE Tabela 291 — Produção CO por produto
const anosT291 = ["2012","2013","2014","2015","2016","2017","2018","2019","2020","2021"];
const madCelulose = [4968944,8033052,8293047,9419761,9958927,12860798,17511680,14602994,14661653,13144044];
const lenha       = [4065556,6230147,6472880,5358997,4994371,4910293,4795454,5369619,5883302,5998155];
const carvao      = [93462,145073,139192,70908,52945,65997,134453,169969,187119,179191];

// IBÁ — Área plantada CO e Brasil (ha)
const anosIBA    = ["2012","2013","2014","2015","2016","2017","2018","2019","2020","2021"];
const areaIBA_CO = [887505,1007593,1115086,1138451,1190215,1210450,1408953,1460518,1304950,1332560];
const areaIBA_BR = [5304163,5473176,5558653,5630607,5673784,5687209,6785387,7568074,7407257,7528148];

// ── ÁREA PLANTADA CO POR ESTADO ──
(function () {
    const root = am5.Root.new("chartEucaliptoArea"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = anosArea.map((a, i) => ({ ano: a, ms: areaMS[i], mt: areaMT[i], go: areaGO[i], df: areaDF[i] }));
    xA.data.setAll(data);
    [
        { f: "ms", n: "Mato Grosso do Sul", c: P[0] },
        { f: "mt", n: "Mato Grosso",        c: P[1] },
        { f: "go", n: "Goiás",              c: P[2] },
        { f: "df", n: "Distrito Federal",   c: P[4] }
    ].forEach(cfg => {
        const s = chart.series.push(am5xy.LineSeries.new(root, { name: cfg.n, xAxis: xA, yAxis: yA, valueYField: cfg.f, categoryXField: "ano", stroke: am5.color(cfg.c), fill: am5.color(cfg.c), tooltip: am5.Tooltip.new(root, { labelText: cfg.n + ": {valueY} ha" }) }));
        s.strokes.template.setAll({ strokeWidth: 2 });
        s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── PRODUTIVIDADE BRASIL ──
(function () {
    const root = am5.Root.new("chartEucaliptoProdut"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = anosProdut.map((a, i) => ({ ano: a, v: produtBR[i] }));
    xA.data.setAll(data);
    const s = chart.series.push(am5xy.LineSeries.new(root, { name: "Produtividade (m³/ha/ano)", xAxis: xA, yAxis: yA, valueYField: "v", categoryXField: "ano", stroke: am5.color(P[1]), fill: am5.color(P[1]), tooltip: am5.Tooltip.new(root, { labelText: "{valueY} m³/ha/ano" }) }));
    s.strokes.template.setAll({ strokeWidth: 2.5 });
    s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 4, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    s.data.setAll(data); chart.appear(1000, 100);
})();

// ── CONSUMO INDUSTRIAL BRASIL ──
(function () {
    const root = am5.Root.new("chartEucaliptoConsumo"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = anosConsumo.map((a, i) => ({ ano: a, v: consumoBR[i] }));
    xA.data.setAll(data);
    const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Consumo (mi m³)", xAxis: xA, yAxis: yA, valueYField: "v", categoryXField: "ano", fill: am5.color(P[0]), stroke: am5.color(P[0]), tooltip: am5.Tooltip.new(root, { labelText: "{valueY} mi m³" }) }));
    s.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(65) });
    s.data.setAll(data); chart.appear(1000, 100);
})();

// ── PRODUÇÃO CO POR PRODUTO (Tabela 291) ──
(function () {
    const root = am5.Root.new("chartEucaliptoProducao"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = anosT291.map((a, i) => ({ ano: a, celulose: madCelulose[i], lenha: lenha[i] }));
    xA.data.setAll(data);
    [
        { f: "celulose", n: "Madeira papel/celulose (m³)", c: P[0] },
        { f: "lenha",    n: "Lenha (m³)",                  c: P[1] }
    ].forEach(cfg => {
        const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: cfg.n, xAxis: xA, yAxis: yA, valueYField: cfg.f, categoryXField: "ano", fill: am5.color(cfg.c), stroke: am5.color(cfg.c), tooltip: am5.Tooltip.new(root, { labelText: cfg.n + ": {valueY}" }) }));
        s.columns.template.setAll({ cornerRadiusTL: 2, cornerRadiusTR: 2, width: am5.percent(55) });
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── MUNDO BARRAS (seringueira — contexto mundial existente) ──
(function () {
    const root = am5.Root.new("chartMundo"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }));
    const yA = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "pais", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 20 }) }));
    const xA = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
    ax(xA); ax(yA);
    const data = [{ pais: "Nigéria", area: 1.5, isBrasil: false }, { pais: "Colômbia", area: 1.6, isBrasil: false }, { pais: "Brasil 🇧🇷", area: 1.7, isBrasil: true }, { pais: "Índia", area: 1.9, isBrasil: false }, { pais: "China", area: 2.1, isBrasil: false }, { pais: "Malásia", area: 2.2, isBrasil: false }, { pais: "Vietnã", area: 4.2, isBrasil: false }, { pais: "Tailândia", area: 5.2, isBrasil: false }, { pais: "Indonésia", area: 12.5, isBrasil: false }];
    yA.data.setAll(data);
    const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Área (mi ha)", xAxis: xA, yAxis: yA, valueXField: "area", categoryYField: "pais", tooltip: am5.Tooltip.new(root, { labelText: "{categoryY}: {valueX} mi ha" }) }));
    s.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
    s.columns.template.adapters.add("fill", (f, t) => am5.color(t.dataItem?.dataContext?.isBrasil ? P[2] : P[0]));
    s.columns.template.adapters.add("stroke", (f, t) => am5.color(t.dataItem?.dataContext?.isBrasil ? P[2] : P[0]));
    s.data.setAll(data); chart.appear(1000, 100);
})();

// ── MUNDO PIE ──
(function () {
    const root = am5.Root.new("chartMundoPie"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
    const s = chart.series.push(am5percent.PieSeries.new(root, { valueField: "v", categoryField: "c" }));
    s.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    s.data.setAll([{ c: "Indonésia", v: 12.5 }, { c: "Tailândia", v: 5.2 }, { c: "Vietnã", v: 4.2 }, { c: "Malásia", v: 2.2 }, { c: "China", v: 2.1 }, { c: "Índia", v: 1.9 }, { c: "Brasil", v: 1.7 }, { c: "Demais", v: 6.7 }]);
    s.get("colors").set("colors", P.map(c => am5.color(c)));
    const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 })); l.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" }); l.data.setAll(s.dataItems); chart.appear(1000, 100);
})();

// ── IBÁ — ÁREA PLANTADA CO vs BRASIL ──
(function () {
    const root = am5.Root.new("chartCustoComp"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA  = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    const yA2 = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }));
    ax(xA); ax(yA); ax(yA2);
    const data = anosIBA.map((a, i) => ({ ano: a, co: areaIBA_CO[i], br: areaIBA_BR[i] }));
    xA.data.setAll(data);
    const col = chart.series.push(am5xy.ColumnSeries.new(root, { name: "CO (ha)", xAxis: xA, yAxis: yA, valueYField: "co", categoryXField: "ano", fill: am5.color(P[0]), stroke: am5.color(P[0]), tooltip: am5.Tooltip.new(root, { labelText: "CO: {valueY} ha" }) }));
    col.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(55) }); col.data.setAll(data);
    const line = chart.series.push(am5xy.LineSeries.new(root, { name: "Brasil (ha)", xAxis: xA, yAxis: yA2, valueYField: "br", categoryXField: "ano", stroke: am5.color(P[1]), fill: am5.color(P[1]), tooltip: am5.Tooltip.new(root, { labelText: "Brasil: {valueY} ha" }) }));
    line.strokes.template.setAll({ strokeWidth: 2.5 });
    line.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 4, fill: line.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    line.data.setAll(data);
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── FILTER LOGIC ──
window.onFilterChange = function (filterId, group) {
    if (group === "escala") {
        const tabMap = { co: "fl-co", mundial: "fl-mundo" };
        if (tabMap[filterId]) {
            document.querySelector(`[data-tab="${tabMap[filterId]}"]`).click();
        }
        document.querySelectorAll('[data-filter-group="ind"] .filter-btn')
            .forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
        document.querySelectorAll("[data-category]").forEach(el => { el.style.display = ""; });
        return;
    }
    if (group === "ind") {
        const activeTab = document.querySelector("[data-tab-content].active");
        if (!activeTab) return;
        activeTab.querySelectorAll("[data-category]").forEach(el => {
            el.style.display = (filterId === "all" || el.dataset.category === filterId) ? "" : "none";
        });
    }
};
