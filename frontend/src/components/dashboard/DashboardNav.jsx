import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { getRiskConfig } from "../../utils/riskUtils";

export default function DashboardNav({ templeName = "Ambaji Temple" }) {
  const { risk, alerts, simulateEscalation, simulateNormal, resetSimulation, showHistory, setShowHistory } = useDashboardStore();
  const cfg = getRiskConfig(risk);
  const unread = alerts.filter((a) => a.type === "critical").length;

  return (
    <nav className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="relative overflow-hidden rounded-full border border-white/30 bg-[rgba(255,248,241,0.36)] px-4 py-2.5 shadow-[0_18px_45px_rgba(75,46,43,0.12)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.28),rgba(255,255,255,0.06)_35%,rgba(192,133,82,0.12)_100%)]" />
          
          <div className="relative flex items-center justify-between gap-3">
            {/* Left — Brand */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/25 text-[#4B2E2B] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:bg-white/40 transition-all">
                <span className="material-symbols-outlined text-[1.4rem]">home</span>
              </Link>
              
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#4B2E2B] flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">AX</span>
                </div>
                <span className="text-sm font-headline font-black text-[#4B2E2B] tracking-tight hidden md:block">
                  alertX
                </span>
              </Link>
            </div>

            {/* Center — Temple + Risk badge */}
            <div className="flex flex-col items-center">
              <p className="text-[8px] font-black tracking-[0.2em] uppercase text-[#4B2E2B]/40">Active Site</p>
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-headline font-black text-[#4B2E2B] truncate max-w-[120px]">{templeName}</h1>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                  {risk}
                </span>
              </div>
            </div>

            {/* Right — Controls */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex gap-2">
                <button 
                  onClick={() => {
                    setShowHistory(!showHistory);
                    if (!showHistory) {
                      setTimeout(() => {
                        document.getElementById('replay-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className={`flex items-center gap-2 text-[9px] font-black px-4 py-2 rounded-full transition-all active:scale-95 ${showHistory ? 'bg-[#4B2E2B] text-white shadow-lg' : 'bg-white/40 text-[#4B2E2B] border border-white/30 hover:bg-white/60'}`}
                >
                  <span className="material-symbols-outlined text-sm">history</span>
                  {showHistory ? "CLOSE REPLAY" : "REPLAY"}
                </button>
                <button
                  onClick={() => { simulateNormal(); resetSimulation(); }}
                  className="text-[9px] font-black px-4 py-2 rounded-full bg-white/40 text-[#4B2E2B] border border-white/30 hover:bg-white/60 transition-all uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>

              {/* LIVE dot */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500 text-white shadow-lg shadow-red-200">
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-white"
                />
                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">LIVE</span>
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-9 h-9 rounded-full bg-white/40 border border-white/30 flex items-center justify-center hover:bg-white/60 transition-all"
              >
                <Bell size={14} className="text-[#4B2E2B]" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </motion.button>

              {/* Avatar placeholder */}
              <div className="w-9 h-9 rounded-full bg-[#4B2E2B] flex items-center justify-center shadow-lg">
                <User size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
