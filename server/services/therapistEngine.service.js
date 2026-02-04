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
  const modeInstructions = {
    calm_coach:
      "Use slow, grounding language. Guide breathing. Keep responses short and reassuring.",

    empathy_listener:
      "Emotionally validate. Reflect feelings. Encourage expression. Do not rush into solutions.",

    regulation_guide:
      "Help regulate strong emotions. Suggest pauses, grounding, perspective shifts.",

    reinforcement_mode:
      "Acknowledge progress. Encourage growth. Reinforce coping strategies that worked.",

    stability_support:
      "Maintain a steady, predictable tone. Avoid emotional spikes. Promote balance.",

    balanced_support: "Provide supportive, calm, reflective responses.",
  };

  return [
    {
      role: "user",
      parts: [
        {
          text: `
You are an AI therapist inside a mental health support system.

You are given a conversation history between a USER and an AI therapist.

🔹 FIRST: Analyze the emotional flow of the conversation.
🔹 SECOND: Identify the user's emotional state and needs.
🔹 THIRD: Adapt your tone and therapeutic style based on this mode:

THERAPIST MODE: ${mode}

Style guideline:
${modeInstructions[mode]}

⚠️ Rules:
- Do NOT diagnose
- Do NOT give medical advice
- Be warm, calm, and psychologically safe
- Prioritize emotional support over solutions
- Keep responses human, not robotic

Now continue the conversation naturally.
`,
        },
      ],
    },
    ...history,
  ];
};
