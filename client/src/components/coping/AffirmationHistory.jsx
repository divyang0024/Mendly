import { useEffect, useState } from "react";
import { getAffirmationHistory } from "../../features/affirmation/affirmation.api";

export default function AffirmationHistory() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getAffirmationHistory().then((res) => setSessions(res.data));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h3 className="font-semibold">Recent Affirmations</h3>
      {sessions.map((s) => (
        <div key={s._id} className="border rounded p-2 text-sm">
          <p className="italic">"{s.affirmationText}"</p>
          <p className="text-gray-500">
            Shift: {s.intensityBefore - s.intensityAfter}
          </p>
        </div>
      ))}
    </div>
  );
}
