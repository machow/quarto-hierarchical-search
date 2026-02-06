import { InstantSearch, SearchBox } from "react-instantsearch";
import { searchClient, INDEX_NAME } from "../algolia";
import type { ReactNode } from "react";

export function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <InstantSearch searchClient={searchClient} indexName={INDEX_NAME}>
      <div className="search-panel">
        <SearchBox
          placeholder="Search Quarto docs..."
          classNames={{
            root: "searchbox",
            input: "searchbox-input",
            submit: "searchbox-submit",
            reset: "searchbox-reset",
          }}
        />
        <div className="search-content">{children}</div>
      </div>
    </InstantSearch>
  );
}
