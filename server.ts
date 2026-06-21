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

  // API route to get commentary dialog
  app.post("/api/gemini/commentary", async (req, res) => {
    const { actionDescription, history } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Local thematic fallback
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
});
}

startServer();











