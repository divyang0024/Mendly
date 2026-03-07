export default function RiskSignals({ signals }) {
  const items = [
    {
      label: "Avg Coping Effectiveness",
      value: signals.avgEffectiveness.toFixed(2),
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      ),
    },
    {
      label: "Emotional Volatility",
      value: signals.volatility,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      label: "Negative Emotion Ratio",
      value: `${(signals.negativeRatio * 100).toFixed(0)}%`,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .rs-grid{
          font-family:'DM Sans',sans-serif;
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
          gap:14px;
        }

        .rs-card{
          background:var(--surface-container-low);
          border:1.5px solid var(--outline-variant);
          border-radius:16px;
          padding:16px;
          display:flex;
          align-items:center;
          gap:12px;
          box-shadow:0 1px 10px rgba(26,28,22,0.05);
        }

        .rs-icon{
          width:36px;
          height:36px;
          border-radius:10px;
          background:var(--secondary-container);
          color:var(--on-secondary-container);
          display:grid;
          place-items:center;
          flex-shrink:0;
        }

        .rs-label{
          font-size:12px;
          color:var(--outline);
          margin-bottom:2px;
        }

        .rs-value{
          font-family:'Playfair Display',serif;
          font-size:1.25rem;
          color:var(--on-surface);
        }
      `}</style>

      <div className="rs-grid">
        {items.map((item, i) => (
          <div key={i} className="rs-card">
            <div className="rs-icon">{item.icon}</div>
            <div>
              <div className="rs-label">{item.label}</div>
              <div className="rs-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
