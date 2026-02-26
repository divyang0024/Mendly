import express from "express";
import {
  createOrUpdateCheckin,
  getTodayCheckin,
  getCheckinHistory,
  getCheckinStats,
  getCheckinStreak,
  getCheckinHeatmap,
} from "../controllers/dailyCheckin.controller.js";

import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

/* CREATE / UPDATE */
router.post("/", createOrUpdateCheckin);

/* TODAY */
router.get("/today", getTodayCheckin);

/* HISTORY */
router.get("/history", getCheckinHistory);

/* STATS */
router.get("/stats", getCheckinStats);

/* STREAK */
router.get("/streak", getCheckinStreak);

router.get("/heatmap", getCheckinHeatmap);

export default router;
