import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { BarChart2, Shield, Landmark, Bus } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";

export default function DashboardSidebar() {
  const { pathname } = useLocation();
  const { activeLocation, risk } = useDashboardStore();

  const overviewPath = activeLocation ? `/${activeLocation.toLowerCase()}` : "/";

  const getAgencyStatus = (id) => {
    if (risk === "HIGH" || risk === "SEVERE" || risk === "CRITICAL") return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "ACTION NEEDED" };
    if (risk === "MEDIUM") return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "MONITORING" };
    return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "ALL CLEAR" };
  };

  const navItems = [
    { icon: BarChart2, label: "Live Overview", to: overviewPath, desc: "Main Dashboard" },
    { icon: Shield, label: "District Police", to: "/police", id: "police" },
    { icon: Landmark, label: "Temple Trust", to: "/trust", id: "temple" },
    { icon: Bus, label: "GSRTC Hub", to: "/transport", id: "transport" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#FFF8F0] border-r border-[#C08552]/15 pt-8 pb-6 px-4 fixed left-0 top-[73px] bottom-0 z-40">
      <div className="mb-6 px-2">
        <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#4B2E2B]/40">Intelligence Node</p>
        <h2 className="text-xl font-headline font-black text-[#4B2E2B]">{activeLocation}</h2>
      </div>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          const status = item.id ? getAgencyStatus(item.id) : null;
          
          return (
            <Link key={item.label} to={item.to}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col gap-2 p-4 rounded-2xl transition-all duration-200 border ${
                   active 
                   ? "bg-white border-[#C08552] shadow-sm shadow-[#C08552]/10" 
                   : "bg-white/50 border-[#C08552]/10 hover:border-[#C08552]/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${status ? status.bg : "bg-[#C08552]/10"}`}>
                    <Icon size={20} className={status ? status.color : "text-[#C08552]"} />
                  </div>
                  {status && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${status.bg} ${status.border} ${status.color}`}>
                      {status.label}
                    </span>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-headline font-black ${active ? "text-[#4B2E2B]" : "text-[#4B2E2B]/60"}`}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#4B2E2B]/40 font-medium">
                    {item.id ? `Command Channel` : item.desc}
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* 🔴 Simulation Controls 🔴 */}
      <div className="mt-8 pt-6 border-t border-[#C08552]/10 px-2">
        <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#4B2E2B]/40 mb-4">Command Tools</p>
        <button 
           onClick={() => {
             const isForced = !window.__forced_risk;
             window.__forced_risk = isForced;
             useDashboardStore.getState().toggleForceRisk(isForced);
           }}
           className={`w-full p-4 rounded-2xl flex items-center gap-3 border transition-all duration-300 ${
             risk === "SEVERE" || risk === "CRITICAL"
             ? "bg-red-600 border-red-700 text-white shadow-lg shadow-red-200" 
             : "bg-[#4B2E2B] border-[#4B2E2B] text-white hover:bg-black"
           }`}
        >
          <div className={`p-2 rounded-xl bg-white/20 ${risk === "SEVERE" || risk === "CRITICAL" ? "animate-pulse" : ""}`}>
             <BarChart2 size={20} />
          </div>
          <div className="text-left">
             <p className="text-xs font-headline font-black uppercase tracking-tighter">Stress Test AI</p>
             <p className="text-[9px] text-white/60 font-medium">Trigger Near-Crush Demo</p>
          </div>
        </button>
      </div>

      <div className="mt-auto pt-6 border-t border-[#C08552]/10">
        <p className="text-[9px] font-black text-center text-[#4B2E2B]/30 uppercase tracking-[0.2em] mb-1">Authenticated Terminal</p>
        <p className="text-[9px] font-bold text-center text-[#C08552]">ID: AlertX-GJ-0{activeLocation?.length || 0}</p>
      </div>
    </aside>
  );
}
