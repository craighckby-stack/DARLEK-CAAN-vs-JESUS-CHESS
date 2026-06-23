import React, { useMemo, memo, useCallback } from 'react';
import { Board, Cell, Coord, Faction } from '../types';
import { Shield, Sparkles, Zap, RefreshCw, Cpu, AlertTriangle } from 'lucide-react';

const SYMBOL_MAP: Record<string, string> = {
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟', 
  wine_knight: '♞', cyber_drone: '♟', ascended_king: '♔'
};

const PieceRenderer = memo(({ cell }: { cell: Cell }) => (
  <div className={`relative w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${cell.faction === 'jesus' ? 'bg-slate-950/80 border border-white/20' : 'bg-slate-100 border-2'}`}>
    {cell.isAscended && <div className="absolute -inset-1.5 border-2 border-white rounded-full animate-pulse bg-white/10"><Shield className="absolute -top-2 w-4 h-4 fill-slate-950" /></div>}
    {cell.type === 'cyber_drone' && <div className="absolute -inset-1 border border-dashed rounded-full animate-spin"><Zap className="absolute -bottom-2 w-3 h-3 fill-white" /></div>}
    {cell.type === 'wine_knight' && <div className="absolute -inset-1 border border-white/60 rounded-full"><Sparkles className="absolute -top-2 -right-2 w-3 h-3" /></div>}
    <span className="text-2xl sm:text-4xl z-10">{SYMBOL_MAP[cell.type] || ''}</span>
  </div>
));

interface ChessBoardProps {
  board: Board;
  turn: Faction;
  selectedCoord: Coord | null;
  validMoves: Coord[];
  activePower: string | null;
  onCellClick: (coord: Coord) => void;
  isThinking: boolean;
}

export const ChessBoard = memo(({ board, turn, selectedCoord, validMoves, activePower, onCellClick, isThinking }: ChessBoardProps) => {
  const moveMap = useMemo(() => new Set(validMoves.map(m => `${m.row},${m.col}`)), [validMoves]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (!isThinking) onCellClick({ row: r, col: c });
  }, [isThinking, onCellClick]);

  return (
    <div className="relative border-4 border-slate-950 rounded-2xl bg-slate-950/50 p-4 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.3))] z-10" />
      <div className="grid grid-cols-8 gap-0 border border-slate-900">
        {board.map((rowArr, r) => rowArr.map((cell, c) => {
          const isSelected = selectedCoord?.row === r && selectedCoord?.col === c;
          const isValid = moveMap.has(`${r},${c}`);
          const isDark = (r + c) % 2 === 1;
          return (
            <div 
              key={`${r}-${c}`} 
              onClick={() => handleCellClick(r, c)} 
              className={`relative aspect-square flex items-center justify-center select-none transition-all ${isDark ? 'bg-[#0b0f19]' : 'bg-[#182030]'} ${isSelected ? 'ring-4 ring-inset ring-amber-500/80 bg-amber-950/20' : ''} ${isValid ? 'cursor-pointer hover:bg-blue-900/20' : ''}`}>
              {isValid && !cell && <div className={`w-3 h-3 rounded-full ${activePower ? 'bg-indigo-500 animate-ping' : 'bg-amber-400/30'}`} />}
              {cell && <PieceRenderer cell={cell} />}
            </div>
          );
        }))}
      </div>
      {isThinking && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Cpu className="w-12 h-12 text-indigo-500 animate-pulse" />
            <span className="text-xs text-indigo-300 font-mono tracking-[0.2em]">QUANTUM_CALCULATION_ACTIVE</span>
          </div>
        </div>
      )}
    </div>
  );
});
































