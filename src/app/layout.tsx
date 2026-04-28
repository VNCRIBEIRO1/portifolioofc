import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://pixelcodestudio.com.br";
const WHATSAPP = "5518996311933";
const PHONE_E164 = "+55-18-99631-1933";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PixelCode Studio | Sites, Landing Pages, Automações e CRM",
  description:
    "Estúdio de Vinícius Ribeiro. Sites institucionais, landing pages, chatbots, automações e CRMs sob medida — foco em conversão real. Promoção de abril: site para advocacia por R$ 199, só até 29/04.",
  keywords: [
    "criação de sites",
    "landing page",
    "chatbot",
    "automação",
    "CRM personalizado",
    "site para advogado",
    "site para escritório de advocacia",
    "PixelCode Studio",
    "Vinícius Ribeiro",
    "Presidente Prudente",
  ],
  authors: [{ name: "Vinícius Ribeiro" }],
  creator: "PixelCode Studio LTDA",
  publisher: "PixelCode Studio LTDA",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "PixelCode Studio | Sites, Landing Pages, Automações e CRM",
    description:
      "Sites profissionais que convertem. Promo de abril: site para advocacia por R$ 199, com chatbot, SEO e hospedagem vitalícia.",
    type: "website",
    locale: "pt_BR",
    siteName: "PixelCode Studio",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PixelCode Studio — Vinícius Ribeiro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelCode Studio | Sites & Sistemas Web",
    description:
      "Sites profissionais que convertem. Promo R$ 199 para advocacia até 29/04.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PixelCode Studio LTDA",
  legalName: "PixelCode Studio LTDA",
  taxID: "66.257.657/0001-47",
  founder: { "@type": "Person", name: "Vinícius Ribeiro" },
  url: SITE_URL,
  logo: `${SITE_URL}/images/brand/logo.svg`,
  telephone: PHONE_E164,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: PHONE_E164,
      areaServed: "BR",
      availableLanguage: ["pt-BR"],
    },
  ],
  sameAs: [`https://wa.me/${WHATSAPP}`, "https://github.com/VNCRIBEIRO1"],
};

const promoOfferJsonLd = {
  "@context": "https://schema.org",
  "@type": "Offer",
  name: "Site profissional + Chatbot de triagem para Advocacia",
  description:
    "Landing page institucional com chatbot de triagem, otimização SEO, logo (se necessário), hospedagem vitalícia gratuita e 30 dias de ajustes.",
  price: "199.00",
  priceCurrency: "BRL",
  priceValidUntil: "2026-04-29",
  availability: "https://schema.org/LimitedAvailability",
  seller: {
    "@type": "Organization",
    name: "PixelCode Studio LTDA",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(promoOfferJsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
