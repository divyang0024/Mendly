import api from "../../services/axios";

export const getProgressOverview = () => {
  return api.get("/api/v1/progress/overview");
};
