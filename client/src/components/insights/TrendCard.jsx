import { useEffect, useState } from "react";
import { getTrend } from "../../features/insights/insights.api";

export default function TrendCard() {
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    getTrend().then((res) => setTrend(res.data));
  }, []);

  if (!trend) return null;

  // 🚨 Handle insufficient history
  if (trend.trend === "insufficient_history") {
    return (
      <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3 style={{ fontWeight: 600 }}>Emotional Trend</h3>
        <p style={{ marginTop: 10 }}>
          Not enough past data yet. Keep chatting to unlock trend insights.
        </p>
        <small>Recent mood score: {trend.recentScore}</small>
      </div>
    );
  }

  const color =
    trend.trend === "improving"
      ? "#22c55e"
      : trend.trend === "worsening"
        ? "#ef4444"
        : "#6b7280";

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
      <h3 style={{ fontWeight: 600 }}>Emotional Trend</h3>
      <p style={{ color, fontSize: 18, marginTop: 8 }}>
        {trend.trend.toUpperCase()}
      </p>
      <small>
        Recent mood score: {trend.recentScore} vs past: {trend.pastScore}
      </small>
    </div>
  );
}
