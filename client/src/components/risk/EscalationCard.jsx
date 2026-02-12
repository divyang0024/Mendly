export default function EscalationCard({ escalation }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-3">
      <h3 className="text-lg font-semibold">Escalation Plan</h3>

      <p className="text-sm text-gray-600">
        <strong>Reason:</strong> {escalation.reason}
      </p>

      <p className="text-sm text-gray-600">
        <strong>Recommended Action:</strong> {escalation.action}
      </p>
    </div>
  );
}
