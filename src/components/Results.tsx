"use client";

import React from 'react';
import { Download, MessageCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface Transaction {
  date: string;
  label: string;
  pcm: string;
  debit: number;
  credit: number;
}

interface ResultsProps {
  isDark: boolean;
  data: Transaction[];
  isVerified: boolean;
  calculatedEndBalance: string;
  downloadCSV: () => void;
  shareOnWhatsApp: () => void;
}

export const Results: React.FC<ResultsProps> = ({ 
  isDark, 
  data, 
  isVerified, 
  calculatedEndBalance, 
  downloadCSV, 
  shareOnWhatsApp 
}) => {
  if (data.length === 0) return null;

  return (
    <section className={`py-16 ${isDark ? 'bg-[#1c1d24]' : 'bg-blue-50'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black mb-10 text-center">Vos Données Converties</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className={`p-6 lg:col-span-1 rounded-3xl border ${isDark ? 'bg-[#14151a] border-white/10' : 'bg-white border-slate-200'}`}>
            <p className="text-xs font-bold opacity-60">NOMBRE DE LIGNES</p>
            <p className="text-4xl font-black">{data.length}</p>
          </div>
          <div className={`p-6 lg:col-span-2 rounded-3xl border ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
            <p className={`text-xs font-bold ${isVerified ? 'text-emerald-500' : 'text-orange-500'} flex items-center gap-1`}>
              {isVerified ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              RÉCONCILIATION BANCAIRE
            </p>
            <p className={`text-3xl font-black ${isVerified ? 'text-emerald-500' : 'text-orange-500'}`}>
              {isVerified ? 'RÉUSSIE 🎉' : 'ÉCART DÉTECTÉ ⚠️'}
            </p>
            <p className="text-xs opacity-60 mt-1">Solde final calculé : {calculatedEndBalance} DH</p>
          </div>
          <div className="grid grid-cols-1 lg:col-span-1 gap-4">
            <button onClick={downloadCSV} className="w-full h-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl transition-transform active:scale-95 shadow-md">
              <Download className="w-5 h-5" />
              Exporter (.CSV)
            </button>
            <button onClick={shareOnWhatsApp} className="w-full flex items-center justify-center gap-2 py-3 bg-opacity-10 bg-black text-black dark:text-white font-black rounded-3xl text-sm transition-transform active:scale-95 hover:bg-opacity-20 border border-current opacity-70">
              <MessageCircle className="w-4 h-4" />
              Partager sur WhatsApp
            </button>
          </div>
        </div>

        <div className={`rounded-3xl border h-[500px] overflow-auto transition-all ${isDark ? 'bg-[#14151a] border-white/10' : 'bg-white border-slate-300 shadow-xl'}`}>
          <table className="w-full text-left text-[13px]">
            <thead className={`sticky top-0 z-10 ${isDark ? 'bg-[#14151a]' : 'bg-white'}`}>
              <tr className="uppercase font-bold text-xs opacity-50">
                <th className="p-5 border-b border-white/5">Date</th>
                <th className="p-5 border-b border-white/5">Libellé Complet</th>
                <th className="p-5 border-b border-white/5">PCM</th>
                <th className="p-5 border-b border-white/5 text-right">Montant (DH)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10">
              {data.map((row, i) => (
                <tr key={i} className={`hover:bg-blue-500/5 transition-colors ${!isDark ? 'text-slate-900 border-slate-200' : ''}`}>
                  <td className="p-5 opacity-70 font-mono">{row.date}</td>
                  <td className="p-5 font-semibold leading-relaxed">{row.label}</td>
                  <td className="p-5">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-mono text-sm font-bold">
                      {row.pcm}
                    </span>
                  </td>
                  <td className={`p-5 text-right font-black ${row.debit > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {row.debit > 0 ? `-${row.debit}` : `+${row.credit}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
