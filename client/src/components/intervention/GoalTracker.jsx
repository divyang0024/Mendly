import { useState } from "react";

export default function GoalTracker() {
  const [goal, setGoal] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!goal) return;
    setSaved(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow text-sm">
      <p className="font-semibold mb-2">Set a small goal</p>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="border p-2 rounded w-full mb-2"
        placeholder="Example: Go for a 5 min walk"
      />
      <button
        onClick={save}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Save Goal
      </button>

      {saved && <p className="text-green-600 mt-2">Goal saved ✔</p>}
    </div>
  );
}
