import api from "../../services/axios";

export const saveCheckin = (data) =>
  api.post("https://mendly-quoe.onrender.com/api/v1/checkin", data);

export const getTodayCheckin = () => api.get("https://mendly-quoe.onrender.com/api/v1/checkin/today");

export const getCheckinHistory = () => api.get("https://mendly-quoe.onrender.com/api/v1/checkin/history");

export const getCheckinStats = () => api.get("https://mendly-quoe.onrender.com/api/v1/checkin/stats");

export const getCheckinStreak = () => api.get("https://mendly-quoe.onrender.com/api/v1/checkin/streak");

export const getCheckinHeatmap = () => api.get("https://mendly-quoe.onrender.com/api/v1/checkin/heatmap");