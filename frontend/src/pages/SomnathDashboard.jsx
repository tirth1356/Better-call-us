import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardNav from "../components/dashboard/DashboardNav";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import RiskCard from "../components/dashboard/RiskCard";
import CountdownTimer from "../components/dashboard/CountdownTimer";
import ActionPanel from "../components/dashboard/ActionPanel";
import AgencyPanel from "../components/dashboard/AgencyPanel";
import AlertModal from "../components/dashboard/AlertModal";
import GraphSection from "../components/dashboard/GraphSection";
import InsightPanel from "../components/dashboard/InsightPanel";
import SectorCard from "../components/dashboard/SectorCard";
import AiChatPanel from "../components/dashboard/AiChatPanel";
import HistoryReplaySection from "../components/dashboard/HistoryReplaySection";
import { useDashboardStore } from "../store/dashboardStore";
import { X, History, Activity } from "lucide-react";

export default function SomnathDashboard() {
  const { alerts, pressureIndex, flowVelocity, sensorCount, connectWebsocket, risk, predictedWindow, rawData, setActiveLocation, showHistory } = useDashboardStore();
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    setActiveLocation("Somnath");
    connectWebsocket();
  }, [setActiveLocation, connectWebsocket]);

  useEffect(() => {
    if (showAuditLog) {
        fetch("http://127.0.0.1:8000/events")
            .then(res => res.json())
            .then(data => setAuditData(data.events || []));
    }
  }, [showAuditLog]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-body text-[#4B2E2B]">
      <DashboardNav templeName="Somnath Temple" />
      <AlertModal />
      
      {/* 📜 Audit Log Modal 📜 */}
      <AnimatePresence>
          {showAuditLog && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B2E2B]/40 backdrop-blur-sm"
              >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                  >
                      <div className="p-6 border-b flex justify-between items-center bg-[#FFF8F0]">
                          <div className="flex items-center gap-3">
                              <History className="text-[#C08552]" />
                              <h2 className="text-2xl font-headline font-bold">Event Audit Log</h2>
                          </div>
                          <button onClick={() => setShowAuditLog(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                              <X size={20} />
                          </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6">
                          <table className="w-full text-left">
                              <thead className="text-[10px] uppercase tracking-widest text-stone-400 font-bold border-b">
                                  <tr>
                                      <th className="pb-4">Timestamp</th>
                                      <th className="pb-4">Risk</th>
                                      <th className="pb-4">CPI</th>
                                      <th className="pb-4">Pred. Window</th>
                                      <th className="pb-4">Buildup</th>
                                  </tr>
                              </thead>
                              <tbody className="text-sm">
                                   {auditData.slice().reverse().map((entry, idx) => (
                                       <tr key={idx} className="border-b last:border-0 hover:bg-stone-50 transition-colors">
                                           <td className="py-4 font-mono text-xs opacity-60">{entry.raw_data?.timestamp || entry.payload?.raw_data?.timestamp ? new Date(entry.raw_data?.timestamp || entry.payload?.raw_data?.timestamp).toLocaleTimeString() : 'N/A'}</td>
                                           <td className="py-4 font-bold">
                                               <span className={`px-2 py-0.5 rounded-full text-[10px] ${entry.payload?.risk === 'High' || entry.risk === 'High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                   {entry.payload?.risk || entry.risk}
                                               </span>
                                           </td>
                                           <td className="py-4 font-black">{entry.payload?.cpi || entry.cpi}</td>
                                           <td className="py-4 text-[#C08552] font-bold">{entry.payload?.predicted_window_min || entry.predicted_window_min} min</td>
                                           <td className="py-4 opacity-70 italic text-xs">{entry.payload?.buildup || entry.buildup}</td>
                                       </tr>
                                   ))}
                              </tbody>
                          </table>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      <div className="flex">
        <DashboardSidebar />

        <motion.main
          className="flex-1 lg:ml-64 p-6 lg:p-8 max-w-screen-2xl mx-auto w-full"
        >
          {/* Page header */}
          <motion.div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C08552]" />
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#4B2E2B]/40">Site ID: GJ-001 · Gujarat, India</p>
            </div>
            <h2 className="text-3xl font-headline font-black text-[#4B2E2B] tracking-tight">
              Somnath <span className="text-[#C08552]">Observatory</span>
            </h2>
            <p className="text-sm text-[#4B2E2B]/50 mt-1 max-w-lg">
              Historical analysis integrated with real-time data for precise stampede risk mitigation.
            </p>
          </motion.div>

          {/* ROW 1: Core KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="sm:col-span-2 xl:col-span-1">
              <RiskCard />
            </div>
            <div className="sm:col-span-2 xl:col-span-1">
              <CountdownTimer />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-[#C08552]/20 bg-[#FFF8F0] p-6 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/50">Pressure Index</p>
                <span className="text-[10px] font-black text-[#C08552] bg-[#C08552]/10 px-2 py-0.5 rounded-full">P/m²</span>
              </div>
              <div className="mt-3">
                <p className="text-4xl font-headline font-black text-[#4B2E2B]">{pressureIndex}</p>
                <p className="text-xs text-[#4B2E2B]/40 mt-1">Pascal per square metre</p>
              </div>
              <div className="mt-3 flex gap-1 items-end h-8">
                {[0.3, 0.5, 0.4, 0.6, 0.64, 0.7, 0.64].map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${v * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="flex-1 rounded-t-sm bg-[#C08552]/40"
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-[#C08552]/20 p-6 flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, #4B2E2B, #8C5A3C)" }}
            >
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Flow Velocity</p>
              <div className="mt-3">
                <p className="text-4xl font-headline font-black text-white">{flowVelocity}</p>
                <p className="text-xs text-white/40 mt-1">metres / second</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white/70">Feed Live</span>
              </div>
            </motion.div>
          </div>

          {/* ROW 2: Graph + Action */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            <div className="xl:col-span-2">
              <GraphSection />
            </div>
            <div className="flex flex-col gap-4">
              <ActionPanel />
            </div>
          </div>

          {/* ROW 3: Sectors + Insight */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            <div className="xl:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/40 mb-0.5">Live Monitoring</p>
                  <h3 className="text-lg font-headline font-bold text-[#4B2E2B]">Sector Analysis</h3>
                </div>
                <span className="text-[10px] font-bold text-[#C08552] hover:underline cursor-pointer">View Map →</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SectorCard 
                  name={rawData.location || "Main Entry"} 
                  risk={risk} 
                  window={risk === "LOW" || risk === "Low" ? "SAFE" : `${predictedWindow}m`} 
                  density={parseFloat(rawData.queue_density_pax_per_m2) || parseFloat(pressureIndex)} 
                  index={0} 
                />
                <SectorCard 
                  name="Gate 1" 
                  risk="LOW" 
                  window="90m+" 
                  density={(parseFloat(rawData.queue_density_pax_per_m2) || 0) * 0.6} 
                  index={1} 
                />
                <SectorCard 
                  name="Gate 2" 
                  risk={risk === "HIGH" ? "MEDIUM" : "LOW"} 
                  window="--m" 
                  density={(parseFloat(rawData.queue_density_pax_per_m2) || 0) * 0.4} 
                  index={2} 
                />
              </div>
            </div>
            <InsightPanel />
          </div>

          {/* ROW 4: Agency + AI Chat */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
            <AgencyPanel />
            <AiChatPanel />
          </div>

          {/* 📊 Integrated History Replay 📊 */}
          {showHistory && <HistoryReplaySection />}

          {/* Footer strip */}
          <motion.div className="flex items-center justify-between pt-4 border-t border-[#C08552]/10">
            <p className="text-[10px] text-[#4B2E2B]/30 font-body uppercase tracking-widest">
              © 2024 Chronos Observatory · Stampede Window Predictor
            </p>
            <div className="flex gap-4">
              {["Architecture", "Privacy", "API Docs", "Support"].map((l) => (
                <a key={l} href="#" className="text-[10px] text-[#4B2E2B]/30 hover:text-[#C08552] transition-colors uppercase tracking-wider">{l}</a>
              ))}
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
