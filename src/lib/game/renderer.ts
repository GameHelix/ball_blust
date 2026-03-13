/**
 * All canvas drawing functions. Stateless – receives state and draws.
 * Uses neon/cyberpunk aesthetic with glows, gradients, and grid.
 */
import { GameState } from './types';
import { CANNON_LENGTH, CANNON_BARREL_WIDTH, COLORS } from './constants';

// ─── Glow helper ─────────────────────────────────────────────────────────────

function glow(ctx: CanvasRenderingContext2D, color: string, blur: number) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}

function noGlow(ctx: CanvasRenderingContext2D) {
  ctx.shadowBlur = 0;
}

// ─── Background & grid ───────────────────────────────────────────────────────

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Solid dark background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Floor line (danger zone)
  const floorY = h - 60;
  const grad = ctx.createLinearGradient(0, floorY, w, floorY);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, 'rgba(255,45,85,0.25)');
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  glow(ctx, COLORS.danger, 8);
  ctx.beginPath();
  ctx.moveTo(0, floorY);
  ctx.lineTo(w, floorY);
  ctx.stroke();
  noGlow(ctx);
}

// ─── Cannon ───────────────────────────────────────────────────────────────────

function drawCannon(ctx: CanvasRenderingContext2D, state: GameState) {
  const { x, y, angle } = state.cannon;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Barrel
  glow(ctx, COLORS.cannonGlow, 18);
  ctx.fillStyle = COLORS.cannon;
  const bw = CANNON_BARREL_WIDTH;
  const bh = CANNON_LENGTH;
  // round-capped barrel
  ctx.beginPath();
  ctx.roundRect(-bw / 2, -bh, bw, bh, [bw / 2, bw / 2, 2, 2]);
  ctx.fill();

  noGlow(ctx);

  // Base circle
  glow(ctx, COLORS.cannonGlow, 22);
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#001f2e';
  ctx.fill();
  ctx.strokeStyle = COLORS.cannon;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  noGlow(ctx);

  ctx.restore();
}

// ─── Bullets ──────────────────────────────────────────────────────────────────

function drawBullets(ctx: CanvasRenderingContext2D, state: GameState) {
  for (const b of state.bullets) {
    // Trail
    for (let i = 0; i < b.trail.length; i++) {
      const t = b.trail[i];
      const alpha = (1 - i / b.trail.length) * 0.4;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2.5 * (1 - i / b.trail.length), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    // Bullet
    glow(ctx, COLORS.bulletGlow, 12);
    ctx.beginPath();
    ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    noGlow(ctx);
  }
}

// ─── Balls ────────────────────────────────────────────────────────────────────

function drawBalls(ctx: CanvasRenderingContext2D, state: GameState) {
  for (const ball of state.balls) {
    ctx.save();
    ctx.translate(ball.x, ball.y);

    const hitAlpha = ball.hitFlash;

    // Outer glow ring
    glow(ctx, ball.glowColor, 22 + hitAlpha * 15);

    // Radial gradient fill
    const grad = ctx.createRadialGradient(
      -ball.radius * 0.3, -ball.radius * 0.3, ball.radius * 0.1,
      0, 0, ball.radius,
    );
    const alpha = hitAlpha > 0 ? `cc` : `99`;
    grad.addColorStop(0, ball.color + 'ff');
    grad.addColorStop(0.6, ball.color + alpha);
    grad.addColorStop(1, ball.color + '33');

    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Rim
    ctx.strokeStyle = ball.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hit flash white overlay
    if (hitAlpha > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${hitAlpha * 0.45})`;
      ctx.fill();
    }

    noGlow(ctx);

    // HP number
    const hpStr = String(ball.hp);
    const fontSize = ball.radius > 35 ? 18 : ball.radius > 25 ? 14 : 11;
    ctx.font = `900 ${fontSize}px "Orbitron", "Courier New", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Shadow for readability
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillText(hpStr, 1.5, 1.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(hpStr, 0, 0);

    ctx.restore();
  }
}

// ─── Particles ────────────────────────────────────────────────────────────────

function drawParticles(ctx: CanvasRenderingContext2D, state: GameState) {
  for (const p of state.particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    glow(ctx, p.color, 8);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    noGlow(ctx);
    ctx.restore();
  }
}

// ─── Danger indicator ─────────────────────────────────────────────────────────

function drawDangerIndicator(ctx: CanvasRenderingContext2D, state: GameState) {
  // Pulsing red border when balls are low
  const dangerBall = state.balls.find(b => b.y + b.radius > state.canvasHeight * 0.7);
  if (!dangerBall) return;

  const pulse = (Math.sin(Date.now() / 150) + 1) / 2;
  ctx.strokeStyle = `rgba(255,45,85,${0.3 + pulse * 0.5})`;
  ctx.lineWidth = 6;
  glow(ctx, COLORS.danger, 20);
  ctx.strokeRect(3, 3, state.canvasWidth - 6, state.canvasHeight - 6);
  noGlow(ctx);
}

// ─── Main render ─────────────────────────────────────────────────────────────

export function renderFrame(ctx: CanvasRenderingContext2D, state: GameState) {
  const { canvasWidth: w, canvasHeight: h } = state;

  ctx.clearRect(0, 0, w, h);
  drawBackground(ctx, w, h);
  drawParticles(ctx, state);
  drawBullets(ctx, state);
  drawBalls(ctx, state);
  drawCannon(ctx, state);
  drawDangerIndicator(ctx, state);
}
