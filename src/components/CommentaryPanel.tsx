/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, Faction } from "../types";
import { Sparkles, Cpu, Send, RefreshCw } from "lucide-react";

interface CommentaryPanelProps {
  chats: ChatMessage[];
  isThinking: boolean;
  onAskCustomDialogue: (voice: Faction) => void;
}

export function CommentaryPanel({ chats, isThinking, onAskCustomDialogue }: CommentaryPanelProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chats container on any updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats, isThinking]);

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl h-full shadow-2xl overflow-hidden font-sans">
      {/* Banter Communications Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-slate-400 tracking-widest uppercase">
            COSMIC WAVEFEED MONITOR
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAskCustomDialogue("jesus")}
            disabled={isThinking}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/60 rounded-full text-xs text-amber-200 transition disabled:opacity-50"
            title="Ask Jesus to speak a dynamic parable on the current board state"
            id="btn_ask_jesus"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Parable
          </button>
          <button
            onClick={() => onAskCustomDialogue("caan")}
            disabled={isThinking}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 rounded-full text-xs text-emerald-200 transition disabled:opacity-50"
            title="Screech a paranoid Dalek temporal prophecy"
            id="btn_ask_caan"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            Prophecy
          </button>
        </div>
      </div>

      {/* Main Avatar Banter Stage */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950/40 border-b border-slate-800/50">
        {/* Jesus Persona */}
        <div className="p-3 bg-gradient-to-b from-amber-950/10 to-slate-900/20 border border-amber-900/20 rounded-xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-1 right-2 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping absolute" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          {/* Avatar Ring */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 relative">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-serif text-2xl text-amber-200 select-none">
              ✝
            </div>
            {/* Crown of thorns/halo glow effect */}
            <div className="absolute -inset-1 border border-amber-500/20 rounded-full animate-spin [animation-duration:12s]" />
          </div>
          <span className="text-amber-200 font-medium text-xs tracking-wide">JESUS CHRIST</span>
          <span className="text-[10px] text-amber-500 font-mono">DIVINE ADVOCATE</span>
        </div>

        {/* Dalek Caan Persona */}
        <div className="p-3 bg-gradient-to-b from-emerald-950/10 to-slate-900/20 border border-emerald-900/20 rounded-xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-1 right-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {/* Cybernetic avatar ring */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-300 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-2 relative">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-mono text-lg text-emerald-300 select-none">
              ◉-👁
            </div>
            {/* Cyber HUD rotating scope */}
            <div className="absolute inset-0.5 border border-dashed border-emerald-400/40 rounded-full animate-spin [animation-duration:8s]" />
          </div>
          <span className="text-emerald-300 font-medium text-xs tracking-wide">DALEK CAAN</span>
          <span className="text-[10px] text-emerald-500 font-mono">TEMPORAL PROPHET</span>
        </div>
      </div>

      {/* Dynamic speech banter scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[180px] max-h-[350px] scrollbar-thin scrollbar-thumb-slate-800"
        style={{ touchAction: "manipulation", WebkitOverflowScrolling: "touch" }}
      >
        {chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs py-8">
            <RefreshCw className="w-7 h-7 mb-2 opacity-30 animate-spin [animation-duration:6s]" />
            Move pieces or click parables / prophecies above to begin the grand cosmic debate!
          </div>
        ) : (
          chats.map((msg) => {
            const isJesus = msg.speaker === "jesus";
            const isSystem = msg.speaker === "system";

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center">
                  <span className="inline-block px-3 py-1 bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 font-mono tracking-wider rounded-md uppercase">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] rounded-2xl p-3 shadow-md animate-fade-in ${
                  isJesus
                    ? "mr-auto bg-amber-950/15 border border-amber-900/35 rounded-tl-none text-amber-100"
                    : "ml-auto bg-emerald-950/15 border border-emerald-900/35 rounded-tr-none text-emerald-100"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`font-mono text-[9px] font-bold tracking-wide uppercase ${
                      isJesus ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {isJesus ? "✝ Jesus" : "◉ Caan"}
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>
                <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            );
          })
        )}

        {isThinking && (
          <div className="flex items-center gap-2 p-3 bg-slate-950/30 border border-slate-900 rounded-xl max-w-[60%] animate-pulse">
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono select-none">
              Intercepting temporal waves...
            </span>
          </div>
        )}
      </div>

      {/* Secret Prompt Injector Frame */}
      <div className="bg-slate-950/80 p-3 border-t border-slate-800 flex items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!customPrompt.trim()) return;
            // Send prompt randomly or let them select, let the prompt represent a custom miracle
            // To make it very cool, we'll let Jesus or Caan answer this prompt specifically
            const randSpeaker = Math.random() > 0.5 ? "jesus" : "caan";
            onAskCustomDialogue(randSpeaker);
            setCustomPrompt("");
          }}
          className="w-full flex gap-1.5 items-center"
        >
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Type a word to whisper into the space-time rift..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            id="prompt_rif_input"
          />
          <button
            type="submit"
            className="p-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 rounded-lg text-indigo-200 transition"
            id="prompt_rif_submit"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}






