import mongoose from "mongoose";

const riskEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: false,
    },

    source: {
      type: String,
      enum: ["chat", "checkin", "coping"],
      default: "chat",
    },

    level: {
      type: String,
      enum: ["low", "moderate", "high", "crisis"],
      required: true,
    },

    emotion: String,
    text: String,

    intervention: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RiskEvent", riskEventSchema);
