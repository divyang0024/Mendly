import { useEffect, useState } from "react";
import { getLongTermSummary } from "../features/longterm/longterm.api";

/* ─────────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────────── */
function Skeleton({ h = 80, r = 14 }) {
  return <div className="lt-skel" style={{ height: h, borderRadius: r }} />;
}

/* ─────────────────────────────────────────────────────────────────
   SUMMARY CARDS
   data.summary: { totalSessions, avgMood, topEmotion, bestTool }
───────────────────────────────────────────────────────────────── */
function SummaryCards({ data }) {
  if (!data) return null;
  const items = [
    {
      label: "Total sessions",
      value: data.totalSessions ?? "—",
      unit: "sessions",
      color: "primary",
      icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
      icon2: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    },
    {
      label: "Average mood",
      value: data.avgMood != null ? data.avgMood.toFixed(1) : "—",
      unit: "/ 10",
      color: "secondary",
      icon: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
    },
    {
      label: "Top emotion",
      value: data.topEmotion ?? "—",
      unit: "",
      color: "tertiary",
      icon: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z",
    },
    {
      label: "Best tool",
      value: data.bestTool ?? "—",
      unit: "",
      color: "secondary",
      icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    },
  ];

  return (
    <div className="lt-summary-grid">
      {items.map(({ label, value, unit, color, icon, icon2 }) => (
        <div key={label} className={`lt-stat-card lt-stat-${color}`}>
          <div className={`lt-stat-icon lt-stat-icon-${color}`}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={icon} />
              {icon2 && <path d={icon2} />}
            </svg>
          </div>
          <p className="lt-stat-label">{label}</p>
          <p className="lt-stat-value">
            {value}
            {unit && <span className="lt-stat-unit"> {unit}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TREND CARD
   trend: { direction: "up"|"down", delta: number }
───────────────────────────────────────────────────────────────── */
function TrendCard({ trend }) {
  if (!trend) return <EmptyState label="No trend data yet" />;

  const up = trend.direction === "up";
  const delta = trend.delta != null ? Math.abs(trend.delta).toFixed(2) : null;
  const bgColor = up ? "var(--primary-container)" : "var(--error-container)";
  const fgColor = up
    ? "var(--on-primary-container)"
    : "var(--on-error-container)";
  const arrowPath = up ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M5 12l7 7 7-7";

  return (
    <div className="lt-card">
      <div className="lt-card-header">
        <div className="lt-card-icon lt-card-icon-tertiary">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        </div>
        <div>
          <p className="lt-card-title">Mood Trend</p>
          <p className="lt-card-sub">Overall direction</p>
        </div>
        {delta !== null && (
          <span className={`lt-delta ${up ? "lt-delta-up" : "lt-delta-down"}`}>
            {up ? "↑" : "↓"} {delta}
          </span>
        )}
      </div>

      <div className="lt-trend-direction" style={{ background: bgColor }}>
        <svg
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="none"
          stroke={fgColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={arrowPath} />
        </svg>
        <div>
          <p className="lt-trend-dir-label" style={{ color: fgColor }}>
            {up ? "Improving" : "Declining"}
          </p>
          {delta && (
            <p
              className="lt-trend-dir-sub"
              style={{ color: fgColor, opacity: 0.75 }}
            >
              {delta} point {up ? "increase" : "decrease"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COPING USAGE CARD  —  SVG donut chart + legend
   copingUsage: { breathing: 35, activation: 15, coping: 9, ... }
───────────────────────────────────────────────────────────────── */
const COPING_PALETTE = [
  "#4C662B",
  "#386663",
  "#86A33F",
  "#586249",
  "#2d6b68",
  "#6B8A35",
];
const COPING_ICONS = {
  breathing: <path d="M12 22c0-4 4-6 4-10a4 4 0 0 0-8 0c0 4 4 6 4 10z" />,
  activation: (
    <>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </>
  ),
  reframing: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </>
  ),
  affirmation: (
    <>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </>
  ),
  coping: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};

function DonutChart({ entries, total }) {
  const R = 48,
    STROKE = 11,
    CX = 60,
    CY = 60;
  const circ = 2 * Math.PI * R;
  let offset = 0;
  const GAP = 3;

  const slices = entries.slice(0, 5).map(([name, count], i) => {
    const pct = count / total;
    const len = Math.max(pct * circ - GAP, 0);
    const start = offset;
    offset += pct * circ;
    return { name, count, pct, len, start, color: COPING_PALETTE[i] };
  });

  return (
    <svg viewBox="0 0 120 120" className="lt-donut-svg" aria-hidden="true">
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="var(--surface-container-highest)"
        strokeWidth={STROKE}
      />
      {slices.map(({ name, len, start, color }, i) => (
        <circle
          key={name}
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={`${len} ${circ}`}
          strokeDashoffset={-(start - circ * 0.25)}
          strokeLinecap="round"
          style={{
            opacity: 0,
            animation: `ltDonutIn 0.7s cubic-bezier(0.34,1.06,0.64,1) ${0.15 + i * 0.1}s both`,
          }}
        />
      ))}
    </svg>
  );
}

function CopingUsageCard({ usage }) {
  if (!usage || typeof usage !== "object" || Array.isArray(usage))
    return <EmptyState label="No coping data yet" />;
  const entries = Object.entries(usage).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return <EmptyState label="No coping data yet" />;
  const total = entries.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="lt-card lt-coping-card">
      <div className="lt-card-header">
        <div className="lt-card-icon lt-card-icon-primary">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <p className="lt-card-title">Coping Strategies</p>
          <p className="lt-card-sub">{total} total uses</p>
        </div>
      </div>

      <div className="lt-coping-body">
        {/* Donut */}
        <div className="lt-donut-wrap">
          <DonutChart entries={entries} total={total} />
          <div className="lt-donut-center">
            <span className="lt-donut-num">{total}</span>
            <span className="lt-donut-lbl">sessions</span>
          </div>
        </div>

        {/* Legend */}
        <div className="lt-coping-legend">
          {entries.slice(0, 5).map(([strategy, count], i) => {
            const pct = Math.round((count / total) * 100);
            const icon = COPING_ICONS[strategy] || COPING_ICONS.coping;
            return (
              <div
                key={strategy}
                className="lt-legend-row"
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                <span
                  className="lt-legend-dot"
                  style={{ background: COPING_PALETTE[i] }}
                />
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke={COPING_PALETTE[i]}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  {icon}
                </svg>
                <span className="lt-legend-name">{strategy}</span>
                <span
                  className="lt-legend-pct"
                  style={{ color: COPING_PALETTE[i] }}
                >
                  {pct}%
                </span>
                <span className="lt-legend-count">{count}×</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TRIGGER CARD  —  heat-intensity stained tags
   triggers: [{ keyword, count }]
───────────────────────────────────────────────────────────────── */
function TriggerCard({ triggers }) {
  if (!triggers?.length) return <EmptyState label="No triggers logged yet" />;

  const max = triggers[0]?.count || 1;
  const min = triggers[triggers.length - 1]?.count || 1;
  const range = max - min || 1;

  // heat: 0 (cool/outlined) → 1 (hot/filled)
  const heat = (count) => (count - min) / range;

  // palette: cool = teal outlines, warm = deep green fills
  const tagStyle = (count) => {
    const h = heat(count);
    if (h > 0.7) return { bg: "#4C662B", color: "#fff", border: "#4C662B" };
    if (h > 0.4) return { bg: "#CDEDA3", color: "#354E16", border: "#86A33F" };
    if (h > 0.15) return { bg: "#BCECE7", color: "#1F4E4B", border: "#386663" };
    return { bg: "transparent", color: "#75796C", border: "#C5C8BA" };
  };

  const fontSize = (count) => {
    const h = heat(count);
    return 0.72 + h * 0.55; // 0.72rem → 1.27rem
  };

  const ROTATIONS = [-4, 0, 3, -2, 0, 4, -3, 1, -1, 2];
  const VOFFSETS = [0, 14, -8, 20, -5, 24, -16, 9, -20, 7, 18, -12, 5, -22, 11];
  const pr = (i, s) => ((i * 2654435761 + s * 1234567) & 0xfffffff) / 0xfffffff;

  return (
    <div className="lt-card">
      <div className="lt-card-header">
        <div className="lt-card-icon lt-card-icon-error">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div>
          <p className="lt-card-title">Key Triggers</p>
          <p className="lt-card-sub">{triggers.length} detected</p>
        </div>
      </div>

      <div className="lt-trigger-cloud">
        {triggers.map(({ keyword, count }, i) => {
          const s = tagStyle(count);
          const fs = fontSize(count);
          const rot = ROTATIONS[i % ROTATIONS.length];
          const h = heat(count);
          return (
            <span
              key={keyword}
              className="lt-heat-tag"
              title={`${count} mentions`}
              style={{
                background: s.bg,
                color: s.color,
                border: `1.5px solid ${s.border}`,
                fontSize: `${fs}rem`,
                fontWeight: h > 0.6 ? 700 : h > 0.3 ? 600 : 500,
                transform: `rotate(${rot}deg)`,
                marginTop: `${VOFFSETS[i % VOFFSETS.length]}px`,
                "--rot": `${rot}deg`,
                "--dur": `${(2.8 + pr(i, 1) * 2.2).toFixed(2)}s`,
                "--del": `${(pr(i, 2) * 2.5).toFixed(2)}s`,
                "--amp": `${(6 + pr(i, 3) * 12).toFixed(1)}px`,
                animationDelay: `${(pr(i, 2) * 2.5).toFixed(2)}s`,
                boxShadow: h > 0.7 ? "0 2px 10px rgba(76,102,43,0.25)" : "none",
              }}
            >
              {keyword}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   HIGHLIGHTS CARD
   highlights: string[]  (plain text strings)
───────────────────────────────────────────────────────────────── */
function HighlightsCard({ highlights }) {
  if (!highlights?.length) return <EmptyState label="No highlights yet" />;

  return (
    <div className="lt-card lt-highlights-card">
      <div className="lt-card-header">
        <div className="lt-card-icon lt-card-icon-secondary">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
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
        </div>
        <div>
          <p className="lt-card-title">Highlights</p>
          <p className="lt-card-sub">{highlights.length} insights</p>
        </div>
      </div>

      <div className="lt-highlights-list">
        {highlights.map((text, i) => (
          <div
            key={i}
            className="lt-highlight-item lt-hi-secondary"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <span className="lt-hi-tag lt-hi-tag-secondary">Insight</span>
            <p className="lt-hi-title">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────────── */
function EmptyState({ label }) {
  return (
    <div className="lt-card lt-empty">
      <div className="lt-empty-ring" />
      <p className="lt-empty-label">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function LongTermPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getLongTermSummary()
      .then((res) => setData(res.data))
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <style>{ltStyles}</style>
      <div className="lt-root">
        {/* ── Sticky header ── */}
        <header className="lt-header">
          <div className="lt-header-inner">
            <div className="lt-header-left">
              <div className="lt-header-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
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
              <div>
                <h1 className="lt-header-title">Long-Term Insights</h1>
                <p className="lt-header-sub">Your emotional memory over time</p>
              </div>
            </div>
            <div className="lt-header-badge">
              <span className="lt-badge-dot" />
              Emotional Memory
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="lt-main">
          {error ? (
            <div className="lt-error-state">
              <div className="lt-error-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <p className="lt-error-title">Couldn't load insights</p>
              <p className="lt-error-body">
                Check your connection and try refreshing.
              </p>
            </div>
          ) : !data ? (
            <>
              <div className="lt-skel-strip">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} h={100} />
                ))}
              </div>
              <div className="lt-skel-bento">
                <Skeleton h={240} r={20} />
                <Skeleton h={240} r={20} />
                <Skeleton h={240} r={20} />
                <Skeleton h={140} r={20} />
              </div>
            </>
          ) : (
            <>
              {/* ── Overview strip ── */}
              <section className="lt-section" style={{ "--li": 0 }}>
                <div className="lt-section-head">
                  <span className="lt-section-pill lt-section-pill-tertiary">
                    Overview
                  </span>
                  <div className="lt-section-line" />
                </div>
                <SummaryCards data={data.summary} />
              </section>

              {/* ── Patterns bento ── */}
              <section className="lt-section" style={{ "--li": 1 }}>
                <div className="lt-section-head">
                  <span className="lt-section-pill lt-section-pill-primary">
                    Patterns &amp; Trends
                  </span>
                  <div className="lt-section-line" />
                </div>
                <div className="lt-bento">
                  <div className="lt-bento-md">
                    <TrendCard trend={data.trend} />
                  </div>
                  <div className="lt-bento-sm">
                    <CopingUsageCard usage={data.copingUsage} />
                  </div>
                  <div className="lt-bento-sm">
                    <TriggerCard triggers={data.triggers} />
                  </div>
                  <div className="lt-bento-full">
                    <HighlightsCard highlights={data.highlights} />
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────── */
const ltStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root{
  --primary:#4C662B; --primary-container:#CDEDA3; --on-primary-container:#354E16;
  --secondary:#586249; --secondary-container:#DCE7C8; --on-secondary-container:#404A33;
  --tertiary:#386663; --tertiary-container:#BCECE7; --on-tertiary-container:#1F4E4B;
  --error:#BA1A1A; --error-container:#FFDAD6; --on-error-container:#93000A;
  --on-surface:#1A1C16; --on-surface-variant:#44483D;
  --outline:#75796C; --outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9; --surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE; --surface-container-highest:#E2E3D8;
  --background:#F9FAEF;
}
.lt-root{ min-height:100vh; background:var(--background); font-family:'DM Sans',sans-serif; color:var(--on-surface); }

/* HEADER */
.lt-header{ position:sticky; top:0; z-index:20; background:rgba(249,250,239,0.92); backdrop-filter:blur(14px); border-bottom:1px solid var(--outline-variant); }
.lt-header-inner{ max-width:1080px; margin:0 auto; padding:0 clamp(1rem,4vw,2.5rem); height:64px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
.lt-header-left{ display:flex; align-items:center; gap:11px; min-width:0; }
.lt-header-icon{ width:36px; height:36px; border-radius:10px; flex-shrink:0; background:var(--tertiary-container); color:var(--on-tertiary-container); display:grid; place-items:center; }
.lt-header-title{ font-family:'Playfair Display',serif; font-size:1.05rem; font-weight:400; color:var(--on-surface); white-space:nowrap; }
.lt-header-sub{ font-size:11px; color:var(--outline); font-weight:300; margin-top:1px; }
.lt-header-badge{ display:inline-flex; align-items:center; gap:6px; padding:4px 12px 4px 8px; border-radius:100px; background:var(--tertiary-container); color:var(--on-tertiary-container); font-size:11px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; flex-shrink:0; }
.lt-badge-dot{ width:6px; height:6px; border-radius:50%; background:var(--tertiary); animation:ltBlink 2.4s ease-in-out infinite; }
@keyframes ltBlink{ 0%,100%{opacity:1} 50%{opacity:0.2} }

/* MAIN */
.lt-main{ max-width:1080px; margin:0 auto; padding:clamp(1.5rem,4vw,2.5rem) clamp(1rem,4vw,2.5rem); display:flex; flex-direction:column; gap:2.5rem; }

/* SECTION */
.lt-section{ display:flex; flex-direction:column; gap:1.1rem; opacity:0; transform:translateY(14px); animation:ltSecIn 0.5s calc(0.1s + var(--li,0)*0.12s) ease both; }
@keyframes ltSecIn{ to{opacity:1;transform:none} }
.lt-section-head{ display:flex; align-items:center; gap:12px; }
.lt-section-pill{ display:inline-flex; padding:4px 13px; border-radius:100px; font-size:10.5px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; white-space:nowrap; flex-shrink:0; }
.lt-section-pill-tertiary{ background:var(--tertiary-container); color:var(--on-tertiary-container); }
.lt-section-pill-primary{ background:var(--primary-container); color:var(--on-primary-container); }
.lt-section-line{ flex:1; height:1px; background:var(--outline-variant); opacity:0.55; }

/* SUMMARY GRID */
.lt-summary-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.lt-stat-card{ position:relative; overflow:hidden; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); border-radius:18px; padding:16px 16px 18px; display:flex; flex-direction:column; gap:6px; transition:transform 0.2s,box-shadow 0.2s; }
.lt-stat-card:hover{ transform:translateY(-3px); box-shadow:0 8px 24px rgba(26,28,22,0.09); }
.lt-stat-card::before{ content:''; position:absolute; top:-40px; right:-40px; width:110px; height:110px; border-radius:50%; pointer-events:none; }
.lt-stat-primary::before{ background:radial-gradient(circle,rgba(76,102,43,0.1) 0%,transparent 65%); }
.lt-stat-secondary::before{ background:radial-gradient(circle,rgba(88,98,73,0.1) 0%,transparent 65%); }
.lt-stat-tertiary::before{ background:radial-gradient(circle,rgba(56,102,99,0.1) 0%,transparent 65%); }
.lt-stat-icon{ width:34px; height:34px; border-radius:10px; display:grid; place-items:center; margin-bottom:2px; }
.lt-stat-icon-primary{ background:var(--primary-container); color:var(--on-primary-container); }
.lt-stat-icon-secondary{ background:var(--secondary-container); color:var(--on-secondary-container); }
.lt-stat-icon-tertiary{ background:var(--tertiary-container); color:var(--on-tertiary-container); }
.lt-stat-label{ font-size:11px; font-weight:500; letter-spacing:0.03em; text-transform:uppercase; color:var(--outline); }
.lt-stat-value{ font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:400; color:var(--on-surface); line-height:1.1; }
.lt-stat-unit{ font-family:'DM Sans',sans-serif; font-size:12px; color:var(--outline); }

/* CARD SHELL */
.lt-card{ background:var(--surface-container-low); border:1.5px solid var(--outline-variant); border-radius:20px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 1px 10px rgba(26,28,22,0.06); height:100%; }
.lt-card-header{ display:flex; align-items:center; gap:10px; padding:14px 16px 12px; background:var(--surface-container); border-bottom:1px solid var(--outline-variant); flex-shrink:0; }
.lt-card-icon{ width:32px; height:32px; border-radius:9px; flex-shrink:0; display:grid; place-items:center; }
.lt-card-icon-primary{ background:var(--primary-container); color:var(--on-primary-container); }
.lt-card-icon-secondary{ background:var(--secondary-container); color:var(--on-secondary-container); }
.lt-card-icon-tertiary{ background:var(--tertiary-container); color:var(--on-tertiary-container); }
.lt-card-icon-error{ background:var(--error-container); color:var(--on-error-container); }
.lt-card-title{ font-size:13px; font-weight:600; color:var(--on-surface); line-height:1.2; }
.lt-card-sub{ font-size:11px; color:var(--outline); margin-top:1px; }

/* TREND DIRECTION CARD */
.lt-trend-direction{ display:flex; align-items:center; gap:16px; padding:20px 20px 22px; flex:1; }
.lt-trend-dir-label{ font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:400; line-height:1.2; }
.lt-trend-dir-sub{ font-size:12px; margin-top:4px; }
.lt-delta{ margin-left:auto; flex-shrink:0; font-size:12px; font-weight:600; padding:3px 9px; border-radius:100px; }
.lt-delta-up{ background:var(--primary-container); color:var(--on-primary-container); }
.lt-delta-down{ background:var(--error-container); color:var(--on-error-container); }

/* DONUT CHART (Coping) */
.lt-coping-card .lt-card-header{ flex-shrink:0; }
.lt-coping-body{
  display:flex; align-items:center; gap:18px;
  padding:18px 16px 20px; flex:1;
}
.lt-donut-wrap{
  position:relative; flex-shrink:0;
  width:120px; height:120px;
}
.lt-donut-svg{ width:120px; height:120px; overflow:visible; }
@keyframes ltDonutIn{
  from{ opacity:0; stroke-dashoffset-offset:0; }
  to{ opacity:1; }
}
.lt-donut-center{
  position:absolute; inset:0;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  pointer-events:none;
}
.lt-donut-num{
  font-family:'Playfair Display',serif;
  font-size:1.45rem; font-weight:400; color:var(--on-surface); line-height:1;
}
.lt-donut-lbl{
  font-size:9.5px; font-weight:500; letter-spacing:0.06em;
  text-transform:uppercase; color:var(--outline); margin-top:3px;
}

/* Legend */
.lt-coping-legend{
  flex:1; display:flex; flex-direction:column; gap:9px; min-width:0;
}
.lt-legend-row{
  display:flex; align-items:center; gap:7px;
  opacity:0; transform:translateX(8px);
  animation:ltLegIn 0.4s ease both;
}
@keyframes ltLegIn{ to{ opacity:1; transform:none; } }
.lt-legend-dot{
  width:8px; height:8px; border-radius:50%; flex-shrink:0;
}
.lt-legend-name{
  flex:1; font-size:11.5px; font-weight:500;
  color:var(--on-surface); text-transform:capitalize;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.lt-legend-pct{
  font-size:12px; font-weight:700; flex-shrink:0;
}
.lt-legend-count{
  font-size:10.5px; color:var(--outline); flex-shrink:0; min-width:24px; text-align:right;
}

/* HEAT TAGS (Triggers) */
.lt-trigger-cloud{
  padding:16px 16px 20px;
  display:flex; flex-wrap:wrap; gap:8px 10px;
  align-items:flex-start; justify-content:flex-start;
  flex:1;
}
.lt-heat-tag{
  display:inline-flex; align-items:center;
  padding:5px 13px; border-radius:100px;
  font-family:'DM Sans',sans-serif; line-height:1;
  cursor:default; white-space:nowrap;
  transform:rotate(var(--rot,0deg));
  animation:
    ltTagIn 0.45s cubic-bezier(0.34,1.15,0.64,1) both,
    ltBounce var(--dur,3.5s) var(--del,0s) ease-in-out infinite var(--dur,3.5s);
  transition:box-shadow 0.2s;
}
.lt-heat-tag:hover{
  animation-play-state:paused;
  transform:rotate(0deg) translateY(-3px) scale(1.07) !important;
  box-shadow:0 5px 16px rgba(26,28,22,0.16) !important;
  z-index:2; position:relative;
}
@keyframes ltTagIn{
  from{opacity:0;transform:rotate(var(--rot,0deg)) translateY(10px) scale(0.88)}
  to  {opacity:1;transform:rotate(var(--rot,0deg)) translateY(0)     scale(1)}
}
@keyframes ltBounce{
  0%,100%{ transform:rotate(var(--rot,0deg)) translateY(0); }
  50%    { transform:rotate(var(--rot,0deg)) translateY(calc(-1 * var(--amp,10px))); }
}


/* HIGHLIGHTS */
.lt-highlights-card .lt-card-header{ border-bottom:1px solid var(--outline-variant); }
.lt-highlights-list{ padding:14px 16px 16px; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.lt-highlight-item{ padding:13px 14px 14px; border-radius:14px; border:1.5px solid var(--outline-variant); background:var(--background); display:flex; flex-direction:column; gap:6px; opacity:0; transform:translateY(6px); animation:ltBarIn 0.4s ease both; }
.lt-hi-secondary{ border-color:rgba(88,98,73,0.2); }
.lt-hi-tag{ display:inline-flex; padding:2px 9px; border-radius:100px; font-size:9.5px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; align-self:flex-start; }
.lt-hi-tag-secondary{ background:var(--secondary-container); color:var(--on-secondary-container); }
.lt-hi-title{ font-size:12.5px; font-weight:600; color:var(--on-surface); line-height:1.4; }

/* EMPTY STATE */
.lt-empty{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:2.5rem 1rem; min-height:120px; }
.lt-empty-ring{ width:36px; height:36px; border-radius:50%; border:2px dashed var(--outline-variant); opacity:0.6; }
.lt-empty-label{ font-size:12.5px; color:var(--outline); }

/* BENTO */
.lt-bento{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.lt-bento-md{ grid-column:span 1; }
.lt-bento-sm{ grid-column:span 1; }
.lt-bento-full{ grid-column:span 3; }

/* ERROR */
.lt-error-state{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:5rem 2rem; text-align:center; }
.lt-error-icon{ width:52px; height:52px; border-radius:16px; background:var(--error-container); color:var(--on-error-container); display:grid; place-items:center; }
.lt-error-title{ font-family:'Playfair Display',serif; font-size:1.2rem; color:var(--on-surface); }
.lt-error-body{ font-size:13px; color:var(--outline); }

/* SKELETON */
@keyframes ltShimmer{ 0%{background-position:-700px 0} 100%{background-position:700px 0} }
.lt-skel{ width:100%; background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%); background-size:1400px 100%; animation:ltShimmer 1.6s ease-in-out infinite; }
.lt-skel-strip{ display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.lt-skel-bento{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.lt-skel-bento > :last-child{ grid-column:span 3; }

/* RESPONSIVE */
@media(max-width:860px){
  .lt-summary-grid{ grid-template-columns:1fr 1fr; }
  .lt-bento{ grid-template-columns:1fr 1fr; }
  .lt-bento-md{ grid-column:span 2; }
  .lt-bento-full{ grid-column:span 2; }
  .lt-skel-strip{ grid-template-columns:1fr 1fr; }
  .lt-skel-bento{ grid-template-columns:1fr 1fr; }
  .lt-skel-bento > :last-child{ grid-column:span 2; }
}
@media(max-width:540px){
  .lt-header-inner{ height:54px; }
  .lt-header-sub{ display:none; }
  .lt-header-badge{ display:none; }
  .lt-summary-grid{ grid-template-columns:1fr 1fr; gap:9px; }
  .lt-bento{ grid-template-columns:1fr; gap:10px; }
  .lt-bento-md,.lt-bento-sm,.lt-bento-full{ grid-column:span 1; }
  .lt-highlights-list{ grid-template-columns:1fr; }
  .lt-skel-strip{ grid-template-columns:1fr; }
  .lt-skel-bento{ grid-template-columns:1fr; }
  .lt-skel-bento > :last-child{ grid-column:span 1; }
}
`;
