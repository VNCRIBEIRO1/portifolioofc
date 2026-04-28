"use client";

import { useState } from "react";
import { promoBenefits, promoFAQ } from "../../data/services";
import { PROMO_DEADLINE_ISO, PROMO_PRICE, PROMO_PRICE_FROM, WA_LINK } from "../../lib/constants";
import { useCountdown } from "../../lib/hooks";
import { Reveal } from "../primitives";

export function PromoSection() {
  const { d, h, m, s, expired } = useCountdown(PROMO_DEADLINE_ISO);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (expired) return null;

  return (
    <section id="promo" className="px-6 py-32 sm:py-40 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(244,63,94,0.08),transparent_60%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.06),transparent_60%)]" />
      <div className="max-w-[1500px] mx-auto relative">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* LEFT — Pitch */}
            <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 text-white rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-[0_40px_120px_-40px_rgba(244,63,94,0.6)]">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
              <span className="inline-block text-[11px] uppercase tracking-[0.3em] bg-white/20 backdrop-blur px-3 py-1.5 rounded-full mb-6 font-mono">
                Promo de fim de mês · Advocacia
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                Site + Chatbot <br />de triagem
              </h2>
              <p className="text-white/85 text-lg mt-5 max-w-md leading-relaxed">
                Tudo que sua banca precisa pra começar a captar clientes online ainda este mês.
              </p>

              <div className="flex items-baseline gap-4 mt-8">
                <s className="text-white/60 text-2xl">R$ {PROMO_PRICE_FROM}</s>
                <span className="font-display text-6xl sm:text-7xl font-extrabold tracking-tight">
                  R$ {PROMO_PRICE}
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">Pagamento único · sem mensalidades escondidas</p>

              <div className="grid grid-cols-4 gap-2 mt-8 max-w-sm">
                {[
                  { v: d, l: "dias" },
                  { v: h, l: "horas" },
                  { v: m, l: "min" },
                  { v: s, l: "seg" },
                ].map((x) => (
                  <div key={x.l} className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center">
                    <div className="font-display text-3xl font-bold tabular-nums">
                      {String(x.v).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-white/80 font-mono">{x.l}</div>
                  </div>
                ))}
              </div>

              <a
                href={WA_LINK(`Olá Vinícius! Quero garantir a promo de R$ ${PROMO_PRICE} (site + chatbot) agora.`)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="cta"
                data-cursor-label="WhatsApp"
                className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-rose-600 font-bold hover:bg-black hover:text-white transition-colors shadow-xl"
              >
                Garantir minha vaga →
              </a>
              <p className="text-[11px] text-white/70 mt-4 font-mono uppercase tracking-wider">
                Conforme OAB 205/2021 · zero promessa de resultado · vagas limitadas
              </p>
            </div>

            {/* RIGHT — Benefits + FAQ */}
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-white">O que está incluso</h3>
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {promoBenefits.map((b) => (
                  <li
                    key={b.title}
                    className="flex items-start gap-3 text-sm text-white bg-[var(--bg-soft)] border border-white/10 rounded-2xl p-3.5 hover:border-white/30 transition-colors"
                  >
                    <span className="text-xl leading-none mt-0.5" aria-hidden="true">{b.icon}</span>
                    <span>
                      <strong className="block text-white">{b.title}</strong>
                      <span className="text-white/50 text-xs">{b.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="font-display text-2xl font-bold text-white pt-4">Dúvidas frequentes</h3>
              <ul role="list" className="space-y-2">
                {promoFAQ.map((item, i) => (
                  <li key={item.q} className="bg-[var(--bg-soft)] border border-white/10 rounded-2xl">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                      aria-expanded={openFaq === i}
                      data-cursor="hover"
                    >
                      <span className="font-medium text-white text-sm">{item.q}</span>
                      <span className="text-white/55 text-lg leading-none" aria-hidden="true">
                        {openFaq === i ? "−" : "+"}
                      </span>
                    </button>
                    {openFaq === i && <p className="px-5 pb-4 text-sm text-white/60 leading-relaxed">{item.a}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
