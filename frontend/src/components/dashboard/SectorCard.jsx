import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const RISK_STYLES = {
  CRITICAL: { badge: "bg-red-100 text-red-600 border-red-200", bar: "bg-red-500", border: "border-l-red-400", glow: "hover:shadow-[0_8px_24px_rgba(220,38,38,0.15)]" },
  HIGH:     { badge: "bg-red-100 text-red-600 border-red-200", bar: "bg-red-500", border: "border-l-red-400", glow: "hover:shadow-[0_8px_24px_rgba(220,38,38,0.15)]" },
  MEDIUM:   { badge: "bg-amber-100 text-amber-600 border-amber-200", bar: "bg-amber-500", border: "border-l-amber-400", glow: "hover:shadow-[0_8px_24px_rgba(217,119,6,0.15)]" },
  LOW:      { badge: "bg-[#C08552]/10 text-[#C08552] border-[#C08552]/20", bar: "bg-[#C08552]", border: "border-l-[#C08552]", glow: "hover:shadow-[0_8px_24px_rgba(192,133,82,0.15)]" },
};

export default function SectorCard({ name, risk, window: crushWindow, density, index = 0 }) {
  const style = RISK_STYLES[risk] || RISK_STYLES.LOW;
  const densityPct = Math.min(100, Math.round((density || 0) * 20));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-2xl p-5 border border-[#C08552]/10 border-l-4 ${style.border} cursor-pointer transition-shadow duration-300 ${style.glow}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-[#C08552]/60" />
          <h4 className="text-sm font-headline font-bold text-[#4B2E2B]">{name}</h4>
        </div>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${style.badge}`}>
          {risk}
        </span>
      </div>

      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-[#4B2E2B]/40 font-bold uppercase tracking-wider">Density</span>
            <span className="text-[10px] font-bold text-[#4B2E2B]">{typeof density === 'number' ? density.toFixed(2) : density} P/m²</span>
          </div>
          <div className="h-1.5 w-full bg-[#4B2E2B]/8 rounded-full overflow-hidden bg-[#4B2E2B]/10">
            <motion.div
              className={`h-full rounded-full ${style.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${densityPct}%` }}
              transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.08 + 0.2 }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-[10px] text-[#4B2E2B]/40 font-bold uppercase tracking-wider">Crush Window</span>
          <span className={`text-xs font-black font-headline ${risk === "CRITICAL" || risk === "HIGH" ? "text-red-600" : risk === "MEDIUM" ? "text-amber-600" : "text-[#C08552]"}`}>
            {typeof crushWindow === 'number' ? `${crushWindow.toFixed(2)}m` : crushWindow}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
