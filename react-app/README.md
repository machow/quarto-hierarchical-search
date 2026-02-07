# React Hierarchical Search Demo

Two search UX patterns for navigating Algolia-indexed Quarto/Posit documentation with hierarchical crumb facets.

## Quick Start

```bash
cd react-app
npm install
npm run dev
```

Open http://localhost:5173

## Pages

**Faceted Drill-down** (`/faceted`) — Algolia's `HierarchicalMenu` widget. Selecting a category reveals its children progressively.

**Tree Nav** (`/tree`) — Custom tree/accordion sidebar showing the full hierarchy. Nodes expand/collapse independently; auto-expands when a descendant is refined.

## Index Switching

Toggle between indices using the buttons in the nav bar, or link directly with query params:

```
/faceted?index=quarto_prototype
/tree?index=shiny-prototype-dev
/faceted?index=shiny-prototype-dev-prepended
```

## Environment Variables

Override Algolia credentials via `.env`:

```
VITE_ALGOLIA_APP_ID=AK1GB1OWGW
VITE_ALGOLIA_SEARCH_KEY=your-search-key
VITE_ALGOLIA_INDEX=quarto_prototype
```

## Transform Script

`scripts/transform-index.mjs` downloads records from an Algolia index and converts array-style crumbs to the hierarchical facet format Algolia expects.

```bash
# Peek at an index
node scripts/transform-index.mjs shiny-prototype-dev --peek

# Transform crumbs: ["a", "b"] → {lvl0: "a", lvl1: "a > b"}
node scripts/transform-index.mjs shiny-prototype-dev > output.json

# Prepend a field (e.g. indexName) as lvl0, shifting others down
node scripts/transform-index.mjs shiny-prototype-dev --prepend-field=indexName > output.json
```

## Key Files

```
src/
├── algolia.ts                 # Client config, SearchConfig type
├── components/
│   ├── Layout.tsx             # InstantSearch wrapper + SearchBox
│   └── SearchHit.tsx          # Hit card component
├── pages/
│   ├── FacetedDrilldown.tsx   # HierarchicalMenu page
│   └── TreeNav.tsx            # Tree/accordion page
├── App.tsx                    # Routing + index toggle
├── main.tsx                   # Entry point
└── styles.css                 # All styles
```

## Algolia Index Requirements

Records should have hierarchical crumbs in this format:

```json
{
  "crumbs": {
    "lvl0": "Guide",
    "lvl1": "Guide > Interactivity",
    "lvl2": "Guide > Interactivity > Widgets"
  }
}
```

The index must have `crumbs.lvl0`, `crumbs.lvl1`, `crumbs.lvl2` (and optionally deeper) in `attributesForFaceting`.
