import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useDashboardStore } from "../../store/dashboardStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur border border-[#C08552]/20 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-bold text-[#4B2E2B] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#4B2E2B]/60 capitalize">{p.name || p.dataKey}:</span>
          <span className="font-bold text-[#4B2E2B]">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function GraphSection() {
  const { graphData, rawData, riskPercent, confidence, buildup } = useDashboardStore();
  
  const netFlow = (rawData.entry_flow_rate_pax_per_min || 0) - (rawData.exit_flow_rate_pax_per_min || 0);
  const capacityLoad = ((rawData.queue_density_pax_per_m2 || 0) / 8.0) * 100; // Assuming 8p/m2 is max

  return (
    <div className="space-y-6">
      {/* Chart 1: Full Width Pressure & Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-[#C08552]/15 bg-white p-8 shadow-sm"
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#4B2E2B]/40 mb-1">Observation Core</p>
            <h3 className="text-xl font-headline font-black text-[#4B2E2B]">Tactical Pressure & ML Predictive Forecast</h3>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-[#C08552]/40" />
                <span className="text-[10px] font-black text-[#4B2E2B]/50 uppercase tracking-widest">Pressure</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C08552]" />
                <span className="text-[10px] font-black text-[#C08552] uppercase tracking-widest">AI Forecast</span>
             </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C08552" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#DC2626" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#C0855220" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis tick={{ fontSize: 10, fill: "#4B2E2B40", fontWeight: 800 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="real_cpi" name="Pressure" stroke="#4B2E2B20" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="pred_cpi" name="ML Prediction" stroke="url(#riskGrad)" strokeWidth={4} dot={false} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Analysis Matrices Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Net Flow Variance", value: `${netFlow > 0 ? '+' : ''}${netFlow.toFixed(1)}`, unit: "pax/min", desc: "Current entry-exit delta" },
           { label: "Capacity Load", value: `${Math.min(100, capacityLoad).toFixed(1)}`, unit: "%", desc: "Surface area utilization" },
           { label: "Inference Confidence", value: confidence, unit: "%", desc: "ML result reliability" }
         ].map((m, i) => (
           <motion.div
             key={m.label}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white rounded-3xl border border-[#C08552]/15 p-6 shadow-sm"
           >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4B2E2B]/40 mb-3">{m.label}</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-headline font-black text-[#4B2E2B]">{m.value}</span>
                 <span className="text-xs font-bold text-[#C08552]">{m.unit}</span>
              </div>
              <p className="text-[10px] text-[#4B2E2B]/40 mt-2 font-medium">{m.desc}</p>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
