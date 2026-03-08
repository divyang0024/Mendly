import mongoose from "mongoose";
import Message from "../models/Message.model.js";
import CopingSession from "../models/CopingSession.model.js";
import ActivationSession from "../models/ActivationSession.model.js";
import AffirmationSession from "../models/AffirmationSession.model.js";
import ReframingSession from "../models/ReframingSession.model.js";
import BreathingSession from "../models/BreathingSession.model.js";

/* ============================================================
   🧠 HIGHLIGHTS ENGINE
============================================================ */
const generateHighlights = ({
  trend,
  topEmotion,
  bestTool,
  copingUsage,
  triggers,
}) => {
  const highlights = [];

  // Trend
  if (trend.direction === "up") {
    highlights.push("Your emotional health is improving over time.");
  } else if (trend.direction === "down") {
    highlights.push("Your emotional state has been declining recently.");
  } else {
    highlights.push("Your emotional state has remained stable.");
  }

  // Top emotion — only if we actually have real data
  if (topEmotion) {
    if (topEmotion !== "neutral") {
      highlights.push(`You frequently experience ${topEmotion}.`);
    } else {
      highlights.push("Your most common emotional state is neutral.");
    }
  }

  // Best tool
  if (bestTool && bestTool !== "none") {
    highlights.push(
      `${bestTool} is currently your most effective coping tool.`,
    );
  }

  // Most used tool
  const mostUsed = Object.entries(copingUsage || {}).sort(
    (a, b) => b[1] - a[1],
  )[0];
  if (mostUsed?.[0]) {
    highlights.push(`You rely most on ${mostUsed[0]} for coping.`);
  }

  // Triggers
  if (triggers.length > 0) {
    highlights.push(`Frequent trigger detected: "${triggers[0].keyword}".`);
  }

  return highlights;
};

/* ============================================================
   🧠 MAIN LONG TERM SUMMARY BUILDER
============================================================ */
export const buildLongTermSummary = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  console.log("Building long term summary for:", objectId);

  /* ==============================
     1. TOTAL SESSIONS (ALL MODELS)
  ============================== */
  const [
    copingCount,
    activationCount,
    reframingCount,
    affirmationCount,
    breathingCount,
  ] = await Promise.all([
    CopingSession.countDocuments({ userId: objectId }),
    ActivationSession.countDocuments({ userId: objectId }),
    ReframingSession.countDocuments({ userId: objectId }),
    AffirmationSession.countDocuments({ userId: objectId }),
    BreathingSession.countDocuments({ userId: objectId }),
  ]);

  const totalSessions =
    copingCount +
    activationCount +
    reframingCount +
    affirmationCount +
    breathingCount;

  /* ==============================
     2. AVG EFFECTIVENESS (ALL TOOLS)
     — averages effectivenessScore across every tool session.
     Returned as avgMood (out of 5).
  ============================== */
  const [copingAgg, activationAgg, reframingAgg, affirmationAgg, breathingAgg] =
    await Promise.all([
      CopingSession.aggregate([
        { $match: { userId: objectId } },
        { $group: { _id: null, avg: { $avg: "$effectivenessScore" } } },
      ]),
      ActivationSession.aggregate([
        { $match: { userId: objectId, completed: true } },
        { $group: { _id: null, avg: { $avg: "$effectivenessScore" } } },
      ]),
      ReframingSession.aggregate([
        { $match: { userId: objectId } },
        { $group: { _id: null, avg: { $avg: "$effectivenessScore" } } },
      ]),
      AffirmationSession.aggregate([
        { $match: { userId: objectId } },
        { $group: { _id: null, avg: { $avg: "$effectivenessScore" } } },
      ]),
      BreathingSession.aggregate([
        { $match: { userId: objectId } },
        { $group: { _id: null, avg: { $avg: "$effectivenessScore" } } },
      ]),
    ]);

  const allEffectivenessScores = [
    copingAgg[0]?.avg,
    activationAgg[0]?.avg,
    reframingAgg[0]?.avg,
    affirmationAgg[0]?.avg,
    breathingAgg[0]?.avg,
  ].filter((v) => typeof v === "number");

  // avgMood = average effectivenessScore across all tool sessions (out of 5)
  // null when no sessions exist so UI shows "—" instead of 0
  const avgMood =
    allEffectivenessScores.length > 0
      ? Number(
          (
            allEffectivenessScores.reduce((a, b) => a + b, 0) /
            allEffectivenessScores.length
          ).toFixed(2),
        )
      : null;

  /* ==============================
     4. TOP EMOTION
     Groups messages by calendar day first, picks the dominant
     emotion per day, then counts how many days each emotion won.
     This prevents a single chatty day from skewing the result.

     Fix: $nin instead of duplicate $ne keys (JS silently drops one).
  ============================== */
  const emotionAgg = await Message.aggregate([
    {
      $match: {
        userId: objectId,
        emotion: { $exists: true, $nin: [null, "", "unknown", "neutral"] },
      },
    },
    /* bucket each message into a calendar day */
    {
      $group: {
        _id: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          emotion: "$emotion",
        },
        count: { $sum: 1 },
      },
    },
    /* keep only the dominant emotion per day */
    { $sort: { "_id.day": 1, count: -1 } },
    {
      $group: {
        _id: "$_id.day",
        topEmotion: { $first: "$_id.emotion" },
      },
    },
    /* count how many days each emotion was dominant */
    {
      $group: {
        _id: "$topEmotion",
        days: { $sum: 1 },
      },
    },
    { $sort: { days: -1 } },
    { $limit: 1 },
  ]);

  // null means "no emotion data" — UI shows "—" instead of fake "neutral"
  const topEmotion = emotionAgg.length > 0 ? emotionAgg[0]._id : null;

  /* ==============================
     5. BEST TOOL (highest avg effectiveness)
  ============================== */
  const toolScores = [];

  const pushScore = (name, agg) => {
    if (agg[0]?.avg != null) {
      toolScores.push({ tool: name, avg: agg[0].avg });
    }
  };

  pushScore("coping", copingAgg);
  pushScore("activation", activationAgg);
  pushScore("reframing", reframingAgg);
  pushScore("affirmation", affirmationAgg);
  pushScore("breathing", breathingAgg);

  toolScores.sort((a, b) => b.avg - a.avg);

  const bestTool = toolScores.length > 0 ? toolScores[0].tool : null;

  /* ==============================
     6. TREND (based on coping sessions)
  ============================== */
  const last20 = await CopingSession.find({ userId: objectId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const recent = last20.slice(0, 10);
  const previous = last20.slice(10, 20);

  const avgRecent =
    recent.length > 0
      ? recent.reduce((a, b) => a + (b.effectivenessScore || 0), 0) /
        recent.length
      : 0;

  const avgPrevious =
    previous.length > 0
      ? previous.reduce((a, b) => a + (b.effectivenessScore || 0), 0) /
        previous.length
      : 0;

  let direction = "stable";
  if (avgRecent > avgPrevious + 0.3) direction = "up";
  else if (avgRecent < avgPrevious - 0.3) direction = "down";

  const trend = {
    direction,
    delta: Number((avgRecent - avgPrevious).toFixed(2)),
  };

  /* ==============================
     7. TRIGGERS
  ============================== */
  const texts = await Message.find({ userId: objectId })
    .sort({ createdAt: -1 })
    .limit(50)
    .select("text")
    .lean();

  const stopWords = new Set([
    "that",
    "this",
    "with",
    "have",
    "from",
    "they",
    "been",
    "were",
    "will",
    "your",
    "what",
    "when",
    "just",
    "like",
    "about",
    "there",
    "their",
    "would",
    "could",
    "should",
    "really",
    "think",
    "feel",
    "know",
    "going",
    "want",
  ]);

  const wordCount = {};
  texts.forEach((m) => {
    const words = m.text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/);
    words.forEach((w) => {
      if (w.length < 4) return;
      if (stopWords.has(w)) return;
      wordCount[w] = (wordCount[w] || 0) + 1;
    });
  });

  const triggers = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, count]) => ({ keyword, count }));

  /* ==============================
     8. COPING USAGE
  ============================== */
  const copingUsage = {
    coping: copingCount,
    activation: activationCount,
    reframing: reframingCount,
    affirmation: affirmationCount,
    breathing: breathingCount,
  };

  /* ==============================
     9. GENERATE HIGHLIGHTS
  ============================== */
  const highlights = generateHighlights({
    trend,
    topEmotion,
    bestTool,
    copingUsage,
    triggers,
  });

  /* ==============================
     FINAL RESPONSE
  ============================== */
  return {
    summary: {
      totalSessions,
      avgMood, // avg effectivenessScore across all tool sessions (out of 5)
      topEmotion, // null if no emotion data exists
      bestTool, // null if no tool sessions exist
    },
    trend,
    triggers,
    copingUsage,
    highlights,
  };
};
