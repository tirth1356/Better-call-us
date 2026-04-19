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
      whileHover={{ y: -4, shadow: "0 12px 30px rgba(75,46,43,0.08)" }}
      className={`bg-white rounded-[2rem] p-6 border border-[#C08552]/10 cursor-pointer transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${style.bar} animate-pulse`} />
           <h4 className="text-sm font-headline font-black text-[#4B2E2B] tracking-tight">{name}</h4>
        </div>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${style.badge}`}>
          {risk}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[9px] text-[#4B2E2B]/40 font-black uppercase tracking-widest">Kinetic Area Load</span>
            <span className="text-[10px] font-black text-[#4B2E2B]">{typeof density === 'number' ? density.toFixed(1) : density} <span className="opacity-40">P/m²</span></span>
          </div>
          <div className="h-1 w-full bg-[#4B2E2B]/5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${style.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${densityPct}%` }}
              transition={{ duration: 1, ease: "circOut", delay: index * 0.08 }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#C08552]/5">
          <span className="text-[9px] text-[#4B2E2B]/40 font-black uppercase tracking-widest">Time to Threshold</span>
          <span className={`text-sm font-black font-headline ${risk === "CRITICAL" || risk === "HIGH" ? "text-red-600" : risk === "MEDIUM" ? "text-amber-600" : "text-[#C08552]"}`}>
            {crushWindow}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
