import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ReplayMode() {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && currentIndex < events.length - 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1000);
    } else if (currentIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, events]);

  const currentEvent = events[currentIndex] || { 
      cpi: 0, 
      predicted_cpi: 0, 
      risk: "Stable", 
      predicted_window_min: 0,
      raw_data: { timestamp: "00:00:00" } 
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-headline text-2xl text-[#855324]">Loading Archive...</div>;

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col overflow-hidden">
      <header className="bg-[#fff8f1]/80 backdrop-blur-md flex justify-between items-center px-12 py-6 w-full fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#855324] text-3xl">architecture</span>
          <h1 className="text-2xl font-bold tracking-tighter text-[#855324] font-headline">Sentinel Predictor</h1>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-[#835335] opacity-70 hover:bg-[#e8e1da] px-3 py-1 rounded-lg transition-all font-bold">Mission Overview</Link>
          <Link to="/replay" className="bg-[#855324] text-white px-4 py-2 rounded-xl shadow-lg font-bold">Mission Replay</Link>
        </nav>
      </header>

      <main className="flex-1 pt-24 flex flex-col md:flex-row relative">
        <aside className="fixed left-0 top-0 h-full w-80 flex flex-col p-8 gap-8 bg-[#fdfaf6] border-r border-[#C08552]/10 z-40 pt-32">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#855324] mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Telemetry Snapshot
            </h2>
            <div className="space-y-4">
                {[
                  { label: "Pressure Index", val: currentEvent.cpi, icon: "compress" },
                  { label: "Surge Risk", val: currentEvent.risk, icon: "warning", color: currentEvent.risk === 'High' || currentEvent.risk === 'Severe' || currentEvent.risk === 'Critical' ? 'text-red-600' : 'text-green-600' },
                  { label: "Window to Crush", val: `${currentEvent.predicted_window_min}m`, icon: "timer" },
                  { label: "Model Confidence", val: currentEvent.confidence, icon: "verified" }
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-2xl bg-white border border-[#C08552]/10 shadow-sm transition-all hover:border-primary/30">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] uppercase font-black text-[#855324]/40">{stat.label}</p>
                        <span className="material-symbols-outlined text-xs text-[#855324]/30">{stat.icon}</span>
                      </div>
                      <p className={`text-2xl font-headline font-black ${stat.color || 'text-[#4B2E2B]'}`}>{stat.val}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-auto">
             <div className="p-6 rounded-[2rem] bg-[#4B2E2B] text-white">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4 text-center">Export Analysis</p>
                <div className="grid grid-cols-1 gap-2">
                   <button className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black uppercase tracking-widest transition-all">PDF Report</button>
                   <button className="py-3 rounded-xl bg-primary hover:bg-primary-dark text-xs font-black uppercase tracking-widest transition-all">Incident Data</button>
                </div>
             </div>
          </div>
        </aside>

        <section className="flex-1 ml-0 md:ml-80 p-8 lg:p-12 pb-32">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#855324]/10 text-[#855324] text-[10px] font-black uppercase tracking-widest mb-4">
                   <span className="material-symbols-outlined text-sm">history</span> Post-Mortem Analytics
                </div>
                <h2 className="text-6xl font-headline font-black text-[#4B2E2B] tracking-tight">Mission <span className="text-[#855324]">Post-Mortem</span></h2>
                <p className="text-[#855324]/60 mt-2 font-bold tracking-widest text-xs uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">event</span> Log Sequence: {currentIndex + 1} / {events.length} · 
                  <span className="material-symbols-outlined text-sm ml-2">schedule</span> {currentEvent.raw_data?.timestamp ? new Date(currentEvent.raw_data.timestamp).toLocaleTimeString() : 'N/A'}
                </p>
              </div>
              
              <div className="flex items-center gap-6 bg-[#f9f3eb] p-4 rounded-3xl border border-[#C08552]/10">
                 <div>
                    <p className="text-[10px] font-black text-[#855324]/40 uppercase text-right mb-1">Playback Control</p>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                         className="w-10 h-10 rounded-full border border-[#855324]/20 flex items-center justify-center hover:bg-white transition-all"
                       >
                          <span className="material-symbols-outlined">first_page</span>
                       </button>
                       <button 
                         onClick={() => setIsPlaying(!isPlaying)}
                         className="w-14 h-10 bg-[#855324] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                       >
                          <span className="material-symbols-outlined">{isPlaying ? "pause" : "play_arrow"}</span>
                       </button>
                       <button 
                         onClick={() => setCurrentIndex(Math.min(events.length - 1, currentIndex + 1))}
                         className="w-10 h-10 rounded-full border border-[#855324]/20 flex items-center justify-center hover:bg-white transition-all"
                       >
                          <span className="material-symbols-outlined">last_page</span>
                       </button>
                    </div>
                 </div>
              </div>
            </div>

            <div className="relative aspect-[21/9] bg-[#1e1b17] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white mb-12 group">
                {/* Visualizer Frame */}
                <div className="absolute inset-0 p-12 flex items-end">
                    <div className="w-full">
                       <div className="flex justify-between items-end mb-8 relative z-10">
                          <div>
                             <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4 underline underline-offset-8 decoration-primary">Live Topology Heatmap</p>
                             <div className="flex items-baseline gap-4">
                                <h3 className="text-white text-8xl font-headline font-black leading-none">{currentEvent.cpi}</h3>
                                <span className={`text-2xl font-black italic ${currentEvent.buildup === 'Genuine' ? 'text-red-500' : 'text-blue-400'}`}>
                                   {currentEvent.buildup === 'Genuine' ? 'RISK' : 'NORMAL'}
                                </span>
                             </div>
                          </div>
                          
                          <div className="text-right">
                             <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">ML Decision Audit</p>
                             <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 max-w-sm text-left">
                                <p className="text-primary text-[10px] font-black uppercase mb-2">Agency Directive</p>
                                <p className="text-white/80 text-sm leading-relaxed font-body italic">
                                   "{currentEvent.ai_coordination?.alert_summary || "Observing nominal flow dynamics. No immediate intervention required."}"
                                </p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={false}
                            animate={{ width: `${(currentIndex / (events.length - 1)) * 100}%` }}
                            className="absolute inset-0 bg-primary"
                          />
                       </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                <div className="absolute top-12 right-12 flex gap-2">
                   {["HD", "REC", "LMS"].map(tag => (
                      <span key={tag} className="px-2 py-1 rounded bg-red-600 text-white text-[8px] font-black">{tag}</span>
                   ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-[#C08552]/10 shadow-xl overflow-hidden relative">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full" />
                  <h4 className="text-xl font-headline font-black text-[#4B2E2B] mb-8 uppercase flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">analytics</span> Telemetry Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-8">
                     {[
                        { label: "Entry Pulse", val: currentEvent.raw_data?.entry_flow_rate_pax_per_min?.toFixed(1) || "0.0", unit: "pax/m" },
                        { label: "Density Sat", val: currentEvent.raw_data?.queue_density_pax_per_m2?.toFixed(2) || "0.0", unit: "p/m²" },
                        { label: "Transport Load", val: currentEvent.raw_data?.transport_arrival_burst || "0", unit: "pax" },
                        { label: "Flow Velocity", val: (currentEvent.cpi / 2.5).toFixed(1), unit: "m/s" }
                     ].map(item => (
                        <div key={item.label}>
                           <p className="text-[10px] font-black text-[#855324]/40 uppercase tracking-widest mb-1">{item.label}</p>
                           <p className="text-3xl font-headline font-black text-[#4B2E2B]">{item.val} <span className="text-xs text-[#855324]/40">{item.unit}</span></p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[#4B2E2B] p-10 rounded-[3rem] shadow-xl text-white">
                  <h4 className="text-xl font-headline font-black mb-8 uppercase flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">assignment</span> Chronological Audit
                  </h4>
                  <div className="space-y-6">
                     {events.slice(Math.max(0, currentIndex - 2), currentIndex + 1).map((ev, i) => (
                        <div key={i} className={`flex gap-4 p-4 rounded-2xl transition-all ${i === Math.min(currentIndex, 2) ? 'bg-white/10 translate-x-2' : 'opacity-40'}`}>
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-black">
                              {new Date(ev.raw_data?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                           </div>
                           <div>
                              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${ev.risk === 'Normal' ? 'text-primary' : 'text-red-400'}`}>
                                 System Re-calculation: {ev.risk} Risk
                              </p>
                              <p className="text-[10px] text-white/50 leading-relaxed font-body">
                                 CPI stabilized at {ev.cpi}. AI suggests: {ev.ai_coordination?.alert_summary || "Maintain observation."}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* GitHub-style Heatmap */}
            <div className="mt-12 bg-white p-12 rounded-[3.5rem] border border-[#C08552]/10 shadow-xl">
               <div className="flex justify-between items-center mb-8">
                  <div>
                     <h4 className="text-2xl font-headline font-black text-[#4B2E2B] uppercase italic">System Continuity Heatmap</h4>
                     <p className="text-xs text-[#855324]/40 font-bold uppercase tracking-widest mt-1">Activity Density over previous 100 snapshots</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-stone-400 uppercase">Less Risk</span>
                     <div className="flex gap-1">
                        {["bg-emerald-100", "bg-emerald-300", "bg-amber-400", "bg-red-500", "bg-red-900"].map(c => (
                           <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
                        ))}
                     </div>
                     <span className="text-[10px] font-bold text-stone-400 uppercase">More Risk</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-50 gap-1.5">
                  {Array.from({ length: 150 }).map((_, i) => {
                     const ev = events[i % events.length];
                     const colors = {
                        "Normal": "bg-emerald-100",
                        "Moderate": "bg-emerald-300",
                        "High": "bg-amber-400",
                        "Severe": "bg-red-500",
                        "Critical": "bg-red-900",
                        "Stable": "bg-stone-100"
                     };
                     const color = ev ? colors[ev.risk] || "bg-stone-100" : "bg-stone-50";
                     return (
                        <div 
                           key={i} 
                           className={`aspect-square w-full rounded-[3px] ${color} transition-all hover:scale-150 hover:z-10 cursor-help shadow-sm`}
                           title={ev ? `Snapshot ${i}: ${ev.risk} Risk at CPI ${ev.cpi}` : "No Data"}
                        />
                     );
                  })}
               </div>
               <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center">
                  <p className="text-[10px] font-black text-[#855324]/30 uppercase tracking-[0.3em]">Sentinel Multi-Nodal Analysis Layer 2.0</p>
                  <p className="text-[10px] font-bold text-primary italic uppercase tracking-widest">Synchronized via alertX Clock</p>
               </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
