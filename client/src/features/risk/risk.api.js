import api from "../../services/axios";

export const getRiskAssessment = () => api.get("https://mendly-quoe.onrender.com/api/v1/risk/assessment");
export const getRiskSummary = () => api.get("https://mendly-quoe.onrender.com/api/v1/risk/summary");
export const getRiskEvents = () => api.get("https://mendly-quoe.onrender.com/api/v1/risk/events");