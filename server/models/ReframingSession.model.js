import mongoose from "mongoose";

const reframingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },

    situation: {
      type: String,
      required: true,
    },

    automaticThought: {
      type: String,
      required: true,
    },

    emotionBefore: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    reframedThought: {
      type: String,
      required: true,
    },

    emotionAfter: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    effectivenessScore: Number, // before - after
  },
  { timestamps: true },
);

export default mongoose.model("ReframingSession", reframingSessionSchema);
