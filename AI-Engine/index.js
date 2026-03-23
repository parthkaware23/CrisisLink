const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Parser = require("rss-parser");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const parser = new Parser();

app.use(cors());
app.use(express.json());

// 🔥 GROQ CLIENT
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// 🧠 AI FUNCTION (FIXED)
const analyzeNews = async (headlines) => {
  const prompt = `
You are an AI crisis detection system.

Analyze each news headline.

Return ONLY JSON array. No explanation. No markdown.

STRICT FORMAT:
[
  {
    "score": number,
    "isFake": boolean,
    "category": "Flood | Earthquake | Fire | Riot | War | General",
    "summary": "short sentence"
  }
]

Rules:
- category must be one of: Flood, Earthquake, Fire, Riot, War, General
- no extra text

News:
${JSON.stringify(headlines)}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = response.choices[0].message.content;

    let parsed = [];

    try {
      // 🔥 EXTRACT JSON ONLY
      const jsonMatch = text.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        console.log("⚠️ No JSON found");
        console.log(text);
      }
    } catch (err) {
      console.log("❌ JSON parse failed");
      console.log(text);
    }

    return parsed;
  } catch (err) {
    console.error("🔥 GROQ ERROR:", err.message);
    return [];
  }
};

// 🚀 MAIN ROUTE
app.get("/api/ai/rss-intel", async (req, res) => {
  try {
    console.log("📡 Fetching news...");

    const RSS_URL =
      "https://news.google.com/rss/search?q=disaster+India+when:1d&hl=en-IN&gl=IN&ceid=IN:en";

    const feed = await parser.parseURL(RSS_URL);
    const topItems = feed.items.slice(0, 5);

    if (!topItems.length) {
      return res.json({ message: "No news found" });
    }

    const headlines = topItems.map((i) => i.title);

    // 🧠 AI CALL
    const aiData = await analyzeNews(headlines);

    // 🔥 FINAL RESPONSE
    const final = topItems.map((item, i) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      score: aiData[i]?.score || 50,
      isFake: aiData[i]?.isFake || false,
      category: aiData[i]?.category || "General",
      summary: aiData[i]?.summary || "AI analysis not available",
    }));

    res.json({
      count: final.length,
      data: final,
    });
  } catch (err) {
    console.error("🔥 SERVER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 START SERVER
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});