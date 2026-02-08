import { useEffect, useState } from "react";
import { getReframingStats } from "../../features/reframing/reframing.api";

export default function ReframingStats({refresh}) {
  const [stats, setStats] = useState({ sessions: 0, avgEffectiveness: 0 });

 useEffect(() => {
   getReframingStats().then((res) => setStats(res.data));
 }, [refresh]);


  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold">Reframing Impact</h3>
      <p>Total Sessions: {stats.sessions}</p>
      <p>Avg Emotional Shift: {stats.avgEffectiveness?.toFixed(2)}</p>
    </div>
  );
}
