import Image from "next/image";
import { CNPJ_FMT, COMPANY_NAME, EMAIL, PHONE_PRETTY, WA_LINK } from "../../lib/constants";
import { SaoPauloClock } from "../interactive";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-black text-white px-6 pt-32 pb-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-rose-500/10 blur-[160px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto relative">
        {/* BIG TYPE — Vamos conversar */}
        <a
          href={WA_LINK("Olá Vinícius! Vim pelo site.")}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="cta"
          data-cursor-label="WhatsApp"
          className="block group"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/55 font-mono mb-6 inline-flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Agenda aberta · Abril 2026
          </div>
          <div className="big-link">Vamos conversar.</div>
        </a>

        {/* Contact mega row */}
        <div className="mt-16 grid lg:grid-cols-2 gap-10 pb-16 border-b border-white/10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/55 font-mono mb-3">Email</div>
            <a href={`mailto:${EMAIL}`} className="text-2xl sm:text-4xl font-display font-bold hover:text-rose-400 transition-colors break-all">
              {EMAIL}
            </a>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/55 font-mono mb-3">Telefone · WhatsApp</div>
            <a href={`tel:+5518996311933`} className="text-2xl sm:text-4xl font-display font-bold hover:text-rose-400 transition-colors">
              {PHONE_PRETTY}
            </a>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-white/10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/images/brand/logo-white.svg" alt={COMPANY_NAME} width={140} height={40} />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              Estúdio independente especializado em sites, landing pages, automações e CRMs sob medida. Foco em uma métrica que importa: <span className="text-white">conversão real</span>. Atendimento direto com o fundador, do briefing à entrega.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/55 mb-4 font-mono">Navegar</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#servicos" className="text-white/70 hover:text-white transition-colors">serviços</a></li>
              <li><a href="#trabalhos" className="text-white/70 hover:text-white transition-colors">trabalhos</a></li>
              <li><a href="#templates" className="text-white/70 hover:text-white transition-colors">templates</a></li>
              <li><a href="#promo" className="text-rose-400 hover:text-rose-300 transition-colors">promo R$199</a></li>
              <li><a href="#sobre" className="text-white/70 hover:text-white transition-colors">sobre</a></li>
              <li><a href="#contato" className="text-white/70 hover:text-white transition-colors">contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/55 mb-4 font-mono">Estúdio · São Paulo</h4>
            <div className="text-sm text-white/70 space-y-2.5">
              <div className="font-mono tabular-nums text-white">
                <SaoPauloClock /> · BRT
              </div>
              <div>Atendimento Brasil inteiro</div>
              <div>Seg–Sex · 09h–19h</div>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="overflow-hidden py-8 border-b border-white/10">
          <div className="animate-marquee flex whitespace-nowrap font-display text-3xl font-bold text-white/40">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="flex items-center">
                {["Sites que convertem", "·", "Landing pages de campanha", "·", "Automações", "·", "CRMs sob medida", "·", "Chatbots com IA", "·"].map((t, j) => (
                  <span key={j} className="mx-6">{t}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-between text-[11px] text-white/55 font-mono uppercase tracking-wider">
          <div>© {year} {COMPANY_NAME} · CNPJ {CNPJ_FMT}</div>
          <div>Feito com cuidado em São Paulo</div>
        </div>
      </div>
    </footer>
  );
}
