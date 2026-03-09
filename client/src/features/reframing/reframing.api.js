import api from "../../services/axios";

export const createReframingSession = (data) =>
  api.post("/api/v1/reframing", data);

export const getReframingStats = () => api.get("/api/v1/reframing/stats");

export const getReframingHistory = () => api.get("/api/v1/reframing/history");

export const deleteReframingSession = (id) =>
  api.delete(`/api/v1/reframing/${id}`);
