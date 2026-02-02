import { useEffect, useState } from "react";
import { getEmotionStats } from "../../features/insights/insights.api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  calm: "#4ade80",
  neutral: "#60a5fa",
  sad: "#facc15",
  anxious: "#fb923c",
  angry: "#f87171",
};

export default function EmotionPieChart() {
  const [data, setData] = useState([]);
  const [dominant, setDominant] = useState(null);
  const [totalConvos, setTotalConvos] = useState(0);

  useEffect(() => {
    getEmotionStats().then((res) => {
      const total = res.data.reduce((sum, e) => sum + e.count, 0);
      setTotalConvos(total);

      const formatted = res.data.map((e) => ({
        name: e._id,
        value: e.count,
      }));

      setData(formatted);

      const top = [...formatted].sort((a, b) => b.value - a.value)[0];
      setDominant(top);
    });
  }, []);

  // 🔥 Custom label for slices
  const renderLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-lg mb-1">Emotional Composition</h3>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of emotions across your <strong>{totalConvos}</strong>{" "}
        recent conversations.
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={110}
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.name] || "#ccc"} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v} conversations`} />
        </PieChart>
      </ResponsiveContainer>

      {dominant && totalConvos > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
          <strong>Most frequent emotion:</strong>{" "}
          <span style={{ color: COLORS[dominant.name] }}>{dominant.name}</span>{" "}
          ({Math.round((dominant.value / totalConvos) * 100)}% of your{" "}
          {totalConvos} conversations)
          <p className="text-gray-600 mt-1">
            This suggests this emotion has been present often in your recent
            chats. Identifying patterns behind it can help improve emotional
            awareness.
          </p>
        </div>
      )}
    </div>
  );
}
