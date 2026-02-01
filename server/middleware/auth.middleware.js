// server/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { isBlacklisted } from "../utils/tokenBlacklist.js";

export const protect = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const token = auth.split(" ")[1];

  // If token is blacklisted -> refuse
  if (isBlacklisted(token)) {
    return res
      .status(401)
      .json({ message: "Token revoked. Please login again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Keep old behavior
    req.user = decoded.id;

    // 🔥 Add new consistent shape
    req.userId = decoded.id;

    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
