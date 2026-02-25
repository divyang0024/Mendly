export default function ReportNarrative({ text }) {
  if (!text) return null;

  return (
    <div className="bg-green-50 p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-2 text-green-700">Weekly Reflection</h3>

      <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
}
