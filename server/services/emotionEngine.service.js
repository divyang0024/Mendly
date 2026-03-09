import Message from "../models/Message.model.js";

/* Convert emotion → numeric intensity */
const emotionScale = {
  calm: 1,
  neutral: 2,
  sad: 3,
  anxious: 4,
  angry: 5,
};

/* -----------------------------
   GET EMOTIONAL PROFILE (last 7 days)
------------------------------*/
export const getRecentEmotionalProfile = async (userId) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const messages = await Message.find({
    userId,
    role: "user",
    createdAt: { $gte: weekAgo },
    emotion: { $exists: true },
  }).select("emotion");

  const counts = {};
  messages.forEach((m) => {
    counts[m.emotion] = (counts[m.emotion] || 0) + 1;
  });

  const total = messages.length || 1;

  const percentages = Object.fromEntries(
    Object.entries(counts).map(([e, c]) => [e, Math.round((c / total) * 100)]),
  );

  return { counts, percentages };
};

/* -----------------------------
   TREND DETECTION
------------------------------*/
export const getEmotionalTrend = async (userId) => {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(now.getDate() - 14);

  const recent = await Message.find({
    userId,
    role: "user",
    emotion: { $exists: true },
    createdAt: { $gte: weekAgo },
  });

  const past = await Message.find({
    userId,
    role: "user",
    emotion: { $exists: true },
    createdAt: { $gte: twoWeeksAgo, $lt: weekAgo },
  });

  const calcScore = (msgs) =>
    msgs.reduce((sum, m) => sum + (emotionScale[m.emotion] || 0), 0) /
    (msgs.length || 1);

  const recentScore = calcScore(recent);

  // 🚨 NEW LOGIC — No past data
  if (past.length === 0) {
    return {
      recentScore: recentScore.toFixed(2),
      pastScore: null,
      trend: "insufficient_history",
    };
  }

  const pastScore = calcScore(past);
  const diff = recentScore - pastScore;

  let trend = "stable";
  if (diff > 0.5) trend = "worsening";
  if (diff < -0.5) trend = "improving";

  return {
    recentScore: recentScore.toFixed(2),
    pastScore: pastScore.toFixed(2),
    trend,
  };
};


/* -----------------------------
   VOLATILITY SCORE
------------------------------*/
export const getEmotionalVolatility = async (userId) => {
  const messages = await Message.find({
    userId,
    role: "user",
    emotion: { $exists: true },
  })
    .sort({ createdAt: 1 })
    .limit(30);

  if (messages.length < 2) return { volatility: null }; // ✅ null = no data

  let changes = 0;
  for (let i = 1; i < messages.length; i++) {
    const diff =
      Math.abs(
        emotionScale[messages[i].emotion] -
          emotionScale[messages[i - 1].emotion],
      ) > 1;

    if (diff) changes++;
  }

  return {
    volatility: Math.round((changes / (messages.length - 1)) * 100), // ✅ correct denominator
  };
};
