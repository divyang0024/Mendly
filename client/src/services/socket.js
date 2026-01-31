import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  auth: {
    token: localStorage.getItem("token"), // send JWT
  },
});

export default socket;
