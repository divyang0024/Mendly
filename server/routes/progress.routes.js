import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProgressOverview } from "../controllers/progress.controller.js";

const router = express.Router();

router.get("/overview", protect, getProgressOverview);

export default router;
