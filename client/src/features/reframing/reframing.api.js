import api from "../../services/axios";

export const createReframingSession = (data) =>
  api.post("https://mendly-quoe.onrender.com/api/v1/reframing", data);

export const getReframingStats = () => api.get("https://mendly-quoe.onrender.com/api/v1/reframing/stats");

export const getReframingHistory = () => api.get("https://mendly-quoe.onrender.com/api/v1/reframing/history");

export const deleteReframingSession = (id) =>
  api.delete(`https://mendly-quoe.onrender.com/api/v1/reframing/${id}`);
