"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { WA_LINK } from "../../lib/constants";
import { MagneticButton } from "../primitives";

const links = [
  { label: "Serviços", href: "#servicos" },
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Promo R$199", href: "#promo", highlight: true },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export function Nav() {
  const [navVisible, setNavVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setNavVisible(currentY < lastScrollY.current || currentY < 100);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2.2 }}
      className={`fixed top-8 sm:top-9 left-0 right-0 z-50 bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--border)] ${
        navVisible ? "nav-visible" : "nav-hidden"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3" aria-label="PixelCode Studio — início">
          <Image src="/images/brand/icon.svg" alt="" width={32} height={32} className="rounded-lg" />
          <span className="font-semibold text-[var(--ink)] text-sm tracking-tight">
            PixelCode <span className="text-[var(--muted)] font-normal">· Vinícius Ribeiro</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm transition-colors relative group ${
                l.highlight
                  ? "text-rose-600 font-semibold hover:text-rose-700"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--ink)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <MagneticButton
          href={WA_LINK("Olá Vinícius, vim pelo site da PixelCode Studio.")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block px-5 py-2 rounded-full bg-[var(--ink)] text-white text-sm font-medium hover:bg-black transition-colors"
        >
          Falar agora
        </MagneticButton>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border)]"
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--bg)] border-t border-[var(--border)] px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm py-2 ${l.highlight ? "text-rose-600 font-semibold" : "text-[var(--muted)]"}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={WA_LINK("Olá Vinícius, vim pelo site!")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 text-center px-5 py-3 rounded-full bg-emerald-500 text-white text-sm font-semibold"
          >
            Falar no WhatsApp
          </a>
        </div>
      )}
    </motion.nav>
  );
}
