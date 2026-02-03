import { useState } from "react";
import BreathingExercise from "./BreathingExercise";
import GroundingTool from "./GroundingTool";
import ReframingTool from "./ReframingTool";
import AffirmationCard from "./AffirmationCard";
import GoalTracker from "./GoalTracker";

export default function InterventionCard({ intervention }) {
  const [open, setOpen] = useState(false);

  if (!intervention) return null;

  const renderTool = () => {
    switch (intervention.type) {
      case "breathing":
        return <BreathingExercise />;
      case "grounding":
        return <GroundingTool />;
      case "reframing":
        return <ReframingTool />;
      case "affirmation":
        return <AffirmationCard />;
      case "goal":
        return <GoalTracker />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <h4 className="font-semibold text-blue-800">{intervention.title}</h4>
      <p className="text-sm text-blue-600 mb-2">{intervention.description}</p>

      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
      >
        {open ? "Close Tool" : "Start Exercise"}
      </button>

      {open && <div className="mt-3">{renderTool()}</div>}
    </div>
  );
}
