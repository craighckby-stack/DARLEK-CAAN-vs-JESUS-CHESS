/**
 * DALEK CAAN CHESS ENGINE - TYPE DEFINITIONS
 * Siphoned from unitary-core, psr-governance, and darlek-cann-v3
 */

export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface ChessPiece {
  id: string;
  type: PieceType;
  color: PieceColor;
  square: string; // e.g., 'e4'
  isResurrected?: boolean;
  isRedeemed?: boolean;
}

export interface BoardState {
  pieces: Record<string, ChessPiece>; // Map of square to piece
  turn: PieceColor;
  halfMoveClock: number;
  fullMoveNumber: number;
  capturedPieces: {
    w: ChessPiece[];
    b: ChessPiece[];
  };
}

export interface HeuristicEvaluation {
  score: number;
  materialScore: number;
  positionalScore: number;
  ethicalScore: number;
  chaosNoise?: number;
}

export type InterventionType = 
  | 'VAPORIZE' 
  | 'SPAWN_DRONE' 
  | 'TELEPORT' 
  | 'CELESTIAL_RESURRECTION' 
  | 'SACRED_REDEMPTION';

export interface InterventionEvent {
  id: string;
  type: InterventionType;
  actor: 'DALEK' | 'JESUS';
  timestamp: number;
  details: {
    targetSquare?: string;
    sourceSquare?: string;
    pieceId?: string;
    pieceType?: PieceType;
  };
  isChallenged: boolean;
  isReverted: boolean;
}

export interface GovernanceMetrics {
  securityStateEntropy: number; // Se
  antifragilityIndex: number;   // A
  ethicalAlignmentVector: {     // E
    harmony: number;
    destruction: number;
  };
}

export interface EngineConfig {
  dalekChaosCoefficient: number; // χ
  jesusCommunityMultiplier: number; // γ
  cheatProbability: number; // Default 0.25
  miracleProbability: number; // Default 0.12
  useLLMFallback: boolean;
}

export interface SubscriptionTeardown {
  unsubscribe: () => void;
}







































