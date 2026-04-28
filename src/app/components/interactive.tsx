"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─── CUSTOM CURSOR ─── */
type CursorState = "default" | "hover" | "cta";

export function CustomCursor() {
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let rafId = 0;
    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    };
    const animate = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t) return;
      const cta = t.closest<HTMLElement>("[data-cursor='cta']");
      const hover = t.closest<HTMLElement>("a, button, [data-cursor='hover']");
      if (cta) {
        setState("cta");
        setLabel(cta.dataset.cursorLabel || "Clique");
      } else if (hover) {
        setState("hover");
        setLabel("");
      } else {
        setState("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${state === "hover" ? "is-hover" : ""} ${state === "cta" ? "is-cta" : ""}`}>
        <span className="cursor-label">{label}</span>
      </div>
    </>
  );
}

/* ─── SCRAMBLE TEXT (decoded glyph reveal) ─── */
const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";
export function ScrambleText({ text, className = "", trigger = "view", delay = 0 }: { text: string; className?: string; trigger?: "mount" | "view"; delay?: number }) {
  const [output, setOutput] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    let frame = 0;
    let frameId = 0;
    const oldText = output;
    const newText = text;
    const length = Math.max(oldText.length, newText.length);
    queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end });
    }
    const update = () => {
      let outputStr = "";
      let complete = 0;
      for (let i = 0; i < queue.length; i++) {
        const q = queue[i];
        if (frame >= q.end) { complete++; outputStr += q.to; }
        else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          outputStr += q.char;
        } else outputStr += q.from;
      }
      setOutput(outputStr);
      if (complete < queue.length) { frame++; frameId = requestAnimationFrame(update); }
    };

    if (trigger === "mount") {
      const t = setTimeout(() => { frameId = requestAnimationFrame(update); }, delay);
      return () => { clearTimeout(t); cancelAnimationFrame(frameId); };
    } else {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => { frameId = requestAnimationFrame(update); }, delay);
          obs.disconnect();
        }
      }, { threshold: 0.4 });
      if (ref.current) obs.observe(ref.current);
      return () => { obs.disconnect(); cancelAnimationFrame(frameId); };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span ref={ref} className={className}>{output}</span>;
}

/* ─── MAGNETIC CARD (whole card pulled toward cursor) ─── */
export function MagneticCard({ children, strength = 0.2, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 });
  const sy = useSpring(y, { stiffness: 180, damping: 18 });
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (!ref.current || window.innerWidth < 1024) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── SPOTLIGHT WRAPPER ─── */
export function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`spot-card ${className}`}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

/* ─── BORDER BEAM CARD ─── */
export function BeamCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`beam-card ${className}`}>{children}</div>;
}

/* ─── FLIP CARD ─── */
export function FlipCard({ front, back, className = "" }: { front: React.ReactNode; back: React.ReactNode; className?: string }) {
  return (
    <div className={`flip-card ${className}`}>
      <div className="flip-card-inner">
        <div className="flip-face">{front}</div>
        <div className="flip-face flip-back">{back}</div>
      </div>
    </div>
  );
}

/* ─── PARALLAX LAYER (scroll-driven) ─── */
export function ParallaxLayer({ speed = 0.3, children, className = "" }: { speed?: number; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      y.set(-center * speed);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed, y]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

/* ─── HOVER IMAGE SWAP LIST ─── */
export function HoverSwapList({ items, onCta }: {
  items: { id: string; eyebrow: string; title: string; meta: string; image: string; href: string }[];
  onCta?: (id: string) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      previewRef.current.style.transform = `translate(${e.clientX + 32}px, ${e.clientY - 130}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="swap-list">
      {items.map((it) => (
        <a
          key={it.id}
          href={it.href}
          target="_blank"
          rel="noopener"
          className="swap-item group"
          onMouseEnter={() => setActive(it.id)}
          onMouseLeave={() => setActive(null)}
          data-cursor="cta"
          data-cursor-label="Ver"
        >
          <div className="flex items-center gap-6 lg:gap-12 flex-1">
            <span className="text-xs uppercase tracking-[0.3em] text-white/55 font-mono w-12">{it.eyebrow}</span>
            <h3 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[0.95]">
              {it.title}
            </h3>
          </div>
          <div className="flex items-center gap-4 shrink-0 pl-6">
            <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-white/55">{it.meta}</span>
            <span className="swap-arrow text-2xl">→</span>
          </div>
        </a>
      ))}
      <div ref={previewRef} className={`swap-preview ${active ? "is-active" : ""}`}>
        {items.map((it) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={it.id}
            src={it.image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${active === it.id ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── CARD STACK (sticky stacking on scroll) ─── */
export function StackedCards({ cards }: { cards: { title: string; body: string; tag: string }[] }) {
  return (
    <div className="relative">
      {cards.map((c, i) => (
        <div
          key={i}
          className="stack-card p-8 md:p-12 mb-6"
          style={{ top: `${80 + i * 24}px`, scale: `${1 - (cards.length - 1 - i) * 0.03}` as any }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/55 font-mono">{c.tag}</span>
          <h3 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">{c.title}</h3>
          <p className="mt-4 text-white/60 text-lg max-w-2xl">{c.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── COVERFLOW CAROUSEL (3D-ish via Framer) ─── */
export function Coverflow({ slides }: { slides: React.ReactNode[] }) {
  const [idx, setIdx] = useState(0);
  const total = slides.length;
  const go = (d: number) => setIdx((i) => (i + d + total) % total);
  return (
    <div className="relative" style={{ perspective: 1400 }}>
      <div className="relative h-[420px] flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        {slides.map((s, i) => {
          const d = ((i - idx + total) % total);
          const offset = d > total / 2 ? d - total : d;
          const isCenter = offset === 0;
          return (
            <motion.div
              key={i}
              className="absolute w-[78%] md:w-[55%] lg:w-[42%] aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[var(--bg-soft)]"
              animate={{
                x: offset * 200,
                rotateY: -offset * 18,
                scale: isCenter ? 1 : 0.85,
                opacity: Math.abs(offset) > 2 ? 0 : 1,
                zIndex: 10 - Math.abs(offset),
              }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
            >
              {s}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <button onClick={() => go(-1)} aria-label="Anterior" className="w-12 h-12 rounded-full border border-white/20 hover:border-white/60 transition" data-cursor="hover">←</button>
        <button onClick={() => go(1)} aria-label="Próximo" className="w-12 h-12 rounded-full border border-white/20 hover:border-white/60 transition" data-cursor="hover">→</button>
      </div>
    </div>
  );
}

/* ─── SP CLOCK ─── */
export function SaoPauloClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
      setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}

/* ─── MASK REVEAL ON VIEW ─── */
export function MaskReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) { setShown(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`mask-reveal ${shown ? "is-revealed" : ""} ${className}`}>{children}</div>;
}

export { useMotionValue, useSpring, useTransform };
