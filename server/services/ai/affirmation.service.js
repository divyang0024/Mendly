import { generateAIResponse } from "./gemma.service.js";

export const generateAffirmation = async (theme, intensity) => {
  const prompt = `
You are a therapeutic affirmation generator.

User emotional intensity: ${intensity}/10
Theme: ${theme}

Write ONE short, grounded affirmation.
Avoid toxic positivity.
1–2 sentences max.
Return only the affirmation text.
`;

  try {
    const res = await generateAIResponse([
      { role: "user", parts: [{ text: prompt }] },
    ]);
    return res.trim();
  } catch {
    return "You are allowed to move through this moment at your own pace.";
  }
};
