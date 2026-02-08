import mongoose from "mongoose";

const activationSessionSchema = new mongoose.Schema(
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

    activityType: {
      type: String,
      enum: [
        "physical",
        "social",
        "creative",
        "productive",
        "self-care",
        "outdoor",
        "learning",
      ],
      required: true,
    },

    activityName: {
      type: String,
      required: true,
    },

    difficulty: {
      type: Number, // 1–5 effort rating
      min: 1,
      max: 5,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    moodBefore: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    moodAfter: {
      type: Number,
      min: 1,
      max: 10,
    },

    effectivenessScore: Number, // moodBefore - moodAfter

    reflection: String, // optional journal note
  },
  { timestamps: true },
);

export default mongoose.model("ActivationSession", activationSessionSchema);
