import mongoose from "mongoose";

const dailyCheckinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    mood: {
      type: Number, // 1–10
      required: true,
    },

    energy: {
      type: Number, // 1–10
      required: true,
    },

    stress: {
      type: Number, // 1–10
      required: true,
    },

    sleepHours: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    tags: {
      type: [String], // optional triggers or events
      default: [],
    },
  },
  { timestamps: true },
);

/* One entry per day per user */
dailyCheckinSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyCheckin", dailyCheckinSchema);
