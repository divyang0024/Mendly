import { useEffect, useState } from "react";
import { getActivationStats } from "../../features/activation/activation.api";

export default function ActivationStats({ refresh }) {
  const [stats, setStats] = useState({ sessions: 0, avgEffectiveness: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getActivationStats();
      setStats(res.data);
    };
    fetchStats();
  }, [refresh]);

  const avg = stats.avgEffectiveness ?? 0;
  const ec =
    avg >= 4
      ? {
          bg: "var(--primary-container)",
          text: "var(--on-primary-container)",
          label: "Strong lift",
        }
      : avg >= 2
        ? {
            bg: "var(--tertiary-container)",
            text: "var(--on-tertiary-container)",
            label: "Moderate",
          }
        : {
            bg: "var(--secondary-container)",
            text: "var(--on-secondary-container)",
            label: "Building",
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
          --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
          --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
        }
        .ast-wrap { background:var(--surface-container-low); border:1.5px solid var(--outline-variant); border-radius:20px; overflow:hidden; font-family:'DM Sans',sans-serif; color:var(--on-surface); position:relative; box-shadow:0 1px 12px rgba(26,28,22,0.07); }
        .ast-wrap::before { content:''; position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%); pointer-events:none; }
        .ast-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--outline-variant); background:var(--surface-container); }
        .ast-header-left { display:flex; align-items:center; gap:10px; }
        .ast-icon { width:30px; height:30px; border-radius:9px; background:var(--primary-container); color:var(--on-primary-container); display:grid; place-items:center; }
        .ast-icon svg { width:14px; height:14px; }
        .ast-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on-surface); }
        .ast-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; background:var(--surface-container-highest); border:1px solid var(--outline-variant); font-size:11px; font-weight:500; color:var(--outline); }
        .ast-metrics { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--outline-variant); }
        .ast-metric { padding:18px 18px 16px; background:var(--surface-container-low); position:relative; overflow:hidden; }
        .ast-metric::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
        .ast-metric.sessions::before { background:var(--primary); }
        .ast-metric.improvement::before { background:var(--tertiary); }
        .ast-metric-icon { width:28px; height:28px; border-radius:8px; display:grid; place-items:center; margin-bottom:8px; }
        .ast-metric-icon svg { width:13px; height:13px; }
        .ast-metric-value { font-family:'Playfair Display',serif; font-size:1.9rem; font-weight:400; color:var(--on-surface); line-height:1; }
        .ast-metric-label { font-size:12px; color:var(--outline); font-weight:400; margin-top:3px; }
        .ast-badge { display:inline-flex; align-items:center; gap:4px; margin-top:7px; padding:3px 9px; border-radius:100px; font-size:11px; font-weight:500; }
        .ast-empty { padding:28px 16px; text-align:center; color:var(--outline); font-size:13px; font-weight:300; line-height:1.6; }
      `}</style>

      <div className="ast-wrap">
        <div className="ast-header">
          <div className="ast-header-left">
            <div className="ast-icon">
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
            <span className="ast-title">Activation Progress</span>
          </div>
          <div className="ast-chip">{stats.sessions} sessions</div>
        </div>

        {stats.sessions > 0 ? (
          <div className="ast-metrics">
            <div className="ast-metric sessions">
              <div
                className="ast-metric-icon"
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
              <div className="ast-metric-value">{stats.sessions}</div>
              <div className="ast-metric-label">Total Sessions</div>
              <div
                className="ast-badge"
                style={{
                  background: "var(--primary-container)",
                  color: "var(--on-primary-container)",
                }}
              >
                All time
              </div>
            </div>

            <div className="ast-metric improvement">
              <div
                className="ast-metric-icon"
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="ast-metric-value">{avg.toFixed(2)}</div>
              <div className="ast-metric-label">Avg Mood Improvement</div>
              <div
                className="ast-badge"
                style={{ background: ec.bg, color: ec.text }}
              >
                {ec.label}
              </div>
            </div>
          </div>
        ) : (
          <div className="ast-empty">
            Complete an activation session to see your progress here.
          </div>
        )}
      </div>
    </>
  );
}
