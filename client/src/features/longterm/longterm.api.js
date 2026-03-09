import api from "../../services/axios";

export const getLongTermSummary = () => {
  return api.get("https://mendly-quoe.onrender.com/api/v1/longterm/summary");
};
