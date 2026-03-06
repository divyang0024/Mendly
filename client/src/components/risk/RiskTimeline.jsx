import { useEffect, useState } from "react";
import { getRiskEvents } from "../../features/risk/risk.api";

export default function RiskTimeline({ refresh }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await getRiskEvents();
      setEvents(res.data);
    };
    fetchEvents();
  }, [refresh]);

  const levelConfig = {
    low: {
      bg: "var(--risk-low-bg)",
      text: "var(--risk-low-text)",
      border: "var(--risk-low-border)",
      dot: "#4C662B",
    },
    moderate: {
      bg: "var(--risk-moderate-bg)",
      text: "var(--risk-moderate-text)",
      border: "var(--risk-moderate-border)",
      dot: "#586249",
    },
    high: {
      bg: "var(--risk-high-bg)",
      text: "var(--risk-high-text)",
      border: "var(--risk-high-border)",
      dot: "#B45000",
    },
    crisis: {
      bg: "var(--risk-crisis-bg)",
      text: "var(--risk-crisis-text)",
      border: "var(--risk-crisis-border)",
      dot: "#BA1A1A",
    },
  };

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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3 style={styles.title}>Recent Risk Events</h3>
        <span style={styles.badge}>{events.length}</span>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div style={styles.emptyState}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--md-outline-variant)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p style={styles.emptyText}>No risk events yet</p>
        </div>
      )}

      {/* Timeline */}
      <div style={styles.timeline}>
        {events.map((e, i) => {
          const cfg = levelConfig[e.level] || levelConfig.low;
          const isLast = i === events.length - 1;

          return (
            <div key={e._id} style={styles.timelineItem}>
              {/* Vertical line + dot */}
              <div style={styles.rail}>
                <div
                  style={{
                    ...styles.dot,
                    background: cfg.dot,
                    boxShadow: `0 0 0 3px ${cfg.bg}`,
                  }}
                />
                {!isLast && <div style={styles.line} />}
              </div>

              {/* Content */}
              <div style={styles.eventContent}>
                <div style={styles.eventHeader}>
                  <span
                    style={{
                      ...styles.levelChip,
                      background: cfg.bg,
                      color: cfg.text,
                      border: `1px solid ${cfg.border}`,
                    }}
                  >
                    {e.level.toUpperCase()}
                  </span>
                  <span style={styles.timestamp}>
                    {new Date(e.createdAt).toLocaleString()}
                  </span>
                </div>

                {e.emotion && (
                  <p style={styles.emotion}>
                    Emotion:{" "}
                    <span style={styles.emotionValue}>{e.emotion}</span>
                  </p>
                )}

                {e.intervention && (
                  <div style={styles.interventionChip}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    {e.intervention}
                  </div>
                )}

                <p style={styles.eventText}>{e.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--md-surface-container-lowest)",
    borderRadius: "var(--md-shape-lg)",
    boxShadow: "var(--md-elevation-1)",
    padding: "24px",
    maxHeight: 520,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    flexShrink: 0,
  },
  headerIcon: {
    color: "var(--md-primary)",
  },
  title: {
    font: "var(--md-headline-medium)",
    color: "var(--md-on-surface)",
    flex: 1,
  },
  badge: {
    font: "var(--md-label-small)",
    background: "var(--md-surface-container-high)",
    color: "var(--md-on-surface-variant)",
    padding: "2px 10px",
    borderRadius: "var(--md-shape-full)",
  },

  /* Empty */
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
    gap: 12,
  },
  emptyText: {
    font: "var(--md-body-medium)",
    color: "var(--md-on-surface-variant)",
  },

  /* Timeline */
  timeline: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingRight: 4,
  },
  timelineItem: {
    display: "flex",
    gap: 16,
    minHeight: 0,
  },
  rail: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 16,
    flexShrink: 0,
    paddingTop: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    flexShrink: 0,
  },
  line: {
    width: 2,
    flex: 1,
    background: "var(--md-outline-variant)",
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 1,
  },

  /* Event content */
  eventContent: {
    flex: 1,
    paddingBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  eventHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  levelChip: {
    font: "var(--md-label-small)",
    padding: "2px 10px",
    borderRadius: "var(--md-shape-full)",
    letterSpacing: "0.04em",
    fontWeight: 600,
  },
  timestamp: {
    font: "var(--md-body-small)",
    color: "var(--md-outline)",
  },
  emotion: {
    font: "var(--md-body-medium)",
    color: "var(--md-on-surface-variant)",
  },
  emotionValue: {
    fontWeight: 600,
    color: "var(--md-on-surface)",
  },
  interventionChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    font: "var(--md-body-small)",
    color: "var(--md-tertiary)",
    background: "var(--md-tertiary-container)",
    padding: "4px 12px",
    borderRadius: "var(--md-shape-full)",
    alignSelf: "flex-start",
  },
  eventText: {
    font: "var(--md-body-medium)",
    color: "var(--md-on-surface)",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    lineHeight: "1.45",
  },
};
