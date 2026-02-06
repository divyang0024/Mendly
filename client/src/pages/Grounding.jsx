import GroundingFlow from "../components/coping/GroundingFlow";
import GroundingStats from "../components/coping/GroundingStats";

export default function Grounding() {
  const refreshStats = () => {
    // re-render stats when session saved
    window.location.reload(); // quick way, later you can use state
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Grounding Exercise</h1>

      <GroundingFlow onComplete={refreshStats} />
      <GroundingStats />
    </div>
  );
}
