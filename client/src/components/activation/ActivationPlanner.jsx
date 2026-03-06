import { useState } from "react";
import { createActivationPlan } from "../../features/activation/activation.api";

const types = [
  { key: "physical", label: "Physical", icon: "🏃" },
  { key: "social", label: "Social", icon: "🤝" },
  { key: "creative", label: "Creative", icon: "🎨" },
  { key: "productive", label: "Productive", icon: "✅" },
  { key: "self-care", label: "Self-Care", icon: "🌿" },
  { key: "outdoor", label: "Outdoor", icon: "🌳" },
  { key: "learning", label: "Learning", icon: "📚" },
];

const difficultyLabel = (v) =>
  v <= 1
    ? "Very Easy"
    : v <= 2
      ? "Easy"
      : v === 3
        ? "Moderate"
        : v <= 4
          ? "Challenging"
          : "Hard";
const difficultyColors = (v) =>
  v <= 2
    ? { bg: "var(--primary-container)", text: "var(--on-primary-container)" }
    : v === 3
      ? {
          bg: "var(--tertiary-container)",
          text: "var(--on-tertiary-container)",
        }
      : { bg: "#FEF3C7", text: "#78350F" };

const moodEmoji = (v) => (v <= 3 ? "🌿" : v <= 6 ? "🌤" : "🔥");
const moodLabel = (v) => (v <= 3 ? "Low" : v <= 6 ? "Moderate" : "High");
const moodColors = (v) => ({
  bg:
    v <= 3
      ? "var(--primary-container)"
      : v <= 6
        ? "#FEF3C7"
        : "var(--error-container)",
  text:
    v <= 3
      ? "var(--on-primary-container)"
      : v <= 6
        ? "#78350F"
        : "var(--on-error-container)",
});
const sliderBg = (v, max) => {
  const pct = ((v - 1) / (max - 1)) * 100;
  return `linear-gradient(90deg, var(--primary) ${pct}%, var(--surface-container-highest) ${pct}%)`;
};

export default function ActivationPlanner({ onCreated }) {
  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] = useState("physical");
  const [difficulty, setDifficulty] = useState(3);
  const [moodBefore, setMoodBefore] = useState(5);
  const [loading, setLoading] = useState(false);

  /* ── Original logic — unchanged ── */
  const submit = async () => {
    setLoading(true);
    await createActivationPlan({
      activityName,
      activityType,
      difficulty,
      moodBefore,
    });
    setActivityName("");
    setLoading(false);
    if (onCreated) onCreated();
  };
  /* ── End original logic ── */

  const dc = difficultyColors(difficulty);
  const mc = moodColors(moodBefore);

  return (
    <>
      <style>{apStyles}</style>
      <div className="apl-root">
        {/* Header */}
        <div className="apl-header">
          <div className="apl-header-icon">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h3 className="apl-title">Plan a Positive Action</h3>
            <p className="apl-subtitle">Small steps build lasting momentum</p>
          </div>
        </div>

        <div className="apl-body">
          {/* Activity name */}
          <div className="apl-field">
            <label className="apl-label">What will you do?</label>
            <div className="apl-input-wrap">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--outline)", flexShrink: 0 }}
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <input
                placeholder="e.g. Take a 20-minute walk…"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="apl-input"
              />
            </div>
          </div>

          {/* Activity type */}
          <div className="apl-field">
            <label className="apl-label">Activity type</label>
            <div className="apl-type-grid">
              {types.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActivityType(t.key)}
                  className={`apl-type-card${activityType === t.key ? " selected" : ""}`}
                >
                  <span className="apl-type-icon">{t.icon}</span>
                  <span className="apl-type-label">{t.label}</span>
                  {activityType === t.key && (
                    <div className="apl-type-check">
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6L5 8.5L9.5 3.5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Effort level */}
          <div className="apl-field">
            <div className="apl-label-row">
              <label className="apl-label">Effort level</label>
              <span
                className="apl-badge"
                style={{ background: dc.bg, color: dc.text }}
              >
                {difficulty}/5 · {difficultyLabel(difficulty)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="apl-slider"
              style={{
                background: sliderBg(difficulty, 5),
                color: "var(--primary)",
              }}
            />
            <div className="apl-slider-labels">
              <span>Very Easy</span>
              <span>Hard</span>
            </div>
          </div>

          {/* Mood before */}
          <div className="apl-field">
            <div className="apl-label-row">
              <label className="apl-label">Mood right now</label>
              <span
                className="apl-badge"
                style={{ background: mc.bg, color: mc.text }}
              >
                {moodEmoji(moodBefore)} {moodBefore}/10 ·{" "}
                {moodLabel(moodBefore)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={moodBefore}
              onChange={(e) => setMoodBefore(Number(e.target.value))}
              className="apl-slider"
              style={{
                background: `linear-gradient(90deg,var(--primary) 0%,#B1D18A 50%,var(--tertiary) 100%)`,
                color: "var(--primary)",
              }}
            />
            <div className="apl-slider-labels">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={!activityName.trim() || loading}
            className="apl-btn"
          >
            {loading ? (
              <>
                <span className="apl-spinner" />
                Creating Plan…
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Plan
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

const apStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
    --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
    --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
    --error:#BA1A1A;--error-container:#FFDAD6;--on-error-container:#93000A;
    --background:#F9FAEF;--on-surface:#1A1C16;--on-surface-variant:#44483D;
    --outline:#75796C;--outline-variant:#C5C8BA;
    --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
    --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
    --inverse-primary:#B1D18A;
  }
  .apl-root { font-family:'DM Sans',sans-serif; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); border-radius:20px; overflow:hidden; position:relative; box-shadow:0 1px 12px rgba(26,28,22,0.07); color:var(--on-surface); }
  .apl-root::before { content:''; position:absolute; top:-45px; right:-45px; width:140px; height:140px; border-radius:50%; background:radial-gradient(circle,rgba(76,102,43,0.07) 0%,transparent 70%); pointer-events:none; }

  .apl-header { display:flex; align-items:flex-start; gap:12px; padding:16px 20px; border-bottom:1px solid var(--outline-variant); background:var(--surface-container); }
  .apl-header-icon { width:36px; height:36px; border-radius:10px; background:var(--primary-container); color:var(--on-primary-container); display:grid; place-items:center; flex-shrink:0; margin-top:2px; }
  .apl-title { font-family:'Playfair Display',serif; font-size:1.05rem; font-weight:400; color:var(--on-surface); margin:0 0 2px; }
  .apl-subtitle { font-size:12.5px; color:var(--outline); font-weight:300; margin:0; }

  .apl-body { padding:20px; display:flex; flex-direction:column; gap:18px; position:relative; z-index:1; }

  .apl-field { display:flex; flex-direction:column; gap:8px; }
  .apl-label { font-size:12.5px; font-weight:500; color:var(--on-surface-variant); letter-spacing:0.01em; }
  .apl-label-row { display:flex; align-items:center; justify-content:space-between; }
  .apl-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:100px; font-size:11.5px; font-weight:500; transition:all 0.3s ease; }

  .apl-input-wrap { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:12px; border:1.5px solid var(--outline-variant); background:var(--background); transition:border-color 0.2s,box-shadow 0.2s; }
  .apl-input-wrap:focus-within { border-color:var(--primary); box-shadow:0 0 0 3px rgba(76,102,43,0.1); }
  .apl-input { flex:1; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--on-surface); background:transparent; }
  .apl-input::placeholder { color:var(--outline); opacity:0.7; }

  .apl-type-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }
  @media(max-width:400px){ .apl-type-grid { grid-template-columns:repeat(3,1fr); } }
  .apl-type-card { position:relative; display:flex; flex-direction:column; align-items:center; gap:5px; padding:10px 6px; border:1.5px solid var(--outline-variant); border-radius:12px; cursor:pointer; background:var(--surface-container-low); font-family:'DM Sans',sans-serif; transition:all 0.2s ease; }
  .apl-type-card:hover { border-color:rgba(76,102,43,0.3); background:var(--surface-container); transform:translateY(-1px); }
  .apl-type-card.selected { border-color:var(--primary); background:var(--primary-container); box-shadow:0 2px 10px rgba(76,102,43,0.12); }
  .apl-type-icon { font-size:18px; line-height:1; }
  .apl-type-label { font-size:10.5px; font-weight:500; color:var(--on-surface-variant); text-align:center; }
  .apl-type-card.selected .apl-type-label { color:var(--on-primary-container); }
  .apl-type-check { position:absolute; top:5px; right:5px; width:15px; height:15px; border-radius:50%; background:var(--primary); display:grid; place-items:center; }

  .apl-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:5px; outline:none; }
  .apl-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:var(--background); box-shadow:0 1px 6px rgba(0,0,0,0.12),0 0 0 2.5px currentColor; cursor:pointer; }
  .apl-slider::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:var(--background); box-shadow:0 1px 6px rgba(0,0,0,0.12),0 0 0 2.5px currentColor; cursor:pointer; border:none; }
  .apl-slider-labels { display:flex; justify-content:space-between; font-size:11px; color:var(--outline); font-weight:400; margin-top:-2px; }

  .apl-btn { width:100%; padding:12px 20px; border:none; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14.5px; font-weight:500; cursor:pointer; background:var(--primary); color:var(--on-primary); box-shadow:0 2px 10px rgba(76,102,43,0.2); transition:all 0.22s ease; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:4px; }
  .apl-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 16px rgba(76,102,43,0.28); background:#3d5422; }
  .apl-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
  @keyframes aplSpin { to { transform:rotate(360deg); } }
  .apl-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:aplSpin 0.7s linear infinite; flex-shrink:0; }
`;
