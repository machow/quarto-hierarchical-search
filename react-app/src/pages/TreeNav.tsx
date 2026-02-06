import { useState } from "react";
import {
  Hits,
  Pagination,
  Stats,
  useHierarchicalMenu,
} from "react-instantsearch";
import type { UseHierarchicalMenuProps } from "react-instantsearch";
import { SearchLayout } from "../components/Layout";
import { SearchHit } from "../components/SearchHit";
import { HIERARCHICAL_ATTRIBUTES } from "../algolia";

type HierarchicalItem = {
  value: string;
  label: string;
  count: number;
  isRefined: boolean;
  data: HierarchicalItem[] | null;
};

function TreeNode({
  item,
  onRefine,
  depth = 0,
}: {
  item: HierarchicalItem;
  onRefine: (value: string) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(item.isRefined || depth === 0);
  const hasChildren = item.data && item.data.length > 0;

  return (
    <li className="tree-node" style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
      <div
        className={`tree-node-row ${item.isRefined ? "tree-node--selected" : ""}`}
      >
        {hasChildren ? (
          <button
            className="tree-toggle"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span className="tree-toggle-placeholder" />
        )}
        <button className="tree-label" onClick={() => onRefine(item.value)}>
          {item.label}
          <span className="tree-count">{item.count}</span>
        </button>
      </div>
      {hasChildren && expanded && (
        <ul className="tree-children">
          {item.data!.map((child) => (
            <TreeNode
              key={child.value}
              item={child}
              onRefine={onRefine}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function TreeNavSidebar() {
  const { items, refine } = useHierarchicalMenu({
    attributes: HIERARCHICAL_ATTRIBUTES,
  } as UseHierarchicalMenuProps);

  return (
    <aside className="sidebar">
      <h2>Browse</h2>
      {items.length === 0 ? (
        <p className="no-facets">No categories available</p>
      ) : (
        <ul className="tree-root">
          {items.map((item) => (
            <TreeNode
              key={item.value}
              item={item as HierarchicalItem}
              onRefine={refine}
            />
          ))}
        </ul>
      )}
    </aside>
  );
}

export function TreeNav() {
  return (
    <SearchLayout>
      <div className="two-column">
        <TreeNavSidebar />
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
