import api from "../../services/axios";

export const createActivationPlan = (data) =>
  api.post("/v1/activation/plan", data);

export const completeActivation = (id, data) =>
  api.put(`/v1/activation/complete/${id}`, data);

export const getActivationStats = () => api.get("/v1/activation/stats");

export const getActivationHistory = () => api.get("/v1/activation/history");
