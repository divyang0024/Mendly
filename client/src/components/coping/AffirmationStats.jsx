import { useEffect, useState } from "react";
import { getAffirmationStats } from "../../features/affirmation/affirmation.api";

export default function AffirmationStats() {
  const [stats, setStats] = useState({ sessions: 0, avgEffectiveness: 0 });

  useEffect(() => {
    getAffirmationStats().then((res) => setStats(res.data));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Affirmation Impact</h3>
      <p>Total Sessions: {stats.sessions}</p>
      <p>Avg Effectiveness: {stats.avgEffectiveness?.toFixed(2)}</p>
    </div>
  );
}
