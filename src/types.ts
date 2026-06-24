/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Faction = "jesus" | "caan";

export type PieceType =
  | "p" // Pawn
  | "r" // Rook
  | "n" // Knight
  | "b" // Bishop
  | "q" // Queen
  | "k" // King
  | "wine_knight" // Jesus unique upgraded unit
  | "cyber_drone"; // Darlek Caan unique upgraded unit

export interface Piece {
  id: string;
  type: PieceType;
  faction: Faction;
  hasMoved: boolean;
  isAscended?: boolean; // Jesus Protection
  ascendedTurns?: number; // Protection durations
  isCyber?: boolean; // Cyber upgraded status
  name?: string; // e.g. "Apostle Peter"
  avatar?: string; // Image avatar path
  personality?: string; // Character trait description
  voiceDesc?: string; // Short bio or instruction for AI voice dialogue
  moveStyle?: "aggressive" | "cautious" | "balanced" | "erratic" | "protective"; // Strategic weighting flag
}

export type Cell = Piece | null;

export type Board = Cell[][];

export type Coord = {
  row: number;
  col: number;
};

export type GameMode = "jesus-vs-caan-ai" | "caan-vs-jesus-ai" | "ai-vs-ai" | "local-coop";

export interface ChatMessage {
  id: string;
  speaker: "jesus" | "caan" | "system";
  text: string;
  timestamp: string;
}

export interface CouncilDebate {
  proposerName: string;
  proposerText: string;
  proposerStyle: string;
  advisorName: string;
  advisorText: string;
  advisorRole: string;
  commanderText: string;
}

export interface GameState {
  board: Board;
  turn: Faction;
  history: string[];
  jesusPP: number; // Faith/Miracle points
  caanPP: number; // Temporal/Cyber points
  mode: GameMode;
  status: "setup" | "playing" | "checkmate" | "stalemate" | "exterminated_king" | "draw";
  winner: Faction | "draw" | null;
  selectedCoord: Coord | null;
  validMoves: Coord[];
  activePower: string | null; // Currently armed power name
  chats: ChatMessage[];
  isThinking: boolean;
  latestDebate?: CouncilDebate;
}

export type PowerID =
  // Jesus powers
  | "water_to_wine"
  | "resurrection"
  | "loaves_and_fishes"
  | "divine_protection"
  | "forgiveness"
  // Caan powers
  | "temporal_shift"
  | "exterminate"
  | "cyber_upgrade"
  | "chronos_distortion"
  | "temporal_barrier";

export interface PowerSpec {
  id: PowerID;
  name: string;
  cost: number;
  description: string;
  faction: Faction;
  requiresTarget: "friendly" | "enemy" | "empty" | "any" | "captured" | "none";
}




