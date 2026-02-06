import api from "../../services/axios";

/* Step 2 → create draft */
export const startBreathingSession = (data) =>
  api.post("/api/v1/breathing/start", data);

/* Step 5 → complete session */
export const completeBreathingSession = (data) =>
  api.post("/api/v1/breathing/complete", data);

/* Stats dashboard */
export const getBreathingStats = () => api.get("/api/v1/breathing/stats");
