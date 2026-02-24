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

  // Top emotion
  if (topEmotion && topEmotion !== "neutral") {
    highlights.push(`You frequently experience ${topEmotion}.`);
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

  if (mostUsed && mostUsed[0]) {
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

  const allAverages = [
    copingAgg[0]?.avg,
    activationAgg[0]?.avg,
    reframingAgg[0]?.avg,
    affirmationAgg[0]?.avg,
    breathingAgg[0]?.avg,
  ].filter((v) => typeof v === "number");

  const avgMood =
    allAverages.length > 0
      ? allAverages.reduce((a, b) => a + b, 0) / allAverages.length
      : 0;

  /* ==============================
     3. TOP EMOTION
  ============================== */
  const emotionAgg = await Message.aggregate([
    { $match: { userId: objectId, emotion: { $exists: true } } },
    {
      $group: {
        _id: "$emotion",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  const topEmotion = emotionAgg.length ? emotionAgg[0]._id : "neutral";

  /* ==============================
     4. BEST TOOL (ALL)
  ============================== */

  const toolScores = [];

  const pushScore = (name, agg) => {
    if (agg[0]?.avg !== undefined) {
      toolScores.push({ tool: name, avg: agg[0].avg });
    }
  };

  pushScore("coping", copingAgg);
  pushScore("activation", activationAgg);
  pushScore("reframing", reframingAgg);
  pushScore("affirmation", affirmationAgg);
  pushScore("breathing", breathingAgg);

  toolScores.sort((a, b) => b.avg - a.avg);

  const bestTool = toolScores.length ? toolScores[0].tool : "none";

  /* ==============================
     5. TREND (based on coping sessions)
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
     6. TRIGGERS
  ============================== */
  const texts = await Message.find({ userId: objectId })
    .sort({ createdAt: -1 })
    .limit(50)
    .select("text")
    .lean();

  const wordCount = {};

  texts.forEach((m) => {
    const words = m.text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/);

    words.forEach((w) => {
      if (w.length < 4) return;
      wordCount[w] = (wordCount[w] || 0) + 1;
    });
  });

  const triggers = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, count]) => ({ keyword, count }));

  /* ==============================
     7. COPING USAGE
  ============================== */

  const copingUsage = {};

  copingUsage["coping"] = copingCount;
  copingUsage["activation"] = activationCount;
  copingUsage["reframing"] = reframingCount;
  copingUsage["affirmation"] = affirmationCount;
  copingUsage["breathing"] = breathingCount;

  /* ==============================
     8. GENERATE HIGHLIGHTS
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
      avgMood,
      topEmotion,
      bestTool,
    },
    trend,
    triggers,
    copingUsage,
    highlights,
  };
};
