import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const emotionValue = {
  neutral: 0,
  calm: 1,
  sad: 2,
  anxious: 3,
  angry: 4,
};

const emotionLabel = {
  0: "Neutral",
  1: "Calm",
  2: "Sad",
  3: "Anxious",
  4: "Angry",
};

export default function MoodChart({ messages }) {
  const data = messages
    .filter((m) => m.role === "user")
    .map((m, i) => ({
      name: `Msg ${i + 1}`,
      mood: emotionValue[m.emotion] ?? 0,
      emotion: m.emotion,
    }));

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <h3 className="font-semibold mb-2">Mood Trend</h3>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="name" />

          {/* 🔥 Emotion Labels Instead of Numbers */}
          <YAxis
            domain={[0, 4]}
            ticks={[0, 1, 2, 3, 4]}
            tickFormatter={(value) => emotionLabel[value]}
          />

          <Tooltip
            formatter={(value, name, props) => [emotionLabel[value], "Mood"]}
          />

          <Line
            type="monotone"
            dataKey="mood"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
