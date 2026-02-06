import { algoliasearch } from "algoliasearch";

export const searchClient = algoliasearch(
  "AK1GB1OWGW",
  "4ac92cf786d83c1a9bef1d2513c77969"
);

export const INDEX_NAME = "quarto_prototype";

export const HIERARCHICAL_ATTRIBUTES = [
  "crumbs.lvl0",
  "crumbs.lvl1",
  "crumbs.lvl2",
];
