import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "ComptaLibre - Extraction IA de Relevés Bancaires (PDF vers Excel)",
  description: "Simplifiez votre comptabilité au Maroc. Convertissez vos relevés bancaires (Attijari, BCP, BMCE...) en fichiers Excel structurés grâce à l'IA.",
  keywords: ["ComptaLibre", "comptabilité Maroc", "PDF vers Excel", "IA comptable", "relevé bancaire", "gestion financière"],
  authors: [{ name: "Soufiane Yassine" }], // Ton nom pour le personal branding
  
  // Cette partie permet d'afficher une belle carte quand tu partages le lien sur WhatsApp/LinkedIn
  openGraph: {
    title: "ComptaLibre - Votre assistant comptable intelligent",
    description: "Transformez vos documents PDF en données exploitables instantanément.",
    url: "https://comptalibre.ma", // Remplace par ton vrai domaine une fois en ligne
    siteName: "ComptaLibre",
    locale: "fr_FR",
    type: "website",
  },
  
  // Pour Google Search
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}