import { useEffect, useState } from "react";
import { getVolatility } from "../../features/insights/insights.api";

export default function VolatilityCard() {
  const [vol, setVol] = useState(null);

  useEffect(() => {
    getVolatility().then((res) => setVol(res.data.volatility));
  }, []);

  if (vol === null) return null;

  const color = vol > 50 ? "#ef4444" : vol > 25 ? "#f59e0b" : "#22c55e";

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
      <h3 style={{ fontWeight: 600 }}>Emotional Stability</h3>
      <p style={{ color, fontSize: 20, marginTop: 8 }}>{100 - vol}% Stable</p>
      <small>Emotional fluctuation score: {vol}%</small>
    </div>
  );
}
