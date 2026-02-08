import { useEffect, useState } from "react";
import { getReframingHistory } from "../../features/reframing/reframing.api";

export default function ReframingHistory({ refresh }) {
  const [data, setData] = useState([]);

useEffect(() => {
  getReframingHistory().then((res) => setData(res.data));
}, [refresh]);


  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h3 className="font-semibold">Recent Sessions</h3>
      {data.map((s) => (
        <div key={s._id} className="border p-2 rounded text-sm">
          <p>
            <b>Thought:</b> {s.automaticThought}
          </p>
          <p>
            <b>Reframe:</b> {s.reframedThought}
          </p>
          <p>Shift: {s.effectivenessScore}</p>
        </div>
      ))}
    </div>
  );
}
