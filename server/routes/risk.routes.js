import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getRiskAssessment } from "../controllers/risk.controller.js";

const router = express.Router();

router.get("/assessment", protect, getRiskAssessment);

export default router;
