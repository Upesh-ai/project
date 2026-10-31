import axios from 'axios';

export async function callGeminiIfAvailable({ topic, researchGoal, sources, customQuestions, apiKey }) {
  if (!apiKey) return null;

  const prompt = `You are the AI engine for "Digital Dark Spot" (an AI-Assisted Information Gap Detection Platform).
Your job is not just to summarize, but specifically to find:
1. GAPS: Crucial unaddressed questions, omitted policies, missing requirements that the user needs to know.
2. CONTRADICTIONS: Clashing claims between Source A and Source B (e.g. deadlines, eligibility thresholds, documentation required).
3. OUTDATED WARNINGS: References to older years or previous application cycles that might mislead the applicant.
4. VERIFY NEXT: A prioritized checklist of actions the user MUST verify before proceeding, linked to evidence.
5. TRUST BREAKDOWN: Percentage of Sourced vs AI-inferred vs Uncertain.

Topic: ${topic}
Research Goal / Student Question: ${researchGoal}

Sources:
${sources.map((s, i) => `--- SOURCE ${i + 1}: ${s.title} (Date: ${s.date || 'Undated'}, URL: ${s.url}) ---
${s.content}
`).join('\n')}

Respond ONLY with a valid JSON object matching this schema:
{
  "structuredFacts": [
    { "category": "string", "summary": "string", "citations": [{ "statement": "string", "sourceTitle": "string", "sourceUrl": "string" }] }
  ],
  "contradictions": [
    {
      "id": "string",
      "title": "string",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM",
      "description": "string",
      "sourceA": { "title": "string", "url": "string", "claim": "string", "quote": "string" },
      "sourceB": { "title": "string", "url": "string", "claim": "string", "quote": "string" },
      "impact": "string"
    }
  ],
  "informationGaps": [
    {
      "id": "string",
      "title": "string",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM",
      "status": "UNANSWERED",
      "category": "string",
      "question": "string",
      "whyItMatters": "string",
      "recommendedAction": "string"
    }
  ],
  "outdatedWarnings": [
    {
      "id": "string",
      "sourceTitle": "string",
      "sourceUrl": "string",
      "publishedDate": "string",
      "outdatedSignal": "string",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM",
      "quote": "string",
      "risk": "string",
      "suggestedFix": "string"
    }
  ],
  "verifyChecklist": [
    {
      "id": "string",
      "priority": "CRITICAL" | "HIGH" | "MEDIUM",
      "title": "string",
      "action": "string",
      "sourceEvidence": { "sourceTitle": "string", "sourceUrl": "string", "excerpt": "string" },
      "targetEntity": "string",
      "completed": false
    }
  ],
  "trustDashboard": {
    "reliabilityScore": number,
    "statusText": "string",
    "breakdown": {
      "sourced": { "percentage": number, "label": "Sourced Evidence", "color": "#0d9488", "description": "string" },
      "aiInferred": { "percentage": number, "label": "AI Synthesized", "color": "#3b82f6", "description": "string" },
      "uncertain": { "percentage": number, "label": "Uncertain & Gaps", "color": "#f59e0b", "description": "string" }
    },
    "metrics": {
      "totalSources": number,
      "contradictionsFound": number,
      "gapsIdentified": number,
      "outdatedItems": number,
      "verifyActionsRequired": number
    }
  }
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      },
      { timeout: 25000 }
    );

    const textOutput = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textOutput) {
      const parsed = JSON.parse(textOutput);
      return {
        meta: {
          topic,
          researchGoal,
          analyzedAt: new Date().toISOString(),
          sourceCount: sources.length,
          engine: 'Gemini 1.5 Flash (LLM Grounded)'
        },
        sources,
        ...parsed
      };
    }
  } catch (err) {
    console.error('Gemini API call failed:', err.response?.data || err.message);
    throw err;
  }

  return null;
}
