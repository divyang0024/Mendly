export default function ReportTriggers({ triggers }) {
  if (!triggers || triggers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        No triggers detected
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Frequent Triggers</h3>

      <div className="flex flex-wrap gap-2">
        {triggers.map((t, i) => (
          <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm">
            {t.keyword} ({t.count})
          </span>
        ))}
      </div>
    </div>
  );
}
