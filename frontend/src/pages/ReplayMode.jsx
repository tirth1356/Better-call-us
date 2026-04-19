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
          <Link to="/" className="text-[#835335] opacity-70 hover:bg-[#e8e1da] px-3 py-1 rounded">Live Feed</Link>
          <Link to="/replay" className="text-[#855324] font-bold border-b-2 border-[#855324] px-3 py-1">Replay Analysis</Link>
        </nav>
      </header>

      <main className="flex-1 pt-24 flex flex-col md:flex-row relative">
        <aside className="fixed left-0 top-0 h-full w-72 flex flex-col p-8 gap-6 bg-[#f9f3eb] shadow-xl z-40 pt-32">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#855324] opacity-50">Playback Stats</h2>
          <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-[#C08552]/10">
                  <p className="text-[10px] uppercase font-bold text-[#855324]">Current CPI</p>
                  <p className="text-2xl font-headline font-bold">{currentEvent.cpi}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#C08552]/10">
                  <p className="text-[10px] uppercase font-bold text-[#855324]">Predicted Risk</p>
                  <p className={`text-xl font-headline font-bold ${currentEvent.risk === 'High' ? 'text-red-600' : 'text-green-600'}`}>{currentEvent.risk}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#C08552]/10">
                  <p className="text-[10px] uppercase font-bold text-[#855324]">Prediction Window</p>
                  <p className="text-2xl font-headline font-black text-[#855324]">{currentEvent.predicted_window_min} min</p>
              </div>
          </div>
        </aside>

        <section className="flex-1 ml-0 md:ml-72 p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-5xl font-headline font-bold text-on-surface">Archive <span className="text-[#855324]">Replay</span></h2>
            <p className="text-[#855324]/60 mt-2 font-bold tracking-widest text-xs uppercase">Event Timestamp: {new Date(currentEvent.raw_data.timestamp).toLocaleTimeString()}</p>
          </div>

          <div className="relative aspect-video bg-[#1e1b17] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12">
                  <div className="mb-8 flex justify-between items-end">
                      <div>
                          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Simulated Pressure Map</p>
                          <div className="flex items-center gap-6">
                              <h3 className="text-white text-6xl font-headline font-black">{currentEvent.cpi}</h3>
                              <div className="h-12 w-px bg-white/20"></div>
                              <div>
                                  <p className="text-white/80 font-bold uppercase text-[10px]">Prediction Confidence</p>
                                  <p className="text-yellow-400 font-headline text-xl font-bold">{currentEvent.confidence}</p>
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-16 h-16 bg-[#855324] text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                          >
                              <span className="material-symbols-outlined text-3xl">
                                  {isPlaying ? "pause" : "play_arrow"}
                              </span>
                          </button>
                      </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={false}
                        animate={{ width: `${(currentIndex / (events.length - 1)) * 100}%` }}
                        className="absolute inset-0 bg-[#855324]"
                      />
                  </div>
              </div>
              
              {/* Background Artful Grid */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                  { label: "Entry Flow", val: currentEvent.raw_data.entry_flow_rate_pax_per_min?.toFixed(1) },
                  { label: "Density", val: currentEvent.raw_data.queue_density_pax_per_m2?.toFixed(2) },
                  { label: "Build-up State", val: currentEvent.buildup }
              ].map(stat => (
                  <div key={stat.label} className="bg-white p-6 rounded-2xl border border-[#C08552]/10 shadow-sm">
                      <p className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-headline font-bold text-[#855324]">{stat.val}</p>
                  </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
