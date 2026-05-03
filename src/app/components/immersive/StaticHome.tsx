"use client";

import { CRYSTALS } from "./CrystalShowcase";

/**
 * Versão DOM-only para mobile / reduced-motion / SSR (LCP rápido).
 * Mostra o mesmo conteúdo (hero + manifesto + cases + CTA) sem canvas WebGL.
 */
export function StaticHome() {
  return (
    <main className="relative bg-[var(--bg)] text-[var(--ink)]">
      {/* Hero */}
      <section className="min-h-[100svh] flex items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#03030c] via-[#0c0c20] to-[#03030c] opacity-90" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-[clamp(3rem,11vw,9rem)] font-light tracking-tight leading-[0.92]">
            PixelCode
            <br />
            <span className="text-[var(--accent)]">Studio</span>
          </h1>
          <p className="mt-6 font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-[var(--accent)]">
            experiências digitais sob medida
          </p>
          <p className="mt-12 font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] animate-bounce">
            ↓ role para mergulhar
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="min-h-[80svh] flex items-center justify-center px-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-[clamp(1.8rem,5vw,4rem)] font-light leading-tight">Não fazemos sites.</p>
          <p className="text-[clamp(1.8rem,5vw,4rem)] font-light leading-tight">
            Construímos experiências.
          </p>
          <p className="text-[clamp(1.8rem,5vw,4rem)] font-light leading-tight text-[var(--accent)]">
            Que convertem.
          </p>
        </div>
      </section>

      {/* Cases (11) */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-10">
            cases · 11 projetos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CRYSTALS.map((c, i) => (
              <article
                key={c.slug}
                className="group border border-[var(--ink)]/15 rounded-lg p-5 bg-[var(--ink)]/[0.02] backdrop-blur-sm hover:border-[var(--ink)]/40 hover:bg-[var(--ink)]/[0.04] transition"
              >
                <div className="aspect-[16/10] rounded overflow-hidden mb-4 bg-[#0c0c20] relative">
                  {c.mockup ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.mockup}
                      alt={`${c.title} — mockup`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--accent)] font-mono text-xs uppercase tracking-widest">
                      mockup em produção
                    </div>
                  )}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, transparent 60%, ${c.accent}22)`,
                    }}
                  />
                </div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] mb-1">
                  {String(i + 1).padStart(2, "0")} · {c.nicho}
                </p>
                <h3 className="text-xl font-light group-hover:text-[var(--glow)] transition">
                  {c.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="min-h-[60svh] flex items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <p className="text-[clamp(2rem,6vw,5rem)] font-light">Vamos conversar?</p>
          <a
            href="https://wa.me/5518996311933?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20PixelCode."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 px-8 py-3 border border-[var(--ink)]/40 rounded-full hover:bg-[var(--ink)]/10 transition"
          >
            WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] border-t border-[var(--ink)]/10">
        © {new Date().getFullYear()} pixelcode studio · vinícius ribeiro
      </footer>
    </main>
  );
}
