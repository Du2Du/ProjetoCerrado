const P = ["#8b3a1a", "#c8943a", "#4a7c3f", "#6fa65e", "#2d5c24", "#d4843a", "#a0622b", "#e8a84c", "#5c4033", "#3a6b4a"];

function mkRoot(id) {
    const r = am5.Root.new(id);
    r.setThemes([am5themes_Animated.new(r)]);
    return r;
}
function ax(axis) { axis.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif", fill: am5.color("#5a5a5a") }); }
function leg(chart, root) { const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 })); l.labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif" }); return l; }

// ── REBANHO LINHA ──
(function () {
    const root = mkRoot("chartRebanho");
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const estados = { Brasil: [211.3, 211.8, 212.4, 215.2, 218.2, 215.0, 213.8, 214.7, 217.8, 224.6], "Mato Grosso": [28.7, 28.4, 28.6, 29.4, 30.3, 29.7, 30.2, 31.7, 32.3, 32.4], Goiás: [22.0, 21.6, 21.5, 21.9, 22.9, 22.8, 22.7, 22.8, 23.6, 24.3], "Minas Gerais": [24.0, 24.2, 23.7, 23.8, 23.6, 22.0, 21.8, 22.0, 22.2, 22.9], "Mato Grosso do Sul": [21.5, 21.0, 21.0, 21.4, 21.8, 21.5, 20.9, 19.4, 19.0, 18.6] };
    const anos = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
    const data = anos.map((a, i) => { const o = { ano: String(a) }; Object.keys(estados).forEach(k => o[k] = estados[k][i]); return o; });
    xA.data.setAll(data);
    Object.keys(estados).forEach((name, idx) => {
        const s = chart.series.push(am5xy.LineSeries.new(root, { name, xAxis: xA, yAxis: yA, valueYField: name, categoryXField: "ano", stroke: am5.color(P[idx]), fill: am5.color(P[idx]), tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY} mi" }) }));
        s.strokes.template.setAll({ strokeWidth: 2 });
        s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values);
    chart.appear(1000, 100);
})();

// ── REBANHO PIE ──
(function () {
    const root = mkRoot("chartRebanhoPartic");
    const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
    const s = chart.series.push(am5percent.PieSeries.new(root, { valueField: "v", categoryField: "c" }));
    s.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    s.data.setAll([{ c: "Mato Grosso", v: 32.4 }, { c: "Goiás", v: 24.3 }, { c: "Minas Gerais", v: 22.9 }, { c: "Pará", v: 23.9 }, { c: "MG do Sul", v: 18.6 }, { c: "Demais", v: 102.5 }]);
    s.get("colors").set("colors", P.map(c => am5.color(c)));
    const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 }));
    l.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    l.data.setAll(s.dataItems);
    chart.appear(1000, 100);
})();

// ── ABATE BARRAS ──
(function () {
    const root = mkRoot("chartAbate");
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const series_d = { Goiás: [3.47, 3.41, 3.06, 2.82, 3.18, 3.21, 3.01, 2.79, 2.97, 3.00], "Mato Grosso": [5.84, 5.35, 4.54, 4.58, 4.80, 5.22, 5.65, 5.09, 4.62, 4.71], "Mato Grosso do Sul": [4.12, 3.93, 3.41, 3.29, 3.44, 3.29, 3.59, 3.39, 2.96, 3.34] };
    const anos = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
    const data = anos.map((a, i) => { const o = { ano: String(a) }; Object.keys(series_d).forEach(k => o[k] = series_d[k][i]); return o; });
    xA.data.setAll(data);
    Object.keys(series_d).forEach((name, idx) => {
        const s = chart.series.push(am5xy.ColumnSeries.new(root, { name, xAxis: xA, yAxis: yA, valueYField: name, categoryXField: "ano", clustered: true, tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY} mi" }) }));
        s.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(28), fill: am5.color(P[idx]), stroke: am5.color(P[idx]) });
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values);
    chart.appear(1000, 100);
})();

// ── PREÇOS DUAL AXIS ──
(function () {
    const root = mkRoot("chartPrecos");
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    const yA2 = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, { opposite: true }) }));
    ax(xA); ax(yA); ax(yA2);
    const data = [
        { ano: "2001", boi: 42.35, kg: 2.52 }, { ano: "2002", boi: 47.94, kg: 2.74 }, { ano: "2003", boi: 56.73, kg: 3.20 }, { ano: "2004", boi: 59.94, kg: 3.39 }, { ano: "2005", boi: 54.63, kg: 3.33 }, { ano: "2006", boi: 52.76, kg: 3.20 }, { ano: "2007", boi: 60.93, kg: 3.62 }, { ano: "2008", boi: 84.17, kg: 5.03 }, { ano: "2009", boi: 78.85, kg: 4.93 }, { ano: "2010", boi: 88.52, kg: 5.55 }, { ano: "2011", boi: 101.79, kg: 6.31 }, { ano: "2012", boi: 94.88, kg: 6.20 }, { ano: "2013", boi: 102.64, kg: 6.58 }, { ano: "2014", boi: 126.35, kg: 7.98 }, { ano: "2015", boi: 145.45, kg: 9.40 }, { ano: "2016", boi: 152.89, kg: 9.88 }, { ano: "2017", boi: 138.91, kg: 9.71 }, { ano: "2018", boi: 144.99, kg: 9.88 }, { ano: "2019", boi: 163.14, kg: 11.28 }, { ano: "2020", boi: 226.29, kg: 15.27 }, { ano: "2021", boi: 305.65, kg: 19.83 }, { ano: "2022", boi: 317.74, kg: 20.49 }, { ano: "2023", boi: 285.82, kg: 19.01 }
    ];
    xA.data.setAll(data);
    const colS = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Boi Gordo (R$/@)", xAxis: xA, yAxis: yA, valueYField: "boi", categoryXField: "ano", fill: am5.color(P[0]), stroke: am5.color(P[0]), tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/@" }) }));
    colS.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(60) });
    colS.data.setAll(data);
    const lineS = chart.series.push(am5xy.LineSeries.new(root, { name: "Carne (R$/kg)", xAxis: xA, yAxis: yA2, valueYField: "kg", categoryXField: "ano", stroke: am5.color(P[1]), fill: am5.color(P[1]), tooltip: am5.Tooltip.new(root, { labelText: "R$ {valueY}/kg" }) }));
    lineS.strokes.template.setAll({ strokeWidth: 2.5 });
    lineS.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: lineS.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
    lineS.data.setAll(data);
    leg(chart, root).data.setAll(chart.series.values);
    chart.appear(1000, 100);
})();

// ── MUNDIAL LINHA ──
(function () {
    const root = mkRoot("chartMundialCorte");
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const paises = { "EUA": [11248, 11197, 10474, 10343, 11048, 11532, 11860, 11953, 11952, 12263], "Brasil": [8752, 9602, 9723, 8528, 8716, 8923, 9215, 8866, 8693, 8621], "UE": [6993, 6664, 6811, 6983, 7195, 7221, 7330, 7209, 7151, 7139], "China": [6147, 6131, 6157, 6169, 6169, 6346, 6440, 6670, 6720, 6830] };
    const anos = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
    const data = anos.map((a, i) => { const o = { ano: String(a) }; Object.keys(paises).forEach(k => o[k] = paises[k][i]); return o; });
    xA.data.setAll(data);
    Object.keys(paises).forEach((name, idx) => {
        const s = chart.series.push(am5xy.LineSeries.new(root, { name, xAxis: xA, yAxis: yA, valueYField: name, categoryXField: "ano", stroke: am5.color(P[idx]), fill: am5.color(P[idx]), tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY} mil t" }) }));
        s.strokes.template.setAll({ strokeWidth: 2 });
        s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values);
    chart.appear(1000, 100);
})();

// ── MUNDIAL PIE ──
(function () {
    const root = mkRoot("chartMundialPie");
    const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
    const s = chart.series.push(am5percent.PieSeries.new(root, { valueField: "v", categoryField: "c" }));
    s.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    s.data.setAll([{ c: "EUA", v: 12263 }, { c: "Brasil", v: 8621 }, { c: "UE", v: 7139 }, { c: "China", v: 6830 }, { c: "Índia", v: 2498 }, { c: "Demais", v: 23397 }]);
    s.get("colors").set("colors", P.map(c => am5.color(c)));
    const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 }));
    l.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    l.data.setAll(s.dataItems);
    chart.appear(1000, 100);
})();

// ── PROJEÇÕES BRASIL ──
(function () {
    const root = mkRoot("chartProjecoes");
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { min: 6000, renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = [
        { ano: "2021/22", central: 8423, linf: null, lsup: null },
        { ano: "2022/23", central: 8668, linf: null, lsup: null },
        { ano: "2023/24", central: 8791, linf: 7793, lsup: 9789 },
        { ano: "2024/25", central: 8859, linf: 7448, lsup: 10271 },
        { ano: "2025/26", central: 8972, linf: 7424, lsup: 10520 },
        { ano: "2026/27", central: 9104, linf: 7431, lsup: 10778 },
        { ano: "2027/28", central: 9220, linf: 7379, lsup: 11062 },
        { ano: "2028/29", central: 9330, linf: 7335, lsup: 11324 },
        { ano: "2029/30", central: 9444, linf: 7324, lsup: 11565 },
        { ano: "2030/31", central: 9562, linf: 7323, lsup: 11801 },
        { ano: "2031/32", central: 9677, linf: 7320, lsup: 12035 },
    ];
    xA.data.setAll(data);
    [{ f: "lsup", n: "Cenário Superior", c: P[3], dash: true }, { f: "central", n: "Cenário Central", c: P[0], dash: false }, { f: "linf", n: "Cenário Inferior", c: P[1], dash: true }].forEach(cfg => {
        const s = chart.series.push(am5xy.LineSeries.new(root, { name: cfg.n, xAxis: xA, yAxis: yA, valueYField: cfg.f, categoryXField: "ano", connect: false, stroke: am5.color(cfg.c), fill: am5.color(cfg.c), tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY} mil t" }) }));
        s.strokes.template.setAll({ strokeWidth: cfg.dash ? 1.5 : 2.5, strokeDasharray: cfg.dash ? [4, 3] : [] });
        s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values);
    chart.appear(1000, 100);
})();

// ── PROJEÇÕES ESTADOS ──
(function () {
    const root = mkRoot("chartProjecoesEstados");
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }));
    const yA = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "estado", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 20 }) }));
    const xA = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
    ax(xA); ax(yA);
    const data = [{ estado: "PR", v2022: 31962, v2031: 29307 }, { estado: "MT", v2022: 15292, v2031: 17678 }, { estado: "MS", v2022: 44180, v2031: 59149 }, { estado: "MG", v2022: 63948, v2031: 88662 }, { estado: "GO", v2022: 71898, v2031: 101257 }];
    yA.data.setAll(data);
    [{ f: "v2022", n: "2021/22", c: P[3] }, { f: "v2031", n: "2031/32", c: P[0] }].forEach(cfg => {
        const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: cfg.n, xAxis: xA, yAxis: yA, valueXField: cfg.f, categoryYField: "estado", clustered: true, tooltip: am5.Tooltip.new(root, { labelText: `${cfg.n}: {valueX}` }) }));
        s.columns.template.setAll({ cornerRadiusTR: 3, cornerRadiusBR: 3, height: am5.percent(40), fill: am5.color(cfg.c), stroke: am5.color(cfg.c) });
        s.data.setAll(data);
    });
    const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 }));
    l.labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif" });
    l.data.setAll(chart.series.values);
    chart.appear(1000, 100);
})();

// ── BIOMAS ──
(function () {
    const root = mkRoot("chartBiomas");
    const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
    const s = chart.series.push(am5percent.PieSeries.new(root, { valueField: "v", categoryField: "c" }));
    s.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    s.data.setAll([{ c: "Cerrado", v: 31367252 }, { c: "Amazônia", v: 11544970 }, { c: "Pantanal", v: 4010372 }, { c: "Mata Atlântica", v: 1439996 }]);
    s.get("colors").set("colors", P.map(c => am5.color(c)));
    const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 }));
    l.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    l.data.setAll(s.dataItems);
    chart.appear(1000, 100);
})();

// ── FILTER LOGIC ──
window.onFilterChange = function (filterId, group) {
    const switchTab = id => {
        const btn = document.querySelector(`[data-tab="${id}"]`);
        if (btn) btn.click();
    };
    const resetInd = () => {
        document.querySelectorAll('[data-filter-group="ind"] .filter-btn')
            .forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
        document.querySelectorAll("[data-category]").forEach(el => { el.style.display = ""; });
    };

    if (group === "regiao") {
        const tabMap = { brasil: "ct-rebanho", go: "ct-rebanho", co: "ct-pastagens", mundial: "ct-mundial" };
        if (tabMap[filterId]) switchTab(tabMap[filterId]);
        resetInd();
        return;
    }
    if (group === "ind") {
        // Indicator maps directly to its tab
        const tabMap = { rebanho: "ct-rebanho", abate: "ct-rebanho", preco: "ct-precos", producao: "ct-mundial" };
        if (tabMap[filterId]) switchTab(tabMap[filterId]);
        // Show/hide categorised columns within the now-active tab
        requestAnimationFrame(() => {
            const activeTab = document.querySelector("[data-tab-content].active");
            if (!activeTab) return;
            activeTab.querySelectorAll("[data-category]").forEach(el => {
                el.style.display = (filterId === "all" || el.dataset.category === filterId) ? "" : "none";
            });
        });
    }
};

// ── CUSTO PASTAGENS DEGRADADAS ──
(function () {
    const root = mkRoot("chartCustoPastagens");
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "nivel", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 10 }) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    xA.get("renderer").labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif", oversizedBehavior: "truncate", maxWidth: 100 });
    const data = [
        { nivel: "Manutenção (Baixa)", custoAtual: 272.86, custoProjetado: 317.77 },
        { nivel: "Moderada", custoAtual: 1159.62, custoProjetado: 1351.66 },
        { nivel: "Severa", custoAtual: 1727.99, custoProjetado: 2019.13 }
    ];
    xA.data.setAll(data);
    [{ f: "custoAtual", n: "Custo Atual (R$/ha)", c: P[2] }, { f: "custoProjetado", n: "Projeção 2033 (R$/ha)", c: P[0] }].forEach(cfg => {
        const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: cfg.n, xAxis: xA, yAxis: yA, valueYField: cfg.f, categoryXField: "nivel", clustered: true, tooltip: am5.Tooltip.new(root, { labelText: `${cfg.n}: R$ {valueY}/ha` }) }));
        s.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(40), fill: am5.color(cfg.c), stroke: am5.color(cfg.c) });
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values);
    chart.appear(1000, 100);
})();

// ── ESTADOS PASTAGENS ──
(function () {
    const root = mkRoot("chartEstadosPast");
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }));
    const yA = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "estado", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 20 }) }));
    const xA = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
    ax(xA); ax(yA);
    const data = [{ estado: "DF", v: 83529 }, { estado: "GO", v: 13390807 }, { estado: "MS", v: 15254883 }, { estado: "MT", v: 19633371 }];
    yA.data.setAll(data);
    const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Área (ha)", xAxis: xA, yAxis: yA, valueXField: "v", categoryYField: "estado", tooltip: am5.Tooltip.new(root, { labelText: "{categoryY}: {valueX} ha" }) }));
    s.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
    s.columns.template.adapters.add("fill", (f, t) => am5.color(P[data.findIndex(d => d.estado === t.dataItem?.get("categoryY")) % P.length]));
    s.columns.template.adapters.add("stroke", (f, t) => am5.color(P[data.findIndex(d => d.estado === t.dataItem?.get("categoryY")) % P.length]));
    s.data.setAll(data);
    chart.appear(1000, 100);
})();