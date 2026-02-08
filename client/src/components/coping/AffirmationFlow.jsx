import { useState } from "react";
import {
  generateAffirmation,
  saveAffirmationSession,
} from "../../features/affirmation/affirmation.api";

const themes = [
  "self-worth",
  "confidence",
  "anxiety-relief",
  "resilience",
  "motivation",
  "self-compassion",
];

export default function AffirmationFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(1);

  const [theme, setTheme] = useState("self-worth");
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [affirmation, setAffirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const feelingLabel = (v) => {
    if (v <= 3) return "Calm";
    if (v <= 6) return "Moderate";
    return "Overwhelmed";
  };

  const getAI = async () => {
    setLoading(true);
    const res = await generateAffirmation({ theme, intensity: before });
    setAffirmation(res.data.affirmation);
    setLoading(false);
    setStep(3);
  };

  const save = async () => {
    setLoading(true);
    await saveAffirmationSession({
      sessionId,
      theme,
      affirmationText: affirmation,
      intensityBefore: before,
      intensityAfter: after,
      feltHelpful: after < before,
    });
    setLoading(false);
    setSaved(true);
    if (onComplete) onComplete();
  };

  if (saved) {
    return (
      <div className="bg-green-50 p-6 rounded-xl shadow text-center">
        <h3 className="text-lg font-semibold text-green-700">
          Affirmation Session Saved 🌟
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Emotional intensity shifted by <strong>{before - after}</strong>{" "}
          points.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold text-center">Affirmation Practice</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p className="font-medium">How do you feel right now?</p>
          <input
            type="range"
            min="1"
            max="10"
            value={before}
            onChange={(e) => setBefore(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <p className="text-center font-semibold text-blue-600">
            {before}/10 ({feelingLabel(before)})
          </p>

          <p className="font-medium mt-4">Choose a focus theme:</p>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`border rounded-lg p-2 ${
                  theme === t ? "bg-blue-100 border-blue-500" : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={getAI}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Generate Affirmation
          </button>
        </>
      )}

      {/* STEP 2 — AFFIRMATION */}
      {step === 3 && (
        <>
          <div className="bg-yellow-50 p-4 rounded-lg text-center text-lg font-medium">
            {loading ? "Creating affirmation..." : affirmation}
          </div>

          <button
            onClick={() => setStep(4)}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            I’ve Read It
          </button>
        </>
      )}

      {/* STEP 3 — AFTER */}
      {step === 4 && (
        <>
          <p className="font-medium">How do you feel now?</p>
          <input
            type="range"
            min="1"
            max="10"
            value={after}
            onChange={(e) => setAfter(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <p className="text-center font-semibold text-green-600">
            {after}/10 ({feelingLabel(after)})
          </p>

          <button
            onClick={save}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Saving..." : "Save Session"}
          </button>
        </>
      )}
    </div>
  );
}
