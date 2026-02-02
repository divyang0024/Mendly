export const getTherapistMode = (profile, trend, volatility) => {
  const dominant = profile?.dominantEmotion || "neutral";

  if (dominant === "anxious" && trend === "worsening") return "calm_coach";

  if (dominant === "sad" && trend !== "improving") return "empathy_listener";

  if (dominant === "angry") return "regulation_guide";

  if (trend === "improving") return "reinforcement_mode";

  if (volatility === "high") return "stability_support";

  return "balanced_support";
};

export const buildTherapistPrompt = (mode, history) => {
  const baseInstruction = {
    calm_coach:
      "Speak slowly, use grounding techniques, guide breathing, keep responses short and reassuring.",

    empathy_listener:
      "Be emotionally validating, reflective, encourage expression, avoid giving solutions too quickly.",

    regulation_guide:
      "Help regulate strong emotions, suggest pauses, physical grounding, perspective shifts.",

    reinforcement_mode:
      "Acknowledge progress, encourage growth, reinforce coping strategies that worked.",

    stability_support:
      "Keep tone steady, predictable, avoid emotional spikes, maintain emotional balance.",

    balanced_support: "Provide supportive, calm, reflective responses.",
  };

  return [
    {
      role: "user",
      parts: [{ text: baseInstruction[mode] }],
    },
    ...history,
  ];
};
