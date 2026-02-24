export default function TrendCard({ trend }) {
  const directionMap = {
    up: "Improving",
    down: "Declining",
    stable: "Stable",
  };

  const color =
    trend.direction === "up"
      ? "text-green-600"
      : trend.direction === "down"
        ? "text-red-600"
        : "text-gray-600";

  return (
    <div className="bg-white rounded-xl p-5 shadow space-y-2">
      <h3 className="font-semibold text-lg">Emotional Trend</h3>
      <p className={`text-xl font-bold ${color}`}>
        {directionMap[trend.direction]}
      </p>
      <p className="text-sm text-gray-500">Change: {trend.delta.toFixed(2)}</p>
    </div>
  );
}
