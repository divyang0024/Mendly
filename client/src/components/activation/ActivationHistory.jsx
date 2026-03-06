import { useEffect, useState } from "react";
import {
  getActivationHistory,
  completeActivation,
} from "../../features/activation/activation.api";

const typeIcon = (type) => {
  const map = {
    physical: "🏃",
    social: "🤝",
    creative: "🎨",
    productive: "✅",
    "self-care": "🌿",
    outdoor: "🌳",
    learning: "📚",
  };
  return map[type] ?? "⚡";
};

const effortDots = (v, max = 5) => Array.from({ length: max }, (_, i) => i < v);

export default function ActivationHistory({ refresh }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getActivationHistory().then((res) => setHistory(res.data));
  }, [refresh]);

  /* ── Original logic — unchanged ── */
  const complete = async (id) => {
    const moodAfter = prompt("Mood after activity (1–10)?");
    const reflection = prompt("Reflection (optional)");
    await completeActivation(id, { moodAfter, reflection });
    setHistory((prev) =>
      prev.map((h) => (h._id === id ? { ...h, completed: true } : h)),
    );
  };
  /* ── End original logic ── */

  return (
    <>
      <style>{ahStyles}</style>
      <div className="ah-root">
        <div className="ah-header">
          <div className="ah-header-left">
            <div className="ah-icon">
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
            <span className="ah-title">Recent Activities</span>
          </div>
          {history.length > 0 && (
            <div className="ah-count-chip">{history.length} planned</div>
          )}
        </div>

        {history.length > 0 ? (
          <div className="ah-list">
            {history.map((h, idx) => (
              <div
                key={h._id}
                className="ah-card"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="ah-card-left">
                  <div className="ah-type-icon">{typeIcon(h.activityType)}</div>
                  <div className="ah-card-info">
                    <div className="ah-activity-name">{h.activityName}</div>
                    <div className="ah-card-meta">
                      <span className="ah-type-pill">{h.activityType}</span>
                      <span className="ah-dots-label">Effort</span>
                      <div className="ah-effort-dots">
                        {effortDots(h.difficulty).map((filled, i) => (
                          <div
                            key={i}
                            className={`ah-dot${filled ? " filled" : ""}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {!h.completed ? (
                  <button
                    onClick={() => complete(h._id)}
                    className="ah-btn-complete"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Complete
                  </button>
                ) : (
                  <div className="ah-done-badge">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Done
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="ah-empty">
            No activities yet. Plan your first positive action above.
          </div>
        )}
      </div>
    </>
  );
}

const ahStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
    --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
    --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
    --on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;
    --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
    --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
  }
  .ah-root { font-family:'DM Sans',sans-serif; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); border-radius:20px; overflow:hidden; position:relative; box-shadow:0 1px 12px rgba(26,28,22,0.07); color:var(--on-surface); }
  .ah-root::before { content:''; position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle,rgba(56,102,99,0.06) 0%,transparent 70%); pointer-events:none; }

  .ah-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--outline-variant); background:var(--surface-container); }
  .ah-header-left { display:flex; align-items:center; gap:10px; }
  .ah-icon { width:30px; height:30px; border-radius:9px; background:var(--tertiary-container); color:var(--on-tertiary-container); display:grid; place-items:center; }
  .ah-icon svg { width:14px; height:14px; }
  .ah-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on-surface); }
  .ah-count-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; background:var(--surface-container-highest); border:1px solid var(--outline-variant); font-size:11px; font-weight:500; color:var(--outline); }

  .ah-list { padding:14px 16px; display:flex; flex-direction:column; gap:9px; }
  @keyframes ahIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .ah-card { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:13px 15px; border-radius:14px; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); transition:border-color 0.2s,box-shadow 0.2s; animation:ahIn 0.35s ease-out both; }
  .ah-card:hover { border-color:rgba(76,102,43,0.28); box-shadow:0 2px 10px rgba(76,102,43,0.06); }

  .ah-card-left { display:flex; align-items:center; gap:12px; flex:1; min-width:0; }
  .ah-type-icon { width:38px; height:38px; border-radius:11px; background:var(--surface-container-high); display:grid; place-items:center; font-size:18px; flex-shrink:0; }
  .ah-card-info { flex:1; min-width:0; }
  .ah-activity-name { font-size:14px; font-weight:500; color:var(--on-surface); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:5px; }
  .ah-card-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .ah-type-pill { display:inline-flex; align-items:center; padding:2px 9px; border-radius:100px; background:var(--secondary-container); color:var(--on-secondary-container); font-size:11px; font-weight:500; text-transform:capitalize; }
  .ah-dots-label { font-size:11px; color:var(--outline); font-weight:400; }
  .ah-effort-dots { display:flex; gap:3px; align-items:center; }
  .ah-dot { width:6px; height:6px; border-radius:50%; background:var(--outline-variant); transition:background 0.2s; }
  .ah-dot.filled { background:var(--primary); }

  .ah-btn-complete { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:10px; border:none; background:var(--tertiary); color:#fff; font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; transition:all 0.2s ease; flex-shrink:0; }
  .ah-btn-complete:hover { background:#2d5452; transform:translateY(-1px); box-shadow:0 3px 10px rgba(56,102,99,0.24); }

  .ah-done-badge { display:inline-flex; align-items:center; gap:5px; padding:6px 13px; border-radius:10px; background:var(--primary-container); color:var(--on-primary-container); font-size:12.5px; font-weight:500; flex-shrink:0; }

  .ah-empty { padding:28px 16px; text-align:center; color:var(--outline); font-size:13px; font-weight:300; line-height:1.6; }
`;
