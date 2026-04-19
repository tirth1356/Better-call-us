import { motion } from "framer-motion";
import { Shield, Building2, Bus, CheckCircle2, Clock } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { getAgencyConfig } from "../../utils/riskUtils";

const ICONS = { police: Shield, temple: Building2, transport: Bus };

export default function AgencyPanel() {
  const { agencies, alerts, acknowledgeAlert, aiCoordination } = useDashboardStore();

  // Get the most recent critical alert to acknowledge
  const activeAlertId = alerts.find(a => a.status === "Active")?.id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border border-[#C08552]/20 bg-[#FFF8F0] p-6"
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/50 mb-0.5">AI Coordination Hub</p>
        <h3 className="text-lg font-headline font-bold text-[#4B2E2B]">Agency Directives</h3>
      </div>

      <div className="space-y-3">
        {agencies.map((agency, i) => {
          const cfg = getAgencyConfig(agency.status);
          const Icon = ICONS[agency.id] || Shield;
          
          // Get instruction from AI or fallback
          const aiInstruction = aiCoordination ? (
              agency.id === "police" ? aiCoordination.police :
              agency.id === "temple" ? aiCoordination.temple :
              agency.id === "transport" ? aiCoordination.transport : 
              agency.action
          ) : agency.action;

          // Find acknowledgment info for this agency in the latest alert
          const latestAlert = alerts[0];
          const ackInfo = latestAlert?.acknowledgments?.find(ack => ack.agency === agency.id);
          const responseTime = ackInfo ? 
            Math.round((new Date(ackInfo.ack_time) - new Date(latestAlert.startTime)) / 1000) 
            : null;

          return (
            <motion.div
              key={agency.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.015, boxShadow: "0 4px 20px rgba(75,46,43,0.08)" }}
              onClick={() => activeAlertId && acknowledgeAlert(activeAlertId, agency.id)}
              className={`flex items-center gap-4 p-4 rounded-xl bg-white border-l-4 border border-[#C08552]/10 cursor-pointer transition-all duration-200 ${cfg.border} ${!activeAlertId && agency.status !== "completed" ? "opacity-60 grayscale" : ""}`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#C08552]/10 flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-[#8C5A3C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#4B2E2B] truncate">{agency.label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-[11px] text-[#4B2E2B]/50 truncate mt-0.5 italic">{aiInstruction}</p>
                    {responseTime !== null && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            <Clock size={8} /> {responseTime}s
                        </span>
                    )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {agency.status === "completed" ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                    <>
                        <motion.div
                          animate={{ scale: agency.status === "active" ? [1, 1.3, 1] : 1 }}
                          transition={{ repeat: agency.status === "active" ? Infinity : 0, duration: 1.2 }}
                          className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`}
                        />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${cfg.text}`}>{cfg.label}</span>
                    </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-[10px] text-[#4B2E2B]/30 mt-3 text-center">
          {activeAlertId ? "Click card to acknowledge live alert" : "No active alerts to coordinate"}
      </p>
    </motion.div>
  );
}
