import { useEffect, useState } from "react";
import { getTrend } from "../../features/insights/insights.api";

/* ── Brand-mapped trend colors ── */
const trendMeta = {
  improving: {
    color: "#4C662B",
    bg: "#CDEDA3",
    text: "#354E16",
    icon: "↑",
    emoji: "📈",
    label: "Improving",
    note: "Your recent mood is trending in a positive direction. Keep going.",
  },
  worsening: {
    color: "#BA1A1A",
    bg: "#FFDAD6",
    text: "#93000A",
    icon: "↓",
    emoji: "📉",
    label: "Worsening",
    note: "Your recent mood has been lower than usual. Consider reaching out or trying a coping exercise.",
  },
  stable: {
    color: "#586249",
    bg: "#DCE7C8",
    text: "#404A33",
    icon: "→",
    emoji: "📊",
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

  // 🚨 Handle insufficient history
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
                  width="14"
                  height="14"
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
              <div className="tc-insuf-icon">⏳</div>
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
                width="14"
                height="14"
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
            {meta.emoji} {meta.label}
          </div>
        </div>

        <div className="tc-body">
          {/* Big trend display */}
          <div
            className="tc-trend-display"
            style={{ background: meta.bg, borderColor: `${meta.color}25` }}
          >
            <div className="tc-trend-icon" style={{ color: meta.color }}>
              {meta.icon}
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
              {meta.icon}
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
  :root{--primary:#4C662B;--primary-container:#CDEDA3;--on-primary-container:#354E16;--secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;--on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;--surface-container-low:#F3F4E9;--surface-container:#EEEFE3;--surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;}
  .tc-wrap{font-family:'DM Sans',sans-serif;background:var(--surface-container-low);border:1.5px solid var(--outline-variant);border-radius:20px;overflow:hidden;position:relative;box-shadow:0 1px 12px rgba(26,28,22,0.07);color:var(--on-surface);}
  .tc-wrap::before{content:'';position:absolute;top:-45px;right:-45px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);pointer-events:none;}
  .tc-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--outline-variant);background:var(--surface-container);}
  .tc-header-left{display:flex;align-items:center;gap:10px;}
  .tc-icon{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;}
  .tc-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--on-surface);}
  .tc-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 11px;border-radius:100px;font-size:11.5px;font-weight:500;border:1.5px solid;background:var(--surface-container-highest);color:var(--outline);border-color:var(--outline-variant);}
  .tc-body{padding:18px;position:relative;z-index:1;display:flex;flex-direction:column;gap:14px;}
  .tc-trend-display{display:flex;align-items:center;gap:16px;padding:16px;border-radius:14px;border:1.5px solid;}
  .tc-trend-icon{font-size:2.2rem;font-weight:300;line-height:1;flex-shrink:0;width:44px;text-align:center;}
  .tc-trend-label{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:400;letter-spacing:-0.1px;margin-bottom:4px;}
  .tc-trend-note{font-size:13px;font-weight:300;line-height:1.55;margin:0;opacity:0.85;}
  .tc-scores{display:flex;align-items:center;gap:10px;}
  .tc-score-block{flex:1;padding:12px 14px;border-radius:12px;border:1.5px solid;text-align:center;}
  .tc-score-label{font-size:11px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;opacity:0.7;margin-bottom:4px;}
  .tc-score-value{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:400;line-height:1;}
  .tc-score-arrow{font-size:1.4rem;flex-shrink:0;opacity:0.6;}
  .tc-insufficient{display:flex;align-items:flex-start;gap:14px;padding:4px 0;}
  .tc-insuf-icon{font-size:28px;line-height:1;flex-shrink:0;}
  .tc-insuf-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--on-surface);margin-bottom:5px;}
  .tc-insuf-text{font-size:13.5px;color:var(--outline);font-weight:300;margin:0 0 10px;line-height:1.55;}
  .tc-score-row{display:flex;gap:8px;flex-wrap:wrap;}
  .tc-score-chip{display:inline-flex;padding:4px 11px;border-radius:100px;font-size:12px;font-weight:500;}
`;
