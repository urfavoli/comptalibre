import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"; // Fixed import for the React component
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', 
});

export const metadata: Metadata = {
  title: "ComptaLibre - Extraction IA de Relevés Bancaires (PDF vers Excel)",
  description: "Simplifiez votre comptabilité au Maroc. Convertissez vos relevés bancaires (Attijari, BCP, BMCE...) en fichiers Excel structurés grâce à l'IA.",
  keywords: ["ComptaLibre", "comptabilité Maroc", "PDF vers Excel", "IA comptable", "relevé bancaire", "gestion financière"],
  authors: [{ name: "Soufiane Yassine" }],
  
  // --- IMPACT.COM VERIFICATION BLOCK ---
  verification: {
    other: {
      "impact-site-verification": ["bf87e3af-969c-4793-a695-50591239b344"],
    },
  },

  openGraph: {
    title: "ComptaLibre - Votre assistant comptable intelligent",
    description: "Transformez vos documents PDF en données exploitables instantanément.",
    url: "https://comptalibre.vercel.app", 
    siteName: "ComptaLibre",
    locale: "fr_FR",
    type: "website",
  },
  
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
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}