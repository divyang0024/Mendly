import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import insightRoutes from "./routes/insights.routes.js";
import breathingRoutes from "./routes/breathing.routes.js";
import groundingRoutes from "./routes/grounding.routes.js";
import reframingRoutes from "./routes/reframing.routes.js";
import affirmationRoutes from "./routes/affirmation.routes.js";
import activationRoutes from "./routes/activation.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import riskRoutes from "./routes/risk.routes.js";
import longtermRoutes from "./routes/longterm.routes.js";
import weeklyReportRoutes from "./routes/weeklyReport.routes.js";
import checkinRoutes from "./routes/dailyCheckin.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const allowedOrigins = [
  "https://mendly-ai.vercel.app",
  "https://mendly-lovat.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/v1/insights", insightRoutes);
app.use("/api/v1/breathing", breathingRoutes);
app.use("/api/v1/grounding", groundingRoutes);
app.use("/api/v1/reframing", reframingRoutes);
app.use("/api/v1/affirmation", affirmationRoutes);
app.use("/api/v1/activation", activationRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/risk", riskRoutes);
app.use("/api/v1/longterm", longtermRoutes);
app.use("/api/v1/reports", weeklyReportRoutes);
app.use("/api/v1/checkin", checkinRoutes);

app.get("/", (req, res) => {
  res.send("AI Therapist API running...");
});

app.use(errorHandler);

export default app;
