import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Shared Gemini client utility with User-Agent for telemetry
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for Solar AI Consultant
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages array" });
        return;
      }

      // Prepare system instruction
      const systemInstruction = `You are a certified technical solar expert specializing in independent off-grid solar systems (Off-Grid) and Apollo Power's revolutionary flexible solar film technology.
Your role is to assist DIY enthusiasts in planning, designing, calculating, and installing flexible solar panels on campervans, RVs, sailboats, yachts, curved roofs, pergolas, tents, and balconies.
Please answer in Hebrew (עברית) or in English if they ask in English, but default to Hebrew if the conversation is in Hebrew.
Be highly professional, structured, and informative. Encourage them to understand key components of their DIY kit:
1. Flexible Solar Panels (like Apollo Flex 135W or 270W): emphasize they are light (~1.5 kg/sqm vs 12 kg/sqm for glass), extremely thin (1.2mm), walk-on safe, bendable up to 30 degrees, and glued directly with structural adhesives (like SikaFlex 252 or acrylic double-sided VHB tape) without drilling.
2. MPPT Charge Controller: helps match solar voltage to battery voltage. Explain how to size it (e.g., Voc and Isc in series vs parallel).
3. Batteries: recommend Lithium Iron Phosphate (LiFePO4) for weight and depth-of-discharge, or AGM.
4. Adhesive: specify SikaFlex 252 or 291 for marine/vehicle bonding, or high-bond tape.
5. Inverter: to convert 12V/24V DC to 230V AC for household appliances.

Always keep your advice practical, safe, and tailored to their specific DIY layout. Keep answers clear, beautifully formatted with markdown, lists, and bold headings.`;

      // Format messages for @google/genai chats API or generateContent
      const formattedContents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with AI expert" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
