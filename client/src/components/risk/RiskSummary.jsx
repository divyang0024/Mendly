import { useEffect, useState } from "react";
import { getRiskSummary } from "../../features/risk/risk.api";

export default function RiskSummary({ refresh }) {
  const [data, setData] = useState({
    low: 0,
    moderate: 0,
    high: 0,
    crisis: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRiskSummary();
      setData(res.data);
    };
    fetchData();
  }, [refresh]);

  const cards = [
    {
      label: "Low Risk",
      value: data.low,
      bg: "var(--risk-low-bg)",
      text: "var(--risk-low-text)",
      border: "var(--risk-low-border)",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Moderate",
      value: data.moderate,
      bg: "var(--risk-moderate-bg)",
      text: "var(--risk-moderate-text)",
      border: "var(--risk-moderate-border)",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      label: "High Risk",
      value: data.high,
      bg: "var(--risk-high-bg)",
      text: "var(--risk-high-text)",
      border: "var(--risk-high-border)",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      label: "Crisis",
      value: data.crisis,
      bg: "var(--risk-crisis-bg)",
      text: "var(--risk-crisis-text)",
      border: "var(--risk-crisis-border)",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            ...styles.card,
            borderTop: `3px solid ${card.border}`,
          }}
        >
          <div
            style={{
              ...styles.iconWrap,
              background: card.bg,
              color: card.text,
            }}
          >
            {card.icon}
          </div>
          <p style={styles.label}>{card.label}</p>
          <p style={{ ...styles.value, color: card.text }}>{card.value}</p>
        </div>
      ))}
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
    alignItems: "flex-start",
    gap: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: "var(--md-shape-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    font: "var(--md-label-medium)",
    color: "var(--md-on-surface-variant)",
  },
  value: {
    font: "var(--md-display-large)",
    lineHeight: 1,
  },
};
