const P = ["#2d5c24", "#c8943a", "#a0622b", "#4a7c3f", "#6fa65e", "#e8a84c", "#7fb069", "#5c4033", "#1a4a18", "#d4a843"];
function ax(a) { a.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif", fill: am5.color("#5a5a5a") }); }
function leg(chart, root) { const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 })); l.labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif" }); return l; }

const anos = ["2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"];
const prod = [42384, 45038, 45186, 43497, 46725, 53215, 44023, 52379, 55012, 59404];
const produt = [1484, 1668, 1617, 1692, 1689, 1712, 1581, 1778, 1849, 1771];
const plantada = [28565, 27006, 46151, 35103, 36417, 35236, 27946, 36618, 30777, 33644];
const colhida = [28565, 27006, 27945, 25707, 27670, 31082, 27843, 29455, 29747, 33541];
const custo_ha = [3151, 3308, 3693, 3905, 4118, 7942, 7736, 8388, 8834, 8874];
const custo_kg = [2.52, 2.24, 2.93, 3.10, 3.30, 3.20, 3.15, 3.40, 3.54, 3.89];
const receita = [126.3, 113.3, 120.9, 88.9, 107.2, 136.1, 93.2, 117.6, 130.5, 196.2];

// ── PRODUÇÃO DUAL AXIS ──
(function () {
    const root = am5.Root.new("chartBorrachaProd"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    const yA2 = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }));
    ax(xA); ax(yA); ax(yA2);
    const data = anos.map((a, i) => ({ ano: a, prod: prod[i], produt: produt[i] }));
    xA.data.setAll(data);
    const col = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Produção (t)", xAxis: xA, yAxis: yA, valueYField: "prod", categoryXField: "ano", fill: am5.color(P[0]), stroke: am5.color(P[0]), tooltip: am5.Tooltip.new(root, { labelText: "Produção: {valueY} t" }) }));
    col.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(60) }); col.data.setAll(data);
    const line = chart.series.push(am5xy.LineSeries.new(root, { name: "Produtividade (kg/ha)", xAxis: xA, yAxis: yA2, valueYField: "produt", categoryXField: "ano", stroke: am5.color(P[1]), fill: am5.color(P[1]), tooltip: am5.Tooltip.new(root, { labelText: "Produtividade: {valueY} kg/ha" }) }));
    line.strokes.template.setAll({ strokeWidth: 2.5 });
    line.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 4, fill: line.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    line.data.setAll(data);
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── ÁREA ──
(function () {
    const root = am5.Root.new("chartBorrachaArea"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = anos.map((a, i) => ({ ano: a, plantada: plantada[i], colhida: colhida[i] }));
    xA.data.setAll(data);
    [{ f: "plantada", n: "Área Plantada", c: P[3] }, { f: "colhida", n: "Área Colhida", c: P[2] }].forEach(cfg => {
        const s = chart.series.push(am5xy.LineSeries.new(root, { name: cfg.n, xAxis: xA, yAxis: yA, valueYField: cfg.f, categoryXField: "ano", stroke: am5.color(cfg.c), fill: am5.color(cfg.c), tooltip: am5.Tooltip.new(root, { labelText: `${cfg.n}: {valueY} ha` }) }));
        s.strokes.template.setAll({ strokeWidth: 2 });
        s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── CUSTO ──
(function () {
    const root = am5.Root.new("chartBorrachaCusto"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = anos.map((a, i) => ({ ano: a, v: custo_ha[i] }));
    xA.data.setAll(data);
    const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: "R$/ha", xAxis: xA, yAxis: yA, valueYField: "v", categoryXField: "ano", fill: am5.color(P[2]), stroke: am5.color(P[2]), tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/ha" }) }));
    s.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(65) }); s.data.setAll(data); chart.appear(1000, 100);
})();

// ── RECEITA ──
(function () {
    const root = am5.Root.new("chartReceita"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = anos.map((a, i) => ({ ano: a, v: receita[i] }));
    xA.data.setAll(data);
    const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Receita (mi R$)", xAxis: xA, yAxis: yA, valueYField: "v", categoryXField: "ano", tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY} mi" }) }));
    s.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(65) });
    s.columns.template.adapters.add("fill", (f, t) => { const v = t.dataItem?.get("valueY") || 0; return am5.color(v > 150 ? P[0] : P[4]); });
    s.data.setAll(data); chart.appear(1000, 100);
})();

// ── MUNDO BARRAS ──
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

// ── FILTER LOGIC ──
window.onFilterChange = function (filterId, group) {
    if (group === "escala") {
        const tabMap = { co: "fl-co", mundial: "fl-mundo" };
        if (tabMap[filterId]) {
            document.querySelector(`[data-tab="${tabMap[filterId]}"]`).click();
        }
        // Reset indicator filter to "all" and show everything
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

// ── CUSTO COMPARADO ──
(function () {
    const root = am5.Root.new("chartCustoComp"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    const yA2 = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }));
    ax(xA); ax(yA); ax(yA2);
    const data = anos.map((a, i) => ({ ano: a, ha: custo_ha[i], kg: custo_kg[i] }));
    xA.data.setAll(data);
    const col = chart.series.push(am5xy.ColumnSeries.new(root, { name: "R$/ha", xAxis: xA, yAxis: yA, valueYField: "ha", categoryXField: "ano", fill: am5.color(P[0]), stroke: am5.color(P[0]), tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/ha" }) }));
    col.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(55) }); col.data.setAll(data);
    const line = chart.series.push(am5xy.LineSeries.new(root, { name: "R$/kg", xAxis: xA, yAxis: yA2, valueYField: "kg", categoryXField: "ano", stroke: am5.color(P[1]), fill: am5.color(P[1]), tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/kg" }) }));
    line.strokes.template.setAll({ strokeWidth: 2.5 });
    line.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 4, fill: line.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    line.data.setAll(data);
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();
