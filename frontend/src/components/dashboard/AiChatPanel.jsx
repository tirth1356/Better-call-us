import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function AiChatPanel() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "I am your AI Sentinel. Ask me any 'What-If' scenarios like: 'What if the main gate is blocked?'" }
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
    <div className="rounded-2xl border border-[#C08552]/20 bg-white overflow-hidden flex flex-col h-[400px]">
      <div className="px-6 py-4 border-b border-[#C08552]/10 flex items-center justify-between bg-[#FFF8F0]">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#C08552]" size={18} />
          <h3 className="text-lg font-headline font-bold text-[#4B2E2B]">What-If Simulation Hub</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] flex gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-[#4B2E2B]" : "bg-[#C08552]/10"}`}>
                  {m.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-[#C08552]" />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${m.role === "user" ? "bg-[#4B2E2B] text-white rounded-tr-none" : "bg-[#FFF8F0] text-[#4B2E2B] border border-[#C08552]/10 rounded-tl-none"}`}>
                  {m.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#FFF8F0] p-3 rounded-2xl border border-[#C08552]/10 flex gap-2 items-center">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-[#C08552]" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#C08552]" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#C08552]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-stone-50 border-t border-[#C08552]/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="What if terminal 2 closes?"
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-[#C08552]/20 text-xs focus:outline-none focus:border-[#C08552] bg-white transition-all shadow-sm"
          />
          <button
            onClick={sendMessage}
            className="absolute right-2 top-1.5 w-9 h-9 flex items-center justify-center rounded-lg bg-[#C08552] text-white hover:bg-[#8C5A3C] transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
