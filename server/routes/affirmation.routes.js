import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getAffirmation,
  saveAffirmationSession,
  getAffirmationStats,
  getAffirmationHistory,
} from "../controllers/affirmation.controller.js";

const router = express.Router();

router.post("/generate", protect, getAffirmation);
router.post("/save", protect, saveAffirmationSession);
router.get("/stats", protect, getAffirmationStats);
router.get("/history", protect, getAffirmationHistory);

export default router;
