import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import { chatSocketHandler } from "./sockets/chat.socket.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

chatSocketHandler(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io };