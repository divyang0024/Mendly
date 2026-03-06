export default function RiskSignals({ signals }) {
  const items = [
    {
      label: "Avg Coping Effectiveness",
      value: signals.avgEffectiveness.toFixed(2),
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
    },
  ];

  return (
    <div style={styles.grid}>
      {items.map((item, i) => (
        <div key={i} style={styles.signalItem}>
          <div style={styles.iconWrap}>{item.icon}</div>
          <div>
            <p style={styles.label}>{item.label}</p>
            <p style={styles.value}>{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 0,
    height: "100%",
  },
  signalItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "24px 28px",
    borderBottom: "1px solid var(--md-outline-variant)",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: "var(--md-shape-md)",
    background: "var(--md-surface-container)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--md-primary)",
    flexShrink: 0,
  },
  label: {
    font: "var(--md-label-medium)",
    color: "var(--md-on-surface-variant)",
    marginBottom: 2,
  },
  value: {
    font: "var(--md-title-large)",
    color: "var(--md-on-surface)",
  },
};
