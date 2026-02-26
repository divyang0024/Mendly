import { useState, useEffect } from "react";
import {
  saveCheckin,
  getTodayCheckin,
} from "../../features/checkin/checkin.api";

export default function DailyCheckinForm({ onSaved }) {
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await getTodayCheckin();
        if (res.data) {
          setMood(res.data.mood);
          setEnergy(res.data.energy);
          setStress(res.data.stress);
          setSleepHours(res.data.sleepHours || 7);
          setNotes(res.data.notes || "");
          setTags((res.data.tags || []).join(", "));
        }
        setLoaded(true);
      } catch {
        setLoaded(true);
      }
    };

    fetchToday();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    await saveCheckin({
      mood,
      energy,
      stress,
      sleepHours,
      notes,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setLoading(false);
    if (onSaved) onSaved();
  };

  if (!loaded) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-5">
      <h2 className="text-xl font-semibold text-center">Daily Check-in</h2>

      {/* Mood */}
      <div>
        <label>Mood: {mood}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Energy */}
      <div>
        <label>Energy: {energy}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full accent-green-500"
        />
      </div>

      {/* Stress */}
      <div>
        <label>Stress: {stress}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={stress}
          onChange={(e) => setStress(Number(e.target.value))}
          className="w-full accent-red-500"
        />
      </div>

      {/* Sleep */}
      <div>
        <label>Sleep Hours</label>
        <input
          type="number"
          value={sleepHours}
          onChange={(e) => setSleepHours(Number(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Notes */}
      <textarea
        placeholder="Any thoughts about today..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border rounded p-2"
      />

      {/* Tags */}
      <input
        placeholder="Tags (e.g. exam, work, family)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border rounded p-2"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded w-full"
      >
        {loading ? "Saving..." : "Save Check-in"}
      </button>
    </div>
  );
}
