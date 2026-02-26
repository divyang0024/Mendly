import DailyCheckin from "../models/DailyCheckin.model.js";
import mongoose from "mongoose";

/* =========================================
   HELPER
========================================= */
const todayString = () => {
  return new Date().toISOString().split("T")[0];
};

/* =========================================
   CREATE OR UPDATE CHECKIN
========================================= */
export const createOrUpdateCheckin = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const {
      mood,
      energy,
      stress,
      sleepHours = 0,
      notes = "",
      tags = [],
    } = req.body;

    if (!mood || !energy || !stress) {
      return res
        .status(400)
        .json({ message: "Mood, energy and stress required" });
    }

    const date = todayString();

    const checkin = await DailyCheckin.findOneAndUpdate(
      { userId, date },
      {
        mood,
        energy,
        stress,
        sleepHours,
        notes,
        tags,
      },
      { upsert: true, new: true },
    );

    res.json({ success: true, checkin });
  } catch (err) {
    console.error("checkin save error", err);
    res.status(500).json({ message: "Failed to save checkin" });
  }
};

/* =========================================
   GET TODAY CHECKIN
========================================= */
export const getTodayCheckin = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);
    const date = todayString();

    const checkin = await DailyCheckin.findOne({ userId, date });

    res.json(checkin || null);
  } catch (err) {
    res.status(500).json({ message: "Error fetching today checkin" });
  }
};

/* =========================================
   GET HISTORY (LAST 30 DAYS)
========================================= */
export const getCheckinHistory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const history = await DailyCheckin.find({ userId })
      .sort({ date: -1 })
      .limit(30);

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

/* =========================================
   GET STATS (AVERAGES)
========================================= */
export const getCheckinStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const stats = await DailyCheckin.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          avgMood: { $avg: "$mood" },
          avgEnergy: { $avg: "$energy" },
          avgStress: { $avg: "$stress" },
          avgSleep: { $avg: "$sleepHours" },
          totalDays: { $sum: 1 },
        },
      },
    ]);

    res.json(
      stats[0] || {
        avgMood: 0,
        avgEnergy: 0,
        avgStress: 0,
        avgSleep: 0,
        totalDays: 0,
      },
    );
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

/* =========================================
   STREAK CALCULATION
========================================= */
export const getCheckinStreak = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const history = await DailyCheckin.find({ userId })
      .sort({ date: -1 })
      .select("date")
      .lean();

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < history.length; i++) {
      const checkDate = new Date(history[i].date);

      const diff = (currentDate - checkDate) / (1000 * 60 * 60 * 24);

      if (Math.floor(diff) === 0 || Math.floor(diff) === 1) {
        streak++;
        currentDate = checkDate;
      } else break;
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ message: "Error calculating streak" });
  }
};

export const getCheckinHeatmap = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const since = new Date();
    since.setDate(since.getDate() - 90);

    const data = await DailyCheckin.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: since },
        },
      },

      // group by DATE only (strip time)
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          avgMood: { $avg: "$mood" },
          avgEnergy: { $avg: "$energy" },
          avgStress: { $avg: "$stress" },
        },
      },

      // convert to single intensity score
      {
        $project: {
          _id: 1,
          avgIntensity: {
            $divide: [
              {
                $add: [
                  "$avgMood",
                  "$avgEnergy",
                  { $multiply: ["$avgStress", -1] },
                ],
              },
              2,
            ],
          },
        },
      },

      { $sort: { _id: 1 } },
    ]);

    console.log("Heatmap result:", data);

    res.json(data);
  } catch (err) {
    console.error("Heatmap error:", err);
    res.status(500).json({ message: "Heatmap fetch failed" });
  }
};