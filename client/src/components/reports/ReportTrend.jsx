const trendConfig = {
  up: {
    color: "#4C662B",
    bg: "#CDEDA3",
    text: "#354E16",
    symbol: "Improving",
    emoji: "📈",
    note: "Your emotional trend has been moving in a positive direction this week.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  down: {
    color: "#BA1A1A",
    bg: "#FFDAD6",
    text: "#93000A",
    symbol: "Declining",
    emoji: "📉",
    note: "Your mood has been trending lower than usual. Consider a grounding or coping exercise.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </svg>
    ),
  },
  stable: {
    color: "#586249",
    bg: "#DCE7C8",
    text: "#404A33",
    symbol: "Stable",
    emoji: "📊",
    note: "Your emotional state has been consistent throughout the week.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="15 8 19 12 15 16" />
      </svg>
    ),
  },
};

export default function ReportTrend({ trend }) {
  const t = trendConfig[trend?.direction] ?? trendConfig.stable;
  const delta = trend?.delta ?? 0;

  return (
    <>
      <style>{`
        .rt-wrap {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface-container-low);
          border: 1.5px solid var(--outline-variant);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 12px rgba(26,28,22,0.07);
          color: var(--on-surface);
          animation: rtIn 0.4s ease-out both;
        }
        .rt-wrap::before {
          content: '';
          position: absolute;
          top: -45px; right: -45px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(76,102,43,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        @keyframes rtIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .rt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--outline-variant);
          background: var(--surface-container);
        }
        .rt-header-left { display: flex; align-items: center; gap: 10px; }
        .rt-icon {
          width: 30px; height: 30px;
          border-radius: 9px;
          display: grid; place-items: center;
        }
        .rt-icon svg { width: 14px; height: 14px; }
        .rt-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--on-surface);
        }
        .rt-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 11px;
          border-radius: 100px;
          font-size: 11.5px;
          font-weight: 500;
          border: 1.5px solid;
        }

        .rt-body {
          padding: 18px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .rt-main {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 14px;
          border: 1.5px solid;
          flex-wrap: wrap;
        }
        .rt-main-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: grid; place-items: center;
          flex-shrink: 0;
        }
        .rt-main-icon svg { width: 22px; height: 22px; }
        .rt-main-content { flex: 1; min-width: 120px; }
        .rt-main-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 3px;
        }
        .rt-main-direction {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 400;
          line-height: 1.2;
        }
        .rt-main-note {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.55;
          margin-top: 4px;
          opacity: 0.85;
        }

        .rt-scores {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rt-score-block {
          flex: 1;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid;
          text-align: center;
        }
        .rt-score-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 4px;
        }
        .rt-score-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 400;
          line-height: 1;
        }
        .rt-score-arrow {
          font-size: 1.4rem;
          flex-shrink: 0;
          opacity: 0.5;
        }
      `}</style>
      <div className="rt-wrap">
        <div className="rt-header">
          <div className="rt-header-left">
            <div
              className="rt-icon"
              style={{ background: t.bg, color: t.color }}
            >
              {t.icon}
            </div>
            <span className="rt-title">Emotional Trend</span>
          </div>
          <div
            className="rt-badge"
            style={{
              background: t.bg,
              color: t.text,
              borderColor: `${t.color}30`,
            }}
          >
            {t.emoji} {t.symbol}
          </div>
        </div>

        <div className="rt-body">
          <div
            className="rt-main"
            style={{
              background: t.bg,
              borderColor: `${t.color}25`,
              color: t.text,
            }}
          >
            <div
              className="rt-main-icon"
              style={{ background: `${t.color}18` }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={t.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {trend?.direction === "up" && (
                  <>
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </>
                )}
                {trend?.direction === "down" && (
                  <>
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                    <polyline points="17 18 23 18 23 12" />
                  </>
                )}
                {(!trend?.direction || trend?.direction === "stable") && (
                  <>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="15 8 19 12 15 16" />
                  </>
                )}
              </svg>
            </div>
            <div className="rt-main-content">
              <div className="rt-main-label">Weekly Direction</div>
              <div className="rt-main-direction">{t.symbol}</div>
              <div className="rt-main-note">{t.note}</div>
            </div>
          </div>

          <div className="rt-scores">
            <div
              className="rt-score-block"
              style={{
                background: t.bg,
                borderColor: `${t.color}20`,
                color: t.text,
              }}
            >
              <div className="rt-score-label">Recent</div>
              <div className="rt-score-value" style={{ color: t.color }}>
                {trend?.recentScore ?? "—"}
              </div>
            </div>
            <div className="rt-score-arrow" style={{ color: t.color }}>
              {trend?.direction === "up"
                ? "↑"
                : trend?.direction === "down"
                  ? "↓"
                  : "→"}
            </div>
            <div
              className="rt-score-block"
              style={{
                background: "var(--surface-container-high)",
                borderColor: "var(--outline-variant)",
              }}
            >
              <div
                className="rt-score-label"
                style={{ color: "var(--outline)" }}
              >
                Delta
              </div>
              <div
                className="rt-score-value"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {trend?.direction === "up" ? "+" : ""}
                {typeof delta === "number" ? delta.toFixed(2) : delta}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
