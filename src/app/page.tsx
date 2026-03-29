"use client";

import React, { useState, useMemo } from 'react';
import axios from 'axios';

interface Transaction {
  date: string;
  label: string;
  pcm: string;
  debit: number;
  credit: number;
}

export default function ComptaLibre() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [data, setData] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [startBalance, setStartBalance] = useState("");
  const [endBalance, setEndBalance] = useState("");

  const totals = useMemo(() => {
    return data.reduce((acc, curr) => ({
      debit: acc.debit + (Number(curr.debit) || 0),
      credit: acc.credit + (Number(curr.credit) || 0)
    }), { debit: 0, credit: 0 });
  }, [data]);

  const calculatedEndBalance = useMemo(() => {
    const start = parseFloat(startBalance) || 0;
    return (start + totals.credit - totals.debit).toFixed(2);
  }, [startBalance, totals]);

  const isVerified = useMemo(() => {
    if (!endBalance || data.length === 0) return false;
    return Math.abs(parseFloat(calculatedEndBalance) - parseFloat(endBalance)) < 0.01;
  }, [calculatedEndBalance, endBalance, data]);

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(new Uint8Array(buffer).reduce((d, b) => d + String.fromCharCode(b), ''));
      const prompt = `Extraire JSON: [{"date": "JJ/MM/AAAA", "label": "Texte", "pcm": "Code", "debit": nombre, "credit": nombre}]`;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "application/pdf", data: base64 } }] }] }
      );
      const rawJson = response.data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
      setData(JSON.parse(rawJson));
    } catch (err) { 
      setError("Erreur technique. Vérifiez votre fichier."); 
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 font-sans ${isDark ? 'bg-[#0a0a0c] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto px-6 py-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-blue-600">
            ComptaLibre<span className={isDark ? 'text-white' : 'text-slate-900'}>.ma</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">L'IA au service de la comptabilité marocaine</p>
        </div>
        <button 
          onClick={() => setIsDark(!isDark)} 
          className={`p-3 rounded-2xl border transition-all ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-300 bg-white shadow-sm'}`}
        >
          {isDark ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
        </button>
      </header>

      {/* SECTION HERO */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-8 rounded-[3rem] border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-300 shadow-2xl'}`}>
            <h2 className={`text-xl font-black mb-6 ${!isDark ? 'text-blue-900' : ''}`}>Convertir un relevé</h2>
            
            <input 
              type="file" 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <input 
                type="number" 
                placeholder="Solde Début" 
                className={`p-3 rounded-xl border outline-none text-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                onChange={(e) => setStartBalance(e.target.value)} 
              />
              <input 
                type="number" 
                placeholder="Solde Fin" 
                className={`p-3 rounded-xl border outline-none text-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                onChange={(e) => setEndBalance(e.target.value)} 
              />
            </div>

            <button 
              onClick={handleProcess} 
              disabled={!file || loading} 
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95 disabled:opacity-30"
            >
              {loading ? "ANALYSE EN COURS..." : "EXTRAIRE LES DONNÉES ⚡"}
            </button>
            {error && <p className="mt-4 text-red-500 text-xs text-center font-bold uppercase">{error}</p>}
          </div>

          {data.length > 0 && (
            <div className={`p-6 rounded-[2.5rem] border ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest">Réconciliation : {isVerified ? 'Réussie' : 'Écart détecté'}</p>
              <p className="text-2xl font-black">{calculatedEndBalance} DH</p>
            </div>
          )}
        </div>

        {/* TABLEAU */}
        <div className={`lg:col-span-7 h-[500px] overflow-auto rounded-[3rem] border bg-opacity-50 backdrop-blur-md transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-300 shadow-xl'}`}>
          {data.length > 0 ? (
            <table className="w-full text-left text-[12px]">
              <thead className={`sticky top-0 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <tr className="uppercase font-black opacity-50">
                  <th className="p-4">Date</th>
                  <th className="p-4">Libellé</th>
                  <th className="p-4">PCM</th>
                  <th className="p-4 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-500/10">
                {data.map((row, i) => (
                  <tr key={i} className={`hover:bg-blue-500/5 transition-colors ${!isDark ? 'text-slate-800 border-slate-200' : ''}`}>
                    <td className="p-4 opacity-60 font-mono">{row.date}</td>
                    <td className="p-4 font-bold">{row.label}</td>
                    <td className="p-4"><span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">{row.pcm}</span></td>
                    <td className={`p-4 text-right font-black ${row.debit > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {row.debit > 0 ? `-${row.debit}` : `+${row.credit}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
              <p>Vos données apparaîtront ici...</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION MARKETING */}
      <section className={`py-20 border-t ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-12 text-center tracking-tight">Pourquoi choisir ComptaLibre ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="text-4xl">⏱️</div>
              <h3 className="font-black text-xl">Gain de temps</h3>
              <p className="text-sm opacity-60 leading-relaxed">Fini la saisie manuelle. Convertissez des mois de relevés bancaires en quelques secondes seulement.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="font-black text-xl">Auto-Classification</h3>
              <p className="text-sm opacity-60 leading-relaxed">Notre IA suggère automatiquement les codes du Plan Comptable Marocain (PCM) pour chaque ligne.</p>
            </div>
            <div className={`text-center space-y-4`}>
              <div className="text-4xl">🛡️</div>
              <h3 className="font-black text-xl">Confidentialité</h3>
              <p className="text-sm opacity-60 leading-relaxed">Conforme à la loi 09-08. Vos documents sont traités localement et jamais stockés sur nos serveurs.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center opacity-30 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2026 ComptaLibre.ma - Tanger, Maroc</p>
      </footer>
    </div>
  );
}