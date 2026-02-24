import { buildLongTermSummary } from "../services/longterm.service.js";

export const getLongTermSummary = async (req, res) => {
  try {
    const userId = req.user;

    const data = await buildLongTermSummary(userId);

    res.json(data);
  } catch (err) {
    console.error("Long term error:", err);
    res.status(500).json({ message: "Failed to build long term memory" });
  }
};
