import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Session", sessionSchema);
