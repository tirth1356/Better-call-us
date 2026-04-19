import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { History, Play, Pause, ChevronLeft, ChevronRight, Activity, Clock } from "lucide-react";

export default function HistoryReplaySection() {
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
      })
      .catch(err => console.error("History fetch error:", err));
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && currentIndex < events.length - 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => prev + 1);
      }, 500);
    } else if (currentIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, events]);

  if (loading || events.length === 0) return null;

  const currentEvent = events[currentIndex];
  // Prepare chart data: all events up to currentIndex
  const historyData = events.slice(0, currentIndex + 1).map((ev, idx) => ({
    time: new Date(ev.raw_data?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    cpi: ev.cpi,
    risk: ev.risk
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 bg-white rounded-[2.5rem] border border-[#C08552]/10 shadow-xl overflow-hidden scroll-mt-24"
      id="replay-section"
    >
      <div className="px-8 py-6 border-b border-[#C08552]/10 flex flex-col md:flex-row justify-between items-center bg-[#FFF8F0] gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <History className="text-[#C08552]" size={20} />
            <h3 className="text-xl font-headline font-black text-[#4B2E2B] uppercase tracking-tight">Deployment History Replay</h3>
          </div>
          <p className="text-[10px] font-bold text-[#4B2E2B]/40 uppercase tracking-widest flex items-center gap-2">
            <Clock size={12} /> SHAPSHOT {currentIndex + 1} OF {events.length} · {currentEvent.raw_data?.timestamp ? new Date(currentEvent.raw_data.timestamp).toLocaleTimeString() : '--'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-[#C08552]/10 shadow-sm">
          <button 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-[#4B2E2B]/60"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-6 py-2 bg-[#8C5A3C] text-white rounded-xl shadow-md flex items-center gap-2 font-black text-[10px] uppercase hover:bg-[#4B2E2B] transition-all active:scale-95"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? "Pause" : "Start Replay"}
          </button>
          <button 
            onClick={() => setCurrentIndex(Math.min(events.length - 1, currentIndex + 1))}
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-[#4B2E2B]/60"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[300px] w-full bg-[#1e1b17] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
             <div className="absolute top-4 left-4 z-10">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1 underline decoration-primary underline-offset-4">Historical Pressure Curve</p>
                <div className="flex items-baseline gap-2">
                   <h4 className="text-white text-5xl font-headline font-black">{currentEvent.cpi}</h4>
                   <span className={`text-xs font-black uppercase ${currentEvent.risk === 'Normal' ? 'text-primary' : 'text-red-500'}`}>{currentEvent.risk}</span>
                </div>
             </div>
             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
               <AreaChart data={historyData}>
                 <defs>
                   <linearGradient id="colorCpi" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8C5A3C" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#8C5A3C" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                 <XAxis hide dataKey="time" />
                 <YAxis hide domain={[0, 10]} />
                 <Tooltip 
                   content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                       return (
                         <div className="bg-[#4B2E2B] border border-white/10 p-3 rounded-xl shadow-2xl">
                           <p className="text-[9px] font-black text-white/40 uppercase mb-1">{payload[0].payload.time}</p>
                           <p className="text-lg font-headline font-black text-white">CPI: {payload[0].value}</p>
                           <p className={`text-[9px] font-bold uppercase ${payload[0].payload.risk === 'Normal' ? 'text-primary' : 'text-red-400'}`}>{payload[0].payload.risk} RISK</p>
                         </div>
                       );
                     }
                     return null;
                   }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="cpi" 
                   stroke="#8C5A3C" 
                   strokeWidth={3} 
                   fillOpacity={1} 
                   fill="url(#colorCpi)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* Scrubber */}
          <div className="px-2">
            <input 
              type="range" 
              min="0" 
              max={events.length - 1} 
              value={currentIndex} 
              onChange={(e) => { setIsPlaying(false); setCurrentIndex(parseInt(e.target.value)); }}
              className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#8C5A3C]"
            />
          </div>
        </div>

        <div className="space-y-4">
           <div className="p-6 rounded-3xl bg-[#FFF8F0] border border-[#C08552]/10 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-[#4B2E2B] uppercase mb-6 flex items-center gap-2">
                   <Activity size={16} className="text-[#C08552]" /> Tactical Narrative
                </h4>
                <div className="space-y-6">
                   <div className="relative pl-6 border-l-2 border-[#C08552]/20 py-1">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#C08552]" />
                      <p className="text-[10px] font-black text-[#855324]/40 uppercase mb-1">AI Recommendation</p>
                      <p className="text-xs font-body leading-relaxed text-[#4B2E2B] italic">
                        "{currentEvent.ai_coordination?.alert_summary || "Observing nominal flow dynamics. Maintain existing patrol protocols."}"
                      </p>
                   </div>
                   <div className="relative pl-6 border-l-2 border-[#C08552]/20 py-1">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#C08552]" />
                      <p className="text-[10px] font-black text-[#855324]/40 uppercase mb-1">Telemetry Breakdown</p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                         <div>
                            <p className="text-[10px] font-bold text-stone-400">DENSITY</p>
                            <p className="text-lg font-black text-[#4B2E2B]">{currentEvent.raw_data?.queue_density_pax_per_m2?.toFixed(1)} <span className="text-[8px] opacity-40">p/m²</span></p>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-stone-400">VELOCITY</p>
                            <p className="text-lg font-black text-[#4B2E2B]">{(currentEvent.cpi / 2.8).toFixed(1)} <span className="text-[8px] opacity-40">m/s</span></p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Buttons removed as requested */}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
