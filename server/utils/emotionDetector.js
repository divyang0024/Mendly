import { emotionMap } from "./emotionKeywords.js";

export const detectEmotion = (text) => {
  if (!text) return "neutral";

  const lower = text.toLowerCase();

  for (const [emotion, words] of Object.entries(emotionMap)) {
    if (words.some((w) => lower.includes(w))) {
      return emotion;
    }
  }

  return "neutral";
};
