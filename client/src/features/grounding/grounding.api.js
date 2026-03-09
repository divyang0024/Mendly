import api from "../../services/axios";

export const completeGroundingSession = (data) =>
  api.post("https://mendly-quoe.onrender.com/api/v1/grounding/complete", data);

export const getGroundingStats = () => api.get("https://mendly-quoe.onrender.com/api/v1/grounding/stats");
