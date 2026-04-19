import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Bus, Shrink, Wind, Cpu } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";

export default function InsightPanel() {
  const { risk, rawData, buildup } = useDashboardStore();

  const getDynamicInsights = () => {
    const list = [];
    
    if (risk === "LOW") {
      list.push({ 
        icon: Cpu, 
        label: "System Nominal", 
        detail: `Density is safe at ${rawData.queue_density_pax_per_m2 || 0} P/m²`, 
        color: "text-emerald-500", 
        bg: "bg-emerald-50" 
      });
      return list;
    }

    // High flow rate insight
    if ((rawData.entry_flow_rate_pax_per_min || 0) > 100) {
      list.push({ 
        icon: TrendingUp, 
        label: "Entry Surge", 
        detail: `High inflow: ${rawData.entry_flow_rate_pax_per_min} pax/min`, 
        color: "text-red-500", 
        bg: "bg-red-50" 
      });
    }

    // Transport insight
    if ((rawData.transport_arrival_burst || 0) > 0) {
        list.push({ 
          icon: Bus, 
          label: "Arrival Burst", 
          detail: `Transport burst of ${rawData.transport_arrival_burst} detected`, 
          color: "text-amber-500", 
          bg: "bg-amber-50" 
        });
    }

    // Buildup insight
    if (buildup === "Genuine") {
        list.push({ 
          icon: Shrink, 
          label: "Critical Buildup", 
          detail: "ML detected legitimate crowd density accumulation", 
          color: "text-red-600", 
          bg: "bg-red-100" 
        });
    }

    // Default if list empty
    if (list.length === 0) {
        list.push({ 
            icon: Cpu, 
            label: "Monitoring...", 
            detail: "Analyzing flow patterns for anomalies", 
            color: "text-[#C08552]", 
            bg: "bg-[#C08552]/10" 
          });
    }

    return list;
  };

  const insights = getDynamicInsights();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl border border-[#C08552]/20 bg-[#FFF8F0] p-6"
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/50 mb-0.5">AI Analysis</p>
        <h3 className="text-lg font-headline font-bold text-[#4B2E2B]">Why Risk Is {risk === "LOW" ? "Low" : "Increasing"}</h3>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={risk + (rawData.timestamp || "")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-2.5"
        >
          {insights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label + i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${item.bg}`}>
                  <Icon size={13} className={item.color} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#4B2E2B]">{item.label}</p>
                  <p className="text-[11px] text-[#4B2E2B]/50 mt-0.5">{item.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 pt-4 border-t border-[#C08552]/10 flex items-center gap-2">
        <Cpu size={12} className="text-[#C08552]" />
        <p className="text-[10px] text-[#4B2E2B]/40 font-body">Powered by Chronos Neural Engine v2.4</p>
      </div>
    </motion.div>
  );
}

