import { InstantSearch, SearchBox } from "react-instantsearch";
import { defaultSearchConfig, type SearchConfig } from "../algolia";
import type { ReactNode } from "react";

type SearchLayoutProps = {
  children: ReactNode;
  config?: SearchConfig;
};

export function SearchLayout({ children, config }: SearchLayoutProps) {
  const { searchClient, indexName } = config ?? defaultSearchConfig;

  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
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
