import { useState } from "react";
import {
  generateAffirmation,
  saveAffirmationSession,
} from "../../features/affirmation/affirmation.api";

/* ── Theme definitions — SVG icons replace emojis ── */
const themes = [
  {
    key: "self-worth",
    label: "Self Worth",
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
    key: "confidence",
    label: "Confidence",
    icon: (
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
  },
  {
    key: "anxiety-relief",
    label: "Anxiety Relief",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: "resilience",
    label: "Resilience",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    key: "motivation",
    label: "Motivation",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    key: "self-compassion",
    label: "Self Compassion",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

/* ── Tension meter ── */
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
    value <= 3
      ? "Feeling calm"
      : value <= 6
        ? "Some tension"
        : "High activation";
  const labelColor =
    value <= 3 ? "#354E16" : value <= 6 ? "#78350F" : "#93000A";
  const labelBg = value <= 3 ? "#CDEDA3" : value <= 6 ? "#FEF3C7" : "#FFDAD6";
  return (
    <div className="af-meter-wrap">
      <div className="af-meter-bar">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="af-meter-seg"
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
      <div className="af-meter-meta">
        <span
          className="af-meter-val"
          style={{ color: SEG_COLORS[Math.min(value - 1, 9)] }}
        >
          {value}
          <span className="af-meter-denom">/10</span>
        </span>
        <span
          className="af-meter-lbl"
          style={{ background: labelBg, color: labelColor }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function AffirmationFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState("self-worth");
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [affirmation, setAffirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ── Original logic — unchanged ── */
  const getAI = async () => {
    setLoading(true);
    const res = await generateAffirmation({ theme, intensity: before });
    setAffirmation(res.data.affirmation);
    setLoading(false);
    setStep(3);
  };

  const save = async () => {
    setLoading(true);
    await saveAffirmationSession({
      sessionId,
      theme,
      affirmationText: affirmation,
      intensityBefore: before,
      intensityAfter: after,
      feltHelpful: after < before,
    });
    setLoading(false);
    setSaved(true);
    if (onComplete) onComplete();
  };
  /* ── End original logic ── */

  const reset = () => {
    setStep(1);
    setTheme("self-worth");
    setBefore(5);
    setAfter(5);
    setAffirmation("");
    setSaved(false);
  };

  const sliderFill = (v) =>
    v <= 3 ? "#4C662B" : v <= 6 ? "#C5A000" : "#BA1A1A";
  const sliderBg = (v) =>
    `linear-gradient(90deg, ${sliderFill(v)} ${(((v - 1) / 9) * 100).toFixed(1)}%, var(--surface-container-highest) ${(((v - 1) / 9) * 100).toFixed(1)}%)`;

  const totalSteps = 3;
  const stepNum = step === 1 ? 1 : step === 3 ? 2 : 3;
  const stepTitles = {
    1: "How do you feel?",
    3: "Your affirmation",
    4: "How do you feel now?",
  };
  const stepSubtitles = {
    1: "Rate your current state and choose a focus theme",
    3: "Read this slowly and let it settle",
    4: "Rate your emotional state after the affirmation",
  };
  const currentTheme = themes.find((t) => t.key === theme);

  if (saved) {
    const diff = before - after;
    return (
      <>
        <style>{afStyles}</style>
        <div className="af-root">
          <div className="af-hdr">
            <div className="af-hdr-l">
              <div className="af-hdr-ic">
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
              <span className="af-hdr-title">Affirmation</span>
            </div>
            <div className="af-hdr-badge">Done</div>
          </div>
          <div className="af-body">
            <div className="af-done">
              <div className="af-done-icon">
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M7 14.5L12 19.5L21 9.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="af-done-title">Session Saved</h3>
              <p className="af-done-sub">
                Emotional intensity shifted by <strong>{diff}</strong> points
              </p>
              {diff > 0 && (
                <div className="af-done-chip">
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
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                  {before} → {after} intensity
                </div>
              )}
              <button className="af-btn-restart" onClick={reset}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                </svg>
                Start Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{afStyles}</style>
      <div className="af-root">
        {/* ── Card header ── */}
        <div className="af-hdr">
          <div className="af-hdr-l">
            <div className="af-hdr-ic">
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
            <span className="af-hdr-title">Affirmation</span>
          </div>
          <div className="af-hdr-badge">
            Step {stepNum} of {totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="af-pbar">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`af-pseg${s <= stepNum ? " on" : ""}`} />
          ))}
        </div>

        <div className="af-body">
          {/* Step header */}
          <div className="af-step-header">
            <h2 className="af-title">{stepTitles[step]}</h2>
            <p className="af-subtitle">{stepSubtitles[step]}</p>
          </div>

          {/* ════ STEP 1: Feeling + Theme ════ */}
          {step === 1 && (
            <div className="af-step af-in">
              <TensionMeter value={before} />
              <input
                type="range"
                min="1"
                max="10"
                value={before}
                onChange={(e) => setBefore(Number(e.target.value))}
                className="af-slider"
                style={{ background: sliderBg(before) }}
              />
              <div className="af-slider-labels">
                <span>Calm</span>
                <span>Overwhelmed</span>
              </div>

              <div className="af-divider">
                <div className="af-divider-line" />
                <span className="af-divider-label">Choose a theme</span>
                <div className="af-divider-line" />
              </div>

              <div className="af-theme-grid">
                {themes.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTheme(t.key)}
                    className={`af-theme-card${theme === t.key ? " selected" : ""}`}
                  >
                    <span className="af-theme-icon">{t.icon}</span>
                    <span className="af-theme-label">{t.label}</span>
                    {theme === t.key && (
                      <div className="af-theme-check">
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
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

              <button
                onClick={getAI}
                disabled={loading}
                className="af-btn-primary"
              >
                {loading ? (
                  <>
                    <span className="af-spinner" />
                    Generating…
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Generate Affirmation
                  </>
                )}
              </button>
            </div>
          )}

          {/* ════ STEP 2 (step===3): Affirmation card ════ */}
          {step === 3 && (
            <div className="af-step af-in">
              <div className="af-theme-pill-wrap">
                <span className="af-theme-pill">
                  <span className="af-theme-pill-ic">{currentTheme?.icon}</span>
                  {currentTheme?.label}
                </span>
              </div>
              <div className="af-affirmation-card">
                {loading ? (
                  <div className="af-affirmation-loading">
                    <span className="af-spinner dark" />
                    <span>Crafting your affirmation…</span>
                  </div>
                ) : (
                  <>
                    <div className="af-quote-mark">"</div>
                    <p className="af-affirmation-text">{affirmation}</p>
                    <div className="af-quote-mark close">"</div>
                  </>
                )}
              </div>
              <button
                onClick={() => setStep(4)}
                disabled={loading}
                className="af-btn-teal"
              >
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
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                I've Read It
              </button>
            </div>
          )}

          {/* ════ STEP 3 (step===4): After rating ════ */}
          {step === 4 && (
            <div className="af-step af-in">
              <TensionMeter value={after} />
              <input
                type="range"
                min="1"
                max="10"
                value={after}
                onChange={(e) => setAfter(Number(e.target.value))}
                className="af-slider"
                style={{ background: sliderBg(after) }}
              />
              <div className="af-slider-labels">
                <span>Calm</span>
                <span>Overwhelmed</span>
              </div>
              {before > after && (
                <div className="af-shift-banner">
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
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                  {before - after} point{before - after > 1 ? "s" : ""} lower
                  than before
                </div>
              )}
              <div className="af-btn-row">
                <button onClick={() => setStep(3)} className="af-btn-outline">
                  Back
                </button>
                <button
                  onClick={save}
                  disabled={loading}
                  className="af-btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="af-spinner" />
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
                      Save Session
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const afStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

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
.af-root {
  font-family:'DM Sans',sans-serif;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; max-width:480px; margin:0 auto;
  overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
  color:var(--on-surface);
}
.af-root::before {
  content:''; position:absolute;
  top:-48px; right:-48px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(56,102,99,0.07) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.af-hdr {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  position:relative; z-index:1;
}
.af-hdr-l { display:flex; align-items:center; gap:10px; }
.af-hdr-ic {
  width:30px; height:30px; border-radius:9px;
  background:var(--primary-container); color:var(--on-primary-container);
  display:grid; place-items:center; flex-shrink:0;
}
.af-hdr-ic svg { width:14px; height:14px; }
.af-hdr-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400;
  color:var(--on-surface); letter-spacing:-0.1px;
}
.af-hdr-badge {
  display:inline-flex; align-items:center;
  padding:3px 10px; border-radius:100px;
  background:var(--surface-container-highest);
  border:1px solid var(--outline-variant);
  font-size:11px; font-weight:500; color:var(--outline);
}

/* ── PROGRESS BAR ── */
.af-pbar {
  display:flex; gap:4px; padding:10px 18px;
  background:var(--surface-container);
  border-bottom:1px solid var(--outline-variant);
  position:relative; z-index:1;
}
.af-pseg { flex:1; height:3px; border-radius:3px; background:var(--surface-container-highest); transition:background 0.5s ease; }
.af-pseg.on { background:linear-gradient(90deg,var(--primary),var(--tertiary)); }

/* ── BODY ── */
.af-body { padding:22px 20px 26px; position:relative; z-index:1; }

/* Step header */
.af-step-header { margin-bottom:20px; }
.af-title { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:400; color:var(--on-surface); margin:0 0 5px; letter-spacing:-0.2px; line-height:1.25; }
.af-subtitle { font-size:13.5px; font-weight:300; color:var(--outline); margin:0; line-height:1.55; }

.af-step { display:flex; flex-direction:column; gap:14px; }
@keyframes afFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.af-in { animation:afFadeUp 0.38s ease-out both; }

/* ── TENSION METER ── */
.af-meter-wrap {
  display:flex; flex-direction:column; gap:12px; width:100%;
  padding:16px; border-radius:14px;
  background:var(--surface-container); border:1px solid var(--outline-variant);
}
.af-meter-bar { display:flex; align-items:flex-end; gap:4px; height:56px; }
.af-meter-seg { flex:1; border-radius:4px; transform-origin:bottom; }
.af-meter-meta { display:flex; align-items:center; justify-content:space-between; }
.af-meter-val { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:400; line-height:1; transition:color 0.3s ease; }
.af-meter-denom { font-size:0.95rem; opacity:0.5; margin-left:1px; font-family:'DM Sans',sans-serif; font-weight:300; }
.af-meter-lbl { display:inline-flex; padding:4px 12px; border-radius:100px; font-size:12px; font-weight:600; letter-spacing:0.02em; transition:all 0.3s ease; }

/* Slider */
.af-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:5px; outline:none; cursor:pointer; transition:background 0.3s; }
.af-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:white; box-shadow:0 1px 6px rgba(0,0,0,0.14),0 0 0 2.5px var(--primary); cursor:pointer; transition:box-shadow 0.2s,transform 0.15s; }
.af-slider::-webkit-slider-thumb:hover { transform:scale(1.1); }
.af-slider-labels { display:flex; justify-content:space-between; font-size:11.5px; color:var(--outline); font-weight:300; }

/* Divider */
.af-divider { display:flex; align-items:center; gap:10px; }
.af-divider-line { flex:1; height:1px; background:var(--outline-variant); }
.af-divider-label { font-size:11px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; color:var(--outline); white-space:nowrap; }

/* Theme grid */
.af-theme-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.af-theme-card {
  position:relative; display:flex; align-items:center; gap:10px;
  padding:11px 13px; border:1.5px solid var(--outline-variant);
  border-radius:12px; cursor:pointer; background:var(--surface-container-low);
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
  color:var(--on-surface); transition:all 0.2s ease; text-align:left;
}
.af-theme-card:hover { border-color:rgba(76,102,43,0.3); background:var(--surface-container); transform:translateY(-1px); }
.af-theme-card.selected { border-color:var(--primary); background:var(--primary-container); color:var(--on-primary-container); box-shadow:0 2px 12px rgba(76,102,43,0.12); }
.af-theme-icon { width:20px; height:20px; flex-shrink:0; display:flex; align-items:center; color:var(--outline); }
.af-theme-icon svg { width:18px; height:18px; }
.af-theme-card.selected .af-theme-icon { color:var(--on-primary-container); }
.af-theme-label { flex:1; font-size:12.5px; }
.af-theme-check { position:absolute; top:7px; right:8px; width:17px; height:17px; border-radius:50%; background:var(--primary); display:grid; place-items:center; }

/* Theme pill */
.af-theme-pill-wrap { display:flex; justify-content:center; }
.af-theme-pill { display:inline-flex; align-items:center; gap:7px; padding:5px 13px; border-radius:100px; background:var(--secondary-container); color:var(--on-secondary-container); font-size:12.5px; font-weight:500; }
.af-theme-pill-ic { width:16px; height:16px; display:flex; align-items:center; }
.af-theme-pill-ic svg { width:15px; height:15px; }

/* Affirmation card */
.af-affirmation-card {
  position:relative; padding:28px 24px; border-radius:16px;
  background:var(--primary); overflow:hidden; min-height:120px;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
}
.af-affirmation-card::before { content:''; position:absolute; top:-40px; right:-40px; width:150px; height:150px; border-radius:50%; background:radial-gradient(circle,rgba(177,209,138,0.2) 0%,transparent 70%); pointer-events:none; }
.af-affirmation-card::after  { content:''; position:absolute; bottom:-30px; left:-30px; width:110px; height:110px; border-radius:50%; background:radial-gradient(circle,rgba(56,102,99,0.25) 0%,transparent 70%); pointer-events:none; }
.af-quote-mark { font-family:'Playfair Display',serif; font-size:3rem; color:rgba(255,255,255,0.25); line-height:0.8; position:relative; z-index:1; align-self:flex-start; }
.af-quote-mark.close { align-self:flex-end; transform:scaleX(-1); margin-top:-8px; }
.af-affirmation-text { font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:400; font-style:italic; color:#fff; text-align:center; line-height:1.6; margin:4px 0; position:relative; z-index:1; letter-spacing:0.1px; }
.af-affirmation-loading { display:flex; align-items:center; gap:10px; color:rgba(255,255,255,0.75); font-size:14px; }

/* Shift banner */
.af-shift-banner { display:flex; align-items:center; justify-content:center; gap:6px; padding:9px 14px; border-radius:10px; background:var(--primary-container); color:var(--on-primary-container); border:1px solid rgba(76,102,43,0.18); font-size:13px; font-weight:500; }

/* Buttons */
.af-btn-row { display:flex; gap:10px; }
.af-btn-primary { flex:1; padding:12px 18px; border:none; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14.5px; font-weight:500; cursor:pointer; background:var(--primary); color:var(--on-primary); box-shadow:0 2px 10px rgba(76,102,43,0.2); transition:all 0.22s ease; display:flex; align-items:center; justify-content:center; gap:8px; }
.af-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 16px rgba(76,102,43,0.28); background:#3d5422; }
.af-btn-primary:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
.af-btn-teal { width:100%; padding:12px 18px; border:none; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14.5px; font-weight:500; cursor:pointer; background:var(--tertiary); color:#fff; box-shadow:0 2px 10px rgba(56,102,99,0.2); transition:all 0.22s ease; display:flex; align-items:center; justify-content:center; gap:8px; }
.af-btn-teal:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 16px rgba(56,102,99,0.28); background:#2d5452; }
.af-btn-teal:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
.af-btn-outline { padding:12px 16px; border:1.5px solid var(--outline-variant); border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14.5px; font-weight:500; cursor:pointer; background:var(--surface-container); color:var(--on-surface); transition:all 0.22s ease; }
.af-btn-outline:hover { border-color:var(--outline); background:var(--surface-container-high); }

/* Spinner */
@keyframes afSpin { to { transform:rotate(360deg); } }
.af-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:afSpin 0.7s linear infinite; flex-shrink:0; }
.af-spinner.dark { border-color:rgba(255,255,255,0.2); border-top-color:rgba(255,255,255,0.7); }

/* Done state */
.af-done { display:flex; flex-direction:column; align-items:center; padding:16px 0 4px; }
.af-done-icon { width:62px; height:62px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 18px rgba(76,102,43,0.28); }
.af-done-title { font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:400; color:var(--on-surface); margin:0 0 8px; }
.af-done-sub { font-size:14px; color:var(--outline); font-weight:300; margin:0 0 14px; line-height:1.5; text-align:center; }
.af-done-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:100px; background:var(--primary-container); color:var(--on-primary-container); font-size:12.5px; font-weight:500; }
.af-btn-restart {
  display:flex; align-items:center; justify-content:center; gap:7px;
  width:100%; margin-top:20px; padding:11px 22px; border-radius:12px;
  border:1.5px solid var(--outline-variant);
  background:var(--surface-container); color:var(--on-surface);
  font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
  cursor:pointer; transition:all 0.22s ease;
}
.af-btn-restart:hover { background:var(--surface-container-high); border-color:var(--outline); transform:translateY(-1px); box-shadow:0 2px 10px rgba(26,28,22,0.06); }

@media (max-width:480px) {
  .af-root { border-radius:16px; }
  .af-body { padding:18px 16px 22px; }
  .af-title { font-size:1.25rem; }
  .af-theme-grid { grid-template-columns:1fr 1fr; gap:6px; }
  .af-meter-bar { height:44px; }
  .af-meter-seg { border-radius:3px; }
}
`;
