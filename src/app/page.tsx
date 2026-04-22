"use client";

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Results } from '@/components/Results';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';

export default function ComptaLibre() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false); 
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [startBalance, setStartBalance] = useState("");
  const [endBalance, setEndBalance] = useState("");

  // --- LOGIQUE CALCULS ---
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

  // --- THEME ---
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setIsDark(stored === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  // --- TRAITEMENT DU FICHIER ---
  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setData([]);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        
        const prompt = `Extraits les transactions du document en JSON uniquement. 
        Format obligatoire : [{"date": "JJ/MM/AAAA", "label": "Libellé", "pcm": "Compte", "debit": 0, "credit": 0}]
        Si une ligne est un crédit, mets debit à 0. Si c'est un débit, mets credit à 0.`;

        // APPEL À TA ROUTE API INTERNE
        const response = await axios.post('/api/extract', {
          base64: base64Data,
          prompt: prompt
        }, { timeout: 60000 });

        // MODIFICATION ICI : 
        // Ta route API renvoie déjà le JSON parsé (le tableau), 
        // donc on l'utilise directement sans chercher "candidates"
        const resultData = response.data;
        
        if (!resultData || !Array.isArray(resultData)) {
          throw new Error("Le format reçu n'est pas un tableau valide.");
        }

        setData(resultData);

        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);

      } catch (err: any) {
        console.error("Error:", err);
        // On affiche le message d'erreur précis venant du serveur
        const message = err.response?.data?.error || err.message || "Erreur lors de l'analyse.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
  };

  // --- EXPORT EXCEL ---
  const downloadExcel = () => {
    if (data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Extraction_Comptable");
    XLSX.writeFile(workbook, `Compta_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const shareOnWhatsApp = () => {
    const text = `Salut, j'ai extrait ${data.length} transactions avec ComptaLibre. Solde final : ${calculatedEndBalance} DH.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={`min-h-screen transition-all ${isDark ? 'bg-[#0e0e11] text-white' : 'bg-[#fcfcff] text-slate-900'}`}>
      <Navbar isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
      <main className="pb-20">
        <Hero 
          isDark={isDark} 
          file={file} 
          setFile={setFile} 
          loading={loading} 
          error={error} 
          handleProcess={handleProcess} 
          setStartBalance={setStartBalance} 
          setEndBalance={setEndBalance} 
        />
        
        <AnimatePresence>
          {data.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              id="results-section" 
              className="scroll-mt-20"
            >
              <Results 
                isDark={isDark} 
                data={data} 
                isVerified={isVerified} 
                calculatedEndBalance={calculatedEndBalance} 
                downloadExcel={downloadExcel} 
                shareOnWhatsApp={shareOnWhatsApp} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <Features isDark={isDark} />
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}