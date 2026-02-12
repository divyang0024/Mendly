import BreathingSession from "../models/BreathingSession.model.js";
import CopingSession from "../models/CopingSession.model.js"; // grounding
import ReframingSession from "../models/ReframingSession.model.js";
import ActivationSession from "../models/ActivationSession.model.js";
import AffirmationSession from "../models/AffirmationSession.model.js";

export const getProgressImpact = async (userId) => {
  const uid = userId; // assuming req.user already contains ObjectId

  /* ========= FETCH ALL SESSIONS ========= */
  const [breathing, grounding, reframing, activation, affirmation] =
    await Promise.all([
      BreathingSession.find({ userId: uid, status: "completed" }).lean(),
      CopingSession.find({ userId: uid, type: "grounding" }).lean(),
      ReframingSession.find({ userId: uid }).lean(),
      ActivationSession.find({ userId: uid, completed: true }).lean(),
      AffirmationSession.find({ userId: uid }).lean(),
    ]);

  /* ========= COLLECT EFFECTIVENESS ========= */
  const effects = [];

  breathing.forEach((s) => effects.push(s.effectivenessScore || 0));
  grounding.forEach((s) => effects.push(s.effectivenessScore || 0));
  reframing.forEach((s) =>
    effects.push((s.emotionBefore ?? 0) - (s.emotionAfter ?? 0)),
  );
  activation.forEach((s) =>
    effects.push((s.moodBefore ?? 0) - (s.moodAfter ?? 0)),
  );
  affirmation.forEach((s) =>
    effects.push((s.confidenceAfter ?? 0) - (s.confidenceBefore ?? 0)),
  );

  const totalSessions = effects.length;
  const avgEffectiveness =
    totalSessions > 0 ? effects.reduce((a, b) => a + b, 0) / totalSessions : 0;

  /* ========= BEST TOOL ========= */
  const toolScores = {
    breathing: breathing.map((s) => s.effectivenessScore || 0),
    grounding: grounding.map((s) => s.effectivenessScore || 0),
    reframing: reframing.map(
      (s) => (s.emotionBefore ?? 0) - (s.emotionAfter ?? 0),
    ),
    activation: activation.map((s) => (s.moodBefore ?? 0) - (s.moodAfter ?? 0)),
    affirmation: affirmation.map(
      (s) => (s.confidenceAfter ?? 0) - (s.confidenceBefore ?? 0),
    ),
  };

  let bestTool = null;
  let bestAvg = -Infinity;

  Object.entries(toolScores).forEach(([tool, arr]) => {
    if (arr.length === 0) return;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestTool = tool;
    }
  });

  /* ========= TREND ========= */
  const recent = effects.slice(-5);
  const older = effects.slice(0, Math.max(0, effects.length - 5));

  let trend = "stable";
  if (recent.length && older.length) {
    const rAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const oAvg = older.reduce((a, b) => a + b, 0) / older.length;

    if (rAvg > oAvg + 0.5) trend = "improving";
    else if (rAvg < oAvg - 0.5) trend = "declining";
  }

  return {
    totalSessions,
    avgEffectiveness: Number(avgEffectiveness.toFixed(2)),
    bestTool,
    trend,
  };
};
