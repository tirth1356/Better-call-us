import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, ShieldEllipsis } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { getRiskConfig } from "../../utils/riskUtils";

const icons = { HIGH: ShieldAlert, MEDIUM: ShieldEllipsis, LOW: ShieldCheck };

export default function RiskCard() {
  const { risk, riskPercent, confidence } = useDashboardStore();
  const cfg = getRiskConfig(risk);
  const Icon = icons[risk] || ShieldCheck;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl p-6 border ${cfg.bg} ${cfg.border} ${cfg.glow} transition-shadow duration-500`}
    >
      {/* Pulse ring for HIGH */}
      {cfg.pulse && (
        <span className="absolute inset-0 rounded-2xl border-2 border-red-400 animate-ping opacity-20 pointer-events-none" />
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/50 mb-1">Global Risk Level</p>
          <motion.h3
            key={risk}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`text-4xl font-headline font-black tracking-tight ${cfg.text}`}
          >
            {cfg.label}
          </motion.h3>
          <p className="text-xs text-[#4B2E2B]/50 mt-1 font-body">
            {risk === "HIGH" ? "Immediate action required" : risk === "MEDIUM" ? "Monitor closely" : "Low probability of congestion"}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}>
          <Icon size={22} className={cfg.text} strokeWidth={2} />
        </div>
      </div>

      {/* Risk percentage */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4B2E2B]/40">Risk Index</span>
          <motion.span
            key={riskPercent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-black font-headline ${cfg.text}`}
          >
            {riskPercent}%
          </motion.span>
        </div>
        <div className="h-2 w-full bg-[#4B2E2B]/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${cfg.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${riskPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Confidence */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4B2E2B]/40">Confidence</span>
          <span className="text-[10px] font-bold text-[#8C5A3C]">{confidence}%</span>
        </div>
        <div className="h-1 w-full bg-[#4B2E2B]/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#C08552]/60"
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
