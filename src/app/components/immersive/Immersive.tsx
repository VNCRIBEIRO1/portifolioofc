"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { HeroSSR } from "./HeroSSR";
import { Overlay } from "./Overlay";
import { StaticHome } from "./StaticHome";
import { useImmersive } from "./store";
// Importa para registrar o tick global do glitch (side-effect)
import "./glitch";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => null,
});

const SCROLL_HEIGHT_VH = 500;

export function Immersive() {
  const setProgress = useImmersive((s) => s.setProgress);
  const setReducedMotion = useImmersive((s) => s.setReducedMotion);
  const lastProgress = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [mode, setMode] = useState<"loading" | "static" | "immersive">("loading");

  // Detect device capability ANTES de decidir montar canvas
  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // V4.1: gate ULTRA permissivo — so cai para static se WebGL realmente nao existe.
    // prefers-reduced-motion apenas seta a flag (Scene reduz particulas/post),
    // NAO troca de modo. Hardware fraco (cores<2 OU mem<1) tambem mantem
    // imersivo mas reduzido. Em produção isso evita "PixelCode Studio estatico"
    // em Windows 11 com animacoes reduzidas no SO.
    const hasWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        const gl = c.getContext("webgl2") || c.getContext("webgl");
        return !!gl;
      } catch {
        return false;
      }
    })();
    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    // Reducao de movimento NAO bloqueia mais o imersivo — apenas reduz particulas
    const veryLow = cores < 2 || mem < 1;
    setReducedMotion(mqMotion.matches || veryLow);
    // Static APENAS quando WebGL ausente (browser muito antigo / desktops sem GPU)
    setMode(!hasWebGL ? "static" : "immersive");
  }, [setReducedMotion]);

  // Defer canvas mount to idle
  useEffect(() => {
    if (mode !== "immersive") return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    let cancelId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const mount = () => setCanvasReady(true);
    if (typeof w.requestIdleCallback === "function") {
      cancelId = w.requestIdleCallback(mount, { timeout: 1200 });
    } else {
      timerId = setTimeout(mount, 500);
    }
    return () => {
      if (cancelId !== undefined && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(cancelId);
      }
      if (timerId) clearTimeout(timerId);
    };
  }, [mode]);

  // Scroll progress (immersive mode only)
  useEffect(() => {
    if (mode !== "immersive") return;
    let smoothP = 0;
    let raf = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      lastProgress.current = p;
    };
    const tick = () => {
      smoothP += (lastProgress.current - smoothP) * 0.08;
      setProgress(smoothP);
      raf = requestAnimationFrame(tick);
    };
    onScroll();
    smoothP = lastProgress.current;
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [setProgress, mode]);

  if (mode === "static") return <StaticHome />;

  // Default: imersivo (desktop / GPU OK). Hero SSR aparece imediato (LCP).
  return (
    <>
      <HeroSSR canvasReady={canvasReady} />
      {canvasReady && <Scene />}
      <Overlay />
      <div style={{ height: `${SCROLL_HEIGHT_VH}vh` }} aria-hidden="true" />
    </>
  );
}
