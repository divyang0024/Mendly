import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  completeGroundingSession,
  getGroundingStats,
} from "../controllers/grounding.controller.js";

const router = express.Router();

router.post("/complete", protect, completeGroundingSession);
router.get("/stats", protect, getGroundingStats);

export default router;
