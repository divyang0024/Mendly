import express from "express";
import {
  generateWeeklyReport,
  getLatestReport,
  getAllReports,
} from "../controllers/weeklyReport.controller.js";

import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", protect, generateWeeklyReport);
router.get("/latest", protect, getLatestReport);
router.get("/all", protect, getAllReports);

export default router;
