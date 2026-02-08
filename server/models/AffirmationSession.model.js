import mongoose from "mongoose";

const affirmationSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },

    theme: {
      type: String,
      enum: [
        "self-worth",
        "confidence",
        "anxiety-relief",
        "resilience",
        "motivation",
        "self-compassion",
      ],
      required: true,
    },

    affirmationText: {
      type: String,
      required: true,
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

    feltHelpful: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("AffirmationSession", affirmationSessionSchema);
