"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero DOM crítico — renderizado imediatamente no SSR, garante LCP rápido.
 * Fica sob o canvas e desaparece ~1.4s após mount do canvas (smooth crossfade).
 */
export function HeroSSR({ canvasReady }: { canvasReady: boolean }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (!canvasReady) return;
    const t = setTimeout(() => setHide(true), 600);
    return () => clearTimeout(t);
  }, [canvasReady]);

  return (
    <div
      className="fixed inset-0 -z-20 flex items-center justify-center px-6 text-center pointer-events-none transition-opacity duration-500"
      style={{ opacity: hide ? 0 : 1 }}
      aria-hidden={hide}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#03030c] via-[#0c0c20] to-[#03030c]" />
      <div className="relative">
        <h1 className="text-[clamp(3rem,11vw,9rem)] font-light tracking-tight leading-[0.92] text-[var(--ink)]">
          PixelCode
          <br />
          <span className="text-[var(--accent)]">Studio</span>
        </h1>
        <p className="mt-4 font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-[var(--accent)]">
          experiências digitais sob medida
        </p>
      </div>
    </div>
  );
}
