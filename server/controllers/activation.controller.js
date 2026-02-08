import ActivationSession from "../models/ActivationSession.model.js";

/* ==============================
   CREATE ACTIVITY PLAN
============================== */
export const createActivationPlan = async (req, res) => {
  try {
    const userId = req.user;

    const {
      sessionId = null,
      activityType,
      activityName,
      difficulty,
      moodBefore,
    } = req.body;

    const record = await ActivationSession.create({
      userId,
      sessionId,
      activityType,
      activityName,
      difficulty,
      moodBefore,
      completed: false,
    });

    res.json({ success: true, data: record });
  } catch (err) {
    console.error("createActivationPlan error:", err);
    res.status(500).json({ message: "Failed to create activity plan" });
  }
};

/* ==============================
   COMPLETE ACTIVITY
============================== */
export const completeActivation = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const { moodAfter, reflection } = req.body;

    const rec = await ActivationSession.findOne({ _id: id, userId });

    if (!rec) return res.status(404).json({ message: "Not found" });

    rec.completed = true;
    rec.moodAfter = moodAfter;
    rec.reflection = reflection;
    rec.effectivenessScore = rec.moodBefore - moodAfter;

    await rec.save();

    res.json({ success: true, data: rec });
  } catch (err) {
    console.error("completeActivation error:", err);
    res.status(500).json({ message: "Failed to complete activity" });
  }
};

/* ==============================
   STATS
============================== */
export const getActivationStats = async (req, res) => {
  try {
    const userId = req.user; // YOUR setup is correct

    // get all completed sessions
    const sessions = await ActivationSession.find({
      userId,
      completed: true,
    });

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
    console.error("Activation stats error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};


/* ==============================
   RECENT ACTIVITIES
============================== */
export const getActivationHistory = async (req, res) => {
  try {
    const userId = req.user;

    const history = await ActivationSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);
  } catch {
    res.status(500).json({ message: "Error fetching history" });
  }
};
