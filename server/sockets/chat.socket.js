import { generateAIResponse } from "../services/ai/gemma.service.js";
import Message from "../models/Message.model.js";
import jwt from "jsonwebtoken";


export const chatSocketHandler = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // attach user id to socket
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("send_message", async ({ sessionId, text }) => {
      const userId = socket.userId; // ✅ comes from token

      const userMsg = await Message.create({
        sessionId,
        userId,
        role: "user",
        text,
      });

      socket.emit("user_message_saved", userMsg);

      socket.emit("ai_typing");

      const aiText = await generateAIResponse(text);

      const aiMsg = await Message.create({
        sessionId,
        userId,
        role: "ai",
        text: aiText,
      });

      socket.emit("ai_message", aiMsg);
    });
  });
};
