"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { services, type Service } from "../../data/services";
import { WA_LINK } from "../../lib/constants";
import { Reveal } from "../primitives";
import { SERVICE_MOCKUPS } from "../service-mockups";

function ServiceCard({ s, index, total }: { s: Service; index: number; total: number }) {
  const Mock = SERVICE_MOCKUPS[s.key];
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
      className={`svc-card group ${s.featured ? "ring-1 ring-rose-500/40" : ""}`}
    >
      <Mock />
      {s.badge && (
        <div className="svc-nominee">
          <span>{s.badge}</span>
        </div>
      )}
      <div className="p-6 sm:p-7 relative">
        <div className="flex items-baseline justify-between mb-3 text-xs font-mono text-white/55">
          <span>{s.prefix}</span>
          <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-white mb-1">
          <span className="svc-prefix">/</span>{s.title}
        </h3>
        <p className="text-white/60 text-sm italic mb-4 font-display">— {s.tagline}</p>
        <p className="text-white/65 text-[15px] leading-relaxed mb-5">{s.description}</p>
        <ul className="flex flex-wrap gap-1.5 mb-6">
          {s.bullets.map((b) => (
            <li key={b} className="text-[11px] uppercase tracking-wider font-mono text-white/55 border border-white/10 rounded-full px-2.5 py-1 bg-white/[0.02]">
              {b}
            </li>
          ))}
        </ul>
        <a
          href={WA_LINK(`Olá Vinícius! Tenho interesse no serviço: ${s.title}.`)}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="cta"
          data-cursor-label="Contratar"
          className="inline-flex items-center gap-2 text-sm text-white hover:text-rose-400 transition-colors group/cta"
        >
          <span className="border-b border-white/20 group-hover/cta:border-rose-400 pb-0.5">orçar este serviço</span>
          <span className="transition-transform group-hover/cta:translate-x-1">→</span>
        </a>
      </div>
    </motion.article>
  );
}

export function ServicesSection() {
  const railRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      setProgress(p);
      const cardW = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth + 24 : 1;
      setActiveIdx(Math.min(services.length - 1, Math.round(el.scrollLeft / cardW)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollByDir = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const cardW = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth + 24 : 320;
    el.scrollBy({ left: dir * cardW, behavior: "smooth" });
  };

  return (
    <section id="servicos" className="py-28 sm:py-40 relative">
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-rose-500/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-500/[0.04] blur-[140px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-6">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 mb-12 lg:mb-16 items-end">
            <div className="lg:col-span-8">
              <span className="text-xs uppercase tracking-[0.3em] text-white/55 font-mono inline-flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-white/20" />
                /serviços · capabilities
              </span>
              <h2 className="font-display font-bold leading-[0.9] tracking-[-0.04em]" style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)" }}>
                serviços que<br />
                <span className="italic text-white/95">deixam <span className="gradient-text">marca.</span></span>
              </h2>
            </div>
            <p className="lg:col-span-4 text-white/55 text-[15px] leading-relaxed">
              Do briefing à entrega — sob medida. Sem pacote pronto, sem mensalidade escondida, sem template. Cada projeto começa em folha em branco.
            </p>
          </div>
        </Reveal>

        <div className="hidden md:flex items-center justify-between mb-6 gap-6">
          <div className="flex items-center gap-4 text-xs font-mono text-white/55 uppercase tracking-[0.25em]">
            <span className="text-white/80 font-semibold">{String(activeIdx + 1).padStart(2, "0")}</span>
            <div className="svc-rail-progress" style={{ ["--p" as string]: `${Math.max(8, progress * 100)}%` }}>
              <span />
            </div>
            <span>{String(services.length).padStart(2, "0")}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollByDir(-1)}
              data-cursor="cta"
              data-cursor-label="Prev"
              className="w-11 h-11 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition flex items-center justify-center"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Próximo"
              onClick={() => scrollByDir(1)}
              data-cursor="cta"
              data-cursor-label="Next"
              className="w-11 h-11 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition flex items-center justify-center"
            >
              →
            </button>
          </div>
        </div>

        <div ref={railRef} className="svc-rail -mx-6 px-6">
          {services.map((s, i) => (
            <ServiceCard key={s.key} s={s} index={i} total={services.length} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/55 uppercase tracking-[0.25em]">
          <span className="md:hidden">↔ deslize para o lado</span>
          <span className="hidden md:inline">arraste · scroll · setas</span>
          <Link
            href="#promo"
            data-cursor="cta"
            data-cursor-label="Promo"
            className="text-white/70 hover:text-rose-400 transition normal-case tracking-normal font-sans text-sm border-b border-white/15 hover:border-rose-400 pb-0.5"
          >
            ver oferta de abril →
          </Link>
        </div>
      </div>
    </section>
  );
}
