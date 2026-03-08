export const validateMentalState = (data) => {
  if (!data || typeof data !== "object") {
    return {
      emotion: "neutral",
      crisis: false,
      therapistMode: "supportive",
      intervention: null,
    };
  }

  const validEmotions = ["calm", "neutral", "sad", "anxious", "angry"];
  const validModes = [
    "calm_coach",
    "empathy_listener",
    "regulation_guide",
    "reinforcement_mode",
    "stability_support",
    "balanced_support",
  ];
  const validInterventions = [
    "breathing",
    "grounding",
    "reframing",
    "affirmation",
    "activation",
  ];

  const emotion = validEmotions.includes(data.emotion)
    ? data.emotion
    : "neutral";

  const crisis = typeof data.crisis === "boolean" ? data.crisis : false;

  const therapistMode = validModes.includes(data.therapistMode)
    ? data.therapistMode
    : "supportive";

  let intervention = null;
  if (
    data.intervention &&
    typeof data.intervention === "object" &&
    validInterventions.includes(data.intervention.type)
  ) {
    intervention = {
      type: data.intervention.type,
      reason:
        typeof data.intervention.reason === "string"
          ? data.intervention.reason
          : "",
    };
  }

  return { emotion, crisis, therapistMode, intervention };
};
