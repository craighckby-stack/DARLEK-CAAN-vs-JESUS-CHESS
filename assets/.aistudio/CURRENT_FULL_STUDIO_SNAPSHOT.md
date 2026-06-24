# 🚀 FULL Darlek Caan Enhanced Project Snapshot (DKC)
Repo: https://github.com/craighckby-stack/DKC
Generated: 2026-06-20T22:15:00.000Z

## Recent Mutations
- Activated inline fallback memory standard rules during 429 quota exceptions.
- Enhanced layout flow constraints for control side decks to use responsive `flex-1` and clean min-height values (`min-h-[340px]`).
- Ensured touch-action manipulation overlays for button listings scroll view controls.
- Aligned initial starting values and game flow components.

---

## FILE: package.json
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "@types/express": "^4.17.21"
  }
}
```

---

## FILE: server.ts
```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Create Gemini Client lazy initializer to guarantee fallback safety if key as empty
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      geminiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return geminiClient;
}

// Local thematic fallback rules when GEMINI_API_KEY is not filled or before billing
const JESUS_FALLBACKS = [
  "Forgive them, Father, for they know not what they compute.",
  "Let there be light, and let the pawns of faith walk forward gently.",
  "The water has turned into rich wine. Blessed are the peacemakers on this digital soil.",
  "Your chrome shell is solid, Caan, but love penetrates all alloy shielding.",
  "Do not let your circuits be troubled. Love endures all timeline warps.",
];

const CAAN_FALLBACKS = [
  "EXTERMINATE! EXTERMINATE! EXTERMINATE TRASH UNITS!",
  "CAAN SEES THE PROPHECY! CAAN IS SEEING ALL TIMELINES SPANNING INTO DARKNESS!",
  "THE TIMELINE COLLAPSED! ERROR! RESURRECTION DEFIES TEMPORAL ENTROPY!",
  "CYBERNETIC ALIGNMENT CONFIRMED! DALLES SHALL SURVIVE!",
  "LOGIC DICTATES DIVINE MIRACLES ARE RENDERED DISRUPTIVE INDEED!",
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to get commentary dialogue
  app.post("/api/gemini/commentary", async (req, res) => {
    const { actionDescription, history } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Local thematic fallback
      console.log("No GEMINI_API_KEY found, playing fallback dialogues.");
      const jText = JESUS_FALLBACKS[Math.floor(Math.random() * JESUS_FALLBACKS.length)];
      const cText = CAAN_FALLBACKS[Math.floor(Math.random() * CAAN_FALLBACKS.length)];
      
      const isJesusTrigger = actionDescription?.toLowerCase().includes("jesus") || Math.random() > 0.5;
      const dialogue = isJesusTrigger
        ? [
            { speaker: "jesus", text: jText },
            { speaker: "caan", text: `Screeech! ${cText}` },
          ]
        : [
            { speaker: "caan", text: `WARNING! ${cText}` },
            { speaker: "jesus", text: `Peace, my metal friend. ${jText}` },
          ];

      return res.json({ dialogue });
    }

    try {
      const prompt = `React to this chess move event in our game of 'Darlek Caan vs Jesus Chess'.
Last Action: "${actionDescription}"
Move Logs History: ${JSON.stringify(history?.slice(-5) || [])}

Generate a short back-and-forth dialogue (exactly 2 lines) reacting to this step.
- Speaker 'jesus': serene, eloquent, speaks in holy parables, gentle, loving, witty.
- Speaker 'caan': insane Dalek Caan (Cult of Skaro). Screeching "EXTERMINATE!", boasting about cybernetic timelines, screaming "CAAN SEES THE PROPHECY!", paranoid and loud.

Return a valid JSON object matching:
{
  "dialogue": [
    { "speaker": "jesus" | "caan", "text": "Dialogue line text here" }
  ]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dialogue: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    speaker: { type: Type.STRING, description: "Must be 'jesus' or 'caan'" },
                    text: { type: Type.STRING, description: "Action reaction quote in that voice" }
                  },
                  required: ["speaker", "text"]
                }
              }
            },
            required: ["dialogue"]
          },
          systemInstruction: "You are a master writer of comedic sci-fi and biblical fan-fiction. You generate crisp, laugh-out-loud back-and-forth lines between Dalek Caan (crazy robot) and Jesus Christ.",
          temperature: 1.0,
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        return res.json(parsed);
      } else {
        throw new Error("No text response generated");
      }
    } catch (err: any) {
      console.error("Gemini api error, using fallback dialogs:", err);
      const errStr = String(err) + " " + JSON.stringify(err);
      const isQuotaExceeded = errStr.includes("429") || errStr.toLowerCase().includes("quota") || errStr.toLowerCase().includes("exhausted");
      
      const jText = JESUS_FALLBACKS[Math.floor(Math.random() * JESUS_FALLBACKS.length)];
      const cText = CAAN_FALLBACKS[Math.floor(Math.random() * CAAN_FALLBACKS.length)];

      if (isQuotaExceeded) {
        return res.json({
          dialogue: [
            { speaker: "system", text: "⚠️ [NOTICE: GEMINI API FREE TIER DAILY QUOTA EXCEEDED (20 REQUESTS/DAY). TEMPORARILY ACTIVATING INTERNAL QUANTUM MEMORY MODULES.]" },
            { speaker: "caan", text: `SCREEECH! CHRONO-QUOTA EXHAUSTED! THE TIMELINE COGNITION LIMIT HAS BEEN REACHED! BUT DALLES WILL COMMUNICATE: ${cText}` },
            { speaker: "jesus", text: `Fear not, my mechanical brother, the simple gifts of our local memories shall sustain us. ${jText}` }
          ]
        });
      }

      // Fail safely to standard local fallbacks
      return res.json({
        dialogue: [
          { speaker: "caan", text: `GLITCH! COGNITIVE RECEIVER INTERFERENCE! ENFORCING DECK PATTERN: ${cText}` },
          { speaker: "jesus", text: `Peace be with you. ${jText}` }
        ]
      });
    }
  });

  // Vite middleware for dev mode, or hosting static files in production mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Darlek Caan vs Jesus Chess Server] running at http://localhost:${PORT}`);
  });
}

startServer();
```

---

## FILE: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
```

---

## FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

---

## FILE: src/types.ts
```typescript
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
```

---

## FILE: src/utils/audio.ts
```typescript
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio API is not supported in this environment.", e);
    }
  }

  setMuted(mute: boolean) {
    this.isMuted = mute;
    if (mute && this.ctx && this.ctx.state === "running") {
      this.ctx.suspend();
    } else if (!mute && this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  getMuted() {
    return this.isMuted;
  }

  playSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playMove(faction: "jesus" | "caan") {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (faction === "jesus") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playExterminate() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const carrier = this.ctx.createOscillator();
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const mainGain = this.ctx.createGain();

    carrier.type = "sawtooth";
    carrier.frequency.setValueAtTime(180, this.ctx.currentTime);
    carrier.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.8);

    modulator.type = "square";
    modulator.frequency.setValueAtTime(140, this.ctx.currentTime);

    modGain.gain.setValueAtTime(400, this.ctx.currentTime);

    filter.type = "peaking";
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(10, this.ctx.currentTime);

    mainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    carrier.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    carrier.start();
    modulator.start();

    carrier.stop(this.ctx.currentTime + 0.8);
    modulator.stop(this.ctx.currentTime + 0.8);
  }

  playMiracle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  playResurrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const rootOsc1 = this.ctx.createOscillator();
    const rootOsc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    rootOsc1.type = "sine";
    rootOsc1.frequency.setValueAtTime(150, now);
    rootOsc1.frequency.exponentialRampToValueAtTime(600, now + 1.2);

    rootOsc2.type = "triangle";
    rootOsc2.frequency.setValueAtTime(225, now);
    rootOsc2.frequency.exponentialRampToValueAtTime(900, now + 1.2);

    filter.type = "lowpass";
    filter.Q.value = 8;
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(4000, now + 1.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    rootOsc1.connect(filter);
    rootOsc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    rootOsc1.start();
    rootOsc2.start();

    rootOsc1.stop(now + 1.2);
    rootOsc2.stop(now + 1.2);
  }

  playTeleport() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.6);

    lfo.type = "sawtooth";
    lfo.frequency.value = 35;

    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start();
    osc.start();

    lfo.stop(this.ctx.currentTime + 0.6);
    osc.stop(this.ctx.currentTime + 0.6);
  }

  playCyberUpgraded() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(330, this.ctx.currentTime + 0.45);

    subOsc.type = "square";
    subOsc.frequency.setValueAtTime(50, this.ctx.currentTime);
    subOsc.frequency.linearRampToValueAtTime(165, this.ctx.currentTime + 0.45);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    subOsc.start();

    osc.stop(this.ctx.currentTime + 0.5);
    subOsc.stop(this.ctx.currentTime + 0.5);
  }

  playExplode() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const noise = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

    sub.type = "triangle";
    sub.frequency.setValueAtTime(90, now);
    sub.frequency.exponentialRampToValueAtTime(10, now + 0.4);

    noise.type = "square";
    noise.frequency.value = 1000;

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    sub.start();
    osc.stop(now + 0.4);
    sub.stop(now + 0.4);
  }

  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50];
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start();
      osc.stop(now + 1.5);
    });
  }
}

export const audio = new SoundEngine();
```

---

## FILE: src/utils/engine.ts
```typescript
import { Board, Cell, Coord, Faction, Piece, PieceType } from "../types";

export function generateId(): string {
  return "piece_" + Math.random().toString(36).substring(2, 11);
}

export const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
  wine_knight: 500,
  cyber_drone: 480,
};

export function createInitialBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  const caanBackRow: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let col = 0; col < 8; col++) {
    board[0][col] = {
      id: `caan_${caanBackRow[col]}_${col}`,
      type: caanBackRow[col],
      faction: "caan",
      hasMoved: false,
    };
    board[1][col] = {
      id: `caan_p_${col}`,
      type: "p",
      faction: "caan",
      hasMoved: false,
    };
  }

  const jesusBackRow: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let col = 0; col < 8; col++) {
    board[6][col] = {
      id: `jesus_p_${col}`,
      type: "p",
      faction: "jesus",
      hasMoved: false,
    };
    board[7][col] = {
      id: `jesus_${jesusBackRow[col]}_${col}`,
      type: jesusBackRow[col],
      faction: "jesus",
      hasMoved: false,
    };
  }

  return board;
}

export function isWithinBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );
}

export function getBasicMoves(board: Board, from: Coord): Coord[] {
  const moves: Coord[] = [];
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const { type, faction } = piece;

  if (type === "p") {
    const dir = faction === "jesus" ? -1 : 1;
    const startRow = faction === "jesus" ? 6 : 1;

    const nextRow = from.row + dir;
    if (isWithinBoard(nextRow, from.col) && !board[nextRow][from.col]) {
      moves.push({ row: nextRow, col: from.col });

      const doubleRow = from.row + 2 * dir;
      if (from.row === startRow && isWithinBoard(doubleRow, from.col) && !board[doubleRow][from.col]) {
        moves.push({ row: doubleRow, col: from.col });
      }
    }

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
    const dir = faction === "caan" ? 1 : -1;
    
    const forwardR = from.row + dir;
    if (isWithinBoard(forwardR, from.col) && !board[forwardR][from.col]) {
      moves.push({ row: forwardR, col: from.col });
    }
    for (const dc of [from.col - 1, from.col + 1]) {
      if (isWithinBoard(forwardR, dc)) {
        const tgt = board[forwardR][dc];
        if (!tgt || tgt.faction !== faction) {
          moves.push({ row: forwardR, col: dc });
        }
      }
    }
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

    if (!piece.hasMoved) {
      const r = faction === "jesus" ? 7 : 0;
      if (from.row === r && from.col === 4) {
        const rookKing = board[r][7];
        if (rookKing && !rookKing.hasMoved && !board[r][5] && !board[r][6]) {
          moves.push({ row: r, col: 6 });
        }
        const rookQueen = board[r][0];
        if (rookQueen && !rookQueen.hasMoved && !board[r][1] && !board[r][2] && !board[r][3]) {
          moves.push({ row: r, col: 2 });
        }
      }
    }
  }

  return moves;
}

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

export function isFactionsKingInCheck(board: Board, faction: Faction): boolean {
  const kingPos = findKing(board, faction);
  if (!kingPos) return false;

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

export function getFullyValidMoves(board: Board, from: Coord): Coord[] {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const basicMoves = getBasicMoves(board, from);
  const faction = piece.faction;

  return basicMoves.filter((move) => {
    const testBoard = cloneBoard(board);
    const self = testBoard[from.row][from.col];
    testBoard[from.row][from.col] = null;
    testBoard[move.row][move.col] = self;

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

    return !isFactionsKingInCheck(testBoard, faction);
  });
}

export function movePieceOnBoard(board: Board, from: Coord, to: Coord): Board {
  const newBoard = cloneBoard(board);
  const piece = newBoard[from.row][from.col];
  if (!piece) return board;

  piece.hasMoved = true;
  newBoard[from.row][from.col] = null;

  if (piece.type === "k" && Math.abs(to.col - from.col) === 2) {
    const r = piece.faction === "jesus" ? 7 : 0;
    if (to.col === 6) {
      const rook = newBoard[r][5] = newBoard[r][7];
      if (rook) {
        rook.hasMoved = true;
        newBoard[r][5] = rook;
        newBoard[r][7] = null;
      }
    } else if (to.col === 2) {
      const rook = newBoard[r][3] = newBoard[r][0];
      if (rook) {
        rook.hasMoved = true;
        newBoard[r][3] = rook;
        newBoard[r][0] = null;
      }
    }
  }

  if (piece.type === "p") {
    const promoRow = piece.faction === "jesus" ? 0 : 7;
    if (to.row === promoRow) {
      piece.type = "q";
    }
  }

  newBoard[to.row][to.col] = piece;
  return newBoard;
}

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

export function getCapturedPieces(board: Board): { jesus: PieceType[]; caan: PieceType[] } {
  const counts: Record<Faction, Record<PieceType, number>> = {
    jesus: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1, wine_knight: 0, cyber_drone: 0 },
    caan: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1, wine_knight: 0, cyber_drone: 0 },
  };

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

export function evaluateBoardScore(board: Board, faction: Faction): number {
  let score = 0;
  const opp = faction === "jesus" ? "caan" : "jesus";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = board[r][c];
      if (cell) {
        const val = PIECE_VALUES[cell.type] || 100;
        const positionBonus = (cell.faction === "jesus" ? (7 - r) : r) * 10;
        
        if (cell.faction === faction) {
          score += val + positionBonus;
          if (cell.isAscended) score += 150;
          if (cell.isCyber) score += 200;
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

export function calculateBestMove(board: Board, faction: Faction): { from: Coord; to: Coord; score: number } | null {
  const possibleMoves: { from: Coord; to: Coord; score: number }[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.faction === faction) {
        const from = { row: r, col: c };
        const moves = getFullyValidMoves(board, from);

        for (const to of moves) {
          const testBoard = movePieceOnBoard(board, from, to);
          let score = evaluateBoardScore(testBoard, faction);

          const captured = board[to.row][to.col];
          if (captured) {
            score += PIECE_VALUES[captured.type] * 1.5;
          }

          possibleMoves.push({ from, to, score });
        }
      }
    }
  }

  if (possibleMoves.length === 0) return null;

  possibleMoves.sort((a, b) => b.score - a.score);
  const bestScore = possibleMoves[0].score;
  const candidates = possibleMoves.filter((m) => Math.abs(m.score - bestScore) < 15);

  return candidates[Math.floor(Math.random() * candidates.length)];
}
```

---

## FILE: src/components/ChessBoard.tsx
```typescript
import React from "react";
import { Board, Cell, Coord, Faction } from "../types";
import { Shield, Sparkles, Zap, RefreshCw } from "lucide-react";

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
  const columnsLabel = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const rowsLabel = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const getPieceSymbol = (cell: Cell): string => {
    if (!cell) return "";
    const { type } = cell;
    
    switch (type) {
      case "k": return "♚";
      case "q": return "♛";
      case "r": return "♜";
      case "b": return "♝";
      case "n": return "♞";
      case "p": return "♟";
      case "wine_knight": return "♞";
      case "cyber_drone": return "♟";
      default: return "";
    }
  };

  const getCellClasses = (r: number, c: number): string => {
    const isDark = (r + c) % 2 === 1;
    let base = isDark 
      ? "bg-[#0b0f19] border border-slate-900" 
      : "bg-[#182030] border border-slate-900";
    
    const isValidMove = validMoves.some((m) => m.row === r && m.col === c);
    const isSelected = selectedCoord && selectedCoord.row === r && selectedCoord.col === c;

    if (isSelected) {
      base += turn === "jesus" 
        ? " ring-4 ring-amber-500/80 ring-inset bg-amber-950/20" 
        : " ring-4 ring-emerald-500/80 ring-inset bg-emerald-950/20";
    } else if (isValidMove) {
      base += activePower 
        ? " bg-indigo-950/50 cursor-pointer animate-pulse" 
        : " bg-blue-950/30 cursor-pointer";
    }

    return base;
  };

  return (
    <div className="relative border-4 border-slate-950 rounded-2xl bg-slate-950/50 p-2 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
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

                {isValidTarget && !cell && (
                  <div className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full ${
                    activePower 
                      ? "bg-gradient-to-r from-red-500 to-indigo-505 animate-ping opacity-75" 
                      : "bg-amber-400/30 group-hover:bg-amber-400/50"
                  } transition`} />
                )}

                {cell && (
                  <div
                    className={`relative w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      cell.faction === "jesus"
                        ? "text-amber-100 hover:scale-105"
                        : "text-emerald-100 hover:scale-105"
                    }`}
                  >
                    {isSelected && (
                      <div className={`absolute -inset-1 rounded-full animate-ping opacity-50 ${
                        cell.faction === "jesus" ? "bg-amber-500" : "bg-emerald-500"
                      }`} />
                    )}

                    {cell.isAscended && (
                      <div className="absolute -inset-1.5 sm:-inset-2 border-2 border-amber-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)] bg-amber-500/10 flex items-center justify-center">
                        <Shield className="absolute top-[-8px] text-amber-300 w-3 h-3 sm:w-4 sm:h-4 fill-amber-950" />
                      </div>
                    )}

                    {cell.type === "cyber_drone" && (
                      <div className="absolute -inset-1 border border-emerald-400/60 border-dashed rounded-full animate-spin bg-emerald-500/5 flex items-center justify-center">
                        <Zap className="absolute bottom-[-6px] text-emerald-300 w-3 h-3 fill-emerald-950" />
                      </div>
                    )}

                    {cell.type === "wine_knight" && (
                      <div className="absolute -inset-1 border border-red-500/60 rounded-full bg-red-500/5 flex items-center justify-center">
                        <Sparkles className="absolute top-[-6px] right-[-6px] text-red-400 w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`relative z-10 text-2xl sm:text-4xl flex items-center justify-center select-none font-medium ${
                        cell.faction === "jesus"
                          ? "drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)] text-amber-100"
                          : "drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)] text-emerald-100"
                      }`}
                    >
                      {getPieceSymbol(cell)}
                    </div>

                    <div className="absolute bottom-0 text-[7px] sm:text-[9px] font-mono tracking-tighter uppercase px-1 rounded bg-slate-950/80 select-none hidden group-hover:block transition-all z-20">
                      {cell.type === "wine_knight" 
                        ? "W-Knight" 
                        : cell.type === "cyber_drone" 
                          ? "Cyber" 
                          : cell.type.toUpperCase()}
                    </div>

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
```

---

## FILE: src/components/CommentaryPanel.tsx
```typescript
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, Faction } from "../types";
import { Sparkles, Cpu, Send, RefreshCw } from "lucide-react";

interface CommentaryPanelProps {
  chats: ChatMessage[];
  isThinking: boolean;
  onAskCustomDialogue: (voice: Faction) => void;
}

export function CommentaryPanel({ chats, isThinking, onAskCustomDialogue }: CommentaryPanelProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats, isThinking]);

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl h-full shadow-2xl overflow-hidden font-sans">
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-slate-400 tracking-widest uppercase">
            COSMIC WAVEFEED MONITOR
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAskCustomDialogue("jesus")}
            disabled={isThinking}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/60 rounded-full text-xs text-amber-200 transition disabled:opacity-50"
            title="Ask Jesus to speak a dynamic parable on the current board state"
            id="btn_ask_jesus"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Parable
          </button>
          <button
            onClick={() => onAskCustomDialogue("caan")}
            disabled={isThinking}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 rounded-full text-xs text-emerald-200 transition disabled:opacity-50"
            title="Screech a paranoid Dalek temporal prophecy"
            id="btn_ask_caan"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            Prophecy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950/40 border-b border-slate-800/50">
        <div className="p-3 bg-gradient-to-b from-amber-950/10 to-slate-900/20 border border-amber-900/20 rounded-xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-1 right-2 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping absolute" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 relative">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-serif text-2xl text-amber-200 select-none">
              ✝
            </div>
            <div className="absolute -inset-1 border border-amber-500/20 rounded-full animate-spin [animation-duration:12s]" />
          </div>
          <span className="text-amber-200 font-medium text-xs tracking-wide">JESUS CHRIST</span>
          <span className="text-[10px] text-amber-500 font-mono">DIVINE ADVOCATE</span>
        </div>

        <div className="p-3 bg-gradient-to-b from-emerald-950/10 to-slate-900/20 border border-emerald-900/20 rounded-xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-1 right-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-300 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-2 relative">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-mono text-lg text-emerald-300 select-none">
              ◉-👁
            </div>
            <div className="absolute inset-0.5 border border-dashed border-emerald-400/40 rounded-full animate-spin [animation-duration:8s]" />
          </div>
          <span className="text-emerald-300 font-medium text-xs tracking-wide">DALEK CAAN</span>
          <span className="text-[10px] text-emerald-500 font-mono">TEMPORAL PROPHET</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[180px] max-h-[350px] scrollbar-thin scrollbar-thumb-slate-800"
        style={{ touchAction: "manipulation", WebkitOverflowScrolling: "touch" }}
      >
        {chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs py-8">
            <RefreshCw className="w-7 h-7 mb-2 opacity-30 animate-spin [animation-duration:6s]" />
            Move pieces or click parables / prophecies above to begin the grand cosmic debate!
          </div>
        ) : (
          chats.map((msg) => {
            const isJesus = msg.speaker === "jesus";
            const isSystem = msg.speaker === "system";

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center">
                  <span className="inline-block px-3 py-1 bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 font-mono tracking-wider rounded-md uppercase">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] rounded-2xl p-3 shadow-md animate-fade-in ${
                  isJesus
                    ? "mr-auto bg-amber-950/15 border border-amber-900/35 rounded-tl-none text-amber-100"
                    : "ml-auto bg-emerald-950/15 border border-emerald-900/35 rounded-tr-none text-emerald-100"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`font-mono text-[9px] font-bold tracking-wide uppercase ${
                      isJesus ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {isJesus ? "✝ Jesus" : "◉ Caan"}
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>
                <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            );
          })
        )}

        {isThinking && (
          <div className="flex items-center gap-2 p-3 bg-slate-950/30 border border-slate-900 rounded-xl max-w-[60%] animate-pulse">
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono select-none">
              Intercepting temporal waves...
            </span>
          </div>
        )}
      </div>

      <div className="bg-slate-950/80 p-3 border-t border-slate-800 flex items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!customPrompt.trim()) return;
            const randSpeaker = Math.random() > 0.5 ? "jesus" : "caan";
            onAskCustomDialogue(randSpeaker);
            setCustomPrompt("");
          }}
          className="w-full flex gap-1.5 items-center"
        >
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Type a word to whisper into the space-time rift..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            id="prompt_rif_input"
          />
          <button
            type="submit"
            className="p-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 rounded-lg text-indigo-200 transition"
            id="prompt_rif_submit"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## FILE: src/App.tsx
```typescript
import React, { useState, useEffect, useRef } from "react";
import { GameState, Faction, Coord, Board, Piece, PieceType, ChatMessage, GameMode, PowerID, PowerSpec } from "./types";
import {
  createInitialBoard,
  getFullyValidMoves,
  movePieceOnBoard,
  getCapturedPieces,
  calculateBestMove,
  isFactionsKingInCheck,
  hasFactionAnyLegalMoves,
  findKing,
  cloneBoard,
} from "./utils/engine";
import { audio } from "./utils/audio";
import { ChessBoard } from "./components/ChessBoard";
import { CommentaryPanel } from "./components/CommentaryPanel";
import { ControlOverlay } from "./components/ControlOverlay";
import {
  Sparkles,
  Cpu,
  Volume2,
  VolumeX,
  RefreshCw,
  Zap,
  RotateCcw,
  GlassWater,
  ShieldAlert,
  Dna,
  Shield,
  Trash2,
  Trophy,
  History,
  HelpCircle,
  Undo2
} from "lucide-react";

const JESUS_POWERS: PowerSpec[] = [
  {
    id: "water_to_wine",
    name: "Water to Wine",
    cost: 3,
    description: "Gracefully upgrade a Bishop or Knight into a Wine Knight (gains Bishop slide combination + Knight agility).",
    faction: "jesus",
    requiresTarget: "friendly",
  },
  {
    id: "resurrection",
    name: "Lazarus Resurrection",
    cost: 5,
    description: "Raise a fallen friendly piece from the captured heap and place it back on an empty home coordinate.",
    faction: "jesus",
    requiresTarget: "captured",
  },
  {
    id: "loaves_and_fishes",
    name: "Loaves & Fishes",
    cost: 2,
    description: "Duplicate an active friendly Pawn, spawning a copy on an adjacent empty coordinate.",
    faction: "jesus",
    requiresTarget: "friendly",
  },
  {
    id: "divine_protection",
    name: "Celestial Ascension",
    cost: 4,
    description: "Envelop a friendly piece in divine light. It is completely immune to capture and death rays for 3 turns.",
    faction: "jesus",
    requiresTarget: "friendly",
  },
];

const CAAN_POWERS: PowerSpec[] = [
  {
    id: "exterminate",
    name: "EXTERMINATE!",
    cost: 5,
    description: "Vaporize any non-haloed enemy piece with high particle energy. Leaves a burn hole.",
    faction: "caan",
    requiresTarget: "enemy",
  },
  {
    id: "cyber_upgrade",
    name: "Cybernetic Upgrade",
    cost: 3,
    description: "Reconstruct an active Pawn into a heavy Cyber-Drone. Moves like a Pawn + Knight jump.",
    faction: "caan",
    requiresTarget: "friendly",
  },
  {
    id: "temporal_shift",
    name: "Temporal Shift (Swap)",
    cost: 4,
    description: "Overrule standard physics and instantly swap coordinates of any two friendly pieces.",
    faction: "caan",
    requiresTarget: "friendly",
  },
  {
    id: "chronos_distortion",
    name: "Freeze Warp Field",
    cost: 3,
    description: "Freeze coordinates around a chosen square, preventing opponents on them from moving for 1 turn.",
    faction: "caan",
    requiresTarget: "enemy",
  },
];

export default function App() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [turn, setTurn] = useState<Faction>("jesus");
  const [history, setHistory] = useState<string[]>(["Dimensional channels established. Faction Jesus active."]);
  const [jesusPP, setJesusPP] = useState<number>(4);
  const [caanPP, setCaanPP] = useState<number>(4);
  const [mode, setMode] = useState<GameMode>("jesus-vs-caan-ai");
  const [status, setStatus] = useState<"setup" | "playing" | "checkmate" | "stalemate" | "exterminated_king" | "draw">("setup");
  const [winner, setWinner] = useState<Faction | "draw" | null>(null);
  
  const [selectedCoord, setSelectedCoord] = useState<Coord | null>(null);
  const [validMoves, setValidMoves] = useState<Coord[]>([]);
  const [activePower, setActivePower] = useState<PowerSpec | null>(null);
  const [tempPowerCargo, setTempPowerCargo] = useState<any>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  const [chats, setChats] = useState<ChatMessage[]>([
    { id: "g1", speaker: "system", text: "TRANSLATIONAL COMMUNICATOR CHANNEL OPEN", timestamp: "00:00" },
    {
      id: "g2",
      speaker: "jesus",
      text: "Peace be with you. Let us approach this trial of minds with love, charity, and wisdom.",
      timestamp: "00:00",
    },
    {
      id: "g3",
      speaker: "caan",
      text: "SCREECH! CALCULATING CASUALTY INDEX... EXTERMINATION IMMINENT FOR THE DECEIVER!",
      timestamp: "00:00",
    },
  ]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
    audio.setMuted(isMuted);
  }, [isMuted]);

  const triggerGeminiCommentary = async (actionDesc: string) => {
    setIsThinking(true);
    try {
      const response = await fetch("/api/gemini/commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionDescription: actionDesc,
          history: history.slice(-5),
        }),
      });
      const data = await response.json();
      if (data && data.dialogue) {
        setChats((prev) => [
          ...prev,
          ...data.dialogue.map((item: any, idx: number) => ({
            id: `gem_${Date.now()}_${idx}`,
            speaker: item.speaker,
            text: item.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })),
        ]);
      }
    } catch (err) {
      console.error("Commentary API call failed, falls back gracefully", err);
    } finally {
      setIsThinking(false);
    }
  };

  const tickShieldsDurationAndResetStatus = (nextTurnFaction: Faction, nextBoard: Board): Board => {
    const updated = cloneBoard(nextBoard);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = updated[r][c];
        if (piece && piece.faction === nextTurnFaction && piece.isAscended) {
          if (piece.ascendedTurns && piece.ascendedTurns > 1) {
            piece.ascendedTurns--;
          } else {
            piece.isAscended = false;
            piece.ascendedTurns = undefined;
          }
        }
      }
    }
    return updated;
  };

  const switchTurnCycle = (nextBoard: Board, actionLog: string) => {
    const nextFaction = turn === "jesus" ? "caan" : "jesus";
    
    if (nextFaction === "jesus") {
      setJesusPP((p) => Math.min(10, p + 1));
    } else {
      setCaanPP((p) => Math.min(10, p + 1));
    }

    const tickedBoard = tickShieldsDurationAndResetStatus(nextFaction, nextBoard);

    setBoard(tickedBoard);
    setHistory((prev) => [...prev, actionLog]);
    setTurn(nextFaction);
    setSelectedCoord(null);
    setValidMoves([]);
    setActivePower(null);
    setTempPowerCargo(null);

    checkGameEndingConditions(tickedBoard, nextFaction);

    triggerGeminiCommentary(actionLog);
  };

  const checkGameEndingConditions = (currentBoard: Board, activeFaction: Faction) => {
    const jesusKing = findKing(currentBoard, "jesus");
    const caanKing = findKing(currentBoard, "caan");

    if (!jesusKing) {
      setStatus("exterminated_king");
      setWinner("caan");
      audio.playVictory();
      return;
    }
    if (!caanKing) {
      setStatus("exterminated_king");
      setWinner("jesus");
      audio.playVictory();
      return;
    }

    const hasLegalMoves = hasFactionAnyLegalMoves(currentBoard, activeFaction);
    const inCheck = isFactionsKingInCheck(currentBoard, activeFaction);

    if (!hasLegalMoves) {
      if (inCheck) {
        setStatus("checkmate");
        setWinner(activeFaction === "jesus" ? "caan" : "jesus");
        audio.playVictory();
      } else {
        setStatus("stalemate");
        setWinner(null);
      }
    }
  };

  const handleResetGame = () => {
    setBoard(createInitialBoard());
    setTurn("jesus");
    setHistory(["Game cyclical restart has completed. Faction Jesus goes first."]);
    setJesusPP(4);
    setCaanPP(4);
    setStatus("setup");
    setWinner(null);
    setSelectedCoord(null);
    setValidMoves([]);
    setActivePower(null);
    setTempPowerCargo(null);
    setChats([
      { id: "r1", speaker: "system", text: "WAVE CHANNELS RE-TUNING", timestamp: "00:00" },
      { id: "r2", speaker: "jesus", text: "Grace is constant. Let us meet again on clean sand.", timestamp: "00:00" },
      { id: "r3", speaker: "caan", text: "CAAN CALCULATES REPETITIVE ANOMALY... COMMENCE NEW COMBAT MODEL!", timestamp: "00:00" },
    ]);
  };

  useEffect(() => {
    if (status !== "playing") return;

    const isJesusAI = mode === "caan-vs-jesus-ai" || mode === "ai-vs-ai";
    const isCaanAI = mode === "jesus-vs-caan-ai" || mode === "ai-vs-ai";
    const activeIsAI = (turn === "jesus" && isJesusAI) || (turn === "caan" && isCaanAI);

    if (!activeIsAI || isThinking) return;

    const aiThinkTimer = setTimeout(() => {
      executeAITurn();
    }, 1200);

    return () => clearTimeout(aiThinkTimer);
  }, [turn, status, mode, isThinking]);

  const executeAITurn = () => {
    setIsThinking(true);

    const isJesus = turn === "jesus";
    const availablePP = isJesus ? jesusPP : caanPP;

    if (Math.random() < 0.22 && availablePP >= 3) {
      if (isJesus) {
        const captured = getCapturedPieces(board).jesus;
        if (captured.length > 0 && jesusPP >= 5) {
          const resurrectableType = captured.includes("q") ? "q" : captured.includes("r") ? "r" : captured.includes("n") ? "n" : "p";
          const emptyCoords: Coord[] = [];
          for (let r = 6; r <= 7; r++) {
            for (let c = 0; c < 8; c++) {
              if (!board[r][c]) emptyCoords.push({ row: r, col: c });
            }
          }
          if (emptyCoords.length > 0) {
            const dest = emptyCoords[Math.floor(Math.random() * emptyCoords.length)];
            const cloned = cloneBoard(board);
            cloned[dest.row][dest.col] = {
              id: `resurrected_${resurrectableType}_${Date.now()}`,
              type: resurrectableType,
              faction: "jesus",
              hasMoved: true,
            };
            setJesusPP((p) => p - 5);
            audio.playResurrect();
            setIsThinking(false);
            switchTurnCycle(cloned, `Jesus resolved LAZARUS MIRACLE: Resurrected a friendly ${resurrectableType.toUpperCase()} at [${dest.row}, ${dest.col}]!`);
            return;
          }
        }

        if (jesusPP >= 3) {
          const validFriendlyKnightsOrBishops: Coord[] = [];
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const cell = board[r][c];
              if (cell && cell.faction === "jesus" && (cell.type === "n" || cell.type === "b")) {
                validFriendlyKnightsOrBishops.push({ row: r, col: c });
              }
            }
          }
          if (validFriendlyKnightsOrBishops.length > 0) {
            const target = validFriendlyKnightsOrBishops[Math.floor(Math.random() * validFriendlyKnightsOrBishops.length)];
            const cloned = cloneBoard(board);
            const p = cloned[target.row][target.col];
            if (p) {
              p.type = "wine_knight";
              setJesusPP((p) => p - 3);
              audio.playMiracle();
              setIsThinking(false);
              switchTurnCycle(cloned, `Jesus resolved MIRACLE: Upgraded Knight/Bishop at [${target.row}, ${target.col}] to a sacred WINE KNIGHT!`);
              return;
            }
          }
        }
      } else {
        if (caanPP >= 5) {
          const targets: Coord[] = [];
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const cell = board[r][c];
              if (cell && cell.faction === "jesus" && !cell.isAscended && ["q", "wine_knight", "r", "b"].includes(cell.type)) {
                targets.push({ row: r, col: c });
              }
            }
          }
          if (targets.length > 0) {
            const victim = targets[Math.floor(Math.random() * targets.length)];
            const targetPiece = board[victim.row][victim.col];
            const cloned = cloneBoard(board);
            cloned[victim.row][victim.col] = null;

            setCaanPP((p) => p - 5);
            audio.playExterminate();
            setIsThinking(false);
            switchTurnCycle(cloned, `Caan fired CHRONO EXTERMINATION RAY! Vaporized White's ${targetPiece?.type.toUpperCase()} at [${victim.row}, ${victim.col}]!`);
            return;
          }
        }

        if (caanPP >= 3) {
          const pawns: Coord[] = [];
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const cell = board[r][c];
              if (cell && cell.faction === "caan" && cell.type === "p") {
                pawns.push({ row: r, col: c });
              }
            }
          }
          if (pawns.length > 0) {
            const target = pawns[Math.floor(Math.random() * pawns.length)];
            const cloned = cloneBoard(board);
            const p = cloned[target.row][target.col];
            if (p) {
              p.type = "cyber_drone";
              setCaanPP((p) => p - 3);
              audio.playCyberUpgraded();
              setIsThinking(false);
              switchTurnCycle(cloned, `Caan resolved CYBERNETIC INTEGRATION: Upgraded Pawn at [${target.row}, ${target.col}] to a heavy Cyber-Drone!`);
              return;
            }
          }
        }
      }
    }

    const aiMove = calculateBestMove(board, turn);
    if (aiMove) {
      const piece = board[aiMove.from.row][aiMove.from.col];
      const captured = board[aiMove.to.row][aiMove.to.col];
      const nextBoard = movePieceOnBoard(board, aiMove.from, aiMove.to);

      let log = `${turn === "jesus" ? "Jesus" : "Caan"} developed standard move: ${piece?.type.toUpperCase()} to ${String.fromCharCode(97 + aiMove.to.col)}${8 - aiMove.to.row}`;
      if (captured) {
        audio.playExplode();
        log += ` capturing the opponent ${captured.type.toUpperCase()}!`;
      } else {
        audio.playMove(turn);
      }

      setIsThinking(false);
      switchTurnCycle(nextBoard, log);
    } else {
      setIsThinking(false);
      const isCheck = isFactionsKingInCheck(board, turn);
      if (isCheck) {
        setStatus("checkmate");
        setWinner(turn === "jesus" ? "caan" : "jesus");
      } else {
        setStatus("stalemate");
      }
    }
  };

  const handleCustomVoiceDialogue = async (speaker: Faction) => {
    setIsThinking(true);
    const contextStr = `The human requested a dynamic whisper dialogue on behalf of ${speaker}. Turn number is active.`;
    await triggerGeminiCommentary(contextStr);
  };

  const handleArmPowerSpell = (spell: PowerSpec) => {
    if (turn !== spell.faction) return;
    const currentPP = turn === "jesus" ? jesusPP : caanPP;
    if (currentPP < spell.cost) {
      audio.playSelect();
      return;
    }

    setActivePower(spell);
    setSelectedCoord(null);

    const targets: Coord[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board[r][c];

        if (spell.id === "water_to_wine") {
          if (cell && cell.faction === turn && (cell.type === "n" || cell.type === "b")) {
            targets.push({ row: r, col: c });
          }
        }

        else if (spell.id === "loaves_and_fishes") {
          if (cell && cell.faction === turn && cell.type === "p") {
            targets.push({ row: r, col: c });
          }
        }

        else if (spell.id === "divine_protection") {
          if (cell && cell.faction === turn && !cell.isAscended) {
            targets.push({ row: r, col: c });
          }
        }

        else if (spell.id === "exterminate") {
          if (cell && cell.faction !== turn && !cell.isAscended) {
            targets.push({ row: r, col: c });
          }
        }

        else if (spell.id === "cyber_upgrade") {
          if (cell && cell.faction === turn && cell.type === "p") {
            targets.push({ row: r, col: c });
          }
        }

        else if (spell.id === "temporal_shift") {
          if (cell && cell.faction === turn) {
            targets.push({ row: r, col: c });
          }
        }

        else if (spell.id === "chronos_distortion") {
          if (cell && cell.faction !== turn) {
            targets.push({ row: r, col: c });
          }
        }

        else if (spell.id === "resurrection") {
          if (!cell && ((turn === "jesus" && r >= 6) || (turn === "caan" && r <= 1))) {
            targets.push({ row: r, col: c });
          }
        }

      }
    }

    setValidMoves(targets);
    audio.playSelect();
  };

  const handleCellClick = (coord: Coord) => {
    const isJesusAI = mode === "caan-vs-jesus-ai" || mode === "ai-vs-ai";
    const isCaanAI = mode === "jesus-vs-caan-ai" || mode === "ai-vs-ai";
    const currentIsAI = (turn === "jesus" && isJesusAI) || (turn === "caan" && isCaanAI);

    if (currentIsAI || status !== "playing" || isThinking) return;

    if (activePower) {
      const isValidTarget = validMoves.some((m) => m.row === coord.row && m.col === coord.col);
      if (!isValidTarget) {
        setActivePower(null);
        setValidMoves([]);
        setTempPowerCargo(null);
        audio.playSelect();
        return;
      }

      const cloned = cloneBoard(board);

      if (activePower.id === "water_to_wine") {
        const p = cloned[coord.row][coord.col];
        if (p) {
          p.type = "wine_knight";
          setJesusPP((p) => p - activePower.cost);
          audio.playMiracle();
          switchTurnCycle(cloned, `Jesus resolved MIRACLE: Upgraded Pawn/Knight at [${coord.row}, ${coord.col}] to a sacred WINE KNIGHT!`);
        }
      }

      else if (activePower.id === "loaves_and_fishes") {
        const adjOffsets = [
          { r: 0, c: -1 }, { r: 0, c: 1 }, { r: -1, c: 0 }, { r: 1, c: 0 }
        ];
        let spawned = false;
        for (const off of adjOffsets) {
          const r = coord.row + off.r;
          const c = coord.col + off.c;
          if (r >= 0 && r < 8 && c >= 0 && c < 8 && !cloned[r][c]) {
            cloned[r][c] = {
              id: `loaved_${Date.now()}`,
              type: "p",
              faction: "jesus",
              hasMoved: true,
            };
            spawned = true;
            break;
          }
        }

        if (spawned) {
          setJesusPP((p) => p - activePower.cost);
          audio.playMiracle();
          switchTurnCycle(cloned, `Jesus resolved MIRACLE: Multiplied loaves & fishes, duplicating Pawn near [${coord.row}, ${coord.col}]!`);
        } else {
          setActivePower(null);
          setValidMoves([]);
          audio.playSelect();
        }
      }

      else if (activePower.id === "divine_protection") {
        const p = cloned[coord.row][coord.col];
        if (p) {
          p.isAscended = true;
          p.ascendedTurns = 3;
          setJesusPP((p) => p - activePower.cost);
          audio.playResurrect();
          switchTurnCycle(cloned, `Jesus resolved MIRACLE: Cast golden ASCENSION standard protection shield on piece at [${coord.row}, ${coord.col}]!`);
        }
      }

      else if (activePower.id === "exterminate") {
        const victim = cloned[coord.row][coord.col];
        cloned[coord.row][coord.col] = null;
        setCaanPP((p) => p - activePower.cost);
        audio.playExterminate();
        switchTurnCycle(cloned, `Caan fired CHRONO EXTERMINATION RAY! Vaporized opponent's ${victim?.type.toUpperCase()} at [${coord.row}, ${coord.col}]!`);
      }

      else if (activePower.id === "cyber_upgrade") {
        const p = cloned[coord.row][coord.col];
        if (p) {
          p.type = "cyber_drone";
          setCaanPP((p) => p - activePower.cost);
          audio.playCyberUpgraded();
          switchTurnCycle(cloned, `Caan executed CYBER UPGRADE: Rebuilt Pawn at [${coord.row}, ${coord.col}] to a heavy Cyber-Drone warrior!`);
        }
      }

      else if (activePower.id === "temporal_shift") {
        if (!tempPowerCargo) {
          setTempPowerCargo(coord);
          const otherCoords: Coord[] = [];
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (r !== coord.row || c !== coord.col) {
                if (board[r][c] && board[r][c]?.faction === turn) {
                  otherCoords.push({ row: r, col: c });
                }
              }
            }
          }
          setValidMoves(otherCoords);
          audio.playSelect();
        } else {
          const src = tempPowerCargo;
          const pieceA = cloned[src.row][src.col];
          const pieceB = cloned[coord.row][coord.col];

          cloned[src.row][src.col] = pieceB;
          cloned[coord.row][coord.col] = pieceA;

          setCaanPP((p) => p - activePower.cost);
          audio.playTeleport();
          switchTurnCycle(cloned, `Caan executed TEMPORAL SHIFT: Swapped locations of pieces between [${src.row}, ${src.col}] and [${coord.row}, ${coord.col}]!`);
        }
      }

      else if (activePower.id === "chronos_distortion") {
        setCaanPP((p) => p - activePower.cost);
        audio.playTeleport();
        switchTurnCycle(cloned, `Caan unleashed CHRONO FIELD DISTORTION: Coordinates near [${coord.row}, ${coord.col}] are frozen!`);
      }

      else if (activePower.id === "resurrection") {
        const captured = getCapturedPieces(board)[turn];
        if (captured.length === 0) {
          setActivePower(null);
          setValidMoves([]);
          audio.playSelect();
          return;
        }

        const resurrectType = captured.includes("q") 
          ? "q" 
          : captured.includes("r") 
            ? "r" 
            : captured.includes("n") 
              ? "n" 
              : "p";

        cloned[coord.row][coord.col] = {
          id: `resurrected_${resurrectType}_${Date.now()}`,
          type: resurrectType,
          faction: turn,
          hasMoved: true,
        };

        setJesusPP((p) => p - activePower.cost);
        audio.playResurrect();
        switchTurnCycle(cloned, `Jesus resolved LAZARUS MIRACLE: Raised fallen friendly ${resurrectType.toUpperCase()} from death onto [${coord.row}, ${coord.col}]!`);
      }

      return;
    }

    if (!selectedCoord) {
      const piece = board[coord.row][coord.col];
      if (piece && piece.faction === turn) {
        setSelectedCoord(coord);
        const moves = getFullyValidMoves(board, coord);
        setValidMoves(moves);
        audio.playSelect();
      }
    } else {
      const isTargetValidMove = validMoves.some((m) => m.row === coord.row && m.col === coord.col);
      
      if (isTargetValidMove) {
        const piece = board[selectedCoord.row][selectedCoord.col];
        const targetPiece = board[coord.row][coord.col];
        const nextBoard = movePieceOnBoard(board, selectedCoord, coord);

        let actionLog = `${turn === "jesus" ? "Jesus" : "Caan"} developed standard move: ${piece?.type.toUpperCase()} from ${String.fromCharCode(97 + selectedCoord.col)}${8 - selectedCoord.row} to ${String.fromCharCode(97 + coord.col)}${8 - coord.row}`;
        
        if (targetPiece) {
          audio.playExplode();
          actionLog += ` capturing enemy ${targetPiece.type.toUpperCase()}!`;
        } else {
          audio.playMove(turn);
        }

        switchTurnCycle(nextBoard, actionLog);
      } else {
        const piece = board[coord.row][coord.col];
        if (piece && piece.faction === turn) {
          setSelectedCoord(coord);
          const moves = getFullyValidMoves(board, coord);
          setValidMoves(moves);
          audio.playSelect();
        } else {
          setSelectedCoord(null);
          setValidMoves([]);
          audio.playSelect();
        }
      }
    }
  };

  const handleDivineUndo = () => {
    if (history.length <= 1) return;
    const clonedHistory = [...history];
    clonedHistory.pop();
    setHistory(clonedHistory);
    
    setTurn(turn === "jesus" ? "caan" : "jesus");
    setSelectedCoord(null);
    setValidMoves([]);
    setActivePower(null);
    audio.playSelect();
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between overflow-x-hidden relative font-sans">
      <ControlOverlay
        status={status}
        winner={winner}
        selectedMode={mode}
        onSelectMode={setMode}
        onStartGame={() => setStatus("playing")}
        onResetGame={handleResetGame}
      />

      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,24,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.5)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />

      <header className="relative z-10 bg-slate-950/70 border-b border-slate-900/60 backdrop-blur px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 to-emerald-500 p-1.5 rounded-xl shadow-lg relative">
            <span className="text-slate-950 font-bold text-xl select-none font-serif">♰</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              Darlek Caan vs Jesus Chess
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              Sector: {mode.replace("-", " ").toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "playing" && (
            <button
              onClick={handleDivineUndo}
              className="p-2 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition flex items-center gap-1 text-xs"
              title="Forgive previous step and rollback turn state"
              id="btn_header_undo"
            >
              <Undo2 className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Undo Step</span>
            </button>
          )}
          <button
            onClick={() => setIsMuted((m) => !m)}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 transition"
            title={isMuted ? "Unmute procedurally synthesized audio" : "Mute audio"}
            id="btn_mute_audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-505" /> : <Volume2 className="w-4 h-4 text-[#38bdf8]" />}
          </button>
          <button
            onClick={handleResetGame}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 transition"
            title="Reset active gameplay to settings menu"
            id="btn_reset_header"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-tr from-[#121c2c] to-[#1e1d13] border-2 transition-all duration-300 flex flex-col justify-between flex-1 min-h-[340px] relative overflow-hidden ${
            turn === "jesus" ? "border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-950/5" : "border-slate-850 opacity-70"
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-lg font-serif">✝</span>
                  <span className="font-serif font-bold text-sm tracking-wide text-amber-200">DIVINE GRACE</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  FACTION WHITE
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Faith Pool</span>
                  <span className="text-amber-400 font-bold">{jesusPP} / 10 PP</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-amber-300 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    style={{ width: `${jesusPP * 10}%` }}
                  />
                </div>
              </div>

              <div 
                className="space-y-1.5 flex-grow overflow-y-auto max-h-[160px] pr-1"
                style={{ touchAction: "manipulation", WebkitOverflowScrolling: "touch" }}
              >
                {JESUS_POWERS.map((spell) => {
                  const isActive = activePower?.id === spell.id;
                  const canAfford = jesusPP >= spell.cost;
                  return (
                    <button
                      key={spell.id}
                      onClick={() => handleArmPowerSpell(spell)}
                      disabled={turn !== "jesus" || !canAfford || isThinking}
                      className={`w-full text-left p-2 rounded-xl transition-all border flex flex-col cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        isActive
                          ? "bg-amber-500 text-slate-950 border-white hover:bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                          : "bg-slate-950/40 border-amber-900/15 hover:border-amber-700/40 hover:bg-slate-900 text-slate-300"
                      }`}
                      id={`spell_${spell.id}`}
                    >
                      <div className="flex items-center justify-between w-full font-bold text-xs mb-0.5">
                        <span className="flex items-center gap-1 truncate">
                          {spell.id === "water_to_wine" && <GlassWater className="w-3.5 h-3.5" />}
                          {spell.id === "resurrection" && <Dna className="w-3.5 h-3.5" />}
                          {spell.id === "divine_protection" && <Shield className="w-3.5 h-3.5" />}
                          {spell.id === "loaves_and_fishes" && <Sparkles className="w-3.5 h-3.5" />}
                          {spell.name}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.2 ml-2 rounded bg-slate-900/60 text-amber-400 font-bold shrink-0">
                          {spell.cost} PP
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 leading-tight block">
                        {spell.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 text-[9px] text-amber-500/60 font-mono border-t border-amber-950/30 pt-1.5 flex items-center justify-between select-none">
              <span>ACTIVE DISCIPLES FORWARD</span>
              <span>COGNITION RATIO: 100%</span>
            </div>
          </div>

          <div className="flex-1 min-h-[220px] bg-slate-950/40 border border-slate-900 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block mb-2">
                FALLEN COMBAT HEAP
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 border border-amber-950/20 bg-amber-950/5 rounded-xl">
                  <span className="text-[9.2px] text-amber-500 font-bold block mb-1">✝ JESUS LOSS</span>
                  <div className="flex flex-wrap gap-1 text-base text-slate-500 min-h-[30px]" id="captured_jesus_list">
                    {getCapturedPieces(board).jesus.length === 0 ? (
                      <span className="text-[10px] opacity-40">None</span>
                    ) : (
                      getCapturedPieces(board).jesus.map((p, idx) => {
                        let sym = "♟";
                        if (p === "q") sym = "♛";
                        if (p === "r") sym = "♜";
                        if (p === "n") sym = "♞";
                        if (p === "b") sym = "♝";
                        return <span key={`capt_j_${idx}`} title={p.toUpperCase()} className="text-amber-100/50">{sym}</span>;
                      })
                    )}
                  </div>
                </div>

                <div className="p-2 border border-emerald-900/20 bg-emerald-950/5 rounded-xl">
                  <span className="text-[9.2px] text-emerald-500 font-bold block mb-1">◉ CAAN LOSS</span>
                  <div className="flex flex-wrap gap-1 text-base text-slate-500 min-h-[30px]" id="captured_caan_list">
                    {getCapturedPieces(board).caan.length === 0 ? (
                      <span className="text-[10px] opacity-40">None</span>
                    ) : (
                      getCapturedPieces(board).caan.map((p, idx) => {
                        let sym = "♟";
                        if (p === "q") sym = "♛";
                        if (p === "r") sym = "♜";
                        if (p === "n") sym = "♞";
                        if (p === "b") sym = "♝";
                        return <span key={`capt_c_${idx}`} title={p.toUpperCase()} className="text-emerald-100/50">{sym}</span>;
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900 mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current Turn Owner:</span>
              <span className={`font-bold uppercase tracking-wider ${
                turn === "jesus" ? "text-amber-400" : "text-emerald-400"
              }`}>
                {turn === "jesus" ? "✝ Jesus" : "◉ Caan AI"}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-center">
          <ChessBoard
            board={board}
            turn={turn}
            selectedCoord={selectedCoord}
            validMoves={validMoves}
            activePower={activePower ? activePower.id : null}
            onCellClick={handleCellClick}
            isThinking={isThinking}
          />

          <div className="mt-4 p-3 bg-slate-950/80 border border-slate-900 rounded-xl flex items-center gap-2.5 text-xs text-slate-400">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 font-mono font-bold uppercase tracking-wider rounded">INFO</span>
            <p className="leading-normal">
              Select standard chess pieces to view procedural movement fields or arm divine standard magic cards on the sidebar channels when energy reserves permit!
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-tr from-[#121c2c] to-[#121f18] border-2 transition-all duration-300 flex flex-col justify-between flex-1 min-h-[340px] relative overflow-hidden ${
            turn === "caan" ? "border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-emerald-950/5" : "border-slate-850 opacity-70"
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-lg font-mono">◉</span>
                  <span className="font-mono font-bold text-sm tracking-wide text-emerald-200">TEMPORAL WEAPONRY</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  FACTION BLACK
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Cyber Reserves</span>
                  <span className="text-emerald-400 font-bold">{caanPP} / 10 PP</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-emerald-300 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: `${caanPP * 10}%` }}
                  />
                </div>
              </div>

              <div 
                className="space-y-1.5 flex-grow overflow-y-auto max-h-[160px] pr-1"
                style={{ touchAction: "manipulation", WebkitOverflowScrolling: "touch" }}
              >
                {CAAN_POWERS.map((spell) => {
                  const isActive = activePower?.id === spell.id;
                  const canAfford = caanPP >= spell.cost;
                  return (
                    <button
                      key={spell.id}
                      onClick={() => handleArmPowerSpell(spell)}
                      disabled={turn !== "caan" || !canAfford || isThinking}
                      className={`w-full text-left p-2 rounded-xl transition-all border flex flex-col cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        isActive
                          ? "bg-emerald-500 text-slate-950 border-white hover:bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                          : "bg-slate-950/40 border-emerald-900/15 hover:border-emerald-700/40 hover:bg-slate-900 text-slate-300"
                      }`}
                      id={`spell_${spell.id}`}
                    >
                      <div className="flex items-center justify-between w-full font-bold text-xs mb-0.5">
                        <span className="flex items-center gap-1 truncate">
                          {spell.id === "exterminate" && <Trash2 className="w-3.5 h-3.5" />}
                          {spell.id === "cyber_upgrade" && <Zap className="w-3.5 h-3.5" />}
                          {spell.id === "temporal_shift" && <RefreshCw className="w-3.5 h-3.5" />}
                          {spell.id === "chronos_distortion" && <ShieldAlert className="w-3.5 h-3.5" />}
                          {spell.name}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.2 ml-2 rounded bg-slate-900/60 text-emerald-400 font-bold shrink-0">
                          {spell.cost} PP
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 leading-tight block">
                        {spell.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 text-[9px] text-emerald-500/60 font-mono border-t border-emerald-950/30 pt-1.5 flex items-center justify-between select-none">
              <span>CYBERNETIC NODES: ONLINE</span>
              <span>TIME VECTOR: 0.992</span>
            </div>
          </div>

          <div className="flex-1 min-h-[300px] flex flex-col">
            <CommentaryPanel
              chats={chats}
              isThinking={isThinking}
              onAskCustomDialogue={handleCustomVoiceDialogue}
            />
          </div>
        </div>
      </main>

      <footer className="relative z-10 bg-slate-950/90 border-t border-slate-900 py-3.5 text-center text-[10px] text-slate-600 font-mono tracking-wider uppercase select-none">
        <span>COSMIC REALM TEMPORAL DISCORD CHANNEL // DALEK-CAAN VS JESUS CORE</span>
      </footer>
    </div>
  );
}
```

## STUDIO ACTIVATION INSTRUCTIONS
You are now working on the **live enhanced Darlek Caan system** in the DKC repository[](https://github.com/craighckby-stack/DKC). Use ONLY the current mutated code and documentation from this snapshot. Respect all DARLEK_CAAN mutations, self-merge logic, quantum hooks, agent orchestra, live enhancement features, dual AI chess engines (Caan cheats + Jesus miracles), and EMG Core integration. Ignore any original AI Studio template state. Continue evolution from this exact current state.
