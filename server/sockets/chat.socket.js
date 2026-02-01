// server/sockets/chat.socket.js
import jwt from "jsonwebtoken";
import Message from "../models/Message.model.js";
import { generateAIResponse } from "../services/ai/gemma.service.js";

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
    // send_message handler: receive sessionId, text, tempId
    socket.on("send_message", async ({ sessionId, text, tempId }) => {
      try {
        const userId = socket.userId;

        // 1) Save user message to DB
        const userMsg = await Message.create({
          sessionId,
          userId,
          role: "user",
          text,
        });

        // 2) Emit user_message_saved back to the same client (echo tempId & sessionId)
        // Use socket.emit so only the sender receives it; if you want all clients in a session,
        // consider using io.to(sessionRoom).emit and join sockets to room on connection.
        socket.emit("user_message_saved", {
          ...userMsg.toObject(),
          tempId,
          sessionId,
        });

        // 3) Notify typing (include sessionId)
        socket.emit("ai_typing", { sessionId });

        // 4) Fetch latest history (most recent messages) and build memory
        const history = await Message.find({ sessionId })
          .sort({ createdAt: -1 }) // newest first
          .limit(12);

        const orderedHistory = history.reverse(); // oldest -> newest

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

        // 5) Generate AI response using the conversation memory
        const aiText = await generateAIResponse(modelMessages);

        // 6) Save AI message to DB
        const aiMsg = await Message.create({
          sessionId,
          userId,
          role: "ai",
          text: aiText || "I'm here with you. Could you tell me more?",
        });

        // 7) Emit ai_message to client (include sessionId)
        socket.emit("ai_message", {
          ...aiMsg.toObject(),
          sessionId,
        });
      } catch (err) {
        console.error("send_message error:", err);
        // inform client of error so UI can remove typing indicator etc.
        socket.emit("ai_message_error", {
          error: "Failed to process message",
          sessionId,
        });
      }
    });
  });
};
