const express = require('express');
const router = express.Router();
const OpenAI = require('openai'); // ✅ v4 import
require('dotenv').config();

// ✅ Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ POST /api/ai-summary
router.post('/', async (req, res) => {
  try {
    const { numericData } = req.body;

    if (!numericData || Object.keys(numericData).length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    const prompt = `
      You are an Excel data analyst.
      Provide a concise summary of this dataset in 3-5 sentences.
      Highlight trends, highest/lowest values, averages, or interesting observations.

      Data: ${JSON.stringify(numericData)}
    `;

    // ✅ Use new Chat Completions API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // faster and cheaper than gpt-4
      messages: [
        { role: "system", content: "You are a helpful data analyst." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 250,
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ error: "AI summary generation failed" });
  }
});

module.exports = router;
