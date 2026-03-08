import { useState } from "react";
import { createReframingSession } from "../../features/reframing/reframing.api";

/* ── Tension meter (shared design language) ── */
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
  const label = value <= 3 ? "Mild" : value <= 6 ? "Moderate" : "Strong";
  const labelColor =
    value <= 3 ? "#354E16" : value <= 6 ? "#78350F" : "#93000A";
  const labelBg = value <= 3 ? "#CDEDA3" : value <= 6 ? "#FEF3C7" : "#FFDAD6";
  return (
    <div className="rf-meter-wrap">
      <div className="rf-meter-bar">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="rf-meter-seg"
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
      <div className="rf-meter-meta">
        <span
          className="rf-meter-val"
          style={{ color: SEG_COLORS[Math.min(value - 1, 9)] }}
        >
          {value}
          <span className="rf-meter-denom">/10</span>
        </span>
        <span
          className="rf-meter-lbl"
          style={{ background: labelBg, color: labelColor }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function ReframingFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState("");
  const [thought, setThought] = useState("");
  const [emotionBefore, setEmotionBefore] = useState(5);
  const [reframed, setReframed] = useState("");
  const [emotionAfter, setEmotionAfter] = useState(5);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  /* ── Original logic — unchanged ── */
  const save = async () => {
    setLoading(true);
    await createReframingSession({
      sessionId,
      situation,
      automaticThought: thought,
      emotionBefore,
      reframedThought: reframed,
      emotionAfter,
    });
    setLoading(false);
    setDone(true);
    if (onComplete) onComplete();
  };
  /* ── End original logic ── */

  const sliderFill = (v) =>
    v <= 3 ? "#4C662B" : v <= 6 ? "#C5A000" : "#BA1A1A";
  const sliderBg = (v) =>
    `linear-gradient(90deg, ${sliderFill(v)} ${(((v - 1) / 9) * 100).toFixed(1)}%, var(--surface-container-highest) ${(((v - 1) / 9) * 100).toFixed(1)}%)`;

  const totalSteps = 5;
  const stepTitles = [
    "",
    "What happened?",
    "Your thought",
    "Emotion before",
    "Reframe it",
    "Emotion after",
  ];
  const stepSubtitles = [
    "",
    "Describe the situation that triggered this feeling",
    "What automatic thought came to mind?",
    "How intense was the emotion before reframing?",
    "What is a more balanced way to see this?",
    "How intense does the emotion feel now?",
  ];

  const reset = () => {
    setStep(1);
    setSituation("");
    setThought("");
    setEmotionBefore(5);
    setReframed("");
    setEmotionAfter(5);
    setDone(false);
  };

  if (done) {
    const diff = emotionBefore - emotionAfter;
    return (
      <>
        <style>{rfStyles}</style>
        <div className="rf-root">
          <div className="rf-done">
            <div className="rf-done-icon">
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
            <h3 className="rf-done-title">Reframing saved</h3>
            <p className="rf-done-sub">
              Emotional intensity reduced by <strong>{diff}</strong> points
            </p>
            {diff > 0 && (
              <div className="rf-done-chip">
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
                {emotionBefore} → {emotionAfter} intensity
              </div>
            )}
            <button className="rf-btn-restart" onClick={reset}>
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
      </>
    );
  }

  return (
    <>
      <style>{rfStyles}</style>
      <div className="rf-root">
        {/* ── Card header ── */}
        <div className="rf-hdr">
          <div className="rf-hdr-l">
            <div className="rf-hdr-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="rf-hdr-title">Cognitive Reframing</span>
          </div>
          <div className="rf-hdr-badge">
            Step {step} of {totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="rf-pbar">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`rf-pseg${s <= step ? " on" : ""}`} />
          ))}
        </div>

        {/* Step header */}
        <div className="rf-body">
          <div className="rf-step-header">
            <h2 className="rf-title">{stepTitles[step]}</h2>
            <p className="rf-subtitle">{stepSubtitles[step]}</p>
          </div>

          {/* ── Step 1: Situation ── */}
          {step === 1 && (
            <div className="rf-step rf-in">
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="e.g. My presentation didn't go as planned…"
                className="rf-textarea"
                rows={4}
              />
              <button
                onClick={() => setStep(2)}
                disabled={!situation.trim()}
                className="rf-btn-primary"
              >
                Continue
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
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* ── Step 2: Automatic thought ── */}
          {step === 2 && (
            <div className="rf-step rf-in">
              {situation && (
                <div className="rf-context-card">
                  <div className="rf-context-label">Situation</div>
                  <p className="rf-context-text">{situation}</p>
                </div>
              )}
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="e.g. I always mess things up…"
                className="rf-textarea"
                rows={4}
                autoFocus
              />
              <div className="rf-btn-row">
                <button onClick={() => setStep(1)} className="rf-btn-outline">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!thought.trim()}
                  className="rf-btn-primary"
                >
                  Continue
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
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Emotion before ── */}
          {step === 3 && (
            <div className="rf-step rf-in">
              <TensionMeter value={emotionBefore} />
              <input
                type="range"
                min="1"
                max="10"
                value={emotionBefore}
                onChange={(e) => setEmotionBefore(Number(e.target.value))}
                className="rf-slider"
                style={{ background: sliderBg(emotionBefore) }}
              />
              <div className="rf-slider-labels">
                <span>Calm</span>
                <span>Overwhelming</span>
              </div>
              <div className="rf-btn-row">
                <button onClick={() => setStep(2)} className="rf-btn-outline">
                  Back
                </button>
                <button onClick={() => setStep(4)} className="rf-btn-primary">
                  Continue
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
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Reframed thought ── */}
          {step === 4 && (
            <div className="rf-step rf-in">
              <div className="rf-context-card tertiary">
                <div className="rf-context-label">Your thought</div>
                <p className="rf-context-text">{thought}</p>
              </div>
              <div className="rf-reframe-hint">
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                Try starting with "Maybe…", "It's possible that…", or "I can…"
              </div>
              <textarea
                value={reframed}
                onChange={(e) => setReframed(e.target.value)}
                placeholder="e.g. This was one presentation. I can learn from it…"
                className="rf-textarea"
                rows={4}
                autoFocus
              />
              <div className="rf-btn-row">
                <button onClick={() => setStep(3)} className="rf-btn-outline">
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  disabled={!reframed.trim()}
                  className="rf-btn-teal"
                >
                  Continue
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
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5: Emotion after ── */}
          {step === 5 && (
            <div className="rf-step rf-in">
              <TensionMeter value={emotionAfter} />
              <input
                type="range"
                min="1"
                max="10"
                value={emotionAfter}
                onChange={(e) => setEmotionAfter(Number(e.target.value))}
                className="rf-slider"
                style={{ background: sliderBg(emotionAfter) }}
              />
              <div className="rf-slider-labels">
                <span>Calm</span>
                <span>Overwhelming</span>
              </div>
              {emotionBefore > emotionAfter && (
                <div className="rf-shift-banner">
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
                  {emotionBefore - emotionAfter} point
                  {emotionBefore - emotionAfter > 1 ? "s" : ""} lower than
                  before
                </div>
              )}
              <div className="rf-btn-row">
                <button onClick={() => setStep(4)} className="rf-btn-outline">
                  Back
                </button>
                <button
                  onClick={save}
                  disabled={loading}
                  className="rf-btn-teal"
                >
                  {loading ? (
                    <>
                      <span className="rf-spinner" />
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

const rfStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --primary: #4C662B; --primary-container: #CDEDA3; --on-primary: #FFFFFF; --on-primary-container: #354E16;
  --secondary: #586249; --secondary-container: #DCE7C8; --on-secondary-container: #404A33;
  --tertiary: #386663; --tertiary-container: #BCECE7; --on-tertiary-container: #1F4E4B;
  --error: #BA1A1A; --error-container: #FFDAD6; --on-error-container: #93000A;
  --background: #F9FAEF; --on-surface: #1A1C16; --on-surface-variant: #44483D;
  --outline: #75796C; --outline-variant: #C5C8BA;
  --surface-container-low: #F3F4E9; --surface-container: #EEEFE3;
  --surface-container-high: #E8E9DE; --surface-container-highest: #E2E3D8;
}

/* ── CARD SHELL ── */
.rf-root {
  font-family: 'DM Sans', sans-serif;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: 20px;
  max-width: 480px; margin: 0 auto;
  overflow: hidden; position: relative;
  box-shadow: 0 1px 12px rgba(26,28,22,0.07);
  color: var(--on-surface);
}
.rf-root::before {
  content: ''; position: absolute;
  top: -48px; right: -48px; width: 150px; height: 150px; border-radius: 50%;
  background: radial-gradient(circle, rgba(56,102,99,0.07) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}

/* ── HEADER ── */
.rf-hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--outline-variant);
  background: var(--surface-container);
  position: relative; z-index: 1;
}
.rf-hdr-l { display: flex; align-items: center; gap: 10px; }
.rf-hdr-ic {
  width: 30px; height: 30px; border-radius: 9px;
  background: var(--secondary-container); color: var(--on-secondary-container);
  display: grid; place-items: center; flex-shrink: 0;
}
.rf-hdr-ic svg { width: 14px; height: 14px; }
.rf-hdr-title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem; font-weight: 400;
  color: var(--on-surface); letter-spacing: -0.1px;
}
.rf-hdr-badge {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 100px;
  background: var(--surface-container-highest);
  border: 1px solid var(--outline-variant);
  font-size: 11px; font-weight: 500; color: var(--outline);
}

/* ── PROGRESS BAR ── */
.rf-pbar {
  display: flex; gap: 4px; padding: 10px 18px;
  background: var(--surface-container);
  border-bottom: 1px solid var(--outline-variant);
  position: relative; z-index: 1;
}
.rf-pseg {
  flex: 1; height: 3px; border-radius: 3px;
  background: var(--surface-container-highest);
  transition: background 0.5s ease;
}
.rf-pseg.on { background: linear-gradient(90deg, var(--primary), var(--tertiary)); }

/* ── BODY ── */
.rf-body { padding: 22px 20px 26px; position: relative; z-index: 1; }

/* Step header */
.rf-step-header { margin-bottom: 20px; }
.rf-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 400; color: var(--on-surface); margin: 0 0 5px; letter-spacing: -0.2px; line-height: 1.25; }
.rf-subtitle { font-size: 13.5px; font-weight: 300; color: var(--outline); margin: 0; line-height: 1.55; }

/* Step content */
.rf-step { display: flex; flex-direction: column; gap: 14px; }
@keyframes rfFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.rf-in { animation: rfFadeUp 0.38s ease-out both; }

/* Textarea */
.rf-textarea {
  width: 100%; padding: 12px 14px; border-radius: 12px;
  border: 1.5px solid var(--outline-variant);
  background: var(--background); color: var(--on-surface);
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
  resize: vertical; outline: none; line-height: 1.6;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.rf-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(76,102,43,0.1); }
.rf-textarea::placeholder { color: var(--outline); opacity: 0.7; }

/* Context cards */
.rf-context-card {
  padding: 12px 14px; border-radius: 12px;
  background: var(--primary-container);
  border: 1px solid rgba(76,102,43,0.18);
}
.rf-context-card.tertiary { background: var(--tertiary-container); border-color: rgba(56,102,99,0.18); }
.rf-context-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--on-primary-container); opacity: 0.7; margin-bottom: 4px; }
.rf-context-card.tertiary .rf-context-label { color: var(--on-tertiary-container); }
.rf-context-text { font-size: 13.5px; color: var(--on-primary-container); margin: 0; line-height: 1.5; font-weight: 400; }
.rf-context-card.tertiary .rf-context-text { color: var(--on-tertiary-container); }

/* Hint */
.rf-reframe-hint {
  display: flex; align-items: flex-start; gap: 7px;
  padding: 10px 13px; border-radius: 10px;
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  font-size: 12.5px; color: var(--on-surface-variant); line-height: 1.5;
}
.rf-reframe-hint svg { flex-shrink: 0; margin-top: 1px; }

/* ── TENSION METER ── */
.rf-meter-wrap {
  display: flex; flex-direction: column; gap: 12px;
  width: 100%; padding: 16px; border-radius: 14px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
}
.rf-meter-bar { display: flex; align-items: flex-end; gap: 4px; height: 56px; }
.rf-meter-seg { flex: 1; border-radius: 4px; transform-origin: bottom; }
.rf-meter-meta { display: flex; align-items: center; justify-content: space-between; }
.rf-meter-val {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem; font-weight: 400; line-height: 1;
  transition: color 0.3s ease;
}
.rf-meter-denom { font-size: 0.95rem; opacity: 0.5; margin-left: 1px; font-family: 'DM Sans', sans-serif; font-weight: 300; }
.rf-meter-lbl {
  display: inline-flex; padding: 4px 12px; border-radius: 100px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

/* Slider */
.rf-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 5px; border-radius: 5px; outline: none; cursor: pointer; transition: background 0.3s; }
.rf-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: white; box-shadow: 0 1px 6px rgba(0,0,0,0.14), 0 0 0 2.5px var(--primary); cursor: pointer; transition: box-shadow 0.2s, transform 0.15s; }
.rf-slider::-webkit-slider-thumb:hover { transform: scale(1.1); box-shadow: 0 1px 8px rgba(0,0,0,0.2), 0 0 0 3.5px var(--primary); }
.rf-slider-labels { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--outline); font-weight: 300; }

/* Shift banner */
.rf-shift-banner {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 9px 14px; border-radius: 10px;
  background: var(--primary-container); color: var(--on-primary-container);
  border: 1px solid rgba(76,102,43,0.18);
  font-size: 13px; font-weight: 500;
}

/* Buttons */
.rf-btn-row { display: flex; gap: 10px; }
.rf-btn-primary {
  flex: 1; padding: 12px 18px; border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif; font-size: 14.5px; font-weight: 500;
  cursor: pointer; background: var(--primary); color: var(--on-primary);
  box-shadow: 0 2px 10px rgba(76,102,43,0.2);
  transition: all 0.22s ease;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.rf-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(76,102,43,0.28); background: #3d5422; }
.rf-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

.rf-btn-teal {
  flex: 1; padding: 12px 18px; border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif; font-size: 14.5px; font-weight: 500;
  cursor: pointer; background: var(--tertiary); color: #fff;
  box-shadow: 0 2px 10px rgba(56,102,99,0.2);
  transition: all 0.22s ease;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.rf-btn-teal:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(56,102,99,0.28); background: #2d5452; }
.rf-btn-teal:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

.rf-btn-outline {
  padding: 12px 16px; border: 1.5px solid var(--outline-variant); border-radius: 12px;
  font-family: 'DM Sans', sans-serif; font-size: 14.5px; font-weight: 500;
  cursor: pointer; background: var(--surface-container); color: var(--on-surface);
  transition: all 0.22s ease;
}
.rf-btn-outline:hover { border-color: var(--outline); background: var(--surface-container-high); }

/* Spinner */
@keyframes rfSpin { to { transform: rotate(360deg); } }
.rf-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: rfSpin 0.7s linear infinite; }

/* Done state */
.rf-done { display: flex; flex-direction: column; align-items: center; padding: 20px 0 8px; }
.rf-done-icon { width: 62px; height: 62px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 4px 18px rgba(76,102,43,0.28); }
.rf-done-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 400; color: var(--on-surface); margin: 0 0 8px; }
.rf-done-sub { font-size: 14px; color: var(--outline); font-weight: 300; margin: 0 0 14px; line-height: 1.5; }
.rf-done-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 100px; background: var(--primary-container); color: var(--on-primary-container); font-size: 12.5px; font-weight: 500; }
.rf-btn-restart {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  margin-top: 20px; padding: 11px 22px; border-radius: 12px;
  border: 1.5px solid var(--outline-variant);
  background: var(--surface-container); color: var(--on-surface);
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all 0.22s ease;
}
.rf-btn-restart:hover { background: var(--surface-container-high); border-color: var(--outline); transform: translateY(-1px); box-shadow: 0 2px 10px rgba(26,28,22,0.06); }

/* Responsive */
@media (max-width: 480px) {
  .rf-root { border-radius: 16px; }
  .rf-body { padding: 18px 16px 22px; }
  .rf-title { font-size: 1.25rem; }
  .rf-meter-bar { height: 44px; }
  .rf-meter-seg { border-radius: 3px; }
}
`;
