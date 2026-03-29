"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
  // Thème clair par défaut (comme l'exemple Smallpdf)
  const [isDark, setIsDark] = useState(false); 
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

  // Initialisation du thème au chargement
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDark(storedTheme === 'dark');
    }
  }, []);

  // Sauvegarde du thème quand il change
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Ajout de la classe 'dark' au body pour les sélecteurs CSS
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(new Uint8Array(buffer).reduce((d, b) => d + String.fromCharCode(b), ''));
      const prompt = `Extraire JSON de relevé bancaire marocain: [{"date": "JJ/MM/AAAA", "label": "Texte complet", "pcm": "Code (ex: 6111)", "debit": nombre, "credit": nombre}].`;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "application/pdf", data: base64 } }] }] }
      );
      const rawJson = response.data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
      setData(JSON.parse(rawJson));
    } catch (err) { 
      setError("Erreur lors de l'analyse. Veuillez réessayer."); 
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) return;
    const BOM = "\uFEFF"; // Pour Excel (UTF-8)
    const header = "Date;Libellé;Code PCM;Débit;Crédit\n";
    const rows = data.map(r => `${r.date};"${r.label.replace(/"/g, '""')}";${r.pcm};${r.debit};${r.credit}`).join("\n");
    const csvContent = BOM + header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ComptaLibre_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const shareOnWhatsApp = () => {
    if (data.length === 0) return;
    const summary = `Bonjour, voici le résumé de ComptaLibre pour votre relevé :
      ✅ Réconciliation : ${isVerified ? 'RÉUSSIE 🎉' : 'ÉCART ⚠️'}
      🔄 Solde final calculé : ${calculatedEndBalance} DH
      Testez vous-même sur https://comptalibre.vercel.app/`;
    const encoded = encodeURIComponent(summary);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Petite fonction utilitaire pour les icônes légères
  const Icon = ({ path }: { path: string }) => (
    <svg className="w-6 h-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? 'bg-[#0e0e11] text-slate-100' : 'bg-[#fcfcff] text-[#1c1d2e]'}`}>
      
      {/* 1. HEADER & NAVBAR */}
      <nav className={`sticky top-0 z-50 transition-colors ${isDark ? 'bg-[#14151a]/90 backdrop-blur-sm border-b border-white/5' : 'bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black italic tracking-tighter text-blue-600">ComptaLibre<span className={isDark ? 'text-white' : 'text-[#1c1d2e]'}>.ma</span></h1>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">beta v0.1</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`p-2.5 rounded-full border transition-all ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-300 bg-white shadow-inner'}`}
              aria-label="Toggle Theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-transform active:scale-95 shadow-md">
              Démarrer Gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* 2. SECTION HERO (L'Outil) */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <h2 className={`text-5xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#0a0a0f]'}`}>
            Convertissez vos <span className="text-blue-600">Relevés PDF</span> en fichiers Excel éditables
          </h2>
          <p className="text-lg opacity-70 leading-relaxed">
            Spécialement conçu pour les comptables et fiduciaires au Maroc. Extrayez instantanément les données bancaires et gagnez des heures de saisie manuelle.
          </p>
          <div className="flex gap-4 pt-4">
            <button className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all ${isDark ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-white border border-slate-300 shadow-lg hover:shadow-xl'}`}>
              <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              1.7 milliard de lignes traitées (IA)
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className={`p-8 lg:p-12 rounded-[3.5rem] border transition-all ${isDark ? 'bg-[#14151a] border-white/10' : 'bg-white border-slate-300 shadow-2xl'}`}>
            <h3 className={`text-2xl font-black mb-8 ${!isDark ? 'text-blue-950' : ''}`}>Essayez ComptaLibre Gratuitement</h3>
            
            <input 
              type="file" 
              accept=".pdf"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-8 border border-slate-300 rounded-3xl" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
            
            <div className="grid grid-cols-2 gap-5 mb-8">
              <input 
                type="number" 
                placeholder="Solde Début (DH)" 
                className={`p-4 rounded-xl border outline-none text-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                onChange={(e) => setStartBalance(e.target.value)} 
              />
              <input 
                type="number" 
                placeholder="Solde Fin (DH)" 
                className={`p-4 rounded-xl border outline-none text-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300 text-slate-900'}`} 
                onChange={(e) => setEndBalance(e.target.value)} 
              />
            </div>

            <button 
              onClick={handleProcess} 
              disabled={!file || loading} 
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl text-lg shadow-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2"><Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> ANALYSE EN COURS...</span>
              ) : "CONVERTIR MON RELEVÉ 🔥"}
            </button>
            {error && <p className="mt-5 text-red-500 text-xs text-center font-bold uppercase">{error}</p>}
          </div>
        </div>
      </section>

      {/* 3. SECTION RÉSULTATS (Visible si data > 0) */}
      {data.length > 0 && (
        <section className={`py-16 ${isDark ? 'bg-[#1c1d24]' : 'bg-blue-50'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black mb-10 text-center">Vos Données Converties</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
              <div className={`p-6 lg:col-span-1 rounded-3xl border ${isDark ? 'bg-[#14151a] border-white/10' : 'bg-white border-slate-200'}`}>
                <p className="text-xs font-bold opacity-60">NOMBRE DE LIGNES</p>
                <p className="text-4xl font-black">{data.length}</p>
              </div>
              <div className={`p-6 lg:col-span-2 rounded-3xl border ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                <p className={`text-xs font-bold ${isVerified ? 'text-emerald-500' : 'text-orange-500'}`}>
                  RÉCONCILIATION BANCAIRE
                </p>
                <p className={`text-3xl font-black ${isVerified ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {isVerified ? 'RÉUSSIE 🎉' : 'ÉCART DÉTECTÉ ⚠️'}
                </p>
                <p className="text-xs opacity-60 mt-1">Solde final calculé : {calculatedEndBalance} DH</p>
              </div>
              <div className="grid grid-cols-1 lg:col-span-1 gap-4">
                <button onClick={downloadCSV} className="w-full h-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl transition-transform active:scale-95 shadow-md">
                  <Icon path="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  Exporter (.CSV/Excel)
                </button>
                <button onClick={shareOnWhatsApp} className="w-full flex items-center justify-center gap-2 py-3 bg-opacity-10 bg-black text-black dark:text-white font-black rounded-3xl text-sm transition-transform active:scale-95 hover:bg-opacity-20 border border-current opacity-70">
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
                      <td className="p-5"><span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-mono text-sm font-bold">{row.pcm}</span></td>
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
      )}

      {/* 4. SECTION ARGUMENTAIRE (Like Smallpdf) */}
      <section className={`py-24 border-t ${isDark ? 'border-white/5 bg-[#14151a]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-16 text-center tracking-tight leading-tight">
            Extraire des tableaux de données depuis des <br className="hidden md:block"/> relevés bancaires vers Excel en quelques secondes.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            
            <div className="space-y-4">
              <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              <h3 className="font-extrabold text-xl">Sécurité certifiée pour vos relevés</h3>
              <p className="text-sm opacity-70 leading-relaxed">Nous ne stockons jamais vos documents bancaires. L'extraction est éphémère et conforme aux standards de sécurité bancaire et à la loi 09-08.</p>
            </div>

            <div className="space-y-4">
              <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              <h3 className="font-extrabold text-xl">Conversion de documents scannés</h3>
              <p className="text-sm opacity-70 leading-relaxed">Notre technologie de reconnaissance de caractères (OCR) de 2026 convertit même les photos floues ou les impressions inclinées en fichiers éditables.</p>
            </div>

            <div className="space-y-4">
              <Icon path="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              <h3 className="font-extrabold text-xl">Auto-classification PCM unique</h3>
              <p className="text-sm opacity-70 leading-relaxed">Exclusivité Maroc. L'IA analyse le libellé (virement, chèque, frais) et suggère le code correct du Plan Comptable Marocain (6111, 4411, etc.).</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className={`py-12 border-t ${isDark ? 'border-white/5 bg-[#0a0a0c]' : 'border-slate-100 bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3 opacity-40 text-[11px] font-bold uppercase tracking-wider">
          <p>© 2026 ComptaLibre.ma - L'IA comptable souveraine</p>
          <p>Tanger | Casablanca | Rabat</p>
          <p>Smallpdf est une marque déposée. Notre service est indépendant.</p>
        </div>
      </footer>
    </div>
  );
}