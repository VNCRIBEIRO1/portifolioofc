"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { TEMPLATES_BASE_URL, templateUrl, templates, type TemplateCategory } from "../../data/templates";
import { WA_LINK } from "../../lib/constants";
import { Reveal } from "../primitives";
import { SpotlightCard } from "../interactive";

const CATS: ("Todos" | TemplateCategory)[] = ["Todos", "Clássico", "Moderno", "Saúde", "Psicologia"];

const catBadge: Record<TemplateCategory, string> = {
  "Clássico": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "Moderno": "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "Saúde": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "Psicologia": "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

function thumb(slug: string) {
  return `https://image.thum.io/get/width/900/crop/620/noanimate/${TEMPLATES_BASE_URL}/${slug}/`;
}

export function TemplatesShowcase() {
  const [active, setActive] = useState<(typeof CATS)[number]>("Todos");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () => (active === "Todos" ? templates : templates.filter((t) => t.category === active)),
    [active]
  );
  const visible = showAll ? filtered : filtered.slice(0, 9);

  return (
    <section id="templates" className="px-6 py-32 sm:py-40 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-violet-500/[0.04] blur-[180px] pointer-events-none" />
      <div className="max-w-[1500px] mx-auto relative">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/20" />
                /catálogo · 25 templates prontos
              </span>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-[8rem] font-bold mt-6 leading-[0.9] tracking-[-0.04em] lowercase">
                escolha um <br />
                <span className="gradient-text italic">ponto de partida.</span>
              </h2>
              <p className="text-white/55 mt-6 max-w-2xl font-light leading-relaxed">
                Designs profissionais para Advocacia, Saúde e Psicologia — cada um personalizável com a sua marca, conteúdo e domínio. Entrega em 5 a 10 dias úteis.
              </p>
            </div>
            <a
              href={TEMPLATES_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="cta"
              data-cursor-label="Ver"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all"
            >
              Ver vitrine completa →
            </a>
          </div>
        </Reveal>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => { setActive(c); setShowAll(false); }}
              data-cursor="hover"
              className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all relative ${
                active === c
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/60 border-white/15 hover:border-white/40 hover:text-white"
              }`}
            >
              {c}
              {c !== "Todos" && (
                <span className="ml-2 text-[10px] opacity-60">
                  {templates.filter((t) => t.category === c).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {visible.map((tpl, i) => (
              <motion.li
                key={tpl.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: (i % 9) * 0.04 }}
              >
                <SpotlightCard className="bg-[var(--bg-soft)] border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-colors">
                  <a href={templateUrl(tpl.slug)} target="_blank" rel="noopener noreferrer" data-cursor="cta" data-cursor-label="Ver" className="block">
                    <div className="relative aspect-[16/11] bg-black overflow-hidden">
                      <Image
                        src={thumb(tpl.slug)}
                        alt={`Preview ${tpl.name}`}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] uppercase tracking-[0.2em] border px-2.5 py-1 rounded-full font-semibold backdrop-blur ${catBadge[tpl.category]}`}>
                          {tpl.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <h3 className="font-display text-base font-bold text-white leading-tight">{tpl.name}</h3>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 shrink-0 font-mono">{tpl.slug}</span>
                      </div>
                      <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2">{tpl.description}</p>
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                        <span className="text-xs font-semibold text-white">Ver ao vivo →</span>
                        <span className="text-white/20" aria-hidden>·</span>
                        <a
                          href={WA_LINK(`Olá Vinícius! Gostei do template ${tpl.name} (${tpl.slug}). Quero personalizar.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          Quero esse
                        </a>
                      </div>
                    </div>
                  </a>
                </SpotlightCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {filtered.length > 9 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll((v) => !v)}
              data-cursor="hover"
              className="px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-black transition-all"
            >
              {showAll ? "Mostrar menos" : `Ver todos os ${filtered.length} templates`}
            </button>
          </div>
        )}

        <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-amber-500/10 p-10 sm:p-14 text-center">
          <h3 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight lowercase">
            não achou o que queria?
          </h3>
          <p className="text-white/65 mt-4 max-w-xl mx-auto leading-relaxed">
            Cada template é totalmente personalizável. Se preferir algo 100% sob medida, eu desenho do zero — folha em branco, briefing seu.
          </p>
          <a
            href={WA_LINK("Olá Vinícius! Vi os templates e quero conversar sobre o meu site.")}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="cta"
            data-cursor-label="WhatsApp"
            className="inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-white text-black text-sm font-bold hover:bg-rose-500 hover:text-white transition-colors"
          >
            Falar com o Vinícius →
          </a>
        </div>
      </div>
    </section>
  );
}
