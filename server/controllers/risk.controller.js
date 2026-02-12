import {
  analyzeRiskSignals,
  computeRiskLevel,
  getEscalationPlan,
} from "../services/riskEngine.service.js";

export const getRiskAssessment = async (req, res) => {
  try {
    const userId = req.user; // your middleware attaches userId directly

    const signals = await analyzeRiskSignals(userId);
    const riskLevel = computeRiskLevel(signals);
    const escalation = getEscalationPlan(riskLevel);

    res.json({
      riskLevel,
      signals,
      escalation,
    });
  } catch (err) {
    console.error("Risk assessment error:", err);
    res.status(500).json({ message: "Risk assessment failed" });
  }
};
