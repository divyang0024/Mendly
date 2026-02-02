import Message from "../models/Message.model.js";

export const buildWeeklyReportPrompt = (emotionCounts) => {
    
  return `
You are a supportive AI mental health assistant.

User emotional activity this week:
${Object.entries(emotionCounts)
  .map(([emotion, count]) => `${emotion}: ${count} times`)
  .join("\n")}

Write a short, gentle psychological reflection.
Do NOT diagnose.
Focus on patterns and encouragement.
`;
};

/* ===============================
   1️⃣ RECENT EMOTIONAL PROFILE
   =============================== */
export const getRecentEmotionalProfile = async (userId) => {
    
  const messages = await Message.find({
    userId,
    role: "user",
    emotion: { $exists: true },
  })
    .sort({ createdAt: -1 })
    .limit(30)
    .select("emotion");

  if (!messages.length) {
    return { percentages: {} };
  }

  const counts = {};
  messages.forEach((m) => {
    counts[m.emotion] = (counts[m.emotion] || 0) + 1;
  });

  const total = messages.length;
  const percentages = {};
  for (const key in counts) {
    percentages[key] = Math.round((counts[key] / total) * 100);
  }

  return { percentages };
};

/* ===============================
   2️⃣ EMOTIONAL TREND
   =============================== */
export const getEmotionalTrend = async (userId) => {
    
  const messages = await Message.find({
    userId,
    role: "user",
    emotion: { $exists: true },
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("emotion");

  if (messages.length < 4) {
    return { trend: "stable" };
  }

  const score = {
    calm: 1,
    neutral: 2,
    sad: 3,
    anxious: 4,
    angry: 5,
  };

  const half = Math.floor(messages.length / 2);
  const recent = messages.slice(0, half);
  const past = messages.slice(half);

  const avg = (arr) =>
    arr.reduce((sum, m) => sum + (score[m.emotion] || 2), 0) / arr.length;

  const recentAvg = avg(recent);
  const pastAvg = avg(past);

  if (recentAvg > pastAvg + 0.5) return { trend: "declining" };
  if (recentAvg < pastAvg - 0.5) return { trend: "improving" };
  return { trend: "stable" };
};

/* ===============================
   3️⃣ EMOTIONAL VOLATILITY
   =============================== */
export const getEmotionalVolatility = async (userId) => {
    
  const messages = await Message.find({
    userId,
    role: "user",
    emotion: { $exists: true },
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("emotion");

  if (messages.length < 3) {
    return { volatility: 0 };
  }

  const score = {
    calm: 1,
    neutral: 2,
    sad: 3,
    anxious: 4,
    angry: 5,
  };

  let changes = 0;
  for (let i = 1; i < messages.length; i++) {
    if (score[messages[i].emotion] !== score[messages[i - 1].emotion]) {
      changes++;
    }
  }
// console.log("Volatility Changes:", changes,score,messages);
  const volatility = Math.round((changes / messages.length) * 100);
  return { volatility };
};

