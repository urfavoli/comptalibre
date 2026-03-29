"use client";

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

// --- TYPES ---
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
  
  // Solde de contrôle (Manual Input for Verification)
  const [startBalance, setStartBalance] = useState<string>("");
  const [endBalance, setEndBalance] = useState<string>("");

  // --- CALCULS COMPTABLES ---
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

  // --- ENGINE ---
  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(new Uint8Array(buffer).reduce((d, b) => d + String.fromCharCode(b), ''));

      const prompt = `
        CONTEXTE: Comptabilité Marocaine (PCM).
        MISSION: Extraire TOUTES les lignes du relevé bancaire.
        FORMAT: JSON Array: [{"date": "JJ/MM/AAAA", "label": "Texte", "pcm": "Code 4 chiffres", "debit": nombre, "credit": nombre}]
        RÈGLES: 
        1. Fusionner les libellés sur plusieurs lignes. 
        2. Mapper les codes PCM (ex: 6111 Achats, 6145 PTT, 4411 Fournisseurs).
        3. Supprimer les doublons de chevauchement de pages.
        SORTIE: Uniquement le JSON brut.
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "application/pdf", data: base64 } }] }]
        }
      );

      const rawJson = response.data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
      setData(JSON.parse(rawJson));
    } catch (err) {
      setError("Erreur d'analyse. Vérifiez votre fichier ou clé API.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csv = "Date;Libellé;Code PCM;Débit;Crédit\n" + 
      data.map(r => `${r.date};"${r.label}";${r.pcm};${r.debit};${r.credit}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ComptaLibre_${file?.name.replace('.pdf', '')}.csv`;
    a.click();
  };

  return (
    <div className={`min-h-screen transition-all duration-500 p-4 md:p-8 flex flex-col items-center 
      ${isDark ? 'bg-[#0a0a0c] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic text-blue-500">
            ComptaLibre<span className={isDark ? 'text-white' : 'text-slate-900'}>.ma</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">L'Intelligence Artificielle pour les Fiduciaires Marocaines</p>
        </div>
        <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:scale-105 transition-transform">
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE: CONTRÔLE */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">1. Configuration</h3>
            
            <label className="block w-full h-40 border-2 border-dashed rounded-3xl cursor-pointer hover:border-blue-500 transition-all relative overflow-hidden group mb-4">
              <input type="file" className="hidden" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl mb-2">{file ? '📄' : '📤'}</span>
                <span className="text-[11px] font-bold px-4 text-center">{file ? file.name : "Glissez votre relevé PDF"}</span>
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-[9px] uppercase font-bold opacity-40 ml-2">Solde Début (DH)</label>
                <input type="number" value={startBalance} onChange={(e) => setStartBalance(e.target.value)} placeholder="0.00" className="w-full mt-1 p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold opacity-40 ml-2">Solde Fin (DH)</label>
                <input type="number" value={endBalance} onChange={(e) => setEndBalance(e.target.value)} placeholder="0.00" className="w-full mt-1 p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 text-sm" />
              </div>
            </div>

            <button onClick={handleProcess} disabled={!file || loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-20">
              {loading ? "ANALYSE..." : "LANCER L'EXTRACTION"}
            </button>
          </div>

          {/* SOLDE DE CONTRÔLE RESULT */}
          {data.length > 0 && (
            <div className={`p-6 rounded-[2.5rem] border transition-all ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest">Solde de Contrôle</h3>
                <span className="text-xl">{isVerified ? '✅' : '⚠️'}</span>
              </div>
              <p className="text-2xl font-black mt-2">{calculatedEndBalance} DH</p>
              <p className="text-[10px] opacity-60 mt-1">{isVerified ? "Réconciliation parfaite avec le PDF." : "Écart détecté : Vérifiez les lignes."}</p>
            </div>
          )}
        </div>

        {/* COLONNE DROITE: RÉSULTATS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[9px] uppercase opacity-40">Sorties (Débit)</p>
              <p className="text-sm font-bold text-red-400">-{totals.debit.toFixed(2)} DH</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[9px] uppercase opacity-40">Entrées (Crédit)</p>
              <p className="text-sm font-bold text-emerald-400">+{totals.credit.toFixed(2)} DH</p>
            </div>
            <button onClick={downloadCSV} disabled={data.length === 0} className="bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all disabled:opacity-20">
              Exporter CSV / Excel
            </button>
          </div>

          <div className="h-[500px] overflow-auto border border-white/10 rounded-[2.5rem] bg-white/5 relative">
            {data.length > 0 ? (
              <table className="w-full text-left text-[11px]">
                <thead className={`sticky top-0 z-10 ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                  <tr className="opacity-40 uppercase font-black">
                    <th className="p-4">Date</th>
                    <th className="p-4">Libellé</th>
                    <th className="p-4">PCM</th>
                    <th className="p-4 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 opacity-60">{row.date}</td>
                      <td className="p-4 font-bold">{row.label}</td>
                      <td className="p-4"><span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md">{row.pcm}</span></td>
                      <td className={`p-4 text-right font-black ${row.debit > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {row.debit > 0 ? `-${row.debit}` : `+${row.credit}`}
                      </td >
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <p className="italic text-sm">Prêt pour l'importation...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t border-white/10 w-full max-w-5xl text-center">
        <div className="flex flex-wrap justify-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
          <span>🛡️ Conforme CNDP (Loi 09-08)</span>
          <span>⚡ Moteur Gemini 2.5 Flash</span>
          <span>📍 Développé à Tanger</span>
        </div>
      </footer>
    </div>
  );
}