import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ComptaLibre.ma - Relevé PDF vers Excel",
  description: "Convertissez vos relevés bancaires marocains en fichiers Excel avec l'IA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}