import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import DashboardNav from "../components/dashboard/DashboardNav";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import RiskCard from "../components/dashboard/RiskCard";
import CountdownTimer from "../components/dashboard/CountdownTimer";
import AgencyPanel from "../components/dashboard/AgencyPanel";
import AlertModal from "../components/dashboard/AlertModal";
import { Shield, Landmark, Bus, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useDashboardStore } from "../store/dashboardStore";

export default function AgencyDashboard() {
  const { pathname } = useLocation();
  const { pressureIndex, risk, predictedWindow, activeLocation, tacticalLogs, addLog } = useDashboardStore();

  const templeTitle = activeLocation ? activeLocation.charAt(0).toUpperCase() + activeLocation.slice(1) : "Somnath";

  let agency = {
    id: "police",
    name: "District Police",
    icon: Shield,
    color: "#1e40af",
    bgColor: "#dbeafe",
    tasks: [
      "Deploy 5 officers to Main Entry Gate (Sector 1)",
      "Activate emergency exit channel 4",
      "Coordinate with Temple Trust for rerouting",
      `Monitor transport arrivals at ${templeTitle} plaza`
    ]
  };

  if (pathname === "/trust") {
    agency = {
      id: "temple",
      name: "Temple Trust",
      icon: Landmark,
      color: "#92400e",
      bgColor: "#fef3c7",
      tasks: [
        "Restrict entry fee collection",
        "Open inner sanctum for faster exit",
        "Stop non-essential temple rituals",
        "Announce safety protocols via PA system"
      ]
    };
  } else if (pathname === "/transport") {
    agency = {
      id: "transport",
      name: "GSRTC Transport",
      icon: Bus,
      color: "#065f46",
      bgColor: "#d1fae5",
      tasks: [
        "Hold all incoming buses at Depot 1",
        "Divert shuttle flow to alternate routes",
        "Increase frequency of departing vehicles",
        "Update arrival board with delay info"
      ]
    };
  }

  useEffect(() => {
    addLog(`Command Channel Initialized for ${templeTitle}`, agency.name);
  }, [addLog, templeTitle, agency.name]);
  const Icon = agency.icon;

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-body text-[#4B2E2B]">
      <DashboardNav templeName={`${templeTitle} - ${agency.name}`} />
      <AlertModal />

      <div className="flex">
        <DashboardSidebar />

        <motion.main className="flex-1 lg:ml-64 p-6 lg:p-8 max-w-screen-2xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: agency.bgColor }}
              >
                <Icon size={32} style={{ color: agency.color }} />
              </div>
              <div>
                <h1 className="text-3xl font-headline font-black tracking-tight">{agency.name} <span className="text-[#C08552]">Channel</span></h1>
                <p className="text-sm text-[#4B2E2B]/50">Real-time coordinated response for pilgrimage safety.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B2E2B]/40">Agency Status</p>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle size={14} /> Connected & Active
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Live Indicators */}
            <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RiskCard />
                <CountdownTimer />
              </div>

              {/* Actionable Instruction Board */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-[#C08552]/15 shadow-sm p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-[#C08552]" size={24} />
                  <h2 className="text-xl font-headline font-bold">Standard Operating Procedures</h2>
                </div>
                
                <div className="space-y-4">
                  {agency.tasks.map((task, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addLog(`Executed: ${task}`, agency.name)}
                      className="flex items-start gap-4 p-4 rounded-xl bg-[#FFF8F0] border border-[#C08552]/10 cursor-pointer hover:bg-[#C08552]/5 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#4B2E2B] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{task}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-blue-800">
                  <Info size={20} className="shrink-0" />
                  <p className="text-xs leading-relaxed">
                    <strong>Coordination Note:</strong> All actions are synchronized across the alertX Network. 
                    Acknowledging an alert here will update the Central Command Center immediately.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Coordination Panel */}
            <div className="space-y-6">
              <AgencyPanel filterId={agency.id} />
              
                <div className="bg-[#4B2E2B] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden h-[400px] flex flex-col">
                   <div className="relative z-10 flex-1 flex flex-col">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Tactical Operational Log</p>
                      <h3 className="text-lg font-headline font-bold mb-4">Activity Stream</h3>
                      
                      <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                         {tacticalLogs.length === 0 ? (
                           <p className="text-xs text-white/30 italic">No actions logged in current session.</p>
                         ) : (
                           tacticalLogs.map((log) => (
                             <motion.div 
                               initial={{ opacity: 0, x: -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               key={log.id} 
                               className="p-3 bg-white/10 rounded-xl border border-white/5"
                             >
                                <div className="flex justify-between items-center mb-1">
                                   <p className="text-[9px] font-bold text-[#C08552]">{log.time}</p>
                                   <p className="text-[9px] font-black uppercase text-white/40">{log.agency}</p>
                                </div>
                                <p className="text-xs text-white/90">{log.action}</p>
                             </motion.div>
                           ))
                         )}
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#C08552]/10 rounded-full blur-3xl" />
                </div>
            </div>
          </div>
          <Footer />
        </motion.main>
      </div>
    </div>
  );
}
