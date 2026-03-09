import api from "../../services/axios";

export const generateAffirmation = (data) =>
  api.post(
    "https://mendly-quoe.onrender.com/api/v1/affirmation/generate",
    data,
  );

export const saveAffirmationSession = (data) =>
  api.post("https://mendly-quoe.onrender.com/api/v1/affirmation/save", data);

export const getAffirmationStats = () => api.get("https://mendly-quoe.onrender.com/api/v1/affirmation/stats");

export const getAffirmationHistory = () =>
  api.get("https://mendly-quoe.onrender.com/api/v1/affirmation/history");
