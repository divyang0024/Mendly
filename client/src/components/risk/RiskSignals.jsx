export default function RiskSignals({ signals }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Risk Signals</h3>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Avg Coping Effectiveness:</strong>{" "}
          {signals.avgEffectiveness.toFixed(2)}
        </p>

        <p>
          <strong>Emotional Volatility:</strong> {signals.volatility}
        </p>

        <p>
          <strong>Negative Emotion Ratio:</strong>{" "}
          {(signals.negativeRatio * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
