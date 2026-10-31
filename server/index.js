import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchUrlContent } from './services/scraper.js';
import { runServerAnalysis } from './services/analyzer.js';
import { SAMPLE_PRESETS } from './services/datasets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Digital Dark Spot API',
    hackathon: 'Shinchan Online Hackathon 2026',
    author: 'Upesh Chauhan (Roll: 2404851520061)',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Presets (Slide 5 Scholarship Check, etc.)
app.get('/api/presets', (req, res) => {
  res.json({ presets: SAMPLE_PRESETS });
});

// URL Scraper Endpoint
app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  const result = await fetchUrlContent(url);
  res.json(result);
});

// Core Analysis Pipeline Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { topic, researchGoal, sources, customQuestions, geminiApiKey } = req.body;
    if (!sources || sources.length === 0) {
      return res.status(400).json({ error: 'At least one source is required for analysis.' });
    }

    const analysis = await runServerAnalysis({
      topic,
      researchGoal,
      sources,
      customQuestions,
      geminiApiKey
    });

    res.json(analysis);
  } catch (error) {
    console.error('Error running analysis:', error);
    res.status(500).json({
      error: error.message || 'Internal analysis error occurred'
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Digital Dark Spot] Backend server running on http://localhost:${PORT}`);
});
