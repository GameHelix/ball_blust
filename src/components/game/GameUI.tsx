'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface GameUIProps {
  score: number;
  level: number;
  highScore: number;
  onPause: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export function GameUI({
  score,
  level,
  highScore,
  onPause,
  soundEnabled,
  onSoundToggle,
}: GameUIProps) {
  return (
    <div className="absolute inset-x-0 top-0 px-3 pt-3 flex items-start justify-between pointer-events-none z-10">
      {/* Score */}
      <div className="pointer-events-none">
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">Score</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={score}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-orbitron text-xl font-black text-white"
          >
            {score.toLocaleString()}
          </motion.p>
        </AnimatePresence>
        {highScore > 0 && (
          <p className="text-yellow-400/60 text-[10px] font-mono">
            Best: {highScore.toLocaleString()}
          </p>
        )}
      </div>

      {/* Level + controls */}
      <div className="flex items-start gap-2 pointer-events-auto">
        <div className="text-right">
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">Level</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={level}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-orbitron text-xl font-black text-cyan-400"
            >
              {level}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Sound toggle */}
        <button
          onClick={onSoundToggle}
          className="mt-1 text-white/40 hover:text-white/70 transition-colors text-sm"
          title="Toggle sound"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Pause */}
        <button
          onClick={onPause}
          className="mt-1 text-white/40 hover:text-white/70 transition-colors
            w-8 h-8 flex items-center justify-center rounded border border-white/10
            hover:border-white/30"
          title="Pause (P)"
        >
          <span className="text-xs font-bold">⏸</span>
        </button>
      </div>
    </div>
  );
}
