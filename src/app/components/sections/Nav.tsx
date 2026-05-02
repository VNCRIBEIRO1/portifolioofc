"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { WA_LINK } from "../../lib/constants";
import { MagneticButton } from "../primitives";

const links = [
  { label: "serviços", href: "#servicos" },
  { label: "trabalhos", href: "#trabalhos" },
  { label: "templates", href: "#templates" },
  { label: "promo R$199", href: "#promo", highlight: true },
  { label: "sobre", href: "#sobre" },
  { label: "contato", href: "#contato" },
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
      className={`fixed top-8 sm:top-9 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 ${
        navVisible ? "nav-visible" : "nav-hidden"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3" aria-label="PixelCode Studio — início" data-cursor="hover">
          <Image src="/images/brand/icon.svg" alt="" width={32} height={32} className="rounded-lg invert" />
          <span className="font-semibold text-white text-sm tracking-tight">
            PixelCode <span className="text-white/55 font-normal">· Vinícius Ribeiro</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              data-cursor="hover"
              className={`text-sm transition-colors relative group ${
                l.highlight
                  ? "text-rose-400 font-semibold hover:text-rose-300"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <MagneticButton
          href={WA_LINK("Olá Vinícius, vim pelo site da PixelCode Studio.")}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="cta"
          data-cursor-label="WhatsApp"
          className="hidden md:inline-block px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-rose-500 hover:text-white transition-colors"
        >
          falar agora
        </MagneticButton>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white"
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm py-2 ${l.highlight ? "text-rose-400 font-semibold" : "text-white/70"}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={WA_LINK("Olá Vinícius, vim pelo site!")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 text-center px-5 py-3 rounded-full bg-rose-500 text-white text-sm font-semibold"
          >
            falar no WhatsApp
          </a>
        </div>
      )}
    </motion.nav>
  );
}
