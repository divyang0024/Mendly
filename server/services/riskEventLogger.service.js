import RiskEvent from "../models/RiskEvent.model.js";

export const logRiskEvent = async ({
  userId,
  sessionId = null,
  source = "chat",
  level,
  emotion,
  text,
  intervention = null,
}) => {
  try {
    if (!level) return;

    await RiskEvent.create({
      userId,
      sessionId,
      source,
      level,
      emotion,
      text,
      intervention,
    });
  } catch (err) {
    console.error("RiskEvent logging failed:", err);
  }
};
