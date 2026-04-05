# ComptaLibre.ma 🇲🇦

Convertissez vos relevés bancaires PDF en fichiers Excel éditables avec l'intelligence artificielle. Spécialement conçu pour les comptables et fiduciaires au Maroc.

## ✨ Fonctionnalités

- **Extraction IA** : Utilise Google Gemini 2.0 Flash pour une extraction précise des données bancaires.
- **Support PDF** : Traitement direct des relevés bancaires PDF (y compris les documents scannés).
- **Classification PCM** : Suggestion automatique des codes du Plan Comptable Marocain (6111, 4411, etc.).
- **Réconciliation Bancaire** : Vérification automatique entre le solde de début, le solde de fin et les mouvements.
- **Export Excel/CSV** : Téléchargement immédiat des données pour une intégration facile dans votre logiciel de comptabilité.
- **Thème Sombre/Clair** : Interface moderne et soignée adaptée à votre environnement de travail.

## 🚀 Installation

1. Clonez le dépôt
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez vos variables d'environnement dans un fichier `.env.local` :
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=votre_cle_api_ici
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## 🛠️ Stack Technique

- **Framework** : [Next.js 15+](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **IA** : [Google Gemini API](https://ai.google.dev/)

## 🔒 Sécurité et Confidentialité

Nous respectons la loi 09-08 sur la protection des données à caractère personnel. Vos documents sont traités de manière éphémère et ne sont jamais stockés sur nos serveurs.

---
© 2026 ComptaLibre.ma - L'IA comptable souveraine.
