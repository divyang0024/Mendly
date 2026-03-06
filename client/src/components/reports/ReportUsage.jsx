export default function ReportUsage({ usage }) {
  const entries = Object.entries(usage || {});

  if (entries.length === 0) {
    return (
      <div style={styles.card}>
        <div style={styles.emptyInner}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--md-outline-variant)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
          <p style={styles.emptyText}>No coping usage yet</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...entries.map(([, c]) => c), 1);

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
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
        </div>
        <h3 style={styles.title}>Coping Usage</h3>
      </div>

      {/* Bars */}
      <div style={styles.barList}>
        {entries.map(([tool, count]) => (
          <div key={tool} style={styles.barItem}>
            <div style={styles.barLabel}>
              <span style={styles.toolName}>{tool}</span>
              <span style={styles.toolCount}>{count}</span>
            </div>
            <div style={styles.trackBg}>
              <div
                style={{
                  ...styles.trackFill,
                  width: `${Math.max((count / maxCount) * 100, 4)}%`,
                }}
              />
            </div>
          </div>
        ))}
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

  /* Empty */
  emptyInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    gap: 10,
  },
  emptyText: {
    font: "var(--md-body-medium)",
    color: "var(--md-on-surface-variant)",
  },

  /* Header */
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
    background: "var(--md-secondary-container)",
    color: "var(--md-on-secondary-container)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    font: "var(--md-headline-medium)",
    color: "var(--md-on-surface)",
  },

  /* Bar list */
  barList: {
    padding: "16px 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  barItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  barLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  toolName: {
    font: "var(--md-body-medium)",
    color: "var(--md-on-surface)",
    fontWeight: 500,
  },
  toolCount: {
    font: "var(--md-label-medium)",
    color: "var(--md-on-surface-variant)",
    fontVariantNumeric: "tabular-nums",
  },
  trackBg: {
    width: "100%",
    height: 8,
    borderRadius: "var(--md-shape-full)",
    background: "var(--md-surface-container-high)",
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: "var(--md-shape-full)",
    background: "var(--md-primary)",
    transition: "width 0.4s ease",
  },
};
