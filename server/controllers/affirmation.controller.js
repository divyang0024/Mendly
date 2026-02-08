import AffirmationSession from "../models/AffirmationSession.model.js";
import { generateAffirmation } from "../services/ai/affirmation.service.js";

/* ===============================
   GENERATE AFFIRMATION
=============================== */
export const getAffirmation = async (req, res) => {
  try {
    const { theme, intensity } = req.body;

    if (!theme || typeof intensity !== "number") {
      return res.status(400).json({ message: "Theme and intensity required" });
    }

    const text = await generateAffirmation(theme, intensity);
    res.json({ affirmation: text });
  } catch {
    res.status(500).json({ message: "AI failed" });
  }
};

/* ===============================
   SAVE SESSION
=============================== */
export const saveAffirmationSession = async (req, res) => {
  try {
    const userId = req.user;

    const {
      sessionId = null,
      theme,
      affirmationText,
      intensityBefore,
      intensityAfter,
      feltHelpful,
    } = req.body;

    const effectivenessScore = intensityBefore - intensityAfter;

    const record = await AffirmationSession.create({
      userId,
      sessionId,
      theme,
      affirmationText,
      intensityBefore,
      intensityAfter,
      effectivenessScore,
      feltHelpful,
    });

    res.json({ success: true, record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Save failed" });
  }
};

/* ===============================
   STATS
=============================== */
export const getAffirmationStats = async (req, res) => {
  try {
    const userId = req.user; // keep your existing system

    const sessions = await AffirmationSession.find({ userId });

    const total = sessions.length;

    const avgEffectiveness =
      total === 0
        ? 0
        : sessions.reduce((sum, s) => sum + (s.effectivenessScore || 0), 0) /
          total;

    res.json({
      sessions: total,
      avgEffectiveness,
    });
  } catch (err) {
    console.error("Affirmation stats error:", err);
    res.status(500).json({ message: "Stats error" });
  }
};

/* ===============================
   HISTORY
=============================== */
export const getAffirmationHistory = async (req, res) => {
  try {
    const userId = req.user;

    const sessions = await AffirmationSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(sessions);
  } catch {
    res.status(500).json({ message: "History error" });
  }
};
