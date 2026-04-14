import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, User, RefreshCw, Sparkles } from "lucide-react";
import API from "../api/axios";

const SUGGESTIONS = [
  "How do I improve my resume?",
  "What skills are most in demand in 2025?",
  "How to negotiate salary?",
  "Tips for technical interviews",
  "How to switch careers to tech?",
  "What should I put in my LinkedIn bio?",
];

export default function AiChat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm NexHire AI 👋 I'm here to help with your job search, career advice, resume tips, and interview preparation. What can I help you with today?" }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(m => [...m, { from: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await API.post("/ai/chat", { message: msg });
      setMessages(m => [...m, { from: "ai", text: res.data.data.reply }]);
    } catch {
      setMessages(m => [...m, { from: "ai", text: "Sorry, I'm having trouble connecting. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setMessages([
    { from: "ai", text: "Chat cleared! How can I help you with your job search?" }
  ]);

  return (
    <div className="page max-w-3xl flex flex-col" style={{ height: "calc(100vh - 5rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Brain size={22} className="text-white"/>
          </div>
          <div>
            <h1 className="font-extrabold text-[var(--text)] text-xl">NexHire AI</h1>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>Online • Career Assistant
            </p>
          </div>
        </div>
        <button onClick={clear} className="btn-ghost text-xs gap-1.5">
          <RefreshCw size={13}/> Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto card p-5 mb-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              className={`flex gap-3 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              {m.from === "ai" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain size={15} className="text-white"/>
                </div>
              )}
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.from === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-[var(--surface-2)] text-[var(--text)] rounded-bl-sm"
              }`}>
                {m.text}
              </div>
              {m.from === "user" && (
                <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={15} className="text-[var(--text-muted)]"/>
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Brain size={15} className="text-white"/>
              </div>
              <div className="bg-[var(--surface-2)] px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1.5 items-center">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-[var(--text-muted)]"
                      animate={{ y: [0,-4,0] }} transition={{ duration:0.6, repeat:Infinity, delay:i*0.15 }}/>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.slice(0,4).map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-muted)]
                         hover:border-violet-400 hover:text-violet-600 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about jobs, resume, salary, interviews…"
            className="input pr-12 h-12 rounded-2xl"/>
          <Sparkles size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]"/>
        </div>
        <button onClick={() => send()} disabled={!input.trim() || loading}
          className="btn-primary rounded-2xl h-12 w-12 justify-center p-0 flex-shrink-0">
          <Send size={17}/>
        </button>
      </div>
      <p className="text-center text-xs text-[var(--text-subtle)] mt-2">
        AI responses are for guidance only. Always verify important career decisions.
      </p>
    </div>
  );
}
