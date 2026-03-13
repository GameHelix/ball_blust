// ─── Core game types ────────────────────────────────────────────────────────

export interface Vector2D {
  x: number;
  y: number;
}

/** A falling numbered ball */
export interface Ball {
  id: number;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  vx: number;
  vy: number;
  color: string;
  glowColor: string;
  size: BallSize;
  /** flash timer for hit feedback (0-1, counts down) */
  hitFlash: number;
}

export type BallSize = 'small' | 'medium' | 'large';

/** A bullet fired from the cannon */
export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** trail positions */
  trail: Vector2D[];
}

/** Player cannon */
export interface Cannon {
  x: number;
  y: number;
  /** angle in radians – 0 = right, -PI/2 = straight up */
  angle: number;
}

/** A single explosion particle */
export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number; // 0-1, counts down
}

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  /** base fall speed (px/frame) */
  ballFallSpeed: number;
  /** HP multiplier applied to ball HP */
  hpMultiplier: number;
  /** balls spawned per wave */
  ballsPerWave: number;
  /** bullets fired per second */
  fireRate: number;
}

/** All mutable game state stored in a ref (no re-renders on every frame) */
export interface GameState {
  status: GameStatus;
  balls: Ball[];
  bullets: Bullet[];
  particles: Particle[];
  cannon: Cannon;
  score: number;
  level: number;
  highScore: number;
  difficulty: Difficulty;
  /** time of last bullet fire (ms) */
  lastFireTime: number;
  /** counter for unique ids */
  nextId: number;
  /** frames since wave started (for spawn timing) */
  waveSpawnTimer: number;
  /** how many balls still need to be spawned this wave */
  ballsToSpawn: number;
  /** is spawning phase ongoing */
  spawning: boolean;
  /** delay timer after wave cleared before next wave */
  waveEndTimer: number;
  canvasWidth: number;
  canvasHeight: number;
  /** sound toggle */
  soundEnabled: boolean;
}
