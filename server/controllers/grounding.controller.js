import mongoose from "mongoose";
import CopingSession from "../models/CopingSession.model.js";

/* ==============================
   SAVE GROUNDING SESSION
============================== */
export const completeGroundingSession = async (req, res) => {
  try {
    const userId = req.user; // ✅ FIX
    console.log(userId);
    const {
        sessionId = null,
        intensityBefore,
        intensityAfter,
        seen,
        felt,
        heard,
        smelled,
        tasted,
    } = req.body;
    
    if (
        typeof intensityBefore !== "number" ||
        typeof intensityAfter !== "number"
    ) {
        return res.status(400).json({ message: "Intensity values required" });
    }
    
    if (
        !Array.isArray(seen) ||
        !Array.isArray(felt) ||
        !Array.isArray(heard) ||
        !Array.isArray(smelled) ||
        !Array.isArray(tasted)
    ) {
        return res.status(400).json({ message: "All grounding fields required" });
    }
    
    const effectivenessScore = intensityBefore - intensityAfter;
    
    const record = await CopingSession.create({
        userId,
        sessionId,
        type: "grounding",
        payload: { seen, felt, heard, smelled, tasted },
        intensityBefore,
        intensityAfter,
        effectivenessScore,
    });
    
    res.json({ success: true, record });
} catch (err) {
    console.error("Grounding save error:", err);
    res.status(500).json({ message: "Failed to save grounding session" });
}
};

/* ==============================
   USER GROUNDING STATS
   ============================== */
   export const getGroundingStats = async (req, res) => {
       try {
           const userId = new mongoose.Types.ObjectId(req.user); // ✅ FIX
           console.log(userId);
           
           const stats = await CopingSession.aggregate([
               {
        $match: {
          userId,
          type: "grounding",
        },
      },
      {
        $group: {
          _id: null,
          sessions: { $sum: 1 },
          avgEffectiveness: { $avg: "$effectivenessScore" },
        },
      },
    ]);

    res.json(stats[0] || { sessions: 0, avgEffectiveness: 0 });
  } catch (err) {
    console.error("Grounding stats error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
