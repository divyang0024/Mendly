import { useEffect, useState } from "react";
import {
  getActivationHistory,
  completeActivation,
} from "../../features/activation/activation.api";

/* ── Activity type SVG icons (matches ActivationPlanner) ── */
const TypeIcons = {
  physical: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="2" />
      <path d="M10 9H7l-2 5h2l1 5h8l1-5h2L17 9h-3" />
      <path d="M9 14l1 5M15 14l-1 5" />
    </svg>
  ),
  social: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  creative: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r="2.5" />
      <path d="M17 3l4 4-9.26 9.26a2 2 0 0 1-1.41.59H7v-3.34a2 2 0 0 1 .59-1.41L17 3z" />
      <path d="M3 21h4" />
    </svg>
  ),
  productive: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  "self-care": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22V12" />
      <path d="M12 12C12 7 7 4 4 6" />
      <path d="M12 12c0-5 5-8 8-6" />
      <path d="M12 12c-4 0-7 3-6 7" />
      <path d="M12 12c4 0 7 3 6 7" />
    </svg>
  ),
  outdoor: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-1-2.6M3 21v-2a7 7 0 0 1 7-7h1" />
      <circle cx="9" cy="7" r="4" />
      <path d="M16 3s1 1 1 3-1 3-1 3M19 2s2 2 2 5-2 5-2 5" />
    </svg>
  ),
  learning: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  default: (
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
  ),
};

const SEG_COLORS = [
  "#4C662B",
  "#5A7530",
  "#6B8A35",
  "#86A33F",
  "#A6B830",
  "#C5A000",
  "#D48800",
  "#D46A00",
  "#C2500A",
  "#BA1A1A",
];

function MoodMeter({ value, onChange }) {
  const label =
    value <= 3 ? "Feeling low" : value <= 6 ? "Moderate mood" : "Feeling good";
  const labelBg = value <= 3 ? "#FFDAD6" : value <= 6 ? "#FEF3C7" : "#CDEDA3";
  const labelClr = value <= 3 ? "#93000A" : value <= 6 ? "#78350F" : "#354E16";
  const pct = (((value - 1) / 9) * 100).toFixed(1);
  return (
    <div className="ahm-meter">
      <div className="ahm-meter-bar">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="ahm-seg"
            style={{
              background:
                i < value ? SEG_COLORS[i] : "var(--surface-container-highest)",
              transform: i < value ? "scaleY(1)" : "scaleY(0.55)",
              opacity: i < value ? 1 : 0.4,
              height: i < value ? 28 + (i / 9) * 20 : 24,
              transition: `all 0.2s ease ${i * 0.02}s`,
            }}
          />
        ))}
      </div>
      <div className="ahm-meter-meta">
        <span
          className="ahm-val"
          style={{ color: SEG_COLORS[Math.min(value - 1, 9)] }}
        >
          {value}
          <span className="ahm-denom">/10</span>
        </span>
        <span
          className="ahm-lbl"
          style={{ background: labelBg, color: labelClr }}
        >
          {label}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ahm-slider"
        style={{
          background: `linear-gradient(90deg, var(--primary) ${pct}%, var(--surface-container-highest) ${pct}%)`,
        }}
      />
      <div className="ahm-slider-labels">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

/* ── Complete modal ── */
function CompleteModal({ item, onConfirm, onCancel }) {
  const [moodAfter, setMoodAfter] = useState(5);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(item._id, { moodAfter, reflection });
    setLoading(false);
  };

  return (
    <div className="ahm-backdrop" onClick={onCancel}>
      <div className="ahm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className="ahm-modal-hdr">
          <div className="ahm-modal-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div>
            <p className="ahm-modal-title">Complete Activity</p>
            <p className="ahm-modal-sub">{item.activityName}</p>
          </div>
          <button className="ahm-modal-close" onClick={onCancel}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="ahm-modal-body">
          {/* Mood after */}
          <div className="ahm-field">
            <label className="ahm-label">Mood after the activity</label>
            <MoodMeter value={moodAfter} onChange={setMoodAfter} />
          </div>

          {/* Reflection */}
          <div className="ahm-field">
            <label className="ahm-label">
              Reflection <span className="ahm-optional">(optional)</span>
            </label>
            <textarea
              className="ahm-textarea"
              placeholder="How did it go? Any thoughts…"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="ahm-actions">
            <button className="ahm-btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="ahm-btn-primary"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="ahm-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Mark Complete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const effortDots = (v, max = 5) => Array.from({ length: max }, (_, i) => i < v);

export default function ActivationHistory({ refresh }) {
  const [history, setHistory] = useState([]);
  const [completing, setCompleting] = useState(null); // item being completed

  useEffect(() => {
    getActivationHistory().then((res) => setHistory(res.data));
  }, [refresh]);

  /* ── Original logic — unchanged ── */
  const complete = async (id, { moodAfter, reflection }) => {
    await completeActivation(id, { moodAfter, reflection });
    setHistory((prev) =>
      prev.map((h) => (h._id === id ? { ...h, completed: true } : h)),
    );
    setCompleting(null);
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
                  <div
                    className="ah-type-icon"
                    style={{ color: "var(--on-tertiary-container)" }}
                  >
                    {TypeIcons[h.activityType] ?? TypeIcons.default}
                  </div>
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
                    onClick={() => setCompleting(h)}
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

      {/* Complete modal — rendered outside the card list */}
      {completing && (
        <CompleteModal
          item={completing}
          onConfirm={complete}
          onCancel={() => setCompleting(null)}
        />
      )}
    </>
  );
}

const ahStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
  --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
  --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
  --on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
  --background:#F9FAEF;
}

/* ── CARD SHELL ── */
.ah-root { font-family:'DM Sans',sans-serif; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); border-radius:20px; overflow:hidden; position:relative; box-shadow:0 1px 12px rgba(26,28,22,0.07); color:var(--on-surface); }
.ah-root::before { content:''; position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle,rgba(56,102,99,0.06) 0%,transparent 70%); pointer-events:none; }

/* ── HEADER ── */
.ah-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--outline-variant); background:var(--surface-container); position:relative; z-index:1; }
.ah-header-left { display:flex; align-items:center; gap:10px; }
.ah-icon { width:30px; height:30px; border-radius:9px; background:var(--tertiary-container); color:var(--on-tertiary-container); display:grid; place-items:center; }
.ah-icon svg { width:14px; height:14px; }
.ah-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on-surface); }
.ah-count-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; background:var(--surface-container-highest); border:1px solid var(--outline-variant); font-size:11px; font-weight:500; color:var(--outline); }

/* ── LIST ── */
.ah-list { padding:14px 16px; display:flex; flex-direction:column; gap:9px; position:relative; z-index:1; }
@keyframes ahIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.ah-card { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:13px 15px; border-radius:14px; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); transition:border-color 0.2s,box-shadow 0.2s; animation:ahIn 0.35s ease-out both; }
.ah-card:hover { border-color:rgba(76,102,43,0.28); box-shadow:0 2px 10px rgba(76,102,43,0.06); }

.ah-card-left { display:flex; align-items:center; gap:12px; flex:1; min-width:0; }
.ah-type-icon { width:38px; height:38px; border-radius:11px; background:var(--tertiary-container); display:grid; place-items:center; flex-shrink:0; }
.ah-type-icon svg { width:18px; height:18px; }
.ah-card-info { flex:1; min-width:0; }
.ah-activity-name { font-size:14px; font-weight:500; color:var(--on-surface); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:5px; }
.ah-card-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.ah-type-pill { display:inline-flex; align-items:center; padding:2px 9px; border-radius:100px; background:var(--secondary-container); color:var(--on-secondary-container); font-size:11px; font-weight:500; text-transform:capitalize; }
.ah-dots-label { font-size:11px; color:var(--outline); font-weight:400; }
.ah-effort-dots { display:flex; gap:3px; align-items:center; }
.ah-dot { width:6px; height:6px; border-radius:50%; background:var(--outline-variant); }
.ah-dot.filled { background:var(--primary); }

.ah-btn-complete { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:10px; border:none; background:var(--tertiary); color:#fff; font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; transition:all 0.2s ease; flex-shrink:0; }
.ah-btn-complete:hover { background:#2d5452; transform:translateY(-1px); box-shadow:0 3px 10px rgba(56,102,99,0.24); }
.ah-done-badge { display:inline-flex; align-items:center; gap:5px; padding:6px 13px; border-radius:10px; background:var(--primary-container); color:var(--on-primary-container); font-size:12.5px; font-weight:500; flex-shrink:0; }
.ah-empty { padding:28px 16px; text-align:center; color:var(--outline); font-size:13px; font-weight:300; line-height:1.6; }

/* ── MODAL BACKDROP ── */
.ahm-backdrop {
  position:fixed; inset:0; z-index:1000;
  background:rgba(26,28,22,0.45);
  backdrop-filter:blur(4px);
  display:grid; place-items:center; padding:16px;
  animation:ahmFadeIn 0.2s ease both;
}
@keyframes ahmFadeIn { from{opacity:0} to{opacity:1} }

/* ── MODAL ── */
.ahm-modal {
  width:100%; max-width:420px;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden;
  box-shadow:0 8px 40px rgba(26,28,22,0.18);
  animation:ahmSlideUp 0.25s cubic-bezier(0.34,1.2,0.64,1) both;
  position:relative;
}
.ahm-modal::before { content:''; position:absolute; top:-45px; right:-45px; width:140px; height:140px; border-radius:50%; background:radial-gradient(circle,rgba(76,102,43,0.08) 0%,transparent 70%); pointer-events:none; }
@keyframes ahmSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

/* Modal header */
.ahm-modal-hdr { display:flex; align-items:center; gap:12px; padding:16px 18px; border-bottom:1px solid var(--outline-variant); background:var(--surface-container); position:relative; z-index:1; }
.ahm-modal-icon { width:36px; height:36px; border-radius:10px; background:var(--primary-container); color:var(--on-primary-container); display:grid; place-items:center; flex-shrink:0; }
.ahm-modal-icon svg { width:16px; height:16px; }
.ahm-modal-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on-surface); margin-bottom:1px; }
.ahm-modal-sub { font-size:12px; color:var(--outline); font-weight:300; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px; }
.ahm-modal-close { margin-left:auto; width:30px; height:30px; border-radius:8px; border:none; background:transparent; color:var(--outline); display:grid; place-items:center; cursor:pointer; transition:background 0.15s; flex-shrink:0; }
.ahm-modal-close:hover { background:var(--surface-container-high); }

/* Modal body */
.ahm-modal-body { padding:18px 18px 20px; display:flex; flex-direction:column; gap:16px; position:relative; z-index:1; }

.ahm-field { display:flex; flex-direction:column; gap:8px; }
.ahm-label { font-size:12.5px; font-weight:500; color:var(--on-surface-variant); }
.ahm-optional { font-weight:300; color:var(--outline); }

/* Mood meter */
.ahm-meter { display:flex; flex-direction:column; gap:10px; padding:14px; border-radius:14px; background:var(--surface-container); border:1px solid var(--outline-variant); }
.ahm-meter-bar { display:flex; align-items:flex-end; gap:4px; height:52px; }
.ahm-seg { flex:1; border-radius:4px; transform-origin:bottom; }
.ahm-meter-meta { display:flex; align-items:center; justify-content:space-between; }
.ahm-val { font-family:'Playfair Display',serif; font-size:1.7rem; font-weight:400; line-height:1; }
.ahm-denom { font-size:0.9rem; opacity:0.5; font-family:'DM Sans',sans-serif; font-weight:300; }
.ahm-lbl { display:inline-flex; padding:3px 11px; border-radius:100px; font-size:11.5px; font-weight:600; }
.ahm-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:5px; outline:none; }
.ahm-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:var(--background); box-shadow:0 1px 6px rgba(0,0,0,0.12),0 0 0 2.5px var(--primary); cursor:pointer; }
.ahm-slider-labels { display:flex; justify-content:space-between; font-size:11px; color:var(--outline); font-weight:300; }

/* Textarea */
.ahm-textarea { width:100%; padding:11px 13px; border-radius:12px; border:1.5px solid var(--outline-variant); background:var(--background); color:var(--on-surface); font-family:'DM Sans',sans-serif; font-size:14px; resize:vertical; outline:none; line-height:1.6; transition:border-color 0.2s,box-shadow 0.2s; }
.ahm-textarea:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(76,102,43,0.1); }
.ahm-textarea::placeholder { color:var(--outline); opacity:0.7; }

/* Actions */
.ahm-actions { display:flex; gap:10px; margin-top:4px; }
.ahm-btn-ghost { flex:1; padding:11px; border-radius:12px; border:1.5px solid var(--outline-variant); background:transparent; color:var(--on-surface-variant); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s; }
.ahm-btn-ghost:hover { background:var(--surface-container-high); }
.ahm-btn-primary { flex:2; padding:11px; border-radius:12px; border:none; background:var(--primary); color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; box-shadow:0 2px 10px rgba(76,102,43,0.2); transition:all 0.2s; }
.ahm-btn-primary:hover:not(:disabled) { background:#3d5422; transform:translateY(-1px); box-shadow:0 4px 14px rgba(76,102,43,0.28); }
.ahm-btn-primary:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

@keyframes ahmSpin { to { transform:rotate(360deg); } }
.ahm-spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:ahmSpin 0.7s linear infinite; }

@media(max-width:480px) {
  .ah-root { border-radius:16px; }
  .ahm-modal { border-radius:16px; }
  .ahm-actions { flex-direction:column; }
  .ahm-btn-ghost,.ahm-btn-primary { flex:none; width:100%; }
}
`;
