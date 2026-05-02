"use client";

import Image from "next/image";
import { COMPANY_NAME, FOUNDER, WA_LINK } from "../../lib/constants";
import { AnimatedCounter, Reveal } from "../primitives";
import { MaskReveal, MagneticCard } from "../interactive";

const stats = [
  { value: "30", suffix: "+", label: "Projetos entregues" },
  { value: "5", suffix: " anos", label: "De experiência" },
  { value: "98", suffix: "%", label: "Clientes satisfeitos" },
  { value: "24", suffix: "h", label: "Resposta média" },
];

export function About() {
  return (
    <section id="sobre" className="px-6 py-32 sm:py-40 relative overflow-hidden">
      <div className="absolute -bottom-40 -right-20 w-[700px] h-[700px] rounded-full bg-emerald-500/5 blur-[160px] pointer-events-none" />
      <div className="max-w-[1500px] mx-auto relative grid lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-7 lg:sticky lg:top-32">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-white/55 font-mono inline-flex items-center gap-3">
              <span className="w-8 h-[1px] bg-white/20" />
              /sobre · 01
            </span>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-[7rem] font-bold mt-6 leading-[0.9] tracking-[-0.04em]">
              {FOUNDER.split(" ")[0]} <br />
              <span className="gradient-text italic">{FOUNDER.split(" ").slice(1).join(" ")}.</span>
            </h2>
            <p className="text-white/75 text-lg mt-8 leading-relaxed font-light max-w-xl">
              Desenvolvedor full-stack e fundador da {COMPANY_NAME}. Transformo briefings em produtos digitais que vendem — código limpo, UX pensada e cada pixel ajustado para um único fim: <span className="text-white font-medium">trazer cliente novo</span>.
            </p>
            <p className="text-white/65 mt-4 leading-relaxed font-light max-w-xl">
              Atendimento direto, sem intermediário. Você fala comigo do briefing à entrega — presencial em São Paulo, remoto para o Brasil inteiro.
            </p>

            <ul className="grid grid-cols-2 gap-x-8 gap-y-8 mt-12 max-w-md">
              {stats.map((s) => (
                <li key={s.label}>
                  <div className="font-display huge-number text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-white tabular-nums leading-none">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/55 mt-2 font-mono">{s.label}</div>
                </li>
              ))}
            </ul>

            <MagneticCard className="inline-block mt-12">
              <a
                href={WA_LINK("Olá Vinícius, quero conversar sobre meu projeto.")}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="cta"
                data-cursor-label="WhatsApp"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-black font-semibold hover:bg-rose-500 hover:text-white transition-colors text-sm"
              >
                Conversar direto comigo →
              </a>
            </MagneticCard>
          </Reveal>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <MaskReveal>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[var(--bg-soft)] border border-white/10">
              <Image
                src="/images/workspace.png"
                alt="Workspace de desenvolvimento"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/65 font-mono">Estúdio</div>
                <div className="font-display text-2xl font-bold mt-1">São Paulo · Atendimento Brasil</div>
              </div>
            </div>
          </MaskReveal>

          <Reveal delay={0.2}>
            <div className="rounded-3xl border border-white/10 bg-[var(--bg-soft)] p-7">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/55 font-mono mb-3">Stack que uso</div>
              <div className="flex flex-wrap gap-2">
                {["Figma", "Webflow", "Next.js", "TypeScript", "Tailwind", "GSAP", "Framer Motion", "Lottie", "Lenis", "Vercel"].map((t) => (
                  <span key={t} className="text-xs uppercase tracking-wider text-white/70 border border-white/10 rounded-full px-3 py-1.5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-amber-500/10 p-7">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-mono mb-3">Manifesto</div>
              <p className="text-white/85 leading-relaxed font-display italic text-lg">
                &ldquo;Site bonito que não vende é portfólio. Eu construo ferramentas de venda.&rdquo;
              </p>
              <div className="mt-3 text-xs text-white/55">— {FOUNDER}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
