"use client";

import { useEffect, useRef, useState } from "react";
import { glitchClock } from "./glitch";
import { useImmersive } from "./store";
import { CRYSTALS } from "./CrystalShowcase";

/**
 * DOM Overlay minimalista — toda narrativa visual está no 3D.
 * O DOM serve apenas para:
 *  - Nav (PixelCode / Studio + WhatsApp)
 *  - Indicator de progresso (5 marcadores)
 *  - HUD do crystal hovered (label flutuante)
 *  - HUD/legenda de scroll
 *  - Footer com info legal mínima
 */
export function Overlay() {
  return (
    <>
      <NavMinimal />
      <CrystalHud />
      <ScrollHud />
      <ProgressIndicator />
      <HiddenSemantic />
      <FooterMin />
    </>
  );
}

function NavMinimal() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none mix-blend-difference">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <a href="/" className="pointer-events-auto text-white tracking-[0.18em] text-[11px] font-mono">
          <GlitchSpan text="PIXELCODE / STUDIO" />
        </a>
        <a
          href="https://wa.me/5518996311933?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20PixelCode."
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto text-white text-[11px] font-mono tracking-widest border border-white/30 rounded-full px-4 py-1.5 hover:bg-white/10 transition uppercase"
        >
          conversar
        </a>
      </div>
    </header>
  );
}

function CrystalHud() {
  const focused = useImmersive((s) => s.focusedCrystal);
  if (focused < 0) return null;
  const c = CRYSTALS[focused];
  if (!c) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-20 pointer-events-none text-center">
      <div className="font-mono text-[10px] text-[var(--accent)] tracking-widest uppercase mb-1">
        <GlitchSpan text={`> CASE_${String(focused + 1).padStart(2, "0")} · ${c.nicho}`} />
      </div>
      <div className="text-[var(--ink)] text-2xl sm:text-3xl font-light">
        <GlitchSpan text={c.title} />
      </div>
      <div className="font-mono text-[10px] text-[var(--dim)] tracking-widest uppercase mt-2">
        click to dolly zoom
      </div>
    </div>
  );
}

function ScrollHud() {
  const progress = useImmersive((s) => s.progress);
  return (
    <div className="fixed left-6 bottom-6 z-20 pointer-events-none font-mono text-[10px] text-[var(--dim)] tracking-widest uppercase">
      <div>
        <GlitchSpan text={`DEPTH ${(progress * 285).toFixed(1).padStart(6, "0")}M`} />
      </div>
      <div className="mt-1">
        <GlitchSpan text={`SCROLL ${(progress * 100).toFixed(0).padStart(2, "0")}%`} />
      </div>
    </div>
  );
}

function ProgressIndicator() {
  const progress = useImmersive((s) => s.progress);
  const ranges = [0, 0.10, 0.22, 0.88, 1];
  const labels = ["surface", "manifesto", "vault", "abyss"];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3 pointer-events-none">
      {labels.map((l, i) => {
        const active = progress >= ranges[i] && progress < ranges[i + 1];
        return (
          <div key={l} className="flex items-center gap-3 justify-end">
            <span
              className={`font-mono text-[10px] uppercase tracking-widest ${
                active ? "text-[var(--ink)]" : "text-[var(--dim)]"
              }`}
            >
              {l}
            </span>
            <span
              className={`w-1.5 rounded-full transition-all ${
                active ? "h-8 bg-[var(--glow)]" : "h-2 bg-[var(--ink)]/30"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Conteúdo semântico para SEO/leitores de tela. Visualmente off-screen.
 * Garante que crawlers e a11y vejam título + serviços + cases.
 */
function HiddenSemantic() {
  return (
    <div className="sr-only">
      <h1>PixelCode Studio — Vinícius Ribeiro</h1>
      <p>
        Studio de criação digital especializado em sites institucionais, landing pages, sistemas
        web (CRM, ERP, dashboards), apps mobile (iOS, Android, PWA) e experiências imersivas
        WebGL/3D. Criamos experiências digitais sob medida que convertem.
      </p>
      <h2>O que fazemos</h2>
      <ul>
        <li>Sites institucionais e landing pages</li>
        <li>Sistemas web sob medida (CRM, ERP, dashboards)</li>
        <li>Apps mobile (iOS, Android, PWA)</li>
        <li>Experiências imersivas (WebGL, 3D, narrativa cinematográfica)</li>
      </ul>
      <h2>Cases</h2>
      <ul>
        {CRYSTALS.map((c) => (
          <li key={c.slug}>
            {c.title} — {c.nicho}
          </li>
        ))}
      </ul>
      <h2>Contato</h2>
      <p>WhatsApp: +55 18 99631-1933</p>
    </div>
  );
}

function FooterMin() {
  return (
    <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] text-[var(--dim)] tracking-widest uppercase pointer-events-none">
      © {new Date().getFullYear()} pixelcode studio · vinícius ribeiro
    </footer>
  );
}

/* ---------------- Glitch span (DOM scramble loop 2s) ---------------- */
function GlitchSpan({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const charsPool = "!<>-_\\/[]{}—=+*^?#________01010101";

  useEffect(() => {
    let raf = 0;
    const run = () => {
      const total = 14;
      let frame = 0;
      const tick = () => {
        frame++;
        const t = frame / total;
        if (t >= 1) {
          setOut(text);
          return;
        }
        setOut(
          text
            .split("")
            .map((ch, i) =>
              i / text.length < t ? ch : charsPool[Math.floor(Math.random() * charsPool.length)]
            )
            .join("")
        );
        raf = requestAnimationFrame(tick);
      };
      tick();
    };
    const unsub = glitchClock.onDomScramble(run);
    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return <span ref={ref}>{out}</span>;
}
