export default function ReportTriggers({ triggers }) {
  if (!triggers || triggers.length === 0) {
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
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p style={styles.emptyText}>No triggers detected</p>
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
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <h3 style={styles.title}>Frequent Triggers</h3>
      </div>

      {/* Chips */}
      <div style={styles.chipWrap}>
        {triggers.map((t, i) => (
          <span key={i} style={styles.chip}>
            <span style={styles.chipKeyword}>{t.keyword}</span>
            <span style={styles.chipCount}>{t.count}</span>
          </span>
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
    background: "var(--md-tertiary-container)",
    color: "var(--md-on-tertiary-container)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    font: "var(--md-headline-medium)",
    color: "var(--md-on-surface)",
  },

  /* Chips */
  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    padding: "16px 24px 24px",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    font: "var(--md-body-medium)",
    color: "var(--md-on-surface)",
    background: "var(--md-surface-container)",
    border: "1px solid var(--md-outline-variant)",
    borderRadius: "var(--md-shape-full)",
    padding: "6px 14px",
  },
  chipKeyword: {
    fontWeight: 500,
  },
  chipCount: {
    font: "var(--md-label-small)",
    color: "var(--md-on-surface-variant)",
    background: "var(--md-surface-container-high)",
    borderRadius: "var(--md-shape-full)",
    padding: "1px 8px",
    minWidth: 22,
    textAlign: "center",
  },
};
