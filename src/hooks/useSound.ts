/**
 * Sound effects via Web Audio API — no external assets needed.
 * All sounds are synthesized procedurally.
 */
import { useRef, useCallback, useEffect } from 'react';

type SoundName = 'shoot' | 'hit' | 'explode' | 'levelup' | 'gameover';

export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  // Lazy-init AudioContext on first user interaction
  const getCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback((name: SoundName) => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (name) {
      case 'shoot': {
        // Short high-pitched blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain).connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }
      case 'hit': {
        // Soft thud
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.18, now);
        src.connect(g).connect(ctx.destination);
        src.start(now);
        break;
      }
      case 'explode': {
        // Noise burst + pitch drop
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.8;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.45, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        src.connect(g).connect(ctx.destination);
        src.start(now);

        // Low boom
        const osc = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc.connect(g2).connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        g2.gain.setValueAtTime(0.4, now);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'levelup': {
        // Ascending arpeggio
        const freqs = [523, 659, 784, 1047];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.connect(g).connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.value = f;
          const t = now + i * 0.1;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.25, t + 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.start(t);
          osc.stop(t + 0.2);
        });
        break;
      }
      case 'gameover': {
        // Descending sad tone
        const freqs = [440, 330, 220, 165];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.connect(g).connect(ctx.destination);
          osc.type = 'sawtooth';
          osc.frequency.value = f;
          const t = now + i * 0.18;
          g.gain.setValueAtTime(0.2, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
        });
        break;
      }
    }
  }, [enabled, getCtx]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  return { play };
}
