import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Timer, AlertTriangle } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { useCountdown } from "../../hooks/useCountdown";
import { formatTime } from "../../utils/riskUtils";

export default function CountdownTimer() {
  const { risk, predictedWindow, timeTocrushSeconds } = useDashboardStore();
  const controls = useAnimation();
  
  const isLow = risk === "LOW" || risk === "Low";
  const isMedium = risk === "MEDIUM" || risk === "Moderate";
  const isHigh = risk === "HIGH" || risk === "High" || risk === "Severe" || risk === "Critical";
  
  const isCritical = timeTocrushSeconds < 10 * 60 && !isLow;
  const isDanger = timeTocrushSeconds < 5 * 60 && !isLow;

  // Shake every 10s when critical
  useEffect(() => {
    if (!isCritical) return;
    const id = setInterval(() => {
      controls.start({
        x: [0, -4, 4, -4, 4, 0],
        transition: { duration: 0.4 },
      });
    }, 10000);
    return () => clearInterval(id);
  }, [isCritical, controls]);

  const totalSeconds = 42 * 60;
  const progress = isLow ? 100 : Math.max(0, (timeTocrushSeconds / totalSeconds) * 100);

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`relative overflow-hidden rounded-[2.5rem] p-8 border transition-all duration-500 flex flex-col justify-between h-full ${
        isDanger
          ? "bg-red-50 border-red-200 shadow-2xl shadow-red-200/50"
          : isCritical
          ? "bg-amber-50 border-amber-200 shadow-xl shadow-amber-200/30"
          : isLow
          ? "bg-emerald-50 border-emerald-200 shadow-xl shadow-emerald-200/20"
          : "bg-white border-[#C08552]/20 shadow-xl shadow-[#C08552]/5"
      }`}
    >
      {/* Critical pulse ring */}
      {isCritical && (
        <span className={`absolute inset-0 rounded-[2.5rem] border-2 animate-ping opacity-10 pointer-events-none ${isDanger ? "border-red-400" : "border-amber-400"}`} />
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isCritical && <AlertTriangle size={12} className={isDanger ? "text-red-500" : "text-amber-500"} />}
            <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#4B2E2B]/40">
              {isLow ? "System Status" : isCritical ? "⚠ Critical Delay" : "Prediction Window"}
            </p>
          </div>
          <motion.div
            key={risk + predictedWindow}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-5xl font-headline font-black tracking-tighter tabular-nums leading-none ${
              isDanger ? "text-red-600" : isCritical ? "text-amber-600" : isLow ? "text-emerald-600" : "text-[#4B2E2B]"
            }`}
          >
            {isLow ? "SAFE" : `${predictedWindow}m`}
          </motion.div>
          <p className="text-[11px] font-bold text-[#4B2E2B]/50 mt-2 uppercase tracking-wide">
            {isLow ? "Nominal Dynamic Flow" : "Minutes to density threshold"}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${
          isDanger ? "bg-red-100 border-red-200" : isCritical ? "bg-amber-100 border-amber-200" : isLow ? "bg-emerald-100 border-emerald-200" : "bg-white border-[#C08552]/20"
        }`}>
          <Timer size={20} className={isDanger ? "text-red-500" : isCritical ? "text-amber-500" : isLow ? "text-emerald-500" : "text-[#C08552]"} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-8">
        <div className="h-1.5 w-full bg-[#4B2E2B]/5 rounded-full overflow-hidden border border-[#4B2E2B]/5">
            <motion.div
            className={`h-full rounded-full transition-colors duration-500 ${
                isDanger ? "bg-red-500" : isCritical ? "bg-amber-500" : isLow ? "bg-emerald-500" : "bg-[#C08552]"
            }`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            />
        </div>
        <p className="text-[9px] text-[#4B2E2B]/40 mt-4 font-black uppercase tracking-widest text-center">
            {isLow ? "AI scanning for kinetic shifts" : isCritical ? "Immediate evacuation protocol advised" : "ML predicted early-warning window"}
        </p>
      </div>
    </motion.div>
  );
}
