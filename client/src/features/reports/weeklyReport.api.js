import api from "../../services/axios";

/* GENERATE NEW REPORT */
export const generateWeeklyReport = () =>
  api.post("/api/v1/reports/generate");

/* GET LATEST REPORT */
export const getLatestWeeklyReport = () => api.get("/api/v1/reports/latest");

/* GET ALL REPORTS */
export const getAllWeeklyReports = () => api.get("/api/v1/reports/all");
