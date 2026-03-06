export default function ReportHighlights({ highlights }) {
  if (!highlights || highlights.length === 0) {
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p style={styles.emptyText}>No highlights yet</p>
        </div>
      </div>
    );
  }

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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <h3 style={styles.title}>Key Insights</h3>
      </div>

      {/* List */}
      <div style={styles.list}>
        {highlights.map((h, i) => (
          <div key={i} style={styles.listItem}>
            <div style={styles.bullet}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={styles.listText}>{h}</p>
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
    background: "var(--md-primary-container)",
    color: "var(--md-on-primary-container)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    font: "var(--md-headline-medium)",
    color: "var(--md-on-surface)",
  },

  /* List */
  list: {
    padding: "16px 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 16px",
    background: "var(--md-surface-container-low)",
    borderRadius: "var(--md-shape-md)",
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: "var(--md-shape-full)",
    background: "var(--md-primary-container)",
    color: "var(--md-on-primary-container)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  listText: {
    font: "var(--md-body-medium)",
    color: "var(--md-on-surface)",
    lineHeight: "1.5",
  },
};
