"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FloatingWhatsApp, LoadingScreen, PromoPopup, PromoTopBar } from "./components/overlays";
import { ScrollProgress } from "./components/primitives";
import { About } from "./components/sections/About";
import { FinalCTA } from "./components/sections/FinalCTA";
import { Footer } from "./components/sections/Footer";
import { Hero } from "./components/sections/Hero";
import { Marquee } from "./components/sections/Marquee";
import { Nav } from "./components/sections/Nav";
import { PromoSection } from "./components/sections/Promo";
import { ServicesSection } from "./components/sections/Services";
import { Showcase } from "./components/sections/Showcase";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = loading ? "hidden" : "";
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-[var(--bg)] grain">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <ScrollProgress />
      <PromoTopBar />
      <FloatingWhatsApp />
      <PromoPopup />
      <Nav />

      <main>
        <Hero loading={loading} />
        <Marquee />
        <ServicesSection />
        <PromoSection />
        <Showcase />
        <About />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
