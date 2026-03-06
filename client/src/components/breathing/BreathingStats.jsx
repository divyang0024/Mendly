import { useEffect, useState } from "react";
import { getBreathingStats } from "../../features/breathing/breathing.api";

export default function BreathingStats({ refreshKey }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getBreathingStats().then((res) => setStats(res.data));
  }, [refreshKey]);

  if (!stats) return null;

  const patternLabel = {
    "4-4-6": "Relax",
    box: "Box Breathing",
    extended: "Extended Exhale",
  };

  const effectivenessColor = (score) => {
    if (score >= 7)
      return {
        bg: "var(--primary-container)",
        text: "var(--on-primary-container)",
      };
    if (score >= 4)
      return {
        bg: "var(--tertiary-container)",
        text: "var(--on-tertiary-container)",
      };
    return {
      bg: "var(--secondary-container)",
      text: "var(--on-secondary-container)",
    };
  };

  const avgScore = stats.avgEffectiveness ?? 0;
  const avgColors = effectivenessColor(avgScore);

  return (
    <>
      <style>{`
        .bstats-wrap {
          background: var(--surface-container-low);
          border: 1.5px solid var(--outline-variant);
          border-radius: 20px;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          animation: bstatsFadeIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes bstatsFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .bstats-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--outline-variant);
          background: var(--surface-container);
        }

        .bstats-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bstats-header-icon {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: var(--secondary-container);
          color: var(--on-secondary-container);
          display: grid;
          place-items: center;
        }
        .bstats-header-icon svg { width: 16px; height: 16px; }

        .bstats-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--on-surface);
        }

        .bstats-sessions-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: var(--surface-container-highest);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          color: var(--outline);
          border: 1px solid var(--outline-variant);
        }

        /* Metrics grid */
        .bstats-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--outline-variant);
        }

        .bstats-metric {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 18px 20px;
          background: var(--surface-container-low);
          position: relative;
          overflow: hidden;
        }

        .bstats-metric::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          right: 0;
          height: 2px;
          border-radius: 0 0 2px 2px;
        }

        .bstats-metric.sessions::before { background: var(--primary); }
        .bstats-metric.effectiveness::before { background: var(--tertiary); }

        .bstats-metric-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          margin-bottom: 6px;
        }
        .bstats-metric-icon svg { width: 15px; height: 15px; }

        .bstats-metric-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem;
          font-weight: 600;
          color: var(--on-surface);
          line-height: 1;
        }

        .bstats-metric-label {
          font-size: 12px;
          color: var(--outline);
          font-weight: 400;
          margin-top: 2px;
        }

        .bstats-metric-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
          padding: 3px 8px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          width: fit-content;
        }

        /* Recent sessions */
        .bstats-recent {
          padding: 0 20px 20px;
        }

        .bstats-recent-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0 10px;
        }

        .bstats-recent-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--on-surface-variant);
          letter-spacing: 0.02em;
        }

        .bstats-recent-count {
          font-size: 11px;
          color: var(--outline);
        }

        .bstats-divider {
          height: 1px;
          background: var(--outline-variant);
          margin-bottom: 10px;
          opacity: 0.6;
        }

        /* Session row */
        .bstats-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: var(--surface-container);
          border: 1px solid var(--outline-variant);
          margin-bottom: 6px;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          animation: bstatsFadeIn 0.4s ease both;
        }

        .bstats-row:hover {
          background: var(--surface-container-high);
          border-color: var(--outline);
          transform: translateX(2px);
        }

        .bstats-row:last-child { margin-bottom: 0; }

        .bstats-row-icon {
          width: 32px; height: 32px;
          border-radius: 9px;
          background: var(--primary-container);
          color: var(--on-primary-container);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .bstats-row-icon svg { width: 15px; height: 15px; }

        .bstats-row-body { flex: 1; min-width: 0; }

        .bstats-row-pattern {
          font-size: 13.5px;
          font-weight: 500;
          color: var(--on-surface);
          line-height: 1.3;
        }

        .bstats-row-meta {
          font-size: 11.5px;
          color: var(--outline);
          margin-top: 1px;
        }

        .bstats-score-badge {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        /* Empty state */
        .bstats-empty {
          padding: 2rem;
          text-align: center;
          color: var(--outline);
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 420px) {
          .bstats-metrics { grid-template-columns: 1fr; }
          .bstats-metric { padding: 14px 16px; }
          .bstats-recent { padding: 0 14px 16px; }
          .bstats-header { padding: 14px 16px; }
        }
      `}</style>

      <div className="bstats-wrap">
        {/* Header */}
        <div className="bstats-header">
          <div className="bstats-header-left">
            <div className="bstats-header-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <span className="bstats-header-title">Your Breathing Impact</span>
          </div>
          <div className="bstats-sessions-chip">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            {stats.sessions} sessions
          </div>
        </div>

        {/* Metrics */}
        <div className="bstats-metrics">
          {/* Total Sessions */}
          <div className="bstats-metric sessions">
            <div
              className="bstats-metric-icon"
              style={{
                background: "var(--primary-container)",
                color: "var(--on-primary-container)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="bstats-metric-value">{stats.sessions}</div>
            <div className="bstats-metric-label">Total Sessions</div>
            <div
              className="bstats-metric-badge"
              style={{
                background: "var(--primary-container)",
                color: "var(--on-primary-container)",
              }}
            >
              All time
            </div>
          </div>

          {/* Avg Effectiveness */}
          <div className="bstats-metric effectiveness">
            <div
              className="bstats-metric-icon"
              style={{ background: avgColors.bg, color: avgColors.text }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div className="bstats-metric-value">{avgScore.toFixed(2)}</div>
            <div className="bstats-metric-label">Avg Effectiveness</div>
            <div
              className="bstats-metric-badge"
              style={{ background: avgColors.bg, color: avgColors.text }}
            >
              {avgScore >= 7
                ? "Great"
                : avgScore >= 4
                  ? "Moderate"
                  : "Building"}
            </div>
          </div>
        </div>

        {/* Recent sessions */}
        {stats.recent?.length > 0 && (
          <div className="bstats-recent">
            <div className="bstats-recent-header">
              <span className="bstats-recent-title">Recent Sessions</span>
              <span className="bstats-recent-count">
                {stats.recent.length} shown
              </span>
            </div>
            <div className="bstats-divider" />

            {stats.recent.map((s, i) => {
              const sc = effectivenessColor(s.effectivenessScore);
              return (
                <div
                  className="bstats-row"
                  key={s._id}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="bstats-row-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 8.03 3 13a9 9 0 0 0 9 9z" />
                      <path d="M12 8v5l3 3" />
                    </svg>
                  </div>
                  <div className="bstats-row-body">
                    <div className="bstats-row-pattern">
                      {patternLabel[s.pattern] || s.pattern}
                    </div>
                    <div className="bstats-row-meta">{s.pattern}</div>
                  </div>
                  <div
                    className="bstats-score-badge"
                    style={{ background: sc.bg, color: sc.text }}
                  >
                    {s.effectivenessScore}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty recent */}
        {(!stats.recent || stats.recent.length === 0) && (
          <div className="bstats-empty">
            Complete a session to see your history here.
          </div>
        )}
      </div>
    </>
  );
}
