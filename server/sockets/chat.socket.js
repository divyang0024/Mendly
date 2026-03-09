// server/sockets/chat.socket.js
import jwt from "jsonwebtoken";
import Message from "../models/Message.model.js";
import Session from "../models/Session.model.js";
import { generateAIResponse } from "../services/ai/gemma.service.js";
import { safetyMessage } from "../utils/safetyResponse.js";
import { buildTherapistPrompt } from "../services/therapistEngine.service.js";
import { analyzeMentalState } from "../services/ai/mentalState.service.js";
import { validateMentalState } from "../utils/mentalStateValidator.js";
import { logRiskEvent } from "../services/riskEventLogger.service.js";

export const chatSocketHandler = (io) => {
  // Authenticate every socket connection with JWT
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
    socket.on("join_session", (sessionId) => {
      if (sessionId) socket.join(sessionId);
    });

    socket.on("leave_session", (sessionId) => {
      if (sessionId) socket.leave(sessionId);
    });

    socket.on("send_message", async ({ sessionId, text, tempId }) => {
      if (!sessionId || !text) {
        socket.emit("ai_message_error", {
          error: "Invalid payload",
          sessionId,
        });
        return;
      }

      try {
        const userId = socket.userId;

        // 0) Mental state analysis
        let aiStateRaw = null;
        try {
          aiStateRaw = await analyzeMentalState(text);
        } catch (e) {
          console.error("analyzeMentalState error:", e);
        }

        // 1) Validate/canonicalize
        const { emotion, crisis, therapistMode, intervention } =
          validateMentalState(aiStateRaw);

        // 2) Risk logging
        let riskLevel = "low";
        if (crisis) riskLevel = "crisis";
        else if (intervention === "grounding" || intervention === "breathing")
          riskLevel = "high";
        else if (
          emotion === "sad" ||
          emotion === "angry" ||
          emotion === "anxious"
        )
          riskLevel = "moderate";

        await logRiskEvent({
          userId,
          sessionId,
          source: "chat",
          level: riskLevel,
          emotion,
          text,
          intervention,
        });

        // 3) Save user message
        const userMsg = await Message.create({
          sessionId,
          userId,
          role: "user",
          text,
          emotion,
        });

        // 4) Validate session ownership
        const session = await Session.findById(sessionId);
        if (!session) {
          socket.emit("ai_message_error", {
            error: "Session not found",
            sessionId,
          });
          return;
        }
        if (session.userId && session.userId.toString() !== userId.toString()) {
          socket.emit("ai_message_error", {
            error: "Not authorized for this session",
            sessionId,
          });
          return;
        }

        // Ensure socket is in the room
        socket.join(sessionId);

        // 5) Update session title if placeholder
        if (!session.title || session.title === "New Session") {
          await Session.findByIdAndUpdate(sessionId, {
            title: text.trim().slice(0, 120),
          });
        }

        // 6) Echo user message back to sender
        socket.emit("user_message_saved", {
          ...userMsg.toObject(),
          tempId,
          sessionId,
        });

        // 7) Update session activity
        await Session.findByIdAndUpdate(sessionId, {
          lastMessageAt: new Date(),
        });

        // 8) Crisis override
        if (crisis) {
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

        // 9) Typing indicator
        socket.emit("ai_typing", { sessionId });

        // 10) Build conversation history
        const history = await Message.find({ sessionId })
          .sort({ createdAt: -1 })
          .limit(12);
        const orderedHistory = history.reverse().map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

        // 11) Build prompt
        const modelMessages = buildTherapistPrompt(
          therapistMode,
          orderedHistory,
        );

        // 12) Generate AI response
        let aiText;
        try {
          aiText = await generateAIResponse(modelMessages);
        } catch (aiErr) {
          console.error("generateAIResponse error:", aiErr);
          // ✅ Fix: only emit ai_message_error, no duplicate ai_message
          socket.emit("ai_message_error", {
            error: "AI generation failed",
            sessionId,
          });
          return;
        }

        // 13) Save AI message
        const aiMsg = await Message.create({
          sessionId,
          userId,
          role: "ai",
          text: aiText || "I'm here with you.",
          intervention: intervention || null,
        });

        // 14) Update session activity
        await Session.findByIdAndUpdate(sessionId, {
          lastMessageAt: new Date(),
        });

        // 15) Emit AI message
        socket.emit("ai_message", {
          ...aiMsg.toObject(),
          sessionId,
          intervention: intervention || null,
        });
      } catch (err) {
        console.error("send_message error:", err);
        // ✅ Fix: emit ai_message_error so frontend clears typing indicator
        socket.emit("ai_message_error", {
          error: "Something went wrong",
          sessionId,
        });
      }
    });
  });
};
