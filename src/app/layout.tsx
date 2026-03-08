import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portifolioofc.vercel.app"),
  title: "Vinícius Ribeiro | Web Designer — PixelCode Studio",
  description:
    "Portfólio de Web Design por Vinícius Ribeiro. Sites profissionais, modernos e responsivos para escritórios, clínicas e negócios. PixelCode Studio.",
  keywords: [
    "web designer",
    "portfólio",
    "criação de sites",
    "Next.js",
    "PixelCode Studio",
    "Vinícius Ribeiro",
    "Presidente Prudente",
  ],
  authors: [{ name: "Vinícius Ribeiro" }],
  creator: "PixelCode Studio",
  openGraph: {
    title: "Vinícius Ribeiro | Web Designer — PixelCode Studio",
    description:
      "Sites profissionais que convertem. Cada projeto é um case de sucesso.",
    type: "website",
    locale: "pt_BR",
    siteName: "PixelCode Studio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vinícius Ribeiro — PixelCode Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinícius Ribeiro | Web Designer",
    description: "Sites profissionais que convertem. PixelCode Studio.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
