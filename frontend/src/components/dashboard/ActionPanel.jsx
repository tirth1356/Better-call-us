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
      className="rounded-2xl border border-[#C08552]/20 bg-[#FFF8F0] p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/50 mb-0.5">Recommended Actions</p>
          <h3 className="text-lg font-headline font-bold text-[#4B2E2B]">Response Protocol</h3>
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
          className="space-y-2"
        >
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.01] hover:shadow-md cursor-default ${
                  action.urgent
                    ? "bg-red-50 border-red-100"
                    : "bg-white/60 border-[#C08552]/10"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${action.urgent ? "bg-red-100" : "bg-[#C08552]/10"}`}>
                  <Icon size={15} className={action.urgent ? "text-red-500" : "text-[#C08552]"} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${action.urgent ? "text-red-700" : "text-[#4B2E2B]"}`}>{action.label}</p>
                  <p className="text-[11px] text-[#4B2E2B]/50 mt-0.5">{action.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 pt-2">
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(192,133,82,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleExecute}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-headline font-bold text-sm text-white transition-all duration-200"
          style={{ background: executed ? "#16a34a" : "linear-gradient(135deg, #C08552, #8C5A3C)" }}
        >
          <Zap size={15} />
          {executed ? "Executed ✓" : "Execute Action"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setAcknowledged(true)}
          className={`flex-1 py-3 rounded-xl font-headline font-bold text-sm border transition-all duration-200 ${
            acknowledged
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-white border-[#C08552]/30 text-[#8C5A3C] hover:bg-[#C08552]/5"
          }`}
        >
          {acknowledged ? "Acknowledged ✓" : "Acknowledge"}
        </motion.button>
      </div>
    </motion.div>
  );
}
