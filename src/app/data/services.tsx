import type { ReactNode } from "react";

export type Service = {
  key: "site" | "landing" | "automation" | "crm" | "chatbot" | "branding";
  prefix: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  featured?: boolean;
  badge?: string;
  icon: ReactNode;
};

const stroke = "1.5";

export const services: Service[] = [
  {
    key: "site",
    prefix: "/01",
    title: "site institucional",
    tagline: "presença que sustenta credibilidade.",
    description:
      "Não é vitrine. É a primeira impressão que fecha contrato — arquitetura de informação enxuta, performance Lighthouse 90+ e SEO técnico que coloca seu nome onde o cliente procura.",
    bullets: ["arquitetura editorial", "mobile-first real", "SEO técnico", "LGPD pronto"],
    featured: true,
    badge: "MAIS PEDIDO",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18" /><path d="M9 22h6" /><path d="M12 18v4" />
      </svg>
    ),
  },
  {
    key: "landing",
    prefix: "/02",
    title: "landing page",
    tagline: "uma página, um objetivo: converter.",
    description:
      "Copy persuasivo, hierarquia visual decidida no milímetro e formulário direto no WhatsApp. Pronta para Google Ads, Meta e qualquer mídia paga sem desperdício de verba.",
    bullets: ["copy de conversão", "Pixel + GA4", "form WhatsApp", "A/B test ready"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    key: "chatbot",
    prefix: "/03",
    title: "chatbot com IA",
    tagline: "atendimento que não dorme.",
    description:
      "Triagem 24/7 integrada ao site e WhatsApp, treinada no seu tom de voz e nas suas regras de negócio. Lead qualificado chega no painel; o resto, o bot resolve.",
    bullets: ["triagem 24/7", "WhatsApp Business", "treinado no seu negócio", "painel de leads"],
    badge: "IA NATIVA",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><circle cx="9" cy="10" r="1" /><circle cx="15" cy="10" r="1" />
      </svg>
    ),
  },
  {
    key: "automation",
    prefix: "/04",
    title: "automação & integrações",
    tagline: "tarefa repetitiva é desperdício.",
    description:
      "WhatsApp, e-mail, Sheets, Notion, APIs internas — conectamos tudo. Você ganha horas semanais e dados que param de se perder entre planilhas.",
    bullets: ["n8n / Make", "webhooks REST", "Sheets / Notion", "fluxos custom"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 10v6m11-11h-6M7 12H1" />
      </svg>
    ),
  },
  {
    key: "crm",
    prefix: "/05",
    title: "sistema sob medida",
    tagline: "o software que sua planilha queria ser.",
    description:
      "CRM, agenda, financeiro, relatório executivo — construído na régua do seu processo, sem licença mensal nem teto de usuários. Você dono dos dados, dono do código.",
    bullets: ["painel admin", "multi-usuário", "relatórios", "API REST"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: "branding",
    prefix: "/06",
    title: "identidade visual",
    tagline: "marca que sustenta preço.",
    description:
      "Logo vetorial, paleta, tipografia e manual da marca pensados para o digital primeiro, impressão depois. Entrega com mockups prontos para apresentar ao seu cliente.",
    bullets: ["logo vetorial", "paleta + tipografia", "manual da marca", "mockups"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="19" cy="13" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="10" cy="19" r="2.5" /><path d="M12 2a10 10 0 1 0 10 10" />
      </svg>
    ),
  },
];

export const promoBenefits = [
  { icon: "🎯", title: "Site 100% personalizado", desc: "Sem template engessado. Cada projeto recebe identidade própria, do tipo de letra ao espaçamento." },
  { icon: "💬", title: "Chatbot integrado", desc: "Triagem 24/7 que filtra e qualifica novos clientes direto no WhatsApp." },
  { icon: "🔍", title: "SEO Google + Maps", desc: "Para aparecer quando buscarem advogado na sua cidade — não na próxima página." },
  { icon: "🎨", title: "Logo grátis", desc: "Não tem identidade visual? A gente cria, sem custo extra." },
  { icon: "🤖", title: "Fotos tratadas com IA", desc: "Suas fotos de perfil e do escritório saem do amador para o profissional." },
  { icon: "♾️", title: "Hospedagem vitalícia", desc: "Sem mensalidade. Pagamento único e a hospedagem fica por nossa conta." },
  { icon: "🛠️", title: "30 dias de ajustes", desc: "Modificações ilimitadas após a entrega para deixar exatamente do seu jeito." },
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
