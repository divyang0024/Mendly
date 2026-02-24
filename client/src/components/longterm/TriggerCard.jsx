export default function TriggerCard({ triggers }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <h3 className="font-semibold text-lg mb-3">Frequent Triggers</h3>

      {triggers.length === 0 && (
        <p className="text-sm text-gray-400">No triggers detected</p>
      )}

      <div className="flex flex-wrap gap-2">
        {triggers.map((t, i) => (
          <span
            key={i}
            className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full"
          >
            {t.keyword} ({t.count})
          </span>
        ))}
      </div>
    </div>
  );
}
