"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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

/* ─── PROJECT CASE STUDY ─── */
function CaseStudy({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      {/* Number + Category */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="number-display text-gray-100">{project.number}</span>
          <span className="text-sm uppercase tracking-widest text-gray-400 font-medium">
            {project.category}
          </span>
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-all group"
        >
          Ver Site
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
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

      {/* Preview Card — Desktop Mockup */}
      <Reveal delay={0.2}>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 case-card max-h-[200px] sm:max-h-[280px] lg:max-h-[360px]">
            <Image
              src={project.mockup}
              alt={`Screenshot do site ${project.title.replace("\n", " ")}`}
              width={1440}
              height={900}
              className="w-full h-auto object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
              quality={90}
              priority={index < 2}
            />
            {/* Visit overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/30 backdrop-blur-[2px]">
              <span className="px-8 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm shadow-xl">
                Visitar Site ↗
              </span>
            </div>
          </div>
        </a>
      </Reveal>

      {/* Mobile Preview */}
      <Reveal delay={0.25}>
        <div className="flex items-start gap-6 mt-8">
          <div className="w-[180px] sm:w-[220px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex-shrink-0">
            <Image
              src={project.mobile}
              alt={`Versão mobile do site ${project.title.replace("\n", " ")}`}
              width={390}
              height={844}
              className="w-full h-auto"
              quality={85}
            />
          </div>
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
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">
              Desafio
            </h4>
            <p className="text-gray-600 leading-relaxed">{project.challenge}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">
              Solução
            </h4>
            <p className="text-gray-600 leading-relaxed">{project.solution}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">
              Resultado
            </h4>
            <p className="text-gray-600 leading-relaxed">{project.result}</p>
          </div>
        </div>
      </Reveal>

      {/* Tech Tags */}
      <Reveal delay={0.4}>
        <div className="flex flex-wrap gap-3 mt-10">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-4 py-2 text-sm rounded-full border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all"
            >
              {t}
            </span>
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
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  return (
    <main className="bg-[#fafafa]">
      {/* ── NAV ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa]/80 backdrop-blur-xl border-b border-gray-100"
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
            {["Projetos", "Sobre", "Contato"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
                {l}
              </a>
            ))}
          </div>

          <a
            href="#contato"
            className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Contato
          </a>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <motion.div style={{ y }} className="text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm uppercase tracking-[0.3em] text-gray-400 font-medium">
              PixelCode Studio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl lg:text-[8rem] font-bold leading-[0.9] tracking-tight mt-6 mb-8"
          >
            Design que
            <br />
            <span className="text-gray-300">transforma</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-10 font-light"
          >
            Crio sites profissionais que combinam estética impecável com
            performance técnica. Cada projeto é um case de sucesso.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <a
              href="#projetos"
              className="px-8 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Ver Projetos
            </a>
            <a
              href="#contato"
              className="px-8 py-4 rounded-full border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all"
            >
              Contato
            </a>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-gray-300 text-sm"
            >
              ↓ Scroll para explorar
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-t border-b border-gray-200 py-4 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center">
              {["Web Design", "Frontend", "UI/UX", "Next.js", "React", "SEO", "Responsive", "Tailwind CSS"].map((t, j) => (
                <span key={j} className="flex items-center">
                  <span className="text-sm font-medium text-gray-400 mx-8">{t}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
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

      {/* ── ABOUT ── */}
      <section id="sobre" className="py-32 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <span className="text-sm uppercase tracking-widest text-gray-500 font-medium">
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
                <div className="flex gap-8 pt-4">
                  {[
                    { n: "4+", l: "Projetos" },
                    { n: "100%", l: "Satisfação" },
                    { n: "3+", l: "Anos Exp." },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="text-3xl font-bold">{s.n}</div>
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
      <section id="contato" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <span className="text-sm uppercase tracking-widest text-gray-400 font-medium">
              Contato
            </span>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold mt-4 mb-6 leading-[0.95]">
              Vamos
              <br />
              <span className="text-gray-300">conversar?</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-12 font-light">
              Tem um projeto em mente? Vamos transformá-lo em realidade.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors text-lg"
              >
                WhatsApp
              </a>
              <a
                href="mailto:contato@pixelcodestudio.com"
                className="px-10 py-4 rounded-full border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-all text-lg"
              >
                Email
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-400">
            © 2026 Vinícius Ribeiro — PixelCode Studio
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
                className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
