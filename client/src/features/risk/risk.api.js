import api from "../../services/axios";

export const getRiskAssessment = () => api.get("/api/v1/risk/assessment");
