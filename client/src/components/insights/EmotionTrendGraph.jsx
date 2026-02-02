import { useEffect, useState } from "react";
import { getEmotionTimeline } from "../../features/insights/insights.api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Dot,
} from "recharts";

/* Position only */
const emotionRank = {
  calm: 1,
  neutral: 2,
  sad: 3,
  anxious: 4,
  angry: 5,
};

/* Colors that match meaning */
const emotionColor = {
  calm: "#22c55e", // green
  neutral: "#3b82f6", // blue
  sad: "#eab308", // yellow
  anxious: "#f97316", // orange
  angry: "#ef4444", // red
};

const emotionLabel = {
  1: "Calm",
  2: "Neutral",
  3: "Sad",
  4: "Anxious",
  5: "Angry",
};

export default function EmotionTrendGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getEmotionTimeline().then((res) => {
      const formatted = res.data.map((m) => ({
        time: new Date(m.createdAt).toLocaleString(), // date + time
        mood: emotionRank[m.emotion] || 2,
        emotion: m.emotion,
      }));
      setData(formatted);
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-lg mb-1">Your Emotional Journey</h3>
      <p className="text-sm text-gray-500 mb-4">
        Each point represents how you felt at that moment in a conversation.
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* TIME AXIS */}
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            angle={-20}
            textAnchor="end"
            height={60}
          />

          {/* EMOTION AXIS */}
          <YAxis
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v) => emotionLabel[v]}
            label={{
              value: "Emotional State",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip
            formatter={(value, name, props) => [
              props.payload.emotion.toUpperCase(),
              "Emotion",
            ]}
          />

          {/* LINE */}
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#94a3b8"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <Dot
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill={emotionColor[payload.emotion]}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* LEGEND */}
      {/* LEGEND */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 14 }}>
        {Object.entries(emotionColor).map(([emotion, color]) => (
          <div
            key={emotion}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: color, // 🔥 force color here
                display: "inline-block",
              }}
            />
            <span style={{ textTransform: "capitalize" }}>{emotion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
