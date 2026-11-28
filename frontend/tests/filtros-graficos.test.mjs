import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const shared = readFileSync(new URL("../shared.js", import.meta.url), "utf8");

function dado(campos) {
  return { get: campo => campos[campo] };
}

class Serie {
  constructor(nome, dataItems) {
    this.nome = nome;
    this.dataItems = dataItems;
  }

  isVisible() { return true; }
  isHiding() { return false; }
  get() { return false; }
}

class ColumnSeries extends Serie {}

function montarGrafico(series, filtros) {
  const contexto = {
    window: {},
    document: new EventTarget(),
    am5xy: { ColumnSeries },
    queueMicrotask
  };
  runInNewContext(shared, contexto);
  const dom = new EventTarget();
  const descarte = [];
  contexto.ligarFiltroEmXY({
    root: { dom, documentPointToRoot: ponto => ponto, addDisposer: disposer => descarte.push(disposer) },
    plotContainer: { toLocal: ponto => ponto },
    inPlot: ({ x, y }) => x >= 0 && x <= 100 && y >= 0 && y <= 100,
    series: { values: series }
  }, serie => filtros.get(serie.nome));
  return {
    async clicar(x, y, pointerType = "mouse") {
      dom.dispatchEvent(Object.assign(new Event("click"), { clientX: x, clientY: y, pointerType }));
      await Promise.resolve();
    },
    descartar: () => descarte.forEach(disposer => disposer.dispose())
  };
}

test("reconhece um clique entre os pontos e ignora a legenda e espaços vazios", async () => {
  const cliques = [];
  const grafico = montarGrafico([
    new Serie("Goiás", [dado({ point: { x: 20, y: 30 }, valueY: 8 }), dado({ point: { x: 80, y: 30 }, valueY: 8 })]),
    new Serie("Mato Grosso", [dado({ point: { x: 20, y: 45 }, valueY: 5 }), dado({ point: { x: 80, y: 45 }, valueY: 5 })])
  ], new Map([["Goiás", () => cliques.push("GO")], ["Mato Grosso", () => cliques.push("MT")]]));

  await grafico.clicar(50, 34);
  await grafico.clicar(50, 70);
  await grafico.clicar(50, 115);
  grafico.descartar();
  await grafico.clicar(50, 34);
  assert.deepEqual(cliques, ["GO"]);
});

test("um toque reconhece barras muito pequenas e respeita opções indisponíveis", async () => {
  const cliques = [];
  const graphics = { isVisible: () => true };
  const grafico = montarGrafico([
    new ColumnSeries("Látex líquido", [dado({ left: 2, right: 2.4, top: 12, bottom: 20, graphics })]),
    new ColumnSeries("Indisponível", [dado({ left: 2, right: 2.4, top: 24, bottom: 32, graphics })])
  ], new Map([["Látex líquido", () => cliques.push("Látex líquido")]]));

  await grafico.clicar(12, 16, "touch");
  await grafico.clicar(6, 26, "touch");
  assert.deepEqual(cliques, ["Látex líquido"]);
});
