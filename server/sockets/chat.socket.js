// server/sockets/chat.socket.js
import jwt from "jsonwebtoken";
import Message from "../models/Message.model.js";
import Session from "../models/Session.model.js";
import { generateAIResponse } from "../services/ai/gemma.service.js";

import { safetyMessage } from "../utils/safetyResponse.js";
import { buildTherapistPrompt } from "../services/therapistEngine.service.js";

import { analyzeMentalState } from "../services/ai/mentalState.service.js";
import { validateMentalState } from "../utils/mentalStateValidator.js";

/**
 * chatSocketHandler(io)
 * - Expects socket.handshake.auth.token (JWT)
 * - Listens: "send_message" with { sessionId, text, tempId }
 * - Emits:
 *    - "user_message_saved" -> { ...dbUserMsg, tempId, sessionId }
 *    - "ai_typing" -> { sessionId }
 *    - "ai_message" -> { ...dbAiMsg, sessionId, intervention?, isSafety? }
 *    - "ai_message_error" -> { error, sessionId }
 */
export const chatSocketHandler = (io) => {
  // Authenticate socket connections with JWT and attach userId
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // decoded should contain { id, ... }
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    // Optional: allow socket to join session rooms later when client requests it.
    socket.on("join_session", (sessionId) => {
      if (sessionId) socket.join(sessionId);
    });

    socket.on("leave_session", (sessionId) => {
      if (sessionId) socket.leave(sessionId);
    });

    socket.on("send_message", async ({ sessionId, text, tempId }) => {
      // basic input validation
      if (!sessionId || !text) {
        socket.emit("ai_message_error", {
          error: "Invalid payload",
          sessionId,
        });
        return;
      }

      try {
        const userId = socket.userId;

        // 0) Run AI mental-state analysis (may return null on parse failure)
        let aiStateRaw = null;
        try {
          aiStateRaw = await analyzeMentalState(text);
        } catch (e) {
          console.error("analyzeMentalState error:", e);
          aiStateRaw = null;
        }

        // 1) Validate/canonicalize mental state (validator must return an object fallback)
        const { emotion, crisis, therapistMode, intervention } =
          validateMentalState(aiStateRaw);
        console.log("Validated mental state:", {
          emotion,
          crisis,
          therapistMode,
          intervention,
        });
        // 2) Save the user message (include emotion if present)
        const userMsg = await Message.create({
          sessionId,
          userId,
          role: "user",
          text,
          emotion,
        });

        // 3) Ensure session exists and belongs to the user
        const session = await Session.findById(sessionId);
        if (!session) {
          // remove the saved message to avoid orphan? Alternatively keep it and return error.
          // For now we notify client and stop.
          socket.emit("ai_message_error", {
            error: "Session not found",
            sessionId,
          });
          return;
        }
        // If sessions are always per-user, enforce ownership
        if (session.userId && session.userId.toString() !== userId.toString()) {
          socket.emit("ai_message_error", {
            error: "Not authorized for this session",
            sessionId,
          });
          return;
        }

        // If this socket hasn't joined the session room, join it (optional)
        socket.join(sessionId);

        // 4) Optionally set the session title if it's the placeholder
        if (!session.title || session.title === "New Session") {
          const title = text.trim().slice(0, 120);
          await Session.findByIdAndUpdate(sessionId, { title });
        }

        // 5) Echo saved user message back to client (sender).
        // If you prefer broadcasting to all clients in session: use io.to(sessionId).emit(...)
        socket.emit("user_message_saved", {
          ...userMsg.toObject(),
          tempId,
          sessionId,
        });

        // 6) Update session activity
        await Session.findByIdAndUpdate(sessionId, {
          lastMessageAt: new Date(),
        });

        // 7) Crisis override — if AI signalled crisis, send safety message (and stop)
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
          return; // do not continue to normal AI reply
        }

        // 8) Inform client to display typing indicator
        socket.emit("ai_typing", { sessionId });

        // 9) Build conversation memory (most recent messages)
        const history = await Message.find({ sessionId })
          .sort({ createdAt: -1 })
          .limit(12);

        const orderedHistory = history.reverse().map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

        // 10) Build the prompt using therapistMode returned by AI
        // Ensure buildTherapistPrompt accepts therapistMode and orderedHistory
        const modelMessages = buildTherapistPrompt(
          therapistMode,
          orderedHistory,
        );

        // 11) Ask AI for a reply. Catch AI errors separately to provide meaningful client events.
        let aiText;
        try {
          aiText = await generateAIResponse(modelMessages);
        } catch (aiErr) {
          console.error("generateAIResponse error:", aiErr);
          // notify frontend to remove typing and show error state
          socket.emit("ai_message_error", {
            error: "AI generation failed",
            sessionId,
          });
          // Optionally emit fallback AI message:
          socket.emit("ai_message", {
            _id: "error-" + Date.now(),
            role: "ai",
            text: "I'm having trouble responding right now. Please try again later.",
            sessionId,
          });
          return;
        }

        // 12) Save AI message (store whatever intervention object came from AI validator)
        const aiMsg = await Message.create({
          sessionId,
          userId,
          role: "ai",
          text: aiText || "I'm here with you.",
          intervention: intervention || null,
        });

        // 13) Update session last activity again
        await Session.findByIdAndUpdate(sessionId, {
          lastMessageAt: new Date(),
        });

        // 14) Emit AI message back to client (and include intervention)
        socket.emit("ai_message", {
          ...aiMsg.toObject(),
          sessionId,
          intervention: intervention || null,
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
