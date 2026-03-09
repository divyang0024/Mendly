import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(BACKEND_URL, {
  withCredentials: true,
  auth: (cb) => {
    // called each time socket (re)connects — token is always fresh
    cb({ token: localStorage.getItem("token") });
  },
});

export default socket;
