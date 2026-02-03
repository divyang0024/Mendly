import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Session",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  role: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isSafety: {
    type: Boolean,
    default: false,
  },
  emotion: {
    type: String,
    enum: ["anxious", "sad", "angry", "calm", "neutral"],
    default: "neutral",
  },
  intervention: {
    type: Object,
    default: null,
  },
});

export default mongoose.model("Message", messageSchema);
