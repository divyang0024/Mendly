import { useEffect, useState } from "react";
import { getReframingStats } from "../../features/reframing/reframing.api";

export default function ReframingStats({ refresh }) {
  const [stats, setStats] = useState({ sessions: 0, avgEffectiveness: 0 });

  useEffect(() => {
    getReframingStats().then((res) => setStats(res.data));
  }, [refresh]);

  const avg = stats.avgEffectiveness ?? 0;
  const ec =
    avg >= 5
      ? { bg: "var(--primary-container)", text: "var(--on-primary-container)" }
      : avg >= 3
        ? {
            bg: "var(--tertiary-container)",
            text: "var(--on-tertiary-container)",
          }
        : {
            bg: "var(--secondary-container)",
            text: "var(--on-secondary-container)",
          };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
          --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
          --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
          --on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;
          --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;--surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
        }
        .rs-wrap { background:var(--surface-container-low); border:1.5px solid var(--outline-variant); border-radius:20px; overflow:hidden; font-family:'DM Sans',sans-serif; color:var(--on-surface); position:relative; box-shadow:0 1px 12px rgba(26,28,22,0.07); }
        .rs-wrap::before { content:''; position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%); pointer-events:none; }
        .rs-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--outline-variant); background:var(--surface-container); }
        .rs-header-left { display:flex; align-items:center; gap:10px; }
        .rs-icon { width:30px; height:30px; border-radius:9px; background:var(--secondary-container); color:var(--on-secondary-container); display:grid; place-items:center; }
        .rs-icon svg { width:14px; height:14px; }
        .rs-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on-surface); }
        .rs-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; background:var(--surface-container-highest); border:1px solid var(--outline-variant); font-size:11px; font-weight:500; color:var(--outline); }
        .rs-metrics { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--outline-variant); }
        .rs-metric { padding:18px 18px 16px; background:var(--surface-container-low); position:relative; overflow:hidden; }
        .rs-metric::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
        .rs-metric.sessions::before { background:var(--primary); }
        .rs-metric.effectiveness::before { background:var(--tertiary); }
        .rs-metric-icon { width:28px; height:28px; border-radius:8px; display:grid; place-items:center; margin-bottom:8px; }
        .rs-metric-icon svg { width:13px; height:13px; }
        .rs-metric-value { font-family:'Playfair Display',serif; font-size:1.9rem; font-weight:400; color:var(--on-surface); line-height:1; }
        .rs-metric-label { font-size:12px; color:var(--outline); font-weight:400; margin-top:3px; }
        .rs-badge { display:inline-flex; align-items:center; gap:4px; margin-top:7px; padding:3px 9px; border-radius:100px; font-size:11px; font-weight:500; }
        .rs-empty { padding:28px 16px; text-align:center; color:var(--outline); font-size:13px; font-weight:300; line-height:1.6; }
      `}</style>

      <div className="rs-wrap">
        <div className="rs-header">
          <div className="rs-header-left">
            <div className="rs-icon">
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
            <span className="rs-title">Reframing Impact</span>
          </div>
          <div className="rs-chip">{stats.sessions} sessions</div>
        </div>

        {stats.sessions > 0 ? (
          <div className="rs-metrics">
            <div className="rs-metric sessions">
              <div
                className="rs-metric-icon"
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
              <div className="rs-metric-value">{stats.sessions}</div>
              <div className="rs-metric-label">Total Sessions</div>
              <div
                className="rs-badge"
                style={{
                  background: "var(--primary-container)",
                  color: "var(--on-primary-container)",
                }}
              >
                All time
              </div>
            </div>

            <div className="rs-metric effectiveness">
              <div
                className="rs-metric-icon"
                style={{ background: ec.bg, color: ec.text }}
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
              <div className="rs-metric-value">{avg.toFixed(2)}</div>
              <div className="rs-metric-label">Avg Emotional Shift</div>
              <div
                className="rs-badge"
                style={{ background: ec.bg, color: ec.text }}
              >
                {avg >= 5 ? "Strong shift" : avg >= 3 ? "Moderate" : "Building"}
              </div>
            </div>
          </div>
        ) : (
          <div className="rs-empty">
            Complete a reframing session to see your stats here.
          </div>
        )}
      </div>
    </>
  );
}
