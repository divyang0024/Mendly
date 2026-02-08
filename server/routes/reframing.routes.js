import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createReframingSession,
  getReframingStats,
  getReframingHistory,
  deleteReframingSession,
} from "../controllers/reframing.controller.js";

const router = express.Router();

router.post("/", protect, createReframingSession);
router.get("/stats", protect, getReframingStats);
router.get("/history", protect, getReframingHistory);
router.delete("/:id", protect, deleteReframingSession);

export default router;
