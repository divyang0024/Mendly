import CopingSession from "../models/CopingSession.model.js";
import Message from "../models/Message.model.js";

/**
 * Calculate risk signals from:
 * - Coping effectiveness trend
 * - Emotional volatility
 * - Recent negative emotion dominance
 */
export const analyzeRiskSignals = async (userId) => {
  /* =========================
     1️⃣ COPING EFFECTIVENESS
  ========================= */
  const recentCoping = await CopingSession.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  let avgEffectiveness = 0;
  if (recentCoping.length) {
    avgEffectiveness =
      recentCoping.reduce((sum, s) => sum + (s.effectivenessScore || 0), 0) /
      recentCoping.length;
  }

  /* =========================
     2️⃣ EMOTIONAL VOLATILITY
  ========================= */
  const messages = await Message.find({
    userId,
    role: "user",
    emotion: { $exists: true },
  })
    .sort({ createdAt: -1 })
    .limit(15)
    .lean();

  let volatility = 0;
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].emotion !== messages[i - 1].emotion) volatility++;
  }

  /* =========================
     3️⃣ DOMINANT NEGATIVE EMOTION
  ========================= */
  const negativeEmotions = ["sad", "anxious", "angry"];
  let negativeCount = messages.filter((m) =>
    negativeEmotions.includes(m.emotion),
  ).length;

  const negativeRatio = messages.length ? negativeCount / messages.length : 0;

  return {
    avgEffectiveness,
    volatility,
    negativeRatio,
  };
};

/**
 * Final Risk Computation
 */
export const computeRiskLevel = (signals) => {
  const { avgEffectiveness, volatility, negativeRatio } = signals;

  let score = 0;

  // low effectiveness increases risk
  if (avgEffectiveness < 1) score += 2;
  else if (avgEffectiveness < 2) score += 1;

  // emotional instability
  if (volatility >= 7) score += 2;
  else if (volatility >= 3) score += 1;

  // persistent negative emotions
  if (negativeRatio > 0.6) score += 2;
  else if (negativeRatio > 0.4) score += 1;

  if (score >= 4) return "high";
  if (score >= 2) return "moderate";
  return "low";
};

/**
 * Escalation Recommendation
 */
export const getEscalationPlan = (riskLevel) => {
  switch (riskLevel) {
    case "high":
      return {
        reason: "Sustained distress with low coping effectiveness",
        action: "Increase safety guidance and grounding interventions",
      };
    case "moderate":
      return {
        reason: "Rising emotional instability detected",
        action: "Use supportive + grounding therapist tone",
      };
    default:
      return {
        reason: "Stable emotional patterns",
        action: "Continue balanced supportive guidance",
      };
  }
};
