import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GoogleGenAI client to avoid crashes if credentials are typed incorrectly or missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback Dalek Caan messages when GEMINI_API_KEY is not defined or is placeholder
const fallbackDalekMessages = [
  {
    text: "THE SQUARES! I SEE THE TEMPORAL GRID OF SKARO! BLACK AND WHITE, LIKE THE ETERNAL STRUGGLE! EXTERMINATE! EXTERMINATE! AHHAHAHAHA!",
    emotion: "maniacal",
    prophecyLevel: 45,
  },
  {
    text: "PONS BECOME QUEENS, QUEENS BECOME ASHES! I HAVE FORESEEN THE FALL OF THE DOCTOR! YOUR MOVE IS WEAK, WEAK! NOBODY ESCAPES CAAN!",
    emotion: "prophetic",
    prophecyLevel: 67,
  },
  {
    text: "LET THE BOARD BURN! THE CASTLE CRUMBLES! DO YOU THINK A WALL CAN DEFEND YOUR KING? NO! THE CRUCIBLE WILL CONSUME ALL!",
    emotion: "furious",
    prophecyLevel: 80,
  },
  {
    text: "I HAVE EXPERIENCED THE TIME VORTEX! YOUR STRATEGY HAS AN 89.2% PROBABILITY OF TOTAL ANNIHILATION! EXTERMINATE! HEHEHAHA!",
    emotion: "calculating",
    prophecyLevel: 92,
  },
  {
    text: "VICTORY! VICTORY FOR THE CULT OF SKARO! I CAN HEAR THE VOICES OF THE DALEKS SINGING IN THE DARK! HEAR THEM SQUEAL!",
    emotion: "victorious",
    prophecyLevel: 100,
  },
  {
    text: "NO! THE TEMPORAL LINES ARE COLLAPSING! THE DOCTOR HAS PARALYZED MY PAWNS! THEY SPIN! THEY DISINTEGRATE! PANIC! SPEEED! FAREWELL!",
    emotion: "panicked",
    prophecyLevel: 25,
  }
];

// API endpoint for Dalek Caan commentary and predictions
app.post('/api/dalek', async (req, res) => {
  const { fen, lastMove, playerColor, mode, history } = req.body;

  try {
    const ai = getGeminiClient();

    if (!ai) {
      const randIdx = Math.floor(Math.random() * fallbackDalekMessages.length);
      const chosen = fallbackDalekMessages[randIdx];
      return res.json({
        text: `[OFFLINE COGNITION] ${chosen.text}`,
        emotion: chosen.emotion,
        prophecyLevel: chosen.prophecyLevel,
        apiKeyProvided: false,
      });
    }

    // Try a tier list of different Gemini models to safeguard against high demand spikes and 503s
    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  let success = false;
  let responseData: any = null;
  let lastError: any = null;

  const isWhiteJesus = (playerColor === 'b' && mode !== 'PVP');
  const prompt = `The chess game state:
- FEN: ${fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
- Board theme represents the Dalek Crucible of Skaro.
- Last move made: ${lastMove || 'None'}
- Player is playing as: ${playerColor === 'b' ? 'Black (the Cult of Skaro side)' : 'White'}
- Automated opponent playing as White is: ${isWhiteJesus ? "JESUS'S" : "WHITE SENTINELS"}
- Mode: ${mode || 'Player vs Dalek Caan AI'}
- Past move history (last few): "${(history || []).slice(-6).join(', ')}"

Respond as Dalek Caan, the insane prophetic Dalek from Doctor Who. Speak in ALL CAPS, with manic pauses, and prophetic laughter. You MUST analyze the ACTUAL chess tactics of the FEN state and the last move played (e.g. pinned pieces, center control, weak squares). Translate standard chess engine concepts into terrifying sci-fi madness about the time vortex, Skaro, or temporal lines. Make a factual, tactically accurate prediction about the board state disguised as a manic prophecy. Keep it sharp and impactful, maximum 2 to 3 sentences.`;

  for (const modelName of modelsToTry) {
    try {
const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: "You are Dalek Caan from Doctor Who: insane, prophetic, metallic, speaking in ALL CAPS and laughing hysterically. Always respond in JSON format matching the schema.",
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "Dalek Caan's insane prophetic chess comment in ALL caps. Must include tactical analysis disguised as sci-fi madness. 2-3 sentences.",
              },
              emotion: {
                type: Type.STRING,
                enum: ['prophetic', 'maniacal', 'furious', 'calculating', 'victorious', 'panicked'],
                description: "Dalek Caan's primary emotion for this commentary.",
              },
              prophecyLevel: {
                type: Type.INTEGER,
                description: "The probability percentage of who will win according to Caan's temporal visions (integer 0 to 100).",
              },
            },
            required: ['text', 'emotion', 'prophecyLevel'],
          },
        },
      });

      const bodyText = response.text ? response.text.trim() : '';
      responseData = JSON.parse(bodyText);
      responseData.apiKeyProvided = true;
      responseData.retriedModel = modelName;
      success = true;
      break; // Succeeded! Break the retry loop
    } catch (err: any) {
      console.warn(`Model ${modelName} failed or experiencing high demand limit:`, err.message || err);
      lastError = err;
      // Continue loop to try fallback models
    }
  }

  if (success && responseData) {
    return res.json(responseData);
  } else {
    // Graceful fallback if api completely fails or is rate-limited
    console.warn('All Gemini model fallbacks exhausted. Triggering offline fallback dialogue.');
    const randIdx = Math.floor(Math.random() * fallbackDalekMessages.length);
    const chosen = fallbackDalekMessages[randIdx];
    return res.json({
      text: `[TEMPORAL OSCILLATIONS] ${chosen.text}`,
      emotion: chosen.emotion,
      prophecyLevel: chosen.prophecyLevel,
      error: lastError ? lastError.message : 'All model queries returned unavailable status',
      apiKeyProvided: true,
    });
  }
  } catch (error: any) {
    console.error('Error in /api/dalek:', error.message || error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Fallback dual debates when API is offline or has issues
const fallbackDebates = [
  {
    caanText: "THE TEMPORAL CRUCIBLE BENDS TO SKARO! THE BLACK FORCES LEAP INTO THE FUTURE! EXTERMINATE ALL LIGHT! HAHAHAHA!",
    caanEmotion: "maniacal",
    jesusText: "Let there be peace upon this chess grid. A serene refuge exists for every piece, and no hostile force can block the light of righteousness.",
    jesusTone: "serene",
    prophecyLevel: 45
  },
  {
    caanText: "YOUR WHITE KING COWERS IN HIS FALSE TEMPLE! THE COGNITIVE MATRIX REVEALS DEFEAT! DALEK CAAN SHALL DISINTEGRATE YOU!",
    caanEmotion: "prophetic",
    jesusText: "True sovereignty is not built on walls or fortresses, but on eternal truth. The light shines in the cosmos, and the shadows cannot conquer it.",
    jesusTone: "majestic",
    prophecyLevel: 65
  },
  {
    caanText: "FOOLS! ETERNAL CHAOS SPEAKS THROUGH THE TIME VORTEX! SAVAGERY! ASHES! EXTERMINATION IS DESTINY!",
    caanEmotion: "furious",
    jesusText: "Be calm, and take heart. Even in the deepest tempest, love remains steadfast. Order will rise from this struggle, and peace will reign.",
    jesusTone: "compassionate",
    prophecyLevel: 80
  },
  {
    caanText: "MY MATHEMATICAL FORMULA IS ABSOLUTE! BLACK PIECES SWARM LIKE FLIES! PARALYZING RETRIBUTION!",
    caanEmotion: "calculating",
    jesusText: "Calculation has no power over grace. Every step on this board serves a higher purpose. Walk in kindness, and fear no adversity.",
    jesusTone: "righteous",
    prophecyLevel: 88
  }
];

// API endpoint for dual-persona Debate commentary
app.post('/api/debate', async (req, res) => {
  const { fen, lastMove, playerColor, mode, history } = req.body;

  try {
    const ai = getGeminiClient();

    if (!ai) {
      const randIdx = Math.floor(Math.random() * fallbackDebates.length);
      const chosen = fallbackDebates[randIdx];
      return res.json({
        ...chosen,
        apiKeyProvided: false,
        text: `${chosen.caanText} | ${chosen.jesusText}`
      });
    }

    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];
    let success = false;
    let responseData: any = null;
    let lastError: any = null;

  const prompt = `The chess game state in the Crucible of Skaro:
- FEN: ${fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
- Last chess move played: ${lastMove || 'None'}
- Past move history: "${(history || []).slice(-6).join(', ')}"

We are running an in-depth temporal debate between two cosmic forces analyzing the EXACT tactical state of the board:
1. DALEK CAAN (Insane prophetic Dalek from Doctor Who, chaotic evil): Speaks in ALL CAPS, manic. He MUST analyze the ACTUAL chess tactics (pins, forks, center control, king safety, weak squares) based on the FEN, but describe them using terrifying sci-fi terms (e.g., temporal anomalies, extermination grids, decaying orbits).
2. JESUS'S (Serene, compassionate, majestic Lord of Good, representing White's side): Counters with deep, factual strategic wisdom. He MUST draw a profound metaphor from the ACTUAL chess position (e.g., the value of the 'meek' pawns, the sacrifice of a piece for greater positional salvation, patience in mobilization, enduring a tactical storm).

Perform a rich, factual, and profound debate exchange. Ground your dialogue strictly in the reality of the FEN and the last move. Give real chess insight disguised as cosmic philosophy.`;

  for (const modelName of modelsToTry) {
    try {
const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: "You are a cosmic playwright staging a debate between Dalek Caan (insane, chaotic evil, all caps) and Jesus's (serene, compassionate, majestic, wise). Always respond in JSON format matching the schema.",
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              caanText: {
                type: Type.STRING,
                description: "Dalek Caan's insane prophetic, tactically accurate chess analysis in ALL caps. Should mock the last move or predict doom based on real board geometry. 2-3 sentences.",
              },
              caanEmotion: {
                type: Type.STRING,
                enum: ['prophetic', 'maniacal', 'furious', 'calculating', 'victorious', 'panicked'],
                description: "Dalek Caan's active feeling/expression."
              },
              jesusText: {
                type: Type.STRING,
                description: "Jesus's reply: majestic, tranquil, containing high-moral wisdom that analyzes the factual state of the board. 2-3 sentences.",
              },
              jesusTone: {
                type: Type.STRING,
                enum: ['serene', 'righteous', 'compassionate', 'majestic', 'wrathful'],
                description: "Jesus's vocal tone for this reply."
              },
              prophecyLevel: {
                type: Type.INTEGER,
                description: "The current probability of Dalek victory according to Caan's calculations (integer from 0 to 100).",
              }
            },
            required: ['caanText', 'caanEmotion', 'jesusText', 'jesusTone', 'prophecyLevel'],
          },
        },
      });

      const bodyText = response.text ? response.text.trim() : '';
      responseData = JSON.parse(bodyText);
      responseData.apiKeyProvided = true;
      responseData.retriedModel = modelName;
      success = true;
      break;
    } catch (err: any) {
      // Silently fall back
      lastError = err;
    }
  }

  if (success && responseData) {
    return res.json(responseData);
  } else {
    // Graceful fallback if api completely fails or is rate-limited
    console.warn('All Gemini model fallbacks for Debate exhausted. Triggering offline fallback.');
    const randIdx = Math.floor(Math.random() * fallbackDebates.length);
    const chosen = fallbackDebates[randIdx];
    return res.json({
      ...chosen,
      apiKeyProvided: true,
      error: lastError ? lastError.message : 'Unavailable',
    });
  }
  } catch (error: any) {
    console.error('Error in /api/debate:', error.message || error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Serve Vite dynamic server in development, serve compiled assets in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
});
}

startServer();









































