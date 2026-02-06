import { useState } from "react";
import BreathingFlow from "../components/breathing/BreathingFlow";
import BreathingStats from "../components/breathing/BreathingStats";

export default function Breathing() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSessionComplete = () => {
    setRefreshKey((k) => k + 1); // trigger stats reload
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Breathing Regulation</h1>
      <BreathingFlow onComplete={handleSessionComplete} />
      <BreathingStats refreshKey={refreshKey} />
    </div>
  );
}
