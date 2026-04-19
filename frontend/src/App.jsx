import { useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AmbajiDashboard from "./pages/AmbajiDashboard";
import DwarkaDashboard from "./pages/DwarkaDashboard";
import SomnathDashboard from "./pages/SomnathDashboard";
import PavagadhDashboard from "./pages/PavagadhDashboard";
import AgencyDashboard from "./pages/AgencyDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ambaji" element={<AmbajiDashboard />} />
        <Route path="/dwarka" element={<DwarkaDashboard />} />
        <Route path="/somnath" element={<SomnathDashboard />} />
        <Route path="/pavagadh" element={<PavagadhDashboard />} />
        <Route path="/police" element={<AgencyDashboard />} />
        <Route path="/trust" element={<AgencyDashboard />} />
        <Route path="/transport" element={<AgencyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
