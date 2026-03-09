import api from "../../services/axios";

export const registerUser = (data) => api.post("/api/v1/auth/register", data);

export const loginUser = (data) => api.post("/api/v1/auth/login", data);

export const getMe = () => api.get("/api/v1/auth/me");

export const logoutUser = () => api.post("/api/v1/auth/logout");
