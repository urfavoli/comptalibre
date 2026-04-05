"use client";

import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  isDark: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDark }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`pt-20 pb-10 border-t transition-colors ${
      isDark ? 'bg-[#0a0a0c] border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Colonne 1: Brand & Bio */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black italic tracking-tighter text-blue-600">
                ComptaLibre<span className={isDark ? 'text-white' : 'text-slate-900'}>.ma</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed">
              L'IA souveraine dédiée à la modernisation des fiduciaires marocaines. 
              Simplifiez votre saisie, boostez votre productivité.
            </p>
            <div className="flex gap-4 pt-2">
              <Twitter size={18} className="cursor-pointer hover:text-blue-500 transition-colors" />
              <Linkedin size={18} className="cursor-pointer hover:text-blue-500 transition-colors" />
              <Github size={18} className="cursor-pointer hover:text-blue-500 transition-colors" />
            </div>
          </div>

          {/* Colonne 2: Produit */}
          <div className="space-y-4">
            <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Produit</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Convertisseur PDF</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Classification PCM</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors text-blue-500 font-bold">API (Bientôt)</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Tarifs</li>
            </ul>
          </div>

          {/* Colonne 3: Légal */}
          <div className="space-y-4">
            <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Légal</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Confidentialité (Loi 09-08)</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Conditions d'Utilisation</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Mentions Légales</li>
            </ul>
          </div>

          {/* Colonne 4: Localisation */}
          <div className="space-y-4">
            <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Présence</h4>
            <div className="flex flex-wrap gap-2">
              {['Tanger', 'Casablanca', 'Rabat'].map((city) => (
                <span key={city} className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  isDark ? 'border-white/10 bg-white/5' : 'border-slate-300 bg-white shadow-sm'
                }`}>
                  {city}
                </span>
              ))}
            </div>
            <p className="text-xs italic opacity-60">Made with ❤️ in Morocco 🇲🇦</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-50 ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p>© {currentYear} ComptaLibre.ma</p>
            <p className="hidden md:block">|</p>
            <p>Smallpdf est une marque déposée par Smallpdf AG.</p>
          </div>
          <p className="text-center md:text-right">
            Conçu pour le Plan Comptable Marocain 🇲🇦
          </p>
        </div>
      </div>
    </footer>
  );
};