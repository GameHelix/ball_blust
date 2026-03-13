'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface PauseMenuProps {
  score: number;
  level: number;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export function PauseMenu({
  score,
  level,
  onResume,
  onRestart,
  onMenu,
  soundEnabled,
  onSoundToggle,
}: PauseMenuProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5
        bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900/90 border border-cyan-400/30 rounded-2xl p-8 w-64
          shadow-[0_0_40px_rgba(0,229,255,0.15)]"
      >
        <h2 className="font-orbitron text-2xl font-black text-cyan-400 text-center tracking-wider mb-5">
          PAUSED
        </h2>

        <div className="flex justify-between text-sm font-mono mb-6">
          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest">Score</p>
            <p className="text-white font-bold text-lg">{score.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-xs uppercase tracking-widest">Level</p>
            <p className="text-cyan-400 font-bold text-lg">{level}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={onResume} className="w-full">
            ▶ Resume
          </Button>
          <Button variant="secondary" onClick={onRestart} className="w-full">
            ↺ Restart
          </Button>
          <Button variant="ghost" onClick={onMenu} className="w-full">
            ⌂ Main Menu
          </Button>
        </div>

        <button
          onClick={onSoundToggle}
          className="mt-4 w-full text-center text-white/40 hover:text-white/70
            transition-colors text-xs font-mono"
        >
          {soundEnabled ? '🔊' : '🔇'} Sound {soundEnabled ? 'On' : 'Off'}
        </button>
      </motion.div>
    </motion.div>
  );
}
