import api from "../../services/axios";

export const getProgressOverview = () => {
  return api.get("https://mendly-quoe.onrender.com/api/v1/progress/overview");
};
