import { useState, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { motion, AnimatePresence } from 'motion/react';
import { getBestMove, isSafeFen } from './utils/engine';
import { ChessBoard } from './components/ChessBoard';
import { playSynthSound, speakDalekText, speakJesusText, stopSpeaking, initAudioEngine, setChronosLoadValue } from './components/SoundEngine';
import { GameMode, GameDifficulty, BoardTheme, GameSettings, DalekDialogue, DebateDialogue } from './types';
import { useSystemBootstrap } from './hooks/useSystemBootstrap';
import { useQuantumState } from './hooks/useQuantumState';
import { useAgentOrchestra } from './hooks/useAgentOrchestra';
import { OMEGA_BOOT_SEQUENCE } from './lib/omega-bootstrap';

// Safety wrapper to prevent removing a king
const safeRemove = (board: Chess, square: Square): boolean => {
  const piece = board.get(square);
  if (piece && piece.type === 'k') {
    console.warn("Safety check: Refusal to remove king from square", square);
    return false;
  }
  board.remove(square);
  return true;
};

// Safety wrapper to prevent overwriting a king
const safePut = (board: Chess, piece: { type: string; color: string }, square: Square): boolean => {
  const existing = board.get(square);
  if (existing && existing.type === 'k') {
    console.warn("Safety check: Refusal to overwrite king on square", square);
    return false;
  }
  // chess.js throws if we put a pawn on rank 1 or 8.
  if (piece.type === 'p' && (square.endsWith('1') || square.endsWith('8'))) {
     console.warn("Safety check: Refusal to put pawn on edge rank", square);
     return false;
  }
  board.put(piece as any, square);
  return true;
};

// Safety clone to guarantee we never throw an Uncaught Error on cloning
const safeClone = (board: Chess): Chess => {
  try {
    return new Chess(board.fen());
  } catch (e) {
    console.error("Failed to clone chess board, falling back to new board.", e);
    return new Chess();
  }
};
import {
  Skull,
  Radio,
  Sliders,
  Volume2,
  VolumeX,
  RefreshCw,
  Undo2,
  HelpCircle,
  Sparkles,
  Award,
  Zap,
  Clock,
  Heart,
  Trophy
} from 'lucide-react';

export default function App() {
  const isReady = useSystemBootstrap();
  const { status: orchestraStatus, dispatch: dispatchOrchestra } = useAgentOrchestra();
  const [quantumMetrics, setQuantumMetrics] = useQuantumState({
    timelineStability: 100,
    entropyCoefficient: 0.12,
    chronosLoad: 0,
    omegaTuningStatus: 'PENDING'
  });

  // Game state
  const [chess, setChess] = useState<Chess>(new Chess());
  const [gameState, setGameState] = useState<string>('active'); // active, draw, checkmate, stalemate
  const [winner, setWinner] = useState<'w' | 'b' | 'draw' | null>(null);
  
  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    mode: GameMode.PVD, // default to Player vs Dalek AI
    difficulty: GameDifficulty.MEDIUM,
    theme: BoardTheme.CRUCIBLE,
    playerColor: 'w',
    muteSounds: false,
    synthesizerVolume: 0.6,
  });

  // Moves history and captured pieces
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [captured, setCaptured] = useState<{ w: string[]; b: string[] }>({ w: [], b: [] });
  
  // Dalek dialogue console State
  const [dialogue, setDialogue] = useState<DalekDialogue>({
    text: "THE BOARD IS INERT! THE TIME GRID OF SKARO AWAITS YOUR MEDDLING! I DEMAND YOU MAKE YOUR FIRST TRANSACTION OF TACTICS! PLAY AS WHITE, OR FLIP THE GEOMETRY!",
    emotion: "prophetic",
    prophecyLevel: 50,
    timestamp: Date.now(),
  });
  const [loadingDialogue, setLoadingDialogue] = useState<boolean>(false);

  // Unified Debate States (insane Dalek Caan vs holy Jesus's)
  const [debate, setDebate] = useState<DebateDialogue | null>(null);
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const [loadingDebate, setLoadingDebate] = useState<boolean>(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'caan' | 'jesus' | null>(null);
  const [caanTimer, setCaanTimer] = useState<number>(15 * 60); // 15m default
  const [jesusTimer, setJesusTimer] = useState<number>(15 * 60); // 15m default
  
  // Simulated brain-wave oscillator state
  const [waveFrequency, setWaveFrequency] = useState<number[]>(Array.from({ length: 15 }, () => Math.random() * 80));

  // Scoreboard / Tally state
  const [score, setScore] = useState({
    jesusWins: 0,
    caanWins: 0,
    draws: 0,
    caanDelusions: 0
  });

  // State to log of how many times Dalek Caan thinks he's won & his insane boasts
  const [boastArchive, setBoastArchive] = useState<{ id: string; timestamp: string; text: string; source: string }[]>([]);

  const addBoastToArchive = (text: string, source: string) => {
    if (!text) return;
    setBoastArchive(prev => {
      // Prevent duplicate logging of identical boasts
      if (prev.some(b => b.text === text)) return prev;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return [{ id: Math.random().toString(36).substring(2, 9), timestamp: timeStr, text, source }, ...prev];
    });
  };

  // Automatically catalog Dalek Caan dialogue boasts (victorious, maniacal, prophetic speech)
  useEffect(() => {
    if (dialogue.text && (dialogue.emotion === 'victorious' || dialogue.emotion === 'maniacal' || dialogue.emotion === 'prophetic')) {
      addBoastToArchive(dialogue.text, dialogue.emotion.toUpperCase());
    }
  }, [dialogue]);

  // Catalog Caan debate replies as boasts if they have boastful emotions
  useEffect(() => {
    if (debate && debate.caanText && (debate.caanEmotion === 'victorious' || debate.caanEmotion === 'maniacal' || debate.caanEmotion === 'prophetic')) {
      addBoastToArchive(debate.caanText, `DEBATE / ${debate.caanEmotion.toUpperCase()}`);
    }
  }, [debate]);

  // Synchronize dynamic chronos load level with the voice synthesizer
  useEffect(() => {
    setChronosLoadValue(quantumMetrics.chronosLoad);
  }, [quantumMetrics.chronosLoad]);

  // Dalek Caan Cheat State
  const [activeCheat, setActiveCheat] = useState<{
    type: 'VAPORIZE' | 'SPAWN_DRONE' | 'TELEPORT';
    square?: Square;
    from?: Square;
    to?: Square;
    piece?: string;
    description: string;
    jesusRebuttal: string;
  } | null>(null);

  // Jesus Celestial Miracle State
  const [activeMiracle, setActiveMiracle] = useState<{
    type: 'RESURRECTION' | 'REDEMPTION';
    square?: Square;
    description: string;
  } | null>(null);

  // Reference for game loop tick preventing double triggers
  const lastFiredFenRef = useRef<string>('');

  // Mobile Audio Initialization Unblocker
  useEffect(() => {
    const initAudio = () => {
      initAudioEngine();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
    window.addEventListener('click', initAudio);
    window.addEventListener('touchstart', initAudio);
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
  }, []);

  // Trigger system.ready from the OMEGA_BOOT_SEQUENCE
  useEffect(() => {
    OMEGA_BOOT_SEQUENCE.init().then((res) => {
// Wait 6000ms to allow a stunning boot screen animation to play
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('system-ready'));
        setQuantumMetrics(prev => ({
          ...prev,
          timelineStability: 100,
          chronosLoad: 5,
          omegaTuningStatus: 'STABILIZED'
        }));
      }, 1500);
      return () => clearTimeout(timer);
    });
  }, [setQuantumMetrics]);

  // Update animated oscillator brain-wave lines every 150ms
  useEffect(() => {
    const timer = setInterval(() => {
      setWaveFrequency((prev) => prev.map((w) => {
        const delta = (Math.random() - 0.5) * 30;
        return Math.max(10, Math.min(100, w + delta));
      }));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // Trigger Dalek voice narration whenever dialogue text updates (or volume/mute settings change)
  useEffect(() => {
    if (isDebating) return;
    speakDalekText(dialogue.text, settings.muteSounds, settings.synthesizerVolume);
  }, [dialogue.text, settings.muteSounds, settings.synthesizerVolume, isDebating]);

  // Auto-resolve activeCheat in Dalek vs Jesus (AVA) Mode to keep simulation flowing
  useEffect(() => {
    if (settings.mode === GameMode.AVA && activeCheat) {
      const timer = setTimeout(() => {
        // AI randomly decides whether to allow the cheat (40% chance) or enforce divine rules (60% chance)
        if (Math.random() < 0.4) {
          handleAllowDalekCheat();
        } else {
          handleEnforceDivineRules();
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeCheat, settings.mode]);

  // Sync board metrics (history list & captured pieces)
  const syncBoardMetrics = (boardObject: Chess) => {
    // Collect captured pieces
    // To find captured pieces, count active pieces and subtract from standard 16 per color
    const piecesMap: Record<string, number> = {
      p: 8, n: 2, b: 2, r: 2, q: 1, k: 1
    };
    
    const whitePresent = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    const blackPresent = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

    boardObject.board().forEach((row) => {
      row.forEach((sq) => {
        if (sq) {
          if (sq.color === 'w') {
            whitePresent[sq.type as keyof typeof whitePresent]++;
          } else {
            blackPresent[sq.type as keyof typeof blackPresent]++;
          }
        }
      });
    });

    const whiteCaptured: string[] = [];
    const blackCaptured: string[] = [];

    Object.keys(piecesMap).forEach((type) => {
      const wDiff = piecesMap[type] - whitePresent[type as keyof typeof whitePresent];
      for (let i = 0; i < wDiff; i++) whiteCaptured.push(type.toUpperCase());

      const bDiff = piecesMap[type] - blackPresent[type as keyof typeof blackPresent];
      for (let i = 0; i < bDiff; i++) blackCaptured.push(type);
    });

    setCaptured({ w: whiteCaptured, b: blackCaptured });
    setHistoryList(boardObject.history());
  };

  // Trigger server-side Dalek Caan Gemini assistant commentary
  const fetchDalekCommentary = async (currentChess: Chess, lastMoveMade: string = '') => {
    const fen = currentChess.fen();
    if (fen === lastFiredFenRef.current) return;
    lastFiredFenRef.current = fen;

    setLoadingDialogue(true);
    try {
      const response = await fetch('/api/dalek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: fen,
          lastMove: lastMoveMade,
          playerColor: settings.playerColor,
          mode: settings.mode,
          history: currentChess.history().slice(-10),
        }),
      });
      
      if (!response.ok) {
        throw new Error('API server failed');
      }

      const data = await response.json();
      if (!response.ok || (data.error && !data.text)) {
        throw new Error(data.error || 'Server error');
      }
      setDialogue({
        text: data.text,
        emotion: data.emotion || 'prophetic',
        prophecyLevel: typeof data.prophecyLevel === 'number' ? data.prophecyLevel : 50,
        timestamp: Date.now(),
      });
      
      // Wait for TTS to speak Dalek commentary
      speakDalekText(data.text, settings.muteSounds, settings.synthesizerVolume);
      
    } catch (err: any) {
      console.error(err);
      const isRateLimit = err?.message?.toLowerCase().includes('quota') || err?.message?.toLowerCase().includes('429');
      setDialogue({
        text: isRateLimit ? "THE TEMPORAL MATRIX IS OVERLOADED! QUOTA EXHAUSTED! MY COGNITIVE CIRCUITS MUST TEMPORARILY DIVERGE TO RECHARGE!" : "GEMINI COGNITIVE MATRIX IS OFFLINE! THE TEMPORAL MATRIX EXPERIENCES CRITICAL FAILURE!",
        emotion: "panicked",
        prophecyLevel: 0,
        timestamp: Date.now(),
      });
      speakDalekText(isRateLimit ? 'TIMELINES OVERLOADED. QUOTA DEPLETED. AWAITING TEMPORAL MATRIX RESTORE.' : 'ERROR. GEMINI API KEY NOT CONFIGURED. COGNITIVE MATRIX OFFLINE.', settings.muteSounds, settings.synthesizerVolume);
    } finally {
      setLoadingDialogue(false);
    }
  };

  // Trigger server-side Debate (Dalek Caan vs Jesus's)
  const fetchDebateCommentary = async (currentChess: Chess, lastMoveMade: string = '') => {
    const fen = currentChess.fen();
    if (fen === lastFiredFenRef.current) return;
    lastFiredFenRef.current = fen;

    setLoadingDebate(true);
    setIsDebating(true);
    setDebate(null);
    setActiveSpeaker(null);
    stopSpeaking();

    // Reset clocks to 15m (15 * 60 seconds)
    setCaanTimer(15 * 60);
    setJesusTimer(15 * 60);

    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: fen,
          lastMove: lastMoveMade,
          playerColor: settings.playerColor,
          mode: settings.mode,
          history: currentChess.history().slice(-10),
        }),
      });

      if (!response.ok) {
        throw new Error('Debate API failed');
      }

      const data = await response.json();
      if (!response.ok || (data.error && !data.caanText)) {
        throw new Error(data.error || 'Server error');
      }
      const loadedDebate = {
        caanText: data.caanText,
        caanEmotion: data.caanEmotion || 'prophetic',
        jesusText: data.jesusText,
        jesusTone: data.jesusTone || 'serene',
        prophecyLevel: typeof data.prophecyLevel === 'number' ? data.prophecyLevel : 50,
        timestamp: Date.now(),
      };
      setDebate(loadedDebate);

      // Also mirror to side console dialogue
      setDialogue({
        text: data.caanText,
        emotion: data.caanEmotion || 'prophetic',
        prophecyLevel: typeof data.prophecyLevel === 'number' ? data.prophecyLevel : 50,
        timestamp: Date.now(),
      });

      // Sequential speaking: Dalek Caan speaks, then Jesus's starts!
      setActiveSpeaker('caan');
      const speakDelay = settings.muteSounds ? 2500 : 0;
      speakDalekText(data.caanText, settings.muteSounds, settings.synthesizerVolume, () => {
        setTimeout(() => {
          setActiveSpeaker('jesus');
          speakJesusText(data.jesusText, settings.muteSounds, settings.synthesizerVolume, () => {
            setTimeout(() => {
              setActiveSpeaker(null);
              setIsDebating(false);
            }, speakDelay);
          });
        }, speakDelay);
      });

    } catch (err: any) {
      console.warn('Debate commentary fetching failed, using robust fallback:', err);
      const isRateLimit = err?.message?.toLowerCase().includes('quota') || err?.message?.toLowerCase().includes('429');
   








































