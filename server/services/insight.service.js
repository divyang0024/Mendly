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
