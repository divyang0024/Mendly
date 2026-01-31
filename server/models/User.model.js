// server/models/User.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  preferences: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
