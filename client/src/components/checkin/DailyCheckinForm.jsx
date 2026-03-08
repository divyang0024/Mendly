import { useState, useEffect } from "react";
import {
  saveCheckin,
  getTodayCheckin,
} from "../../features/checkin/checkin.api";

/* ── Metric icons — SVG per key + value range ── */
const MetricIcon = ({ metricKey, value, size = 20 }) => {
  const s = { width: size, height: size };
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (metricKey === "mood") {
    if (value <= 3)
      return (
        // sad
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
        </svg>
      );
    if (value <= 6)
      return (
        // neutral
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="15" x2="16" y2="15" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
        </svg>
      );
    return (
      // happy
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 13s1.5 3 4 3 4-3 4-3" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
      </svg>
    );
  }

  if (metricKey === "energy") {
    if (value <= 3)
      return (
        // battery low
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <rect x="2" y="7" width="16" height="10" rx="2" />
          <path d="M22 11v2" />
          <line x1="6" y1="11" x2="6" y2="13" strokeWidth="2.5" />
        </svg>
      );
    if (value <= 6)
      return (
        // partly sunny
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    return (
      // lightning bolt
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }

  if (metricKey === "stress") {
    if (value <= 3)
      return (
        // leaf / calm
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <path d="M12 22V12" />
          <path d="M12 12C12 7 7 4 4 6" />
          <path d="M12 12c0-5 5-8 8-6" />
          <path d="M12 12c-4 0-7 3-6 7" />
          <path d="M12 12c4 0 7 3 6 7" />
        </svg>
      );
    if (value <= 6)
      return (
        // alert face
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 15s1.5 1 4 1 4-1 4-1" />
          <path d="M9 9l1.5 1.5M15 9l-1.5 1.5" />
        </svg>
      );
    return (
      // flame / high stress
      <svg viewBox="0 0 24 24" style={s} {...p}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.5-1-2.5-2-4 0 0-1 1-1 2.5" />
        <path d="M12 22C6.47 22 2 17.52 2 12c0-2.5 1-4.75 2.65-6.41C5 5.24 5.5 5.5 5.5 6c0 1 .5 2 1.5 2.5C7.5 9 8.5 7.5 7.5 5.5 9.17 5.17 11 6 12 8c.67-1.5 2-2.5 3.5-2.5.5 0 1 .17 1.5.5C16.5 7 17 8.5 17.5 8c.5-.5 1.5-1.5 1.5-3 2.5 2 4 5 4 8C23 17.52 18.52 22 12 22z" />
      </svg>
    );
  }
  return null;
};

/* ── Field label icons ── */
const SleepIcon = () => (
  <svg
    width="15"
    height="15"
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
const NotesIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TagIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const metrics = [
  { key: "mood", label: "Mood", color: "primary" },
  { key: "energy", label: "Energy", color: "tertiary" },
  { key: "stress", label: "Stress", color: "error" },
];

const sliderTrack = (color, val) => {
  const pct = ((val - 1) / 9) * 100;
  const c =
    color === "primary"
      ? "var(--p)"
      : color === "tertiary"
        ? "var(--t)"
        : "var(--err)";
  return `linear-gradient(90deg, ${c} ${pct}%, var(--sx) ${pct}%)`;
};
const thumbColor = (color) =>
  color === "primary"
    ? "var(--p)"
    : color === "tertiary"
      ? "var(--t)"
      : "var(--err)";
const iconColor = (color) =>
  color === "primary"
    ? "var(--p)"
    : color === "tertiary"
      ? "var(--t)"
      : "var(--err)";

export default function DailyCheckinForm({ onSaved }) {
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  /* ── Original logic — unchanged ── */
  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await getTodayCheckin();
        if (res.data) {
          setMood(res.data.mood);
          setEnergy(res.data.energy);
          setStress(res.data.stress);
          setSleepHours(res.data.sleepHours || 7);
          setNotes(res.data.notes || "");
          setTags((res.data.tags || []).join(", "));
        }
        setLoaded(true);
      } catch {
        setLoaded(true);
      }
    };
    fetchToday();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    await saveCheckin({
      mood,
      energy,
      stress,
      sleepHours,
      notes,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setLoading(false);
    if (onSaved) onSaved();
  };
  /* ── End original logic ── */

  const vals = { mood, energy, stress };
  const setters = { mood: setMood, energy: setEnergy, stress: setStress };

  if (!loaded)
    return (
      <>
        <style>{dcfStyles}</style>
        <div className="dcf-root dcf-loading">
          <span className="dcf-spinner dark" />
          <span style={{ fontSize: 13, color: "var(--ol)" }}>
            Loading today's check-in…
          </span>
        </div>
      </>
    );

  return (
    <>
      <style>{dcfStyles}</style>
      <div className="dcf-root">
        {/* ── Header ── */}
        <div className="dcf-header">
          <div className="dcf-header-icon">
            <svg
              width="16"
              height="16"
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
            <h2 className="dcf-title">Daily Check-in</h2>
            <p className="dcf-subtitle">How are you feeling today?</p>
          </div>
        </div>

        <div className="dcf-body">
          {/* ── Mood / Energy / Stress sliders ── */}
          <div className="dcf-sliders">
            {metrics.map(({ key, label, color }) => (
              <div key={key} className="dcf-slider-row">
                <div className="dcf-slider-top">
                  <div className="dcf-slider-label-left">
                    <span
                      className="dcf-slider-icon"
                      style={{ color: iconColor(color) }}
                    >
                      <MetricIcon metricKey={key} value={vals[key]} size={20} />
                    </span>
                    <span className="dcf-slider-label">{label}</span>
                  </div>
                  <span className={`dcf-badge dcf-badge-${color}`}>
                    {vals[key]}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={vals[key]}
                  onChange={(e) => setters[key](Number(e.target.value))}
                  className="dcf-slider"
                  style={{
                    background: sliderTrack(color, vals[key]),
                    color: thumbColor(color),
                  }}
                />
                <div className="dcf-slider-labels">
                  <span>{key === "stress" ? "Calm" : "Low"}</span>
                  <span>High</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dcf-divider" />

          {/* ── Sleep ── */}
          <div className="dcf-field">
            <label className="dcf-label">
              <span className="dcf-label-icon">
                <SleepIcon />
              </span>{" "}
              Sleep hours
            </label>
            <div className="dcf-sleep-row">
              <button
                className="dcf-sleep-btn"
                onClick={() => setSleepHours((h) => Math.max(0, h - 0.5))}
              >
                −
              </button>
              <div className="dcf-sleep-val">
                <span className="dcf-sleep-num">{sleepHours}</span>
                <span className="dcf-sleep-unit">hrs</span>
              </div>
              <button
                className="dcf-sleep-btn"
                onClick={() => setSleepHours((h) => Math.min(24, h + 0.5))}
              >
                +
              </button>
              <input
                type="number"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="dcf-field">
            <label className="dcf-label">
              <span className="dcf-label-icon">
                <NotesIcon />
              </span>{" "}
              Notes
            </label>
            <textarea
              placeholder="Any thoughts about today…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="dcf-textarea"
              rows={3}
            />
          </div>

          {/* ── Tags ── */}
          <div className="dcf-field">
            <label className="dcf-label">
              <span className="dcf-label-icon">
                <TagIcon />
              </span>{" "}
              Tags
            </label>
            <div className="dcf-input-wrap">
              <input
                placeholder="e.g. exam, work, family"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="dcf-input"
              />
            </div>
            {tags && (
              <div className="dcf-tags-preview">
                {tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span key={t} className="dcf-tag-chip">
                      {t}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <button onClick={handleSubmit} disabled={loading} className="dcf-btn">
            {loading ? (
              <>
                <span className="dcf-spinner" />
                Saving…
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
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Check-in
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

const dcfStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --p:#4C662B; --pc:#CDEDA3; --opc:#354E16;
  --s:#586249; --sc:#DCE7C8; --osc:#404A33;
  --t:#386663; --tc:#BCECE7; --otc:#1F4E4B;
  --err:#BA1A1A; --errc:#FFDAD6; --oerrc:#93000A;
  --bg:#F9FAEF; --on:#1A1C16; --onv:#44483D;
  --ol:#75796C; --olv:#C5C8BA;
  --sl:#F3F4E9; --sm:#EEEFE3; --sh:#E8E9DE; --sx:#E2E3D8;
}

/* ── CARD SHELL ── */
.dcf-root {
  font-family:'DM Sans',sans-serif;
  background:var(--sl); border:1.5px solid var(--olv);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,.07); color:var(--on);
}
.dcf-root::before {
  content:''; position:absolute;
  top:-48px; right:-48px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,.07) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

.dcf-loading { display:flex; align-items:center; justify-content:center; gap:10px; min-height:120px; }

/* ── HEADER ── */
.dcf-header {
  display:flex; align-items:flex-start; gap:12px;
  padding:16px 20px;
  border-bottom:1px solid var(--olv);
  background:var(--sm);
  position:relative; z-index:1;
}
.dcf-header-icon {
  width:38px; height:38px; border-radius:11px;
  background:var(--pc); color:var(--opc);
  display:grid; place-items:center; flex-shrink:0; margin-top:1px;
}
.dcf-title { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:400; color:var(--on); margin:0 0 2px; }
.dcf-subtitle { font-size:12.5px; color:var(--ol); font-weight:300; margin:0; }

/* ── BODY ── */
.dcf-body { padding:20px; display:flex; flex-direction:column; gap:18px; position:relative; z-index:1; }

/* Sliders */
.dcf-sliders { display:flex; flex-direction:column; gap:16px; }
.dcf-slider-row { display:flex; flex-direction:column; gap:6px; }
.dcf-slider-top { display:flex; align-items:center; justify-content:space-between; }
.dcf-slider-label-left { display:flex; align-items:center; gap:8px; }
.dcf-slider-icon { display:flex; align-items:center; flex-shrink:0; transition:color 0.3s ease; }
.dcf-slider-label { font-size:13px; font-weight:500; color:var(--onv); }
.dcf-badge { display:inline-flex; align-items:center; padding:2px 9px; border-radius:100px; font-size:11.5px; font-weight:500; }
.dcf-badge-primary  { background:var(--pc);   color:var(--opc);   }
.dcf-badge-tertiary { background:var(--tc);   color:var(--otc);   }
.dcf-badge-error    { background:var(--errc); color:var(--oerrc); }
.dcf-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:5px; outline:none; transition:background .25s; }
.dcf-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:var(--bg); box-shadow:0 1px 6px rgba(0,0,0,.12),0 0 0 2.5px currentColor; cursor:pointer; }
.dcf-slider::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:var(--bg); box-shadow:0 1px 6px rgba(0,0,0,.12),0 0 0 2.5px currentColor; cursor:pointer; border:none; }
.dcf-slider-labels { display:flex; justify-content:space-between; font-size:11px; color:var(--ol); margin-top:-2px; }

.dcf-divider { height:1px; background:var(--olv); opacity:.6; }

/* Fields */
.dcf-field { display:flex; flex-direction:column; gap:7px; }
.dcf-label { display:flex; align-items:center; gap:7px; font-size:13px; font-weight:500; color:var(--onv); }
.dcf-label-icon { display:flex; align-items:center; color:var(--ol); flex-shrink:0; }

/* Sleep stepper */
.dcf-sleep-row { display:flex; align-items:center; background:var(--bg); border:1.5px solid var(--olv); border-radius:12px; overflow:hidden; width:fit-content; }
.dcf-sleep-btn { width:44px; height:44px; border:none; background:var(--sm); cursor:pointer; font-size:20px; color:var(--onv); transition:background .15s; font-family:'DM Sans',sans-serif; }
.dcf-sleep-btn:hover { background:var(--sh); }
.dcf-sleep-val { display:flex; align-items:baseline; gap:3px; padding:0 20px; }
.dcf-sleep-num { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:400; color:var(--on); }
.dcf-sleep-unit { font-size:12px; color:var(--ol); font-weight:400; }

/* Textarea & Input */
.dcf-textarea { width:100%; padding:11px 13px; border-radius:12px; border:1.5px solid var(--olv); background:var(--bg); color:var(--on); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:400; resize:vertical; outline:none; line-height:1.6; transition:border-color .2s,box-shadow .2s; }
.dcf-textarea:focus { border-color:var(--p); box-shadow:0 0 0 3px rgba(76,102,43,.1); }
.dcf-textarea::placeholder { color:var(--ol); opacity:.7; }
.dcf-input-wrap { display:flex; align-items:center; padding:11px 13px; border-radius:12px; border:1.5px solid var(--olv); background:var(--bg); transition:border-color .2s,box-shadow .2s; }
.dcf-input-wrap:focus-within { border-color:var(--p); box-shadow:0 0 0 3px rgba(76,102,43,.1); }
.dcf-input { flex:1; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--on); background:transparent; }
.dcf-input::placeholder { color:var(--ol); opacity:.7; }

/* Tag chips */
.dcf-tags-preview { display:flex; flex-wrap:wrap; gap:6px; margin-top:2px; }
.dcf-tag-chip { display:inline-flex; align-items:center; padding:3px 10px; border-radius:100px; background:var(--sc); color:var(--osc); font-size:11.5px; font-weight:500; }

/* Button */
.dcf-btn { width:100%; padding:12px 18px; border:none; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14.5px; font-weight:500; cursor:pointer; background:var(--p); color:#fff; box-shadow:0 2px 10px rgba(76,102,43,.2); transition:all .22s ease; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:4px; }
.dcf-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 16px rgba(76,102,43,.28); background:#3d5422; }
.dcf-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; }

@keyframes dcfSpin { to { transform:rotate(360deg); } }
.dcf-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:dcfSpin .7s linear infinite; flex-shrink:0; }
.dcf-spinner.dark { border-color:rgba(76,102,43,.2); border-top-color:var(--p); }

@media(max-width:480px) {
  .dcf-root { border-radius:16px; }
  .dcf-body { padding:16px; gap:14px; }
}
`;
