import { useEffect, useState } from "react";
import {
  getCheckinStats,
  getCheckinStreak,
} from "../../features/checkin/checkin.api";

export default function CheckinStats({ refresh }) {
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const [s, st] = await Promise.all([
        getCheckinStats(),
        getCheckinStreak(),
      ]);

      setStats(s.data);
      setStreak(st.data.streak);
    };

    fetch();
  }, [refresh]);

  if (!stats) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-2">
      <h3 className="font-semibold text-lg">Your Trends</h3>

      <p>Mood Avg: {stats.avgMood.toFixed(2)}</p>
      <p>Energy Avg: {stats.avgEnergy.toFixed(2)}</p>
      <p>Stress Avg: {stats.avgStress.toFixed(2)}</p>
      <p>Sleep Avg: {stats.avgSleep.toFixed(1)} hrs</p>

      <p className="font-semibold text-green-600">🔥 Streak: {streak} days</p>
    </div>
  );
}
