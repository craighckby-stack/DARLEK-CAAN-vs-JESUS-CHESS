/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * DARLEK CANN v3.0 - Unified System Architecture Definitions
 */

// --- Core Dimensional Types ---
export type Vector3D = { x: number; y: number; z: number };
export type Coord = { row: number; col: number };

// --- Faction & Identity ---
export type Faction = 'jesus' | 'caan';
export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k' | 'wine_knight' | 'cyber_drone';

// --- Agent Orchestra & Quantum State ---
export interface AgentState {
  id: string;
  personality: 'aggressive' | 'cautious' | 'balanced' | 'erratic' | 'protective';
  intelligenceTier: 1 | 2 | 3;
  quantumEntropy: number;
  lastThoughtProcess: string;
  memoryBuffer: string[];
  isLocked: boolean;
}

// --- Piece & Entity Definitions ---
export interface PieceMetadata {
  isAscended?: boolean;
  ascendedTurns?: number;
  isCyber?: boolean;
  name?: string;
  avatar?: string;
  quantumSignature?: Vector3D;
}

export interface Piece {
  id: string;
  type: PieceType;
  faction: Faction;
  hasMoved: boolean;
  position: Coord;
  metadata: PieceMetadata;
  agent: AgentState;
}

export type Cell = Piece | null;
export type Board = Cell[][];

// --- Game & Debate Logic ---
export type GameMode = 'jesus-vs-caan-ai' | 'caan-vs-jesus-ai' | 'ai-vs-ai' | 'local-coop';

export interface ChatMessage {
  id: string;
  speaker: Faction | 'system';
  text: string;
  timestamp: number;
  contextVector?: number[];
}

export interface DebateEngine {
  topic: string;
  proposer: { name: string; text: string; style: string };
  advisor: { name: string; text: string; role: string };
  verdict: string | null;
  fallbackTier: 1 | 2 | 3;
}

// --- Power Systems ---
export type PowerID = 'water_to_wine' | 'resurrection' | 'loaves_and_fishes' | 'divine_protection' | 'forgiveness' | 'temporal_shift' | 'exterminate' | 'cyber_upgrade' | 'chronos_distortion' | 'temporal_barrier';

export interface PowerSpec {
  id: PowerID;
  name: string;
  cost: number;
  cooldown: number;
  effectRadius: number;
  description: string;
  faction: Faction;
  targetType: 'friendly' | 'enemy' | 'empty' | 'any' | 'captured' | 'none';
}

// --- Global State & Metrics ---
export interface GameState {
  board: Board;
  turn: Faction;
  history: string[];
  resources: { jesusPP: number; caanPP: number };
  mode: GameMode;
  status: 'setup' | 'playing' | 'checkmate' | 'stalemate' | 'exterminated_king' | 'draw';
  selectedCoord: Coord | null;
  validMoves: Coord[];
  activePower: PowerID | null;
  chats: ChatMessage[];
  isThinking: boolean;
  debate: DebateEngine | null;
  quantumFlux: number;
}

export interface SystemMetrics {
  latencyMs: number;
  tokenUsage: number;
  activeAgents: number;
  memoryPressure: number;
  nodeHealth: 'stable' | 'degraded' | 'critical';
}

// --- Event Bus ---
export interface SystemEvent {
  type: 'MOVE_EXECUTED' | 'POWER_ACTIVATED' | 'AGENT_THOUGHT' | 'DEBATE_VERDICT';
  payload: any;
  timestamp: number;
}














