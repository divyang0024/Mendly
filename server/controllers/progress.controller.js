import { getProgressImpact } from "../services/progressImpact.service.js";

export const getProgressOverview = async (req, res) => {
  try {
    const userId = req.user; // your middleware already sets this

    const data = await getProgressImpact(userId);

    res.json(data);
  } catch (err) {
    console.error("Progress impact error:", err);
    res.status(500).json({ message: "Failed to compute progress impact" });
  }
};
