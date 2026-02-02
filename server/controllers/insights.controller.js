import Message from "../models/Message.model.js";
import { generateAIResponse } from "../services/ai/gemma.service.js";
import { buildWeeklyReportPrompt } from "../services/insight.service.js";
import mongoose from "mongoose";

/* EMOTION STATS */
export const getEmotionStats = async (req, res) => {
  try {
    const stats = await Message.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          role: "user",
        },
      },
      {
        $group: {
          _id: { $ifNull: ["$emotion", "neutral"] },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};


/* EMOTION TIMELINE */
export const getEmotionTimeline = async (req, res) => {
  try {
    const timeline = await Message.find({
      userId: req.user, // ✅ FIXED
      role: "user",
      emotion: { $exists: true },
    })
      .sort({ createdAt: 1 })
      .select("emotion createdAt");

    res.json(timeline);
  } catch {
    res.status(500).json({ message: "Error fetching timeline" });
  }
};

/* WEEKLY REPORT */
export const getWeeklyReport = async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const messages = await Message.find({
      userId: req.user, // ✅ FIXED
      role: "user",
      createdAt: { $gte: weekAgo },
    }).select("emotion");

    if (!messages.length) {
      return res.json({ report: "No emotional data this week." });
    }

    const emotionCounts = {};
    messages.forEach((m) => {
      emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1;
    });

    const prompt = buildWeeklyReportPrompt(emotionCounts);

    const aiReport = await generateAIResponse([
      { role: "user", parts: [{ text: prompt }] },
    ]);

    res.json({ report: aiReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Report generation failed" });
  }
};
