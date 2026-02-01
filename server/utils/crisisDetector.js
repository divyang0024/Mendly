import { crisisKeywords } from "./crisisKeywords.js";

export const detectCrisis = (text) => {
  if (!text) return false;

  const lower = text.toLowerCase();

  return crisisKeywords.some((keyword) => lower.includes(keyword));
};
