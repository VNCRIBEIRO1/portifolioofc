"use client";

import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { templates, templateUrl, type TemplateCategory } from "./data/templates";

/* ─── COMPANY CONSTANTS ─── */
const WHATSAPP = "5518996311933";
const WA_LINK = (text: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const CNPJ_FMT = "66.257.657/0001-47";
const PROMO_DEADLINE_ISO = "2026-04-29T23:59:00-03:00";
const PROMO_PRICE = 199;
const PROMO_PRICE_FROM = 500;

/* ─── SERVICES ─── */
const services = [
  {
    title: "Websites Profissionais",
    description: "Sites institucionais rápidos, otimizados para SEO e 100% responsivos. Perfeitos para escritórios, clínicas e empresas que querem credibilidade.",
    bullets: ["SEO técnico", "Mobile-first", "LGPD pronto", "Performance > 90"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18" /><path d="M9 22h6" /><path d="M12 18v4" />
      </svg>
    ),
  },
  {
    title: "Landing Pages de Alta Conversão",
    description: "Páginas focadas em capturar leads e vender. Copy persuasivo, animações suaves e formulário direto no WhatsApp.",
    bullets: ["Copy persuasivo", "Pixel/GA pronto", "Form WhatsApp", "A/B test ready"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "Automações & Bots",
    description: "Integrações WhatsApp, e-mail, Sheets e APIs que tiram tarefas repetitivas das suas mãos e aumentam a produtividade da equipe.",
    bullets: ["WhatsApp Business", "Sheets/Notion", "Webhooks", "n8n / Make"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    title: "Sistemas & CRM Personalizados",
    description: "Plataformas web sob medida para gestão de clientes, agendamentos, financeiro e relatórios. Sem amarras de plataformas prontas.",
    bullets: ["Painel admin", "Login multi-usuário", "Relatórios", "API REST"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "Chatbots Inteligentes com IA",
    description: "Atendimento 24/7 integrado ao site e ao WhatsApp, com triagem automática de leads e respostas baseadas no seu negócio.",
    bullets: ["Triagem 24/7", "Integra WhatsApp", "Treinado no seu negócio", "Painel de leads"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><circle cx="9" cy="10" r="1" /><circle cx="15" cy="10" r="1" />
      </svg>
    ),
  },
  {
    title: "Identidade Visual & Logo",
    description: "Logos, paleta de cores e branding para quem está começando ou quer rebrandar. Entregamos arquivos prontos para web e impressão.",
    bullets: ["Logo vetorial", "Paleta + tipografia", "Manual da marca", "Mockups"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="19" cy="13" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="10" cy="19" r="2.5" /><path d="M12 2a10 10 0 1 0 10 10" />
      </svg>
    ),
  },
];

const promoBenefits = [
  { icon: "🎯", title: "Site 100% personalizado", desc: "Não usamos templates engessados — cada projeto recebe identidade própria." },
  { icon: "💬", title: "Chatbot integrado", desc: "Triagem inicial 24/7 que filtra e qualifica novos clientes pelo WhatsApp." },
  { icon: "🔍", title: "Otimização SEO completa", desc: "Google + Maps. Para aparecer quando o cliente procurar advogado na sua cidade." },
  { icon: "🎨", title: "Logo grátis", desc: "Não tem logotipo? A gente cria, sem custo extra." },
  { icon: "🤖", title: "Tratamento de fotos com I.A.", desc: "Suas fotos de perfil e do escritório ficam profissionais." },
  { icon: "♾️", title: "Hospedagem vitalícia grátis", desc: "Sem mensalidade. Pagamento único, hospedagem por nossa conta." },
  { icon: "🛠️", title: "30 dias de ajustes", desc: "Após a entrega, 30 dias de modificações ilimitadas para deixar do seu jeito." },
  { icon: "⚖️", title: "100% Provimento OAB 205/2021", desc: "Conformidade total com as regras de publicidade da advocacia." },
];

const promoFAQ = [
  { q: "Por que tão barato?", a: "Promoção de fim de mês com vagas limitadas. É a forma que encontramos de fechar abril com novos parceiros e abrir nossa agenda de maio." },
  { q: "Qual é o prazo de entrega?", a: "Entre 5 e 10 dias úteis a partir do envio do material (foto, OAB, áreas de atuação)." },
  { q: "O que preciso enviar?", a: "Áreas de atuação, número OAB, foto de perfil e do escritório. Currículo Lattes e graduações são opcionais e ajudam a enriquecer o site." },
  { q: "Tem mensalidade depois?", a: "Não. Hospedagem é vitalícia gratuita. Você só paga uma vez: R$ 199." },
  { q: "E se eu quiser mexer depois?", a: "Você tem 30 dias de ajustes ilimitados após a entrega. Depois disso, ajustes pontuais são cobrados sob demanda." },
  { q: "Atende a OAB?", a: "Sim. Todos os textos seguem o Provimento 205/2021 da OAB e a LGPD." },
];


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



/* ─── SCROLL PROGRESS ─── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

/* ─── LOADING SCREEN ─── */
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(onComplete, 2400);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 100));
    }, 200);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* AI-generated background */}
      <div
        className="loading-bg"
        style={{ backgroundImage: "url(/images/loading-bg.png)" }}
      />

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
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
          <span className="loading-text">
            {Math.round(progress)}%
          </span>
        </motion.div>
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

/* ─── COUNTDOWN ─── */
function useCountdown(deadlineISO: string) {
  const target = useMemo(() => new Date(deadlineISO).getTime(), [deadlineISO]);
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, expired: diff === 0 };
}

/* ─── PROMO TOP BAR ─── */
function PromoTopBar() {
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
function FloatingWhatsApp() {
  return (
    <a
      href={WA_LINK("Olá Vinícius, vim pelo site da PixelCode Studio e gostaria de mais informações.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-[55] flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 transition-all hover:scale-105"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
    </a>
  );
}

/* ─── PROMO POPUP ─── */
function PromoPopup() {
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
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pcs_promo_dismissed", "1");
    }
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

/* ─── SERVICES SECTION ─── */
function ServicesSection() {
  return (
    <section id="servicos" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <span className="text-sm uppercase tracking-widest text-gray-400 font-medium inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-gray-300" />
            Serviços
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold mt-4 leading-tight">
            O que entregamos<span className="text-gray-300">.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mt-6 font-light">
            Soluções digitais sob medida para o seu negócio crescer — do site ao
            sistema interno, passando por automação e identidade visual.
          </p>
        </Reveal>

        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {services.map((svc, i) => (
            <motion.li
              key={svc.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl p-7 border border-gray-100 hover:border-gray-900 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="w-6 h-6 block">{svc.icon}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{svc.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{svc.description}</p>
              <ul className="flex flex-wrap gap-2 mb-5">
                {svc.bullets.map((b) => (
                  <li key={b} className="text-[11px] uppercase tracking-wider text-gray-400 border border-gray-200 rounded-full px-2.5 py-1">
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={WA_LINK(`Olá Vinícius! Quero saber mais sobre: ${svc.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all"
              >
                Falar sobre este serviço
                <span aria-hidden="true">→</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── PROMO FEATURED SECTION ─── */
function PromoSection() {
  const { d, h, m, s, expired } = useCountdown(PROMO_DEADLINE_ISO);
  return (
    <section
      id="promo"
      className="relative py-24 sm:py-32 px-6 bg-gradient-to-br from-gray-900 via-gray-900 to-rose-950 text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(244,63,94,0.6) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(245,158,11,0.5) 0, transparent 40%)",
        }}
      />
      <div className="max-w-7xl mx-auto relative">
        <Reveal>
          <span className="text-sm uppercase tracking-[0.3em] text-rose-300 font-medium inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-rose-400/60" />
            Oferta de fim de mês · Válida até 29/04
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold mt-4 leading-[1.05]">
            Landing page <span className="text-rose-300">+ Chatbot</span>
            <br />
            para advocacia por{" "}
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
              R$ {PROMO_PRICE}
            </span>
            <span className="text-gray-500">.</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mt-6 max-w-3xl font-light leading-relaxed">
            Site profissional 100% personalizado, com chatbot de triagem,
            otimização SEO completa, hospedagem vitalícia gratuita e 30 dias
            de ajustes ilimitados. <s className="text-gray-500">De R$ {PROMO_PRICE_FROM}</s>{" "}
            por <strong className="text-white">R$ {PROMO_PRICE} · pagamento único</strong>.
          </p>
        </Reveal>

        {/* Countdown */}
        {!expired && (
          <Reveal delay={0.15}>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mt-10">
              {[
                { v: d, l: "Dias" },
                { v: h, l: "Horas" },
                { v: m, l: "Min" },
                { v: s, l: "Seg" },
              ].map((x) => (
                <div key={x.l} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-display text-3xl sm:text-5xl font-extrabold tabular-nums text-white">
                    {String(x.v).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 mt-1">
                    {x.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Benefits */}
        <Reveal delay={0.25}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
            {promoBenefits.map((b) => (
              <div key={b.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="text-2xl mb-2" aria-hidden="true">{b.icon}</div>
                <h3 className="font-semibold text-white mb-1 text-sm">{b.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={0.35}>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <a
              href={WA_LINK(
                `Olá Vinícius! Sou advogado(a) e quero garantir a promo de R$ ${PROMO_PRICE} (site + chatbot) antes do fim do mês.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-center transition-colors shadow-lg shadow-emerald-500/20"
            >
              Quero garantir minha vaga →
            </a>
            <a
              href="#promo-faq"
              className="px-8 py-4 rounded-full border border-white/30 text-white font-medium text-center hover:bg-white/10 transition-colors"
            >
              Tirar dúvidas
            </a>
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal delay={0.45}>
          <div id="promo-faq" className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-28">
            {promoFAQ.map((f) => (
              <details key={f.q} className="group bg-white/5 border border-white/10 rounded-2xl p-5 open:bg-white/10 transition-colors">
                <summary className="cursor-pointer font-semibold text-white flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-rose-300 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-gray-300 text-sm mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>

        <p className="text-xs text-gray-500 mt-10 max-w-3xl">
          *Promoção limitada às vagas disponíveis em abril, válida apenas para
          contratos fechados até 29/04/2026 às 23h59. Conformidade total com o
          Provimento 205/2021 da OAB e LGPD.
        </p>
      </div>
    </section>
  );
}

/* ─── TEMPLATES VITRINE ─── */
function TemplatesSection() {
  const cats: ("Todos" | TemplateCategory)[] = ["Todos", "Clássico", "Moderno", "Saúde", "Psicologia"];
  const [filter, setFilter] = useState<(typeof cats)[number]>("Todos");
  const list = filter === "Todos" ? templates.slice(0, 9) : templates.filter((t) => t.category === filter).slice(0, 9);

  return (
    <section id="templates" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <span className="text-sm uppercase tracking-widest text-gray-400 font-medium inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-gray-300" />
            Templates prontos
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-4">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Inspire-se em 25 templates<span className="text-gray-300">.</span>
            </h2>
            <a
              href={templateUrl("")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all"
            >
              Ver todos os 25 templates ↗
            </a>
          </div>
          <p className="text-lg text-gray-500 max-w-2xl mt-6 font-light">
            Galeria de modelos para advocacia, saúde e psicologia. Use como
            referência ou peça personalizado para o seu nicho.
          </p>
        </Reveal>

        <div className="flex flex-wrap gap-2 mt-10">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === c
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              aria-pressed={filter === c}
            >
              {c}
            </button>
          ))}
        </div>

        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {list.map((t, i) => (
            <motion.li
              key={t.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl hover:border-gray-300 transition-all flex flex-col"
            >
              <a
                href={templateUrl(t.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden"
              >
                <iframe
                  src={templateUrl(t.slug)}
                  loading="lazy"
                  title={t.name}
                  className="absolute inset-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                  sandbox="allow-same-origin"
                />
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-white/90 backdrop-blur text-gray-700 px-2.5 py-1 rounded-full font-semibold">
                  {t.category}
                </span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[1px] transition-opacity">
                  <span className="px-5 py-2 rounded-full bg-white text-gray-900 font-semibold text-xs shadow">
                    Ver demo ↗
                  </span>
                </span>
              </a>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="font-display text-lg font-bold text-gray-900 leading-tight">{t.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{t.description}</p>
                <div className="flex gap-2 mt-2">
                  <a
                    href={templateUrl(t.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
                  >
                    Ver demo
                  </a>
                  <a
                    href={WA_LINK(`Olá Vinícius! Quero o template "${t.name}" personalizado para o meu negócio.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Quero este
                  </a>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
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

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Promo Top Bar */}
      <PromoTopBar />

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />

      {/* Promo Popup */}
      <PromoPopup />

      {/* Grain Texture */}
      <div className="grain" />

      <main className="bg-[#fafafa]">
        {/* ── NAV ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className={`fixed top-8 sm:top-9 left-0 right-0 z-50 bg-[#fafafa]/80 backdrop-blur-xl border-b border-gray-100 ${
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

            <div className="hidden md:flex items-center gap-6">
              {[
                { label: "Serviços", href: "#servicos" },
                { label: "Templates", href: "#templates" },
                { label: "Projetos", href: "#projetos" },
                { label: "Promo R$199", href: "#promo", highlight: true },
                { label: "Contato", href: "#contato" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className={`text-sm transition-colors relative group ${
                    l.highlight
                      ? "text-rose-600 font-semibold hover:text-rose-700"
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-900 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <MagneticButton
              href={WA_LINK("Olá Vinícius, vim pelo site da PixelCode Studio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Falar agora
            </MagneticButton>
          </div>
        </motion.nav>

        {/* ── HERO ── */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden relative">
          {/* AI-generated abstract background */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <Image
              src="/images/hero-abstract.png"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-5xl relative z-10">
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

        {/* ── SERVICES ── */}
        <ServicesSection />

        {/* ── PROMO ADVOCACIA R$199 ── */}
        <PromoSection />

        {/* ── PROJECTS ── */}
        <section id="projetos" className="max-w-7xl mx-auto px-6">
          {projects.map((p, i) => (
            <CaseStudy key={p.id} project={p} index={i} />
          ))}
        </section>

        {/* ── TEMPLATES ── */}
        <TemplatesSection />

        {/* ── PROCESS ── */}
        <section id="processo" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <span className="text-sm uppercase tracking-widest text-gray-400 font-medium inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gray-300" />
                Como funciona
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold mt-4 leading-tight">
                Meu processo<span className="text-gray-300">.</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-16">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="process-card bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <span className="process-number">{step.num}</span>
                  <div className="relative w-14 h-14 mt-4 mb-3">
                    <Image
                      src={`/images/process/${["discovery", "strategy", "design", "code", "launch"][i]}.png`}
                      alt={step.title}
                      width={56}
                      height={56}
                      className="rounded-xl"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
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
                  <div className="mt-8 rounded-2xl overflow-hidden opacity-80">
                    <Image
                      src="/images/workspace.png"
                      alt="Workspace PixelCode Studio"
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover rounded-2xl"
                      quality={85}
                    />
                  </div>
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
        <section id="contato" className="py-32 px-6 relative overflow-hidden">
          {/* AI-generated geometric pattern */}
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
            <Image
              src="/images/pattern-contact.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
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
                  href={WA_LINK("Olá Vinícius, vim pelo site da PixelCode Studio e quero conversar sobre um projeto.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors text-lg inline-flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </MagneticButton>
                <MagneticButton
                  href="mailto:contato@pixelcodestudio.com.br"
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
        <footer className="border-t border-gray-200 py-10 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3 items-start">
            <div className="flex flex-col gap-3">
              <Image src="/images/brand/logo.svg" alt="PixelCode Studio" width={120} height={32} className="opacity-80" />
              <p className="text-sm text-gray-500 leading-relaxed">
                PixelCode Studio LTDA — Sites, landing pages, automações e CRMs sob medida para quem quer crescer online.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                CNPJ {CNPJ_FMT}<br />
                Vinícius Ribeiro · Fundador<br />
                WhatsApp: <a href={WA_LINK("Olá, vim pelo site!")} className="underline hover:text-gray-900">+55 (18) 99631-1933</a>
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Navegar</span>
              {[
                { label: "Serviços", href: "#servicos" },
                { label: "Promo Advocacia R$ 199", href: "#promo" },
                { label: "Templates", href: "#templates" },
                { label: "Projetos", href: "#projetos" },
                { label: "Contato", href: "#contato" },
              ].map((l) => (
                <a key={l.label} href={l.href} className="text-gray-500 hover:text-gray-900 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Redes</span>
              {[
                { label: "GitHub", href: "https://github.com/VNCRIBEIRO1" },
                { label: "Instagram", href: "https://instagram.com/" },
                { label: "LinkedIn", href: "https://linkedin.com/" },
                { label: "WhatsApp", href: WA_LINK("Olá, vim pelo site!") },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
            © 2026 PixelCode Studio LTDA. Todos os direitos reservados.
          </div>
        </footer>
      </main>
    </>
  );
}
