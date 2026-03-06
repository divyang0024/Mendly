export default function RiskBadge({ level }) {
  const config = {
    low: {
      label: "Low Risk",
      bg: "var(--risk-low-bg)",
      text: "var(--risk-low-text)",
      border: "var(--risk-low-border)",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    moderate: {
      label: "Moderate Risk",
      bg: "var(--risk-moderate-bg)",
      text: "var(--risk-moderate-text)",
      border: "var(--risk-moderate-border)",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    high: {
      label: "High Risk",
      bg: "var(--risk-high-bg)",
      text: "var(--risk-high-text)",
      border: "var(--risk-high-border)",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    crisis: {
      label: "Crisis",
      bg: "var(--risk-crisis-bg)",
      text: "var(--risk-crisis-text)",
      border: "var(--risk-crisis-border)",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  };

  const badge = config[level] || config.low;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 20px",
        borderRadius: "var(--md-shape-full)",
        background: badge.bg,
        color: badge.text,
        border: `1.5px solid ${badge.border}`,
        font: "var(--md-label-large)",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {badge.icon}
      {badge.label}
    </div>
  );
}
