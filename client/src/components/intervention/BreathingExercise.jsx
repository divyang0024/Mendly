import { useEffect, useState } from "react";

export default function BreathingExercise() {
  const [phase, setPhase] = useState("Inhale");

  useEffect(() => {
    const cycle = setInterval(() => {
      setPhase((p) =>
        p === "Inhale" ? "Hold" : p === "Hold" ? "Exhale" : "Inhale",
      );
    }, 4000);

    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow">
      <p className="text-lg font-semibold">{phase}</p>
      <p className="text-sm text-gray-500">
        Follow the rhythm to calm your body
      </p>
    </div>
  );
}
