import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function AiChatPanel() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "I am your AI Strategist. Ask me any 'What-If' scenarios like: 'What if the main gate is blocked?'" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", content: "Error connecting to AI. Please ensure backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-[#C08552]/20 bg-white shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
      <div className="px-8 py-6 border-b border-[#C08552]/10 flex items-center justify-between bg-white relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C08552]/10 flex items-center justify-center">
             <Bot size={16} className="text-[#C08552]" strokeWidth={2.5} />
          </div>
          <div>
             <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#4B2E2B]/40 mb-0.5">Tactical Support</p>
             <h3 className="text-xl font-headline font-black text-[#4B2E2B] tracking-tight">AI Strategy Hub</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Neural Link Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-stone-50/30">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`p-4 rounded-[1.8rem] text-xs leading-relaxed shadow-sm border ${m.role === "user" ? "bg-[#4B2E2B] text-white border-[#4B2E2B] rounded-tr-none" : "bg-white text-[#4B2E2B] border-[#C08552]/10 rounded-tl-none"}`}>
                  <p className="font-medium">{m.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-[#C08552]/10 flex gap-2 items-center shadow-sm">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-[#C08552]" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#C08552]" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#C08552]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-[#C08552]/10">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Simulate: 'Heavy rain at Gate 1'..."
            className="flex-1 pl-6 pr-6 py-4 rounded-full border border-stone-200 text-xs font-bold focus:outline-none focus:border-[#C08552] bg-stone-50 transition-all font-body tracking-tight"
          />
          <button
            onClick={sendMessage}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4B2E2B] text-white hover:bg-[#2d1b19] transition-all shadow-lg active:scale-95"
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
