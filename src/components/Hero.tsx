"use client";

import React from 'react';
import { RefreshCw, FileText, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  isDark: boolean;
  file: File | null;
  setFile: (file: File | null) => void;
  loading: boolean;
  error: string;
  handleProcess: () => void;
  setStartBalance: (val: string) => void;
  setEndBalance: (val: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  isDark, 
  file, 
  setFile, 
  loading, 
  error, 
  handleProcess, 
  setStartBalance, 
  setEndBalance 
}) => {
  return (
    <section className="relative py-16 lg:py-24 max-w-7xl mx-auto px-6 overflow-hidden">
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 -z-10 w-[500px] h-[500px] blur-[150px] opacity-20 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-300'}`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}
          >
            <Sparkles size={14} />
            Propulsé par Gemini 2.0 AI
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            La fin de la saisie <br />
            <span className="text-blue-600 italic">manuelle.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-lg leading-relaxed opacity-70 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            Transformez vos relevés PDF en écritures comptables Excel en un clin d'œil. 
            Précis, sécurisé et 100% adapté au Plan Comptable Marocain.
          </motion.p>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap gap-6 pt-4"
          >
            <div className="flex items-center gap-2 text-sm font-bold opacity-60">
              <CheckCircle2 size={18} className="text-emerald-500" />
              Extraction Illimitée
            </div>
            <div className="flex items-center gap-2 text-sm font-bold opacity-60">
              <CheckCircle2 size={18} className="text-emerald-500" />
              Format Sage/Excel
            </div>
          </motion.div>
        </div>

        {/* Right Side: The Magic Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className={`relative p-1 rounded-[2.5rem] ${isDark ? 'bg-gradient-to-b from-blue-500/20 to-transparent' : 'bg-slate-200'}`}>
            <div className={`p-8 lg:p-10 rounded-[2.4rem] shadow-2xl ${isDark ? 'bg-[#14151a]' : 'bg-white'}`}>
              
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Charger un relevé bancaire
              </h3>
              
              <div className="relative mb-6">
                <input 
                  type="file" 
                  accept=".pdf"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                />
                <label 
                  htmlFor="file-upload" 
                  className={`group flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
                    file 
                    ? (isDark ? 'bg-blue-500/10 border-blue-500/50' : 'bg-blue-50 border-blue-400')
                    : (isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/50' : 'bg-slate-50 border-slate-300 hover:border-blue-400 hover:bg-blue-50/30')
                  }`}
                >
                  <div className={`p-4 rounded-full mb-4 transition-transform group-hover:scale-110 ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                    {file ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Upload className="w-8 h-8 text-blue-600" />}
                  </div>
                  <span className={`text-sm font-bold text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {file ? file.name : "Glissez votre PDF ici ou cliquez"}
                  </span>
                  {!file && <span className="text-[10px] mt-2 opacity-50 uppercase tracking-widest font-bold">PDF Max 10MB</span>}
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold opacity-50 ml-1">Solde Initial</label>
                  <input 
                    type="number" 
                    placeholder="0.00 DH" 
                    className={`w-full p-4 rounded-2xl border outline-none text-sm font-bold transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500 focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white'}`} 
                    onChange={(e) => setStartBalance(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold opacity-50 ml-1">Solde Final</label>
                  <input 
                    type="number" 
                    placeholder="0.00 DH" 
                    className={`w-full p-4 rounded-2xl border outline-none text-sm font-bold transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500 focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white'}`} 
                    onChange={(e) => setEndBalance(e.target.value)} 
                  />
                </div>
              </div>

              <button 
                onClick={handleProcess} 
                disabled={!file || loading} 
                className={`group relative w-full py-5 rounded-2xl text-lg font-black transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 overflow-hidden ${
                  !file || loading 
                  ? 'bg-slate-500/20 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                }`}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      ANALYSE INTELLIGENTE...
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="ready"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      CONVERTIR MAINTENANT
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-red-500 text-[10px] text-center font-bold uppercase tracking-tighter"
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};