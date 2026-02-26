import { useEffect, useState } from "react";
import { getRiskEvents } from "../../features/risk/risk.api";

export default function RiskTimeline({ refresh }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await getRiskEvents();
      setEvents(res.data);
    };

    fetchEvents();
  }, [refresh]);

  const colorMap = {
    low: "bg-green-100 text-green-700",
    moderate: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    crisis: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Recent Risk Events</h3>

      {events.length === 0 && (
        <p className="text-gray-400 text-sm">No risk events yet</p>
      )}

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {events.map((e) => (
          <div
            key={e._id}
            className="border rounded-lg p-3 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  colorMap[e.level] || "bg-gray-100"
                }`}
              >
                {e.level.toUpperCase()}
              </span>

              <span className="text-xs text-gray-400">
                {new Date(e.createdAt).toLocaleString()}
              </span>
            </div>

            {e.emotion && (
              <p className="text-sm text-gray-600">
                Emotion: <strong>{e.emotion}</strong>
              </p>
            )}

            {e.intervention && (
              <p className="text-xs text-blue-600">
                Suggested: {e.intervention}
              </p>
            )}

            <p className="text-sm text-gray-800 line-clamp-2">{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
