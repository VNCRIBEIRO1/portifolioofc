"use client";

import Image from "next/image";
import { projects } from "../../data/projects";
import { Reveal } from "../primitives";
import { HoverSwapList } from "../interactive";

export function Showcase() {
  const items = projects.map((p) => ({
    id: String(p.id),
    eyebrow: p.number,
    title: p.title.replace(/\n/g, " "),
    meta: p.category,
    image: p.mockup,
    href: p.url,
  }));

  return (
    <section id="trabalhos" className="px-6 py-32 sm:py-40 relative overflow-hidden">
      <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-[140px] pointer-events-none" />
      <div className="max-w-[1500px] mx-auto relative">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-20">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-white/55 font-mono inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/20" />
                /trabalhos selecionados · 2024–2026
              </span>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-[8rem] font-bold mt-6 leading-[0.9] tracking-[-0.04em] lowercase">
                estudos em <br />
                <span className="gradient-text italic">conversão.</span>
              </h2>
            </div>
            <p className="text-white/55 max-w-md text-base lg:text-right font-light leading-relaxed">
              Sites institucionais, landings de campanha e plataformas — cada projeto com um único objetivo, executado até o fim. Passe o cursor para visualizar a peça.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <HoverSwapList items={items} />
        </Reveal>

        {/* Featured detail strip */}
        <div className="mt-32 grid lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <div className="group relative rounded-3xl overflow-hidden bg-[var(--bg-soft)] border border-white/5 hover:border-white/20 transition-all">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={p.mockup}
                    alt={p.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-1000 mask-reveal is-revealed"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized={p.mockup.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md text-white/80 px-2.5 py-1 rounded-full font-mono">{p.number}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md text-white/80 px-2.5 py-1 rounded-full">{p.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold leading-tight whitespace-pre-line">{p.title}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55 mt-2 font-mono">{p.subtitle}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
