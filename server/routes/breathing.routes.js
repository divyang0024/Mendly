// server/routes/breathing.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  startBreathingSession,
  completeBreathingSession,
  getBreathingStats,
  getRecentBreathing,
  deleteBreathingSession,
} from "../controllers/breathing.controller.js";

const router = express.Router();

router.post("/start", protect, startBreathingSession);
router.post("/complete", protect, completeBreathingSession);
router.get("/stats", protect, getBreathingStats);
router.get("/recent", protect, getRecentBreathing);
router.delete("/:id", protect, deleteBreathingSession);

export default router;
