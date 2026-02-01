// server/sockets/chat.socket.js
import jwt from "jsonwebtoken";
import Message from "../models/Message.model.js";
import Session from "../models/Session.model.js";
import { generateAIResponse } from "../services/ai/gemma.service.js";

import { detectCrisis } from "../utils/crisisDetector.js";
import { safetyMessage } from "../utils/safetyResponse.js";


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
        const userMsg = await Message.create({
          sessionId,
          userId,
          role: "user",
          text,
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

        /* 4️⃣ Build memory */
        const history = await Message.find({ sessionId })
          .sort({ createdAt: -1 })
          .limit(12);

        const orderedHistory = history.reverse();

        const modelMessages = [
          {
            role: "user",
            parts: [
              {
                text: "You are a calm, supportive AI therapist. Help the user reflect and feel safe.",
              },
            ],
          },
          ...orderedHistory.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
        ];

        /* 5️⃣ Generate AI reply */
        const aiText = await generateAIResponse(modelMessages);

        const aiMsg = await Message.create({
          sessionId,
          userId,
          role: "ai",
          text: aiText || "I'm here with you. Could you tell me more?",
        });

        await Session.findByIdAndUpdate(sessionId, {
          lastMessageAt: new Date(),
        });

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
