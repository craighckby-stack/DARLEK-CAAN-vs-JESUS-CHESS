import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useGameOrchestrator } from './hooks/useGameOrchestrator';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { SystemTelemetry } from './components/SystemTelemetry';

const ChessBoard = lazy(() => import('./components/ChessBoard'));
const CommentaryPanel = lazy(() => import('./components/CommentaryPanel'));
const ControlOverlay = lazy(() => import('./components/ControlOverlay'));

/**
 * DARLEK CANN v3.0 // OMEGA CORE
 * Epistemic Conflict Engine: Jesus vs Caan
 * Architecture: Next.js + Agent Orchestra + Quantum Telemetry
 */
export default function App() {
  const {
    board, turn, status, pp, isThinking, chats, 
    executeMove, resetGame, triggerCaanProtocol, setStatus
  } = useGameOrchestrator();

  useKeyboardShortcuts({
    Escape: () => setStatus('setup'),
    'c': triggerCaanProtocol,
    'r': resetGame
  });

  return (
    <ErrorBoundary fallback={<div className="p-10 text-rose-500">SYSTEM_CRITICAL_FAILURE: REBOOT_REQUIRED</div>}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 overflow-hidden">
        <header className="p-4 border-b border-slate-800 flex justify-between items-center backdrop-blur-md z-50">
          <h1 className="text-xl font-bold tracking-tighter text-rose-500">
            DARLEK CANN v3.0 // <span className="text-slate-400">OMEGA_CHESS</span>
          </h1>
          <SystemTelemetry pp={pp} turn={turn} status={status} />
        </header>
        
        <main className="flex-1 flex p-6 gap-6 max-w-7xl mx-auto w-full">
          <Suspense fallback={<div className="flex-1 animate-pulse bg-slate-900 rounded-xl" />}>
            <div className="flex-1 flex items-center justify-center">
              <ChessBoard board={board} onSquareClick={executeMove} disabled={isThinking} />
            </div>
            
            <aside className="w-96 flex flex-col gap-4">
              <CommentaryPanel chats={chats} isThinking={isThinking} />
              <ControlOverlay 
                onReset={resetGame} 
                onCheat={triggerCaanProtocol} 
                disabled={isThinking}
              />
            </aside>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}












































