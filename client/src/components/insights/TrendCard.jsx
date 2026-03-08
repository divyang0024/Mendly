import { useEffect, useState } from "react";
import { getTrend } from "../../features/insights/insights.api";

/* ── Trend direction SVG icons ── */
const ImprovingIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const WorseningIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
const StableIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

/* ── Brand-mapped trend config ── */
const trendMeta = {
  improving: {
    color: "#4C662B",
    bg: "#CDEDA3",
    text: "#354E16",
    ArrowIcon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
    TrendIcon: ImprovingIcon,
    label: "Improving",
    note: "Your recent mood is trending in a positive direction. Keep going.",
  },
  worsening: {
    color: "#BA1A1A",
    bg: "#FFDAD6",
    text: "#93000A",
    ArrowIcon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    ),
    TrendIcon: WorseningIcon,
    label: "Worsening",
    note: "Your recent mood has been lower than usual. Consider reaching out or trying a coping exercise.",
  },
  stable: {
    color: "#586249",
    bg: "#DCE7C8",
    text: "#404A33",
    ArrowIcon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
      </svg>
    ),
    TrendIcon: StableIcon,
    label: "Stable",
    note: "Your emotional state has been relatively consistent lately.",
  },
};

export default function TrendCard() {
  const [trend, setTrend] = useState(null);

  /* ── Original logic — unchanged ── */
  useEffect(() => {
    getTrend().then((res) => setTrend(res.data));
  }, []);

  if (!trend) return null;

  /* ── Insufficient history state ── */
  if (trend.trend === "insufficient_history") {
    return (
      <>
        <style>{tcStyles}</style>
        <div className="tc-wrap">
          <div className="tc-header">
            <div className="tc-header-left">
              <div
                className="tc-icon"
                style={{
                  background: "var(--surface-container-high)",
                  color: "var(--outline)",
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
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span className="tc-title">Emotional Trend</span>
            </div>
            <div className="tc-badge">Pending</div>
          </div>
          <div className="tc-body">
            <div className="tc-insufficient">
              <div className="tc-insuf-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div className="tc-insuf-title">Not enough data yet</div>
                <p className="tc-insuf-text">
                  Keep chatting to unlock trend insights.
                </p>
                <div className="tc-score-row">
                  <span
                    className="tc-score-chip"
                    style={{
                      background: "var(--surface-container-high)",
                      color: "var(--outline)",
                    }}
                  >
                    Recent score: {trend.recentScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  /* ── End original logic ── */

  const meta = trendMeta[trend.trend] ?? trendMeta.stable;
  const { ArrowIcon, TrendIcon } = meta;

  return (
    <>
      <style>{tcStyles}</style>
      <div className="tc-wrap">
        <div className="tc-header">
          <div className="tc-header-left">
            <div
              className="tc-icon"
              style={{ background: meta.bg, color: meta.color }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="tc-title">Emotional Trend</span>
          </div>
          <div
            className="tc-badge"
            style={{
              background: meta.bg,
              color: meta.text,
              borderColor: `${meta.color}30`,
            }}
          >
            <span className="tc-badge-icon" style={{ color: meta.color }}>
              <ArrowIcon />
            </span>
            {meta.label}
          </div>
        </div>

        <div className="tc-body">
          {/* Trend display */}
          <div
            className="tc-trend-display"
            style={{ background: meta.bg, borderColor: `${meta.color}25` }}
          >
            <div className="tc-trend-icon" style={{ color: meta.color }}>
              <TrendIcon />
            </div>
            <div>
              <div className="tc-trend-label" style={{ color: meta.text }}>
                {meta.label.toUpperCase()}
              </div>
              <p className="tc-trend-note" style={{ color: meta.text }}>
                {meta.note}
              </p>
            </div>
          </div>

          {/* Score comparison */}
          <div className="tc-scores">
            <div
              className="tc-score-block"
              style={{ background: meta.bg, borderColor: `${meta.color}20` }}
            >
              <div className="tc-score-label" style={{ color: meta.text }}>
                Recent
              </div>
              <div className="tc-score-value" style={{ color: meta.color }}>
                {trend.recentScore}
              </div>
            </div>
            <div className="tc-score-arrow" style={{ color: meta.color }}>
              <ArrowIcon />
            </div>
            <div
              className="tc-score-block"
              style={{
                background: "var(--surface-container-high)",
                borderColor: "var(--outline-variant)",
              }}
            >
              <div
                className="tc-score-label"
                style={{ color: "var(--outline)" }}
              >
                Past
              </div>
              <div
                className="tc-score-value"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {trend.pastScore}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const tcStyles = `
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
.tc-wrap {
  font-family:'DM Sans',sans-serif;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
  color:var(--on-surface);
}
.tc-wrap::before {
  content:''; position:absolute;
  top:-48px; right:-48px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.tc-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  position:relative; z-index:1;
}
.tc-header-left { display:flex; align-items:center; gap:10px; }
.tc-icon {
  width:30px; height:30px; border-radius:9px;
  display:grid; place-items:center; flex-shrink:0;
}
.tc-icon svg { width:14px; height:14px; }
.tc-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400; color:var(--on-surface);
}
.tc-badge {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px 3px 7px; border-radius:100px;
  font-size:11.5px; font-weight:500;
  border:1.5px solid;
  background:var(--surface-container-highest);
  color:var(--outline); border-color:var(--outline-variant);
}
.tc-badge-icon { width:13px; height:13px; display:flex; align-items:center; }
.tc-badge-icon svg { width:13px; height:13px; }

/* ── BODY ── */
.tc-body {
  padding:18px; position:relative; z-index:1;
  display:flex; flex-direction:column; gap:14px;
}

/* Trend display block */
.tc-trend-display {
  display:flex; align-items:center; gap:16px;
  padding:16px; border-radius:14px; border:1.5px solid;
}
.tc-trend-icon {
  width:44px; height:44px; flex-shrink:0;
  display:grid; place-items:center;
}
.tc-trend-icon svg { width:32px; height:32px; }
.tc-trend-label {
  font-family:'Playfair Display',serif;
  font-size:1.2rem; font-weight:400;
  letter-spacing:-0.1px; margin-bottom:4px;
}
.tc-trend-note {
  font-size:13px; font-weight:300; line-height:1.55;
  margin:0; opacity:0.85;
}

/* Score comparison */
.tc-scores { display:flex; align-items:center; gap:10px; }
.tc-score-block {
  flex:1; padding:12px 14px; border-radius:12px;
  border:1.5px solid; text-align:center;
}
.tc-score-label {
  font-size:11px; font-weight:500; letter-spacing:0.05em;
  text-transform:uppercase; opacity:0.7; margin-bottom:4px;
}
.tc-score-value {
  font-family:'Playfair Display',serif;
  font-size:1.6rem; font-weight:400; line-height:1;
}
.tc-score-arrow {
  width:22px; height:22px; flex-shrink:0; opacity:0.7;
}
.tc-score-arrow svg { width:22px; height:22px; }

/* Insufficient state */
.tc-insufficient { display:flex; align-items:flex-start; gap:14px; padding:4px 0; }
.tc-insuf-icon {
  width:40px; height:40px; flex-shrink:0;
  border-radius:12px; display:grid; place-items:center;
  background:var(--surface-container-high);
  color:var(--outline);
}
.tc-insuf-icon svg { width:20px; height:20px; }
.tc-insuf-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400; color:var(--on-surface); margin-bottom:5px;
}
.tc-insuf-text {
  font-size:13.5px; color:var(--outline); font-weight:300;
  margin:0 0 10px; line-height:1.55;
}
.tc-score-row { display:flex; gap:8px; flex-wrap:wrap; }
.tc-score-chip {
  display:inline-flex; padding:4px 11px; border-radius:100px;
  font-size:12px; font-weight:500;
}

@media(max-width:480px) {
  .tc-wrap { border-radius:16px; }
  .tc-body { padding:14px; gap:12px; }
  .tc-trend-display { gap:12px; padding:13px; }
  .tc-trend-icon { width:36px; height:36px; }
  .tc-trend-icon svg { width:26px; height:26px; }
}
`;
