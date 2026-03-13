# Ball Blast — Neon Arcade Shooter

A full-stack browser arcade game built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Shoot cannon balls upward to smash numbered balls before they crush your cannon — super addictive!

---

## Features

- **HTML5 Canvas** game engine with requestAnimationFrame loop
- **Neon / cyberpunk** visual theme — glowing balls, grid background, particle explosions
- **Ball splitting** — large balls split into mediums, mediums into smalls
- **Three difficulty levels** — Easy, Medium, Hard (adjustable from main menu)
- **Wave-based progression** — each wave spawns more / harder balls; level bonus on clear
- **High score** persisted in `localStorage`
- **Procedural sound effects** via Web Audio API — no external audio files needed
- **Sound toggle** (on / off)
- **Pause / resume** — `P` or `ESC` key, or the HUD pause button
- **Fully responsive** — 400×680 logical canvas scales to any viewport via CSS
- **Mobile touch controls** — slide finger to aim, auto-fires
- **Keyboard + mouse** for desktop — move mouse over canvas to aim
- **Animated overlays** — main menu, pause, game over (Framer Motion)
- **New high score** celebration on game over
- **Custom neon favicon** (SVG)
- **Deploy-ready** for Vercel with zero extra config

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Rendering | HTML5 Canvas 2D API |
| Sound | Web Audio API (procedural synthesis) |
| Storage | localStorage |
| Font | Orbitron (Google Fonts) |
| Deployment | Vercel |

---

## Controls

### Desktop

| Action | Control |
|--------|---------|
| Aim cannon | Move mouse over game canvas |
| Auto-fire | Continuous (no button needed) |
| Pause / Resume | `P` or `Esc` |

### Mobile

| Action | Control |
|--------|---------|
| Aim cannon | Slide finger across screen |
| Auto-fire | Continuous |
| Pause | Tap the ⏸ HUD button |

---

## Game Rules

1. A **cannon** sits at the bottom — it auto-fires bullets upward toward your cursor/touch.
2. **Numbered balls** fall from the top; each bullet hit reduces the number by 1.
3. When a ball's HP reaches **0**:
   - **Large** → splits into 2 medium balls
   - **Medium** → splits into 2 small balls
   - **Small** → disappears with a particle explosion
4. If any ball **reaches the cannon**, it's **Game Over**.
5. Clear all balls in a wave to advance to the next **level** (bonus score awarded).
6. HP and fall speed scale with level and difficulty.

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- npm 9+

### Steps

```bash
# Clone the repository
git clone <repo-url>
cd ball_blust

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. No extra configuration needed — Vercel auto-detects Next.js.
4. Click **Deploy**.

Or use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles + Tailwind
├── components/
│   ├── game/
│   │   ├── GameCanvas.tsx  # Canvas element + overlay management
│   │   └── GameUI.tsx      # HUD (score, level, pause button)
│   ├── screens/
│   │   ├── MainMenu.tsx    # Start screen with difficulty picker
│   │   ├── PauseMenu.tsx   # Pause overlay
│   │   └── GameOver.tsx    # Game over with stats
│   └── ui/
│       └── Button.tsx      # Reusable neon button component
├── hooks/
│   ├── useGame.ts          # Main game hook (loop, state, input)
│   ├── useSound.ts         # Web Audio API sound synthesis
│   └── useLocalStorage.ts  # SSR-safe localStorage hook
└── lib/
    └── game/
        ├── types.ts        # All TypeScript interfaces
        ├── constants.ts    # Game constants + neon color palette
        ├── engine.ts       # Pure game-logic update functions
        └── renderer.ts     # Canvas drawing functions
public/
└── favicon.svg             # Custom neon cannon favicon
```

---

## License

MIT
