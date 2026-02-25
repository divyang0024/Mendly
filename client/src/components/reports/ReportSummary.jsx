export default function ReportSummary({ summary }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Total Sessions" value={summary.totalSessions} />
      <Card label="Avg Mood" value={summary.avgMood.toFixed(2)} />
      <Card label="Top Emotion" value={summary.topEmotion} />
      <Card label="Best Tool" value={summary.bestTool} />
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
