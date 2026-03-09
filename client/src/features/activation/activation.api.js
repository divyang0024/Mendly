import api from "../../services/axios";

export const createActivationPlan = (data) =>
  api.post("https://mendly-quoe.onrender.com/api/v1/activation/plan", data);

export const completeActivation = (id, data) =>
  api.put(`https://mendly-quoe.onrender.com/api/v1/activation/complete/${id}`, data);

export const getActivationStats = () => api.get("https://mendly-quoe.onrender.com/api/v1/activation/stats");

export const getActivationHistory = () => api.get("https://mendly-quoe.onrender.com/api/v1/activation/history");
