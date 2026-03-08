import { useEffect, useState } from "react";
import { getProgressOverview } from "../features/progress/progress.api";

/* ─────────────────────────────────────────────────────────────────
   PROGRESS OVERVIEW
   API returns: { totalSessions, avgEffectiveness, bestTool, trend }
   trend is a string: "declining" | "improving"
───────────────────────────────────────────────────────────────── */
function ProgressOverview({ data, loading }) {
  if (loading)
    return (
      <div className="pr-overview-skel">
        {[1, 2, 3].map((i) => (
          <div key={i} className="pr-skel" style={{ height: 100 }} />
        ))}
      </div>
    );
  if (!data) return null;

  const trendUp = data.trend === "improving" || data.trend === "up";
  // avgEffectiveness is out of 5 — show ring as pct of 5
  const effectPct =
    data.avgEffectiveness != null
      ? Math.round((data.avgEffectiveness / 5) * 100)
      : 0;

  const tiles = [
    {
      label: "Total sessions",
      value: data.totalSessions ?? "—",
      unit: "",
      color: "tertiary",
      icon: (
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
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Best tool",
      value: data.bestTool ?? "—",
      unit: "",
      color: "secondary",
      icon: (
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="pr-overview">
      {/* Score hero — avgEffectiveness ring */}
      <div className="pr-score-hero">
        <div className="pr-score-ring">
          <svg viewBox="0 0 120 120" className="pr-score-svg">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="var(--surface-container-highest)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="10"
              strokeDasharray={`${Math.PI * 100}`}
              strokeDashoffset={`${Math.PI * 100 * (1 - effectPct / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{
                transition:
                  "stroke-dashoffset 1.2s cubic-bezier(0.34,1.06,0.64,1)",
              }}
            />
          </svg>
          <div className="pr-score-inner">
            <span className="pr-score-num">
              {data.avgEffectiveness != null
                ? data.avgEffectiveness.toFixed(1)
                : "—"}
            </span>
            <span className="pr-score-denom">/5</span>
          </div>
        </div>
        <div className="pr-score-meta">
          <p className="pr-score-title">Avg. Effectiveness</p>
          <p className="pr-score-sub">
            Based on your coping and exercise sessions
          </p>
          {data.trend && (
            <span
              className={`pr-change ${trendUp ? "pr-change-up" : "pr-change-down"}`}
            >
              {trendUp ? "↑ Improving" : "↓ Declining"} over time
            </span>
          )}
        </div>
      </div>

      {/* Metric tiles */}
      <div className="pr-metric-tiles">
        {tiles.map(({ label, value, unit, color, icon }) => (
          <div key={label} className={`pr-tile pr-tile-${color}`}>
            <div className={`pr-tile-icon pr-tile-icon-${color}`}>{icon}</div>
            <p className="pr-tile-val" style={{ textTransform: "capitalize" }}>
              {value}
              {unit && <span className="pr-tile-unit"> {unit}</span>}
            </p>
            <p className="pr-tile-label">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function ProgressPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    getProgressOverview()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <>
      <style>{prStyles}</style>
      <div className="pr-root">
        {/* ── Header ── */}
        <header className="pr-header">
          <div className="pr-header-inner">
            <div className="pr-header-left">
              <div className="pr-header-icon">
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
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div>
                <h1 className="pr-header-title">Progress Impact</h1>
                <p className="pr-header-sub">
                  How your efforts are shaping your wellbeing
                </p>
              </div>
            </div>
            <button
              className="pr-header-btn"
              onClick={() => setRefreshKey((k) => k + 1)}
            >
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        <main className="pr-main">
          {/* ── Overview ── */}
          <section className="pr-section" style={{ "--pi": 0 }}>
            <div className="pr-section-head">
              <span className="pr-section-pill">Overview</span>
              <div className="pr-section-line" />
            </div>
            <ProgressOverview data={data} loading={loading} />
          </section>
        </main>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────── */
const prStyles = `
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

.pr-root{
  min-height:100vh; background:var(--background);
  font-family:'DM Sans',sans-serif; color:var(--on-surface);
}

/* ── HEADER ────────────────────────────────────────────── */
.pr-header{
  position:sticky; top:0; z-index:20;
  background:rgba(249,250,239,0.92); backdrop-filter:blur(14px);
  border-bottom:1px solid var(--outline-variant);
}
.pr-header-inner{
  max-width:900px; margin:0 auto;
  padding:0 clamp(1rem,4vw,2.5rem); height:64px;
  display:flex; align-items:center; justify-content:space-between; gap:16px;
}
.pr-header-left{ display:flex; align-items:center; gap:11px; min-width:0; }
.pr-header-icon{
  width:36px; height:36px; border-radius:10px; flex-shrink:0;
  background:var(--primary-container); color:var(--on-primary-container);
  display:grid; place-items:center;
}
.pr-header-title{
  font-family:'Playfair Display',serif; font-size:1.05rem;
  font-weight:400; color:var(--on-surface); white-space:nowrap;
}
.pr-header-sub{ font-size:11px; color:var(--outline); font-weight:300; margin-top:1px; }
.pr-header-btn{
  display:inline-flex; align-items:center; gap:6px;
  padding:7px 14px; border-radius:10px; flex-shrink:0;
  border:1.5px solid var(--outline-variant); background:transparent;
  color:var(--on-surface-variant); font-family:'DM Sans',sans-serif;
  font-size:12px; font-weight:500; cursor:pointer; transition:all 0.2s;
}
.pr-header-btn:hover{ border-color:var(--primary); color:var(--primary); background:rgba(76,102,43,0.05); }

/* ── MAIN ──────────────────────────────────────────────── */
.pr-main{
  max-width:900px; margin:0 auto;
  padding:clamp(1.5rem,4vw,2.5rem) clamp(1rem,4vw,2.5rem);
  display:flex; flex-direction:column; gap:2.5rem;
}

/* ── SECTION ───────────────────────────────────────────── */
.pr-section{
  display:flex; flex-direction:column; gap:1.1rem;
  opacity:0; transform:translateY(14px);
  animation:prSecIn 0.5s calc(0.1s + var(--pi,0)*0.12s) ease both;
}
@keyframes prSecIn{ to{opacity:1;transform:none} }
.pr-section-head{ display:flex; align-items:center; gap:12px; }
.pr-section-pill{
  display:inline-flex; padding:4px 13px; border-radius:100px;
  background:var(--primary-container); color:var(--on-primary-container);
  font-size:10.5px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase;
  white-space:nowrap; flex-shrink:0;
}
.pr-section-line{ flex:1; height:1px; background:var(--outline-variant); opacity:0.55; }

/* ── OVERVIEW ──────────────────────────────────────────── */
.pr-overview{
  background:var(--surface-container-low);
  border:1.5px solid rgba(76,102,43,0.2);
  border-radius:22px; overflow:hidden;
  box-shadow:0 1px 14px rgba(26,28,22,0.07);
}

/* Score hero */
.pr-score-hero{
  display:flex; align-items:center; gap:24px;
  padding:24px 24px 20px;
  background:var(--surface-container);
  border-bottom:1px solid var(--outline-variant);
}
.pr-score-ring{ position:relative; width:120px; height:120px; flex-shrink:0; }
.pr-score-svg{ width:120px; height:120px; }
.pr-score-inner{
  position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center;
}
.pr-score-num{
  font-family:'Playfair Display',serif; font-size:1.9rem;
  font-weight:400; color:var(--on-surface); line-height:1;
}
.pr-score-denom{ font-size:11px; color:var(--outline); margin-top:2px; }
.pr-score-meta{ flex:1; min-width:0; }
.pr-score-title{
  font-family:'Playfair Display',serif; font-size:1.1rem;
  color:var(--on-surface); margin-bottom:5px;
}
.pr-score-sub{ font-size:12px; color:var(--outline); line-height:1.5; margin-bottom:10px; }
.pr-change{
  display:inline-flex; padding:4px 11px; border-radius:100px;
  font-size:12px; font-weight:600;
}
.pr-change-up  { background:var(--primary-container); color:var(--on-primary-container); }
.pr-change-down{ background:var(--error-container); color:var(--on-error-container); }

/* Metric tiles */
.pr-metric-tiles{
  display:grid; grid-template-columns:1fr 1fr;
  gap:1px; background:var(--outline-variant);
}
.pr-tile{
  position:relative; overflow:hidden;
  background:var(--surface-container-low);
  padding:18px 20px 20px;
  display:flex; flex-direction:column; gap:5px;
  transition:background 0.15s;
}
.pr-tile:hover{ background:var(--surface-container); }
.pr-tile::before{
  content:''; position:absolute;
  top:-30px; right:-30px; width:90px; height:90px; border-radius:50%;
  pointer-events:none;
}
.pr-tile-tertiary::before { background:radial-gradient(circle,rgba(56,102,99,0.1) 0%,transparent 70%); }
.pr-tile-secondary::before{ background:radial-gradient(circle,rgba(88,98,73,0.1) 0%,transparent 70%); }

.pr-tile-icon{
  width:32px; height:32px; border-radius:9px;
  display:grid; place-items:center; margin-bottom:4px;
}
.pr-tile-icon-tertiary { background:var(--tertiary-container); color:var(--on-tertiary-container); }
.pr-tile-icon-secondary{ background:var(--secondary-container);color:var(--on-secondary-container);}

.pr-tile-val{
  font-family:'Playfair Display',serif; font-size:1.5rem;
  font-weight:400; color:var(--on-surface); line-height:1.1;
}
.pr-tile-unit{ font-family:'DM Sans',sans-serif; font-size:12px; color:var(--outline); }
.pr-tile-label{ font-size:11px; font-weight:500; color:var(--outline); letter-spacing:0.02em; }

/* ── SKELETON ──────────────────────────────────────────── */
@keyframes prShimmer{
  0%{ background-position:-700px 0 }
  100%{ background-position:700px 0 }
}
.pr-skel{
  width:100%; border-radius:16px;
  background:linear-gradient(90deg,
    var(--surface-container) 25%,
    var(--surface-container-high) 50%,
    var(--surface-container) 75%);
  background-size:1400px 100%;
  animation:prShimmer 1.6s ease-in-out infinite;
}
.pr-overview-skel{
  display:grid; grid-template-columns:repeat(2,1fr); gap:12px;
}

/* ── RESPONSIVE ────────────────────────────────────────── */
@media(max-width:640px){
  .pr-score-hero{ flex-direction:column; align-items:flex-start; gap:16px; }
  .pr-metric-tiles{ grid-template-columns:1fr; }
  .pr-overview-skel{ grid-template-columns:1fr; }
}
@media(max-width:480px){
  .pr-header-inner{ height:54px; }
  .pr-header-sub{ display:none; }
}
`;
