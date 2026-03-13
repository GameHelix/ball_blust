import { BallSize, Difficulty, DifficultyConfig } from './types';

// ─── Canvas ──────────────────────────────────────────────────────────────────
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 680;

// ─── Cannon ───────────────────────────────────────────────────────────────────
export const CANNON_Y = GAME_HEIGHT - 60; // centre of cannon
export const CANNON_LENGTH = 36;
export const CANNON_BARREL_WIDTH = 10;

// ─── Bullets ─────────────────────────────────────────────────────────────────
export const BULLET_RADIUS = 5;
export const BULLET_SPEED = 14;
export const BULLET_TRAIL_LENGTH = 8;
/** Minimum aim angle from horizontal (prevents shooting sideways) */
export const MIN_SHOOT_ANGLE = -Math.PI + 0.25; // ~165° from right = 15° above left wall
export const MAX_SHOOT_ANGLE = -0.25;            // 15° above right wall

// ─── Balls ────────────────────────────────────────────────────────────────────
export const BALL_SIZES: Record<BallSize, number> = {
  small: 22,
  medium: 32,
  large: 44,
};

/** Base HP for each size at level 1 (before difficulty multiplier) */
export const BALL_BASE_HP: Record<BallSize, number> = {
  small: 3,
  medium: 8,
  large: 20,
};

/** Horizontal speed range for balls */
export const BALL_VX_RANGE = 1.5;

// ─── Wave ─────────────────────────────────────────────────────────────────────
/** Frames between each ball spawn during a wave */
export const BALL_SPAWN_INTERVAL = 40;
/** Frames to wait after wave cleared before new wave starts */
export const WAVE_END_DELAY = 90;

// ─── Difficulty configs ───────────────────────────────────────────────────────
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    ballFallSpeed: 0.55,
    hpMultiplier: 1,
    ballsPerWave: 3,
    fireRate: 5,
  },
  medium: {
    ballFallSpeed: 0.9,
    hpMultiplier: 2,
    ballsPerWave: 4,
    fireRate: 6,
  },
  hard: {
    ballFallSpeed: 1.4,
    hpMultiplier: 4,
    ballsPerWave: 5,
    fireRate: 7,
  },
};

// ─── Neon palette ─────────────────────────────────────────────────────────────
export const COLORS = {
  bg: '#080818',
  grid: 'rgba(0,255,255,0.05)',
  cannon: '#00e5ff',
  cannonGlow: '#00e5ff',
  bullet: '#ffffff',
  bulletGlow: 'rgba(255,255,255,0.6)',
  /** Ball colors by HP fraction remaining */
  ballGradient: [
    { frac: 0.0,  color: '#00ff88', glow: '#00ff88' }, // near dead – green
    { frac: 0.35, color: '#f7ff00', glow: '#f7ff00' }, // yellow
    { frac: 0.65, color: '#ff8c00', glow: '#ff8c00' }, // orange
    { frac: 1.0,  color: '#ff2d55', glow: '#ff2d55' }, // full HP – red
  ],
  particle: ['#ff2d55', '#ff8c00', '#f7ff00', '#00ff88', '#00e5ff', '#bf5af2'],
  hud: '#00e5ff',
  hudText: '#e8f4fd',
  danger: '#ff2d55',
};
