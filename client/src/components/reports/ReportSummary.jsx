export default function ReportSummary({ summary }) {
  return (
    <div style={styles.grid}>
      <Card
        label="Total Sessions"
        value={summary.totalSessions}
        icon={
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        }
        accentBg="var(--md-primary-container)"
        accentColor="var(--md-on-primary-container)"
      />
      <Card
        label="Avg Mood"
        value={summary.avgMood.toFixed(2)}
        icon={
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
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        }
        accentBg="var(--md-secondary-container)"
        accentColor="var(--md-on-secondary-container)"
      />
      <Card
        label="Top Emotion"
        value={summary.topEmotion}
        icon={
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
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        }
        accentBg="var(--md-tertiary-container)"
        accentColor="var(--md-on-tertiary-container)"
      />
      <Card
        label="Best Tool"
        value={summary.bestTool}
        icon={
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
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        }
        accentBg="var(--md-surface-container-high)"
        accentColor="var(--md-on-surface-variant)"
      />
    </div>
  );
}

function Card({ label, value, icon, accentBg, accentColor }) {
  return (
    <div style={styles.card}>
      <div
        style={{
          ...styles.iconWrap,
          background: accentBg,
          color: accentColor,
        }}
      >
        {icon}
      </div>
      <p style={styles.label}>{label}</p>
      <p style={styles.value}>{value}</p>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 16,
  },
  card: {
    background: "var(--md-surface-container-lowest)",
    borderRadius: "var(--md-shape-md)",
    boxShadow: "var(--md-elevation-1)",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    textAlign: "center",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: "var(--md-shape-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  label: {
    font: "var(--md-label-medium)",
    color: "var(--md-on-surface-variant)",
  },
  value: {
    font: "var(--md-title-large)",
    color: "var(--md-on-surface)",
    wordBreak: "break-word",
  },
};
