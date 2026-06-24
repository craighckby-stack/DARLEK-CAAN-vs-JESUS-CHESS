/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Board, Cell, Coord, Faction } from "../types";
import { Shield, Sparkles, Zap, Box, RefreshCw } from "lucide-react";

interface ChessBoardProps {
  board: Board;
  turn: Faction;
  selectedCoord: Coord | null;
  validMoves: Coord[];
  activePower: string | null;
  onCellClick: (coord: Coord) => void;
  isThinking: boolean;
}

export function ChessBoard({
  board,
  turn,
  selectedCoord,
  validMoves,
  activePower,
  onCellClick,
  isThinking,
}: ChessBoardProps) {
  
  // Transform standard indexes to chess board notations
  const columnsLabel = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const rowsLabel = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const getPieceSymbol = (cell: Cell): string => {
    if (!cell) return "";
    const { type } = cell;
    
    // Use clear, high-contrast, large UTF-8 chess symbols with specialized fonts
    switch (type) {
      case "k": return "♚";
      case "q": return "♛";
      case "r": return "♜";
      case "b": return "♝";
      case "n": return "♞";
      case "p": return "♟";
      case "wine_knight": return "♞"; // Knight base
      case "cyber_drone": return "♟"; // Pawn base
      default: return "";
    }
  };

  const getCellClasses = (r: number, c: number): string => {
    const isDark = (r + c) % 2 === 1;
    let base = isDark 
      ? "bg-[#0b0f19] border border-slate-900" 
      : "bg-[#182030] border border-slate-900";
    
    // Highlight cells under active spell targeted selection
    const isValidMove = validMoves.some((m) => m.row === r && m.col === c);
    const isSelected = selectedCoord && selectedCoord.row === r && selectedCoord.col === c;

    if (isSelected) {
      base += turn === "jesus" 
        ? " ring-4 ring-amber-500/80 ring-inset bg-amber-950/20" 
        : " ring-4 ring-emerald-500/80 ring-inset bg-emerald-950/20";
    } else if (isValidMove) {
      // Shimmer overlay target circles for active powers vs normal moves
      base += activePower 
        ? " bg-indigo-950/50 cursor-pointer animate-pulse" 
        : " bg-blue-950/30 cursor-pointer";
    }

    return base;
  };

  return (
    <div className="relative border-4 border-slate-950 rounded-2xl bg-slate-950/50 p-2 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
      
      {/* Board scanning CRT glass effect for Sci-fi atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.15))] z-10" />

      <div className="grid grid-cols-8 gap-0 border border-slate-900" id="chess_grid">
        {board.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            const isValidTarget = validMoves.some((m) => m.row === r && m.col === c);
            const isSelected = selectedCoord && selectedCoord.row === r && selectedCoord.col === c;

            return (
              <div
                key={`cell_${r}_${c}`}
                onClick={() => !isThinking && onCellClick({ row: r, col: c })}
                className={`relative aspect-square flex items-center justify-center select-none group transition-all duration-200 ${getCellClasses(
                  r,
                  c
                )}`}
                id={`cell_${r}_${c}`}
              >
                {/* Board Rank labels inside outer edges */}
                {c === 0 && (
                  <span className="absolute top-1 left-1 text-[8px] sm:text-[10px] text-slate-500/60 font-mono font-bold select-none pointer-events-none">
                    {rowsLabel[r]}
                  </span>
                )}
                {r === 7 && (
                  <span className="absolute bottom-1 right-1 text-[8px] sm:text-[10px] text-slate-500/60 font-mono font-bold select-none pointer-events-none">
                    {columnsLabel[c]}
                  </span>
                )}

                {/* Valid Target highlighted sphere indicator */}
                {isValidTarget && !cell && (
                  <div className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full ${
                    activePower 
                      ? "bg-gradient-to-r from-red-500 to-indigo-505 animate-ping opacity-75" 
                      : "bg-amber-400/30 group-hover:bg-amber-400/50"
                  } transition`} />
                )}

                {/* Render game piece */}
                {cell && (
                  <div
                    className={`relative w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      cell.faction === "jesus"
                        ? "text-white bg-slate-950/40 border border-white/20 hover:scale-105 shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                        : "text-slate-950 bg-slate-100 border-2 border-slate-950 hover:scale-105 shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
                    }`}
                  >
                    
                    {/* Glowing active selections styles */}
                    {isSelected && (
                      <div className={`absolute -inset-1 rounded-full animate-ping opacity-50 ${
                        cell.faction === "jesus" ? "bg-white" : "bg-slate-400"
                      }`} />
                    )}

                    {/* Jesus Ascension celestial aura halo */}
                    {cell.isAscended && (
                      <div className="absolute -inset-1.5 sm:-inset-2 border-2 border-white rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)] bg-white/10 flex items-center justify-center">
                        <Shield className="absolute top-[-8px] text-white w-3 h-3 sm:w-4 sm:h-4 fill-slate-950" />
                      </div>
                    )}

                    {/* Cyber Drone upgrade outline borders */}
                    {cell.type === "cyber_drone" && (
                      <div className="absolute -inset-1 border border-slate-950 border-dashed rounded-full animate-spin bg-slate-950/5 flex items-center justify-center">
                        <Zap className="absolute bottom-[-6px] text-slate-950 w-3 h-3 fill-white" />
                      </div>
                    )}

                    {/* Wine upgraded indicator */}
                    {cell.type === "wine_knight" && (
                      <div className="absolute -inset-1 border border-white/60 rounded-full bg-white/5 flex items-center justify-center">
                        <Sparkles className="absolute top-[-6px] right-[-6px] text-white w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Custom styling on mechanical faction compared to pure grace faction */}
                    <div
                      className={`relative z-10 w-full h-full flex items-center justify-center select-none overflow-hidden rounded-full ${
                        cell.faction === "jesus"
                          ? "drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] text-white"
                          : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-slate-950"
                      }`}
                    >
                      {cell.avatar ? (
                        <img src={cell.avatar} alt={cell.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl sm:text-4xl font-medium">{getPieceSymbol(cell)}</span>
                      )}
                    </div>

                    {/* Label Badge underneath characters for absolute clarity */}
                    <div className="absolute bottom-0 text-[7px] sm:text-[9px] font-mono tracking-tighter uppercase px-1 rounded bg-slate-950/80 select-none hidden group-hover:block transition-all z-20">
                      {cell.type === "wine_knight" 
                        ? "W-Knight" 
                        : cell.type === "cyber_drone" 
                          ? "Cyber" 
                          : cell.type.toUpperCase()}
                    </div>

                    {/* Target highlight overlay count */}
                    {isValidTarget && (
                      <div className="absolute -inset-1 bg-red-950/40 border-2 border-red-600 rounded-full animate-pulse z-10" />
                    )}

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Side-state tracker overlay */}
      {isThinking && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-30">
          <div className="px-6 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-3 shadow-lg">
            <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-xs text-indigo-200 font-mono tracking-wider font-semibold">
              CALCULATING QUANTUM PARALOG...
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
