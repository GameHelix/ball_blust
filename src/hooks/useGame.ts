/**
 * Main game hook – wires together the engine, renderer, and sound.
 * Returns refs + callbacks for the GameCanvas component.
 */
'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { GameState, Difficulty } from '@/lib/game/types';
import {
  createInitialState, startGame, updateFrame, aimCannon,
} from '@/lib/game/engine';
import { renderFrame } from '@/lib/game/renderer';
import { useSound } from './useSound';
import { useLocalStorage } from './useLocalStorage';
import { GAME_WIDTH, GAME_HEIGHT } from '@/lib/game/constants';

export function useGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // ── Persisted settings ───────────────────────────────────────────────────
  const [highScore, setHighScore] = useLocalStorage('ballblast_hs', 0);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('ballblast_sound', true);
  const [difficulty, setDifficulty] = useLocalStorage<Difficulty>('ballblast_diff', 'medium');

  // ── React-rendered UI state (triggers re-renders) ────────────────────────
  const [uiScore, setUiScore] = useState(0);
  const [uiLevel, setUiLevel] = useState(1);
  const [uiStatus, setUiStatus] = useState<GameState['status']>('menu');
  const [uiHighScore, setUiHighScore] = useState(highScore);

  // Sync high score from storage into UI
  useEffect(() => { setUiHighScore(highScore); }, [highScore]);

  const { play } = useSound(soundEnabled);

  // ── Init / reset state ref ───────────────────────────────────────────────
  const initState = useCallback((w: number, h: number) => {
    stateRef.current = createInitialState(w, h, difficulty, highScore, soundEnabled);
  }, [difficulty, highScore, soundEnabled]);

  // ── Game loop ────────────────────────────────────────────────────────────
  const loop = useCallback((timestamp: number) => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!state || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rawDt = lastTimeRef.current ? (timestamp - lastTimeRef.current) / (1000 / 60) : 1;
    const dt = Math.min(rawDt, 3); // cap dt to avoid spiral of death
    lastTimeRef.current = timestamp;

    const result = updateFrame(state, timestamp, dt);

    // ── Sound events ──────────────────────────────────────────────────────
    if (result.bulletFired) play('shoot');
    if (result.ballDestroyed) play('explode');
    else if (result.scoreGained > 0) play('hit');
    if (result.levelUp) play('levelup');
    if (result.gameOver) play('gameover');

    // ── Update React UI (throttled) ──────────────────────────────────────
    if (result.scoreGained || result.levelUp || result.gameOver || result.waveClear) {
      setUiScore(state.score);
      setUiLevel(state.level);
      setUiStatus(state.status);

      if (state.score > highScore) {
        setHighScore(state.score);
        setUiHighScore(state.score);
      }
    }

    // ── Render ────────────────────────────────────────────────────────────
    renderFrame(ctx, state);

    if (state.status === 'playing') {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      setUiStatus(state.status);
    }
  }, [play, highScore, setHighScore]);

  // ── Start / restart game ─────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    // Re-create state with latest settings
    stateRef.current = createInitialState(w, h, difficulty, highScore, soundEnabled);
    const state = stateRef.current;
    startGame(state);

    setUiScore(0);
    setUiLevel(1);
    setUiStatus('playing');

    cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
  }, [difficulty, highScore, soundEnabled, loop]);

  // ── Pause / resume ───────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    const state = stateRef.current;
    if (!state || state.status !== 'playing') return;
    state.status = 'paused';
    cancelAnimationFrame(rafRef.current);
    setUiStatus('paused');
  }, []);

  const handleResume = useCallback(() => {
    const state = stateRef.current;
    if (!state || state.status !== 'paused') return;
    state.status = 'playing';
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
    setUiStatus('playing');
  }, [loop]);

  // ── Input: aim cannon ────────────────────────────────────────────────────
  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!state || !canvas || state.status !== 'playing') return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    aimCannon(state, x, y);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  }, [handlePointerMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    handlePointerMove(t.clientX, t.clientY);
  }, [handlePointerMove]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    handlePointerMove(t.clientX, t.clientY);
  }, [handlePointerMove]);

  // ── Go to main menu ──────────────────────────────────────────────────────
  const handleMenu = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const canvas = canvasRef.current;
    if (!canvas) return;
    stateRef.current = createInitialState(canvas.width, canvas.height, difficulty, highScore, soundEnabled);
    setUiScore(0);
    setUiLevel(1);
    setUiStatus('menu');
    // Render static menu background
    const ctx = canvas.getContext('2d');
    if (ctx && stateRef.current) renderFrame(ctx, stateRef.current);
  }, [difficulty, highScore, soundEnabled]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        const state = stateRef.current;
        if (!state) return;
        if (state.status === 'playing') handlePause();
        else if (state.status === 'paused') handleResume();
      }
    };
    const onMenu = () => handleMenu();
    window.addEventListener('keydown', onKey);
    window.addEventListener('ballblast:tomenu', onMenu);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('ballblast:tomenu', onMenu);
    };
  }, [handlePause, handleResume, handleMenu]);

  // ── Difficulty change updates state ref ─────────────────────────────────
  const handleDifficultyChange = useCallback((d: Difficulty) => {
    setDifficulty(d);
  }, [setDifficulty]);

  // ── Sound toggle ─────────────────────────────────────────────────────────
  const handleSoundToggle = useCallback(() => {
    setSoundEnabled(v => !v);
    if (stateRef.current) stateRef.current.soundEnabled = !stateRef.current.soundEnabled;
  }, [setSoundEnabled]);

  // ── Canvas setup + initial render ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas logical size (responsive scaling handled by CSS)
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    initState(GAME_WIDTH, GAME_HEIGHT);

    // Draw static menu background
    const ctx = canvas.getContext('2d');
    if (ctx && stateRef.current) {
      renderFrame(ctx, stateRef.current);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    canvasRef,
    // UI state
    uiScore,
    uiLevel,
    uiStatus,
    uiHighScore,
    soundEnabled,
    difficulty,
    // Actions
    handleStart,
    handlePause,
    handleResume,
    handleMenu,
    handleMouseMove,
    handleTouchMove,
    handleTouchStart,
    handleDifficultyChange,
    handleSoundToggle,
  };
}
