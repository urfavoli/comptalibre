"use client";

import React from 'react';
import { ShieldCheck, Zap, BookOpen, MousePointerClick, CloudLightning, Lock } from 'lucide-react';
import { motion } from 'framer-motion'; // Optionnel : utilise Framer Motion si tu veux du mouvement fluide

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isDark: boolean;
}

const FeatureCard = ({ icon: Icon, title, description, isDark }: FeatureCardProps) => (
  <div className={`group relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${
    isDark 
    ? 'bg-[#1a1b23] border-white/5 hover:border-blue-500/30 hover:shadow-[0_0_30px_-10px_rgba(37,99,235,0.2)]' 
    : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200'
  }`}>
    {/* Petit effet de gradient en fond au survol (Mode Sombre) */}
    {isDark && (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
    )}
    
    <div className={`mb-5 inline-flex p-3 rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
      <Icon size={28} strokeWidth={2.5} />
    </div>
    
    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {title}
    </h3>
    
    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      {description}
    </p>
  </div>
);

export const Features = ({ isDark }: { isDark: boolean }) => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Sécurité de Grade Bancaire",
      description: "Conformité CNDP & Loi 09-08. Vos relevés sont traités en mémoire vive et supprimés immédiatement après conversion."
    },
    {
      icon: Zap,
      title: "OCR Ultra-Précis 2026",
      description: "Même les scans de travers ou les photos prises au smartphone sont redressés et lus par notre IA propriétaire."
    },
    {
      icon: BookOpen,
      title: "Intelligence PCM Maroc",
      description: "Plus besoin de chercher vos comptes. L'IA reconnaît les virements 'TVA' ou 'CNSS' et applique le bon code comptable."
    },
    {
      icon: MousePointerClick,
      title: "Zéro Configuration",
      description: "Pas de logiciel lourd à installer. Accédez à vos outils de conversion depuis n'importe quel navigateur à Tanger."
    },
    {
      icon: CloudLightning,
      title: "Export Instantané",
      description: "Générez des fichiers .CSV optimisés pour Sage, Odoo ou Excel en un clic. Prêt pour l'importation directe."
    },
    {
      icon: Lock,
      title: "Confidentialité Totale",
      description: "Aucun humain ne voit vos chiffres. Seul l'algorithme traite les pixels pour en extraire le texte."
    }
  ];

  return (
    <section className={`py-32 relative overflow-hidden ${isDark ? 'bg-[#0e0e11]' : 'bg-[#f8fafc]'}`}>
      {/* Cercles de lumière décoratifs (Subtils) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className={`text-4xl md:text-5xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Pourquoi les fiduciaires choisissent <span className="text-blue-600 italic">ComptaLibre</span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Une technologie de pointe au service de la comptabilité marocaine. Gagnez 4h de saisie par jour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, index) => (
            <FeatureCard 
              key={index}
              icon={f.icon}
              title={f.title}
              description={f.description}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
};