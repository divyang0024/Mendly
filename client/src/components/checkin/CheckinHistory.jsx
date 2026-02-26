import { useEffect, useState } from "react";
import { getCheckinHistory } from "../../features/checkin/checkin.api";

export default function CheckinHistory({ refresh }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getCheckinHistory();
      setHistory(res.data);
    };

    fetch();
  }, [refresh]);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Last 30 Days</h3>

      {history.map((h) => (
        <div key={h._id} className="border-b py-2 text-sm">
          <div className="font-medium">{h.date}</div>
          Mood {h.mood} • Energy {h.energy} • Stress {h.stress}
        </div>
      ))}
    </div>
  );
}
