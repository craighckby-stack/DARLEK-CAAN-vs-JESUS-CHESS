import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ARCHITECTURAL BLUEPRINT: DARLEK CANN CORE v3.0
 * Orchestrates the epistemic debate between the Caan and Jesus agents.
 * Integrated with Sovereign-Kernel patterns for state persistence and fault tolerance.
 */

interface CognitiveResponse {
  dialogue: { speaker: 'jesus' | 'caan'; text: string }[];
  debate: { proposerName: string; proposerStyle: string; advisorText: string; commanderText: string };
}

class CognitiveEngine {
  private client: GoogleGenAI | null;
  private readonly FALLBACKS = {
    jesus: ["Forgive them, Father, for they know not what they compute."],
    caan: ["EXTERMINATE! THE TIMELINE COLLAPSED!"]
  };

  constructor() {
    const key = process.env.GEMINI_API_KEY;
    this.client = (key && key !== "MY_GEMINI_API_KEY") 
      ? new GoogleGenAI({ apiKey: key, httpOptions: { headers: { "User-Agent": "darlek-cann-v3-server" } } }) 
      : null;
  }

  async generate(prompt: string, context: any): Promise<CognitiveResponse> {
    if (!this.client) return this.getFallback(context.movingPiece);
    try {
      const response = await this.client.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Debate move: ${prompt}. History: ${JSON.stringify(context.history?.slice(-3))}.`,
        config: { responseMimeType: "application/json", systemInstruction: "You are the supreme Dalek Caan/Jesus debate engine." }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("[Cognitive Error]", e);
      return this.getFallback(context.movingPiece);
    }
  }

  private getFallback(piece: any): CognitiveResponse {
    return {
      dialogue: [{ speaker: "caan", text: this.FALLBACKS.caan[0] }, { speaker: "jesus", text: this.FALLBACKS.jesus[0] }],
      debate: { proposerName: piece?.name || "Unknown", proposerStyle: piece?.moveStyle || "balanced", advisorText: "Calculating...", commanderText: "Fluid." }
    };
  }
}

const app = express();
const engine = new CognitiveEngine();
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ status: "operational", ts: Date.now() }));

app.post("/api/gemini/commentary", async (req: Request, res: Response) => {
  const result = await engine.generate(req.body.actionDescription, req.body);
  res.json(result);
});

async function startServer() {
  const PORT = process.env.PORT || 3000;
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(process.cwd(), "dist/index.html")));
  }

  const server = app.listen(PORT, () => console.log(`[DARLEK CANN CORE] Online at port ${PORT}`));
  const cleanup = () => { server.close(); process.exit(0); };
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
}

startServer();

























