"use client";

import { EMAIL, PHONE_PRETTY, WA_LINK } from "../../lib/constants";
import { MagneticButton, Reveal, WhatsAppIcon } from "../primitives";
import { MagneticCard } from "../interactive";

export function FinalCTA() {
  return (
    <section id="contato" className="px-6 py-32 sm:py-40 relative overflow-hidden">
      <div className="aurora" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="max-w-[1500px] mx-auto text-center relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-white/20" />
            /vamos conversar
            <span className="w-8 h-[1px] bg-white/20" />
          </span>
          <h2 className="font-display text-[clamp(3rem,11vw,10rem)] font-bold leading-[0.9] mt-8 tracking-[-0.04em] lowercase">
            o próximo projeto<br />
            <span className="gradient-text italic">é o seu.</span>
          </h2>
          <p className="text-white/55 text-lg max-w-xl mx-auto mt-8 font-light leading-relaxed">
            Resposta em até 24h úteis. Orçamento gratuito, sem compromisso e sem mensalidade escondida. Quanto antes a gente conversa, antes você fica online.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-12">
            <MagneticCard>
              <MagneticButton
                href={WA_LINK("Olá Vinícius! Quero começar meu projeto.")}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="cta"
                data-cursor-label="WhatsApp"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full bg-rose-500 text-white font-semibold hover:bg-rose-400 transition-colors shadow-[0_20px_60px_-15px_rgba(244,63,94,0.5)]"
              >
                <WhatsAppIcon className="w-4 h-4" />
                chamar no WhatsApp
              </MagneticButton>
            </MagneticCard>
            <MagneticCard>
              <MagneticButton
                href={`mailto:${EMAIL}`}
                data-cursor="cta"
                data-cursor-label="Email"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full border border-white/20 text-white font-medium hover:border-white hover:bg-white hover:text-black transition-all"
              >
                {EMAIL}
              </MagneticButton>
            </MagneticCard>
          </div>

          <div className="text-sm text-white/40 mt-10 font-mono">
            Ou ligue: <a className="text-white font-semibold" href="tel:+5518996311933">{PHONE_PRETTY}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
