import Session from "../models/Session.model.js";
import Message from "../models/Message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAIResponse } from "../services/ai/gemma.service.js";

// Create new therapy session
export const createSession = asyncHandler(async (req, res) => {
  const session = await Session.create({ userId: req.user });
  res.status(201).json(session);
});

// Send message (user message only for now)
export const sendMessage = asyncHandler(async (req, res) => {
  const { sessionId, text } = req.body;

  // Save user message
  const userMsg = await Message.create({
    sessionId,
    userId: req.user,
    role: "user",
    text,
  });

  // Generate AI reply
  const aiText = await generateAIResponse(text);

  const aiMsg = await Message.create({
    sessionId,
    userId: req.user,
    role: "ai",
    text: aiText,
  });

  res.status(201).json({
    userMsg,
    aiMsg,
  });
});

// Get chat history
export const getHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;

  const messages = await Message.find({
    sessionId,
    userId: req.user,
  }).sort("createdAt");

  res.json(messages);
});

export const getUserSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ userId: req.user }).sort({
    lastMessageAt: -1,
  });

  res.json(sessions);
});
