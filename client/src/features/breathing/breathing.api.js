import api from "../../services/axios";

/* Step 2 → create draft */
export const startBreathingSession = (data) =>
  api.post("https://mendly-quoe.onrender.com/api/v1/breathing/start", data);

/* Step 5 → complete session */
export const completeBreathingSession = (data) =>
  api.post("https://mendly-quoe.onrender.com/api/v1/breathing/complete", data);

/* Stats dashboard */
export const getBreathingStats = () => api.get("https://mendly-quoe.onrender.com/api/v1/breathing/stats");
