import api from "../../services/axios";

export const generateAffirmation = (data) =>
  api.post(
    "/api/v1/affirmation/generate",
    data,
  );

export const saveAffirmationSession = (data) =>
  api.post("/api/v1/affirmation/save", data);

export const getAffirmationStats = () => api.get("/api/v1/affirmation/stats");

export const getAffirmationHistory = () =>
  api.get("/api/v1/affirmation/history");
