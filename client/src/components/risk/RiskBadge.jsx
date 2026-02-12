export default function RiskBadge({ level }) {
  const config = {
    low: {
      label: "Low Risk",
      color: "bg-green-100 text-green-700",
    },
    moderate: {
      label: "Moderate Risk",
      color: "bg-yellow-100 text-yellow-700",
    },
    high: {
      label: "High Risk",
      color: "bg-red-100 text-red-700",
    },
  };

  const badge = config[level] || config.low;

  return (
    <div
      className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${badge.color}`}
    >
      {badge.label}
    </div>
  );
}
