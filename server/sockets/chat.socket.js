// server/sockets/chat.socket.js
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

/**
 * chatSocketHandler(io)
 * - Auth middleware: verifies JWT from socket.handshake.auth.token and attaches userId to socket
 * - send_message handler expects: { sessionId, text, tempId }
 * - Emits:
 *    - "user_message_saved": { ...dbMessage, tempId, sessionId }
 *    - "ai_typing": { sessionId }
 *    - "ai_message": { ...dbAiMessage, sessionId }
 */
export const chatSocketHandler = (io) => {
  // socket auth
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("send_message", async ({ sessionId, text, tempId }) => {
      try {
        const userId = socket.userId;

        /* 1️⃣ Save user message */
        const emotion = detectEmotion(text);

        const userMsg = await Message.create({
          sessionId,
          userId,
          role: "user",
          text,
          emotion, // 🔥 store detected emotion
        });

        // Set session title from first message
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

        /* 🚨 2️⃣ SAFETY CHECK */
        const isCrisis = detectCrisis(text);

        if (isCrisis) {
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

          return; // STOP normal AI reply
        }

        /* 3️⃣ AI typing indicator */
        socket.emit("ai_typing", { sessionId });

        /* 4️⃣ Emotional State (Adaptive Engine) */
        const profile = await getRecentEmotionalProfile(userId);
        const trendData = await getEmotionalTrend(userId);
        const volatilityData = await getEmotionalVolatility(userId);

        // sanitize responses from insight services
        const safeProfile =
          profile && profile.percentages ? profile : { percentages: {} };
        const safeTrend =
          trendData && trendData.trend ? trendData.trend : "stable";

        // volatility: prefer raw "changes" (integer). Normalize to a simple low/medium/high scale.
        const rawVol =
          typeof (volatilityData && volatilityData.volatility) === "number"
            ? volatilityData.volatility
            : 0;

        // map rawVol → level. Adjust thresholds after you collect real telemetry.
        let volatilityLevel = "low";
        if (rawVol >= 7)
          volatilityLevel = "high"; // many shifts in a short history
        else if (rawVol >= 3) volatilityLevel = "medium";

        // Determine dominant emotion: prefer profile top, else fallback to current message emotion, else neutral.
        const dominantEmotion =
          Object.entries(safeProfile.percentages).sort(
            (a, b) => b[1] - a[1],
          )[0]?.[0] ||
          emotion || // fallback to the emotion detected from the current text
          "neutral";

        // debug log (remove or turn off in production)
        console.log("Intervention inputs:", {
          dominantEmotion,
          profile: safeProfile.percentages,
          trend: safeTrend,
          rawVol,
          volatilityLevel,
        });

        // now call your mode function with safe inputs
        const mode = getTherapistMode(
          { dominantEmotion },
          safeTrend,
          volatilityLevel,
        );

        // console.log(
        //   "Therapist Mode:",
        //   dominantEmotion
        // );
        /* 5️⃣ Build conversation memory */
        const history = await Message.find({ sessionId })
          .sort({ createdAt: -1 })
          .limit(12);

        const orderedHistory = history.reverse().map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

        /* 6️⃣ Build Adaptive Prompt */
        const modelMessages = buildTherapistPrompt(mode, orderedHistory);

        /* 7️⃣ Generate AI reply */
        const aiText = await generateAIResponse(modelMessages);
        /* 8️⃣ Save AI message */
        const aiMsg = await Message.create({
          sessionId,
          userId,
          role: "ai",
          text: aiText || "I'm here with you. Could you tell me more?",
        });

        /* 9️⃣ Update session activity */
        await Session.findByIdAndUpdate(sessionId, {
          lastMessageAt: new Date(),
        });

        /* 🔟 Emit AI message */
        socket.emit("ai_message", {
          ...aiMsg.toObject(),
          sessionId,
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
