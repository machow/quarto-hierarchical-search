import {
  HierarchicalMenu,
  Hits,
  Pagination,
  Stats,
} from "react-instantsearch";
import { SearchLayout } from "../components/Layout";
import { SearchHit } from "../components/SearchHit";
import { defaultSearchConfig, type SearchConfig } from "../algolia";

export function FacetedDrilldown({ config }: { config?: SearchConfig }) {
  const { hierarchicalAttributes } = config ?? defaultSearchConfig;

  return (
    <SearchLayout config={config}>
      <div className="two-column">
        <aside className="sidebar">
          <h2>Categories</h2>
          <HierarchicalMenu
            attributes={hierarchicalAttributes}
            classNames={{
              root: "hierarchical-menu",
              list: "hierarchical-menu-list",
              item: "hierarchical-menu-item",
              selectedItem: "hierarchical-menu-item--selected",
              link: "hierarchical-menu-link",
              label: "hierarchical-menu-label",
              count: "hierarchical-menu-count",
            }}
          />
        </aside>
        <div className="results-panel">
          <Stats
            classNames={{ root: "stats" }}
            translations={{
              rootElementText: ({ nbHits, processingTimeMS }) =>
                `${nbHits.toLocaleString()} results (${processingTimeMS}ms)`,
            }}
          />
          <Hits hitComponent={SearchHit} classNames={{ list: "hits-list" }} />
          <Pagination
            classNames={{
              root: "pagination",
              list: "pagination-list",
              item: "pagination-item",
              selectedItem: "pagination-item--selected",
              link: "pagination-link",
            }}
          />
        </div>
      </div>
    </SearchLayout>
  );
}
