'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { GameUI } from './GameUI';
import { MainMenu } from '@/components/screens/MainMenu';
import { PauseMenu } from '@/components/screens/PauseMenu';
import { GameOver } from '@/components/screens/GameOver';

export function GameCanvas() {
  const {
    canvasRef,
    uiScore,
    uiLevel,
    uiStatus,
    uiHighScore,
    soundEnabled,
    difficulty,
    handleStart,
    handlePause,
    handleResume,
    handleMenu,
    handleMouseMove,
    handleTouchMove,
    handleTouchStart,
    handleDifficultyChange,
    handleSoundToggle,
  } = useGame();

  // Attach canvas event listeners imperatively to support { passive: false }
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, [canvasRef, handleMouseMove, handleTouchMove, handleTouchStart]);

  const isNewHighScore = uiScore > 0 && uiScore >= uiHighScore && uiStatus === 'gameover';

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{
        /* Keep 400×680 aspect ratio, fill available space */
        width: 'min(400px, 100vw, calc(100dvh * 400 / 680))',
        aspectRatio: '400 / 680',
      }}
    >
      {/* Game canvas – logical size set in useGame (400×680) */}
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-2xl"
        style={{ display: 'block', touchAction: 'none' }}
      />

      {/* Mobile aim hint */}
      {uiStatus === 'playing' && (
        <div className="absolute bottom-16 inset-x-0 flex justify-center pointer-events-none">
          <span className="text-white/10 text-[10px] font-mono select-none">slide to aim</span>
        </div>
      )}

      {/* HUD overlay */}
      {uiStatus === 'playing' && (
        <GameUI
          score={uiScore}
          level={uiLevel}
          highScore={uiHighScore}
          onPause={handlePause}
          soundEnabled={soundEnabled}
          onSoundToggle={handleSoundToggle}
        />
      )}

      {/* Overlay screens */}
      <AnimatePresence>
        {uiStatus === 'menu' && (
          <MainMenu
            key="menu"
            highScore={uiHighScore}
            difficulty={difficulty}
            soundEnabled={soundEnabled}
            onStart={handleStart}
            onDifficultyChange={handleDifficultyChange}
            onSoundToggle={handleSoundToggle}
          />
        )}

        {uiStatus === 'paused' && (
          <PauseMenu
            key="pause"
            score={uiScore}
            level={uiLevel}
            onResume={handleResume}
            onRestart={handleStart}
            onMenu={handleMenu}
            soundEnabled={soundEnabled}
            onSoundToggle={handleSoundToggle}
          />
        )}

        {uiStatus === 'gameover' && (
          <GameOver
            key="gameover"
            score={uiScore}
            highScore={uiHighScore}
            level={uiLevel}
            isNewHighScore={isNewHighScore}
            onRestart={handleStart}
            onMenu={handleMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
