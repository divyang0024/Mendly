import mongoose from "mongoose";

const copingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    type: {
      type: String,
      enum: [
        "breathing",
        "grounding",
        "reframing",
        "affirmation",
        "activation",
      ],
      required: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed, // tool-specific data
    },

    intensityBefore: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    intensityAfter: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    effectivenessScore: Number, // before - after
  },
  { timestamps: true },
);

export default mongoose.model("CopingSession", copingSessionSchema);
