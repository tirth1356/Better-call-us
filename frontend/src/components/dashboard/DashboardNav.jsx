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
    <header className="sticky top-0 z-50 w-full bg-[#FFF8F0]/90 backdrop-blur-xl border-b border-[#C08552]/15 shadow-[0_2px_24px_rgba(75,46,43,0.06)]">
      <div className="flex items-center justify-between px-6 lg:px-10 py-4 max-w-screen-2xl mx-auto">

        {/* Left — Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="w-10 h-10 rounded-xl border border-[#C08552]/20 flex items-center justify-center hover:bg-stone-100 transition-colors shadow-sm group">
            <span className="material-symbols-outlined text-[#8C5A3C] group-hover:scale-110 transition-transform">home</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C08552] to-[#8C5A3C] flex items-center justify-center">
              <span className="text-white text-xs font-black">CO</span>
            </div>
            <span className="text-base font-headline font-black text-[#4B2E2B] tracking-tight hidden sm:block">
              Chronos Observatory
            </span>
          </Link>
        </div>

        {/* Center — Temple + Risk badge */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/40">Active Site</p>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-headline font-black text-[#4B2E2B]">{templeName}</h1>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${cfg.bg} ${cfg.border} ${cfg.text}`}>
              {risk}
            </span>
          </div>
        </div>

        {/* Right — Live indicator + controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* LIVE dot */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"
            />
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">LIVE</span>
          </div>

          {/* Global Controls */}
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
              className={`flex items-center gap-2 text-[10px] font-black px-4 py-1.5 rounded-xl transition-all shadow-md active:scale-95 ${showHistory ? 'bg-primary text-white' : 'bg-[#8C5A3C] text-white hover:bg-[#4B2E2B]'}`}
            >
              <span className="material-symbols-outlined text-sm">history</span>
              {showHistory ? "CLOSE REPLAY" : "MISSION REPLAY"}
            </button>
            <button
              onClick={() => { simulateNormal(); resetSimulation(); }}
              className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-[#C08552]/10 text-[#8C5A3C] hover:bg-[#C08552]/20 transition-colors uppercase tracking-wider"
            >
              Reset
            </button>
          </div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-9 h-9 rounded-xl bg-white border border-[#C08552]/20 flex items-center justify-center hover:border-[#C08552]/40 transition-colors"
          >
            <Bell size={15} className="text-[#8C5A3C]" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                {unread}
              </span>
            )}
          </motion.button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C08552] to-[#8C5A3C] flex items-center justify-center border border-[#C08552]/30">
            <User size={15} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
