import { useState } from "react";
import { createReframingSession } from "../../features/reframing/reframing.api";

/* ✅ Move this OUTSIDE */
function Box({ children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">{children}</div>
  );
}

export default function ReframingFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState("");
  const [thought, setThought] = useState("");
  const [emotionBefore, setEmotionBefore] = useState(5);
  const [reframed, setReframed] = useState("");
  const [emotionAfter, setEmotionAfter] = useState(5);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const feelingLabel = (v) => {
    if (v <= 3) return "Mild";
    if (v <= 6) return "Moderate";
    return "Strong";
  };

  const save = async () => {
    setLoading(true);

    await createReframingSession({
      sessionId,
      situation,
      automaticThought: thought,
      emotionBefore,
      reframedThought: reframed,
      emotionAfter,
    });

    setLoading(false);
    setDone(true);
    if (onComplete) onComplete();
  };

  if (done) {
    return (
      <div className="bg-green-50 p-6 rounded-xl shadow text-center">
        <h3 className="text-lg font-semibold text-green-700">
          Reframing saved
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Emotional intensity reduced by{" "}
          <strong>{emotionBefore - emotionAfter}</strong> points.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Thought Reframing</h2>

      {step === 1 && (
        <Box>
          <p>What situation triggered this feeling?</p>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full border rounded p-2"
          />
          <button onClick={() => setStep(2)} className="btn">
            Next
          </button>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <p>What automatic thought came to mind?</p>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="w-full border rounded p-2"
          />
          <button onClick={() => setStep(3)} className="btn">
            Next
          </button>
        </Box>
      )}

      {step === 3 && (
        <Box>
          <p>How intense was the emotion?</p>
          <input
            type="range"
            min="1"
            max="10"
            value={emotionBefore}
            onChange={(e) => setEmotionBefore(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <p className="text-center">
            {emotionBefore}/10 ({feelingLabel(emotionBefore)})
          </p>
          <button onClick={() => setStep(4)} className="btn">
            Next
          </button>
        </Box>
      )}

      {step === 4 && (
        <Box>
          <p>What is a more balanced thought?</p>
          <textarea
            value={reframed}
            onChange={(e) => setReframed(e.target.value)}
            className="w-full border rounded p-2"
          />
          <button onClick={() => setStep(5)} className="btn">
            Next
          </button>
        </Box>
      )}

      {step === 5 && (
        <Box>
          <p>How intense does the emotion feel now?</p>
          <input
            type="range"
            min="1"
            max="10"
            value={emotionAfter}
            onChange={(e) => setEmotionAfter(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <p className="text-center">
            {emotionAfter}/10 ({feelingLabel(emotionAfter)})
          </p>
          <button onClick={save} disabled={loading} className="btn-green">
            {loading ? "Saving..." : "Save Session"}
          </button>
        </Box>
      )}
    </div>
  );
}
