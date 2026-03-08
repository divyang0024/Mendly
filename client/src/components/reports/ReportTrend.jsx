const trendConfig = {
  up: {
    color: "#4C662B",
    bg: "#CDEDA3",
    text: "#354E16",
    symbol: "Improving",
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
    arrowIcon: (color) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
  },
  down: {
    color: "#BA1A1A",
    bg: "#FFDAD6",
    text: "#93000A",
    symbol: "Declining",
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
    arrowIcon: (color) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    ),
  },
  stable: {
    color: "#586249",
    bg: "#DCE7C8",
    text: "#404A33",
    symbol: "Stable",
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
    arrowIcon: (color) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
      </svg>
    ),
  },
};

export default function ReportTrend({ trend }) {
  const t = trendConfig[trend?.direction] ?? trendConfig.stable;
  const delta = trend?.delta ?? 0;

  return (
    <>
      <style>{rtStyles}</style>
      <div className="rt-wrap">
        {/* ── Header ── */}
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
            <span className="rt-badge-icon" style={{ color: t.color }}>
              {t.arrowIcon(t.color)}
            </span>
            {t.symbol}
          </div>
        </div>

        <div className="rt-body">
          {/* Main block */}
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

          {/* Score comparison */}
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
              {t.arrowIcon(t.color)}
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

const rtStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary-container:#354E16;
  --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
  --on-surface:#1A1C16;--on-surface-variant:#44483D;
  --outline:#75796C;--outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
}

/* ── CARD SHELL ── */
.rt-wrap {
  font-family:'DM Sans',sans-serif;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
  color:var(--on-surface);
  animation:rtIn 0.4s ease-out both;
}
.rt-wrap::before {
  content:''; position:absolute;
  top:-48px; right:-48px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}
@keyframes rtIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── HEADER ── */
.rt-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  position:relative; z-index:1;
}
.rt-header-left { display:flex; align-items:center; gap:10px; }
.rt-icon {
  width:30px; height:30px; border-radius:9px;
  display:grid; place-items:center; flex-shrink:0;
}
.rt-icon svg { width:14px; height:14px; }
.rt-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400; color:var(--on-surface);
}
.rt-badge {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px 3px 7px; border-radius:100px;
  font-size:11.5px; font-weight:500; border:1.5px solid;
}
.rt-badge-icon { width:13px; height:13px; display:flex; align-items:center; flex-shrink:0; }
.rt-badge-icon svg { width:13px; height:13px; }

/* ── BODY ── */
.rt-body { padding:18px; position:relative; z-index:1; display:flex; flex-direction:column; gap:14px; }

/* Main block */
.rt-main {
  display:flex; align-items:center; gap:16px;
  padding:16px; border-radius:14px; border:1.5px solid; flex-wrap:wrap;
}
.rt-main-icon {
  width:52px; height:52px; border-radius:14px;
  display:grid; place-items:center; flex-shrink:0;
}
.rt-main-icon svg { width:22px; height:22px; }
.rt-main-content { flex:1; min-width:120px; }
.rt-main-label { font-size:11px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; opacity:0.7; margin-bottom:3px; }
.rt-main-direction { font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:400; line-height:1.2; }
.rt-main-note { font-size:13px; font-weight:300; line-height:1.55; margin-top:4px; opacity:0.85; }

/* Score row */
.rt-scores { display:flex; align-items:center; gap:10px; }
.rt-score-block { flex:1; padding:12px 14px; border-radius:12px; border:1.5px solid; text-align:center; }
.rt-score-label { font-size:11px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; opacity:0.7; margin-bottom:4px; }
.rt-score-value { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:400; line-height:1; }
.rt-score-arrow { width:22px; height:22px; flex-shrink:0; opacity:0.6; display:flex; align-items:center; }
.rt-score-arrow svg { width:22px; height:22px; }

@media(max-width:480px) {
  .rt-wrap { border-radius:16px; }
  .rt-body { padding:14px; gap:12px; }
  .rt-main { gap:12px; padding:13px; }
}
`;
