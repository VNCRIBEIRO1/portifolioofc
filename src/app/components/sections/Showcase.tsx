"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { projects } from "../../data/projects";
import { Reveal } from "../primitives";

export function Showcase() {
  return (
    <section id="trabalhos" className="px-6 py-28 sm:py-32 bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <span className="text-sm uppercase tracking-widest text-[var(--muted)] font-medium inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[var(--border-strong)]" />
                Trabalhos selecionados
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight">
                Estudos de caso reais<span className="text-rose-500">.</span>
              </h2>
            </div>
            <p className="text-[var(--muted)] max-w-md text-base sm:text-right">
              Sites institucionais, landings de campanha e plataformas — cada um com objetivo claro de conversão.
            </p>
          </div>
        </Reveal>

        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-2xl transition-all"
            >
              <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                <Image
                  src={p.mockup}
                  alt={`Mockup do projeto ${p.title.replace(/\n/g, " ")}`}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={p.mockup.startsWith("http")}
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest bg-white/90 backdrop-blur text-[var(--ink)] px-2.5 py-1 rounded-full font-semibold">
                    {p.number}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest bg-white/90 backdrop-blur text-[var(--ink)] px-2.5 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl font-bold text-[var(--ink)] whitespace-pre-line leading-tight">
                  {p.title}
                </h3>
                <p className="text-xs uppercase tracking-widest text-[var(--muted)] mt-1">{p.subtitle}</p>
                <p className="text-[var(--muted)] text-sm leading-relaxed mt-4">{p.description}</p>
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[var(--border)]">
                  {p.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-wider text-[var(--muted)] border border-[var(--border)] rounded-full px-2.5 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[var(--ink)] hover:gap-3 transition-all"
                  >
                    Ver projeto ao vivo →
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
