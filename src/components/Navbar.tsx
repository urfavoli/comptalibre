"use client";

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Laptop, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  // Effet pour changer le style au scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-300 ${
      scrolled 
        ? (isDark ? 'py-3 bg-[#0e0e11]/80 border-white/5' : 'py-3 bg-white/80 border-slate-200') 
        : (isDark ? 'py-5 bg-transparent border-transparent' : 'py-5 bg-transparent border-transparent')
    } backdrop-blur-md border-b`}>
      
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <h1 className={`text-2xl md:text-3xl font-black italic tracking-tighter transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="text-blue-600">Compta</span>Libre
            </h1>
            <div className="absolute -bottom-1 left-0 w-0 h-1 bg-blue-600 transition-all group-hover:w-full rounded-full" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border transition-all ${
            isDark 
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
              : 'bg-blue-50 border-blue-100 text-blue-700'
          }`}>
            v0.1
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <nav className={`flex items-center gap-8 text-sm font-bold mr-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <a href="#" className="hover:text-blue-600 transition-colors">Fonctionnalités</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Tarifs</a>
          </nav>

          <div className={`h-6 w-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className={`relative p-2.5 rounded-2xl border transition-all duration-300 overflow-hidden group ${
                isDark 
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-yellow-400' 
                  : 'border-slate-200 bg-white shadow-sm hover:border-blue-300 text-slate-700'
              }`}
              aria-label="Toggle Theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0.8 }}
              >
                {isDark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
              </motion.div>
            </button>

            {/* CTA Button */}
            <button className="relative group overflow-hidden bg-blue-600 text-white font-black px-7 py-3 rounded-2xl text-sm shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Démarrer <span className="hidden lg:inline">Gratuitement</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Icon (Placeholder for now) */}
        <div className="md:hidden">
          <button className={isDark ? 'text-white' : 'text-slate-900'}>
            <Menu size={28} />
          </button>
        </div>

      </div>
    </nav>
  );
};