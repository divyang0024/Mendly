import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getLongTermSummary } from "../controllers/longterm.controller.js";

const router = express.Router();

router.get("/summary", protect, getLongTermSummary);

export default router;
