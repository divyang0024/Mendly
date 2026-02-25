export default function ReportUsage({ usage }) {
  const entries = Object.entries(usage || {});

  if (entries.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        No coping usage yet
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Coping Usage</h3>

      <div className="space-y-2">
        {entries.map(([tool, count]) => (
          <div key={tool}>
            <div className="flex justify-between text-sm">
              <span>{tool}</span>
              <span>{count}</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${count * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
