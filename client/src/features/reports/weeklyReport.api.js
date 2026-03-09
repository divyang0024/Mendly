import api from "../../services/axios";

/* GENERATE NEW REPORT */
export const generateWeeklyReport = () =>
  api.post("https://mendly-quoe.onrender.com/api/v1/reports/generate");

/* GET LATEST REPORT */
export const getLatestWeeklyReport = () => api.get("https://mendly-quoe.onrender.com/api/v1/reports/latest");

/* GET ALL REPORTS */
export const getAllWeeklyReports = () => api.get("https://mendly-quoe.onrender.com/api/v1/reports/all");
