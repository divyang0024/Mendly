import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createSession,
  sendMessage,
  getHistory,
  getUserSessions
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/session", protect, createSession);
router.post("/message", protect, sendMessage);
router.get("/history", protect, getHistory);
router.get("/sessions", protect, getUserSessions);

export default router;
