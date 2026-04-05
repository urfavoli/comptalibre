"use client";

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
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
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [startBalance, setStartBalance] = useState("");
  const [endBalance, setEndBalance] = useState("");

  
  // --- LOGIQUE MÉMOÏSÉE ---
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

  // --- THÈME ---
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setIsDark(stored === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  // --- COEUR DE L'ANALYSE (AVEC SYSTÈME ANTI-CRASH) ---
  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setData([]);

    const buffer = await file.arrayBuffer();
    const base64 = btoa(new Uint8Array(buffer).reduce((d, b) => d + String.fromCharCode(b), ''));
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const prompt = "EXTRAIS LES TRANSACTIONS EN JSON UNIQUEMENT. FORMAT: [{\"date\": \"...\", \"label\": \"...\", \"pcm\": \"...\", \"debit\": 0, \"credit\": 0}]";

    // Fonction de tentative (Retry) pour contrer l'erreur 429
    const makeRequest = async (retries = 1): Promise<any> => {
      try {
        return await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-8b:generateContent?key=${apiKey}`,
  { contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "application/pdf", data: base64 } }] }] }
);
          { timeout: 45000 } // 45s de patience
       
      } catch (err: any) {
        if (err.response?.status === 429 && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2s
          return makeRequest(retries - 1);
        }
        throw err;
      }
    };

    try {
      const response = await makeRequest();
      const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) throw new Error("Réponse vide de l'IA.");

      let cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const start = cleanText.indexOf('[');
      const end = cleanText.lastIndexOf(']') + 1;
      
      if (start === -1) throw new Error("Format de données illisible.");
      
      setData(JSON.parse(cleanText.substring(start, end)));

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      console.error("Crash Log:", err);
      if (err.response?.status === 429) {
        setError("Serveur Google saturé. Réessayez dans 1 minute (Quota Gratuit).");
      } else if (err.code === 'ECONNABORTED') {
        setError("Connexion trop lente. Réduisez la taille du PDF.");
      } else {
        setError("Erreur : " + (err.message || "Analyse échouée"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all ${isDark ? 'bg-[#0e0e11] text-white' : 'bg-[#fcfcff] text-slate-900'}`}>
      <Navbar isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
      <main className="pb-20">
        <Hero isDark={isDark} file={file} setFile={setFile} loading={loading} error={error} handleProcess={handleProcess} setStartBalance={setStartBalance} setEndBalance={setEndBalance} />
        <AnimatePresence>
          {data.length > 0 && (
            <div id="results-section" className="scroll-mt-20">
              <Results isDark={isDark} data={data} isVerified={isVerified} calculatedEndBalance={calculatedEndBalance} 
                downloadCSV={() => {/* ta fonction download */}} shareOnWhatsApp={() => {/* ta fonction whatsapp */}} />
            </div>
          )}
        </AnimatePresence>
        <Features isDark={isDark} />
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}