# CLAUDE.md — Projeto Cerrado · Goiás

Documentação completa do projeto para uso em sessões futuras com o Claude.

---

## Visão Geral do Projeto

Site de observatório de dados agropecuários do Cerrado goiano, inspirado no layout do [Observatório Agropecuário do INMET](https://observatorio.agropecuaria.inmet.gov.br). O sistema é composto por uma página inicial (home) e três painéis temáticos independentes, cada um com gráficos interativos, tabelas e filtros.

---

## Estrutura de Arquivos

```
index.html        → Home com 3 cards clicáveis
leite.html        → Painel: Pecuária de Leite
corte.html        → Painel: Pecuária de Corte
florestas.html    → Painel: Florestas Plantadas (Heveicultura / Borracha Natural)
```

> Cada arquivo é **autocontido** — CSS e JS estão embutidos dentro do próprio HTML, sem dependência de arquivos externos. Isso garante funcionamento ao abrir localmente sem servidor.

---

## Requisitos Técnicos

### Stack
- **HTML5 + CSS3 + JavaScript puro** (sem frameworks JS)
- **Bootstrap 5** (via CDN) — usado exclusivamente para responsividade e grid
- **amCharts 5** (via CDN) — usado para todos os gráficos

### CDNs utilizadas
```html
<!-- Bootstrap -->
https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js

<!-- amCharts 5 -->
https://cdn.amcharts.com/lib/5/index.js
https://cdn.amcharts.com/lib/5/xy.js
https://cdn.amcharts.com/lib/5/percent.js
https://cdn.amcharts.com/lib/5/themes/Animated.js
```

### Proibições explícitas
- ❌ Não usar frameworks CSS além do Bootstrap (sem Tailwind, Bulma etc.)
- ❌ Não usar frameworks JS (sem React, Vue, Angular etc.)
- ❌ Não usar jQuery
- ❌ Não usar arquivos externos de CSS/JS próprios (tudo embutido no HTML)

---

## Design — Tema Cerrado

### Paleta de Cores
```css
--verde:       #4a7c3f   /* cor principal, navbar, bordas */
--verde-claro: #6fa65e   /* destaques secundários */
--dourado:     #c8943a   /* acentos, labels de seção */
--terra:       #a0622b   /* variante quente */
--areia:       #e8dfc8   /* backgrounds de info */
--creme:       #f9f6f0   /* backgrounds de cards */
--fundo:       #f5f1ea   /* background geral da página */
--cinza-esc:   #2b2b2b   /* texto principal */
--cinza-med:   #5a5a5a   /* texto secundário */
--cinza-claro: #e0dbd2   /* bordas e divisores */
```

### Tipografia
- **Display / Títulos / UI:** `Arial`
- **Corpo / Parágrafos:** `Arial`

### Princípios visuais
- Layout **clean e minimalista**
- Cards com `border-radius: 10px` (padrão) e `18px` (cards maiores)
- Sombras sutis: `0 1px 4px rgba(0,0,0,.08)` e `0 4px 16px rgba(0,0,0,.11)`
- KPI cards com borda esquerda colorida (4px) indicando categoria
- Animação de entrada `fadeUp` nos elementos `.fade-up`

---

## Estrutura de Navegação

### Home (`index.html`)
- Navbar sticky com links para os 3 painéis
- Hero com estatísticas de destaque
- **3 cards clicáveis** — cada um leva a uma página separada:
  - 🐄 Pecuária de Leite → `leite.html`
  - 🥩 Pecuária de Corte → `corte.html`
  - 🌳 Florestas Plantadas → `florestas.html`
- Cada card exibe: cover colorida, badge de categoria, KPIs de destaque, descrição e botão CTA

### Páginas Internas
Todas seguem a mesma estrutura:
1. **Navbar** com link "← Início" e links para os outros painéis
2. **Hero** colorido (cor varia por tema)
3. **Barra de filtros** com dois grupos: escala geográfica + indicador
4. **Barra de abas** (tab nav) para seções internas
5. **Conteúdo por aba**: KPI cards + gráficos amCharts + tabelas
6. **Footer** com links cruzados entre painéis

---

## Painéis e Conteúdo

### Pecuária de Leite (`leite.html`)
**Fonte:** IBGE — Pesquisa Pecuária Municipal (PPM) · 2013–2021

**Abas:**
- **Brasil & Regiões** — série histórica por estado (linha), participação regional (pizza), produtividade por região (barras horizontais), tabela regional
- **Goiás** — produção por mesorregião (linha), distribuição mesorregiões (pizza), vacas ordenhadas 2013 vs 2017 (barras agrupadas)
- **Municípios** — evolução top 5 municípios (linha), tabela de produtividade 2019/2020, comparativo 2013 vs 2021 (barras agrupadas)

**Dados principais:**
- Produção Brasil: 34,26 bi L (2013) → 35,31 bi L (2021)
- Produção Goiás: 3,8 bi L (2013) → 3,12 bi L (2021)
- Goiás = 79% da produção do Centro-Oeste (2021)
- Mesorregiões: Sul Goiano, Centro Goiano, Leste Goiano, Noroeste Goiano, Norte Goiano
- Top municípios: Orizona, Piracanjuba, Jataí, Bela Vista de Goiás, Rio Verde
- Produtividade destaque: Vianópolis (3.245 L/vaca/dia em 2020)

---

### Pecuária de Corte (`corte.html`)
**Fontes:** IBGE (PPM, PTA) · MAPA · OECD-FAO · USDA

**Abas:**
- **Rebanho & Abate** — efetivo bovino estados (linha), participação no rebanho nacional (pizza), abate anual GO/MT/MS (barras agrupadas), tabelas de rebanho e abate
- **Preços** — boi gordo R$/@ e carne R$/kg em eixo duplo (2001–2023), tabela histórica
- **Produção Mundial** — série por país (linha), participação 2021 (pizza)
- **Projeções** — projeção MAPA 2021/22–2031/32 com cenários central/inferior/superior (linha tracejada), projeção por estado (barras horizontais)
- **Pastagens** — área por bioma CO (pizza), área por estado CO (barras horizontais), tabela top 10 municípios

**Dados principais:**
- Rebanho Brasil 2021: 224,6 mi cabeças
- Rebanho Goiás 2021: 24,3 mi cabeças (+10,2% vs 2012)
- Boi gordo: R$ 42,35/@ (2001) → R$ 317,74/@ (2022, pico)
- Brasil = 2º maior produtor mundial (8,62 mi t eq. carcaça em 2021)
- EUA = 1º (12,26 mi t), UE = 3º (7,14 mi t)
- Projeção MAPA: 8.423 mil t (2021/22) → 9.677 mil t (2031/32), +14,9%
- Pastagem CO: Cerrado = 31,4 mi ha (1º bioma), MT = 19,6 mi ha (1º estado)

---

### Florestas Plantadas (`florestas.html`)
**Fonte:** IBGE (LSPA) · MAPA · 2012–2021

**Abas:**
- **Centro-Oeste** — produção + produtividade em eixo duplo (barras + linha), área plantada vs colhida (linha), custo por hectare (barras), receita total (barras com cor condicional), tabela histórica completa
- **Cenário Mundial** — ranking de países por área (barras horizontais, Brasil destacado), participação mundial (pizza), custo R$/ha vs R$/kg em eixo duplo

**Dados principais:**
- Produção CO: 42.384 t (2012) → 59.404 t (2021, pico histórico)
- Receita CO 2021: R$ 196,2 mi (maior valor da série)
- Produtividade: 1.484 kg/ha (2012) → 1.771 kg/ha (2021)
- Custo/ha: R$ 3.151 (2012) → R$ 8.874 (2021)
- Custo/kg: R$ 2,52 (2012) → R$ 3,89 (2021)
- Brasil = 7º maior produtor mundial (1,7 mi ha)
- Líder: Indonésia (12,5 mi ha), seguido por Tailândia (5,2 mi ha) e Vietnã (4,2 mi ha)

---

## Componentes Reutilizáveis

### KPI Card
```html
<div class="kpi-card kpi-card--gold">
  <div class="kpi-label">Label em maiúsculas</div>
  <div class="kpi-value">35,3<span class="kpi-unit">bi L</span></div>
  <span class="kpi-badge kpi-badge--up">▲ texto</span>
</div>
```
Variantes: `kpi-card--gold`, `kpi-card--terra`, `kpi-card--light`
Badges: `kpi-badge--up` (verde), `kpi-badge--down` (vermelho), `kpi-badge--neutral` (laranja)

### Chart Card
```html
<div class="chart-card" role="figure" aria-label="Descrição do gráfico">
  <div class="chart-card__title">Título</div>
  <div class="chart-card__sub">Subtítulo / fonte</div>
  <div id="chartId" class="chart-area chart-area--tall" aria-hidden="true"></div>
</div>
```
Alturas: `.chart-area` (300px), `.chart-area--tall` (370px), `.chart-area--sm` (240px)

### Tab System (JS puro)
```html
<!-- Botões -->
<button class="tab-nav__btn active" role="tab" aria-selected="true" data-tab="id-aba">Nome</button>

<!-- Conteúdo -->
<div data-tab-content="id-aba" class="active" role="tabpanel">...</div>
```
O JS detecta `data-tab` e alterna `data-tab-content` dentro do ancestral `section` ou `.tab-scope`.

### Filter Bar
```html
<div class="filter-bar">
  <span class="filter-label">Grupo</span>
  <div class="filter-group" role="group" aria-label="...">
    <button class="filter-btn active" data-filter="all">Todos</button>
    <button class="filter-btn" data-filter="go">Goiás</button>
  </div>
</div>
```

---

## Acessibilidade

### O que está implementado
- Skip link (`<a class="skip-link" href="#main-content">`) em todas as páginas
- Landmarks semânticos: `<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`
- Sistema de abas com ARIA completo: `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, `aria-labelledby`
- Tabelas com `<thead>`, `<th scope="col">`, `aria-label` na `<table>`
- Botão hamburguer com `aria-label`, `aria-expanded`, `aria-controls`
- Grupos de filtros com `role="group"` e `aria-label`
- Links descritivos nos cards da home (`aria-label`)
- Gráficos com `role="figure"` e `aria-label` descritivo; SVG interno com `aria-hidden="true"`
- Badges de ranking com `aria-label="1º"` etc.
- Contraste de cores aprovado WCAG AA nas combinações principais

### Limitações conhecidas (débito técnico)
- ❌ Gráficos amCharts **não têm tabela alternativa** para leitores de tela — dados visuais são inacessíveis para usuários cegos
- ❌ Sem `aria-live` region ao trocar abas ou aplicar filtros
- ❌ Sem estilo customizado para `:focus-visible`
- ❌ Menu mobile reduzido (apenas "← Início") sem aviso ao usuário
- ❌ Filtros não conectados a regiões `aria-live`

### Para corrigir no futuro
Adicionar para cada gráfico uma tabela oculta visualmente:
```html
<table class="visually-hidden" aria-label="Dados do gráfico: [título]">
  <!-- dados em formato tabular -->
</table>
```

---

## Responsividade

| Técnica | Implementação |
|---|---|
| Grid Bootstrap | `col-6 col-md-3`, `col-lg-8` etc. — empilha em mobile |
| Navbar mobile | Menu `d-none d-lg-flex` + botão hamburguer `d-lg-none` |
| Tipografia fluida | `clamp(1.5rem, 3vw, 2.2rem)` nos títulos de hero |
| Gráficos | `width: 100%` + amCharts detecta resize automático |
| Alturas mobile | Media query `max-width: 767px` reduz chart-area e padding |
| Tab nav | `overflow-x: auto` com scroll horizontal suave |
| Tabelas | `div.table-responsive` do Bootstrap |
| Eixos de gráfico | `oversizedBehavior: "truncate"` nos labels do amCharts |

---

## Arquivos de Dados Utilizados

| Arquivo | Conteúdo |
|---|---|
| `Dados_bovinocultura_leite_xlsx__Produção.pdf` | Produção de leite Brasil/estados/mesorregiões/municípios 2013–2021, vacas ordenhadas, produtividade |
| `RESUMO_BORRACHA_xlsx__Planilha1.pdf` | Heveicultura CO 2012–2021: produção, área, custo, ranking mundial |
| `Dados_Bovinocultura_Corte.xlsx` | Rebanho bovino PPM, abate PTA, preços boi gordo, produção mundial OECD-FAO, projeções MAPA, pastagens CO |

---

## Paleta amCharts (usada em todos os gráficos)

```javascript
// Leite / Florestas
const P = ["#4a7c3f","#c8943a","#a0622b","#6fa65e","#2d5c24","#e8a84c","#7fb069","#5c4033","#3a6b4a","#d4a843"];

// Corte
const P = ["#8b3a1a","#c8943a","#4a7c3f","#6fa65e","#2d5c24","#d4843a","#a0622b","#e8a84c","#5c4033","#3a6b4a"];
```

---

## Padrão de Gráfico amCharts (referência rápida)

```javascript
// Raiz padrão
const root = am5.Root.new("divId");
root.setThemes([am5themes_Animated.new(root)]);

// Estilo de eixo (aplicar em todos os eixos)
axis.get("renderer").labels.template.setAll({
  fontSize: 11, fontFamily: "Arial, sans-serif", fill: am5.color("#5a5a5a")
});

// Legenda padrão
const legend = chart.children.push(am5.Legend.new(root, {
  centerX: am5.p50, x: am5.p50, marginTop: 8
}));
legend.labels.template.setAll({ fontSize: 11, fontFamily: "Arial, sans-serif" });

// Sempre finalizar com
chart.appear(1000, 100);
```

---

## Decisões de Projeto

| Decisão | Justificativa |
|---|---|
| Páginas separadas por tema | Cada cadeia produtiva é independente; facilita expansão futura |
| CSS/JS embutido no HTML | Funciona ao abrir localmente sem servidor web |
| Bootstrap só para grid | Evita sobrescrita massiva de estilos; CSS próprio controla todo o visual |
| amCharts 5 | Solicitação explícita do usuário; suporte nativo a resize e animação |
| Sem localStorage/sessionStorage | Não suportado no preview Claude.ai; estado mantido em memória |
| Filtros com `data-filter` | Extensível sem JS adicional; pronto para conectar a gráficos |
| Tema Cerrado | Solicitação explícita; paleta derivada da vegetação e solo do bioma |

---

## Como Expandir

### Adicionar nova cadeia produtiva
1. Criar `nova-cadeia.html` copiando a estrutura de `leite.html`
2. Alterar a classe do hero: `.page-hero--nova` com gradiente adequado
3. Adicionar card na home (`index.html`) com KPIs e link
4. Adicionar link na navbar de todas as páginas

### Adicionar nova aba em painel existente
1. Adicionar botão `<button class="tab-nav__btn" data-tab="id">` na `.tab-nav`
2. Adicionar div `<div data-tab-content="id" role="tabpanel">` no container
3. O JS do sistema de abas detecta automaticamente

### Conectar filtros aos gráficos
Implementar `window.onFilterChange` em cada página:
```javascript
window.onFilterChange = function(filterId) {
  // recriar ou atualizar séries do amCharts conforme filterId
};
```

---

*Gerado em abril de 2026 · Projeto: Projeto Cerrado · Goiás*
