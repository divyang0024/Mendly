import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createActivationPlan,
  completeActivation,
  getActivationStats,
  getActivationHistory,
} from "../controllers/activation.controller.js";

const router = express.Router();

router.post("/plan", protect, createActivationPlan);
router.put("/complete/:id", protect, completeActivation);
router.get("/stats", protect, getActivationStats);
router.get("/history", protect, getActivationHistory);

export default router;
