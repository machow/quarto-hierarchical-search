import { NavLink, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { FacetedDrilldown } from "./pages/FacetedDrilldown";
import { TreeNav } from "./pages/TreeNav";
import {
  searchClient,
  HIERARCHICAL_ATTRIBUTES,
  type SearchConfig,
} from "./algolia";

const INDICES: { label: string; indexName: string }[] = [
  { label: "Quarto", indexName: "quarto_prototype" },
  { label: "Posit Docs", indexName: "shiny-prototype-dev" },
  { label: "Posit Docs (prepended)", indexName: "shiny-prototype-dev-prepended" },
];

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const indexParam = searchParams.get("index");
  const activeIndex = Math.max(0, INDICES.findIndex((idx) => idx.indexName === indexParam)) || 0;

  const setActiveIndex = (i: number) => {
    setSearchParams({ index: INDICES[i].indexName });
  };

  const config: SearchConfig = {
    searchClient,
    indexName: INDICES[activeIndex].indexName,
    hierarchicalAttributes: HIERARCHICAL_ATTRIBUTES,
  };

  return (
    <div className="app">
      <nav className="app-nav">
        <span className="app-title">Quarto Search Demo</span>
        <div className="index-toggle">
          {INDICES.map((idx, i) => (
            <button
              key={idx.indexName}
              className={`index-btn ${i === activeIndex ? "index-btn--active" : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              {idx.label}
            </button>
          ))}
        </div>
        <div className="nav-links">
          <NavLink to={{ pathname: "/faceted", search: searchParams.toString() }}>
            Faceted Drill-down
          </NavLink>
          <NavLink to={{ pathname: "/tree", search: searchParams.toString() }}>
            Tree Nav
          </NavLink>
        </div>
      </nav>
      <main className="app-main">
        <Routes>
          <Route
            path="/faceted"
            element={<FacetedDrilldown key={config.indexName} config={config} />}
          />
          <Route
            path="/tree"
            element={<TreeNav key={config.indexName} config={config} />}
          />
          <Route path="*" element={<Navigate to="/faceted" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
