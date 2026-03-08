import { useState } from "react";
import BreathingExercise from "./BreathingExercise";
import GroundingTool from "./GroundingTool";
import ReframingTool from "./ReframingTool";
import AffirmationCard from "./AffirmationCard";
import GoalTracker from "./GoalTracker";
import BreathingFlow from "../breathing/BreathingFlow";
import GroundingFlow from "../coping/GroundingFlow";
import ReframingFlow from "../coping/ReframingFlow";
import AffirmationFlow from "../coping/AffirmationFlow";
import ActivationPlanner from "../activation/ActivationPlanner";

export default function InterventionCard({ intervention }) {
  const [open, setOpen] = useState(false);

  if (!intervention) return null;

  const renderTool = () => {
    switch (intervention.type) {
      case "breathing":
        return <BreathingFlow />;
      case "grounding":
        return <GroundingFlow />;
      case "reframing":
        return <ReframingFlow />;
      case "affirmation":
        return <AffirmationFlow />;
      case "activation":
        return <ActivationPlanner />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>
        {`.btn-new-session {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: auto;
          margin: 12px 0 8px;
          padding: 10px 14px;
          background: #4C662B;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          flex-shrink: 0;
        }`}
      </style>
      <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-800">{intervention.title}</h4>
        <p className="text-sm text-blue-600 mb-2">{intervention.description}</p>

        <button
          onClick={() => setOpen(!open)}
          className="btn-new-session"
        >
          {open ? "Close Tool" : "Start Exercise"}
        </button>

        {open && <div className="mt-3">{renderTool()}</div>}
      </div>
    </>
  );
}
