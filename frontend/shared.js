// ── SHARED PALETTE & HELPERS ──────────────────────────────
const PALETTE = [
    "#4a7c3f", "#c8943a", "#a0622b", "#6fa65e", "#2d5c24",
    "#e8a84c", "#7fb069", "#5c4033", "#3a6b4a", "#d4a843"
];

function makeRoot(divId) {
    const root = am5.Root.new(divId);
    root.setThemes([am5themes_Animated.new(root)]);
    root.numberFormatter.set("numberFormat", "#,###");
    return root;
}

function styleAxis(axis) {
    axis.get("renderer").labels.template.setAll({
        fontSize: 11, fontFamily: "Arial, sans-serif", fill: am5.color("#5a5a5a")
    });
}

function makeLegend(chart, root) {
    const l = chart.children.push(am5.Legend.new(root, {
        centerX: am5.p50, x: am5.p50, marginTop: 8
    }));
    l.labels.template.setAll({ fontSize: 11, fontFamily: "Arial, sans-serif" });
    return l;
}

// Tab system
document.addEventListener("DOMContentLoaded", () => {
    let pendingFilterRowUpdate = false;
    const updateFilterContentRows = () => {
        pendingFilterRowUpdate = false;
        document.querySelectorAll(".filter-content-row").forEach(row => {
            const hasVisibleItem = Array.from(row.querySelectorAll("[data-category]")).some(el => {
                return !el.classList.contains("is-filter-hidden") && getComputedStyle(el).display !== "none";
            });
            row.classList.toggle("filter-content-row--visible", hasVisibleItem);
        });
    };
    const scheduleFilterRowUpdate = () => {
        if (pendingFilterRowUpdate) return;
        pendingFilterRowUpdate = true;
        requestAnimationFrame(updateFilterContentRows);
    };

    document.querySelectorAll("[data-category]").forEach(el => {
        el.closest(".row")?.classList.add("filter-content-row");
    });
    const filterRowObserver = new MutationObserver(scheduleFilterRowUpdate);
    document.querySelectorAll("[data-category]").forEach(el => {
        filterRowObserver.observe(el, { attributes: true, attributeFilter: ["class", "style"] });
    });
    updateFilterContentRows();

    document.querySelectorAll("[data-tab]").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.dataset.tab;
            const parent = btn.closest("section, .tab-scope") || document;
            parent.querySelectorAll("[data-tab]").forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");
            parent.querySelectorAll("[data-tab-content]").forEach(c => c.classList.remove("active"));
            const content = parent.querySelector(`[data-tab-content="${tabId}"]`);
            if (content) content.classList.add("active");
            if (typeof window.onTabChange === "function") window.onTabChange(tabId);
            // Reset indicator filter and show all categorised items
            document.querySelectorAll('[data-filter-group="ind"] .filter-btn')
                .forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
            document.querySelectorAll("[data-category]").forEach(el => { el.style.display = ""; });
            scheduleFilterRowUpdate();
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            const t = document.querySelector(a.getAttribute("href"));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
        });
    });

    // Filter system
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".filter-group").querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filterId = btn.dataset.filter;
            const group = btn.closest("[data-filter-group]")?.dataset.filterGroup || "";
            if (typeof window.onFilterChange === "function") window.onFilterChange(filterId, group);
        });
    });
});
