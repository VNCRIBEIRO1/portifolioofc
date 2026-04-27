"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PROMO_DEADLINE_ISO, PROMO_PRICE, PROMO_PRICE_FROM, WA_LINK } from "../lib/constants";
import { useCountdown } from "../lib/hooks";
import { WhatsAppIcon } from "./primitives";

/* ─── LOADING SCREEN (preserved) ─── */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(onComplete, 2400);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 100));
    }, 200);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loading-bg" style={{ backgroundImage: "url(/images/loading-bg.png)" }} />
      <div className="loading-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src="/images/brand/logo-white.svg"
            alt="PixelCode Studio"
            width={160}
            height={45}
            className="opacity-90"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="loading-bar"><div className="loading-bar-fill" /></div>
          <span className="loading-text">{Math.round(progress)}%</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── PROMO TOP BAR ─── */
export function PromoTopBar() {
  const { d, h, m, s, expired } = useCountdown(PROMO_DEADLINE_ISO);
  if (expired) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <span className="font-semibold uppercase tracking-wider">🔥 Promo Advocacia</span>
        <span>
          Site + Chatbot por <s className="opacity-70">R${PROMO_PRICE_FROM}</s>{" "}
          <strong>R${PROMO_PRICE}</strong> — termina em
        </span>
        <span className="font-mono font-bold tabular-nums">
          {String(d).padStart(2, "0")}d {String(h).padStart(2, "0")}h{" "}
          {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s
        </span>
        <a href="#promo" className="underline underline-offset-2 font-semibold hover:no-underline">
          Quero garantir →
        </a>
      </div>
    </div>
  );
}

/* ─── FLOATING WHATSAPP ─── */
export function FloatingWhatsApp() {
  return (
    <a
      href={WA_LINK("Olá Vinícius, vim pelo site da PixelCode Studio e gostaria de mais informações.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-[55] flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 transition-all hover:scale-105"
    >
      <WhatsAppIcon />
      <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
    </a>
  );
}

/* ─── PROMO POPUP ─── */
export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const { d, h, m, s, expired } = useCountdown(PROMO_DEADLINE_ISO);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const already = sessionStorage.getItem("pcs_promo_dismissed");
    if (already) return;
    setDismissed(false);
    const t = setTimeout(() => setOpen(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") sessionStorage.setItem("pcs_promo_dismissed", "1");
  };

  if (dismissed || expired) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={close}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-popup-title"
          >
            <button
              onClick={close}
              aria-label="Fechar"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xl leading-none z-10"
            >
              ×
            </button>
            <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 text-white px-6 pt-8 pb-12">
              <span className="inline-block text-[11px] uppercase tracking-[0.25em] bg-white/20 px-3 py-1 rounded-full mb-3">
                Oferta de fim de mês
              </span>
              <h3 id="promo-popup-title" className="font-display text-3xl sm:text-4xl font-bold leading-tight">
                Landing page <br />+ Chatbot de triagem
              </h3>
              <div className="flex items-baseline gap-3 mt-4">
                <s className="text-white/70 text-lg">R$ {PROMO_PRICE_FROM}</s>
                <span className="font-display text-5xl font-extrabold">R$ {PROMO_PRICE}</span>
              </div>
              <p className="text-white/90 text-sm mt-2">Pagamento único · sem mensalidade</p>
            </div>
            <div className="px-6 -mt-6 relative">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 grid grid-cols-4 gap-2 text-center">
                {[
                  { v: d, l: "dias" },
                  { v: h, l: "horas" },
                  { v: m, l: "min" },
                  { v: s, l: "seg" },
                ].map((x) => (
                  <div key={x.l}>
                    <div className="font-display text-2xl font-bold tabular-nums text-gray-900">
                      {String(x.v).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-6">
              <ul className="text-sm text-gray-600 space-y-2 mb-5">
                <li>✅ Site profissional + chatbot de triagem</li>
                <li>✅ SEO Google + Maps · Logo grátis se precisar</li>
                <li>✅ Hospedagem vitalícia gratuita</li>
                <li>✅ 30 dias de ajustes ilimitados</li>
              </ul>
              <a
                href={WA_LINK(
                  `Olá Vinícius! Quero garantir a promo de R$ ${PROMO_PRICE} (site + chatbot) antes do fim do mês.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="block w-full text-center px-6 py-4 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-base"
              >
                Garantir minha vaga no WhatsApp →
              </a>
              <p className="text-[11px] text-center text-gray-400 mt-3">
                Válido até 29/04. Vagas limitadas. Conformidade OAB 205/2021.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
