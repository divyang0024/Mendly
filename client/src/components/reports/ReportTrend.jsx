export default function ReportTrend({ trend }) {
  const color =
    trend.direction === "up"
      ? "text-green-600"
      : trend.direction === "down"
        ? "text-red-600"
        : "text-gray-500";

  const symbol =
    trend.direction === "up"
      ? "↑ Improving"
      : trend.direction === "down"
        ? "↓ Declining"
        : "→ Stable";

  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h3 className="font-semibold mb-2">Emotional Trend</h3>
      <p className={`text-xl font-bold ${color}`}>{symbol}</p>
      <p className="text-sm text-gray-500 mt-1">
        Change: {trend.delta.toFixed(2)}
      </p>
    </div>
  );
}
