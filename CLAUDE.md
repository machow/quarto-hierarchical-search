# CLAUDE.md

## Project Overview

Demo app evaluating hierarchical search UX for Algolia-indexed Quarto/Posit documentation. The main work is in `react-app/`.

## Development

```bash
cd react-app
npm install
npm run dev        # Vite dev server at localhost:5173
npx tsc -b         # Type check
```

## Algolia

- App ID: `AK1GB1OWGW` (search-only key in `algolia.ts`)
- Primary index: `quarto_prototype` — Quarto docs, crumbs already in `{lvl0, lvl1, lvl2}` format
- Secondary: `shiny-prototype-dev` — multi-site Posit docs, crumbs as arrays with `indexName` field
- Secondary: `shiny-prototype-dev-prepended` — same but `indexName` prepended into crumb hierarchy

## Architecture

- Pages accept an optional `SearchConfig` prop (searchClient, indexName, hierarchicalAttributes)
- `SearchLayout` wraps `InstantSearch` + `SearchBox`; pages provide sidebar + results
- Index toggle in `App.tsx` uses `?index=` query param, re-mounts page via React `key`
- `scripts/transform-index.mjs` converts array crumbs to hierarchical format; `--prepend-field` shifts levels down

## Conventions

- All styles in a single `styles.css` (no CSS modules or styled-components)
- No tests yet — this is a prototype for UX evaluation
- TypeScript strict mode via Vite template defaults
