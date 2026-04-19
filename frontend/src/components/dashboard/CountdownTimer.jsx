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
      className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 ${
        isDanger
          ? "bg-red-50 border-red-200 shadow-[0_0_32px_rgba(220,38,38,0.3)]"
          : isCritical
          ? "bg-amber-50 border-amber-200 shadow-[0_0_24px_rgba(217,119,6,0.2)]"
          : isLow
          ? "bg-emerald-50 border-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.1)]"
          : "bg-[#FFF8F0] border-[#C08552]/20"
      }`}
    >
      {/* Critical pulse ring */}
      {isCritical && (
        <span className={`absolute inset-0 rounded-2xl border-2 animate-ping opacity-20 pointer-events-none ${isDanger ? "border-red-400" : "border-amber-400"}`} />
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isCritical && <AlertTriangle size={12} className={isDanger ? "text-red-500" : "text-amber-500"} />}
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/50">
              {isLow ? "System Status" : isCritical ? "⚠ CRITICAL IN" : "Predicted Window"}
            </p>
          </div>
          <motion.div
            key={risk + predictedWindow}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`text-5xl font-headline font-black tracking-tighter tabular-nums ${
              isDanger ? "text-red-600" : isCritical ? "text-amber-600" : isLow ? "text-emerald-600" : "text-[#4B2E2B]"
            }`}
          >
            {isLow ? "SAFE" : `${predictedWindow}m`}
          </motion.div>
          <p className="text-xs text-[#4B2E2B]/40 mt-1 font-body">
            {isLow ? "No immediate threat" : "minutes until threshold"}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
          isDanger ? "bg-red-100 border-red-200" : isCritical ? "bg-amber-100 border-amber-200" : isLow ? "bg-emerald-100 border-emerald-200" : "bg-[#FFF8F0] border-[#C08552]/20"
        }`}>
          <Timer size={22} className={isDanger ? "text-red-500" : isCritical ? "text-amber-500" : isLow ? "text-emerald-500" : "text-[#C08552]"} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full bg-[#4B2E2B]/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors duration-500 ${
            isDanger ? "bg-red-500" : isCritical ? "bg-amber-500" : isLow ? "bg-emerald-500" : "bg-[#C08552]"
          }`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-[10px] text-[#4B2E2B]/40 mt-2 font-body">
        {isLow ? "AI scanning for density shifts" : isCritical ? "Immediate response required" : "ML predicted early-warning window"}
      </p>
    </motion.div>
  );
}
