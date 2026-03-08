import { useEffect, useState } from "react";
import { getVolatility } from "../../features/insights/insights.api";

/* ── Volatility level SVG icons ── */
const FluctuatingIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12c1-4 2-6 4-6s3 4 4 8 2 8 4 8 3-2 4-6" />
    <path d="M18 8l2 2-2 2" />
  </svg>
);
const VariableIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12c2-5 4-7 6-7s4 5 6 9 4 5 8 5" />
  </svg>
);
const StableIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12 18 12 15 6 9 18 6 12 2 12" />
  </svg>
);

/* ── Brand-mapped volatility levels ── */
const getVolMeta = (vol) => {
  if (vol > 50)
    return {
      color: "#BA1A1A",
      bg: "#FFDAD6",
      text: "#93000A",
      trackColor: "#FFDAD6",
      glowColor: "rgba(186,26,26,0.18)",
      label: "Fluctuating",
      Icon: FluctuatingIcon,
      note: "Your emotional state has been shifting frequently. Grounding exercises may help.",
    };
  if (vol > 25)
    return {
      color: "#A16207",
      bg: "#FEF3C7",
      text: "#78350F",
      trackColor: "#FEF3C7",
      glowColor: "rgba(161,98,7,0.15)",
      label: "Variable",
      Icon: VariableIcon,
      note: "Some emotional variation detected. This is normal — stay mindful.",
    };
  return {
    color: "#4C662B",
    bg: "#CDEDA3",
    text: "#354E16",
    trackColor: "#CDEDA3",
    glowColor: "rgba(76,102,43,0.15)",
    label: "Stable",
    Icon: StableIcon,
    note: "Your emotional state has been steady and consistent. Great work.",
  };
};

export default function VolatilityCard() {
  const [vol, setVol] = useState(null);
  const [animated, setAnimated] = useState(false);

  /* ── Original logic — unchanged ── */
  useEffect(() => {
    getVolatility().then((res) => setVol(res.data.volatility));
  }, []);
  /* ── End original logic ── */

  useEffect(() => {
    if (vol !== null) requestAnimationFrame(() => setAnimated(true));
  }, [vol]);

  if (vol === null) return null;

  const stable = 100 - vol;
  const meta = getVolMeta(vol);
  const { Icon } = meta;

  /* Semi-circle arc (half donut) — 180° sweep */
  const R = 72;
  const cx = 100;
  const cy = 100;
  const circumference = Math.PI * R; // half circle
  const fillOffset = circumference - (stable / 100) * circumference;

  /* Needle angle: -180° = 0%, 0° = 100% */
  const needleAngle = -180 + (stable / 100) * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const nx = cx + (R - 10) * Math.cos(needleRad);
  const ny = cy + (R - 10) * Math.sin(needleRad);

  return (
    <>
      <style>{vcStyles}</style>
      <div className="vc-wrap">
        {/* Decorative blob */}
        <div className="vc-blob" style={{ background: meta.glowColor }} />

        {/* ── Header ── */}
        <div className="vc-header">
          <div className="vc-header-left">
            <div
              className="vc-icon"
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
                <path d="M22 12 18 12 15 6 9 18 6 12 2 12" />
              </svg>
            </div>
            <span className="vc-title">Emotional Stability</span>
          </div>
          <div
            className="vc-badge"
            style={{
              background: meta.bg,
              color: meta.text,
              borderColor: `${meta.color}40`,
            }}
          >
            <span className="vc-badge-icon" style={{ color: meta.color }}>
              <Icon />
            </span>
            {meta.label}
          </div>
        </div>

        {/* ── Gauge section ── */}
        <div className="vc-gauge-section">
          <div className="vc-gauge-wrap">
            <svg viewBox="0 20 200 100" className="vc-gauge-svg">
              <defs>
                <linearGradient
                  id="vcTrackGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#BA1A1A" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#A16207" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4C662B" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient
                  id="vcFillGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#BA1A1A" />
                  <stop offset="50%" stopColor="#A16207" />
                  <stop offset="100%" stopColor={meta.color} />
                </linearGradient>
                <filter id="vcGlow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Track (background arc) */}
              <path
                d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                fill="none"
                stroke="url(#vcTrackGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />

              {/* Fill arc — animated */}
              <path
                d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                fill="none"
                stroke="url(#vcFillGrad)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={animated ? fillOffset : circumference}
                className="vc-arc-fill"
                filter="url(#vcGlow)"
              />

              {/* Tick marks */}
              {[0, 25, 50, 75, 100].map((pct) => {
                const a = ((-180 + pct * 1.8) * Math.PI) / 180;
                const r1 = R + 4;
                const r2 = R + 13;
                return (
                  <line
                    key={pct}
                    x1={cx + r1 * Math.cos(a)}
                    y1={cy + r1 * Math.sin(a)}
                    x2={cx + r2 * Math.cos(a)}
                    y2={cy + r2 * Math.sin(a)}
                    stroke="var(--outline-variant)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Needle */}
              <line
                x1={cx}
                y1={cy}
                x2={animated ? nx : cx - (R - 10)}
                y2={animated ? ny : cy}
                stroke={meta.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="vc-needle"
              />
              <circle cx={cx} cy={cy} r="5" fill={meta.color} />
              <circle
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--surface-container-low)"
              />

              {/* End labels */}
              <text
                x={cx - R - 2}
                y={cy + 18}
                textAnchor="middle"
                className="vc-gauge-label"
              >
                0
              </text>
              <text
                x={cx + R + 2}
                y={cy + 18}
                textAnchor="middle"
                className="vc-gauge-label"
              >
                100
              </text>
            </svg>

            {/* Center readout */}
            <div className="vc-readout">
              <span className="vc-readout-pct" style={{ color: meta.color }}>
                {stable}
              </span>
              <span className="vc-readout-unit">%</span>
              <span className="vc-readout-sub" style={{ color: meta.text }}>
                stability
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="vc-stats-row">
          <div className="vc-stat" style={{ borderColor: `${meta.color}20` }}>
            <div className="vc-stat-val" style={{ color: meta.color }}>
              {stable}%
            </div>
            <div className="vc-stat-lbl">Stable</div>
          </div>
          <div className="vc-stat-divider" />
          <div className="vc-stat">
            <div className="vc-stat-val">{vol}%</div>
            <div className="vc-stat-lbl">Fluctuation</div>
          </div>
        </div>

        {/* ── Note ── */}
        <div className="vc-note-row">
          <div
            className="vc-note-icon"
            style={{ background: meta.bg, color: meta.color }}
          >
            <Icon />
          </div>
          <p className="vc-note">{meta.note}</p>
        </div>
      </div>
    </>
  );
}

const vcStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary-container:#354E16;
  --on-surface:#1A1C16;--on-surface-variant:#44483D;
  --outline:#75796C;--outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
}

/* ── CARD SHELL ── */
.vc-wrap {
  font-family:'DM Sans',sans-serif;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
  color:var(--on-surface);
}

/* Soft radial blob behind gauge */
.vc-blob {
  position:absolute; top:-10px; left:50%;
  transform:translateX(-50%);
  width:260px; height:180px; border-radius:50%;
  filter:blur(36px); pointer-events:none; z-index:0;
  transition:background 0.6s ease;
}

/* ── HEADER ── */
.vc-header {
  display:flex; align-items:center; justify-content:space-between;
  gap:10px; padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  position:relative; z-index:1; flex-wrap:wrap;
}
.vc-header-left { display:flex; align-items:center; gap:10px; min-width:0; }
.vc-icon {
  width:30px; height:30px; border-radius:9px; flex-shrink:0;
  display:grid; place-items:center;
}
.vc-icon svg { width:14px; height:14px; }
.vc-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400; color:var(--on-surface); white-space:nowrap;
}
.vc-badge {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px 3px 7px; border-radius:100px;
  font-size:11.5px; font-weight:500; border:1.5px solid; flex-shrink:0;
}
.vc-badge-icon { width:13px; height:13px; display:flex; align-items:center; flex-shrink:0; }
.vc-badge-icon svg { width:13px; height:13px; }

/* ── GAUGE ── */
.vc-gauge-section {
  padding:24px 18px 8px;
  position:relative; z-index:1;
  display:flex; justify-content:center;
}
.vc-gauge-wrap {
  position:relative; width:100%; max-width:300px;
}
.vc-gauge-svg { display:block; width:100%; overflow:visible; }
.vc-gauge-label {
  font-family:'DM Sans',sans-serif; font-size:9px;
  fill:var(--outline); font-weight:400;
}

/* Arc fill animation */
@keyframes vcArcFill {
  from { stroke-dashoffset: var(--vc-circ, 226.2); }
  to   { stroke-dashoffset: var(--vc-offset, 0); }
}
.vc-arc-fill {
  transition: stroke-dashoffset 1.1s cubic-bezier(0.34,1.1,0.64,1);
}

/* Needle animation */
.vc-needle {
  transform-origin: 100px 100px;
  transition: x2 1.1s cubic-bezier(0.34,1.1,0.64,1),
              y2 1.1s cubic-bezier(0.34,1.1,0.64,1);
}

/* Centre readout — sits below the arc */
.vc-readout {
  display:flex; align-items:baseline; justify-content:center;
  gap:3px; margin-top:-10px;
  flex-wrap:wrap;
}
.vc-readout-pct {
  font-family:'Playfair Display',serif;
  font-size:3rem; font-weight:400; line-height:1;
}
.vc-readout-unit {
  font-family:'Playfair Display',serif;
  font-size:1.4rem; opacity:0.55;
}
.vc-readout-sub {
  width:100%; text-align:center;
  font-size:11px; font-weight:500;
  letter-spacing:0.1em; text-transform:uppercase;
  color:var(--outline); margin-top:2px;
}

/* ── STATS ROW ── */
.vc-stats-row {
  display:flex; align-items:stretch;
  margin:16px 18px 0;
  border:1.5px solid var(--outline-variant);
  border-radius:14px; overflow:hidden;
  background:var(--surface-container);
  position:relative; z-index:1;
}
.vc-stat {
  flex:1; padding:12px 10px; text-align:center;
  transition:background 0.15s;
}
.vc-stat:hover { background:var(--surface-container-high); }
.vc-stat-divider {
  width:1px; background:var(--outline-variant); flex-shrink:0;
}
.vc-stat-val {
  font-family:'Playfair Display',serif;
  font-size:1.3rem; font-weight:400;
  color:var(--on-surface); line-height:1; margin-bottom:3px;
}
.vc-stat-lbl {
  font-size:10px; font-weight:500; letter-spacing:0.06em;
  text-transform:uppercase; color:var(--outline);
}

/* ── NOTE ROW ── */
.vc-note-row {
  display:flex; align-items:flex-start; gap:10px;
  padding:14px 18px 18px;
  position:relative; z-index:1;
}
.vc-note-icon {
  width:28px; height:28px; border-radius:8px; flex-shrink:0;
  display:grid; place-items:center; margin-top:1px;
}
.vc-note-icon svg { width:14px; height:14px; }
.vc-note {
  font-size:13px; color:var(--on-surface-variant);
  font-weight:300; line-height:1.65;
}

/* ── RESPONSIVE ── */
@media(max-width:480px) {
  .vc-gauge-section { padding:18px 12px 6px; }
  .vc-gauge-wrap { max-width:260px; }
  .vc-readout-pct { font-size:2.5rem; }
  .vc-stats-row { margin:12px 14px 0; }
  .vc-note-row { padding:12px 14px 16px; }
}

@media(max-width:360px) {
  .vc-wrap { border-radius:16px; }
  .vc-gauge-wrap { max-width:220px; }
  .vc-readout-pct { font-size:2.1rem; }
  .vc-stat-val { font-size:1.1rem; }
}
`;
