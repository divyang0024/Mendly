import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async (text) => {
  const response = await ai.models.generateContent({
    model: "gemma-3-4b-it",
    contents: `You are a supportive AI therapist.
Respond calmly, empathetically, and help the user reflect.

User: ${text}`,
  });

  return response.text;
};
