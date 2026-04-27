"use client";

import Image from "next/image";
import { EMAIL, PHONE_PRETTY, WA_LINK } from "../../lib/constants";
import { MagneticButton, Reveal, WhatsAppIcon } from "../primitives";

export function FinalCTA() {
  return (
    <section id="contato" className="px-6 py-28 sm:py-32 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <Image src="/images/pattern-contact.png" alt="" fill className="object-cover" />
      </div>
      <div className="max-w-5xl mx-auto text-center relative">
        <Reveal>
          <span className="text-sm uppercase tracking-widest text-[var(--muted)] font-medium inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[var(--border-strong)]" />
            Vamos conversar
            <span className="w-8 h-[1px] bg-[var(--border-strong)]" />
          </span>
          <h2 className="font-display text-5xl sm:text-7xl font-bold leading-[0.95] mt-6">
            Bora começar <br />
            <span className="gradient-text">o seu projeto?</span>
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto mt-6 font-light leading-relaxed">
            Resposta em até 24h úteis. Orçamento gratuito e sem compromisso.
            Quanto antes a gente conversa, antes você fica online.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <MagneticButton
              href={WA_LINK("Olá Vinícius! Quero começar meu projeto.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-xl shadow-emerald-500/20"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chamar no WhatsApp
            </MagneticButton>
            <MagneticButton
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[var(--ink)] text-[var(--ink)] font-medium hover:bg-[var(--ink)] hover:text-white transition-all"
            >
              {EMAIL}
            </MagneticButton>
          </div>

          <div className="text-sm text-[var(--muted)] mt-8">
            Ou ligue: <a className="text-[var(--ink)] font-semibold" href="tel:+5518996311933">{PHONE_PRETTY}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
