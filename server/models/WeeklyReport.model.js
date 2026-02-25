import mongoose from "mongoose";

const weeklyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    weekStart: {
      type: Date,
      required: true,
    },

    weekEnd: {
      type: Date,
      required: true,
    },

    summary: {
      totalSessions: Number,
      avgMood: Number,
      topEmotion: String,
      bestTool: String,
    },

    trend: {
      direction: String,
      delta: Number,
    },

    copingUsage: {
      type: Object,
      default: {},
    },

    triggers: [
      {
        keyword: String,
        count: Number,
      },
    ],

    highlights: [String],

    aiReportText: String, // full generated paragraph report
  },
  { timestamps: true },
);

export default mongoose.model("WeeklyReport", weeklyReportSchema);
