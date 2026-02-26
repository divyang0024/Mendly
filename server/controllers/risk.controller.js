import {
  analyzeRiskSignals,
  computeRiskLevel,
  getEscalationPlan,
} from "../services/riskEngine.service.js";
import RiskEvent from "../models/RiskEvent.model.js";
import mongoose from "mongoose";

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

/* ========================================
   GET RECENT RISK EVENTS
======================================== */
export const getRiskEvents = async (req, res) => {
  try {
    const userId = req.user;

    const events = await RiskEvent.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch risk events" });
  }
};

/* ========================================
   GET RISK SUMMARY
======================================== */
export const getRiskSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const agg = await RiskEvent.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      low: 0,
      moderate: 0,
      high: 0,
      crisis: 0,
    };

    agg.forEach((r) => {
      summary[r._id] = r.count;
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Failed to get risk summary" });
  }
};
