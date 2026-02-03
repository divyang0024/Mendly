const affirmations = [
  "I am allowed to take up space.",
  "I am learning and growing.",
  "I can handle this step by step.",
];

export default function AffirmationCard() {
  const msg = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <div className="p-4 bg-white rounded-lg shadow text-center text-sm">
      <p>✨ {msg}</p>
    </div>
  );
}
