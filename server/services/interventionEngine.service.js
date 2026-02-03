export const getIntervention = ({
  currentEmotion,
  dominantEmotion,
  trend,
  volatilityLevel,
}) => {
  // Crisis handled earlier — never here

  // HIGH VOLATILITY → stabilization first
  if (volatilityLevel === "high") {
    return {
      type: "grounding",
      title: "Grounding Exercise",
      instruction:
        "Pause. Look around and name 5 things you see, 4 you feel, 3 you hear. This helps stabilize your nervous system.",
    };
  }

  // ANXIETY DOMINANT
  if (dominantEmotion === "anxious" || currentEmotion === "anxious") {
    return {
      type: "breathing",
      title: "Breathing Regulation",
      instruction:
        "Try slow breathing: inhale 4 seconds, hold 4, exhale 6. Repeat for a minute.",
    };
  }

  // SADNESS + DECLINING TREND
  if (dominantEmotion === "sad" && trend === "declining") {
    return {
      type: "affirmation",
      title: "Self-Compassion Prompt",
      instruction:
        "Speak to yourself as you would to a close friend going through the same situation.",
    };
  }

  // ANGER
  if (dominantEmotion === "angry") {
    return {
      type: "reframing",
      title: "Thought Reframing",
      instruction:
        "Ask: What else could this situation mean? Is there another perspective?",
    };
  }

  // STABLE OR IMPROVING
  if (trend === "improving") {
    return {
      type: "affirmation",
      title: "Positive Reinforcement",
      instruction:
        "Notice what helped you feel better. Reinforcing small wins builds resilience.",
    };
  }

  return null;
};
