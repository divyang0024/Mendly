import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getRiskAssessment,
  getRiskEvents,
  getRiskSummary,
} from "../controllers/risk.controller.js";

const router = express.Router();

router.get("/assessment", protect, getRiskAssessment);
router.get("/events", protect, getRiskEvents);
router.get("/summary", protect, getRiskSummary);

export default router;
