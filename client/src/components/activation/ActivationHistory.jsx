import { useEffect, useState } from "react";
import {
  getActivationHistory,
  completeActivation,
} from "../../features/activation/activation.api";

export default function ActivationHistory({ refresh }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getActivationHistory().then((res) => setHistory(res.data));
  }, [refresh]);

  const complete = async (id) => {
    const moodAfter = prompt("Mood after activity (1–10)?");
    const reflection = prompt("Reflection (optional)");

    await completeActivation(id, { moodAfter, reflection });
    setHistory((prev) =>
      prev.map((h) => (h._id === id ? { ...h, completed: true } : h)),
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-3">
      <h3 className="text-lg font-semibold">Recent Activities</h3>

      {history.map((h) => (
        <div
          key={h._id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <div>
            <div className="font-medium">{h.activityName}</div>
            <div className="text-xs text-gray-500">
              {h.activityType} • Effort {h.difficulty}/5
            </div>
          </div>

          {!h.completed ? (
            <button
              onClick={() => complete(h._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Complete
            </button>
          ) : (
            <span className="text-green-600 text-sm font-semibold">Done ✔</span>
          )}
        </div>
      ))}
    </div>
  );
}
