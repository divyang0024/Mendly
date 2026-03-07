export default function ReportSummary({ summary }) {
  const cards = [
    {
      label: "Total Sessions",
      value: summary.totalSessions,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      iconBg: "var(--primary-container)",
      iconColor: "var(--on-primary-container)",
    },
    {
      label: "Avg Mood",
      value:
        typeof summary.avgMood === "number"
          ? summary.avgMood.toFixed(2)
          : summary.avgMood,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
      iconBg: "var(--secondary-container)",
      iconColor: "var(--on-secondary-container)",
    },
    {
      label: "Top Emotion",
      value: summary.topEmotion,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      iconBg: "var(--tertiary-container)",
      iconColor: "var(--on-tertiary-container)",
    },
    {
      label: "Best Tool",
      value: summary.bestTool,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      iconBg: "var(--surface-container-high)",
      iconColor: "var(--on-surface-variant)",
    },
  ];

  return (
    <>
      <style>{`
        .rs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
        }
        .rs-card {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface-container-low);
          border: 1.5px solid var(--outline-variant);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 12px rgba(26,28,22,0.07);
          color: var(--on-surface);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px 18px;
          gap: 10px;
          text-align: center;
          animation: rsIn 0.4s ease-out both;
        }
        .rs-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 110px; height: 110px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(76,102,43,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .rs-card:nth-child(2) { animation-delay: 0.05s; }
        .rs-card:nth-child(3) { animation-delay: 0.1s; }
        .rs-card:nth-child(4) { animation-delay: 0.15s; }
        @keyframes rsIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .rs-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .rs-icon svg { width: 16px; height: 16px; }
        .rs-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--outline);
          margin: 0;
        }
        .rs-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--on-surface);
          line-height: 1.1;
          word-break: break-word;
          text-transform: capitalize;
          margin: 0;
        }
      `}</style>
      <div className="rs-grid">
        {cards.map(({ label, value, icon, iconBg, iconColor }) => (
          <div className="rs-card" key={label}>
            <div
              className="rs-icon"
              style={{ background: iconBg, color: iconColor }}
            >
              {icon}
            </div>
            <p className="rs-label">{label}</p>
            <p className="rs-value">{value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
