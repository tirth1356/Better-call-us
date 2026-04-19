import { motion } from "framer-motion";
import { Shield, Building2, Bus, CheckCircle2, Clock, AlertTriangle, Check, X as XIcon } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { useState } from "react";

const ICONS = { police: Shield, temple: Building2, transport: Bus };

export default function AgencyPanel({ filterId }) {
  const { agencies, risk, pressureIndex, alerts, addLog, aiCoordination } = useDashboardStore();
  
  // Local state to track which actions have been accepted (yes) or rejected (no)
  const [decisions, setDecisions] = useState({});

  const handleDecision = (agencyId, decision, instruction) => {
    setDecisions(prev => ({ ...prev, [agencyId]: { decision, instruction, time: new Date().toLocaleTimeString() } }));
    
    if (decision === 'yes') {
      addLog(`Action Execution Confirmed: ${instruction} to mitigate risk.`, agencyId.toUpperCase());
    } else {
      addLog(`Action REJECTED by Commander. Standby for alternative.`, agencyId.toUpperCase());
    }
  };

  const isSafe = risk !== "High" && risk !== "Critical";
  
  const displayedAgencies = filterId ? agencies.filter(a => a.id === filterId) : agencies;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-[2.5rem] border border-[#C08552]/20 bg-white p-8 shadow-xl relative overflow-hidden h-full flex flex-col"
    >
      {/* Current Scenario Header */}
      <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-[#C08552]/10 gap-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#4B2E2B]/40 mb-1">{filterId ? 'Sector Command' : 'Cross-Agency operations'}</p>
            <h3 className="text-2xl font-headline font-black text-[#4B2E2B] tracking-tight">{filterId ? 'Live Action Board' : 'Intelligence Integration'}</h3>
          </div>
          <div className={`px-5 py-3 rounded-2xl border flex items-center justify-center gap-4 transition-colors duration-500 shadow-sm ${isSafe ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              {isSafe ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertTriangle size={18} className="text-red-500 animate-pulse" />}
              <div>
                  <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${isSafe ? 'text-emerald-600' : 'text-red-600'}`}>{isSafe ? 'Scenario: Nominal' : 'Scenario: Alert Active'}</p>
                  <p className="text-xs font-black text-[#4B2E2B] mt-0.5">{pressureIndex} CPI Core Load</p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1">
        {displayedAgencies.map((agency, i) => {
          const Icon = ICONS[agency.id] || Shield;
          const aiInstruction = aiCoordination ? (
              agency.id === "police" ? aiCoordination.police :
              agency.id === "temple" ? aiCoordination.temple :
              agency.id === "transport" ? aiCoordination.transport : 
              agency.action
          ) : agency.action;

          const decisionObj = decisions[agency.id];

          return (
            <motion.div
              key={agency.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-[2rem] bg-[#FFF8F0]/40 border border-[#C08552]/10 flex flex-col gap-4 group hover:bg-white transition-all shadow-sm"
            >
              {/* Sector Identity */}
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-white border border-[#C08552]/15 flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                   <Icon size={16} className="text-[#8C5A3C]" strokeWidth={2.5} />
                 </div>
                 <p className="text-xs font-black text-[#4B2E2B] uppercase tracking-widest">{agency.label}</p>
              </div>

              {/* Status Board */}
              <div className="bg-white/80 rounded-2xl p-4 border border-[#C08552]/5">
                  {!decisionObj ? (
                      <div className="space-y-4">
                          <div>
                              <p className="text-[9px] font-black text-[#4B2E2B]/30 uppercase tracking-[0.2em] mb-2">Protocol Directive:</p>
                              <p className="text-sm font-bold text-[#4B2E2B] leading-snug">{aiInstruction}</p>
                          </div>
                          
                          <div className="flex gap-2">
                              <button 
                                onClick={() => handleDecision(agency.id, 'yes', aiInstruction)}
                                className="flex-1 py-3 bg-[#4B2E2B] hover:bg-[#2d1b19] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                              >
                                  Execute
                              </button>
                              <button 
                                onClick={() => handleDecision(agency.id, 'no', aiInstruction)}
                                className="px-4 py-3 bg-white border border-stone-200 text-stone-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-stone-50"
                              >
                                  Ignore
                              </button>
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col gap-3">
                          {decisionObj.decision === 'yes' ? (
                             <div className="flex items-start gap-3 text-emerald-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                 <Check size={14} className="mt-0.5 shrink-0" strokeWidth={3} />
                                 <p className="text-[11px] font-bold leading-tight">Confirmed tactical execution at {decisionObj.time}. Mitigation sequence initiated.</p>
                             </div>
                          ) : (
                             <div className="flex items-start gap-3 text-red-700 bg-red-50/50 p-3 rounded-xl border border-red-100">
                                 <XIcon size={14} className="mt-0.5 shrink-0" strokeWidth={3} />
                                 <p className="text-[11px] font-bold leading-tight">Commander override: Strategic ignore at {decisionObj.time}.</p>
                             </div>
                          )}
                          <button 
                            onClick={() => { const newDecisions = {...decisions}; delete newDecisions[agency.id]; setDecisions(newDecisions); }}
                            className="self-center text-[8px] uppercase font-black tracking-widest text-[#4B2E2B]/30 hover:text-[#4B2E2B] hover:underline transition-all"
                          >
                              Reset Choice
                          </button>
                      </div>
                  )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
