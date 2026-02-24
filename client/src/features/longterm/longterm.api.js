import api from "../../services/axios";

export const getLongTermSummary = () => {
  return api.get("api/v1/longterm/summary");
};
