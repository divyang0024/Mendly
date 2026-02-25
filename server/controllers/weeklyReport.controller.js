import {
  buildWeeklyReportForUser,
  getLatestWeeklyReport,
  getAllWeeklyReports,
} from "../services/weeklyReportBuilder.service.js";

/* ============================================
   GENERATE REPORT (manual trigger)
============================================ */
export const generateWeeklyReport = async (req, res) => {
  try {
    const userId = req.user;

    const report = await buildWeeklyReportForUser(userId);

    res.json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("Weekly report error:", err);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

/* ============================================
   GET LATEST REPORT
============================================ */
export const getLatestReport = async (req, res) => {
  try {
    const userId = req.user;

    const report = await getLatestWeeklyReport(userId);

    res.json(report || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch report" });
  }
};

/* ============================================
   GET ALL REPORTS
============================================ */
export const getAllReports = async (req, res) => {
  try {
    const userId = req.user;

    const reports = await getAllWeeklyReports(userId);

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
