import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.operationType && parsed.authInfo) {
            isFirestoreError = true;
            errorMessage = `Firestore ${parsed.operationType.toUpperCase()} error at path: ${parsed.path || 'unknown'}. ${parsed.error}`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full border border-red-900/30 bg-[#0A0000] p-8 rounded-lg shadow-2xl relative overflow-hidden">
            {/* Glitch Effect Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-950/50 rounded border border-red-900/50 animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h1 className="text-xl font-bold text-red-500 tracking-tighter uppercase italic">Neural Collapse</h1>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-black border border-red-900/20 rounded text-[10px] text-red-400/80 leading-relaxed overflow-auto max-h-48 font-mono">
                  <div className="font-bold mb-1 text-red-500 uppercase tracking-widest text-[8px]">Synaptic Error Signature:</div>
                  {errorMessage}
                </div>
                
                {isFirestoreError && (
                  <p className="text-[9px] text-red-600/60 italic uppercase tracking-tight">
                    CRITICAL: Security rules or authentication state preventing neural synchronization.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 p-3 bg-red-950/20 border border-red-900/50 text-red-500 hover:bg-red-900/30 transition-all rounded text-[10px] font-bold uppercase tracking-widest"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reboot System
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex items-center justify-center gap-2 p-3 bg-[#111] border border-[#222] text-gray-500 hover:text-white transition-all rounded text-[10px] font-bold uppercase tracking-widest"
                >
                  <Home className="w-3 h-3" />
                  Return Home
                </button>
              </div>
            </div>

            {/* Decorative Scanline */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/10 animate-scanline pointer-events-none" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

