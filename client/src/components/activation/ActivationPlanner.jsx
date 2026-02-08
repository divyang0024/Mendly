import { useState } from "react";
import { createActivationPlan } from "../../features/activation/activation.api";

const types = [
  "physical",
  "social",
  "creative",
  "productive",
  "self-care",
  "outdoor",
  "learning",
];

export default function ActivationPlanner({ onCreated }) {
  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] = useState("physical");
  const [difficulty, setDifficulty] = useState(3);
  const [moodBefore, setMoodBefore] = useState(5);

  const submit = async () => {
    await createActivationPlan({
      activityName,
      activityType,
      difficulty,
      moodBefore,
    });

    setActivityName("");
    if (onCreated) onCreated();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Plan a Positive Action</h3>

      <input
        placeholder="What will you do?"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        className="w-full border rounded p-2"
      />

      <select
        value={activityType}
        onChange={(e) => setActivityType(e.target.value)}
        className="w-full border p-2 rounded"
      >
        {types.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <label>Effort Level: {difficulty}/5</label>
      <input
        type="range"
        min="1"
        max="5"
        value={difficulty}
        onChange={(e) => setDifficulty(Number(e.target.value))}
        className="w-full accent-orange-500"
      />

      <label>Mood Before: {moodBefore}/10</label>
      <input
        type="range"
        min="1"
        max="10"
        value={moodBefore}
        onChange={(e) => setMoodBefore(Number(e.target.value))}
        className="w-full accent-blue-500"
      />

      <button
        onClick={submit}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Create Plan
      </button>
    </div>
  );
}
