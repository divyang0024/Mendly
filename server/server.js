import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import { chatSocketHandler } from "./sockets/chat.socket.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://mendly-ai.vercel.app",
  "https://mendly-lovat.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  },
});

chatSocketHandler(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io };
