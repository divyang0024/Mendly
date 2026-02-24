export default function CopingUsageCard({ usage }) {
  const entries = Object.entries(usage || {});

  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <h3 className="font-semibold text-lg mb-3">Coping Usage</h3>

      {entries.length === 0 && (
        <p className="text-sm text-gray-400">No usage yet</p>
      )}

      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="capitalize">{key}</span>
            <span className="font-semibold">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
