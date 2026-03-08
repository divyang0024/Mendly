import { useState } from "react";
import { createActivationPlan } from "../../features/activation/activation.api";

/* ── Activity types — SVG icons ── */
const types = [
  {
    key: "physical",
    label: "Physical",
    icon: (
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
  },
  {
    key: "social",
    label: "Social",
    icon: (
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
  },
  {
    key: "creative",
    label: "Creative",
    icon: (
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
  },
  {
    key: "productive",
    label: "Productive",
    icon: (
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
  },
  {
    key: "self-care",
    label: "Self-Care",
    icon: (
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
  },
  {
    key: "outdoor",
    label: "Outdoor",
    icon: (
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
  },
  {
    key: "learning",
    label: "Learning",
    icon: (
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
  },
];

/* ── Difficulty helpers ── */
const diffLabel = (v) =>
  v <= 1
    ? "Very Easy"
    : v <= 2
      ? "Easy"
      : v === 3
        ? "Moderate"
        : v <= 4
          ? "Challenging"
          : "Hard";
const diffColors = (v) =>
  v <= 2
    ? { bg: "var(--primary-container)", text: "var(--on-primary-container)" }
    : v === 3
      ? {
          bg: "var(--tertiary-container)",
          text: "var(--on-tertiary-container)",
        }
      : { bg: "#FEF3C7", text: "#78350F" };

/* ── Tension meter (mood) ── */
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
function TensionMeter({ value }) {
  const label =
    value <= 3 ? "Feeling low" : value <= 6 ? "Moderate mood" : "Feeling good";
  const labelColor =
    value <= 3 ? "#93000A" : value <= 6 ? "#78350F" : "#354E16";
  const labelBg = value <= 3 ? "#FFDAD6" : value <= 6 ? "#FEF3C7" : "#CDEDA3";
  return (
    <div className="apl-meter-wrap">
      <div className="apl-meter-bar">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="apl-meter-seg"
            style={{
              background:
                i < value ? SEG_COLORS[i] : "var(--surface-container-highest)",
              transform: i < value ? "scaleY(1)" : "scaleY(0.55)",
              opacity: i < value ? 1 : 0.4,
              height: i < value ? 28 + (i / 9) * 20 : 24,
              transition: `all 0.25s cubic-bezier(.4,0,.2,1) ${i * 0.02}s`,
            }}
          />
        ))}
      </div>
      <div className="apl-meter-meta">
        <span
          className="apl-meter-val"
          style={{ color: SEG_COLORS[Math.min(value - 1, 9)] }}
        >
          {value}
          <span className="apl-meter-denom">/10</span>
        </span>
        <span
          className="apl-meter-lbl"
          style={{ background: labelBg, color: labelColor }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

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
    setActivityType("physical");
    setDifficulty(3);
    setMoodBefore(5);
    setLoading(false);
    if (onCreated) onCreated();
  };
  /* ── End original logic ── */

  const dc = diffColors(difficulty);
  const diffPct = (((difficulty - 1) / 4) * 100).toFixed(1);

  return (
    <>
      <style>{apStyles}</style>
      <div className="apl-root">
        {/* ── Card header ── */}
        <div className="apl-hdr">
          <div className="apl-hdr-l">
            <div className="apl-hdr-ic">
              <svg
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
              <span className="apl-hdr-title">Plan a Positive Action</span>
              <p className="apl-hdr-sub">Small steps build lasting momentum</p>
            </div>
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
                {difficulty}/5 · {diffLabel(difficulty)}
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
                background: `linear-gradient(90deg, var(--primary) ${diffPct}%, var(--surface-container-highest) ${diffPct}%)`,
              }}
            />
            <div className="apl-slider-labels">
              <span>Very Easy</span>
              <span>Hard</span>
            </div>
          </div>

          {/* Mood before */}
          <div className="apl-field">
            <label className="apl-label">Mood right now</label>
            <TensionMeter value={moodBefore} />
            <input
              type="range"
              min="1"
              max="10"
              value={moodBefore}
              onChange={(e) => setMoodBefore(Number(e.target.value))}
              className="apl-slider"
              style={{
                background: `linear-gradient(90deg, var(--primary) ${(((moodBefore - 1) / 9) * 100).toFixed(1)}%, var(--surface-container-highest) ${(((moodBefore - 1) / 9) * 100).toFixed(1)}%)`,
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

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
  --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
  --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
  --error:#BA1A1A;--error-container:#FFDAD6;--on-error-container:#93000A;
  --background:#F9FAEF;--on-surface:#1A1C16;--on-surface-variant:#44483D;
  --outline:#75796C;--outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
}

/* ── CARD SHELL ── */
.apl-root {
  font-family:'DM Sans',sans-serif;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
  color:var(--on-surface);
}
.apl-root::before {
  content:''; position:absolute;
  top:-48px; right:-48px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,0.07) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.apl-hdr {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  position:relative; z-index:1;
}
.apl-hdr-l { display:flex; align-items:center; gap:12px; }
.apl-hdr-ic {
  width:36px; height:36px; border-radius:10px;
  background:var(--primary-container); color:var(--on-primary-container);
  display:grid; place-items:center; flex-shrink:0;
}
.apl-hdr-ic svg { width:16px; height:16px; }
.apl-hdr-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400;
  color:var(--on-surface); letter-spacing:-0.1px;
  display:block; margin-bottom:1px;
}
.apl-hdr-sub { font-size:12px; color:var(--outline); font-weight:300; margin:0; }

/* ── BODY ── */
.apl-body { padding:20px; display:flex; flex-direction:column; gap:18px; position:relative; z-index:1; }

.apl-field { display:flex; flex-direction:column; gap:8px; }
.apl-label { font-size:12.5px; font-weight:500; color:var(--on-surface-variant); letter-spacing:0.01em; }
.apl-label-row { display:flex; align-items:center; justify-content:space-between; }
.apl-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:100px; font-size:11.5px; font-weight:500; transition:all 0.3s ease; }

.apl-input-wrap { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:12px; border:1.5px solid var(--outline-variant); background:var(--background); transition:border-color 0.2s,box-shadow 0.2s; }
.apl-input-wrap:focus-within { border-color:var(--primary); box-shadow:0 0 0 3px rgba(76,102,43,0.1); }
.apl-input { flex:1; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--on-surface); background:transparent; }
.apl-input::placeholder { color:var(--outline); opacity:0.7; }

/* Type grid */
.apl-type-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }
@media(max-width:400px){ .apl-type-grid { grid-template-columns:repeat(3,1fr); } }
.apl-type-card {
  position:relative; display:flex; flex-direction:column; align-items:center; gap:6px;
  padding:10px 6px; border:1.5px solid var(--outline-variant); border-radius:12px;
  cursor:pointer; background:var(--surface-container-low);
  font-family:'DM Sans',sans-serif; transition:all 0.2s ease;
}
.apl-type-card:hover { border-color:rgba(76,102,43,0.3); background:var(--surface-container); transform:translateY(-1px); }
.apl-type-card.selected { border-color:var(--primary); background:var(--primary-container); box-shadow:0 2px 10px rgba(76,102,43,0.12); }
.apl-type-icon { width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:var(--outline); }
.apl-type-icon svg { width:18px; height:18px; }
.apl-type-card.selected .apl-type-icon { color:var(--on-primary-container); }
.apl-type-label { font-size:10.5px; font-weight:500; color:var(--on-surface-variant); text-align:center; }
.apl-type-card.selected .apl-type-label { color:var(--on-primary-container); }
.apl-type-check { position:absolute; top:5px; right:5px; width:15px; height:15px; border-radius:50%; background:var(--primary); display:grid; place-items:center; }

/* Slider */
.apl-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:5px; outline:none; cursor:pointer; transition:background 0.3s; }
.apl-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:white; box-shadow:0 1px 6px rgba(0,0,0,0.14),0 0 0 2.5px var(--primary); cursor:pointer; transition:transform 0.15s; }
.apl-slider::-webkit-slider-thumb:hover { transform:scale(1.1); }
.apl-slider-labels { display:flex; justify-content:space-between; font-size:11px; color:var(--outline); font-weight:300; }

/* ── TENSION METER ── */
.apl-meter-wrap {
  display:flex; flex-direction:column; gap:12px; width:100%;
  padding:16px; border-radius:14px;
  background:var(--surface-container); border:1px solid var(--outline-variant);
}
.apl-meter-bar { display:flex; align-items:flex-end; gap:4px; height:56px; }
.apl-meter-seg { flex:1; border-radius:4px; transform-origin:bottom; }
.apl-meter-meta { display:flex; align-items:center; justify-content:space-between; }
.apl-meter-val { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:400; line-height:1; transition:color 0.3s ease; }
.apl-meter-denom { font-size:0.95rem; opacity:0.5; margin-left:1px; font-family:'DM Sans',sans-serif; font-weight:300; }
.apl-meter-lbl { display:inline-flex; padding:4px 12px; border-radius:100px; font-size:12px; font-weight:600; letter-spacing:0.02em; transition:all 0.3s ease; }

/* Button */
.apl-btn { width:100%; padding:12px 20px; border:none; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14.5px; font-weight:500; cursor:pointer; background:var(--primary); color:var(--on-primary); box-shadow:0 2px 10px rgba(76,102,43,0.2); transition:all 0.22s ease; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:4px; }
.apl-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 16px rgba(76,102,43,0.28); background:#3d5422; }
.apl-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
@keyframes aplSpin { to { transform:rotate(360deg); } }
.apl-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:aplSpin 0.7s linear infinite; flex-shrink:0; }

@media(max-width:480px) {
  .apl-root { border-radius:16px; }
  .apl-body { padding:16px; gap:14px; }
  .apl-meter-bar { height:44px; }
  .apl-meter-seg { border-radius:3px; }
}
`;
