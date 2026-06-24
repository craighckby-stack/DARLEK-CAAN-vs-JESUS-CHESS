'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Zap, Eye, Terminal, Settings, ChevronRight, AlertTriangle, Clock, Radio } from 'lucide-react';
import { COLORS, ORCHESTRA_AGENTS } from '@/lib/constants';
import type {
  OrchestraMode,
  OrchestraAgentConfig,
  OrchestraAgentStatus,
  OrchestraDebateTurn,
  OrchestraDiagnosticLog,
} from '@/lib/types';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface AgentState {
  id: string;
  name: string;
  color: string;
  icon: string;
  status: OrchestraAgentStatus;
  response: string;
  provider: string;
  latencyMs: number;
}

interface AgentOrchestraProps {
  apiKeys: Record<string, string>;
  onClose: () => void;
}

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────

function createLogId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function getStatusColor(status: OrchestraAgentStatus): string {
  switch (status) {
    case 'idle': return COLORS.textMuted;
    case 'thinking': return COLORS.gold;
    case 'responded': return COLORS.green;
    case 'error': return COLORS.dalekRed;
    default: return COLORS.textMuted;
  }
}

function getStatusLabel(status: OrchestraAgentStatus): string {
  switch (status) {
    case 'idle': return 'IDLE';
    case 'thinking': return 'THINKING...';
    case 'responded': return 'RESPONDED';
    case 'error': return 'ERROR';
    default: return 'UNKNOWN';
  }
}

// ─────────────────────────────────────────────
// Agent Config Modal
// ─────────────────────────────────────────────

function AgentConfigModal({
  configs,
  onUpdate,
  onClose,
}: {
  configs: OrchestraAgentConfig[];
  onUpdate: (idx: number, instruction: string) => void;
  onClose: () => void;
}) {
  const [editingIdx, setEditingIdx] = useState(0);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.85)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dalek-panel rounded-lg w-full max-w-2xl max-h-[80vh] mx-4 flex flex-col"
        style={{ border: `1px solid ${COLORS.panelBorder}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: `1px solid ${COLORS.panelBorder}` }}
        >
          <div
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: COLORS.gold,
              fontWeight: 600,
            }}
          >
            <Settings size={12} className="inline mr-2" style={{ verticalAlign: 'middle' }} />
            AGENT PAYLOAD CONFIGURATION
          </div>
          <button
            onClick={onClose}
            className="transition-colors duration-200"
            style={{ color: COLORS.textMuted }}
            onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.dalekRed; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Agent tabs */}
        <div className="flex gap-1 px-4 pt-3 flex-shrink-0">
          {configs.map((cfg, idx) => (
            <button
              key={cfg.id}
              onClick={() => setEditingIdx(idx)}
              className="px-3 py-1.5 transition-all duration-200"
              style={{
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: '9px',
                letterSpacing: '0.08em',
                color: editingIdx === idx ? cfg.color : COLORS.textMuted,
                background: editingIdx === idx ? `${cfg.color}10` : 'transparent',
                border: `1px solid ${editingIdx === idx ? `${cfg.color}40` : 'transparent'}`,
                borderRadius: '2px',
              }}
            >
              {cfg.icon} {cfg.name}
            </button>
          ))}
        </div>

        {/* Edit area */}
        <div className="flex-1 min-h-0 px-4 py-3 flex flex-col">
          <div
            className="mb-2 flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: '9px',
              letterSpacing: '0.1em',
              color: configs[editingIdx].color,
            }}
          >
            {configs[editingIdx].icon} {configs[editingIdx].name} — SYSTEM INSTRUCTION
          </div>
          <textarea
            value={configs[editingIdx].systemInstruction}
            onChange={(e) => onUpdate(editingIdx, e.target.value)}
            className="dalek-input flex-1 min-h-[200px] resize-none p-3 rounded"
            style={{
              fontFamily: 'var(--font-share-tech-mono), monospace',
              fontSize: '11px',
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Footer */}
        <div
          className="flex justify-end px-4 py-3 flex-shrink-0"
          style={{ borderTop: `1px solid ${COLORS.panelBorder}` }}
        >
          <button
            onClick={onClose}
            className="dalek-btn dalek-btn-secondary px-4 py-2"
            style={{ fontSize: '10px' }}
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// API Diagnostic Console
// ─────────────────────────────────────────────

function DiagnosticConsole({
  logs,
  visible,
}: {
  logs: OrchestraDiagnosticLog[];
  visible: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && visible) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, visible]);

  if (!visible) return null;

  const logTypeColor = (type: OrchestraDiagnosticLog['type']) => {
    switch (type) {
      case 'call': return COLORS.gold;
      case 'response': return COLORS.green;
      case 'error': return COLORS.dalekRed;
      case 'info': return COLORS.cyan;
    }
  };

  const logTypeIcon = (type: OrchestraDiagnosticLog['type']) => {
    switch (type) {
      case 'call': return '→';
      case 'response': return '✓';
      case 'error': return '✗';
      case 'info': return '●';
    }
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid ${COLORS.panelBorder}`, background: COLORS.darkPanel }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          borderBottom: `1px solid ${COLORS.panelBorder}`,
          fontFamily: 'var(--font-orbitron), sans-serif',
          fontSize: '8px',
          letterSpacing: '0.12em',
          color: COLORS.textMuted,
        }}
      >
        <Terminal size={10} style={{ color: COLORS.green }} />
        API DIAGNOSTIC CONSOLE
        <span className="ml-auto" style={{ color: COLORS.textMuted, fontFamily: 'var(--font-share-tech-mono), monospace' }}>
          {logs.length} entries
        </span>
      </div>
      <div
        ref={scrollRef}
        className="dalek-scrollbar p-2 space-y-1 max-h-48 overflow-y-auto"
        style={{ fontFamily: 'var(--font-share-tech-mono), monospace', fontSize: '10px', lineHeight: 1.4 }}
      >
        {logs.length === 0 && (
          <div style={{ color: COLORS.textMuted, padding: '8px', textAlign: 'center' }}>
            No diagnostic entries yet. Run the orchestra to generate logs.
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 px-1 py-0.5" style={{ color: logTypeColor(log.type) }}>
            <span style={{ opacity: 0.5, flexShrink: 0, fontSize: '9px' }}>
              {log.timestamp.split('T')[1]?.split('.')[0] || ''}
            </span>
            <span style={{ flexShrink: 0 }}>{logTypeIcon(log.type)}</span>
            {log.agent && (
              <span style={{ color: COLORS.textDim, flexShrink: 0 }}>[{log.agent}]</span>
            )}
            <span style={{ color: logTypeColor(log.type), wordBreak: 'break-word' }}>{log.message}</span>
            {log.latencyMs !== undefined && (
              <span style={{ color: COLORS.textMuted, flexShrink: 0, marginLeft: 'auto', fontSize: '9px' }}>
                {log.latencyMs}ms
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main AgentOrchestra Component
// ─────────────────────────────────────────────

export default function AgentOrchestra({ apiKeys, onClose }: AgentOrchestraProps) {
  // ── State ──
  const [mode, setMode] = useState<OrchestraMode>('parallel');
  const [topic, setTopic] = useState('');
  const [rounds, setRounds] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const [agentConfigs, setAgentConfigs] = useState<OrchestraAgentConfig[]>(
    ORCHESTRA_AGENTS.map((a) => ({
      id: a.id,
      name: a.name,
      color: a.color,
      icon: a.icon,
      systemInstruction: a.systemInstruction,
    }))
  );

  const [agents, setAgents] = useState<AgentState[]>(
    ORCHESTRA_AGENTS.map((a) => ({
      id: a.id,
      name: a.name,
      color: a.color,
      icon: a.icon,
      status: 'idle' as OrchestraAgentStatus,
      response: '',
      provider: '',
      latencyMs: 0,
    }))
  );

  const [debateTurns, setDebateTurns] = useState<OrchestraDebateTurn[]>([]);
  const [logs, setLogs] = useState<OrchestraDiagnosticLog[]>([]);

  const topicInputRef = useRef<HTMLTextAreaElement>(null);

  // ── Add diagnostic log ──
  const addLog = useCallback((type: OrchestraDiagnosticLog['type'], agent: string | undefined, provider: string | undefined, message: string, latencyMs?: number) => {
    setLogs((prev) => [
      ...prev,
      {
        id: createLogId(),
        timestamp: new Date().toISOString(),
        type,
        agent,
        provider,
        message,
        latencyMs,
      },
    ].slice(-50));
  }, []);

  // ── Run orchestra ──
  const runOrchestra = useCallback(async () => {
    if (!topic.trim() || isRunning) return;
    setIsRunning(true);

    // Reset state
    setAgents((prev) =>
      prev.map((a) => ({
        ...a,
        status: 'idle',
        response: '',
        provider: '',
        latencyMs: 0,
      }))
    );
    setDebateTurns([]);
    setLogs([]);

    addLog('info', undefined, undefined, `Orchestra initiated — mode: ${mode.toUpperCase()}, rounds: ${mode === 'debate' ? rounds : 1}`);

    // Set all agents to thinking
    setAgents((prev) =>
      prev.map((a) => ({ ...a, status: 'thinking' }))
    );

    try {
      const res = await fetch('/api/evolution/orchestra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          topic: topic.trim(),
          rounds,
          apiKeys,
          agentConfigs,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Process logs from server
        if (data.logs) {
          setLogs((prev) => [
            ...prev,
            ...data.logs.map((l: OrchestraDiagnosticLog) => ({ ...l, id: createLogId() })),
          ].slice(-50));
        }

        if (mode === 'parallel' && data.agents) {
          // Parallel: update agent states directly
          setAgents((prev) =>
            prev.map((a) => {
              const result = data.agents.find((r: { agentId: string }) => r.agentId === a.id);
              if (result) {
                return {
                  ...a,
                  status: result.status === 'responded' ? 'responded' : 'error',
                  response: result.response,
                  provider: result.provider,
                  latencyMs: result.latencyMs,
                };
              }
              return { ...a, status: 'error', response: 'No response received.' };
            })
          );
        } else if (mode === 'debate' && data.turns) {
          // Debate: animate through turns
          const turns: OrchestraDebateTurn[] = data.turns;
          for (let i = 0; i < turns.length; i++) {
            const turn = turns[i];
            // Brief delay between rounds for visual effect
            if (i > 0) await new Promise((r) => setTimeout(r, 300));

            setDebateTurns((prev) => [...prev, turn]);

            // Update agent states with latest response
            for (const resp of turn.responses) {
              setAgents((prev) =>
                prev.map((a) =>
                  a.id === resp.agentId
                    ? {
                        ...a,
                        status: resp.status === 'responded' ? 'responded' : 'error',
                        response: resp.response,
                        provider: resp.provider,
                        latencyMs: resp.latencyMs,
                      }
                    : a
                )
              );
            }
          }
        }
      } else {
        setAgents((prev) =>
          prev.map((a) => ({ ...a, status: 'error', response: `Error: ${data.error || 'Unknown'}` }))
        );
        addLog('error', undefined, undefined, `Orchestra failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setAgents((prev) =>
        prev.map((a) => ({ ...a, status: 'error', response: `Network error: ${msg}` }))
      );
      addLog('error', undefined, undefined, `Network error: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  }, [topic, mode, rounds, apiKeys, agentConfigs, isRunning, addLog]);

  // ── Update agent config ──
  const handleUpdateConfig = useCallback((idx: number, instruction: string) => {
    setAgentConfigs((prev) =>
      prev.map((cfg, i) => (i === idx ? { ...cfg, systemInstruction: instruction } : cfg))
    );
  }, []);

  // ── Render ──
  return (
    <div
      className="relative flex flex-col"
      style={{
        background: 'linear-gradient(180deg, rgba(13, 0, 0, 0.98) 0%, rgba(5, 0, 0, 0.98) 100%)',
        minHeight: '100%',
      }}
    >
      {/* ── Config Modal Overlay ── */}
      {showConfig && (
        <AgentConfigModal
          configs={agentConfigs}
          onUpdate={handleUpdateConfig}
          onClose={() => setShowConfig(false)}
        />
      )}

      {/* ── Header Bar ── */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${COLORS.panelBorder}` }}
      >
        <div className="flex items-center gap-3">
          <d
