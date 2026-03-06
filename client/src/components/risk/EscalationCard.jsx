export default function EscalationCard({ escalation }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconWrap}>
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <h3 style={styles.title}>Escalation Plan</h3>
      </div>

      <div style={styles.body}>
        {/* Reason */}
        <div style={styles.field}>
          <span style={styles.fieldLabel}>Reason</span>
          <p style={styles.fieldValue}>{escalation.reason}</p>
        </div>

        {/* Recommended Action */}
        <div style={styles.actionField}>
          <span style={styles.fieldLabel}>Recommended Action</span>
          <p style={styles.actionValue}>{escalation.action}</p>
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
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "20px 24px 0",
  },
  iconWrap: {
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
  body: {
    padding: "16px 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: {
    padding: "14px 16px",
    background: "var(--md-surface-container-low)",
    borderRadius: "var(--md-shape-md)",
    borderLeft: "3px solid var(--md-outline-variant)",
  },
  fieldLabel: {
    font: "var(--md-label-small)",
    color: "var(--md-on-surface-variant)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: 4,
  },
  fieldValue: {
    font: "var(--md-body-large)",
    color: "var(--md-on-surface)",
  },
  actionField: {
    padding: "14px 16px",
    background: "var(--md-primary-container)",
    borderRadius: "var(--md-shape-md)",
    borderLeft: "3px solid var(--md-primary)",
  },
  actionValue: {
    font: "var(--md-body-large)",
    color: "var(--md-on-primary-container)",
    fontWeight: 500,
  },
};
