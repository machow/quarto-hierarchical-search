# Quarto Hierarchical Search

Demo app for evaluating hierarchical search UX patterns against Algolia-powered Quarto documentation indices.

## Structure

- **`react-app/`** — React + TypeScript demo with two search UX approaches (faceted drill-down and tree nav)

See [`react-app/README.md`](react-app/README.md) for setup and usage.

## Algolia Indices

| Index | Description |
|-------|-------------|
| `quarto_prototype` | Quarto docs with hierarchical crumbs (`crumbs.lvl0/lvl1/lvl2`) |
| `shiny-prototype-dev` | Multi-site Posit docs with array crumbs and `indexName` field |
| `shiny-prototype-dev-prepended` | Same as above but with `indexName` prepended into the crumb hierarchy |
