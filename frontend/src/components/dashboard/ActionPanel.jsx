import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Siren, BusFront, ShieldOff, Eye, Users, CheckCircle2, Zap } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { getRiskConfig } from "../../utils/riskUtils";

const ACTIONS = {
  HIGH: [
    { icon: Siren, label: "Deploy police immediately", sub: "All available units to Gate 3 & Inner Sanctum", urgent: true },
    { icon: ShieldOff, label: "Stop new entries", sub: "Close all entry gates until density drops", urgent: true },
    { icon: BusFront, label: "Hold incoming buses", sub: "Redirect buses to secondary depot", urgent: false },
  ],
  MEDIUM: [
    { icon: Eye, label: "Monitor inflow closely", sub: "Increase sensor polling to 5s intervals", urgent: false },
    { icon: Users, label: "Prepare response team", sub: "Put 2 units on standby at Gate 1", urgent: false },
  ],
  LOW: [
    { icon: CheckCircle2, label: "Continue normal operations", sub: "All systems nominal — no action required", urgent: false },
  ],
};

export default function ActionPanel() {
  const { risk, addLog } = useDashboardStore();
  const cfg = getRiskConfig(risk);
  const actions = ACTIONS[risk] || ACTIONS.LOW;
  const [executed, setExecuted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleExecute = () => {
    setExecuted(true);
    addLog(`Initiated ${risk} risk response protocol`, "Central Command");
    actions.forEach(action => {
      addLog(`Directive: ${action.label}`, "Central Command");
    });
    setTimeout(() => setExecuted(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-[2.5rem] border border-[#C08552]/20 bg-white p-8 flex flex-col justify-between h-full shadow-xl shadow-[#C08552]/5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#4B2E2B]/40 mb-1">Response Protocol</p>
          <h3 className="text-xl font-headline font-black text-[#4B2E2B]">Tactical Directives</h3>
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text} uppercase tracking-widest`}>
          {risk}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={risk}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 flex-1"
        >
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 hover:bg-white/80 group ${
                  action.urgent
                    ? "bg-red-50 border-red-100"
                    : "bg-[#FFF8F0]/40 border-[#C08552]/10"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${action.urgent ? "bg-red-100 shadow-sm" : "bg-white border border-[#C08552]/10"}`}>
                  <Icon size={16} className={action.urgent ? "text-red-500" : "text-[#C08552]"} strokeWidth={2.5} />
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-tight ${action.urgent ? "text-red-700" : "text-[#4B2E2B]"}`}>{action.label}</p>
                  <p className="text-[10px] text-[#4B2E2B]/50 mt-1 font-bold leading-relaxed">{action.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-3 mt-8">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExecute}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-headline font-black text-xs uppercase tracking-[0.2em] text-white transition-all duration-300 shadow-lg"
          style={{ background: executed ? "#16a34a" : "linear-gradient(135deg, #4B2E2B, #2d1b19)" }}
        >
          <Zap size={14} fill="currentColor" />
          {executed ? "Protocol Initiated" : "Execute Force Protocol"}
        </motion.button>
        <button
          onClick={() => setAcknowledged(true)}
          className={`py-4 rounded-2xl font-headline font-black text-xs uppercase tracking-[0.2em] border transition-all duration-300 ${
            acknowledged
              ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm"
              : "bg-white border-[#C08552]/20 text-[#4B2E2B] hover:bg-[#C08552]/5"
          }`}
        >
          {acknowledged ? "Signals Acknowledged" : "Acknowledge Command"}
        </button>
      </div>
    </motion.div>
  );
}
