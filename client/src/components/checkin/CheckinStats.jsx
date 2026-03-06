import { useEffect, useState } from "react";
import {
  getCheckinStats,
  getCheckinStreak,
} from "../../features/checkin/checkin.api";

const statItems = [
  { key: "avgMood", label: "Mood", icon: "😊", color: "primary", decimals: 2 },
  {
    key: "avgEnergy",
    label: "Energy",
    icon: "⚡",
    color: "tertiary",
    decimals: 2,
  },
  {
    key: "avgStress",
    label: "Stress",
    icon: "🔥",
    color: "error",
    decimals: 2,
  },
  {
    key: "avgSleep",
    label: "Sleep",
    icon: "😴",
    color: "secondary",
    decimals: 1,
    suffix: "hrs",
  },
];

export default function CheckinStats({ refresh }) {
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(0);

  /* ── Original logic — unchanged ── */
  useEffect(() => {
    const fetch = async () => {
      const [s, st] = await Promise.all([
        getCheckinStats(),
        getCheckinStreak(),
      ]);
      setStats(s.data);
      setStreak(st.data.streak);
    };
    fetch();
  }, [refresh]);
  /* ── End original logic ── */

  if (!stats) return null;

  return (
    <>
      <style>{csStyles}</style>
      <div className="cs-wrap">
        <div className="cs-header">
          <div className="cs-header-left">
            <div className="cs-icon">
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
            <span className="cs-title">Your Trends</span>
          </div>
          {streak > 0 && (
            <div className="cs-streak">
              <span>🔥</span>
              <span className="cs-streak-num">{streak}</span>
              <span className="cs-streak-label">day streak</span>
            </div>
          )}
        </div>

        <div className="cs-grid">
          {statItems.map(({ key, label, icon, color, decimals, suffix }) => (
            <div key={key} className={`cs-stat cs-stat-${color}`}>
              <div className={`cs-stat-icon cs-stat-icon-${color}`}>{icon}</div>
              <div className="cs-stat-value">
                {stats[key]?.toFixed(decimals)}
                {suffix ? ` ${suffix}` : ""}
              </div>
              <div className="cs-stat-label">{label} avg</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const csStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --p:#4C662B; --pc:#CDEDA3; --opc:#354E16;
    --s:#586249; --sc:#DCE7C8; --osc:#404A33;
    --t:#386663; --tc:#BCECE7; --otc:#1F4E4B;
    --err:#BA1A1A; --errc:#FFDAD6; --oerrc:#93000A;
    --on:#1A1C16; --onv:#44483D; --ol:#75796C; --olv:#C5C8BA;
    --sl:#F3F4E9; --sm:#EEEFE3; --sh:#E8E9DE; --sx:#E2E3D8;
  }
  .cs-wrap { background:var(--sl); border:1.5px solid var(--olv); border-radius:20px; overflow:hidden; font-family:'DM Sans',sans-serif; color:var(--on); position:relative; box-shadow:0 1px 12px rgba(26,28,22,.07); }
  .cs-wrap::before { content:''; position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle,rgba(76,102,43,.06) 0%,transparent 70%); pointer-events:none; }

  .cs-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--olv); background:var(--sm); }
  .cs-header-left { display:flex; align-items:center; gap:10px; }
  .cs-icon { width:30px; height:30px; border-radius:9px; background:var(--pc); color:var(--opc); display:grid; place-items:center; }
  .cs-icon svg { width:14px; height:14px; }
  .cs-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on); }
  .cs-streak { display:flex; align-items:center; gap:5px; padding:5px 12px; border-radius:100px; background:var(--pc); color:var(--opc); }
  .cs-streak-num { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:400; }
  .cs-streak-label { font-size:11.5px; font-weight:500; }

  .cs-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--olv); }
  @media(max-width:480px) { .cs-grid { grid-template-columns:repeat(2,1fr); } }

  .cs-stat { padding:16px 14px; background:var(--sl); position:relative; overflow:hidden; }
  .cs-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
  .cs-stat-primary::before   { background:var(--p); }
  .cs-stat-tertiary::before  { background:var(--t); }
  .cs-stat-error::before     { background:var(--err); }
  .cs-stat-secondary::before { background:var(--s); }

  .cs-stat-icon { width:28px; height:28px; border-radius:8px; display:grid; place-items:center; font-size:14px; margin-bottom:8px; }
  .cs-stat-icon-primary   { background:var(--pc); }
  .cs-stat-icon-tertiary  { background:var(--tc); }
  .cs-stat-icon-error     { background:var(--errc); }
  .cs-stat-icon-secondary { background:var(--sc); }

  .cs-stat-value { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:400; color:var(--on); line-height:1; }
  .cs-stat-label { font-size:11.5px; color:var(--ol); font-weight:400; margin-top:3px; }
`;
