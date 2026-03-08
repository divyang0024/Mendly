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
      label: "Fluctuating",
      Icon: FluctuatingIcon,
      note: "Your emotional state has been shifting frequently. Grounding exercises may help.",
    };
  if (vol > 25)
    return {
      color: "#A16207",
      bg: "#FEF3C7",
      text: "#78350F",
      label: "Variable",
      Icon: VariableIcon,
      note: "Some emotional variation detected. This is normal — stay mindful.",
    };
  return {
    color: "#4C662B",
    bg: "#CDEDA3",
    text: "#354E16",
    label: "Stable",
    Icon: StableIcon,
    note: "Your emotional state has been steady and consistent. Great work.",
  };
};

export default function VolatilityCard() {
  const [vol, setVol] = useState(null);

  /* ── Original logic — unchanged ── */
  useEffect(() => {
    getVolatility().then((res) => setVol(res.data.volatility));
  }, []);

  if (vol === null) return null;
  /* ── End original logic ── */

  const stable = 100 - vol;
  const meta = getVolMeta(vol);
  const { Icon } = meta;
  const arcRadius = 54;
  const arcCirc = 2 * Math.PI * arcRadius;
  const arcOffset = arcCirc - (stable / 100) * arcCirc;

  return (
    <>
      <style>{vcStyles(arcCirc, arcOffset)}</style>
      <div className="vc-wrap">
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
              borderColor: `${meta.color}30`,
            }}
          >
            <span className="vc-badge-icon" style={{ color: meta.color }}>
              <Icon />
            </span>
            {meta.label}
          </div>
        </div>

        <div className="vc-body">
          {/* Arc gauge */}
          <div className="vc-arc-wrap">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={arcRadius}
                fill="none"
                stroke="var(--surface-container-highest)"
                strokeWidth="9"
              />
              <circle
                cx="60"
                cy="60"
                r={arcRadius}
                fill="none"
                stroke={meta.color}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={arcCirc}
                strokeDashoffset={arcOffset}
                className="vc-arc-path"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="vc-arc-center">
              <div className="vc-arc-pct" style={{ color: meta.color }}>
                {stable}%
              </div>
              <div className="vc-arc-label" style={{ color: meta.text }}>
                Stable
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="vc-details">
            <div
              className="vc-detail-badge"
              style={{ background: meta.bg, color: meta.text }}
            >
              <span className="vc-detail-icon" style={{ color: meta.color }}>
                <Icon />
              </span>
              {meta.label}
            </div>
            <p className="vc-note">{meta.note}</p>
            <div className="vc-stat-row">
              <div className="vc-stat">
                <div className="vc-stat-val">{stable}%</div>
                <div className="vc-stat-lbl">Stability</div>
              </div>
              <div className="vc-stat">
                <div className="vc-stat-val">{vol}%</div>
                <div className="vc-stat-lbl">Fluctuation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const vcStyles = (arcCirc, arcOffset) => `
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
.vc-wrap {
  font-family:'DM Sans',sans-serif;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
  color:var(--on-surface);
}
.vc-wrap::before {
  content:''; position:absolute;
  top:-48px; right:-48px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.vc-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  position:relative; z-index:1;
}
.vc-header-left { display:flex; align-items:center; gap:10px; }
.vc-icon {
  width:30px; height:30px; border-radius:9px;
  display:grid; place-items:center; flex-shrink:0;
}
.vc-icon svg { width:14px; height:14px; }
.vc-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400; color:var(--on-surface);
}
.vc-badge {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px 3px 7px; border-radius:100px;
  font-size:11.5px; font-weight:500; border:1.5px solid;
}
.vc-badge-icon { width:13px; height:13px; display:flex; align-items:center; }
.vc-badge-icon svg { width:13px; height:13px; }

/* ── BODY ── */
.vc-body {
  padding:20px 18px; position:relative; z-index:1;
  display:flex; align-items:center; gap:20px;
}

/* Arc gauge */
.vc-arc-wrap { flex-shrink:0; position:relative; width:120px; height:120px; display:grid; place-items:center; }
.vc-arc-center { position:absolute; text-align:center; }
.vc-arc-pct { font-family:'Playfair Display',serif; font-size:1.7rem; font-weight:400; line-height:1; }
.vc-arc-label { font-size:10.5px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; opacity:0.65; margin-top:2px; }
@keyframes vcArc { from{stroke-dashoffset:${arcCirc.toFixed(2)}} to{stroke-dashoffset:${arcOffset.toFixed(2)}} }
.vc-arc-path { animation:vcArc 1.1s cubic-bezier(0.34,1.1,0.64,1) both; }

/* Details panel */
.vc-details { flex:1; }
.vc-detail-badge {
  display:inline-flex; align-items:center; gap:7px;
  padding:6px 13px 6px 9px; border-radius:100px;
  font-size:13.5px; font-weight:500; margin-bottom:10px;
}
.vc-detail-icon { width:16px; height:16px; display:flex; align-items:center; }
.vc-detail-icon svg { width:16px; height:16px; }
.vc-note { font-size:13px; color:var(--on-surface-variant); font-weight:300; line-height:1.6; margin-bottom:12px; }
.vc-stat-row { display:flex; gap:8px; }
.vc-stat { padding:7px 13px; border-radius:10px; background:var(--surface-container-high); border:1px solid var(--outline-variant); }
.vc-stat-val { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on-surface); line-height:1; }
.vc-stat-lbl { font-size:10px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; color:var(--outline); margin-top:2px; }

@media(max-width:400px) {
  .vc-wrap { border-radius:16px; }
  .vc-body { flex-direction:column; align-items:flex-start; }
  .vc-arc-wrap { width:100px; height:100px; }
}
`;
