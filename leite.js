const P = ["#4a7c3f", "#c8943a", "#a0622b", "#6fa65e", "#2d5c24", "#e8a84c", "#7fb069", "#5c4033", "#3a6b4a", "#d4a843"];
function ax(a) { a.get("renderer").labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif", fill: am5.color("#5a5a5a") }); }
function leg(chart, root) { const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 8 })); l.labels.template.setAll({ fontSize: 11, fontFamily: "'Sora',sans-serif" }); return l; }

// ── SÉRIE BRASIL ──
(function () {
    const root = am5.Root.new("chartLeiteSeries"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const sd = { Brasil: [34.26, 35.12, 34.61, 33.68, 33.31, 33.92, 34.85, 35.37, 35.31], "Minas Gerais": [9.3, 9.4, 9.1, 8.9, 8.9, 8.9, 9.4, 9.7, 9.6], Paraná: [4.3, 4.5, 4.7, 4.7, 4.4, 4.4, 4.3, 4.6, 4.4], "Rio Grande do Sul": [4.5, 4.7, 4.6, 4.6, 4.4, 4.2, 4.3, 4.2, 4.4], Goiás: [3.8, 3.7, 3.4, 2.9, 3.0, 3.1, 3.2, 3.2, 3.1] };
    const anos = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
    const data = anos.map((a, i) => { const o = { ano: String(a) }; Object.keys(sd).forEach(k => o[k] = sd[k][i]); return o; });
    xA.data.setAll(data);
    Object.keys(sd).forEach((name, idx) => {
        const s = chart.series.push(am5xy.LineSeries.new(root, { name, xAxis: xA, yAxis: yA, valueYField: name, categoryXField: "ano", stroke: am5.color(P[idx]), fill: am5.color(P[idx]), tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY} bi L" }) }));
        s.strokes.template.setAll({ strokeWidth: 2 });
        s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── REGIONAL PIE ──
(function () {
    const root = am5.Root.new("chartLeiteRegiao"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
    const s = chart.series.push(am5percent.PieSeries.new(root, { valueField: "v", categoryField: "c" }));
    s.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    s.data.setAll([{ c: "Sul", v: 33.88 }, { c: "Sudeste", v: 33.86 }, { c: "Nordeste", v: 15.71 }, { c: "Centro-Oeste", v: 11.28 }, { c: "Norte", v: 5.27 }]);
    s.get("colors").set("colors", P.map(c => am5.color(c)));
    const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 })); l.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" }); l.data.setAll(s.dataItems); chart.appear(1000, 100);
})();

// ── PRODUTIVIDADE ──
(function () {
    const root = am5.Root.new("chartProdutividade"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false }));
    const yA = chart.yAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "r", renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 20 }) }));
    const xA = chart.xAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererX.new(root, {}) }));
    ax(xA); ax(yA);
    const data = [{ r: "Norte", v: 954 }, { r: "Nordeste", v: 1485 }, { r: "Centro-Oeste", v: 1719 }, { r: "Sudeste", v: 2537 }, { r: "Sul", v: 3700 }];
    yA.data.setAll(data);
    const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: "L/vaca/ano", xAxis: xA, yAxis: yA, valueXField: "v", categoryYField: "r", tooltip: am5.Tooltip.new(root, { labelText: "{valueX} L/vaca/ano" }) }));
    s.columns.template.setAll({ cornerRadiusTR: 4, cornerRadiusBR: 4, height: am5.percent(65) });
    s.columns.template.adapters.add("fill", (f, t) => am5.color(P[data.findIndex(d => d.r === t.dataItem?.get("categoryY")) % P.length]));
    s.data.setAll(data); chart.appear(1000, 100);
})();

// ── MESO LINHAS ──
(function () {
    const root = am5.Root.new("chartGoiasMeso"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const meso = { "Sul Goiano": [1946760, 1867817, 1692274, 1364600, 1409074, 1445085, 1432743, 1442764, 1451399], "Centro Goiano": [983197, 1037974, 1000323, 946816, 992101, 1030281, 1051259, 1030888, 998924], "Leste Goiano": [317277, 309287, 306458, 245780, 250031, 272550, 337869, 342818, 295256], "Noroeste Goiano": [302402, 294984, 265306, 239519, 219930, 218721, 222374, 221802, 230043], "Norte Goiano": [227167, 149130, 141152, 136726, 118696, 117443, 120718, 135239, 145770] };
    const anos = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
    const data = anos.map((a, i) => { const o = { ano: String(a) }; Object.keys(meso).forEach(k => o[k] = Math.round(meso[k][i] / 1000)); return o; });
    xA.data.setAll(data);
    Object.keys(meso).forEach((name, idx) => {
        const s = chart.series.push(am5xy.LineSeries.new(root, { name, xAxis: xA, yAxis: yA, valueYField: name, categoryXField: "ano", stroke: am5.color(P[idx]), fill: am5.color(P[idx]), tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY} mi L" }) }));
        s.strokes.template.setAll({ strokeWidth: 2 });
        s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── MESO PIE ──
(function () {
    const root = am5.Root.new("chartGoiasMesoPie"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(55) }));
    const s = chart.series.push(am5percent.PieSeries.new(root, { valueField: "v", categoryField: "c" }));
    s.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" });
    s.data.setAll([{ c: "Sul", v: 1451399 }, { c: "Centro", v: 998924 }, { c: "Leste", v: 295256 }, { c: "Noroeste", v: 230043 }, { c: "Norte", v: 145770 }]);
    s.get("colors").set("colors", P.map(c => am5.color(c)));
    const l = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 10 })); l.labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif" }); l.data.setAll(s.dataItems); chart.appear(1000, 100);
})();

// ── VACAS BARRAS ──
(function () {
    const root = am5.Root.new("chartVacasGoias"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "r", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 10 }) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const data = [{ r: "Centro", v2013: 755684, v2017: 643948 }, { r: "Sul", v2013: 1219710, v2017: 847434 }, { r: "Leste", v2013: 254484, v2017: 192997 }, { r: "Noroeste", v2013: 276437, v2017: 188501 }, { r: "Norte", v2013: 217279, v2017: 112101 }];
    xA.data.setAll(data);
    [{ f: "v2013", n: "2013", c: P[0] }, { f: "v2017", n: "2017", c: P[1] }].forEach(cfg => {
        const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: cfg.n, xAxis: xA, yAxis: yA, valueYField: cfg.f, categoryXField: "r", clustered: true, tooltip: am5.Tooltip.new(root, { labelText: `${cfg.n}: {valueY}` }) }));
        s.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(40), fill: am5.color(cfg.c), stroke: am5.color(cfg.c) });
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── MUNICÍPIOS LINHAS ──
(function () {
    const root = am5.Root.new("chartMunicipios"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "ano", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }), tooltip: am5.Tooltip.new(root, {}) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    const munis = { Orizona: [80000, 82500, 90000, 88000, 93000, 110000, 110500, 113000, 115826], Piracanjuba: [147490, 154800, 105805, 85500, 95000, 94878, 94975, 95100, 95800], Jataí: [143100, 144700, 98000, 87000, 85000, 86100, 88400, 88700, 89500], "Bela Vista de GO": [44250, 71000, 71500, 70000, 73500, 79000, 78000, 77839, 78799], "Rio Verde": [70000, 91000, 90000, 70000, 71300, 65800, 65950, 72122, 71450] };
    const anos = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
    const data = anos.map((a, i) => { const o = { ano: String(a) }; Object.keys(munis).forEach(k => o[k] = munis[k][i]); return o; });
    xA.data.setAll(data);
    Object.keys(munis).forEach((name, idx) => {
        const s = chart.series.push(am5xy.LineSeries.new(root, { name, xAxis: xA, yAxis: yA, valueYField: name, categoryXField: "ano", stroke: am5.color(P[idx]), fill: am5.color(P[idx]), tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" }) }));
        s.strokes.template.setAll({ strokeWidth: 2 });
        s.bullets.push(() => am5.Bullet.new(root, { sprite: am5.Circle.new(root, { radius: 3, fill: s.get("fill"), stroke: root.interfaceColors.get("background"), strokeWidth: 2 }) }));
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();

// ── FILTER LOGIC ──
window.onFilterChange = function (filterId, group) {
    if (group === "escala") {
        // Navigate to the matching tab
        const tabMap = { brasil: "lt-brasil", goias: "lt-goias", municipio: "lt-municipios" };
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

// ── MUNICÍPIOS BARRAS ──
(function () {
    const root = am5.Root.new("chartMunicipiosBars"); root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout }));
    const xA = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "m", renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 10 }) }));
    const yA = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    ax(xA); ax(yA);
    xA.get("renderer").labels.template.setAll({ fontSize: 10, fontFamily: "'Sora',sans-serif", oversizedBehavior: "truncate", maxWidth: 80 });
    const data = [{ m: "Orizona", v2013: 80000, v2021: 115826 }, { m: "Piracanjuba", v2013: 147490, v2021: 95800 }, { m: "Jataí", v2013: 143100, v2021: 89500 }, { m: "Bela Vista GO", v2013: 44250, v2021: 78799 }, { m: "Rio Verde", v2013: 70000, v2021: 71450 }];
    xA.data.setAll(data);
    [{ f: "v2013", n: "2013", c: P[0] }, { f: "v2021", n: "2021", c: P[1] }].forEach(cfg => {
        const s = chart.series.push(am5xy.ColumnSeries.new(root, { name: cfg.n, xAxis: xA, yAxis: yA, valueYField: cfg.f, categoryXField: "m", clustered: true, tooltip: am5.Tooltip.new(root, { labelText: `${cfg.n}: {valueY}` }) }));
        s.columns.template.setAll({ cornerRadiusTL: 3, cornerRadiusTR: 3, width: am5.percent(40), fill: am5.color(cfg.c), stroke: am5.color(cfg.c) });
        s.data.setAll(data);
    });
    leg(chart, root).data.setAll(chart.series.values); chart.appear(1000, 100);
})();
