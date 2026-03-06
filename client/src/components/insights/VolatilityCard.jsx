import { useEffect, useState } from "react";
import { getVolatility } from "../../features/insights/insights.api";

/* ── Brand-mapped volatility levels ── */
const getVolMeta = (vol) => {
  if (vol > 50)
    return {
      color: "#BA1A1A",
      bg: "#FFDAD6",
      text: "#93000A",
      label: "Fluctuating",
      emoji: "🌪",
      stableColor: "#BA1A1A",
      note: "Your emotional state has been shifting frequently. Grounding exercises may help.",
    };
  if (vol > 25)
    return {
      color: "#A16207",
      bg: "#FEF3C7",
      text: "#78350F",
      label: "Variable",
      emoji: "🌤",
      stableColor: "#A16207",
      note: "Some emotional variation detected. This is normal — stay mindful.",
    };
  return {
    color: "#4C662B",
    bg: "#CDEDA3",
    text: "#354E16",
    label: "Stable",
    emoji: "🌿",
    stableColor: "#4C662B",
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
  const arcRadius = 54;
  const arcCirc = 2 * Math.PI * arcRadius;
  const arcOffset = arcCirc - (stable / 100) * arcCirc;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root{--primary:#4C662B;--primary-container:#CDEDA3;--on-primary-container:#354E16;--secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;--on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;--surface-container-low:#F3F4E9;--surface-container:#EEEFE3;--surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;}
        .vc-wrap{font-family:'DM Sans',sans-serif;background:var(--surface-container-low);border:1.5px solid var(--outline-variant);border-radius:20px;overflow:hidden;position:relative;box-shadow:0 1px 12px rgba(26,28,22,0.07);color:var(--on-surface);}
        .vc-wrap::before{content:'';position:absolute;top:-45px;right:-45px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);pointer-events:none;}
        .vc-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--outline-variant);background:var(--surface-container);}
        .vc-header-left{display:flex;align-items:center;gap:10px;}
        .vc-icon{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;}
        .vc-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--on-surface);}
        .vc-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 11px;border-radius:100px;font-size:11.5px;font-weight:500;border:1.5px solid;}
        .vc-body{padding:20px 18px;position:relative;z-index:1;display:flex;align-items:center;gap:20px;}
        .vc-arc-wrap{flex-shrink:0;position:relative;width:120px;height:120px;display:grid;place-items:center;}
        .vc-arc-center{position:absolute;text-align:center;}
        .vc-arc-pct{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:400;line-height:1;}
        .vc-arc-label{font-size:10.5px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;opacity:0.65;margin-top:2px;}
        .vc-details{flex:1;}
        .vc-detail-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:100px;font-size:14px;font-weight:500;margin-bottom:10px;}
        .vc-note{font-size:13px;color:var(--on-surface-variant);font-weight:300;line-height:1.6;margin-bottom:12px;}
        .vc-stat-row{display:flex;gap:8px;}
        .vc-stat{padding:7px 13px;border-radius:10px;background:var(--surface-container-high);border:1px solid var(--outline-variant);}
        .vc-stat-val{font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--on-surface);line-height:1;}
        .vc-stat-lbl{font-size:10px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;color:var(--outline);margin-top:2px;}
        @keyframes vcArc{from{stroke-dashoffset:${arcCirc}}to{stroke-dashoffset:${arcOffset}}}
        .vc-arc-path{animation:vcArc 1.1s cubic-bezier(0.34,1.1,0.64,1) both;}
        @media(max-width:400px){.vc-body{flex-direction:column;align-items:flex-start;}.vc-arc-wrap{width:100px;height:100px;}}
      `}</style>
      <div className="vc-wrap">
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
                width="14"
                height="14"
              >
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 6v6l4 2" />
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
            {meta.emoji} {meta.label}
          </div>
        </div>

        <div className="vc-body">
          {/* Arc gauge */}
          <div className="vc-arc-wrap">
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Track */}
              <circle
                cx="60"
                cy="60"
                r={arcRadius}
                fill="none"
                stroke="var(--surface-container-highest)"
                strokeWidth="9"
              />
              {/* Fill */}
              <circle
                cx="60"
                cy="60"
                r={arcRadius}
                fill="none"
                stroke={meta.stableColor}
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
              {meta.emoji} {meta.label}
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
