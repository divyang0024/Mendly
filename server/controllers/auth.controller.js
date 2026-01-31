// server/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addToBlacklist } from "../utils/tokenBlacklist.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const err = new Error("Name, email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const token = generateToken(user._id);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
  }

  const token = generateToken(user._id);

  res.json({
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
});

// GET /api/v1/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  res.json(user);
});

// POST /api/v1/auth/logout  (protected)
// For stateless JWTs we "revoke" the token by adding to blacklist
export const logout = asyncHandler(async (req, res) => {
  // req.token is set in protect middleware
  const token = req.token;
  if (token) {
    addToBlacklist(token);
  }
  res.json({ success: true, message: "Logged out" });
});
