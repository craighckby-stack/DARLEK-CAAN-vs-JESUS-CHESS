/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GameMode, Faction } from "../types";
import { Play, Sparkles, Cpu, Eye, Info, RefreshCw, SwatchBook, HelpCircle } from "lucide-react";

interface ControlOverlayProps {
  status: "setup" | "playing" | "checkmate" | "stalemate" | "exterminated_king" | "draw";
  winner: Faction | "draw" | null;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onResetGame: () => void;
}

export function ControlOverlay({
  status,
  winner,
  selectedMode,
  onSelectMode,
  onStartGame,
  onResetGame,
}: ControlOverlayProps) {
  if (status === "playing") return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md overflow-y-auto flex justify-center items-start p-4 sm:p-6 font-sans">
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(30,41,59,0.5)] overflow-hidden flex flex-col my-auto">
        
        {/* Divine Cyber-Title Banner */}
        <div className="bg-gradient-to-r from-amber-600/20 via-slate-950 to-emerald-600/20 py-8 px-6 border-b border-slate-800 text-center relative">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-amber-500/30 text-4xl select-none font-serif">✝</div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-emerald-500/30 text-4xl select-none font-mono">◉</div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-serif bg-gradient-to-r from-amber-200 via-white to-emerald-200 bg-clip-text text-transparent">
            DARLEK CAAN vs JESUS CHESS
          </h1>
        </div>

        {/* Content Container */}
        <div className="p-6 sm:p-8 flex-1 space-y-6">
          
          {/* SETUP SCREEN */}
          {status === "setup" && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-slate-400 text-xs font-mono tracking-wider uppercase block text-center">
                  SELECT CONFLICT SPECTRUM MODE
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="mode_grid">
                  <button
                    onClick={() => onSelectMode("jesus-vs-caan-ai")}
                    className={`p-4 border text-left rounded-xl transition flex flex-col gap-1 ${
                      selectedMode === "jesus-vs-caan-ai"
                        ? "bg-amber-950/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] text-amber-100"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                    id="mode_jesus_vs_ai"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Play as Jesus (Divine Faction)
                    </div>
                    <span className="text-xs text-slate-400">Pitting your miracles against Dalek Caan's predictive calculations</span>
                  </button>

                  <button
                    onClick={() => onSelectMode("caan-vs-jesus-ai")}
                    className={`p-4 border text-left rounded-xl transition flex flex-col gap-1 ${
                      selectedMode === "caan-vs-jesus-ai"
                        ? "bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] text-emerald-100"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                    id="mode_caan_vs_ai"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      Play as Darlek Caan
                    </div>
                    <span className="text-xs text-slate-400">Unleash laser exterminations on holy apostles</span>
                  </button>

                  <button
                    onClick={() => onSelectMode("ai-vs-ai")}
                    className={`p-4 border text-left rounded-xl transition flex flex-col gap-1 ${
                      selectedMode === "ai-vs-ai"
                        ? "bg-indigo-950/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)] text-indigo-100"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                    id="mode_spectator"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Eye className="w-4 h-4 text-indigo-400" />
                      Deity Spectator Match (AI vs AI)
                    </div>
                    <span className="text-xs text-slate-400">Lean back and watch the computer clash with fully-narrated Gemini commentary</span>
                  </button>

                  <button
                    onClick={() => onSelectMode("local-coop")}
                    className={`p-4 border text-left rounded-xl transition flex flex-col gap-1 ${
                      selectedMode === "local-coop"
                        ? "bg-slate-850 border-slate-400 text-white"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                    id="mode_hotseat"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <RefreshCw className="w-4 h-4 text-slate-400" />
                      Local Hotseat Duel (Local Co-op)
                    </div>
                    <span className="text-xs text-slate-400">Pass-and-play with a friend using both divine custom miracle powersets</span>
                  </button>
                </div>
              </div>

              {/* Faction Power Details Showcase */}
              <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 gap-4 grid grid-cols-2 text-xs">
                <div>
                  <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    DIVINE COGNITION:
                  </h3>
                  <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                    <li><strong className="text-amber-100">Water to Wine</strong> Upgrades Pawn to Wine Knight (highly mobile)</li>
                    <li><strong className="text-amber-100">Lazarus</strong> Revive fallen friendly pieces</li>
                    <li><strong className="text-amber-100">Loaves & Fishes</strong> Duplicate active pawns</li>
                    <li><strong className="text-amber-100">Ascension</strong> Fully shield a piece from captures</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-emerald-300 font-bold mb-2 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    TEMPORAL WEAPONRY:
                  </h3>
                  <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                    <li><strong className="text-emerald-100">Exterminate</strong> Blow up any enemy unit instantly</li>
                    <li><strong className="text-emerald-100">Cyber-Upgrade</strong> Build powerful multi-moving Cyber-Drones</li>
                    <li><strong className="text-emerald-100">Temporal Shift</strong> Relocate/swap coordinates freely</li>
                    <li><strong className="text-emerald-100">Chronos Warp</strong> Freeze board cells from movement</li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={onStartGame}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 font-bold text-slate-950 rounded-xl transition shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:scale-105 inline-flex items-center gap-2 text-sm"
                  id="btn_commence"
                >
                  <Play className="w-4 h-4 fill-current" />
                  COMMENCE COSMIC STEPS
                </button>
              </div>
            </div>
          )}

          {/* GAME OVER MODULE */}
          {status !== "setup" && (
            <div className="space-y-6 text-center py-4">
              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl relative overflow-hidden">
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block mb-1">
                  TACTICAL RESOLUTION STATUS
                </span>
                
                {status === "checkmate" && (
                  <div>
                    <h2 className="text-3xl font-extrabold text-[#f43f5e] uppercase tracking-wide mb-2">
                      CHECKMATE RESOLVED
                    </h2>
                    <p className="text-sm text-slate-300">
                      Winner:{" "}
                      <span className={winner === "jesus" ? "text-amber-400 font-bold font-serif" : "text-emerald-400 font-bold font-mono"}>
                        {winner === "jesus" ? "✝ JESUS CHRIST (Divine Triumph)" : "◉ DALEK CAAN (Logic Overruled)"}
                      </span>
                    </p>
                  </div>
                )}

                {status === "exterminated_king" && (
                  <div>
                    <h2 className="text-3xl font-extrabold text-red-500 uppercase tracking-wide mb-2">
                      KING VAPORIZED
                    </h2>
                    <p className="text-sm text-slate-300">
                      Winner:{" "}
                      <span className={winner === "jesus" ? "text-amber-400 font-bold font-serif" : "text-emerald-400 font-bold font-mono"}>
                        {winner === "jesus" ? "✝ JESUS CHRIST (Grace Retained)" : "◉ DALEK CAAN (EXTERMINATION COMPLETE)"}
                      </span>
                    </p>
                  </div>
                )}

                {status === "stalemate" && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-wide mb-2">
                      QUANTUM STALEMATE
                    </h2>
                    <p className="text-sm text-slate-400">
                      Infinity loop parsed. Neither grace nor metal could assert dominance.
                    </p>
                  </div>
                )}

                {status === "draw" && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-wide mb-2">
                      SOVEREIGN PEACE
                    </h2>
                    <p className="text-sm text-slate-400">
                      The coordinates have agreed to terms of dimensional compromise.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={onResetGame}
                  className="px-6 py-2 bg-slate-805 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold rounded-xl transition inline-flex items-center gap-2 text-xs"
                  id="btn_over_restart"
                >
                  <RefreshCw className="w-4 h-4" />
                  INITIATE NEW COSMIC CYCLE
                </button>
              </div>
            </div>
          )}

          {/* Prompt panel details context */}
          <div className="text-center">
            <span className="text-[10px] text-slate-600 font-mono flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Configure your GEMINI_API_KEY in the Secrets menu to unleash real-time dialog comments!
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
