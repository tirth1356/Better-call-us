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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-[2.5rem] p-10 premium-glass border transition-all duration-700 flex flex-col justify-between h-full group ${cfg.border} shadow-2xl shadow-[#4B2E2B]/5`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Pulse ring for HIGH */}
      {cfg.pulse && (
        <span className="absolute inset-0 rounded-[2.5rem] border-2 border-red-500/20 animate-ping pointer-events-none" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-[#4B2E2B]/30 mb-4 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.bar} animate-pulse shadow-sm`} /> 
            Live Risk Audit
          </p>
          <motion.h3
            key={risk}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-6xl font-headline font-black tracking-tighter leading-none mb-3 ${cfg.text}`}
          >
            {cfg.label}
          </motion.h3>
          <p className="text-[10px] font-black text-[#4B2E2B]/50 uppercase tracking-[0.2em] max-w-[180px] leading-relaxed">
            {risk === "HIGH" ? "Immediate Corridor Lockdown Response" : risk === "MEDIUM" ? "Escalated Neural Vigilance Mode" : "Nominal Tracking Ingress Active"}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/60 border border-white/80 shadow-sm group-hover:rotate-6 group-hover:scale-110 transition-all`}>
          <Icon size={24} className={cfg.text} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-12 space-y-6 relative z-10">
        {/* Risk percentage */}
        <div>
          <div className="flex justify-between items-end mb-3 px-1">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4B2E2B]/40">Risk Magnitude</span>
            <motion.span
              key={riskPercent}
              className={`text-base font-black font-headline ${cfg.text} tracking-tight`}
            >
              {riskPercent}<span className="text-[10px] opacity-40 ml-0.5">%</span>
            </motion.span>
          </div>
          <div className="h-2 w-full bg-[#4B2E2B]/5 rounded-full overflow-hidden border border-[#4B2E2B]/5 p-[2px]">
            <motion.div
              className={`h-full rounded-full ${cfg.bar} shadow-sm`}
              initial={{ width: 0 }}
              animate={{ width: `${riskPercent}%` }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex justify-between items-end mb-3 px-1">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4B2E2B]/40">Inference Hub Trust</span>
            <span className="text-[10px] font-black text-primary tracking-widest">{confidence}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#4B2E2B]/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary/40 shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1.8, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
