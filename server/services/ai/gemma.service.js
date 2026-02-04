import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// export const generateAIResponse = async (messages) => {
//   console.log("Generating AI response with messages:", messages);
//   const response = await ai.models.generateContent({
  //     model: "gemma-3-4b-it",
  //     contents: messages,
  //   });
  
  //   return response.text?.trim();
  // };
  
  export const generateAIResponse = async (messages) => {
      console.log("Generating AI response with messages:", messages);
    const contents = messages.map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: m.parts?.[0]?.text || "" }],
  }));

  const response = await ai.models.generateContent({
    model: "gemma-3-4b-it",
    contents,
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
};
