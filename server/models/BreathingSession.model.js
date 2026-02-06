// server/models/BreathingSession.model.js
import mongoose from "mongoose";

const breathingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional: associate with a chat Session if desired
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },

    // pattern chosen by user
    pattern: {
      type: String,
      enum: ["4-4-6", "box", "extended"],
      default: "4-4-6",
    },

    // measured when the exercise completes
    durationSec: {
      type: Number,
      default: 0,
    },

    // user self-rating before exercise (1-10)
    intensityBefore: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    // user self-rating after exercise (1-10) — may be null until complete
    intensityAfter: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },

    // derived: intensityBefore - intensityAfter (can be negative if got worse)
    effectivenessScore: {
      type: Number,
      default: null,
    },

    // status: "draft" when created by start endpoint, "completed" after finish
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default mongoose.model("BreathingSession", breathingSessionSchema);
