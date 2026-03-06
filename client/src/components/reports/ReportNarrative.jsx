export default function ReportNarrative({ text }) {
  if (!text) return null;

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
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
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <h3 style={styles.title}>Weekly Reflection</h3>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <p style={styles.text}>{text}</p>
      </div>

      {/* Accent bar at bottom */}
      <div style={styles.accentBar} />
    </div>
  );
}

const styles = {
  card: {
    background: "var(--md-primary-container)",
    borderRadius: "var(--md-shape-lg)",
    boxShadow: "var(--md-elevation-1)",
    overflow: "hidden",
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "20px 24px 0",
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: "var(--md-shape-sm)",
    background: "var(--md-primary)",
    color: "var(--md-on-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    font: "var(--md-headline-medium)",
    color: "var(--md-on-primary-container)",
  },
  body: {
    padding: "16px 24px 24px",
  },
  text: {
    font: "var(--md-body-large)",
    color: "var(--md-on-primary-container)",
    whiteSpace: "pre-line",
    lineHeight: "1.65",
  },
  accentBar: {
    height: 4,
    background: "var(--md-primary)",
  },
};
