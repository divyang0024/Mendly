import { useEffect, useState } from "react";
import { getActivationStats } from "../../features/activation/activation.api";

export default function ActivationStats({ refresh }) {
  const [stats, setStats] = useState({ sessions: 0, avgEffectiveness: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getActivationStats();
      setStats(res.data);
    };
    fetchStats();
  }, [refresh]);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-lg mb-2">Activation Progress</h3>
      <p>Total Sessions: {stats.sessions}</p>
      <p>Avg Mood Improvement: {stats.avgEffectiveness.toFixed(2)}</p>
    </div>
  );
}
