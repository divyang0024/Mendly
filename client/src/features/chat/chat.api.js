import api from "../../services/axios";

export const createSession = () =>
  api.post("https://mendly-quoe.onrender.com/api/v1/chat/session");

export const sendMessage = (data) => api.post("https://mendly-quoe.onrender.com/api/v1/chat/message", data);

export const getHistory = (sessionId) =>
  api.get("https://mendly-quoe.onrender.com/api/v1/chat/history", { params: { sessionId } });

export const getSessions = () => api.get("https://mendly-quoe.onrender.com/api/v1/chat/sessions");

export const deleteSession = (id) => api.delete(`https://mendly-quoe.onrender.com/api/v1/sessions/${id}`);
