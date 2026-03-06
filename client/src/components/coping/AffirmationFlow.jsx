import { useState } from "react";
import {
  generateAffirmation,
  saveAffirmationSession,
} from "../../features/affirmation/affirmation.api";

const themes = [
  { key: "self-worth", label: "Self Worth", icon: "🌱" },
  { key: "confidence", label: "Confidence", icon: "⚡" },
  { key: "anxiety-relief", label: "Anxiety Relief", icon: "🌊" },
  { key: "resilience", label: "Resilience", icon: "🪨" },
  { key: "motivation", label: "Motivation", icon: "🔥" },
  { key: "self-compassion", label: "Self Compassion", icon: "🤍" },
];

export default function AffirmationFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState("self-worth");
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [affirmation, setAffirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ── Original logic — unchanged ── */
  const feelingLabel = (v) => {
    if (v <= 3) return "Calm";
    if (v <= 6) return "Moderate";
    return "Overwhelmed";
  };

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

  const feelingEmoji = (v) => (v <= 3 ? "🌿" : v <= 6 ? "🌤" : "🔥");
  const feelingColors = (v) => ({
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
  const sliderBg = (v) =>
    v <= 3
      ? "linear-gradient(90deg,var(--primary),#B1D18A)"
      : v <= 6
        ? "linear-gradient(90deg,#92400E,#CA8A04)"
        : "linear-gradient(90deg,var(--error),#F87171)";
  const sliderColor = (v) =>
    v <= 3 ? "var(--primary)" : v <= 6 ? "#CA8A04" : "var(--error)";

  const totalSteps = 3;
  const stepNum = step === 1 ? 1 : step === 3 ? 2 : 3;

  if (saved) {
    return (
      <>
        <style>{afStyles}</style>
        <div className="af-root">
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
            <h3 className="af-done-title">Session Saved 🌟</h3>
            <p className="af-done-sub">
              Emotional intensity shifted by <strong>{before - after}</strong>{" "}
              points
            </p>
            {before > after && (
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
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{afStyles}</style>
      <div className="af-root">
        {/* Progress bar */}
        <div className="af-progress-bar">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`af-progress-seg${s <= stepNum ? " active" : ""}`}
            />
          ))}
        </div>

        {/* ════ STEP 1: Feeling + Theme ════ */}
        {step === 1 && (
          <div className="af-step af-in">
            <div className="af-step-header">
              <div className="af-step-num">Step 1 of {totalSteps}</div>
              <h2 className="af-title">How do you feel?</h2>
              <p className="af-subtitle">
                Rate your current state and choose a focus theme
              </p>
            </div>

            {/* Slider */}
            <div className="af-slider-display">
              <span className="af-slider-emoji">{feelingEmoji(before)}</span>
              <span className="af-slider-value">{before}</span>
            </div>
            <div className="af-feeling-badge-wrap">
              <span
                className="af-feeling-badge"
                style={{
                  background: feelingColors(before).bg,
                  color: feelingColors(before).text,
                }}
              >
                {before}/10 · {feelingLabel(before)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={before}
              onChange={(e) => setBefore(Number(e.target.value))}
              className="af-slider"
              style={{
                background: sliderBg(before),
                color: sliderColor(before),
              }}
            />
            <div className="af-slider-labels">
              <span>Calm</span>
              <span>Overwhelmed</span>
            </div>

            {/* Theme divider */}
            <div className="af-divider">
              <div className="af-divider-line" />
              <span className="af-divider-label">Choose a theme</span>
              <div className="af-divider-line" />
            </div>

            {/* Theme grid */}
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
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
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
                    <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
                    <path d="M12 8v8M8 12h8" />
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
            <div className="af-step-header">
              <div className="af-step-num">Step 2 of {totalSteps}</div>
              <h2 className="af-title">Your affirmation</h2>
              <p className="af-subtitle">Read this slowly and let it settle</p>
            </div>

            {/* Theme pill */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <span className="af-theme-pill">
                {themes.find((t) => t.key === theme)?.icon}{" "}
                {themes.find((t) => t.key === theme)?.label}
              </span>
            </div>

            {/* Affirmation card */}
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
            <div className="af-step-header">
              <div className="af-step-num">Step 3 of {totalSteps}</div>
              <h2 className="af-title">How do you feel now?</h2>
              <p className="af-subtitle">
                Rate your emotional state after the affirmation
              </p>
            </div>

            <div className="af-slider-display">
              <span className="af-slider-emoji">{feelingEmoji(after)}</span>
              <span className="af-slider-value">{after}</span>
            </div>
            <div className="af-feeling-badge-wrap">
              <span
                className="af-feeling-badge"
                style={{
                  background: feelingColors(after).bg,
                  color: feelingColors(after).text,
                }}
              >
                {after}/10 · {feelingLabel(after)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={after}
              onChange={(e) => setAfter(Number(e.target.value))}
              className="af-slider"
              style={{ background: sliderBg(after), color: sliderColor(after) }}
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
                {before - after} point{before - after > 1 ? "s" : ""} lower than
                before
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
    </>
  );
}

const afStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
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

  .af-root {
    font-family:'DM Sans',sans-serif;
    background:var(--surface-container-low);
    border:1.5px solid var(--outline-variant);
    border-radius:20px; max-width:480px; margin:0 auto;
    padding:26px 24px 28px; overflow:hidden; position:relative;
    box-shadow:0 1px 12px rgba(26,28,22,0.07),0 4px 24px rgba(26,28,22,0.04);
    color:var(--on-surface);
  }
  .af-root::before { content:''; position:absolute; top:-45px; right:-45px; width:140px; height:140px; border-radius:50%; background:radial-gradient(circle,rgba(76,102,43,0.07) 0%,transparent 70%); pointer-events:none; }

  .af-progress-bar { display:flex; gap:5px; margin-bottom:22px; }
  .af-progress-seg { flex:1; height:3px; border-radius:3px; background:var(--surface-container-highest); transition:background 0.5s ease; }
  .af-progress-seg.active { background:linear-gradient(90deg,var(--primary),var(--tertiary)); }

  .af-step { display:flex; flex-direction:column; gap:14px; }
  @keyframes afFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .af-in { animation:afFadeUp 0.38s ease-out both; }

  .af-step-header { margin-bottom:4px; }
  .af-step-num { font-size:11px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; color:var(--outline); margin-bottom:5px; }
  .af-title { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:400; color:var(--on-surface); margin:0 0 5px; letter-spacing:-0.2px; line-height:1.25; }
  .af-subtitle { font-size:13.5px; font-weight:300; color:var(--outline); margin:0; line-height:1.55; }

  /* Slider */
  .af-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:5px; outline:none; transition:background 0.3s; }
  .af-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:var(--background); box-shadow:0 1px 6px rgba(0,0,0,0.12),0 0 0 2.5px currentColor; cursor:pointer; }
  .af-slider::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:var(--background); box-shadow:0 1px 6px rgba(0,0,0,0.12),0 0 0 2.5px currentColor; cursor:pointer; border:none; }
  .af-slider-display { display:flex; align-items:baseline; justify-content:center; gap:10px; }
  .af-slider-emoji { font-size:38px; line-height:1; }
  .af-slider-value { font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:400; color:var(--on-surface); line-height:1; }
  .af-slider-labels { display:flex; justify-content:space-between; font-size:11.5px; color:var(--outline); font-weight:400; margin-top:-4px; }
  .af-feeling-badge-wrap { text-align:center; }
  .af-feeling-badge { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:100px; font-size:13px; font-weight:500; transition:all 0.3s ease; }

  /* Divider */
  .af-divider { display:flex; align-items:center; gap:10px; margin:4px 0; }
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
  .af-theme-icon { font-size:17px; line-height:1; flex-shrink:0; }
  .af-theme-label { flex:1; font-size:12.5px; }
  .af-theme-check { position:absolute; top:7px; right:8px; width:17px; height:17px; border-radius:50%; background:var(--primary); display:grid; place-items:center; }

  /* Affirmation card */
  .af-theme-pill { display:inline-flex; align-items:center; gap:6px; padding:5px 13px; border-radius:100px; background:var(--secondary-container); color:var(--on-secondary-container); font-size:12.5px; font-weight:500; }
  .af-affirmation-card {
    position:relative; padding:28px 24px; border-radius:16px;
    background:var(--primary); overflow:hidden; min-height:120px;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
  }
  .af-affirmation-card::before { content:''; position:absolute; top:-40px; right:-40px; width:150px; height:150px; border-radius:50%; background:radial-gradient(circle,rgba(177,209,138,0.2) 0%,transparent 70%); pointer-events:none; }
  .af-affirmation-card::after { content:''; position:absolute; bottom:-30px; left:-30px; width:110px; height:110px; border-radius:50%; background:radial-gradient(circle,rgba(56,102,99,0.25) 0%,transparent 70%); pointer-events:none; }
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

  /* Done */
  .af-done { text-align:center; padding:12px 0 4px; }
  .af-done-icon { width:62px; height:62px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 18px rgba(76,102,43,0.28); }
  .af-done-title { font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:400; color:var(--on-surface); margin:0 0 8px; }
  .af-done-sub { font-size:14px; color:var(--outline); font-weight:300; margin:0 0 14px; line-height:1.5; }
  .af-done-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:100px; background:var(--primary-container); color:var(--on-primary-container); font-size:12.5px; font-weight:500; }
`;
