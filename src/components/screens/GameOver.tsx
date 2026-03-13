'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface GameOverProps {
  score: number;
  highScore: number;
  level: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({
  score,
  highScore,
  level,
  isNewHighScore,
  onRestart,
  onMenu,
}: GameOverProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5
        bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Game over title */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="text-center"
      >
        <h2 className="font-orbitron text-4xl font-black text-rose-500 tracking-wider
          drop-shadow-[0_0_20px_rgba(255,45,85,0.9)]">
          GAME OVER
        </h2>
        {isNewHighScore && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-1 text-yellow-400 font-orbitron text-sm font-bold tracking-widest
              drop-shadow-[0_0_10px_rgba(255,220,0,0.8)]"
          >
            ★ NEW HIGH SCORE ★
          </motion.p>
        )}
      </motion.div>

      {/* Stats card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 w-64
          shadow-[0_0_40px_rgba(255,45,85,0.15)]"
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest font-mono">Score</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: 'spring' }}
              className="text-white font-orbitron font-bold text-2xl"
            >
              {score.toLocaleString()}
            </motion.p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest font-mono">Level</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="text-cyan-400 font-orbitron font-bold text-2xl"
            >
              {level}
            </motion.p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-mono">Best</p>
          <p className="text-yellow-400 font-orbitron font-bold text-xl">
            {highScore.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col gap-3 w-64"
      >
        <Button variant="primary" size="lg" onClick={onRestart} className="w-full">
          ↺ Play Again
        </Button>
        <Button variant="ghost" onClick={onMenu} className="w-full">
          ⌂ Main Menu
        </Button>
      </motion.div>
    </motion.div>
  );
}
