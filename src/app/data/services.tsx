import type { ReactNode } from "react";

export type Service = {
  title: string;
  description: string;
  bullets: string[];
  icon: ReactNode;
};

const stroke = "1.5";

export const services: Service[] = [
  {
    title: "Websites Profissionais",
    description:
      "Sites institucionais rápidos, otimizados para SEO e 100% responsivos. Ideais para escritórios, clínicas e empresas que precisam de credibilidade online.",
    bullets: ["SEO técnico", "Mobile-first", "LGPD pronto", "Lighthouse 90+"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18" /><path d="M9 22h6" /><path d="M12 18v4" />
      </svg>
    ),
  },
  {
    title: "Landing Pages que vendem",
    description:
      "Páginas focadas em capturar leads e converter. Copy persuasivo, animações suaves e formulário direto no WhatsApp.",
    bullets: ["Copy persuasivo", "Pixel + GA4", "Form WhatsApp", "A/B test ready"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "Automações & Bots",
    description:
      "Integrações WhatsApp, e-mail, Sheets e APIs que tiram tarefas repetitivas das suas mãos e aumentam a produtividade.",
    bullets: ["WhatsApp Business", "Sheets / Notion", "Webhooks", "n8n / Make"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    title: "Sistemas & CRM sob medida",
    description:
      "Plataformas web personalizadas para gestão de clientes, agendamentos, financeiro e relatórios — sem amarras de plataformas prontas.",
    bullets: ["Painel admin", "Multi-usuário", "Relatórios", "API REST"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "Chatbots com IA",
    description:
      "Atendimento 24/7 integrado ao site e WhatsApp, com triagem automática de leads e respostas treinadas no seu negócio.",
    bullets: ["Triagem 24/7", "WhatsApp", "Treinado no seu negócio", "Painel de leads"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><circle cx="9" cy="10" r="1" /><circle cx="15" cy="10" r="1" />
      </svg>
    ),
  },
  {
    title: "Identidade Visual & Logo",
    description:
      "Logos, paleta e branding para quem está começando ou rebrandando. Entrega em vetor + arquivos prontos para web e impressão.",
    bullets: ["Logo vetorial", "Paleta + tipografia", "Manual da marca", "Mockups"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="19" cy="13" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="10" cy="19" r="2.5" /><path d="M12 2a10 10 0 1 0 10 10" />
      </svg>
    ),
  },
];

export const promoBenefits = [
  { icon: "🎯", title: "Site 100% personalizado", desc: "Sem templates engessados — cada projeto recebe identidade própria." },
  { icon: "💬", title: "Chatbot integrado", desc: "Triagem 24/7 que filtra e qualifica novos clientes pelo WhatsApp." },
  { icon: "🔍", title: "SEO Google + Maps", desc: "Para aparecer quando o cliente procurar advogado na sua cidade." },
  { icon: "🎨", title: "Logo grátis", desc: "Não tem logotipo? A gente cria, sem custo extra." },
  { icon: "🤖", title: "Fotos tratadas com IA", desc: "Suas fotos de perfil e do escritório ficam profissionais." },
  { icon: "♾️", title: "Hospedagem vitalícia", desc: "Sem mensalidade. Pagamento único, hospedagem por nossa conta." },
  { icon: "🛠️", title: "30 dias de ajustes", desc: "Modificações ilimitadas após a entrega para deixar do seu jeito." },
  { icon: "⚖️", title: "OAB 205/2021", desc: "Conformidade total com as regras de publicidade da advocacia." },
];

export const promoFAQ = [
  { q: "Por que tão barato?", a: "Promoção de fim de mês com vagas limitadas. É a forma que encontramos de fechar abril com novos parceiros e abrir nossa agenda de maio." },
  { q: "Qual é o prazo de entrega?", a: "Entre 5 e 10 dias úteis a partir do envio do material (foto, OAB, áreas de atuação)." },
  { q: "O que preciso enviar?", a: "Áreas de atuação, número OAB, foto de perfil e do escritório. Currículo Lattes e graduações são opcionais e ajudam a enriquecer o site." },
  { q: "Tem mensalidade depois?", a: "Não. Hospedagem é vitalícia gratuita. Você paga uma única vez: R$ 199." },
  { q: "E se eu quiser mexer depois?", a: "Você tem 30 dias de ajustes ilimitados após a entrega. Depois disso, ajustes pontuais são cobrados sob demanda." },
  { q: "Atende à OAB?", a: "Sim. Todos os textos seguem o Provimento 205/2021 da OAB e a LGPD." },
];
