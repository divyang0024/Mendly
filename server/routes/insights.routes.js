import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getEmotionStats,
  getEmotionTimeline,
  getWeeklyReport,
} from "../controllers/insights.controller.js";

const router = express.Router();

router.get("/emotion-stats", protect, getEmotionStats);
router.get("/emotion-timeline", protect, getEmotionTimeline);
router.get("/weekly-report", protect, getWeeklyReport);

export default router;
