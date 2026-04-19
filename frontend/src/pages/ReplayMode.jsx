import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import Footer from "../components/Footer";

export default function ReplayMode() {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postMortem, setPostMortem] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateReport = async () => {
      setIsGenerating(true);
      try {
          const res = await fetch("http://127.0.0.1:8000/post_mortem");
          const data = await res.json();
          if (data.status === "success") {
              setPostMortem(data.report);
          } else {
              setPostMortem("Error generating report: " + data.message);
          }
      } catch(e) {
          setPostMortem("Failed to connect to AI Post-Mortem generator.");
      }
      setIsGenerating(false);
  };

  const currentEvent = events[currentIndex] || { 
      cpi: 0, 
      predicted_cpi: 0, 
      risk: "Stable", 
      predicted_window_min: 0,
      raw_data: { timestamp: "00:00:00" } 
  };

  const chartData = events.slice(0, currentIndex + 1).map((e, index) => ({
      index,
      cpi: e.cpi,
      predicted_cpi: e.predicted_cpi,
      risk: e.risk,
      time: e.raw_data?.timestamp ? new Date(e.raw_data.timestamp).toLocaleTimeString() : '',
      isDanger: e.risk === "Severe" || e.risk === "Critical"
  }));

  if (loading) return <div className="h-screen flex items-center justify-center font-headline text-2xl text-[#855324]">Loading Archive...</div>;

  if (events.length < 10) {
      return (
          <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-8">
              <div className="max-w-2xl text-center space-y-6 bg-white p-16 rounded-[3rem] border border-[#C08552]/10 shadow-2xl">
                 <span className="material-symbols-outlined text-6xl text-red-500 mb-4 animate-pulse">lock</span>
                 <h1 className="text-4xl font-headline font-black text-[#4B2E2B]">SYSTEM LOCKED: INSUFFICIENT TELEMETRY</h1>
                 <p className="text-[#855324] font-medium text-lg leading-relaxed">
                     The Predictive Post-Mortem requires highly accurate historical context. Currently loaded frame count: <strong>{events.length}/10</strong>.
                 </p>
                 <p className="text-sm opacity-60">Please run the Live Video Simulation or feed the dynamic dataset on the main dashboard for at least 10 frames before accessing the AI Replay Mode.</p>
                 <Link to="/" className="inline-block mt-8 bg-[#855324] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Return to Dashboard</Link>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-[#fafafc] text-on-background font-body min-h-screen flex flex-col overflow-hidden selection:bg-primary/20">
      <header className="bg-white/70 backdrop-blur-2xl flex justify-between items-center px-12 py-6 w-full fixed top-0 z-[60] border-b border-stone-200/50">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 bg-[#4B2E2B] rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="material-symbols-outlined text-white text-xl">architecture</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-[#4B2E2B] font-headline">AlertX <span className="text-primary">Predictor</span></h1>
        </div>
        <nav className="hidden md:flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl">
          <Link to="/" className="text-[#4B2E2B]/60 hover:text-[#4B2E2B] px-6 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest">Dashboard</Link>
          <Link to="/replay" className="bg-white text-[#4B2E2B] px-6 py-2 rounded-xl shadow-sm transition-all font-black text-[10px] uppercase tracking-widest border border-stone-200">Replay Hub</Link>
        </nav>
      </header>

      <main className="flex-1 pt-24 flex flex-col md:flex-row relative">
        <aside className="fixed left-8 top-32 bottom-8 w-80 flex flex-col p-8 gap-10 premium-glass rounded-[3rem] border border-white shadow-2xl z-40">
          <div>
            <div className="flex items-center justify-between mb-8">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4B2E2B]/40">Intelligence Log</p>
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            
            <div className="space-y-5">
                {[
                  { label: "Predictive Index", val: currentEvent.cpi, icon: "compress", sub: "Core Dynamic" },
                  { label: "Surge Risk", val: currentEvent.risk, icon: "warning", color: currentEvent.risk === 'High' || currentEvent.risk === 'Severe' || currentEvent.risk === 'Critical' ? 'text-red-500' : 'text-emerald-500', sub: "Current Vector" },
                  { label: "Crush Window", val: `${currentEvent.predicted_window_min}m`, icon: "timer", sub: "Threshold Prediction" },
                  { label: "Sensor Array", val: "Active", icon: "sensors", sub: "Operational Status" }
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-[2rem] bg-white border border-stone-100 shadow-sm transition-all hover:shadow-md group"
                  >
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[9px] uppercase font-black text-[#4B2E2B]/30 tracking-widest">{stat.label}</p>
                        <span className="material-symbols-outlined text-[10px] text-[#4B2E2B]/20 group-hover:text-primary transition-colors">{stat.icon}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-headline font-black tracking-tighter ${stat.color || 'text-[#4B2E2B]'}`}>{stat.val}</p>
                      </div>
                      <p className="text-[9px] text-[#4B2E2B]/40 font-bold uppercase mt-1 tracking-tight">{stat.sub}</p>
                  </motion.div>
                ))}
            </div>
          </div>

          <div className="mt-auto space-y-4">
             <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleGenerateReport}
                 disabled={isGenerating}
                 className="w-full py-5 rounded-[1.5rem] bg-[#4B2E2B] text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#4B2E2B]/20 flex items-center justify-center gap-3 disabled:opacity-50"
             >
                 {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined text-sm">psychology</span>}
                 {isGenerating ? "Analyzing..." : "Post-Mortem"}
             </motion.button>
             <button 
                 onClick={() => { /* CSV code ... */ }}
                 className="w-full py-5 rounded-[1.5rem] bg-white border border-stone-200 text-[#4B2E2B] text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-stone-50"
             >
                 Export Dataset
             </button>
          </div>
        </aside>

        <section className="flex-1 ml-0 md:ml-96 p-12 lg:p-16 pb-32">
          <div className="max-w-screen-2xl mx-auto space-y-16">
            <header className="flex flex-col lg:flex-row justify-between items-end gap-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10 transition-all hover:bg-primary/20">
                   <span className="material-symbols-outlined text-sm">history</span> MISSION ARCHIVE: ACTIVE INFERENCE
                </div>
                <h2 className="text-7xl md:text-8xl font-headline font-black text-[#4B2E2B] tracking-tighter leading-none">Intelligence <br/><span className="text-primary italic">Replay.</span></h2>
              </div>
              
              <div className="bg-white p-6 rounded-[2.5rem] border border-stone-200 shadow-xl flex items-center gap-8">
                 <div className="text-right">
                    <p className="text-[9px] font-black text-[#4B2E2B]/30 uppercase tracking-[0.3em] mb-1">Audit Frame</p>
                    <p className="text-sm font-black text-[#4B2E2B] tabular-nums">{currentIndex + 1} <span className="text-[#4B2E2B]/30">/ {events.length}</span></p>
                 </div>
                 <div className="flex gap-2">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                      className="w-14 h-14 rounded-2xl border border-stone-100 flex items-center justify-center hover:bg-stone-50 transition-all text-[#4B2E2B] shadow-sm"
                    >
                       <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-20 h-14 bg-primary text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-primary/30"
                    >
                       <span className="material-symbols-outlined text-2xl">{isPlaying ? "pause" : "play_arrow"}</span>
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentIndex(Math.min(events.length - 1, currentIndex + 1))}
                      className="w-14 h-14 rounded-2xl border border-stone-100 flex items-center justify-center hover:bg-stone-50 transition-all text-[#4B2E2B] shadow-sm"
                    >
                       <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
                    </motion.button>
                 </div>
              </div>
            </header>

            {/* AI POST MORTEM REPORT SECTION - Intelligence Document Style */}
            <AnimatePresence>
                {postMortem && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-16 rounded-[4rem] border border-stone-200 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Official Audit Document</h3>
                                <p className="text-4xl font-headline font-black text-[#4B2E2B] tracking-tighter">Predictive Failure Analysis</p>
                            </div>
                            <div className="text-right text-[9px] font-black text-[#4B2E2B]/40 uppercase tracking-widest space-y-1">
                               <p>Document: ALX-{new Date().getTime().toString().slice(-6)}</p>
                               <p>Clearance: Level 4 Command</p>
                            </div>
                        </div>
                        <div className="prose max-w-none text-[#4B2E2B]/80 font-body leading-relaxed text-lg whitespace-pre-wrap font-medium">
                            {postMortem}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`relative aspect-[21/9] bg-[#1a1a1e] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] border-2 transition-all duration-700 group ${currentEvent.risk === 'Severe' || currentEvent.risk === 'Critical' ? 'border-red-500/50' : 'border-stone-800'}`}>
                {/* Immersive Graph */}
                <div className="absolute inset-0 pt-20 pb-40 opacity-40">
                     <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                              <defs>
                                 <linearGradient id="colorCpi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C08552" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#C08552" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="cpi" stroke="#C08552" strokeWidth={4} fill="url(#colorCpi)" isAnimationActive={false} />
                          </AreaChart>
                     </ResponsiveContainer>
                </div>

                {/* 🌌 Heatmap Node Grid 🌌 */}
                <div className="absolute inset-0 p-24 grid grid-cols-12 grid-rows-6 gap-3 opacity-10 pointer-events-none">
                    {Array.from({ length: 72 }).map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={{ 
                                opacity: [0.3, 0.6, 0.3],
                                backgroundColor: currentEvent.cpi > 70 ? '#ef4444' : '#C08552',
                            }}
                            transition={{ duration: 4, repeat: Infinity, delay: (i % 12) * 0.1 }}
                            className="rounded-md border border-white/10"
                        />
                    ))}
                </div>

                {/* Tactical HUD */}
                <div className="absolute inset-x-16 bottom-16 flex justify-between items-end relative z-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <h3 className="text-white text-[120px] font-headline font-black leading-none tracking-tighter tabular-nums">{currentEvent.cpi}</h3>
                         <div className="mb-4">
                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-1">Confidence</p>
                            <p className="text-white text-2xl font-black">{currentEvent.confidence || '94.2'}<span className="text-white/30 text-xs ml-1">%</span></p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-colors duration-500 ${currentEvent.risk === 'Severe' || currentEvent.risk === 'Critical' ? 'bg-red-500 text-white border-red-400' : 'bg-white/10 text-white border-white/20'}`}>
                            PHASE: {currentEvent.risk}
                         </div>
                         <div className="px-5 py-2 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                            Vector: Nominal Flow
                         </div>
                      </div>
                   </div>

                   <div className="max-w-md w-full bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                      <p className="text-primary text-[9px] font-black uppercase tracking-[0.4em] mb-4">Tactical Directive Audit</p>
                      <p className="text-white/70 text-base leading-relaxed font-body font-medium italic">
                         "{currentEvent.ai_coordination?.alert_summary || "Observing kinetic load across corridor alpha. No bypass protocol required."}"
                      </p>
                   </div>
                </div>

                <div className="absolute top-12 left-12 flex items-center gap-4">
                   <div className="flex gap-1.5">{[0,1,2].map(x => <div key={x} className="w-1.5 h-1.5 bg-primary/40 rounded-full" />)}</div>
                   <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Sentinel Observer v4.2</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-stone-200 shadow-xl relative overflow-hidden group"
               >
                  <div className="flex items-center justify-between mb-12">
                    <h4 className="text-2xl font-headline font-black text-[#4B2E2B] uppercase tracking-tight">Kinetic Telemetry</h4>
                    <span className="material-symbols-outlined text-[#4B2E2B]/10 text-4xl group-hover:rotate-45 transition-transform">analytics</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                     {[
                        { label: "Entry Pulse", val: currentEvent.raw_data?.entry_flow_rate_pax_per_min?.toFixed(1) || "0.0", unit: "p/min" },
                        { label: "Density Sat", val: currentEvent.raw_data?.queue_density_pax_per_m2?.toFixed(2) || "0.0", unit: "p/m²" },
                        { label: "Transit Burst", val: currentEvent.raw_data?.transport_arrival_burst || "0", unit: "pax" },
                        { label: "Velocity", val: currentEvent.cpi ? (currentEvent.cpi / 2.5).toFixed(1) : "0.0", unit: "m/s" }
                     ].map((item, i) => (
                        <div key={item.label} className="space-y-1">
                           <p className="text-[10px] font-black text-[#4B2E2B]/30 uppercase tracking-[0.2em]">{item.label}</p>
                           <p className="text-4xl font-headline font-black text-[#4B2E2B] tracking-tighter">{item.val}</p>
                           <p className="text-[9px] font-black text-primary uppercase">{item.unit}</p>
                        </div>
                     ))}
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="bg-[#4B2E2B] p-12 rounded-[3.5rem] shadow-2xl text-white flex flex-col"
               >
                  <h4 className="text-xl font-headline font-black mb-10 uppercase tracking-widest text-primary">Model Audit</h4>
                  <div className="space-y-8 flex-1">
                     {events.slice(Math.max(0, currentIndex - 1), currentIndex + 1).map((ev, i) => (
                        <div key={i} className={`flex gap-6 transition-all ${i === 1 ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
                           <div className="text-[10px] font-black opacity-30 tabular-nums pt-1">
                              {ev.raw_data?.timestamp ? new Date(ev.raw_data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "00:00:00"}
                           </div>
                           <div className="space-y-2">
                              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${ev.risk === 'Severe' || ev.risk === 'Critical' ? 'text-red-400' : 'text-primary'}`}>
                                 {ev.risk} PHASE DETECTED
                              </p>
                              <p className="text-xs text-white/50 leading-relaxed font-body font-medium">
                                 Flow stabilized at {ev.cpi}. Logic sequence: intervention {ev.risk === 'Stable' ? 'deferred' : 'active'}.
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
