"use client";

import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

/* ─── DATA ─── */
const projects = [
  {
    id: 1,
    number: "01",
    title: "Cerbelera & Oliveira\nAdvogados",
    subtitle: "Escritório de Advocacia",
    description:
      "Site institucional completo para escritório de advocacia em Presidente Prudente, SP.",
    challenge:
      "O escritório precisava de uma presença digital profissional que transmitisse credibilidade e facilitasse o contato com novos clientes.",
    solution:
      "Desenvolvi um site completo com 6 áreas de atuação, blog jurídico, integração com Google Reviews (4.9★), calculadora de direitos e sistema de agendamento online.",
    result:
      "Aumento significativo na captação de clientes online, com agendamentos diretos pelo site e posicionamento orgânico no Google para termos jurídicos regionais.",
    url: "https://cerbeleraeoliveiraadv.vercel.app/",
    tech: ["Next.js", "Tailwind CSS", "Cloudinary", "SEO"],
    category: "Direito",
    mockup: "/images/projects/cerbelera-mockup.png",
    desktop: "/images/projects/cerbelera-desktop.png",
    mobile: "/images/projects/cerbelera-mobile.png",
  },
  {
    id: 2,
    number: "02",
    title: "Dra. Andresa\nMartin Louzada",
    subtitle: "Ginecologista & Obstetra",
    description:
      "Site médico para ginecologista e obstetra no Espaço Humanizare, Presidente Prudente, SP.",
    challenge:
      "A Dra. Andresa precisava de um site que transmitisse acolhimento e profissionalismo, com informações sobre suas 8 especialidades e blog educativo.",
    solution:
      "Criei um site com design elegante e humanizado, blog de saúde feminina, FAQ interativo, conformidade com LGPD e agendamento direto via WhatsApp.",
    result:
      "Site com alto engajamento, pacientes encontrando facilmente informações e agendando consultas diretamente pelo WhatsApp integrado ao site.",
    url: "https://www.draandresamartin.com.br/",
    tech: ["Next.js", "Tailwind CSS", "SEO", "LGPD"],
    category: "Saúde",
    mockup: "/images/projects/andresa-mockup.png",
    desktop: "/images/projects/andresa-desktop.png",
    mobile: "/images/projects/andresa-mobile.png",
  },
  {
    id: 3,
    number: "03",
    title: "Vereador\nWellington Bozo",
    subtitle: "Site Político Institucional",
    description:
      "Plataforma política completa para vereador de Presidente Prudente, SP.",
    challenge:
      "O vereador precisava de uma plataforma que mostrasse transparência, sua trajetória política e facilitasse o contato com eleitores e denúncias de maus-tratos animais.",
    solution:
      "Desenvolvi um site com timeline interativa da trajetória, projetos de lei aprovados, hub de causa animal, sistema de denúncia premiada e integração com redes sociais.",
    result:
      "Plataforma que fortaleceu a comunicação com eleitores, facilitou denúncias de maus-tratos e aumentou a transparência do mandato.",
    url: "https://bozo-snowy.vercel.app/",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive"],
    category: "Político",
    mockup: "/images/projects/bozo-mockup.png",
    desktop: "/images/projects/bozo-desktop.png",
    mobile: "/images/projects/bozo-mobile.png",
  },
  {
    id: 4,
    number: "04",
    title: "Dra. Luciana\nJ. R. Pinho",
    subtitle: "Advogada Previdenciarista",
    description:
      "Site jurídico com foco em inclusão e neurodiversidade, Lucas do Rio Verde, MT.",
    challenge:
      "A Dra. Luciana, autista com diagnóstico tardio, precisava de um site que refletisse seu compromisso com inclusão e acessibilidade, além de servir como ferramenta de captação.",
    solution:
      "Criei um site com foco em acessibilidade, simulador INSS, integração com Google Reviews (5.0★), blog sobre direitos PCD, e destaque para atuação internacional (OAP Portugal).",
    result:
      "Site acessível que se tornou referência na região, com alto posicionamento orgânico e aumento significativo na captação de clientes previdenciários.",
    url: "https://dralucianajrpinho.vercel.app/",
    tech: ["Next.js", "Tailwind CSS", "Cloudinary", "A11y"],
    category: "Direito",
    mockup: "/images/projects/luciana-mockup.png",
    desktop: "/images/projects/luciana-desktop.png",
    mobile: "/images/projects/luciana-mobile.png",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Descoberta",
    desc: "Entendo o negócio, público-alvo, concorrentes e objetivos. Nenhum pixel é desenhado antes de entender o contexto completo.",
    icon: "🔍",
  },
  {
    num: "02",
    title: "Estratégia",
    desc: "Defino arquitetura de informação, wireframes e jornada do usuário. Cada decisão é baseada em dados e UX research.",
    icon: "📐",
  },
  {
    num: "03",
    title: "Design",
    desc: "Crio interfaces pixel-perfect com identidade visual única. Cores, tipografia e espaçamento pensados para conversão.",
    icon: "🎨",
  },
  {
    num: "04",
    title: "Código",
    desc: "Desenvolvo com Next.js, Tailwind e boas práticas. Performance, SEO técnico e acessibilidade são prioridades.",
    icon: "⚡",
  },
  {
    num: "05",
    title: "Lançamento",
    desc: "Deploy otimizado, analytics configurado, testes cross-browser. Suporte contínuo e métricas de sucesso acompanhadas.",
    icon: "🚀",
  },
];

/* ─── CUSTOM CURSOR ─── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorClass, setCursorClass] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`;
        dotRef.current.style.top = `${dotY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      requestAnimationFrame(animate);
    };

    const addHover = () => setCursorClass("cursor-hover");
    const removeHover = () => setCursorClass("");
    const addText = () => setCursorClass("cursor-text");

    document.addEventListener("mousemove", onMove);
    animate();

    const interactives = document.querySelectorAll("a, button, [role='button']");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    const headings = document.querySelectorAll("h1, h2");
    headings.forEach((el) => {
      el.addEventListener("mouseenter", addText);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      headings.forEach((el) => {
        el.removeEventListener("mouseenter", addText);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  return (
    <div className={cursorClass}>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}

/* ─── SCROLL PROGRESS ─── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

/* ─── LOADING SCREEN ─── */
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/images/brand/logo-white.svg"
          alt="PixelCode Studio"
          width={140}
          height={40}
          className="opacity-90"
        />
      </motion.div>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
    </motion.div>
  );
}

/* ─── MAGNETIC BUTTON ─── */
function MagneticButton({ children, className = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 768) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <a
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`magnetic-btn inline-block ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

/* ─── ANIMATED COUNTER ─── */
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  const numericTarget = parseInt(target.replace(/\D/g, ""));
  const hasPlus = target.includes("+");
  const isPercent = target.includes("%");

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, numericTarget]);

  return (
    <span ref={ref}>
      {count}{isPercent ? "%" : ""}{hasPlus ? "+" : ""}{suffix}
    </span>
  );
}

/* ─── 3D TILT CARD ─── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 768) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    ref.current.style.setProperty("--mouse-x", `${x * 100}%`);
    ref.current.style.setProperty("--mouse-y", `${y * 100}%`);
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };

  return (
    <div className={`tilt-card ${className}`}>
      <div ref={ref} className="tilt-card-inner" onMouseMove={handleMouse} onMouseLeave={handleLeave}>
        {children}
        <div className="tilt-shine" />
      </div>
    </div>
  );
}

/* ─── ANIMATED LINE DIVIDER ─── */
function LineDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className={`line-draw ${isInView ? "visible" : ""}`}
    />
  );
}

/* ─── SECTION REVEAL ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── SPLIT TEXT ANIMATION ─── */
function SplitText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 60, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.03,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── PROJECT CASE STUDY ─── */
function CaseStudy({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="py-20 sm:py-32"
    >
      <LineDivider />

      {/* Number + Category */}
      <div className="flex items-center justify-between mb-8 mt-12">
        <div className="flex items-center gap-4">
          <span className="number-display text-gray-100">{project.number}</span>
          <div className="flex flex-col gap-1">
            <span className="text-sm uppercase tracking-widest text-gray-400 font-medium">
              {project.category}
            </span>
            <div className="glow-dot" />
          </div>
        </div>
        <MagneticButton
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-all group"
        >
          <span className="flex items-center gap-2">
            Ver Site
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </span>
        </MagneticButton>
      </div>

      {/* Title */}
      <Reveal>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 whitespace-pre-line">
          {project.title}
        </h2>
        <p className="text-xl text-gray-500 font-light mb-12 max-w-xl">
          {project.subtitle} — {project.description}
        </p>
      </Reveal>

      {/* Preview Card — Desktop Mockup with 3D Tilt */}
      <Reveal delay={0.2}>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <TiltCard>
            <div ref={imgRef} className="relative rounded-3xl overflow-hidden bg-gray-100 max-h-[200px] sm:max-h-[280px] lg:max-h-[360px]">
              <motion.div style={{ y: imgY }}>
                <Image
                  src={project.mockup}
                  alt={`Screenshot do site ${project.title.replace("\n", " ")}`}
                  width={1440}
                  height={900}
                  className="w-full h-auto object-cover object-top transition-transform duration-700"
                  quality={90}
                  priority={index < 2}
                />
              </motion.div>
              {/* Visit overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/30 backdrop-blur-[2px]">
                <motion.span
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  className="px-8 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm shadow-xl"
                >
                  Visitar Site ↗
                </motion.span>
              </div>
            </div>
          </TiltCard>
        </a>
      </Reveal>

      {/* Mobile Preview */}
      <Reveal delay={0.25}>
        <div className="flex items-start gap-6 mt-8">
          <motion.div
            whileHover={{ y: -8, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-[180px] sm:w-[220px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex-shrink-0"
          >
            <Image
              src={project.mobile}
              alt={`Versão mobile do site ${project.title.replace("\n", " ")}`}
              width={390}
              height={844}
              className="w-full h-auto"
              quality={85}
            />
          </motion.div>
          <div className="hidden sm:block w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <Image
              src={project.desktop}
              alt={`Tela completa do site ${project.title.replace("\n", " ")}`}
              width={1440}
              height={900}
              className="w-full h-auto"
              quality={85}
            />
          </div>
        </div>
      </Reveal>

      {/* Case Details Grid */}
      <Reveal delay={0.3}>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            { label: "Desafio", text: project.challenge },
            { label: "Solução", text: project.solution },
            { label: "Resultado", text: project.result },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="group"
            >
              <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4 group-hover:text-gray-900 transition-colors">
                {item.label}
              </h4>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* Tech Tags */}
      <Reveal delay={0.4}>
        <div className="flex flex-wrap gap-3 mt-10">
          {project.tech.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              whileHover={{ scale: 1.08, y: -2 }}
              className="px-4 py-2 text-sm rounded-full border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 hover:shadow-md transition-all"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </Reveal>

      {/* Mobile CTA */}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden flex items-center justify-center gap-2 px-5 py-3 mt-8 rounded-full bg-gray-900 text-white text-sm font-medium"
      >
        Ver Site ↗
      </a>
    </motion.div>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const processRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: processScroll } = useScroll({
    target: processRef,
    offset: ["start end", "end start"],
  });
  const processX = useTransform(processScroll, [0, 1], ["10%", "-60%"]);

  /* Nav hide on scroll down, show on scroll up */
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
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Grain Texture */}
      <div className="grain" />

      <main className="bg-[#fafafa]">
        {/* ── NAV ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className={`fixed top-0 left-0 right-0 z-50 bg-[#fafafa]/80 backdrop-blur-xl border-b border-gray-100 ${
            navVisible ? "nav-visible" : "nav-hidden"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <Image
                src="/images/brand/icon.svg"
                alt="PixelCode Studio"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-gray-900 text-sm tracking-tight">
                Vinícius Ribeiro
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {["Projetos", "Processo", "Sobre", "Contato"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="text-sm text-gray-400 hover:text-gray-900 transition-colors relative group"
                >
                  {l}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-900 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <MagneticButton
              href="#contato"
              className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Contato
            </MagneticButton>
          </div>
        </motion.nav>

        {/* ── HERO ── */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={!loading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              <span className="text-sm uppercase tracking-[0.3em] text-gray-400 font-medium inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gray-300" />
                PixelCode Studio
                <span className="w-8 h-[1px] bg-gray-300" />
              </span>
            </motion.div>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-[8rem] font-bold leading-[0.9] tracking-tight mt-6 mb-8">
              {!loading && (
                <>
                  <SplitText text="Design que" delay={2.5} />
                  <br />
                  <SplitText text="transforma" className="gradient-text" delay={2.8} />
                </>
              )}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={!loading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 3.2 }}
              className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-10 font-light"
            >
              Crio sites profissionais que combinam estética impecável com
              performance técnica. Cada projeto é um case de sucesso.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={!loading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 3.4 }}
              className="flex justify-center gap-4"
            >
              <MagneticButton
                href="#projetos"
                className="px-8 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                Ver Projetos
              </MagneticButton>
              <MagneticButton
                href="#contato"
                className="px-8 py-4 rounded-full border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all"
              >
                Contato
              </MagneticButton>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={!loading ? { opacity: 1 } : {}}
              transition={{ delay: 4 }}
              className="mt-20"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-gray-300 text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-gray-300 to-transparent" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── DOUBLE MARQUEE ── */}
        <div className="border-t border-b border-gray-200 py-3 overflow-hidden space-y-2">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="flex items-center">
                {["Web Design", "Frontend", "UI/UX", "Next.js", "React", "SEO", "Responsive", "Tailwind CSS"].map((t, j) => (
                  <span key={j} className="flex items-center">
                    <span className="text-sm font-medium text-gray-400 mx-8">{t}</span>
                    <span className="glow-dot" />
                  </span>
                ))}
              </span>
            ))}
          </div>
          <div className="animate-marquee-reverse flex whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="flex items-center">
                {["Performance", "TypeScript", "Figma", "Vercel", "Node.js", "Git", "Acessibilidade", "LGPD"].map((t, j) => (
                  <span key={j} className="flex items-center">
                    <span className="text-xs text-gray-300 mx-8 uppercase tracking-widest">{t}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── PROJECTS ── */}
        <section id="projetos" className="max-w-7xl mx-auto px-6">
          {projects.map((p, i) => (
            <CaseStudy key={p.id} project={p} index={i} />
          ))}
        </section>

        {/* ── PROCESS (Horizontal Scroll) ── */}
        <section id="processo" ref={processRef} className="py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <Reveal>
              <span className="text-sm uppercase tracking-widest text-gray-400 font-medium inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gray-300" />
                Como funciona
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold mt-4 leading-tight">
                Meu processo<span className="text-gray-300">.</span>
              </h2>
            </Reveal>
          </div>

          <motion.div style={{ x: processX }} className="flex gap-8 pl-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="process-card bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-xl min-w-[320px] sm:min-w-[380px]"
              >
                <span className="process-number">{step.num}</span>
                <div className="text-3xl mt-4 mb-3">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── ABOUT ── */}
        <section id="sobre" className="py-32 px-6 bg-gray-900 text-white relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />

          <div className="max-w-7xl mx-auto relative">
            <Reveal>
              <div className="grid lg:grid-cols-2 gap-20">
                <div>
                  <span className="text-sm uppercase tracking-widest text-gray-500 font-medium inline-flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-gray-600" />
                    Sobre
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 leading-tight">
                    Vinícius
                    <br />
                    Ribeiro
                  </h2>
                </div>
                <div className="space-y-6 flex flex-col justify-center">
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Sou web designer e desenvolvedor frontend à frente da{" "}
                    <span className="text-white font-medium">PixelCode Studio</span>.
                    Crio experiências digitais que unem estética e funcionalidade.
                  </p>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Meus clientes incluem escritórios de advocacia, clínicas médicas e
                    políticos — todos com necessidades únicas que transformo em sites
                    profissionais, otimizados para SEO e focados em conversão.
                  </p>
                  <div className="flex gap-8 pt-6">
                    {[
                      { n: "4+", l: "Projetos" },
                      { n: "100%", l: "Satisfação" },
                      { n: "3+", l: "Anos Exp." },
                    ].map((s) => (
                      <div key={s.l}>
                        <div className="text-3xl font-bold font-display">
                          <AnimatedCounter target={s.n} />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contato" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto text-center">
            <Reveal>
              <span className="text-sm uppercase tracking-widest text-gray-400 font-medium inline-flex items-center gap-3 justify-center">
                <span className="w-8 h-[1px] bg-gray-300" />
                Contato
                <span className="w-8 h-[1px] bg-gray-300" />
              </span>
              <h2 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold mt-4 mb-6 leading-[0.95]">
                Vamos
                <br />
                <span className="gradient-text">conversar?</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-xl mx-auto mb-12 font-light">
                Tem um projeto em mente? Vamos transformá-lo em realidade.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <MagneticButton
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors text-lg inline-flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </MagneticButton>
                <MagneticButton
                  href="mailto:contato@pixelcodestudio.com"
                  className="px-10 py-4 rounded-full border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-all text-lg inline-flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  Email
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-gray-200 py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              © 2026 Vinícius Ribeiro —{" "}
              <Image src="/images/brand/logo.svg" alt="PixelCode Studio" width={80} height={20} className="opacity-40 inline" />
            </span>
            <div className="flex gap-6">
              {[
                { label: "GitHub", href: "https://github.com/VNCRIBEIRO1" },
                { label: "Instagram", href: "https://instagram.com/" },
                { label: "LinkedIn", href: "https://linkedin.com/" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-gray-900 transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-900 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
