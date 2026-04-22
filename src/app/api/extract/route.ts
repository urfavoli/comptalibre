import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { base64, prompt } = await req.json();
    
    // Récupération de la clé API depuis .env.local
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
      console.error("🔥 ERREUR : GEMINI_API_KEY est absente du fichier .env.local");
      return NextResponse.json({ error: "Configuration serveur incomplète (Clé API)" }, { status: 500 });
    }

    // 1. Initialisation du SDK Google
    const genAI = new GoogleGenerativeAI(apiKey);

    // 2. Utilisation du modèle Gemini 2.5 Flash (Vérifié sur ton compte)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    // 3. Préparation du document PDF
    const pdfPart = {
      inlineData: {
        data: base64,
        mimeType: "application/pdf"
      }
    };

    // 4. Appel à l'IA
    const result = await model.generateContent([prompt, pdfPart]);
    const responseText = result.response.text();

    // 5. PARSING ROBUSTE : On extrait uniquement ce qui est entre [ ]
    // Cela évite les crashs si l'IA écrit du texte avant ou après le JSON
    const startBracket = responseText.indexOf('[');
    const endBracket = responseText.lastIndexOf(']');

    if (startBracket === -1 || endBracket === -1) {
      console.error("🔥 RÉPONSE IA INVALIDE :", responseText);
      throw new Error("L'IA n'a pas renvoyé un format de tableau JSON valide.");
    }

    const cleanJson = responseText.substring(startBracket, endBracket + 1);

    // 6. On renvoie le tableau d'objets directement
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    // Ce message s'affichera dans ton terminal noir VS Code
    console.error("🔥 ERREUR DÉTAILLÉE :", error.message);
    
    return NextResponse.json({ 
      error: error.message || "Une erreur est survenue lors du traitement." 
    }, { status: 500 });
  }
}