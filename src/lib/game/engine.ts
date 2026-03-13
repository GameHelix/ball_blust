/**
 * Pure game-logic functions. No React, no canvas — just state transforms.
 * The game hook calls these each animation frame.
 */
import {
  Ball, Bullet, Particle, GameState, BallSize, Vector2D,
} from './types';
import {
  BALL_BASE_HP, BALL_SIZES, BALL_SPAWN_INTERVAL, BALL_VX_RANGE,
  BULLET_RADIUS, BULLET_SPEED, BULLET_TRAIL_LENGTH,
  CANNON_Y, COLORS, DIFFICULTY_CONFIGS,
  GAME_HEIGHT, GAME_WIDTH, WAVE_END_DELAY, MIN_SHOOT_ANGLE, MAX_SHOOT_ANGLE,
} from './constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid(state: GameState): number {
  return ++state.nextId;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Interpolate ball color based on HP fraction (0 = dead, 1 = full) */
function ballColor(hpFrac: number): { color: string; glow: string } {
  const stops = COLORS.ballGradient;
  // clamp to [0,1]
  const f = clamp(hpFrac, 0, 1);
  // find surrounding stops
  for (let i = 0; i < stops.length - 1; i++) {
    if (f <= stops[i + 1].frac) {
      const t = (f - stops[i].frac) / (stops[i + 1].frac - stops[i].frac);
      // we just snap to nearest stop (hex interpolation isn't critical here)
      return t < 0.5 ? { color: stops[i].color, glow: stops[i].glow }
                     : { color: stops[i + 1].color, glow: stops[i + 1].glow };
    }
  }
  return { color: stops[stops.length - 1].color, glow: stops[stops.length - 1].glow };
}

/** Random float in [lo, hi) */
function rand(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo);
}

// ─── Ball factory ─────────────────────────────────────────────────────────────

function createBall(state: GameState, x: number, size: BallSize, vy: number): Ball {
  const cfg = DIFFICULTY_CONFIGS[state.difficulty];
  const baseHp = BALL_BASE_HP[size];
  const hp = Math.round(baseHp * cfg.hpMultiplier * (1 + (state.level - 1) * 0.4));
  const { color, glow } = ballColor(1); // full HP = red initially
  return {
    id: uid(state),
    x,
    y: -BALL_SIZES[size],
    radius: BALL_SIZES[size],
    hp,
    maxHp: hp,
    vx: rand(-BALL_VX_RANGE, BALL_VX_RANGE),
    vy: cfg.ballFallSpeed + vy,
    color,
    glowColor: glow,
    size,
    hitFlash: 0,
  };
}

// ─── Spawn wave ───────────────────────────────────────────────────────────────

export function startWave(state: GameState): void {
  const cfg = DIFFICULTY_CONFIGS[state.difficulty];
  // Mix of sizes: more large balls on higher levels
  const total = cfg.ballsPerWave + Math.floor(state.level / 3);
  state.ballsToSpawn = total;
  state.spawning = true;
  state.waveSpawnTimer = 0;
  state.waveEndTimer = 0;
}

function spawnNextBall(state: GameState): void {
  if (state.ballsToSpawn <= 0) return;

  // Determine size based on level
  const r = Math.random();
  let size: BallSize;
  if (state.level <= 2) {
    size = r < 0.6 ? 'small' : 'medium';
  } else if (state.level <= 5) {
    size = r < 0.3 ? 'small' : r < 0.7 ? 'medium' : 'large';
  } else {
    size = r < 0.2 ? 'small' : r < 0.55 ? 'medium' : 'large';
  }

  const radius = BALL_SIZES[size];
  const x = rand(radius + 10, state.canvasWidth - radius - 10);
  const vy = rand(0, 0.3);
  state.balls.push(createBall(state, x, size, vy));
  state.ballsToSpawn--;
}

// ─── Bullet factory ───────────────────────────────────────────────────────────

function createBullet(state: GameState): Bullet {
  const { x, y, angle } = state.cannon;
  // Clamp angle so you can't shoot straight sideways
  const a = clamp(angle, MIN_SHOOT_ANGLE, MAX_SHOOT_ANGLE);
  return {
    id: uid(state),
    x: x + Math.cos(a) * 20,
    y: y + Math.sin(a) * 20,
    vx: Math.cos(a) * BULLET_SPEED,
    vy: Math.sin(a) * BULLET_SPEED,
    trail: [],
  };
}

// ─── Particle factory ─────────────────────────────────────────────────────────

function spawnParticles(state: GameState, x: number, y: number, count: number, color: string): void {
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(1.5, 5);
    state.particles.push({
      id: uid(state),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: rand(2, 5),
      color,
      alpha: 1,
      life: 1,
    });
  }
}

// ─── Aim cannon ───────────────────────────────────────────────────────────────

export function aimCannon(state: GameState, targetX: number, targetY: number): void {
  const dx = targetX - state.cannon.x;
  const dy = targetY - state.cannon.y;
  state.cannon.angle = Math.atan2(dy, dx);
}

// ─── Main update ─────────────────────────────────────────────────────────────

export interface UpdateResult {
  scoreGained: number;
  ballDestroyed: boolean;
  bulletFired: boolean;
  gameOver: boolean;
  waveClear: boolean;
  levelUp: boolean;
}

export function updateFrame(
  state: GameState,
  nowMs: number,
  dt: number,           // delta multiplier (1 = 60fps)
): UpdateResult {
  const result: UpdateResult = {
    scoreGained: 0,
    ballDestroyed: false,
    bulletFired: false,
    gameOver: false,
    waveClear: false,
    levelUp: false,
  };

  if (state.status !== 'playing') return result;

  const cfg = DIFFICULTY_CONFIGS[state.difficulty];

  // ── Auto-fire ──────────────────────────────────────────────────────────────
  const fireInterval = 1000 / cfg.fireRate;
  if (nowMs - state.lastFireTime >= fireInterval) {
    state.bullets.push(createBullet(state));
    state.lastFireTime = nowMs;
    result.bulletFired = true;
  }

  // ── Update bullets ─────────────────────────────────────────────────────────
  const deadBulletIds = new Set<number>();
  for (const b of state.bullets) {
    // Save trail
    b.trail.unshift({ x: b.x, y: b.y });
    if (b.trail.length > BULLET_TRAIL_LENGTH) b.trail.pop();

    b.x += b.vx * dt;
    b.y += b.vy * dt;

    // Bounce off side walls
    if (b.x - BULLET_RADIUS < 0) {
      b.x = BULLET_RADIUS;
      b.vx = Math.abs(b.vx);
    } else if (b.x + BULLET_RADIUS > state.canvasWidth) {
      b.x = state.canvasWidth - BULLET_RADIUS;
      b.vx = -Math.abs(b.vx);
    }

    // Remove if off top or bottom
    if (b.y + BULLET_RADIUS < 0 || b.y - BULLET_RADIUS > state.canvasHeight) {
      deadBulletIds.add(b.id);
    }
  }

  // ── Update balls ───────────────────────────────────────────────────────────
  const deadBallIds = new Set<number>();
  const newBalls: Ball[] = [];

  for (const ball of state.balls) {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Bounce off side walls
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx);
    } else if (ball.x + ball.radius > state.canvasWidth) {
      ball.x = state.canvasWidth - ball.radius;
      ball.vx = -Math.abs(ball.vx);
    }

    // Count down hit flash
    if (ball.hitFlash > 0) ball.hitFlash = Math.max(0, ball.hitFlash - 0.1);

    // ── Bullet × Ball collision ──────────────────────────────────────────────
    for (const bullet of state.bullets) {
      if (deadBulletIds.has(bullet.id)) continue;

      const dx = bullet.x - ball.x;
      const dy = bullet.y - ball.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < ball.radius + BULLET_RADIUS) {
        // Hit!
        ball.hp -= 1;
        result.scoreGained += 1;
        state.score += 1;
        ball.hitFlash = 1;

        // Update ball color based on new HP fraction
        const frac = ball.hp / ball.maxHp;
        const { color, glow } = ballColor(frac);
        ball.color = color;
        ball.glowColor = glow;

        // Spawn a few spark particles
        spawnParticles(state, bullet.x, bullet.y, 4, ball.glowColor);

        // Remove bullet
        deadBulletIds.add(bullet.id);

        // Ball dead?
        if (ball.hp <= 0) {
          deadBallIds.add(ball.id);
          result.ballDestroyed = true;

          // Big explosion
          spawnParticles(state, ball.x, ball.y, 18, ball.glowColor);

          // Split mechanic
          if (ball.size === 'large') {
            for (let s = 0; s < 2; s++) {
              const nb = createBall(state, ball.x + (s === 0 ? -ball.radius : ball.radius), 'medium', 0);
              nb.vx = s === 0 ? -Math.abs(nb.vx) - 1 : Math.abs(nb.vx) + 1;
              nb.vy = ball.vy * 0.9;
              nb.y = ball.y;
              newBalls.push(nb);
            }
          } else if (ball.size === 'medium') {
            for (let s = 0; s < 2; s++) {
              const nb = createBall(state, ball.x + (s === 0 ? -ball.radius : ball.radius), 'small', 0);
              nb.vx = s === 0 ? -Math.abs(nb.vx) - 1 : Math.abs(nb.vx) + 1;
              nb.vy = ball.vy * 0.9;
              nb.y = ball.y;
              newBalls.push(nb);
            }
          }
          // small balls just disappear
        }
        break; // one bullet hits one ball per frame
      }
    }

    // ── Game over check ──────────────────────────────────────────────────────
    if (!deadBallIds.has(ball.id) && ball.y + ball.radius >= CANNON_Y - 20) {
      result.gameOver = true;
    }
  }

  // Apply dead bullets / balls
  if (deadBulletIds.size > 0)
    state.bullets = state.bullets.filter(b => !deadBulletIds.has(b.id));
  if (deadBallIds.size > 0 || newBalls.length > 0) {
    state.balls = state.balls.filter(b => !deadBallIds.has(b.id));
    state.balls.push(...newBalls);
  }

  // ── Update particles ───────────────────────────────────────────────────────
  for (const p of state.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 0.1 * dt; // gravity
    p.life -= 0.025 * dt;
    p.alpha = p.life;
  }
  state.particles = state.particles.filter(p => p.life > 0);

  // ── Wave / spawn logic ─────────────────────────────────────────────────────
  if (state.spawning) {
    state.waveSpawnTimer++;
    if (state.waveSpawnTimer >= BALL_SPAWN_INTERVAL && state.ballsToSpawn > 0) {
      spawnNextBall(state);
      state.waveSpawnTimer = 0;
    }
    if (state.ballsToSpawn <= 0) {
      state.spawning = false;
    }
  }

  // Wave cleared?
  if (!state.spawning && state.balls.length === 0 && state.ballsToSpawn === 0) {
    state.waveEndTimer++;
    if (state.waveEndTimer >= WAVE_END_DELAY) {
      // Level up
      state.level++;
      result.levelUp = true;
      result.waveClear = true;
      // Bonus score
      state.score += state.level * 10;
      result.scoreGained += state.level * 10;
      startWave(state);
    }
  }

  // Game over
  if (result.gameOver) {
    state.status = 'gameover';
    if (state.score > state.highScore) {
      state.highScore = state.score;
    }
  }

  return result;
}

// ─── Init state ───────────────────────────────────────────────────────────────

export function createInitialState(
  canvasWidth: number,
  canvasHeight: number,
  difficulty: GameState['difficulty'],
  highScore: number,
  soundEnabled: boolean,
): GameState {
  return {
    status: 'menu',
    balls: [],
    bullets: [],
    particles: [],
    cannon: {
      x: canvasWidth / 2,
      y: CANNON_Y,
      angle: -Math.PI / 2, // straight up
    },
    score: 0,
    level: 1,
    highScore,
    difficulty,
    lastFireTime: 0,
    nextId: 0,
    waveSpawnTimer: 0,
    ballsToSpawn: 0,
    spawning: false,
    waveEndTimer: 0,
    canvasWidth,
    canvasHeight,
    soundEnabled,
  };
}

export function startGame(state: GameState): void {
  state.status = 'playing';
  state.score = 0;
  state.level = 1;
  state.balls = [];
  state.bullets = [];
  state.particles = [];
  state.lastFireTime = 0;
  state.cannon.angle = -Math.PI / 2;
  startWave(state);
}
