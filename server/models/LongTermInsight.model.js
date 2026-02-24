import mongoose from "mongoose";

const longTermInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    highlights: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("LongTermInsight", longTermInsightSchema);
