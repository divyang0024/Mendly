import { useEffect, useState } from "react";
import { getGroundingStats } from "../../features/grounding/grounding.api";

export default function GroundingStats() {
  const [stats, setStats] = useState({ sessions: 0, avgEffectiveness: 0 });

  useEffect(() => {
    getGroundingStats().then((res) => setStats(res.data));
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Grounding Impact</h3>
      <p>Total Sessions: {stats.sessions}</p>
      <p>Avg Effectiveness: {stats.avgEffectiveness?.toFixed(2)}</p>
    </div>
  );
}
