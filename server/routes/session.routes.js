import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { deleteSession } from "../controllers/session.controller.js";

const router = express.Router();

/* DELETE SESSION */
router.delete("/:id", protect, deleteSession);

export default router;
