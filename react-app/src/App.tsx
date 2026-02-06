import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { FacetedDrilldown } from "./pages/FacetedDrilldown";
import { TreeNav } from "./pages/TreeNav";

function App() {
  return (
    <div className="app">
      <nav className="app-nav">
        <span className="app-title">Quarto Search Demo</span>
        <div className="nav-links">
          <NavLink to="/faceted">Faceted Drill-down</NavLink>
          <NavLink to="/tree">Tree Nav</NavLink>
        </div>
      </nav>
      <main className="app-main">
        <Routes>
          <Route path="/faceted" element={<FacetedDrilldown />} />
          <Route path="/tree" element={<TreeNav />} />
          <Route path="*" element={<Navigate to="/faceted" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
