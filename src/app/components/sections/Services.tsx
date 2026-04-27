"use client";

import { motion } from "framer-motion";
import { services } from "../../data/services";
import { WA_LINK } from "../../lib/constants";
import { Reveal } from "../primitives";

export function ServicesSection() {
  return (
    <section id="servicos" className="py-28 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <span className="text-sm uppercase tracking-widest text-[var(--muted)] font-medium inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[var(--border-strong)]" />
            Serviços
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight">
            O que entregamos<span className="text-[var(--border-strong)]">.</span>
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-2xl mt-6 font-light">
            Soluções digitais sob medida para o seu negócio crescer — do site
            ao sistema interno, passando por automação e identidade visual.
          </p>
        </Reveal>

        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {services.map((svc, i) => (
            <motion.li
              key={svc.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl p-7 border border-[var(--border)] hover:border-[var(--ink)] hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--ink)] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="w-6 h-6 block">{svc.icon}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--ink)] mb-2">{svc.title}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-4 flex-1">{svc.description}</p>
              <ul className="flex flex-wrap gap-2 mb-5">
                {svc.bullets.map((b) => (
                  <li key={b} className="text-[11px] uppercase tracking-wider text-[var(--muted)] border border-[var(--border)] rounded-full px-2.5 py-1">
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={WA_LINK(`Olá Vinícius! Quero saber mais sobre: ${svc.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] group-hover:gap-3 transition-all"
              >
                Falar sobre este serviço
                <span aria-hidden="true">→</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
