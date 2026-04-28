"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { WA_LINK } from "../../lib/constants";
import { ScrambleText, SaoPauloClock, MagneticCard } from "../interactive";
import { MagneticButton, WhatsAppIcon } from "../primitives";

export function Hero({ loading }: { loading: boolean }) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section className="min-h-screen flex items-center px-6 pt-32 pb-20 overflow-hidden relative">
      <div className="aurora" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-[1500px] mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={!loading ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="flex items-center justify-between mb-12 text-xs uppercase tracking-[0.3em] text-white/40 font-mono"
        >
          <span className="inline-flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Disponível · 2026
          </span>
          <span className="hidden md:inline-flex items-center gap-2">
            São Paulo · <SaoPauloClock />
          </span>
        </motion.div>

        <h1 className="font-display font-bold leading-[0.88] tracking-[-0.04em] text-[clamp(3rem,12vw,11rem)]">
          {!loading && (
            <>
              <motion.span
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.5, ease: [0.25, 1, 0.5, 1] }}
                className="block"
              >
                <ScrambleText text="Sites que" trigger="mount" delay={2700} />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.7, ease: [0.25, 1, 0.5, 1] }}
                className="block gradient-text italic"
              >
                <ScrambleText text="vendem." trigger="mount" delay={2900} />
              </motion.span>
            </>
          )}
        </h1>

        <div className="grid lg:grid-cols-12 gap-10 mt-14 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={!loading ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 3.2 }}
            className="lg:col-span-6 lg:col-start-1"
          >
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed font-light max-w-xl">
              Studio independente de Vinícius Ribeiro. Construo sites, landings, automações e CRMs sob medida — focados em conversão real, com estética cinematográfica e código performático.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={!loading ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 3.4 }}
            className="lg:col-span-5 lg:col-start-8 flex flex-col sm:flex-row gap-3"
          >
            <MagneticCard className="flex-1">
              <MagneticButton
                href={WA_LINK("Olá Vinícius! Quero conversar sobre meu projeto.")}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="cta"
                data-cursor-label="WhatsApp"
                className="w-full px-7 py-5 rounded-full bg-rose-500 text-white font-semibold hover:bg-rose-400 transition-colors inline-flex items-center justify-center gap-2 shadow-[0_20px_60px_-15px_rgba(244,63,94,0.5)]"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Iniciar projeto
              </MagneticButton>
            </MagneticCard>
            <MagneticCard className="flex-1">
              <MagneticButton
                href="#trabalhos"
                data-cursor="cta"
                data-cursor-label="Ver"
                className="w-full px-7 py-5 rounded-full border border-white/20 text-white font-medium hover:border-white hover:bg-white hover:text-black transition-all inline-flex items-center justify-center"
              >
                Ver trabalhos →
              </MagneticButton>
            </MagneticCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={!loading ? { opacity: 1 } : {}}
          transition={{ delay: 3.6 }}
          className="mt-20 pt-8 border-t border-white/10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.25em] text-white/40 font-mono"
        >
          <span>Figma · Webflow · Next.js</span>
          <span className="opacity-30">/</span>
          <span>GSAP · Lottie · Lenis</span>
          <span className="opacity-30">/</span>
          <span>SEO Google + Maps</span>
          <span className="opacity-30">/</span>
          <span>LGPD · OAB 205/2021</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
