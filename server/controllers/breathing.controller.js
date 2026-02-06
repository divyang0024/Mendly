// server/controllers/breathing.controller.js
import BreathingSession from "../models/BreathingSession.model.js";
import mongoose from "mongoose";

/* ================= START SESSION ================= */
export const startBreathingSession = async (req, res) => {
  try {
    const userId = req.user; // 🔥 FIXED

    const { sessionId = null, pattern = "4-4-6", intensityBefore } = req.body;

    if (typeof intensityBefore !== "number") {
      return res
        .status(400)
        .json({ message: "intensityBefore (number 1-10) is required" });
    }

    const rec = await BreathingSession.create({
      userId,
      sessionId,
      pattern,
      intensityBefore,
      status: "draft",
    });

    res.json({ success: true, data: rec });
  } catch (err) {
    console.error("startBreathingSession error:", err);
    res.status(500).json({ message: "Failed to start breathing session" });
  }
};

/* ================= COMPLETE SESSION ================= */
export const completeBreathingSession = async (req, res) => {
  try {
    const userId = req.user; // 🔥 FIXED
    const {
      breathingSessionId,
      sessionId = null,
      pattern = "4-4-6",
      durationSec,
      intensityBefore,
      intensityAfter,
    } = req.body;

    if (typeof durationSec !== "number") {
      return res.status(400).json({ message: "durationSec required" });
    }

    if (
      typeof intensityBefore !== "number" ||
      typeof intensityAfter !== "number"
    ) {
      return res.status(400).json({ message: "Intensity values required" });
    }

    const effectivenessScore = intensityBefore - intensityAfter;

    if (breathingSessionId) {
      const rec = await BreathingSession.findOne({
        _id: breathingSessionId,
        userId,
      });

      if (!rec) return res.status(404).json({ message: "Session not found" });

      rec.pattern = pattern;
      rec.durationSec = durationSec;
      rec.intensityAfter = intensityAfter;
      rec.effectivenessScore = effectivenessScore;
      rec.status = "completed";

      await rec.save();
      return res.json({ success: true, data: rec });
    }

    const rec = await BreathingSession.create({
      userId,
      sessionId,
      pattern,
      durationSec,
      intensityBefore,
      intensityAfter,
      effectivenessScore,
      status: "completed",
    });

    res.json({ success: true, data: rec });
  } catch (err) {
    console.error("completeBreathingSession error:", err);
    res.status(500).json({ message: "Failed to complete breathing session" });
  }
};

/* ================= STATS ================= */
export const getBreathingStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user); // 🔥 FIXED

    const agg = await BreathingSession.aggregate([
      { $match: { userId, status: "completed" } },
      {
        $group: {
          _id: null,
          sessions: { $sum: 1 },
          avgEffectiveness: { $avg: "$effectivenessScore" },
        },
      },
    ]);

    const summary = agg[0] || { sessions: 0, avgEffectiveness: 0 };

    const recent = await BreathingSession.find({
      userId,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    res.json({
      sessions: summary.sessions,
      avgEffectiveness: summary.avgEffectiveness || 0,
      recent,
    });
  } catch (err) {
    console.error("getBreathingStats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};

/* ================= RECENT ================= */
export const getRecentBreathing = async (req, res) => {
  try {
    const userId = req.user; // 🔥 FIXED

    const recent = await BreathingSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(recent);
  } catch (err) {
    res.status(500).json({ message: "Failed to load sessions" });
  }
};

/* ================= DELETE ================= */
export const deleteBreathingSession = async (req, res) => {
  try {
    const userId = req.user; // 🔥 FIXED
    const { id } = req.params;

    const rec = await BreathingSession.findOne({ _id: id, userId });
    if (!rec) return res.status(404).json({ message: "Not found" });

    await BreathingSession.deleteOne({ _id: id });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Failed to delete" });
  }
};
