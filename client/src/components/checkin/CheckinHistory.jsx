import { useEffect, useState } from "react";
import { getCheckinHistory } from "../../features/checkin/checkin.api";

const bar = (val, color) => {
  const c =
    color === "p" ? "var(--p)" : color === "t" ? "var(--t)" : "var(--err)";
  const w = `${((val - 1) / 9) * 100}%`;
  return {
    track: {
      height: 4,
      borderRadius: 4,
      background: "var(--sx)",
      overflow: "hidden",
    },
    fill: { height: "100%", width: w, background: c, borderRadius: 4 },
  };
};

const SleepIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function CheckinHistory({ refresh }) {
  const [history, setHistory] = useState([]);

  /* ── Original logic — unchanged ── */
  useEffect(() => {
    const fetch = async () => {
      const res = await getCheckinHistory();
      setHistory(res.data);
    };
    fetch();
  }, [refresh]);
  /* ── End original logic ── */

  return (
    <>
      <style>{chStyles}</style>
      <div className="ch-wrap">
        {/* ── Header ── */}
        <div className="ch-header">
          <div className="ch-header-left">
            <div className="ch-icon">
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
            <span className="ch-title">Last 30 Days</span>
          </div>
          {history.length > 0 && (
            <div className="ch-count-chip">{history.length} entries</div>
          )}
        </div>

        {history.length > 0 ? (
          <div className="ch-list">
            {history.map((h, idx) => {
              const mb = bar(h.mood, "p");
              const eb = bar(h.energy, "t");
              const sb = bar(h.stress, "err");
              return (
                <div
                  key={h._id}
                  className="ch-row"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="ch-row-date">{h.date}</div>
                  <div className="ch-metrics">
                    {[
                      { label: "Mood", val: h.mood, b: mb, badge: "primary" },
                      {
                        label: "Energy",
                        val: h.energy,
                        b: eb,
                        badge: "tertiary",
                      },
                      { label: "Stress", val: h.stress, b: sb, badge: "error" },
                    ].map(({ label, val, b, badge }) => (
                      <div key={label} className="ch-metric">
                        <div className="ch-metric-top">
                          <span className="ch-metric-label">{label}</span>
                          <span className={`ch-metric-val ch-val-${badge}`}>
                            {val}
                          </span>
                        </div>
                        <div style={b.track}>
                          <div style={b.fill} />
                        </div>
                      </div>
                    ))}
                    {h.sleepHours != null && (
                      <div className="ch-sleep-chip">
                        <span className="ch-sleep-icon">
                          <SleepIcon />
                        </span>
                        {h.sleepHours}h
                      </div>
                    )}
                  </div>
                  {h.tags?.length > 0 && (
                    <div className="ch-tags">
                      {h.tags.map((t) => (
                        <span key={t} className="ch-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ch-empty">
            No check-ins yet. Complete your first one above.
          </div>
        )}
      </div>
    </>
  );
}

const chStyles = `
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
.ch-wrap {
  background:var(--sl); border:1.5px solid var(--olv);
  border-radius:20px; overflow:hidden;
  font-family:'DM Sans',sans-serif; color:var(--on);
  position:relative; box-shadow:0 1px 12px rgba(26,28,22,.07);
}
.ch-wrap::before {
  content:''; position:absolute;
  top:-40px; right:-40px; width:120px; height:120px; border-radius:50%;
  background:radial-gradient(circle,rgba(56,102,99,.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.ch-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px; border-bottom:1px solid var(--olv);
  background:var(--sm); position:relative; z-index:1;
}
.ch-header-left { display:flex; align-items:center; gap:10px; }
.ch-icon { width:30px; height:30px; border-radius:9px; background:var(--tc); color:var(--otc); display:grid; place-items:center; }
.ch-icon svg { width:14px; height:14px; }
.ch-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on); }
.ch-count-chip { display:inline-flex; align-items:center; padding:3px 10px; border-radius:100px; background:var(--sx); border:1px solid var(--olv); font-size:11px; font-weight:500; color:var(--ol); }

/* ── LIST ── */
.ch-list { max-height:420px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--olv) transparent; position:relative; z-index:1; }
.ch-list::-webkit-scrollbar { width:4px; }
.ch-list::-webkit-scrollbar-thumb { background:var(--olv); border-radius:4px; }

@keyframes chIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.ch-row { padding:13px 18px; border-bottom:1px solid var(--olv); animation:chIn .3s ease-out both; transition:background .15s; }
.ch-row:last-child { border-bottom:none; }
.ch-row:hover { background:var(--sm); }

.ch-row-date { font-size:11.5px; font-weight:600; color:var(--ol); letter-spacing:.03em; text-transform:uppercase; margin-bottom:8px; }

/* Metrics row */
.ch-metrics { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.ch-metric { flex:1; min-width:72px; display:flex; flex-direction:column; gap:4px; }
.ch-metric-top { display:flex; align-items:center; justify-content:space-between; }
.ch-metric-label { font-size:11px; color:var(--ol); font-weight:400; }
.ch-metric-val { font-size:12px; font-weight:600; padding:1px 7px; border-radius:100px; }
.ch-val-primary  { background:var(--pc);   color:var(--opc);   }
.ch-val-tertiary { background:var(--tc);   color:var(--otc);   }
.ch-val-error    { background:var(--errc); color:var(--oerrc); }

/* Sleep chip */
.ch-sleep-chip {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px 3px 8px; border-radius:100px;
  background:var(--sc); color:var(--osc);
  font-size:11.5px; font-weight:500; flex-shrink:0;
}
.ch-sleep-icon { display:flex; align-items:center; color:var(--osc); }

/* Tags */
.ch-tags { display:flex; flex-wrap:wrap; gap:5px; margin-top:8px; }
.ch-tag { display:inline-flex; padding:2px 9px; border-radius:100px; background:var(--sm); border:1px solid var(--olv); font-size:11px; color:var(--onv); font-weight:400; }

.ch-empty { padding:28px 16px; text-align:center; color:var(--ol); font-size:13px; font-weight:300; line-height:1.6; }

@media(max-width:480px) {
  .ch-wrap { border-radius:16px; }
  .ch-metrics { gap:8px; }
}
`;
