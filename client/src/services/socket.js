import { io } from "socket.io-client";

const BACKEND_URL = "https://mendly-quoe.onrender.com";

const socket = io(BACKEND_URL, {
  withCredentials: true,
  auth: (cb) => {
    cb({ token: localStorage.getItem("token") });
  },
});

socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
socket.on("connect_error", (err) =>
  console.error("❌ Socket error:", err.message),
);
socket.on("disconnect", (reason) =>
  console.log("🔌 Socket disconnected:", reason),
);

export default socket;
