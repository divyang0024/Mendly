export default function SummaryCards({ data }) {
  const { totalSessions, avgMood, topEmotion, bestTool } = data;

  const Card = ({ label, value }) => (
    <div className="bg-white rounded-xl p-5 shadow flex flex-col gap-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card label="Total Sessions" value={totalSessions} />
      <Card label="Avg Effectiveness" value={avgMood.toFixed(2)} />
      <Card label="Top Emotion" value={topEmotion} />
      <Card label="Best Tool" value={bestTool} />
    </div>
  );
}
