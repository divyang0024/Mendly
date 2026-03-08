import { useEffect, useState } from "react";
import {
  getCheckinStats,
  getCheckinStreak,
} from "../../features/checkin/checkin.api";

/* ── Stat icons ── */
const MoodIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 13s1.5 3 4 3 4-3 4-3" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
  </svg>
);
const EnergyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const StressIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.5-1-2.5-2-4 0 0-1 1-1 2.5" />
    <path d="M12 22C6.47 22 2 17.52 2 12c0-2.5 1-4.75 2.65-6.41C5 5.24 5.5 5.5 5.5 6c0 1 .5 2 1.5 2.5C7.5 9 8.5 7.5 7.5 5.5 9.17 5.17 11 6 12 8c.67-1.5 2-2.5 3.5-2.5.5 0 1 .17 1.5.5C16.5 7 17 8.5 17.5 8c.5-.5 1.5-1.5 1.5-3 2.5 2 4 5 4 8C23 17.52 18.52 22 12 22z" />
  </svg>
);
const SleepIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const StreakIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.5-1-2.5-2-4 0 0-1 1-1 2.5" />
    <path d="M12 22C6.47 22 2 17.52 2 12c0-2.5 1-4.75 2.65-6.41C5 5.24 5.5 5.5 5.5 6c0 1 .5 2 1.5 2.5C7.5 9 8.5 7.5 7.5 5.5 9.17 5.17 11 6 12 8c.67-1.5 2-2.5 3.5-2.5.5 0 1 .17 1.5.5C16.5 7 17 8.5 17.5 8c.5-.5 1.5-1.5 1.5-3 2.5 2 4 5 4 8C23 17.52 18.52 22 12 22z" />
  </svg>
);

const statItems = [
  {
    key: "avgMood",
    label: "Mood",
    Icon: MoodIcon,
    color: "primary",
    decimals: 2,
  },
  {
    key: "avgEnergy",
    label: "Energy",
    Icon: EnergyIcon,
    color: "tertiary",
    decimals: 2,
  },
  {
    key: "avgStress",
    label: "Stress",
    Icon: StressIcon,
    color: "error",
    decimals: 2,
  },
  {
    key: "avgSleep",
    label: "Sleep",
    Icon: SleepIcon,
    color: "secondary",
    decimals: 1,
    suffix: "hrs",
  },
];

const iconColor = {
  primary: "var(--opc)",
  tertiary: "var(--otc)",
  error: "var(--oerrc)",
  secondary: "var(--osc)",
};

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
        {/* ── Header ── */}
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
              <span className="cs-streak-fire">
                <StreakIcon />
              </span>
              <span className="cs-streak-num">{streak}</span>
              <span className="cs-streak-label">day streak</span>
            </div>
          )}
        </div>

        {/* ── Stats grid ── */}
        <div className="cs-grid">
          {statItems.map(({ key, label, Icon, color, decimals, suffix }) => (
            <div key={key} className={`cs-stat cs-stat-${color}`}>
              <div
                className={`cs-stat-icon cs-stat-icon-${color}`}
                style={{ color: iconColor[color] }}
              >
                <Icon />
              </div>
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

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --p:#4C662B; --pc:#CDEDA3; --opc:#354E16;
  --s:#586249; --sc:#DCE7C8; --osc:#404A33;
  --t:#386663; --tc:#BCECE7; --otc:#1F4E4B;
  --err:#BA1A1A; --errc:#FFDAD6; --oerrc:#93000A;
  --on:#1A1C16; --onv:#44483D; --ol:#75796C; --olv:#C5C8BA;
  --sl:#F3F4E9; --sm:#EEEFE3; --sh:#E8E9DE; --sx:#E2E3D8;
}

/* ── CARD SHELL ── */
.cs-wrap {
  background:var(--sl); border:1.5px solid var(--olv);
  border-radius:20px; overflow:hidden;
  font-family:'DM Sans',sans-serif; color:var(--on);
  position:relative; box-shadow:0 1px 12px rgba(26,28,22,.07);
}
.cs-wrap::before {
  content:''; position:absolute;
  top:-40px; right:-40px; width:120px; height:120px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.cs-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid var(--olv);
  background:var(--sm);
  position:relative; z-index:1;
}
.cs-header-left { display:flex; align-items:center; gap:10px; }
.cs-icon { width:30px; height:30px; border-radius:9px; background:var(--pc); color:var(--opc); display:grid; place-items:center; }
.cs-icon svg { width:14px; height:14px; }
.cs-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on); }

/* Streak pill */
.cs-streak {
  display:flex; align-items:center; gap:5px;
  padding:5px 12px 5px 9px; border-radius:100px;
  background:var(--pc); color:var(--opc);
}
.cs-streak-fire { width:14px; height:14px; display:flex; align-items:center; color:var(--opc); }
.cs-streak-fire svg { width:14px; height:14px; }
.cs-streak-num { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:400; }
.cs-streak-label { font-size:11.5px; font-weight:500; }

/* ── STATS GRID ── */
.cs-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--olv); position:relative; z-index:1; }
@media(max-width:480px) { .cs-grid { grid-template-columns:repeat(2,1fr); } }

.cs-stat { padding:16px 14px; background:var(--sl); position:relative; overflow:hidden; }
.cs-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.cs-stat-primary::before   { background:var(--p);   }
.cs-stat-tertiary::before  { background:var(--t);   }
.cs-stat-error::before     { background:var(--err); }
.cs-stat-secondary::before { background:var(--s);   }

.cs-stat-icon { width:28px; height:28px; border-radius:8px; display:grid; place-items:center; margin-bottom:8px; }
.cs-stat-icon svg { width:14px; height:14px; }
.cs-stat-icon-primary   { background:var(--pc);   }
.cs-stat-icon-tertiary  { background:var(--tc);   }
.cs-stat-icon-error     { background:var(--errc); }
.cs-stat-icon-secondary { background:var(--sc);   }

.cs-stat-value { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:400; color:var(--on); line-height:1; }
.cs-stat-label { font-size:11.5px; color:var(--ol); font-weight:400; margin-top:3px; }
`;
