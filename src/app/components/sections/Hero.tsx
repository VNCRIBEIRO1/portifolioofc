"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { WA_LINK } from "../../lib/constants";
import { MagneticButton, SplitText, WhatsAppIcon } from "../primitives";

export function Hero({ loading }: { loading: boolean }) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24 sm:pt-28 pb-16 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <Image src="/images/hero-abstract.png" alt="" fill className="object-cover" priority />
      </div>

      {/* Soft accent blobs */}
      <div aria-hidden="true" className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full bg-rose-200/40 blur-[120px] pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-32 -right-20 w-[520px] h-[520px] rounded-full bg-amber-200/40 blur-[140px] pointer-events-none" />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={!loading ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.4 }}
        >
          <span className="text-sm uppercase tracking-[0.3em] text-[var(--muted)] font-medium inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[var(--border-strong)]" />
            PixelCode Studio
            <span className="w-8 h-[1px] bg-[var(--border-strong)]" />
          </span>
        </motion.div>

        <h1 className="font-display text-5xl sm:text-7xl lg:text-[7.5rem] font-bold leading-[0.95] tracking-tight mt-6 mb-6">
          {!loading && (
            <>
              <SplitText text="Sites que" delay={2.5} />
              <br />
              <SplitText text="vendem." className="gradient-text" delay={2.7} />
            </>
          )}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={!loading ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 3.1 }}
          className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Sites, landing pages, automações e CRMs sob medida — focados em
          conversão real, não em métrica de vaidade. Estética impecável, código
          performático, SEO técnico de verdade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={!loading ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 3.3 }}
          className="flex flex-col sm:flex-row justify-center gap-3"
        >
          <MagneticButton
            href={WA_LINK("Olá Vinícius! Quero conversar sobre meu projeto.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Quero meu site
          </MagneticButton>
          <MagneticButton
            href="#trabalhos"
            className="px-8 py-4 rounded-full border border-[var(--ink)] text-[var(--ink)] font-medium hover:bg-[var(--ink)] hover:text-white transition-all"
          >
            Ver trabalhos →
          </MagneticButton>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={!loading ? { opacity: 1 } : {}}
          transition={{ delay: 3.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--muted)]"
        >
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Atendimento via WhatsApp
          </span>
          <span className="hidden sm:inline opacity-30">·</span>
          <span>SEO Google + Maps</span>
          <span className="hidden sm:inline opacity-30">·</span>
          <span>LGPD & OAB 205/2021</span>
          <span className="hidden sm:inline opacity-30">·</span>
          <span>Hospedagem inclusa</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
