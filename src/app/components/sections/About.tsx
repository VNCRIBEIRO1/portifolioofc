"use client";

import Image from "next/image";
import { COMPANY_NAME, FOUNDER, WA_LINK } from "../../lib/constants";
import { AnimatedCounter, Reveal } from "../primitives";

const stats = [
  { value: "30", suffix: "+", label: "Projetos entregues" },
  { value: "5", suffix: " anos", label: "De experiência" },
  { value: "98", suffix: "%", label: "Clientes satisfeitos" },
  { value: "24", suffix: "h", label: "Tempo médio de resposta" },
];

export function About() {
  return (
    <section id="sobre" className="px-6 py-28 sm:py-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <Reveal className="order-2 lg:order-1">
          <span className="text-sm uppercase tracking-widest text-[var(--muted)] font-medium inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[var(--border-strong)]" />
            Quem está por trás
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight">
            {FOUNDER}<span className="text-rose-500">.</span>
          </h2>
          <p className="text-[var(--muted)] text-lg mt-6 leading-relaxed font-light">
            Desenvolvedor full-stack e fundador da {COMPANY_NAME}.
            Transformo briefings em produtos digitais que vendem — escrevendo
            código limpo, pensando UX e cuidando de cada pixel pra que cada
            site faça o que precisa fazer: <strong className="text-[var(--ink)]">trazer cliente.</strong>
          </p>
          <p className="text-[var(--muted)] mt-4 leading-relaxed font-light">
            Atendimento direto, sem intermediário. Você fala comigo do briefing à entrega.
          </p>

          <ul className="grid grid-cols-2 gap-x-8 gap-y-6 mt-10">
            {stats.map((s) => (
              <li key={s.label}>
                <div className="font-display text-4xl sm:text-5xl font-bold text-[var(--ink)] tabular-nums">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs uppercase tracking-widest text-[var(--muted)] mt-1">{s.label}</div>
              </li>
            ))}
          </ul>

          <a
            href={WA_LINK("Olá Vinícius, quero conversar sobre meu projeto.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 px-6 py-3 rounded-full bg-[var(--ink)] text-white font-medium hover:bg-black transition-colors text-sm"
          >
            Conversar diretamente comigo →
          </a>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.15}>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100">
            <Image
              src="/images/workspace.png"
              alt="Workspace de desenvolvimento"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-xs uppercase tracking-widest opacity-80">Studio</div>
              <div className="font-display text-2xl font-bold">São Paulo · Remoto Brasil</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
