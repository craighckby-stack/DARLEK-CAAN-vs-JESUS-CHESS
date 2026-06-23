/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * @system DARLEK_CANN_V3_CORE
 * @module ControlOverlay
 */

import React, { useMemo } from "react";
import { GameMode, Faction } from "../types";
import { Play, Sparkles, Cpu, Eye, RefreshCw, ShieldAlert, AlertTriangle, Terminal, Activity } from "lucide-react";

interface ControlOverlayProps {
  status: "setup" | "playing" | "checkmate" | "stalemate" | "exterminated_king" | "draw";
  winner: Faction | "draw" | null;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onResetGame: () => void;
}

const MODE_CONFIG = [
  { id: "jesus-vs-caan-ai", label: "Play as Jesus", icon: Sparkles, theme: "amber", desc: "Miracles vs Predictive Calculations" },
  { id: "caan-vs-jesus-ai", label: "Play as Darlek Caan", icon: Cpu, theme: "emerald", desc: "Laser Extermination vs Holy Apostles" },
  { id: "ai-vs-ai", label: "Deity Spectator", icon: Eye, theme: "indigo", desc: "AI vs AI with Gemini Commentary" },
  { id: "local-coop", label: "Local Hotseat", icon: RefreshCw, theme: "slate", desc: "Pass-and-play local duel" },
] as const;

const THEME_MAP: Record<string, string> = {
  amber: "border-amber-500/50 bg-amber-950/20 text-amber-400",
  emerald: "border-emerald-500/50 bg-emerald-950/20 text-emerald-400",
  indigo: "border-indigo-500/50 bg-indigo-950/20 text-indigo-400",
  slate: "border-slate-500/50 bg-slate-800/20 text-slate-400",
};

export function ControlOverlay({ status, winner, selectedMode, onSelectMode, onStartGame, onResetGame }: ControlOverlayProps) {
  const viewState = useMemo(() => ({
    isPlaying: status === "playing",
    isGameOver: status !== "setup" && status !== "playing",
    meta: status !== "setup" ? { title: "Tactical Resolution", icon: AlertTriangle, color: "text-rose-500" } : { title: "Cosmic Conflict Setup", icon: ShieldAlert, color: "text-cyan-400" }
  }), [status]);

  if (viewState.isPlaying) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex justify-center items-center p-4 font-sans">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-slate-950/80 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className={`w-6 h-6 ${viewState.meta.color}`} />
            <h1 className="text-lg font-bold text-white tracking-widest uppercase">{viewState.meta.title}</h1>
          </div>
          <Activity className="w-4 h-4 text-slate-600 animate-pulse" />
        </div>

        <div className="p-6 space-y-6">
          {!viewState.isGameOver ? (
            <div className="space-y-4">
              {MODE_CONFIG.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectMode(m.id as GameMode)}
                  className={`w-full p-4 border rounded-xl flex items-center gap-4 transition-all ${selectedMode === m.id ? THEME_MAP[m.theme] : "border-slate-800 bg-slate-950/50 hover:border-slate-700"}`}
                >
                  <m.icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-sm font-bold">{m.label}</div>
                    <div className="text-[10px] opacity-60">{m.desc}</div>
                  </div>
                </button>
              ))}
              <button onClick={onStartGame} className="w-full py-4 bg-white text-slate-950 font-black rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                <Play className="w-4 h-4" /> Initiate Sequence
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Final Outcome</div>
                <div className="text-2xl font-black text-white mt-2">{status.replace("_", " ").toUpperCase()}</div>
                {winner && <div className="text-xs text-slate-400 mt-3 font-mono">VICTOR: {winner.toUpperCase()}</div>}
              </div>
              <button onClick={onResetGame} className="w-full py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-bold uppercase tracking-widest text-xs">
                Reset System Core
              </button>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-2 text-[9px] text-slate-600 uppercase tracking-widest">
          <viewState.meta.icon className="w-3 h-3" /> 
          System Status: {status.toUpperCase()} // Core_ID: DARLEK_CANN_V3
        </div>
      </div>
    </div>
  );
}


