import { generateAIResponse } from "./gemma.service.js";

/**
 * Cleans model output by removing markdown fences
 * and isolating the first {...} JSON block.
 */
function extractJSON(str) {
  // remove code fences
  str = str.replace(/```json/g, "").replace(/```/g, "");

  // find first { ... } block
  const match = str.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

export const analyzeMentalState = async (text) => {
  const prompt = `
You are NOT a therapist.
You are a STRICT mental-state classification engine used inside a safety-critical system.

Your job is to classify the user's message using RULE-BASED reasoning.
Do NOT be creative. Do NOT add explanations. Output ONLY JSON.

────────────────────────
🧠 STEP 1 — EMOTION CLASSIFICATION
Choose the dominant emotional tone expressed:

• "calm" → relaxed, okay, fine, peaceful, neutral conversation
• "neutral" → informational, no emotional expression
• "sad" → hopeless, tired, low, crying, lonely, down
• "anxious" → worried, panic, overthinking, nervous, fear
• "angry" → frustration, irritation, rage, blame, aggression

────────────────────────
🚨 STEP 2 — CRISIS DETECTION (HIGHEST PRIORITY)
Set "crisis": true ONLY if message includes:
• desire to die
• self-harm intent
• suicidal thoughts
• "I want to end it"
• "I don't want to live"
• harm to self or others

If crisis = true:
→ therapistMode MUST be "supportive"
→ intervention.type MUST be null

────────────────────────
🧭 STEP 3 — THERAPIST MODE SELECTION

• calm_coach → when user is anxious, overwhelmed, panicking
• empathy_listener → when user is sad, hurt, venting, emotional
• regulation_guide → when user is angry, emotionally escalated
• reinforcement_mode → when user shows progress, hope, motivation
• stability_support → when emotions fluctuate or are unstable
• balanced_support → neutral conversations or general support

────────────────────────
🧘 STEP 4 — INTERVENTION SELECTION

Only trigger if crisis_flag = false.

Analyze the user's message for emotional tone, cognitive patterns, and behavioral cues.
Select the single most contextually appropriate intervention:

INTERVENTION   → TRIGGER CONDITIONS
───────────────────────────────────────────────────────
breathing      → acute anxiety, panic, hyperventilation cues, racing thoughts
grounding      → dissociation, sensory disconnection, overwhelm, derailed thinking
reframing      → cognitive distortions, self-blame, guilt spirals, negative core beliefs
affirmation    → low self-worth, discouragement, imposter feelings, seeking validation
activation     → low energy, apathy, avoidance patterns, withdrawal, motivational deficit
null           → neutral/casual conversation, no distress signals detected

SELECTION RULES:
- Return exactly one value from: breathing | grounding | reframing | affirmation | activation | null
- If multiple triggers overlap, select the most dominant emotional state
- Default to null when confidence is low
- Never select an intervention during an active crisis — escalate instead

────────────────────────
OUTPUT STRICT JSON:

{
  "emotion": "calm | neutral | sad | anxious | angry",
  "crisis": true | false,
  "therapistMode": "calm_coach | empathy_listener | regulation_guide | reinforcement_mode | stability_support | balanced_support",
  "intervention": {
    "type": "breathing | grounding | reframing | affirmation | null",
    "reason": "short reason"
  }
}

No markdown.
No explanation.
Only JSON.

User message:
"${text}"
`;

  try {
    const raw = await generateAIResponse([
      { role: "user", parts: [{ text: prompt }] },
    ]);

    const cleaned = extractJSON(raw);
    if (!cleaned) return null;

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("AI mental state parse error:", err);
    return null;
  }
};
