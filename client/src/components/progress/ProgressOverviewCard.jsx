import { useEffect, useState } from "react";
import { getProgressOverview } from "../../features/progress/progress.api";

const trendConfig = {
  improving: { label: "Improving", color: "text-green-600", icon: "↑" },
  stable: { label: "Stable", color: "text-yellow-600", icon: "→" },
  declining: { label: "Declining", color: "text-red-600", icon: "↓" },
};

export default function ProgressOverviewCard({ refresh }) {
  const [data, setData] = useState({
    totalSessions: 0,
    avgEffectiveness: 0,
    bestTool: null,
    trend: "stable",
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await getProgressOverview();
      setData(res.data);
    };
    fetch();
  }, [refresh]);

  const trend = trendConfig[data.trend] || trendConfig.stable;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Overall Therapeutic Progress</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-500">Total Sessions</p>
          <p className="text-xl font-bold">{data.totalSessions}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-500">Avg Effectiveness</p>
          <p className="text-xl font-bold">
            {data.avgEffectiveness.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded col-span-2">
          <p className="text-gray-500">Best Performing Tool</p>
          <p className="text-lg font-semibold capitalize">
            {data.bestTool || "—"}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded col-span-2">
          <p className="text-gray-500">Emotional Trend</p>
          <p className={`text-lg font-semibold ${trend.color}`}>
            {trend.icon} {trend.label}
          </p>
        </div>
      </div>
    </div>
  );
}
