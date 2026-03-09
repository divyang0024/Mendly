import api from "../../services/axios";

export const getRiskAssessment = () => api.get("/api/v1/risk/assessment");
export const getRiskSummary = () => api.get("/api/v1/risk/summary");
export const getRiskEvents = () => api.get("/api/v1/risk/events");