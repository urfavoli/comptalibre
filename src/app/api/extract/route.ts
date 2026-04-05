import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { base64, prompt } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "application/pdf", data: base64 } }] }],
        generationConfig: { temperature: 0.1 }
      },
      { timeout: 60000 } // On donne 60 secondes pour traiter le PDF
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    return NextResponse.json({ error: "Erreur API" }, { status });
  }
}