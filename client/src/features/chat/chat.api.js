import api from "../../services/axios";

export const createSession = () => api.post("/api/v1/chat/session");

export const sendMessage = (data) => api.post("/api/v1/chat/message", data);

export const getHistory = (sessionId) =>
  api.get("/api/v1/chat/history", { params: { sessionId } });

export const getSessions = () => api.get("/api/v1/chat/sessions");
