import { generateAIResponse } from "./ai/gemma.service.js";

export const generateWeeklyAIReport = async (data) => {
  const { summary, trend, copingUsage, triggers, highlights } = data;

  const prompt = `
You are an empathetic mental health assistant.

Generate a weekly emotional progress report based on the following data.

DATA:
- Total sessions: ${summary.totalSessions}
- Average mood improvement: ${summary.avgMood.toFixed(2)}
- Top emotion: ${summary.topEmotion}
- Best coping tool: ${summary.bestTool}
- Trend: ${trend.direction} (${trend.delta})

Coping usage:
${Object.entries(copingUsage)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}

Triggers:
${triggers.map((t) => `${t.keyword} (${t.count})`).join(", ")}

Highlights:
${highlights.join(", ")}

Write a warm, supportive, human-readable weekly reflection in 120-180 words.
`;

  const response = await generateAIResponse([
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ]);

  return response;
};
