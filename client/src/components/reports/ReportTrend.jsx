export default function ReportTrend({ trend }) {
  const config = {
    up: {
      color: "var(--md-primary)",
      bg: "var(--md-primary-container)",
      textColor: "var(--md-on-primary-container)",
      symbol: "Improving",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    down: {
      color: "var(--md-error)",
      bg: "var(--md-error-container)",
      textColor: "var(--md-on-error-container)",
      symbol: "Declining",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      ),
    },
    stable: {
      color: "var(--md-on-surface-variant)",
      bg: "var(--md-surface-container)",
      textColor: "var(--md-on-surface-variant)",
      symbol: "Stable",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="15 8 19 12 15 16" />
        </svg>
      ),
    },
  };

  const t = config[trend.direction] || config.stable;

  return (
    <div style={styles.card}>
      <div style={styles.inner}>
        {/* Icon bubble */}
        <div
          style={{ ...styles.iconBubble, background: t.bg, color: t.textColor }}
        >
          {t.icon}
        </div>

        {/* Content */}
        <div style={styles.content}>
          <p style={styles.heading}>Emotional Trend</p>
          <p style={{ ...styles.direction, color: t.color }}>{t.symbol}</p>
        </div>

        {/* Delta chip */}
        <div
          style={{
            ...styles.deltaChip,
            background: t.bg,
            color: t.textColor,
          }}
        >
          {trend.direction === "up" ? "+" : ""}
          {trend.delta.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--md-surface-container-lowest)",
    borderRadius: "var(--md-shape-lg)",
    boxShadow: "var(--md-elevation-1)",
    overflow: "hidden",
  },
  inner: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "24px 28px",
    flexWrap: "wrap",
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: "var(--md-shape-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 120,
  },
  heading: {
    font: "var(--md-label-medium)",
    color: "var(--md-on-surface-variant)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 4,
  },
  direction: {
    font: "var(--md-headline-large)",
  },
  deltaChip: {
    font: "var(--md-label-large)",
    padding: "6px 16px",
    borderRadius: "var(--md-shape-full)",
    fontVariantNumeric: "tabular-nums",
    flexShrink: 0,
  },
};
