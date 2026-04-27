export type Project = {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  url: string;
  tech: string[];
  category: string;
  mockup: string;
  desktop: string;
  mobile: string;
};

export const projects: Project[] = [
  {
    id: 1,
    number: "01",
    title: "Cerbelera & Oliveira\nAdvogados",
    subtitle: "Escritório de Advocacia",
    description: "Site institucional completo para escritório em Presidente Prudente, SP.",
    challenge:
      "O escritório precisava de uma presença digital profissional que transmitisse credibilidade e facilitasse o contato com novos clientes.",
    solution:
      "Site com 6 áreas de atuação, blog jurídico, integração com Google Reviews (4.9★), calculadora de direitos e agendamento online.",
    result:
      "Aumento expressivo na captação online, com agendamentos diretos e posicionamento orgânico no Google para termos jurídicos regionais.",
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
    description: "Site médico para o Espaço Humanizare, Presidente Prudente, SP.",
    challenge:
      "A Dra. Andresa precisava de um site que transmitisse acolhimento e profissionalismo, com informações sobre suas 8 especialidades.",
    solution:
      "Design elegante e humanizado, blog de saúde feminina, FAQ interativo, conformidade com LGPD e agendamento direto via WhatsApp.",
    result:
      "Site com alto engajamento, pacientes encontrando informações e agendando consultas pelo WhatsApp integrado.",
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
    description: "Plataforma política completa para vereador de Presidente Prudente, SP.",
    challenge:
      "Mostrar transparência, trajetória política e facilitar contato com eleitores e denúncias de maus-tratos animais.",
    solution:
      "Timeline interativa, projetos de lei aprovados, hub de causa animal, sistema de denúncia premiada e integração com redes sociais.",
    result:
      "Plataforma que fortaleceu a comunicação com eleitores, facilitou denúncias e aumentou a transparência do mandato.",
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
    description: "Site jurídico com foco em inclusão e neurodiversidade, Lucas do Rio Verde, MT.",
    challenge:
      "A Dra. Luciana, autista com diagnóstico tardio, precisava de um site que refletisse seu compromisso com inclusão e acessibilidade.",
    solution:
      "Foco em acessibilidade, simulador INSS, integração com Google Reviews (5.0★), blog sobre direitos PCD e atuação internacional (OAP Portugal).",
    result:
      "Site acessível que se tornou referência na região, com alto posicionamento orgânico e captação previdenciária crescente.",
    url: "https://dralucianajrpinho.vercel.app/",
    tech: ["Next.js", "Tailwind CSS", "Cloudinary", "A11y"],
    category: "Direito",
    mockup: "/images/projects/luciana-mockup.png",
    desktop: "/images/projects/luciana-desktop.png",
    mobile: "/images/projects/luciana-mobile.png",
  },
  {
    id: 5,
    number: "05",
    title: "Lucas Mangolin\nAdvocacia Patrimonial",
    subtitle: "Advogado Patrimonialista",
    description: "Site institucional com chatbot decisório para advocacia de proteção e estruturação patrimonial.",
    challenge:
      "Apresentar serviços de planejamento patrimonial de forma clara, transmitir autoridade e captar leads qualificados de alto ticket.",
    solution:
      "Single-page com CSS-only backgrounds, preloader, counter animado, chatbot decisório com typing indicator, scroll reveal e Schema.org completo.",
    result:
      "Performance Lighthouse 95+, SEO técnico impecável e fluxo de triagem que qualifica leads antes do primeiro contato humano.",
    url: "https://lucasmangolin.vercel.app/",
    tech: ["HTML5", "CSS3", "JS Vanilla", "Schema.org"],
    category: "Direito",
    mockup: "https://image.thum.io/get/width/1200/crop/750/noanimate/https://lucasmangolin.vercel.app/",
    desktop: "https://image.thum.io/get/width/1600/crop/1000/noanimate/https://lucasmangolin.vercel.app/",
    mobile: "https://image.thum.io/get/width/420/crop/900/viewportWidth/420/noanimate/https://lucasmangolin.vercel.app/",
  },
];

export const processSteps = [
  { num: "01", title: "Descoberta", desc: "Entendo negócio, público, concorrentes e objetivos. Nada é desenhado antes de entender o contexto.", slug: "discovery" },
  { num: "02", title: "Estratégia", desc: "Arquitetura de informação, wireframes e jornada do usuário, baseados em dados e UX research.", slug: "strategy" },
  { num: "03", title: "Design", desc: "Interfaces pixel-perfect com identidade própria. Cores, tipografia e espaçamento pensados para conversão.", slug: "design" },
  { num: "04", title: "Código", desc: "Next.js, Tailwind e boas práticas. Performance, SEO técnico e acessibilidade são prioridades.", slug: "code" },
  { num: "05", title: "Lançamento", desc: "Deploy otimizado, analytics, testes cross-browser. Suporte contínuo e métricas de sucesso.", slug: "launch" },
];
