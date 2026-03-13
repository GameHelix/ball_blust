'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Difficulty } from '@/lib/game/types';

interface MainMenuProps {
  highScore: number;
  difficulty: Difficulty;
  soundEnabled: boolean;
  onStart: () => void;
  onDifficultyChange: (d: Difficulty) => void;
  onSoundToggle: () => void;
}

const DIFF_OPTIONS: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy',   label: 'Easy',   desc: 'Slow balls · Low HP' },
  { value: 'medium', label: 'Medium', desc: 'Balanced · Classic' },
  { value: 'hard',   label: 'Hard',   desc: 'Fast balls · High HP' },
];

export function MainMenu({
  highScore,
  difficulty,
  soundEnabled,
  onStart,
  onDifficultyChange,
  onSoundToggle,
}: MainMenuProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h1 className="font-orbitron text-5xl font-black text-cyan-400 tracking-widest
          drop-shadow-[0_0_20px_rgba(0,229,255,0.8)]">
          BALL
        </h1>
        <h1 className="font-orbitron text-5xl font-black text-fuchsia-400 tracking-widest
          drop-shadow-[0_0_20px_rgba(232,121,249,0.8)]">
          BLAST
        </h1>
        <p className="mt-2 text-white/50 text-xs tracking-widest uppercase font-mono">
          Destroy them before they reach you
        </p>
      </motion.div>

      {/* High score */}
      {highScore > 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-cyan-400/20 rounded-lg px-6 py-2 text-center"
        >
          <p className="text-white/40 text-xs tracking-widest uppercase font-mono">Best Score</p>
          <p className="font-orbitron text-2xl font-bold text-cyan-400">{highScore.toLocaleString()}</p>
        </motion.div>
      )}

      {/* Difficulty selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-xs"
      >
        <p className="text-white/40 text-xs tracking-widest uppercase font-mono mb-2 text-center">
          Difficulty
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DIFF_OPTIONS.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => onDifficultyChange(value)}
              className={[
                'flex flex-col items-center p-2 rounded border transition-all duration-200',
                difficulty === value
                  ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'border-white/10 bg-white/5 hover:border-white/30',
              ].join(' ')}
            >
              <span className={[
                'font-orbitron text-xs font-bold',
                difficulty === value ? 'text-cyan-400' : 'text-white/60',
              ].join(' ')}>
                {label}
              </span>
              <span className="text-white/30 text-[9px] mt-0.5 text-center leading-tight">{desc}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <Button size="lg" onClick={onStart}>
          ▶ Play Now
        </Button>
      </motion.div>

      {/* Controls hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-center space-y-1"
      >
        <p className="text-white/30 text-xs font-mono">
          🖱 Move mouse / touch to aim · Auto-fires
        </p>
        <p className="text-white/30 text-xs font-mono">
          P or ESC to pause
        </p>
      </motion.div>

      {/* Sound toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onSoundToggle}
        className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-xs font-mono"
      >
        {soundEnabled ? '🔊' : '🔇'} Sound {soundEnabled ? 'On' : 'Off'}
      </motion.button>
    </motion.div>
  );
}
