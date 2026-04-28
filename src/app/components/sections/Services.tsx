"use client";

import { motion } from "framer-motion";
import { services } from "../../data/services";
import { WA_LINK } from "../../lib/constants";
import { Reveal } from "../primitives";
import { SpotlightCard, BeamCard, FlipCard } from "../interactive";

export function ServicesSection() {
  return (
    <section id="servicos" className="py-32 sm:py-40 px-6 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="max-w-[1500px] mx-auto relative">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-10 mb-20 items-end">
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/20" />
                Capabilities · what we do
              </span>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-[8rem] font-bold mt-6 leading-[0.9] tracking-[-0.04em]">
                Build <span className="gradient-text italic">anything.</span>
              </h2>
            </div>
            <p className="lg:col-span-4 lg:col-start-9 text-white/50 text-base font-light leading-relaxed">
              Do briefing à entrega — sob medida. Sem pacote pronto, sem surpresa, sem mensalidade escondida.
            </p>
          </div>
        </Reveal>

        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const isFeatured = i === 1;
            const Wrapper = isFeatured ? BeamCard : SpotlightCard;
            return (
              <motion.li
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
              >
                {i === 0 ? (
                  <FlipCard
                    className="h-[340px]"
                    front={
                      <div className="h-full bg-[var(--bg-soft)] border border-white/10 rounded-3xl p-7 flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-300 flex items-center justify-center mb-5">
                          <span className="w-6 h-6 block">{svc.icon}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-2">{svc.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed flex-1">{svc.description}</p>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-mono mt-4">Hover →</div>
                      </div>
                    }
                    back={
                      <div className="h-full bg-gradient-to-br from-rose-500 to-amber-500 text-white rounded-3xl p-7 flex flex-col">
                        <h3 className="font-display text-xl font-bold mb-3">Inclui:</h3>
                        <ul className="space-y-2 text-sm flex-1">
                          {svc.bullets.map((b) => (
                            <li key={b} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              {b}
                            </li>
                          ))}
                        </ul>
                        <a
                          href={WA_LINK(`Olá Vinícius! Quero ${svc.title}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="cta"
                          data-cursor-label="WhatsApp"
                          className="mt-4 text-sm font-bold underline"
                        >
                          Falar agora →
                        </a>
                      </div>
                    }
                  />
                ) : (
                  <Wrapper className="h-[340px] bg-[var(--bg-soft)] border border-white/10 rounded-3xl p-7 flex flex-col group hover:border-white/30 transition-colors">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors ${isFeatured ? "bg-amber-500/15 text-amber-300" : "bg-white/5 text-white/80 group-hover:bg-rose-500/15 group-hover:text-rose-300"}`}>
                      <span className="w-6 h-6 block">{svc.icon}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{svc.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1">{svc.description}</p>
                    <ul className="flex flex-wrap gap-1.5 mb-4">
                      {svc.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="text-[10px] uppercase tracking-wider text-white/50 border border-white/10 rounded-full px-2 py-0.5">
                          {b}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={WA_LINK(`Olá Vinícius! Quero saber mais sobre: ${svc.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="cta"
                      data-cursor-label="Ver"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:gap-3 transition-all"
                    >
                      Saber mais <span aria-hidden>→</span>
                    </a>
                  </Wrapper>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
