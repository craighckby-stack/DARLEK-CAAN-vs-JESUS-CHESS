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

  // API route to get commentary dialog & multi-agent council debates
  app.post("/api/gemini/commentary", async (req, res) => {
    const { actionDescription, history, movingPiece, capturedPiece } = req.body;
    const client = getGeminiClient();

    // Helper to generate a top-tier local fallback Council Debate
    const makeFallbackDebate = () => {
      const faction = movingPiece?.faction || "jesus";
      const name = movingPiece?.name || (faction === "jesus" ? "Apostle Peter" : "Dalek Drone");
      const style = movingPiece?.moveStyle || "balanced";
      
      if (faction === "jesus") {
        const advisors = [
          { name: "Apostle Thomas", role: "Skeptical Disciple", text: "Are we absolutely certain of this path? I have strong doubts about exposing our holy flank." },
          { name: "Apostle Andrew", role: "Fireside Helper", text: "I believe this is a strong step. Let us assist each other and trust the Master's wisdom." },
          { name: "Mother Mary", role: "Queen of Heaven", text: "Let peaceful grace guide your steps. My cosmic star cloak covers you." },
          { name: "Apostle James", role: "Son of Thunder", text: "A mighty strike! Let the thunder of heaven rain upon Skaro's metallic metal heads!" }
        ];
        const chosen = advisors[Math.floor(Math.random() * advisors.length)];
        return {
          proposerName: name,
          proposerText: `I am advancing with my ${style} logic. This coordinate choice offers a proper testimony.`,
          proposerStyle: style,
          advisorName: chosen.name,
          advisorText: chosen.text,
          advisorRole: chosen.role,
          commanderText: `Fear not, my disciples. Let this move be resolved with love. All timelines are within my Father's care.`
        };
      } else {
        const advisors = [
          { name: "The Master", role: "Rogue Time Lord", text: "A marvelous design, but far too simple! I would have vaporized three coordinate zones simultaneously!" },
          { name: "Cyber Leader", role: "Steel Strategist", text: "Calculations indicate this step is highly logical. Maximum organic upgrade rates shall follow." },
          { name: "Dalek Sec", role: "Skaro Commander", text: "OBEY THE COGNITIVE COMMANDS OF THE CULT OF SKARO!" },
          { name: "Dalek Jast", role: "Zealous Inquisitor", text: "SCREECH! We are surrounded by holy anomalies! Alert the defense ray arrays!" }
        ];
        const chosen = advisors[Math.floor(Math.random() * advisors.length)];
        return {
          proposerName: name,
          proposerText: `Initiating strategic sector occupation! Dalek trajectory style: ${style}. Extermination imminent!`,
          proposerStyle: style,
          advisorName: chosen.name,
          advisorText: chosen.text,
          advisorRole: chosen.role,
          commanderText: `SCREEECH! THE PROPHET CAAN SEES THE MATRIX! THE TIMELINE COGNITION DECREES THIS MOVE TO BE ABSOLUTE!`
        };
      }
    };

    if (!client) {
      console.log("No GEMINI_API_KEY found, playing fallback dialogues.");
      let jText = JESUS_FALLBACKS[Math.floor(Math.random() * JESUS_FALLBACKS.length)];
      let cText = CAAN_FALLBACKS[Math.floor(Math.random() * CAAN_FALLBACKS.length)];

      if (movingPiece) {
        if (movingPiece.faction === "jesus") {
          jText = `[${movingPiece.name}] Active under style "${movingPiece.moveStyle || 'balanced'}": ${movingPiece.personality}`;
        } else {
          cText = `[${movingPiece.name}] Deploying Skaro tactics with style "${movingPiece.moveStyle || 'balanced'}": ${movingPiece.personality}`;
        }
      }
      
      if (capturedPiece) {
        if (capturedPiece.faction === "jesus") {
          jText = `[${capturedPiece.name}] My temporal mission completes. Father, forgive their metallic ignorance.`;
        } else {
          cText = `[${capturedPiece.name}] EMERGENCY BREACH! DEFENSES OVERRUN! RETREAT COMPELLED!`;
        }
      }
      
      const isJesusTrigger = actionDescription?.toLowerCase().includes("jesus") || Math.random() > 0.5;
      const dialogue = isJesusTrigger
        ? [
            { speaker: "jesus", text: jText },
            { speaker: "caan", text: cText },
          ]
        : [
            { speaker: "caan", text: cText },
            { speaker: "jesus", text: jText },
          ];

      return res.json({ dialogue, debate: makeFallbackDebate() });
    }

    try {
      const isJesusFaction = (movingPiece?.faction === "jesus");
      const prompt = `React to this chess move event in ours game of 'Darlek Caan vs Jesus Chess'.
Last Action: "${actionDescription}"
Move Logs History: ${JSON.stringify(history?.slice(-5) || [])}

Moving Faction Piece details:
- Name: "${movingPiece?.name || 'Unknown'}"
- Persona: "${movingPiece?.personality || 'Unknown'}"
- Tactical move style: "${movingPiece?.moveStyle || 'balanced'}"

Captured Faction Piece details (if any):
- Name: "${capturedPiece?.name || 'None'}"
- Persona: "${capturedPiece?.personality || 'None'}"

Generate:
1. A short general dialogue (exactly 2 lines) reacting to this step for the Wavefeed Chat window.
2. An interactive Council Chamber Debate transcript representing the moving faction's internal political discussion:
   - "proposerName": The exact name of the moving piece ("${movingPiece?.name || 'Unknown'}").
   - "proposerText": Why this agent chose this coordinate move in accordance with its tactical style ("${movingPiece?.moveStyle || 'balanced'}").
   - "proposerStyle": "${movingPiece?.moveStyle || 'balanced'}".
   - "advisorName": Name of a friendly council member of the SAME faction (e.g. for Jesus: "Apostle Thomas", "Apostle Andrew", "Mother Mary", or "Apostle John"; for Caan: "The Master", "Cyber Leader", "Dalek Sec", or "Dalek Jast").
   - "advisorRole": A funny, fitting descriptor like "Skeptical Doubter", "Mechanical Logician", "Fiery Patriot".
   - "advisorText": Reaction to the move (critique, support, doubt, or upgrade proposal).
   - "commanderText": The final veto, approval, or sovereign command given by the faction's supreme leader:
      - For Jesus faction: Jesus Christ giving tranquil divine consent or a holy parable.
      - For Caan faction: Black Dalek Caan screaching in insane temporal prophecies.

Return a valid JSON object matching this schema exactly:
{
  "dialogue": [
    { "speaker": "jesus" | "caan", "text": "Action reaction comment" }
  ],
  "debate": {
    "proposerName": "Piece Name",
    "proposerText": "Speech of proposer",
    "proposerStyle": "aggressive" | "cautious" | "balanced" | "erratic" | "protective",
    "advisorName": "Advisor Name",
    "advisorText": "Advisor feedback line",
    "advisorRole": "Advisor Role Title",
    "commanderText": "The King/Prophet ultimate say verdict"
  }
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
                    text: { type: Type.STRING }
                  },
                  required: ["speaker", "text"]
                }
              },
              debate: {
                type: Type.OBJECT,
                properties: {
                  proposerName: { type: Type.STRING },
                  proposerText: { type: Type.STRING },
                  proposerStyle: { type: Type.STRING },
                  advisorName: { type: Type.STRING },
                  advisorText: { type: Type.STRING },
                  advisorRole: { type: Type.STRING },
                  commanderText: { type: Type.STRING }
                },
                required: ["proposerName", "proposerText", "proposerStyle", "advisorName", "advisorText", "advisorRole", "commanderText"]
              }
            },
            required: ["dialogue", "debate"]
          },
          systemInstruction: "You are a master writer of comedic sci-fi and biblical fan-fiction. You generate crisp, laugh-out-loud multi-agent faction council sessions where pieces express separate individual personalities and debate their tactical styles under the supreme command of Jesus or Dalek Caan.",
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
      let errStr = String(err).toLowerCase();
      try {
        errStr += " " + JSON.stringify(err).toLowerCase();
      } catch (e) {}

      console.log("Using local offline fallback dialogs (API unavailable).");

      const isQuotaExceeded = errStr.includes("429") || errStr.includes("quota") || errStr.includes("exhausted");
      const isServiceUnavailable = errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("high demand") || errStr.includes("spike");
      
      const jText = JESUS_FALLBACKS[Math.floor(Math.random() * JESUS_FALLBACKS.length)];
      const cText = CAAN_FALLBACKS[Math.floor(Math.random() * CAAN_FALLBACKS.length)];

      const fallbackDebate = makeFallbackDebate();

      if (isQuotaExceeded) {
        return res.json({
          dialogue: [
            { speaker: "system", text: "⚠️ [NOTICE: GEMINI API FREE TIER DAILY QUOTA EXCEEDED (429). COGNITIVE MEMORY COUPLERS ONLINE.]" },
            { speaker: "caan", text: `SCREEECH! COGNITION CHANNELS SATURATED! CHRONO-CORE RESTORES DYNAMICS!` },
            { speaker: "jesus", text: `May simple local wisdom suffice. Let us hold our fellowship in peace.` }
          ],
          debate: fallbackDebate
        });
      }

      if (isServiceUnavailable) {
        return res.json({
          dialogue: [
            { speaker: "system", text: "⚠️ [NOTICE: GEMINI CLOUD OVERLOADED (503 SERVICE UNAVAILABLE). FALLBACK CHRONOSPHERE CORE DEPLOYED.]" },
            { speaker: "caan", text: `WARNING! DEMENTED TIMELINE SPIKES DETECTED! INJECTS DYNAMIC LOCAL DEFENSES!` },
            { speaker: "jesus", text: `Let our hearts remain calm during this cosmic storm. Divine shield is active.` }
          ],
          debate: fallbackDebate
        });
      }

      return res.json({
        dialogue: [
          { speaker: "caan", text: `GLITCH! ENFORCING STANDARD DECK PATTERNS! COLP: ${cText}` },
          { speaker: "jesus", text: `Peace be with you. ${jText}` }
        ],
        debate: fallbackDebate
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
