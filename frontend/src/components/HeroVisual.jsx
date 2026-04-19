import { motion } from "framer-motion";

export default function HeroVisual() {
  const particles = Array.from({ length: 40 });
  const gridCells = Array.from({ length: 100 });

  return (
    <div className="relative w-full h-full bg-[#4B2E2B] flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-20">
        {gridCells.map((_, i) => (
          <div key={i} className="border-[0.5px] border-white/20" />
        ))}
      </div>

      {/* Pulsing Heatmap Center */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-64 h-64 bg-primary/40 rounded-full blur-[80px]"
      />

      {/* Kinetic Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: Math.random(),
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
            ],
            y: [
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
            ],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        />
      ))}

      {/* Scanning Line */}
      <motion.div
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_15px_rgba(192,133,82,0.8)]"
      />

      {/* Data Labels */}
      <div className="absolute top-8 left-8 space-y-2">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Neural Engine v.2.4</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-primary" />
           <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Predictive Flow Active</span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8">
         <span className="text-[10px] font-headline font-black text-white/20 uppercase tracking-[0.4em]">AlertX Quantum</span>
      </div>
    </div>
  );
}
