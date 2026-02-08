import ReframingSession from "../models/ReframingSession.model.js";

/* ==============================
   CREATE REFRAMING SESSION
============================== */
export const createReframingSession = async (req, res) => {
  try {
    const userId = req.user;

    const {
      sessionId = null,
      situation,
      automaticThought,
      emotionBefore,
      reframedThought,
      emotionAfter,
    } = req.body;

    if (
      !situation ||
      !automaticThought ||
      !reframedThought ||
      typeof emotionBefore !== "number" ||
      typeof emotionAfter !== "number"
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const effectivenessScore = emotionBefore - emotionAfter;

    const record = await ReframingSession.create({
      userId,
      sessionId,
      situation,
      automaticThought,
      emotionBefore,
      reframedThought,
      emotionAfter,
      effectivenessScore,
    });

    res.json({ success: true, record });
  } catch (err) {
    console.error("Create reframing error:", err);
    res.status(500).json({ message: "Failed to save session" });
  }
};

/* ==============================
   USER REFRAMING STATS
============================== */
export const getReframingStats = async (req, res) => {
  try {
    const userId = req.user;

    const stats = await ReframingSession.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          sessions: { $sum: 1 },
          avgEffectiveness: { $avg: "$effectivenessScore" },
        },
      },
    ]);

    res.json(stats[0] || { sessions: 0, avgEffectiveness: 0 });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

/* ==============================
   USER HISTORY
============================== */
export const getReframingHistory = async (req, res) => {
  try {
    const userId = req.user;

    const sessions = await ReframingSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

/* ==============================
   DELETE SESSION
============================== */
export const deleteReframingSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.pas;

    const rec = await ReframingSession.findOne({ _id: id, userId });
    if (!rec) return res.status(404).json({ message: "Not found" });

    await ReframingSession.deleteOne({ _id: id });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
