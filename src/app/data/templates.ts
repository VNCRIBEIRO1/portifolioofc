// Catálogo dos 25 templates publicados em https://templatesadv.vercel.app
// Usado pela vitrine na home da pixelcodestudio.com.br
export type TemplateCategory = "Clássico" | "Moderno" | "Saúde" | "Psicologia";

export interface TemplateItem {
  slug: string;
  name: string;
  category: TemplateCategory;
  description: string;
}

const BASE = "https://templatesadv.vercel.app";

export const TEMPLATES_BASE_URL = BASE;

export const templates: TemplateItem[] = [
  { slug: "classico-01", name: "Silva, Mendes & Associados", category: "Clássico", description: "Navy + dourado. Playfair Display. Hero fullscreen com biblioteca jurídica e parallax." },
  { slug: "classico-02", name: "Campos Borges Advocacia", category: "Clássico", description: "Bordô + creme. Cormorant Garamond. Navegação lateral fixa e textura sutil." },
  { slug: "classico-03", name: "Monteiro, Duarte & Peixoto", category: "Clássico", description: "Verde escuro + bronze. Libre Baskerville. Hero split-screen e timeline vertical." },
  { slug: "classico-04", name: "Ribeiro & Associados", category: "Clássico", description: "Carvão + prata. Merriweather. Ultra-minimalista com fotografia em escala de cinza." },
  { slug: "classico-05", name: "Almeida, Costa & Associados", category: "Clássico", description: "Navy + dourado. Cormorant. 6 áreas, equipe, newsletter e WhatsApp flutuante." },
  { slug: "moderno-01", name: "Barros & Leal Advogados", category: "Moderno", description: "Azul ardósia + coral. Plus Jakarta. Grid assimétrico, scroll animations e counters." },
  { slug: "moderno-02", name: "NovaDireito Advocacia", category: "Moderno", description: "Teal + charcoal + gradientes. DM Sans. Layout card-based, glassmorphism e flip cards." },
  { slug: "moderno-03", name: "Advocacia Dinâmica", category: "Moderno", description: "Índigo + lilás. Outfit. Seções full-screen, parallax CSS e tabs interativas." },
  { slug: "moderno-04", name: "JurisModerna", category: "Moderno", description: "Dark mode + azul elétrico. Manrope + Inter. Toggle claro/escuro e grid masonry." },
  { slug: "moderno-05", name: "Monteiro & Vasconcellos", category: "Moderno", description: "Navy + gold. Inter + Playfair. Marquee animado, cookie banner LGPD e WhatsApp." },
  { slug: "saude-01", name: "Dra. Helena Martins — Ginecologia", category: "Saúde", description: "Rosa-blush + bordô. Cormorant. Hero split-screen elegante com tons femininos." },
  { slug: "saude-02", name: "Instituto Vascular Dr. Marcos", category: "Saúde", description: "Azul-marinho + vermelho. Montserrat. Hero fullscreen com SVG decorativo." },
  { slug: "saude-03", name: "Clínica Derma Vita", category: "Saúde", description: "Verde-menta + dourado-rosé. Poppins. Hero clean com floating card." },
  { slug: "saude-04", name: "OrthoCenter", category: "Saúde", description: "Azul-aço + esmeralda. Archivo. Hero assimétrico com estética esportiva." },
  { slug: "saude-05", name: "PediCare — Pediatria", category: "Saúde", description: "Azul-celeste + amarelo + lavanda. Quicksand. Hero lúdico com formas orgânicas." },
  { slug: "saude-06", name: "CardioVita — Cardiologia", category: "Saúde", description: "Vermelho-escuro + grafite + dourado. Playfair. SVG heartbeat animado." },
  { slug: "saude-07", name: "ClearVision — Oftalmologia", category: "Saúde", description: "Teal + pêssego. DM Sans. Hero com carousel de 3 slides e tabs." },
  { slug: "saude-08", name: "NeuroVida — Neurociências", category: "Saúde", description: "Índigo profundo + cyan. Space Grotesk. Hero dark com grid neural animado." },
  { slug: "saude-09", name: "OncoVida — Oncologia", category: "Saúde", description: "Verde-esperança + terracota. Fraunces. Hero acolhedor com barra de progresso." },
  { slug: "saude-10", name: "DiagnosPrime", category: "Saúde", description: "Navy + teal. Outfit + DM Sans. Marquee de serviços e float cards." },
  { slug: "psicologia-01", name: "Espaço Mente — Psicologia", category: "Psicologia", description: "Lavanda + teal. Playfair + DM Sans. Calendário, triagem PHQ-9 e chatbot." },
  { slug: "psicologia-02", name: "Psicóloga Online", category: "Psicologia", description: "Verde + lilás. Quicksand. Quiz de match terapêutico e booking via WhatsApp." },
  { slug: "psicologia-03", name: "Equilíbrio Mental", category: "Psicologia", description: "Azul-sereno + laranja. Cormorant + Mulish. Calendário semanal e mapa." },
  { slug: "psicologia-04", name: "Mente Plena — Neuropsicologia", category: "Psicologia", description: "Dark indigo + cyan. Space Grotesk. Particles, timeline e booking 4 passos." },
  { slug: "psicologia-05", name: "Acolher — Psicologia Humanista", category: "Psicologia", description: "Rosê + terracota. Fraunces. Sala de espera virtual, chatbot e grupos." },
];

export function templateUrl(slug: string) {
  return `${BASE}/${slug}`;
}
