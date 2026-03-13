import { GameCanvas } from '@/components/game/GameCanvas';

export default function Home() {
  return (
    <main className="min-h-dvh w-full flex items-center justify-center bg-[#040410] overflow-hidden">
      <GameCanvas />
    </main>
  );
}
