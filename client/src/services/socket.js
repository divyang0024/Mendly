import { io } from "socket.io-client";

const BACKEND_URL = "https://mendly-ai.vercel.app" || "http://localhost:5000";

const socket = io(BACKEND_URL, {
  withCredentials: true,
  auth: { token: localStorage.getItem("token") },
});

export default socket;
