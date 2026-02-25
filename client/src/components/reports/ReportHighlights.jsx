export default function ReportHighlights({ highlights }) {
  if (!highlights || highlights.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        No highlights yet
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Key Insights</h3>

      <ul className="list-disc ml-5 space-y-1 text-sm">
        {highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
