import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { FacetedDrilldown } from "./pages/FacetedDrilldown";
import { TreeNav } from "./pages/TreeNav";
import { defaultSearchConfig } from "./algolia";

function App() {
  const config = defaultSearchConfig;

  return (
    <div className="app">
      <nav className="app-nav">
        <span className="app-title">Quarto Search Demo</span>
        <div className="nav-links">
          <NavLink to="/faceted">
            Faceted Drill-down
          </NavLink>
          <NavLink to="/tree">
            Tree Nav
          </NavLink>
        </div>
      </nav>
      <main className="app-main">
        <Routes>
          <Route
            path="/faceted"
            element={<FacetedDrilldown config={config} />}
          />
          <Route
            path="/tree"
            element={<TreeNav config={config} />}
          />
          <Route path="*" element={<Navigate to="/faceted" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
