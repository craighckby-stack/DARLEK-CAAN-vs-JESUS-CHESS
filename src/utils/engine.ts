/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Board, Cell, Coord, Faction, Piece, PieceType } from "../types";

// Generate unique IDs for chess pieces to support key-identities in animations
export function generateId(): string {
  return "piece_" + Math.random().toString(36).substring(2, 11);
}

// Map piece value for AI evaluation
export const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
  wine_knight: 500, // Jesus upgraded Knight and Bishop slide combination
  cyber_drone: 480, // Dalek upgraded heavy trooper
};

export function initializePieceAgent(piece: Piece, row: number, col: number): Piece {
  const { faction, type } = piece;

  if (faction === "caan") {
    if (row === 0) {
      // Back row
      switch (col) {
        case 0:
          piece.name = "Dalek Sec";
          piece.avatar = "/src/assets/images/dalek_sec_1782272175102.jpg";
          piece.personality = "Cold, calculated black commander of the Cult of Skaro.";
          piece.voiceDesc = "refined, menacing, monotone Dalek leader";
          piece.moveStyle = "cautious";
          break;
        case 1:
          piece.name = "Cyber Leader";
          piece.avatar = "/src/assets/images/cyber_leader_1782272190073.jpg";
          piece.personality = "Unyielding commander of the tactical upgrade legions.";
          piece.voiceDesc = "cold, logical, metallic Cyberman commander";
          piece.moveStyle = "aggressive";
          break;
        case 2:
          piece.name = "Dalek Jast";
          piece.avatar = "/src/assets/images/dalek_jast_1782272204483.jpg";
          piece.personality = "Zealous Cult priest paranoid of timeline anomalies and miracles.";
          piece.voiceDesc = "screeching, paranoid Dalek sect leader";
          piece.moveStyle = "erratic";
          break;
        case 3:
          piece.name = "The Master";
          piece.avatar = "/src/assets/images/the_master_1782217040743.jpg";
          piece.personality = "A wicked, brilliant rogue Time Lord playing with drums in his head.";
          piece.voiceDesc = "devious, maniacal, charismatic rogue Time Lord";
          piece.moveStyle = "erratic";
          break;
        case 4:
          piece.name = "Black Dalek Caan";
          piece.avatar = "/src/assets/images/darlek_caan_1782217022852.jpg";
          piece.personality = "The absolutely insane, screeching Quantum Prophet of Skaro.";
          piece.voiceDesc = "insane screaming Dalek prophet screeching about catastrophic prophecies";
          piece.moveStyle = "balanced";
          break;
        case 5:
          piece.name = "Dalek Thay";
          piece.avatar = "/src/assets/images/dalek_thay_1782272593220.jpg";
          piece.personality = "Stubborn, heavily armored veteran member of the Skaro council.";
          piece.voiceDesc = "deep, defensive, unyielding Dalek veteran";
          piece.moveStyle = "protective";
          break;
        case 6:
          piece.name = "Cyber Infiltrator";
          piece.avatar = "/src/assets/images/cyber_infiltrator_1782272611844.jpg";
          piece.personality = "Espionage cyber-unit specialized in organic conversion.";
          piece.voiceDesc = "robotic, whispered cold upgrade assassin";
          piece.moveStyle = "aggressive";
          break;
        case 7:
          piece.name = "Supreme Dalek";
          piece.avatar = "/src/assets/images/supreme_dalek_1782272626775.jpg";
          piece.personality = "Booming flagship military general with massive shielding rules.";
          piece.voiceDesc = "loud, booming, arrogant Supreme Dalek militarist";
          piece.moveStyle = "protective";
          break;
      }
    } else if (row === 1) {
      // Pawns
      const pawnNames = [
        "Dalek Drone Alpha", "Cyberman Recruit", "Assault Dalek Beta", "Dalek Decimator",
        "Chronos Guard Dalek", "Temporal Scout Dalek", "Cyber Sentry Unit", "Dalek Emperor Guard"
      ];
      const pawnStyles: ("aggressive" | "cautious" | "balanced" | "erratic" | "protective")[] = [
        "aggressive", "cautious", "aggressive", "balanced", "erratic", "cautious", "aggressive", "protective"
      ];
      const pawnAvatars = [
        "/src/assets/images/dalek_drone_1782272218583.jpg",
        "/src/assets/images/cyberman_recruit_1782273293600.jpg",
        "/src/assets/images/assault_dalek_beta_1782273310567.jpg",
        "/src/assets/images/dalek_decimator_1782273324427.jpg",
        "/src/assets/images/chronos_guard_dalek_1782273342822.jpg",
        "/src/assets/images/temporal_scout_dalek_1782273358893.jpg",
        "/src/assets/images/cyber_sentry_unit_1782273375394.jpg",
        "/src/assets/images/supreme_dalek_1782272626775.jpg"
      ];
      piece.name = pawnNames[col];
      piece.avatar = pawnAvatars[col];
      piece.personality = `Standard ${piece.name.includes("Cyber") ? "Cybernetic" : "Dalek"} combat drone marching on Skaro orders.`;
      piece.voiceDesc = "monotone, mechanical soldier";
      piece.moveStyle = pawnStyles[col];
    }
  } else {
    // jesus faction
    if (row === 7) {
      // Back row
      switch (col) {
        case 0:
          piece.name = "Apostle Peter";
          piece.avatar = "/src/assets/images/apostle_peter_1782272113650.jpg";
          piece.personality = "The steadfast Rock of the Church, passionately loyal and defensive.";
          piece.voiceDesc = "resolute, brave, core foundational Apostle of holy fire";
          piece.moveStyle = "protective";
          break;
        case 1:
          piece.name = "Apostle Andrew";
          piece.avatar = "/src/assets/images/apostle_andrew_1782272127428.jpg";
          piece.personality = "Fisherman of men, courageous team builder and quiet helper.";
          piece.voiceDesc = "gentle, hardworking, encouraging fisherman Apostle";
          piece.moveStyle = "balanced";
          break;
        case 2:
          piece.name = "Apostle Thomas";
          piece.avatar = "/src/assets/images/apostle_thomas_1782272143448.jpg";
          piece.personality = "Highly analytical skeptic. Doubts move patterns until verified by eyes.";
          piece.voiceDesc = "doubting, highly cautious, analytical follower";
          piece.moveStyle = "cautious";
          break;
        case 3:
          piece.name = "Mother Mary";
          piece.avatar = "/src/assets/images/mary_portrait_1782217075178.jpg";
          piece.personality = "Queen of Heaven, compassionate guide wrapping allies in starry blue protection.";
          piece.voiceDesc = "magnificently peaceful, comforting maternal shield of heaven";
          piece.moveStyle = "protective";
          break;
        case 4:
          piece.name = "Jesus Christ";
          piece.avatar = "/src/assets/images/jesus_portrait_1782217061915.jpg";
          piece.personality = "The Savior and Prince of Peace, teaching cosmic grace and parables.";
          piece.voiceDesc = "beautifully serene, profoundly wise, speaking in parables and love";
          piece.moveStyle = "protective";
          break;
        case 5:
          piece.name = "Apostle John";
          piece.avatar = "/src/assets/images/apostle_john_1782272542078.jpg";
          piece.personality = "The Beloved, poet of holy light and author of grand theological visions.";
          piece.voiceDesc = "deeply spiritual, poet of light, loving disciple";
          piece.moveStyle = "balanced";
          break;
        case 6:
          piece.name = "Apostle Philip";
          piece.avatar = "/src/assets/images/apostle_philip_1782272558992.jpg";
          piece.personality = "Practical explorer seeking quick answers and direct travel paths.";
          piece.voiceDesc = "practical, literal, curious Apostle of action";
          piece.moveStyle = "aggressive";
          break;
        case 7:
          piece.name = "Apostle James";
          piece.avatar = "/src/assets/images/apostle_james_1782272576772.jpg";
          piece.personality = "Son of Thunder, full of fiery zeal, marching forward on the wings of lightning.";
          piece.voiceDesc = "thunderous, bold, zealous Apostle of fire and wind";
          piece.moveStyle = "aggressive";
          break;
      }
    } else if (row === 6) {
      // Pawns
      const pawnNames = [
        "Apostle Bartholomew", "Apostle Matthew", "Apostle Thaddeus", "Apostle Simon the Zealot",
        "Apostle James (Lesser)", "Apostle Jude", "Apostle Matthias", "Apostle Judas Iscariot"
      ];
      const pawnStyles: ("aggressive" | "cautious" | "balanced" | "erratic" | "protective")[] = [
        "balanced", "cautious", "balanced", "aggressive", "cautious", "protective", "balanced", "erratic"
      ];
      const pawnAvatars = [
        "/src/assets/images/apostle_bartholomew_1782273144541.jpg",
        "/src/assets/images/apostle_matthew_1782273161951.jpg",
        "/src/assets/images/apostle_thaddeus_1782273176223.jpg",
        "/src/assets/images/apostle_simon_zealot_1782273191854.jpg",
        "/src/assets/images/apostle_james_lesser_1782273205894.jpg",
        "/src/assets/images/apostle_jude_1782273222646.jpg",
        "/src/assets/images/apostle_matthias_1782273239894.jpg",
        "/src/assets/images/apostle_judas_1782273255384.jpg"
      ];
      piece.name = pawnNames[col];
      piece.avatar = pawnAvatars[col];
      if (col === 7) {
        piece.personality = "A conflicted and remorseful figure, battling fear, silver temptation, and seeking grace.";
        piece.voiceDesc = "conflicted, anxious, looking for silver or mercy";
      } else {
        piece.personality = `Devoted disciple of Christ, supporting the grand spiritual alliance.`;
        piece.voiceDesc = "humble, faithful, helpful follower";
      }
      piece.moveStyle = pawnStyles[col];
    }
  }

  return piece;
}

export function createInitialBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Initialize Black (Faction: caan, Dalek alliance) on Row 0 and 1
  const caanBackRow: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let col = 0; col < 8; col++) {
    const bkPiece: Piece = {
      id: `caan_${caanBackRow[col]}_${col}`,
      type: caanBackRow[col],
      faction: "caan",
      hasMoved: false,
    };
    board[0][col] = initializePieceAgent(bkPiece, 0, col);

    const pPiece: Piece = {
      id: `caan_p_${col}`,
      type: "p",
      faction: "caan",
      hasMoved: false,
    };
    board[1][col] = initializePieceAgent(pPiece, 1, col);
  }

  // Initialize White (Faction: jesus, Divine forces) on Row 6 and 7
  const jesusBackRow: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let col = 0; col < 8; col++) {
    const pPiece: Piece = {
      id: `jesus_p_${col}`,
      type: "p",
      faction: "jesus",
      hasMoved: false,
    };
    board[6][col] = initializePieceAgent(pPiece, 6, col);

    const bkPiece: Piece = {
      id: `jesus_${jesusBackRow[col]}_${col}`,
      type: jesusBackRow[col],
      faction: "jesus",
      hasMoved: false,
    };
    board[7][col] = initializePieceAgent(bkPiece, 7, col);
  }

  return board;
}

export function isWithinBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Deep clone board array
export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );
}

// Basic move validation ignoring check status (to avoid recursion lock)
export function getBasicMoves(board: Board, from: Coord): Coord[] {
  const moves: Coord[] = [];
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const { type, faction } = piece;

  if (type === "p") {
    const dir = faction === "jesus" ? -1 : 1;
    const startRow = faction === "jesus" ? 6 : 1;

    // Moving forward 1 step
    const nextRow = from.row + dir;
    if (isWithinBoard(nextRow, from.col) && !board[nextRow][from.col]) {
      moves.push({ row: nextRow, col: from.col });

      // Moving forward 2 steps from initial lane
      const doubleRow = from.row + 2 * dir;
      if (from.row === startRow && isWithinBoard(doubleRow, from.col) && !board[doubleRow][from.col]) {
        moves.push({ row: doubleRow, col: from.col });
      }
    }

    // Diagonal captures
    const captureCols = [from.col - 1, from.col + 1];
    for (const c of captureCols) {
      if (isWithinBoard(nextRow, c)) {
        const target = board[nextRow][c];
        if (target && target.faction !== faction) {
          moves.push({ row: nextRow, col: c });
        }
      }
    }
  }

  else if (type === "cyber_drone") {
    // Cyber Drones can move forward 1 step, diagonal forward, OR move like a Knight! (Cyber-upgraded mobility)
    const dir = faction === "caan" ? 1 : -1;
    
    // forward step
    const forwardR = from.row + dir;
    if (isWithinBoard(forwardR, from.col) && !board[forwardR][from.col]) {
      moves.push({ row: forwardR, col: from.col });
    }
    // forward diagonal steps (even as moves or captures)
    for (const dc of [from.col - 1, from.col + 1]) {
      if (isWithinBoard(forwardR, dc)) {
        const tgt = board[forwardR][dc];
        if (!tgt || tgt.faction !== faction) {
          moves.push({ row: forwardR, col: dc });
        }
      }
    }
    // Knight jumps
    const knightOffsets = [
      { r: -2, c: -1 }, { r: -2, c: 1 },
      { r: -1, c: -2 }, { r: -1, c: 2 },
      { r: 1, c: -2 }, { r: 1, c: 2 },
      { r: 2, c: -1 }, { r: 2, c: 1 }
    ];
    for (const off of knightOffsets) {
      const r = from.row + off.r;
      const c = from.col + off.c;
      if (isWithinBoard(r, c)) {
        const target = board[r][c];
        if (!target || target.faction !== faction) {
          moves.push({ row: r, col: c });
        }
      }
    }
  }

  else if (type === "n" || type === "wine_knight") {
    // Normal Knight jumps
    const knightOffsets = [
      { r: -2, c: -1 }, { r: -2, c: 1 },
      { r: -1, c: -2 }, { r: -1, c: 2 },
      { r: 1, c: -2 }, { r: 1, c: 2 },
      { r: 2, c: -1 }, { r: 2, c: 1 }
    ];
    for (const off of knightOffsets) {
      const r = from.row + off.r;
      const c = from.col + off.c;
      if (isWithinBoard(r, c)) {
        const target = board[r][c];
        if (!target || target.faction !== faction) {
          moves.push({ row: r, col: c });
        }
      }
    }

    if (type === "wine_knight") {
      // Wine Knight can also step 1 tile diagonally (combination of Knight + holy Bishop energy)
      const diagOffsets = [
        { r: -1, c: -1 }, { r: -1, c: 1 },
        { r: 1, c: -1 }, { r: 1, c: 1 }
      ];
      for (const off of diagOffsets) {
        const r = from.row + off.r;
        const c = from.col + off.c;
        if (isWithinBoard(r, c)) {
          const target = board[r][c];
          if (!target || target.faction !== faction) {
            moves.push({ row: r, col: c });
          }
        }
      }
    }
  }

  else if (type === "b" || type === "q") {
    // Sliding Diagonally
    const dirs = [
      { r: -1, c: -1 }, { r: -1, c: 1 },
      { r: 1, c: -1 }, { r: 1, c: 1 }
    ];
    for (const d of dirs) {
      let r = from.row + d.r;
      let c = from.col + d.c;
      while (isWithinBoard(r, c)) {
        const target = board[r][c];
        if (!target) {
          moves.push({ row: r, col: c });
        } else {
          if (target.faction !== faction) {
            moves.push({ row: r, col: c });
          }
          break;
        }
        r += d.r;
        c += d.c;
      }
    }
  }

  if (type === "r" || type === "q") {
    // Sliding Orthogonally
    const dirs = [
      { r: -1, c: 0 }, { r: 1, c: 0 },
      { r: 0, c: -1 }, { r: 0, c: 1 }
    ];
    for (const d of dirs) {
      let r = from.row + d.r;
      let c = from.col + d.c;
      while (isWithinBoard(r, c)) {
        const target = board[r][c];
        if (!target) {
          moves.push({ row: r, col: c });
        } else {
          if (target.faction !== faction) {
            moves.push({ row: r, col: c });
          }
          break;
        }
        r += d.r;
        c += d.c;
      }
    }
  }

  else if (type === "k") {
    // King moves 1 grid in all directions
    const kingOffsets = [
      { r: -1, c: -1 }, { r: -1, c: 0 }, { r: -1, c: 1 },
      { r: 0, c: -1 },                  { r: 0, c: 1 },
      { r: 1, c: -1 },  { r: 1, c: 0 },  { r: 1, c: 1 }
    ];
    for (const off of kingOffsets) {
      const r = from.row + off.r;
      const c = from.col + off.c;
      if (isWithinBoard(r, c)) {
        const target = board[r][c];
        if (!target || target.faction !== faction) {
          moves.push({ row: r, col: c });
        }
      }
    }

    // Castling Simplified: King on starting slot, Rook unmoved, empty path
    if (!piece.hasMoved) {
      const r = faction === "jesus" ? 7 : 0;
      if (from.row === r && from.col === 4) {
        // King side castling
        const rookKing = board[r][7];
        if (rookKing && !rookKing.hasMoved && !board[r][5] && !board[r][6]) {
          moves.push({ row: r, col: 6 });
        }
        // Queen side castling
        const rookQueen = board[r][0];
        if (rookQueen && !rookQueen.hasMoved && !board[r][1] && !board[r][2] && !board[r][3]) {
          moves.push({ row: r, col: 2 });
        }
      }
    }
  }

  return moves;
}

// Find king coordinate
export function findKing(board: Board, faction: Faction): Coord | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = board[r][c];
      if (cell && cell.type === "k" && cell.faction === faction) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

// Verify if the specified faction's King is in check
export function isFactionsKingInCheck(board: Board, faction: Faction): boolean {
  const kingPos = findKing(board, faction);
  if (!kingPos) return false;

  // Scan all cells. If an opponent piece can reach the king's coordinate, the king is under threat.
  const opponentFaction = faction === "jesus" ? "caan" : "jesus";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === opponentFaction) {
        const moves = getBasicMoves(board, { row: r, col: c });
        if (moves.some((m) => m.row === kingPos.row && m.col === kingPos.col)) {
          return true;
        }
      }
    }
  }

  return false;
}

// Filter moves that would expose or retain check on own king
export function getFullyValidMoves(board: Board, from: Coord): Coord[] {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const basicMoves = getBasicMoves(board, from);
  const faction = piece.faction;

  return basicMoves.filter((move) => {
    // Clone and execute virtual move
    const testBoard = cloneBoard(board);
    const self = testBoard[from.row][from.col];
    testBoard[from.row][from.col] = null;
    testBoard[move.row][move.col] = self;

    // Handle normal castling repositioning in check-simulation
    if (self && self.type === "k" && Math.abs(move.col - from.col) === 2) {
      const r = faction === "jesus" ? 7 : 0;
      if (move.col === 6) {
        testBoard[r][5] = testBoard[r][7];
        testBoard[r][7] = null;
      } else if (move.col === 2) {
        testBoard[r][3] = testBoard[r][0];
        testBoard[r][0] = null;
      }
    }

    // It is legal ONLY IF the faction's king is NOT left in check.
    return !isFactionsKingInCheck(testBoard, faction);
  });
}

// Apply standard movement or castling
export function movePieceOnBoard(board: Board, from: Coord, to: Coord): Board {
  const newBoard = cloneBoard(board);
  const piece = newBoard[from.row][from.col];
  if (!piece) return board;

  piece.hasMoved = true;
  newBoard[from.row][from.col] = null;

  // Perform castling rook slide
  if (piece.type === "k" && Math.abs(to.col - from.col) === 2) {
    const r = piece.faction === "jesus" ? 7 : 0;
    if (to.col === 6) {
      const rook = newBoard[r][7];
      if (rook) {
        rook.hasMoved = true;
        newBoard[r][5] = rook;
        newBoard[r][7] = null;
      }
    } else if (to.col === 2) {
      const rook = newBoard[r][0];
      if (rook) {
        rook.hasMoved = true;
        newBoard[r][3] = rook;
        newBoard[r][0] = null;
      }
    }
  }

  // Automatic Pawn promotion to Queen when reaching opposite edge
  if (piece.type === "p") {
    const promoRow = piece.faction === "jesus" ? 0 : 7;
    if (to.row === promoRow) {
      piece.type = "q";
    }
  }

  newBoard[to.row][to.col] = piece;
  return newBoard;
}

// Check if any legal moves are possible for a faction
export function hasFactionAnyLegalMoves(board: Board, faction: Faction): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === faction) {
        const moves = getFullyValidMoves(board, { row: r, col: c });
        if (moves.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
}

// Count captured pieces per side
export function getCapturedPieces(board: Board): { jesus: PieceType[]; caan: PieceType[] } {
  const counts: Record<Faction, Record<PieceType, number>> = {
    jesus: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1, wine_knight: 0, cyber_drone: 0 },
    caan: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1, wine_knight: 0, cyber_drone: 0 },
  };

  // Find remaining on board
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const t = piece.type;
        const mappedType = t === "wine_knight" ? "n" : t === "cyber_drone" ? "p" : t;
        counts[piece.faction][mappedType]--;
      }
    }
  }

  const result = { jesus: [] as PieceType[], caan: [] as PieceType[] };
  // Fill arrays
  for (const f of ["jesus", "caan"] as Faction[]) {
    const list = f === "jesus" ? result.jesus : result.caan;
    const items = counts[f];
    for (const t in items) {
      const remainingToBeCapturedCount = items[t as PieceType];
      for (let i = 0; i < remainingToBeCapturedCount; i++) {
        list.push(t as PieceType);
      }
    }
  }

  return result;
}

// Evaluation heuristic for the AI
export function evaluateBoardScore(board: Board, faction: Faction): number {
  let score = 0;
  const opp = faction === "jesus" ? "caan" : "jesus";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = board[r][c];
      if (cell) {
        const val = PIECE_VALUES[cell.type] || 100;
        const positionBonus = (cell.faction === "jesus" ? (7 - r) : r) * 10; // drive pieces forward
        
        if (cell.faction === faction) {
          score += val + positionBonus;
          if (cell.isAscended) score += 150; // value defensive shield
          if (cell.isCyber) score += 200; // value cyber upgrades
        } else {
          score -= (val + positionBonus);
          if (cell.isAscended) score -= 150;
          if (cell.isCyber) score -= 200;
        }
      }
    }
  }

  return score;
}

// Selects the smartest legal chess move using a 1-ply greedy lookahead with tactical heuristic
export function calculateBestMove(board: Board, faction: Faction): { from: Coord; to: Coord; score: number } | null {
  const possibleMoves: { from: Coord; to: Coord; score: number }[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === faction) {
        const from = { row: r, col: c };
        const moves = getFullyValidMoves(board, from);

        for (const to of moves) {
          // Simulate and score
          const testBoard = movePieceOnBoard(board, from, to);
          let score = evaluateBoardScore(testBoard, faction);

          // Add heavy weight for straight capture
          const captured = board[to.row][to.col];
          if (captured) {
            score += PIECE_VALUES[captured.type] * 1.5;
          }

          // ---- UNIQUE AGENT MOVE LOGIC (RESPONSIBLE FOR THEIR OWN MOVES) ----
          const agentStyle = piece.moveStyle || "balanced";
          
          if (agentStyle === "aggressive") {
            // Aggressive pieces want to move forward and attack
            const targetRowWeight = faction === "jesus" ? (7 - to.row) : to.row;
            score += targetRowWeight * 8; // bonus for charging forward
            
            // Extra bonus for moving closer to the opponent King
            const enemyKingPos = findKing(board, faction === "jesus" ? "caan" : "jesus");
            if (enemyKingPos) {
              const prevDist = Math.abs(from.row - enemyKingPos.row) + Math.abs(from.col - enemyKingPos.col);
              const nextDist = Math.abs(to.row - enemyKingPos.row) + Math.abs(to.col - enemyKingPos.col);
              if (nextDist < prevDist) {
                score += 35; // bonus for stalking the enemy king
              }
            }

            // Bonus for giving check
            if (isFactionsKingInCheck(testBoard, faction === "jesus" ? "caan" : "jesus")) {
              score += 75; 
            }
          } 
          else if (agentStyle === "cautious") {
            // Cautious agents hate putting themselves in danger!
            const oppFaction = faction === "jesus" ? "caan" : "jesus";
            let isLandingThreatened = false;
            for (let tr = 0; tr < 8; tr++) {
              for (let tc = 0; tc < 8; tc++) {
                const oppPiece = testBoard[tr][tc];
                if (oppPiece && oppPiece.faction === oppFaction) {
                  const oppMoves = getBasicMoves(testBoard, { row: tr, col: tc });
                  if (oppMoves.some(m => m.row === to.row && m.col === to.col)) {
                    isLandingThreatened = true;
                    break;
                  }
                }
              }
              if (isLandingThreatened) break;
            }

            if (isLandingThreatened) {
              score -= 150; // high penalty for landing on threatened coordinate
            }

            // Prefer retreating or staying in safer territories
            const isCloserToHome = faction === "jesus" ? (to.row > from.row) : (to.row < from.row);
            if (isCloserToHome) {
              score += 20;
            }
          }
          else if (agentStyle === "protective") {
            // Protective pieces want to stay near their own King
            const friendlyKingPos = findKing(board, faction);
            if (friendlyKingPos) {
              const distToKing = Math.abs(to.row - friendlyKingPos.row) + Math.abs(to.col - friendlyKingPos.col);
              if (distToKing <= 2) {
                score += 40;
              }
            }
          }
          else if (agentStyle === "erratic") {
            // Erratic agents (insane Daleks, The Master, Judas) add random noise / unpredictability
            const randomJitter = Math.floor(Math.sin((to.row * 7 + to.col * 13) * 1000) * 45);
            score += randomJitter;
          }

          possibleMoves.push({ from, to, score });
        }
      }
    }
  }

  if (possibleMoves.length === 0) return null;

  // Sort descending and select the best, adding light randomization (jitter) for organic play
  possibleMoves.sort((a, b) => b.score - a.score);
  const bestScore = possibleMoves[0].score;
  const candidates = possibleMoves.filter((m) => Math.abs(m.score - bestScore) < 15);

  return candidates[Math.floor(Math.random() * candidates.length)];
}
