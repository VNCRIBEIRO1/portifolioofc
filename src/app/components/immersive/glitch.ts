"use client";

/**
 * Pulso de glitch global. Dispara um valor 0..1 que sobe rápido (~80ms),
 * permanece e cai (~120ms), repetindo a cada 2s.
 * Componentes 3D e DOM lêem esse valor para sincronizar.
 */
let listeners: Array<(v: number) => void> = [];
let active = 0;
let glitchActive = false;
let domScrambleListeners: Array<() => void> = [];

if (typeof window !== "undefined") {
  // Loop principal: a cada 2s dispara um glitch de ~200ms
  setInterval(() => {
    glitchActive = true;
    const start = performance.now();
    const dur = 200;
    const tick = () => {
      const t = (performance.now() - start) / dur;
      if (t >= 1) {
        active = 0;
        glitchActive = false;
        listeners.forEach((l) => l(0));
        return;
      }
      // Forma triangular: 0..1..0
      active = t < 0.4 ? t / 0.4 : 1 - (t - 0.4) / 0.6;
      listeners.forEach((l) => l(active));
      requestAnimationFrame(tick);
    };
    tick();
    // Notifica DOM para re-scramble
    domScrambleListeners.forEach((l) => l());
  }, 2000);
}

export const glitchClock = {
  get value() {
    return active;
  },
  get isActive() {
    return glitchActive;
  },
  subscribe(fn: (v: number) => void) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
  onDomScramble(fn: () => void) {
    domScrambleListeners.push(fn);
    return () => {
      domScrambleListeners = domScrambleListeners.filter((l) => l !== fn);
    };
  },
};
