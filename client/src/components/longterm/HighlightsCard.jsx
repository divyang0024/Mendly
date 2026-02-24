export default function HighlightsCard({ highlights }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <h3 className="font-semibold text-lg mb-3">AI Highlights</h3>

      {(!highlights || highlights.length === 0) && (
        <p className="text-sm text-gray-400">
          No highlights yet. Keep using the app to build insights.
        </p>
      )}

      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
        {highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
