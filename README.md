# Quarto Hierarchical Search

Demo app for evaluating hierarchical search UX patterns against Algolia-powered Quarto documentation indices.

## Updating search index

The code below merges the indexes listed in `merge_data.yml`, transforms their
crumbs to match what algolia prefers, and then uploads to algolia.

To use it, first create a .env file with

```bash
ALGOLIA_APP_ID=...
ALGOLIA_API_KEY_WRITE=...
```

Here is the code to upload:


```bash
uv run _upload_index/0-merge-index.py
uv run _upload_index/1-transform-crumbs.py
uv run _upload_index/2-upload-index.py
```

To specify the index to upload to, use

```bash
ALGOLIA_INDEX=name_of_index uv run _upload_index/2-upload-index.py
```

## Structure

- **`react-app/`** — React + TypeScript demo with two search UX approaches (faceted drill-down and tree nav)

See [`react-app/README.md`](react-app/README.md) for setup and usage.

## Algolia Indices

| Index | Description |
|-------|-------------|
| `quarto_prototype` | Quarto docs with hierarchical crumbs (`crumbs.lvl0/lvl1/lvl2`) |
| `shiny-prototype-dev` | Multi-site Posit docs with array crumbs and `indexName` field |
| `shiny-prototype-dev-prepended` | Same as above but with `indexName` prepended into the crumb hierarchy |
