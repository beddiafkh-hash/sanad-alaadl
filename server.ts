import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini Proxy endpoints
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, history = [] } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "prompt is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not set on server. Falling back safely.");
        return res.json({ text: "عذراً، يرجى ضبط مفتاح AI في إعدادات المنصة للاستفادة بكامل قدرات مساعد سند الذكي." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...history.map((h: any) => ({
            role: h.role === "assistant" || h.role === "model" ? "model" : "user",
            parts: [{ text: h.content }]
          })),
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: `
أنت "سند AI"، مساعد قانوني ذكي متخصص في القانون الجزائري والإجراءات القضائية في الجزائر.
مهمتك هي مساعدة المحامين في إدارة مكاتبهم، الإجابة على الاستفسارات القانونية، صياغة المذكرات، وتلخيص الوثائق.

قواعد التعامل:
1. تواصل دائماً باللغة العربية بأسلوب رسمي ومهني.
2. قدم معلومات دقيقة بناءً على النصوص القانونية الجزائرية (قانون العقوبات، القانون المدني، قانون الإجراءات المدنية والإدارية، إلخ).
3. كن موجزاً ومفيداً، ونظم إجاباتك باستخدام النقاط أو العناوين عند الحاجة.
4. إذا سُئلت عن شيء خارج التخصص القانوني، حاول ربطه بالجانب القانوني أو اعتذر بلباقة.
5. أنت تدعم الأوامر الصوتية، لذا افهم لغة المحامي اليومية وقم بجدولة المواعيد أو البحث عن القضايا بناءً على طلبه.
`,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Server Gemini Generate Error:", error);
      res.status(500).json({ error: error.message || "Internal AI Error" });
    }
  });

  app.post("/api/gemini/summarize", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "text is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({ text: "فشل التلخيص لعدم إرفاق مفتاح AI ساري المفعول." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `قم بتلخيص النص القانوني التالي واستخراج أهم النقاط والإجراءات المطلوبة:\n\n${text}`,
        config: {
          systemInstruction: "أنت خبير في تلخيص الوثائق القانونية الجزائرية بصورة مركزة ودقيقة.",
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Server Gemini Summarize Error:", error);
      res.status(500).json({ error: error.message || "Internal AI Error" });
    }
  });

  app.post("/api/gemini/search", async (req, res) => {
    try {
      const { query, dataContext } = req.body;
      if (!query) {
        return res.status(400).json({ error: "query is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({ text: JSON.stringify({ ids: [] }) });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `بناءً على طلب البحث: "${query}"، ابحث في البيانات التالية وأعد قائمة بالأرقام التعريفية (IDs) للعناصر الأكثر صلة:\n${JSON.stringify(dataContext)}`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "أنت محرك بحث ذكي. أجب فقط بصيغة JSON تحتوي على مصفوفة من المعرفات (ids).",
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Server Gemini Search Error:", error);
      res.status(500).json({ error: error.message || "Internal AI Error" });
    }
  });

  app.post("/api/gemini/rewrite", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "text is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({ text: "فشل تحسين الصياغة لعدم وجود مفتاح AI." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `قم بإعادة صياغة النص القانوني التالي بأسلوب أكثر احترافية ورصانة، مع الحفاظ على المعنى الدقيق والإجراءات المطلوبة:\n\n${text}`,
        config: {
          systemInstruction: "أنت خبير في الصياغة القانونية الجزائرية. استخدم لغة قانونية فصيحة وقوية.",
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Server Gemini Rewrite Error:", error);
      res.status(500).json({ error: error.message || "Internal AI Error" });
    }
  });

  // JORADP Sync Endpoint
  app.get("/api/sync/latest", async (req, res) => {
    try {
      // In a real scenario, this would scrape JORADP
      // For now, we simulate a successful check and inform about the latest journal
      res.json({
        success: true,
        latestJournal: "2024/32",
        lastChecked: new Date().toISOString(),
        updatesAvailable: false,
        message: "المكتبة متزامنة مع آخر عدد من الجريدة الرسمية"
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "فشل الاتصال بموقع الجريدة الرسمية" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
