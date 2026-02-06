import { useEffect, useState } from "react";
import { getBreathingStats } from "../../features/breathing/breathing.api";

export default function BreathingStats({ refreshKey }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getBreathingStats().then((res) => setStats(res.data));
  }, [refreshKey]); // 🔥 re-fetch when session completes

  if (!stats) return null;

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold text-lg mb-3">Your Breathing Impact</h3>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-2xl font-bold">{stats.sessions}</div>
          <div className="text-sm text-gray-500">Total Sessions</div>
        </div>

        <div className="bg-green-50 p-3 rounded">
          <div className="text-2xl font-bold">
            {stats.avgEffectiveness.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Avg Effectiveness</div>
        </div>
      </div>

      {stats.recent?.length > 0 && (
        <div className="mt-5">
          <h4 className="font-semibold mb-2">Recent Sessions</h4>
          <ul className="text-sm space-y-1">
            {stats.recent.map((s) => (
              <li key={s._id} className="flex justify-between">
                <span>{s.pattern}</span>
                <span>Effectiveness: {s.effectivenessScore}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
