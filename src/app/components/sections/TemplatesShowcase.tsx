"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { TEMPLATES_BASE_URL, templateUrl, templates, type TemplateCategory } from "../../data/templates";
import { WA_LINK } from "../../lib/constants";
import { Reveal } from "../primitives";

const CATS: ("Todos" | TemplateCategory)[] = ["Todos", "Clássico", "Moderno", "Saúde", "Psicologia"];

const catBadge: Record<TemplateCategory, string> = {
  "Clássico": "bg-amber-50 text-amber-700 border-amber-200",
  "Moderno": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Saúde": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Psicologia": "bg-rose-50 text-rose-700 border-rose-200",
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
    <section id="templates" className="px-6 py-28 sm:py-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <span className="text-sm uppercase tracking-widest text-[var(--muted)] font-medium inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[var(--border-strong)]" />
                Catálogo
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight">
                25 templates prontos<span className="gradient-text">.</span>
              </h2>
              <p className="text-[var(--muted)] mt-4 max-w-2xl font-light">
                Designs profissionais para Advocacia, Saúde e Psicologia — todos personalizáveis com a sua marca, conteúdo e domínio. Escolha um modelo, eu adapto pra você.
              </p>
            </div>
            <a
              href={TEMPLATES_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] hover:gap-3 transition-all"
            >
              Ver vitrine completa →
            </a>
          </div>
        </Reveal>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActive(c);
                setShowAll(false);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                active === c
                  ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                  : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
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

        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((tpl, i) => (
            <motion.li
              key={tpl.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 9) * 0.04 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl overflow-hidden border border-[var(--border)] hover:border-[var(--ink)] hover:shadow-2xl transition-all"
            >
              <a href={templateUrl(tpl.slug)} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative aspect-[16/11] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                  <Image
                    src={thumb(tpl.slug)}
                    alt={`Preview do template ${tpl.name}`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] uppercase tracking-widest border px-2.5 py-1 rounded-full font-semibold backdrop-blur ${catBadge[tpl.category]}`}>
                      {tpl.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-5">
                    <span className="text-white text-xs uppercase tracking-widest font-semibold">
                      Abrir preview ↗
                    </span>
                  </div>
                </div>
              </a>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h3 className="font-display text-base font-bold text-[var(--ink)] leading-tight">{tpl.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] shrink-0">{tpl.slug}</span>
                </div>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed line-clamp-2">{tpl.description}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                  <a
                    href={templateUrl(tpl.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[var(--ink)] hover:underline"
                  >
                    Ver ao vivo →
                  </a>
                  <span className="text-[var(--border-strong)]" aria-hidden="true">·</span>
                  <a
                    href={WA_LINK(`Olá Vinícius! Gostei do template ${tpl.name} (${tpl.slug}). Quero personalizar pra mim.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    Quero esse
                  </a>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        {filtered.length > 9 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="px-6 py-3 rounded-full border border-[var(--ink)] text-[var(--ink)] text-sm font-medium hover:bg-[var(--ink)] hover:text-white transition-all"
            >
              {showAll ? "Mostrar menos" : `Ver todos os ${filtered.length} templates`}
            </button>
          </div>
        )}

        <div className="mt-14 rounded-3xl border border-[var(--border)] bg-[var(--cream)] p-8 sm:p-10 text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
            Não achou o que queria?
          </h3>
          <p className="text-[var(--muted)] mt-3 max-w-xl mx-auto">
            Cada template é totalmente personalizável — cores, fontes, conteúdo, fotos. E se preferir algo 100% sob medida, eu desenho do zero pra você.
          </p>
          <a
            href={WA_LINK("Olá Vinícius! Vi os templates e quero conversar sobre o meu site.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
          >
            Falar com o Vinícius →
          </a>
        </div>
      </div>
    </section>
  );
}
