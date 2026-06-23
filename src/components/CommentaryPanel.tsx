import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChatMessage, Faction } from "../types";
import { Cpu, Send, ShieldCheck, Zap, AlertTriangle, Terminal, Database } from "lucide-react";

interface CommentaryPanelProps {
  chats: ChatMessage[];
  isThinking: boolean;
  onAskCustomDialogue: (voice: Faction, prompt?: string) => void;
}

const FACTION_CONFIG = {
  jesus: { label: 'DIVINE ADVOCATE', color: 'text-amber-400', icon: '✝', border: 'border-amber-900/40', bg: 'bg-amber-950/10' },
  caan: { label: 'TEMPORAL PROPHET', color: 'text-emerald-400', icon: '◉-👁', border: 'border-emerald-900/40', bg: 'bg-emerald-950/10' }
} as const;

export function CommentaryPanel({ chats, isThinking, onAskCustomDialogue }: CommentaryPanelProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [targetFaction, setTargetFaction] = useState<Faction>("caan");
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    if (isAutoScrollEnabled && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [isAutoScrollEnabled]);

  useEffect(() => {
    scrollToEnd();
  }, [chats, isThinking, scrollToEnd]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customPrompt.trim();
    if (!trimmed) return;
    onAskCustomDialogue(targetFaction, trimmed);
    setCustomPrompt("");
  }, [customPrompt, targetFaction, onAskCustomDialogue]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setIsAutoScrollEnabled(scrollHeight - scrollTop <= clientHeight + 200);
  }, []);

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-2xl h-full shadow-2xl overflow-hidden font-sans">
      <div className="bg-slate-900/80 p-3 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
          <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase">
            {isThinking ? "QUANTUM DRIFT: ACTIVE" : "SYSTEM STABLE"}
          </span>
        </div>
        <Database className="w-3 h-3 text-slate-600" />
      </div>

      <div className="grid grid-cols-2 gap-1 p-2 bg-slate-900/40">
        {(Object.entries(FACTION_CONFIG) as [Faction, typeof FACTION_CONFIG['caan']][]).map(([id, config]) => (
          <button 
            key={id} 
            onClick={() => setTargetFaction(id)}
            className={`p-2 border rounded-md transition-all duration-300 ${targetFaction === id ? 'bg-slate-800 border-slate-600 shadow-inner' : 'bg-slate-950 border-slate-900 hover:border-slate-700'}`}
          >
            <span className={`block text-[10px] font-mono ${config.color}`}>{config.icon} {config.label}</span>
          </button>
        ))}
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {chats.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 text-[10px] opacity-50">
            <Terminal className="w-8 h-8 mb-2" />
            Awaiting temporal synchronization...
          </div>
        )}
        {chats.map((msg) => (
          <div key={msg.id} className={`p-3 rounded-lg border ${FACTION_CONFIG[msg.speaker].border} ${FACTION_CONFIG[msg.speaker].bg} transition-all`}>
            <div className="flex justify-between mb-1">
              <span className={`text-[9px] font-mono font-bold ${FACTION_CONFIG[msg.speaker].color}`}>{msg.speaker.toUpperCase()}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">{msg.text}</p>
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-2 text-[10px] text-rose-400 font-mono animate-pulse">
            <Cpu className="w-3 h-3" /> Analyzing causality chains...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 p-3 border-t border-slate-800">
        <div className="relative">
          <input
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={`Inject directive to ${targetFaction}...`}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
          />
          <button type="submit" className="absolute right-2 top-2 p-1 hover:bg-slate-800 rounded transition-colors">
            <Send className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </form>
    </div>
  );
}



















