import { algoliasearch } from "algoliasearch";
import type { SearchClient } from "algoliasearch";

export const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID || "AK1GB1OWGW",
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY || "4ac92cf786d83c1a9bef1d2513c77969"
);

export const INDEX_NAME =
  import.meta.env.VITE_ALGOLIA_INDEX || "shiny-prototype-dev-prepended";

export const HIERARCHICAL_ATTRIBUTES = [
  "crumbs.lvl0",
  "crumbs.lvl1",
  "crumbs.lvl2",
];

export type SearchConfig = {
  searchClient: SearchClient;
  indexName: string;
  hierarchicalAttributes: string[];
};

export const defaultSearchConfig: SearchConfig = {
  searchClient,
  indexName: INDEX_NAME,
  hierarchicalAttributes: HIERARCHICAL_ATTRIBUTES,
};
