import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async (messages) => {
  console.log("Generating AI response with messages:", messages);
  const response = await ai.models.generateContent({
    model: "gemma-3-4b-it",
    contents: messages,
  });

  return response.text?.trim();
};
