import api from "../../services/axios";

export const getEmotionStats = () => api.get("/api/v1/insights/emotion-stats");

export const getEmotionTimeline = () =>
  api.get("/api/v1/insights/emotion-timeline");

export const getWeeklyReport = () => api.get("/api/v1/insights/weekly-report");
