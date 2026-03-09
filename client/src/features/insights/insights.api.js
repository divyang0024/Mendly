import api from "../../services/axios";

export const getEmotionStats = () =>
  api.get("https://mendly-quoe.onrender.com/api/v1/insights/emotion-stats");

export const getEmotionTimeline = () =>
  api.get("https://mendly-quoe.onrender.com/api/v1/insights/emotion-timeline");

export const getWeeklyReport = () => api.get("https://mendly-quoe.onrender.com/api/v1/insights/weekly-report");

export const getEmotionalProfile = () => api.get("https://mendly-quoe.onrender.com/api/v1/insights/profile");
export const getTrend = () => api.get("https://mendly-quoe.onrender.com/api/v1/insights/trend");
export const getVolatility = () => api.get("https://mendly-quoe.onrender.com/api/v1/insights/volatility");
