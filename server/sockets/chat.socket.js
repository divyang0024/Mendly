import jwt from "jsonwebtoken";
import Message from "../models/Message.model.js";
import Session from "../models/Session.model.js";
import { generateAIResponse } from "../services/ai/gemma.service.js";

import { detectCrisis } from "../utils/crisisDetector.js";
import { detectEmotion } from "../utils/emotionDetector.js";
import { safetyMessage } from "../utils/safetyResponse.js";

import {
  getTherapistMode,
  buildTherapistPrompt,
} from "../services/therapistEngine.service.js";

import {
  getRecentEmotionalProfile,
  getEmotionalTrend,
  getEmotionalVolatility,
} from "../services/insight.service.js";

/* ✅ NEW */
import { getIntervention } from "../services/interventionEngine.service.js";

export const chatSocketHandler = (io) => {
  /* ================= AUTH ================= */
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("send_message", async ({ sessionId, text, tempId }) => {
      try {
        const userId = socket.userId;

        /* 1️⃣ USER MESSAGE SAVE */
        const emotion = detectEmotion(text);

        const userMsg = await Message.create({
          sessionId,
          userId,
          role: "user",
          text,
          emotion,
        });

        const session = await Session.findById(sessionId);
        if (session.title === "New Session") {
          await Session.findByIdAndUpdate(sessionId, {
            title: text.slice(0, 40),
          });
        }

        socket.emit("user_message_saved", {
          ...userMsg.toObject(),
          tempId,
          sessionId,
        });

        await Session.findByIdAndUpdate(sessionId, {
          lastMessageAt: new Date(),
        });

        /* 🚨 2️⃣ CRISIS CHECK (UNCHANGED) */
        if (detectCrisis(text)) {
          const aiMsg = await Message.create({
            sessionId,
            userId,
            role: "ai",
            text: safetyMessage,
            isSafety: true,
          });

          socket.emit("ai_message", {
            ...aiMsg.toObject(),
            sessionId,
            isSafety: true,
          });
          return;
        }

        /* 3️⃣ TYPING */
        socket.emit("ai_typing", { sessionId });

        /* 4️⃣ EMOTIONAL STATE SIGNALS */
        const profile = await getRecentEmotionalProfile(userId);
        const trendData = await getEmotionalTrend(userId);
        const volatilityData = await getEmotionalVolatility(userId);

        const safeProfile = profile?.percentages || {};
        const safeTrend = trendData?.trend || "stable";

        const rawVol =
          typeof volatilityData?.volatility === "number"
            ? volatilityData.volatility
            : 0;

        let volatilityLevel = "low";
        if (rawVol >= 7) volatilityLevel = "high";
        else if (rawVol >= 3) volatilityLevel = "medium";

        const dominantEmotion =
          Object.entries(safeProfile).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          emotion ||
          "neutral";

        /* 🔥 5️⃣ INTERVENTION SELECTION */
        const intervention = getIntervention({
          currentEmotion: emotion,
          dominantEmotion,
          trend: safeTrend,
          volatilityLevel,
        });

        /* 6️⃣ THERAPIST MODE */
        const mode = getTherapistMode(
          { dominantEmotion },
          safeTrend,
          volatilityLevel,
        );

        /* 7️⃣ MEMORY */
        const history = await Message.find({ sessionId })
          .sort({ createdAt: -1 })
          .limit(12);

        const orderedHistory = history.reverse().map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

        /* 8️⃣ PROMPT BUILD */
        const modelMessages = buildTherapistPrompt(mode, orderedHistory);

        /* 9️⃣ AI REPLY */
        const aiText = await generateAIResponse(modelMessages);

        /* 🔟 SAVE AI MESSAGE WITH INTERVENTION */
        const aiMsg = await Message.create({
          sessionId,
          userId,
          role: "ai",
          text: aiText || "I'm here with you. Could you tell me more?",
          intervention, // 🔥 stored
        });

        await Session.findByIdAndUpdate(sessionId, {
          lastMessageAt: new Date(),
        });

        socket.emit("ai_message", {
          ...aiMsg.toObject(),
          sessionId,
          intervention, // 🔥 sent to frontend
        });
      } catch (err) {
        console.error("send_message error:", err);

        socket.emit("ai_message", {
          _id: "error-" + Date.now(),
          role: "ai",
          text: "I'm having trouble responding right now. Please try again.",
          sessionId,
        });
      }
    });
  });
};
