import WeeklyReport from "../models/WeeklyReport.model.js";
import { buildLongTermSummary } from "./longterm.service.js";
import { generateWeeklyAIReport } from "./weeklyReport.service.js";

/* ============================================================
   BUILD WEEKLY REPORT
============================================================ */
export const buildWeeklyReportForUser = async (userId) => {
  const now = new Date();
  const weekEnd = new Date(now);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const longTermData = await buildLongTermSummary(userId);

  // ✅ Require at least 3 sessions AND some emotion data before generating
  const hasEnoughData =
    longTermData.summary.totalSessions >= 3 &&
    longTermData.summary.topEmotion !== null;

  if (!hasEnoughData) {
    return null;
  }

  const aiReportText = await generateWeeklyAIReport(longTermData);

  const report = await WeeklyReport.create({
    userId,
    weekStart,
    weekEnd,
    summary: longTermData.summary,
    trend: longTermData.trend,
    copingUsage: longTermData.copingUsage,
    triggers: longTermData.triggers,
    highlights: longTermData.highlights,
    aiReportText,
  });

  return report;
};

/* ============================================================
   GET LATEST REPORT
============================================================ */
export const getLatestWeeklyReport = async (userId) => {
  return WeeklyReport.findOne({ userId }).sort({ createdAt: -1 });
};

/* ============================================================
   GET ALL REPORTS
============================================================ */
export const getAllWeeklyReports = async (userId) => {
  return WeeklyReport.find({ userId }).sort({ createdAt: -1 });
};
