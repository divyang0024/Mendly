import { useState, useEffect, useRef } from "react";
import { completeGroundingSession } from "../../features/grounding/grounding.api";

/* ── SVG icon set — one per sense ── */
const SenseIcon = ({ sense, size = 22, color = "currentColor" }) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (sense === "sight")
    return (
      <svg {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  if (sense === "touch")
    return (
      <svg {...props}>
        <path d="M18 11V6a2 2 0 0 0-4 0v5" />
        <path d="M14 10V4a2 2 0 0 0-4 0v6" />
        <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
        <path d="M6 14a4 4 0 0 0 4 4h4a6 6 0 0 0 6-6v-1a2 2 0 0 0-4 0" />
      </svg>
    );
  if (sense === "hearing")
    return (
      <svg {...props}>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    );
  if (sense === "smell")
    return (
      <svg {...props}>
        <path d="M8 3c0 0 2 2 2 5s-2 5-2 5" />
        <path d="M12 2c0 0 2 3 2 7s-2 7-2 7" />
        <path d="M16 3c0 0 2 2 2 5s-2 5-2 5" />
        <path d="M5 18h14a2 2 0 0 1 0 4H5a2 2 0 0 1 0-4z" />
      </svg>
    );
  if (sense === "taste")
    return (
      <svg {...props}>
        <path d="M12 2a5 5 0 0 1 5 5c0 5-5 11-5 11S7 12 7 7a5 5 0 0 1 5-5z" />
        <circle cx="12" cy="7" r="1.5" fill={color} stroke="none" />
      </svg>
    );
  return null;
};

/* Feeling state icons */
const FeelingIcon = ({ level, size = 20 }) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (level === "calm")
    return (
      <svg {...props} stroke="#4C662B">
        <path d="M12 22V12" />
        <path d="M12 12C12 7 7 4 4 6" />
        <path d="M12 12c0-5 5-8 8-6" />
        <path d="M12 12c-4 0-7 3-6 7" />
        <path d="M12 12c4 0 7 3 6 7" />
      </svg>
    );
  if (level === "tension")
    return (
      <svg {...props} stroke="#A16207">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
      </svg>
    );
  return (
    <svg {...props} stroke="#BA1A1A">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
    </svg>
  );
};

const steps = [
  { key: "seen", label: "Name 5 things you can SEE", count: 5, sense: "sight" },
  {
    key: "felt",
    label: "Name 4 things you can FEEL",
    count: 4,
    sense: "touch",
  },
  {
    key: "heard",
    label: "Name 3 things you can HEAR",
    count: 3,
    sense: "hearing",
  },
  {
    key: "smelled",
    label: "Name 2 things you can SMELL",
    count: 2,
    sense: "smell",
  },
  {
    key: "tasted",
    label: "Name 1 thing you can TASTE",
    count: 1,
    sense: "taste",
  },
];

/* Brand-token sense color map */
const senseColors = {
  sight: {
    bg: "rgba(76,102,43,0.08)",
    ring: "#4C662B",
    accent: "#354E16",
    glow: "rgba(76,102,43,0.18)",
    chip: "#CDEDA3",
    chipText: "#354E16",
  },
  touch: {
    bg: "rgba(88,98,73,0.08)",
    ring: "#586249",
    accent: "#404A33",
    glow: "rgba(88,98,73,0.18)",
    chip: "#DCE7C8",
    chipText: "#404A33",
  },
  hearing: {
    bg: "rgba(56,102,99,0.08)",
    ring: "#386663",
    accent: "#1F4E4B",
    glow: "rgba(56,102,99,0.18)",
    chip: "#BCECE7",
    chipText: "#1F4E4B",
  },
  smell: {
    bg: "rgba(76,102,43,0.06)",
    ring: "#B1D18A",
    accent: "#4C662B",
    glow: "rgba(177,209,138,0.2)",
    chip: "#CDEDA3",
    chipText: "#354E16",
  },
  taste: {
    bg: "rgba(56,102,99,0.06)",
    ring: "#BCECE7",
    accent: "#386663",
    glow: "rgba(56,102,99,0.15)",
    chip: "#BCECE7",
    chipText: "#1F4E4B",
  },
};

/* ── Floating ambient orbs ── */
function FloatingOrbs({ phase }) {
  const palettes = {
    before: [
      "rgba(76,102,43,0.14)",
      "rgba(88,98,73,0.11)",
      "rgba(56,102,99,0.1)",
      "rgba(177,209,138,0.09)",
    ],
    after: [
      "rgba(56,102,99,0.14)",
      "rgba(76,102,43,0.12)",
      "rgba(177,209,138,0.11)",
      "rgba(88,98,73,0.08)",
    ],
    active: [
      "rgba(76,102,43,0.11)",
      "rgba(56,102,99,0.11)",
      "rgba(88,98,73,0.09)",
      "rgba(177,209,138,0.08)",
    ],
  };
  const colors = palettes[phase] || palettes.active;
  return (
    <div className="gf-orbs">
      {colors.map((c, i) => (
        <div
          key={i}
          className={`gf-orb gf-orb-${i}`}
          style={{
            background: `radial-gradient(circle, ${c}, transparent 70%)`,
            width: 110 + i * 40,
            height: 110 + i * 40,
            top: `${10 + i * 17}%`,
            left: `${6 + i * 21}%`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Tension meter — 10 segmented blocks ── */
const SEGMENT_COLORS = [
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
    <div className="gf-meter-wrap">
      <div className="gf-meter-bar">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="gf-meter-seg"
            style={{
              background:
                i < value
                  ? SEGMENT_COLORS[i]
                  : "var(--surface-container-highest)",
              transform: i < value ? "scaleY(1)" : "scaleY(0.55)",
              opacity: i < value ? 1 : 0.4,
              height: i < value ? 28 + (i / 9) * 20 : 24,
              transition: `all 0.25s cubic-bezier(.4,0,.2,1) ${i * 0.02}s`,
            }}
          />
        ))}
      </div>
      <div className="gf-meter-meta">
        <span
          className="gf-meter-val"
          style={{ color: SEGMENT_COLORS[Math.min(value - 1, 9)] }}
        >
          {value}
          <span className="gf-meter-denom">/10</span>
        </span>
        <span
          className="gf-meter-lbl"
          style={{ background: labelBg, color: labelColor }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ── Progress arc (per-step item count) ── */
function ProgressArc({ current, total, color }) {
  const r = 18,
    circ = 2 * Math.PI * r,
    pct = total > 0 ? current / total : 0;
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="var(--outline-variant)"
        strokeWidth="3"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

/* ── Response chip ── */
function Chip({ text, sc, index }) {
  return (
    <span
      className="gf-chip"
      style={{
        background: sc.chip,
        border: `1px solid ${sc.ring}30`,
        color: sc.chipText,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <span className="gf-chip-dot" style={{ background: sc.accent }} />
      {text}
    </span>
  );
}

/* ── Feeling level helpers ── */
const fLevel = (v) => (v <= 3 ? "calm" : v <= 6 ? "tension" : "high");
const fText = (v) =>
  v <= 3
    ? "Body feels calm"
    : v <= 6
      ? "Some tension present"
      : "High stress / activation";
const fColor = (v) =>
  v <= 3 ? "var(--primary)" : v <= 6 ? "#A16207" : "var(--error)";
const fBg = (v) =>
  v <= 3
    ? "var(--primary-container)"
    : v <= 6
      ? "#FEF3C7"
      : "var(--error-container)";
const fTxt = (v) =>
  v <= 3
    ? "var(--on-primary-container)"
    : v <= 6
      ? "#78350F"
      : "var(--on-error-container)";
const fFill = (v) => (v <= 3 ? "#4C662B" : v <= 6 ? "#C5A000" : "#BA1A1A");
const fSlider = (v) =>
  v <= 3
    ? `linear-gradient(90deg, var(--primary) var(--t,44%), var(--surface-container-highest) var(--t,44%))`
    : v <= 6
      ? `linear-gradient(90deg, #A16207 var(--t,44%), var(--surface-container-highest) var(--t,44%))`
      : `linear-gradient(90deg, var(--error) var(--t,44%), var(--surface-container-highest) var(--t,44%))`;

/* ── Reusable slider block ── */
function SliderBlock({ value, onChange }) {
  return (
    <div className="gf-slider-wrap">
      <TensionMeter value={value} />
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="gf-sl"
        style={{
          "--t": `${((value - 1) / 9) * 100}%`,
          "--f": fFill(value),
          background: fSlider(value),
        }}
      />
      <div className="gf-sllbl">
        <span>Calm</span>
        <span>Overwhelmed</span>
      </div>
    </div>
  );
}

export default function GroundingFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(-1);
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [responses, setResponses] = useState({
    seen: [],
    felt: [],
    heard: [],
    smelled: [],
    tasted: [],
  });
  const [input, setInput] = useState("");
  const [fadeKey, setFadeKey] = useState(0);
  const inputRef = useRef(null);

  const current = steps[step] || null;
  const sc = current ? senseColors[current.sense] : null;

  useEffect(() => {
    setFadeKey((k) => k + 1);
  }, [step]);
  useEffect(() => {
    if (current && inputRef.current) inputRef.current.focus();
  }, [step]);

  /* ── Original logic — unchanged ── */
  const addItem = () => {
    if (!input.trim() || !current) return;
    setResponses((prev) => ({
      ...prev,
      [current.key]: [...prev[current.key], input],
    }));
    setInput("");
  };
  const nextStep = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else setStep(steps.length);
  };
  const saveSession = async () => {
    await completeGroundingSession({
      sessionId,
      intensityBefore: before,
      intensityAfter: after,
      ...responses,
    });
    if (onComplete) onComplete();
    setStep(steps.length + 1);
  };
  /* ── End original logic ── */

  const doneSenses = steps.reduce((a, s) => a + responses[s.key].length, 0);
  const phase =
    step === -1 ? "before" : step > steps.length - 1 ? "after" : "active";
  const pStep = step < 0 ? 0 : step >= steps.length ? steps.length : step + 1;

  return (
    <>
      <style>{S}</style>
      <div className="gf-card">
        <div className="gf-blob" />
        <FloatingOrbs phase={phase} />

        {/* ── Card header — matches sibling card anatomy ── */}
        <div className="gf-hdr">
          <div className="gf-hdr-l">
            <div className="gf-hdr-ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22V12" />
                <path d="M12 12C12 7 7 4 4 6" />
                <path d="M12 12c0-5 5-8 8-6" />
                <path d="M12 12c-4 0-7 3-6 7" />
                <path d="M12 12c4 0 7 3 6 7" />
              </svg>
            </div>
            <span className="gf-hdr-title">5 · 4 · 3 · 2 · 1 Grounding</span>
          </div>
          {step >= 0 && step < steps.length && (
            <div className="gf-hdr-badge">
              {pStep} of {steps.length}
            </div>
          )}
          {step === -1 && <div className="gf-hdr-badge">Ready</div>}
          {step >= steps.length && <div className="gf-hdr-badge">Done</div>}
        </div>

        {/* Progress bar — shown during sensory steps */}
        {step >= 0 && step < steps.length && (
          <div className="gf-pbar">
            {steps.map((s, i) => (
              <div
                key={s.key}
                className={`gf-pseg${i < step ? " done" : i === step ? " on" : ""}`}
              />
            ))}
          </div>
        )}

        {/* ── Animated content area ── */}
        <div key={fadeKey} className="gf-body gf-fade">
          {/* ════ BEFORE ════ */}
          {step === -1 && (
            <div className="gf-section">
              <div className="gf-before-hdr">
                <div className="gf-before-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22V12" />
                    <path d="M12 12C12 7 7 4 4 6" />
                    <path d="M12 12c0-5 5-8 8-6" />
                    <path d="M12 12c-4 0-7 3-6 7" />
                    <path d="M12 12c4 0 7 3 6 7" />
                  </svg>
                </div>
                <div>
                  <div className="gf-step-ey">
                    <span className="gf-ey-dot" />
                    <p>Before we start</p>
                  </div>
                  <h2 className="gf-title" style={{ marginTop: 6 }}>
                    Current stress level
                  </h2>
                  <p className="gf-sub" style={{ marginTop: 4 }}>
                    Drag to set — we'll compare after grounding.
                  </p>
                </div>
              </div>
              <SliderBlock value={before} onChange={setBefore} />
              <button className="gf-btn-p" onClick={() => setStep(0)}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Begin Grounding
              </button>
            </div>
          )}

          {/* ════ SENSORY STEPS ════ */}
          {current && step >= 0 && step < steps.length && (
            <div className="gf-section">
              {/* Sense icon + header */}
              <div className="gf-sense-hdr">
                <div
                  className="gf-sense-ic"
                  style={{
                    background: sc.bg,
                    border: `1.5px solid ${sc.ring}35`,
                    color: sc.ring,
                  }}
                >
                  <SenseIcon
                    sense={current.sense}
                    size={24}
                    color={sc.accent}
                  />
                </div>
                <div className="gf-sense-meta">
                  <p className="gf-sense-label" style={{ color: sc.accent }}>
                    {current.label}
                  </p>
                  <span className="gf-sense-sub">
                    {responses[current.key].length} of {current.count} added
                  </span>
                </div>
                <ProgressArc
                  current={responses[current.key].length}
                  total={current.count}
                  color={sc.ring}
                />
              </div>

              {/* Step pills */}
              <div className="gf-steps-pills">
                {steps.map((s, i) => (
                  <div
                    key={s.key}
                    className="gf-step-pill"
                    style={{
                      width: i === step ? 28 : 8,
                      height: 8,
                      borderRadius: 999,
                      background:
                        i < step
                          ? sc.accent
                          : i === step
                            ? sc.ring
                            : "var(--outline-variant)",
                      opacity: i <= step ? 1 : 0.45,
                      transition: "all 0.4s ease",
                    }}
                  />
                ))}
              </div>

              {/* Input row */}
              <div className="gf-input-row">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem();
                  }}
                  placeholder="Type and press Enter or Add…"
                  className="gf-input"
                  style={{ "--focus-color": sc.ring }}
                />
                <button
                  onClick={addItem}
                  disabled={!input.trim()}
                  className="gf-add-btn"
                  style={{
                    background: input.trim()
                      ? sc.ring
                      : "var(--surface-container-highest)",
                    color: input.trim() ? "#fff" : "var(--outline)",
                  }}
                >
                  Add
                </button>
              </div>

              {/* Response chips */}
              <div className="gf-chips-row">
                {responses[current.key].map((r, i) => (
                  <Chip key={i} text={r} sc={sc} index={i} />
                ))}
                {responses[current.key].length < current.count &&
                  Array.from({
                    length: current.count - responses[current.key].length,
                  }).map((_, i) => (
                    <span key={`empty-${i}`} className="gf-chip-empty" />
                  ))}
              </div>

              {/* Next — appears when quota met */}
              {responses[current.key].length >= current.count && (
                <button
                  className="gf-btn-sense gf-fade"
                  onClick={nextStep}
                  style={{
                    background: sc.ring,
                    boxShadow: `0 3px 14px ${sc.glow}`,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  {step < steps.length - 1 ? "Next Sense" : "Finish Grounding"}
                </button>
              )}
            </div>
          )}

          {/* ════ AFTER ════ */}
          {step === steps.length && (
            <div className="gf-section">
              {/* Summary stat */}
              <div className="gf-stat-block">
                <span className="gf-stat-label">You noticed</span>
                <span className="gf-stat-num">{doneSenses}</span>
                <span className="gf-stat-label">things around you</span>
              </div>

              <h2 className="gf-title" style={{ textAlign: "center" }}>
                How do you feel now?
              </h2>
              <p className="gf-sub" style={{ textAlign: "center" }}>
                Rate your stress level after the session.
              </p>

              <SliderBlock value={after} onChange={setAfter} />

              {before > after && (
                <div className="gf-diff-badge">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: 13, height: 13 }}
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                  Intensity dropped by {before - after} — nice work
                </div>
              )}

              <button className="gf-btn-t" onClick={saveSession}>
                <svg
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
              </button>
            </div>
          )}

          {/* ════ COMPLETE ════ */}
          {step > steps.length && (
            <div className="gf-section gf-complete">
              <div className="gf-done">
                <svg viewBox="0 0 28 28" fill="none">
                  <path
                    d="M7 14.5L12 19.5L21 9.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="gf-title" style={{ textAlign: "center" }}>
                Session Complete
              </h2>
              <p
                className="gf-sub"
                style={{ textAlign: "center", marginBottom: 18 }}
              >
                You successfully grounded yourself in the present moment.
              </p>
              <div className="gf-complete-chips">
                <div className="gf-chip-stat">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ width: 12, height: 12 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {doneSenses} observations
                </div>
                <div className={`gf-chip-stat${before > after ? " pos" : ""}`}>
                  {before > after ? "↓ " : before < after ? "↑ " : "— "}
                  Stress: {before}→{after}
                </div>
              </div>
              {before > after && (
                <div className="gf-insight">
                  <div className="gf-insight-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22V12" />
                      <path d="M12 12C12 7 7 4 4 6" />
                      <path d="M12 12c0-5 5-8 8-6" />
                      <path d="M12 12c-4 0-7 3-6 7" />
                      <path d="M12 12c4 0 7 3 6 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="gf-ins-h">Stress reduced</div>
                    <p className="gf-ins-t">
                      Dropped {before - after} point
                      {before - after > 1 ? "s" : ""}. Regular grounding builds
                      resilience over time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   DESIGN SYSTEM — Material Design 3 · Light · Brand Palette
   Fonts: Playfair Display (titles) · DM Sans (body)
   ───────────────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --primary:                  #4C662B;
  --primary-container:        #CDEDA3;
  --on-primary:               #FFFFFF;
  --on-primary-container:     #354E16;
  --secondary:                #586249;
  --secondary-container:      #DCE7C8;
  --on-secondary-container:   #404A33;
  --tertiary:                 #386663;
  --tertiary-container:       #BCECE7;
  --on-tertiary-container:    #1F4E4B;
  --error:                    #BA1A1A;
  --error-container:          #FFDAD6;
  --on-error-container:       #93000A;
  --on-surface:               #1A1C16;
  --on-surface-variant:       #44483D;
  --outline:                  #75796C;
  --outline-variant:          #C5C8BA;
  --surface-container-low:    #F3F4E9;
  --surface-container:        #EEEFE3;
  --surface-container-high:   #E8E9DE;
  --surface-container-highest:#E2E3D8;
  --inverse-primary:          #B1D18A;
  --background:               #F9FAEF;
}

/* ── CARD SHELL ── */
.gf-card {
  font-family: 'DM Sans', sans-serif;
  background: var(--surface-container-low);
  border: 1.5px solid var(--outline-variant);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 12px rgba(26,28,22,0.07);
  color: var(--on-surface);
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
}

/* Decorative top-right orb */
.gf-blob {
  position: absolute;
  top: -48px; right: -48px;
  width: 150px; height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(76,102,43,0.07) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ── FLOATING ORBS ── */
.gf-orbs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 20px;
  pointer-events: none;
  z-index: 0;
}
.gf-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(38px);
}
@keyframes gfOrb0 { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(26px,-16px) scale(1.12)} }
@keyframes gfOrb1 { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(-20px,20px) scale(1.08)} }
@keyframes gfOrb2 { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(16px,26px) scale(1.15)} }
@keyframes gfOrb3 { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(-24px,-10px) scale(1.05)} }
.gf-orb-0 { animation: gfOrb0 8s ease-in-out infinite; }
.gf-orb-1 { animation: gfOrb1 10s ease-in-out infinite; }
.gf-orb-2 { animation: gfOrb2 12s ease-in-out infinite; }
.gf-orb-3 { animation: gfOrb3 9s ease-in-out infinite; }

/* ── HEADER — identical anatomy to sibling cards ── */
.gf-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--outline-variant);
  background: var(--surface-container);
  position: relative;
  z-index: 1;
}
.gf-hdr-l {
  display: flex;
  align-items: center;
  gap: 10px;
}
.gf-hdr-ic {
  width: 30px; height: 30px;
  border-radius: 9px;
  background: var(--secondary-container);
  color: var(--on-secondary-container);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.gf-hdr-ic svg { width: 14px; height: 14px; }
.gf-hdr-title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 400;
  color: var(--on-surface);
  letter-spacing: -0.1px;
}
.gf-hdr-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 100px;
  background: var(--surface-container-highest);
  border: 1px solid var(--outline-variant);
  font-size: 11px;
  font-weight: 500;
  color: var(--outline);
  white-space: nowrap;
}

/* ── PROGRESS BAR ── */
.gf-pbar {
  display: flex;
  gap: 4px;
  padding: 10px 18px;
  background: var(--surface-container);
  border-bottom: 1px solid var(--outline-variant);
  position: relative;
  z-index: 1;
}
.gf-pseg {
  flex: 1;
  height: 3px;
  border-radius: 3px;
  background: var(--surface-container-highest);
  transition: background 0.5s ease;
}
.gf-pseg.done { background: var(--primary); }
.gf-pseg.on   { background: linear-gradient(90deg, var(--primary), var(--tertiary)); }

/* ── BODY ── */
.gf-body {
  padding: 22px 20px 26px;
  position: relative;
  z-index: 1;
}
@keyframes gfFade { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
.gf-fade { animation: gfFade 0.38s ease-out both; }

/* ── SECTION (shared vertical flow) ── */
.gf-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── EYEBROW (before step) ── */
.gf-step-ey {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--primary-container);
  border: 1px solid rgba(76,102,43,0.22);
  border-radius: 100px;
  padding: 4px 12px 4px 9px;
  width: fit-content;
}
.gf-ey-dot {
  width: 6px; height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: gfPulse 2.2s ease-in-out infinite;
  flex-shrink: 0;
}
.gf-step-ey p {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--on-primary-container);
  margin: 0;
}
@keyframes gfPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

/* ── TYPOGRAPHY ── */
.gf-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.45rem;
  font-weight: 400;
  color: var(--on-surface);
  letter-spacing: -0.3px;
  line-height: 1.25;
  margin: 0;
}
.gf-sub {
  font-size: 13px;
  font-weight: 300;
  color: var(--outline);
  line-height: 1.65;
  margin: 0;
}

/* ── TENSION METER ── */
.gf-meter-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
}
.gf-meter-bar {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 56px;
}
.gf-meter-seg {
  flex: 1;
  border-radius: 4px;
  transform-origin: bottom;
  transition: all 0.25s cubic-bezier(.4,0,.2,1);
}
.gf-meter-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gf-meter-val {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1;
  transition: color 0.3s ease;
}
.gf-meter-denom {
  font-size: 0.95rem;
  opacity: 0.5;
  margin-left: 1px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
}
.gf-meter-lbl {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

/* ── SLIDER BLOCK ── */
.gf-slider-wrap { display: flex; flex-direction: column; gap: 10px; width: 100%; }

/* ── BEFORE HEADER ── */
.gf-before-hdr {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
}
.gf-before-icon {
  width: 42px; height: 42px;
  border-radius: 11px;
  background: var(--secondary-container);
  color: var(--on-secondary-container);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.gf-before-icon svg { width: 20px; height: 20px; }

.gf-sl {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  transition: background 0.3s;
}
.gf-sl::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 6px rgba(0,0,0,0.14), 0 0 0 2.5px var(--f, var(--primary));
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
}
.gf-sl::-webkit-slider-thumb:hover {
  box-shadow: 0 1px 8px rgba(0,0,0,0.2), 0 0 0 3.5px var(--f, var(--primary));
  transform: scale(1.1);
}
.gf-sllbl {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--outline);
  font-weight: 300;
}

/* ── SENSE HEADER ── */
.gf-sense-hdr {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
}
.gf-sense-ic {
  width: 46px; height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.gf-sense-meta { flex: 1; min-width: 0; }
.gf-sense-label {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-style: italic;
  font-weight: 400;
  line-height: 1.3;
  margin: 0 0 3px;
}
.gf-sense-sub { font-size: 12px; color: var(--outline); font-weight: 300; }

/* ── STEP PILLS ── */
.gf-steps-pills { display: flex; align-items: center; gap: 5px; }

/* ── INPUT ROW ── */
.gf-input-row {
  display: flex;
  gap: 8px;
  background: var(--background);
  border-radius: 12px;
  padding: 4px;
  border: 1.5px solid var(--outline-variant);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.gf-input-row:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(76,102,43,0.1);
}
.gf-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 9px 12px;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  background: transparent;
  color: var(--on-surface);
}
.gf-input::placeholder { color: var(--outline); }
.gf-add-btn {
  padding: 8px 16px;
  border-radius: 9px;
  border: none;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s ease;
}
.gf-add-btn:not(:disabled):hover { filter: brightness(0.9); transform: scale(0.98); }

/* ── CHIPS ── */
.gf-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  min-height: 34px;
}
.gf-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 13px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  animation: gfChipIn 0.32s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes gfChipIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
.gf-chip-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  opacity: 0.8;
  flex-shrink: 0;
}
.gf-chip-empty {
  width: 28px; height: 28px;
  border-radius: 100px;
  background: var(--surface-container-highest);
  border: 1.5px dashed var(--outline-variant);
  display: inline-block;
}

/* ── BUTTONS ── */
.gf-btn-p {
  width: 100%;
  padding: 13px 20px;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14.5px;
  font-weight: 500;
  background: var(--primary);
  color: var(--on-primary);
  cursor: pointer;
  transition: all 0.22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(76,102,43,0.22);
}
.gf-btn-p svg { width: 14px; height: 14px; }
.gf-btn-p:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(76,102,43,0.3); background: #3d5422; }
.gf-btn-p:active { transform: translateY(0); }

.gf-btn-sense {
  width: 100%;
  padding: 13px 20px;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14.5px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: all 0.22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.gf-btn-sense svg { width: 14px; height: 14px; }
.gf-btn-sense:hover { transform: translateY(-1px); filter: brightness(0.9); }

.gf-btn-t {
  width: 100%;
  padding: 13px 20px;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14.5px;
  font-weight: 500;
  background: var(--tertiary);
  color: #fff;
  cursor: pointer;
  transition: all 0.22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(56,102,99,0.22);
}
.gf-btn-t svg { width: 14px; height: 14px; }
.gf-btn-t:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(56,102,99,0.3); background: #2d5452; }

/* ── AFTER STEP ── */
.gf-stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}
.gf-stat-label { font-size: 13px; color: var(--outline); font-weight: 300; }
.gf-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  font-weight: 400;
  color: var(--on-surface);
  line-height: 1.1;
}
.gf-diff-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 16px;
  border-radius: 12px;
  background: var(--primary-container);
  border: 1px solid rgba(76,102,43,0.2);
  font-size: 13px;
  font-weight: 500;
  color: var(--on-primary-container);
}

/* ── COMPLETE ── */
.gf-complete { align-items: center; text-align: center; }
.gf-done {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: var(--primary);
  display: grid;
  place-items: center;
  box-shadow: 0 4px 18px rgba(76,102,43,0.3);
  animation: gfPop 0.6s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes gfPop { 0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.07)} 100%{transform:scale(1);opacity:1} }
.gf-done svg { width: 26px; height: 26px; }
.gf-complete-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.gf-chip-stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: 100px;
  background: var(--surface-container-high);
  border: 1px solid var(--outline-variant);
  color: var(--on-surface-variant);
  font-size: 12.5px;
  font-weight: 500;
}
.gf-chip-stat.pos {
  background: var(--primary-container);
  color: var(--on-primary-container);
  border-color: rgba(76,102,43,0.22);
}
.gf-insight {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--primary-container);
  border: 1.5px solid rgba(76,102,43,0.2);
  text-align: left;
  width: 100%;
}
.gf-insight-ic {
  width: 34px; height: 34px;
  border-radius: 9px;
  background: rgba(76,102,43,0.13);
  color: var(--primary);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.gf-insight-ic svg { width: 16px; height: 16px; }
.gf-ins-h {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--on-primary-container);
  opacity: 0.7;
  margin-bottom: 3px;
}
.gf-ins-t {
  font-size: 13px;
  color: var(--on-primary-container);
  font-weight: 400;
  line-height: 1.55;
  margin: 0;
}

/* ── RESPONSIVE ── */
@media (max-width: 480px) {
  .gf-card { border-radius: 16px; max-width: 100%; }
  .gf-body { padding: 18px 16px 22px; }
  .gf-title { font-size: 1.3rem; }
  .gf-slider-num { font-size: 2rem; }
  .gf-stat-num { font-size: 2.3rem; }
  .gf-hdr { padding: 12px 14px; }
  .gf-hdr-title { font-size: 0.9rem; }
  .gf-pbar { padding: 8px 14px; }
  .gf-sense-hdr { padding: 11px 13px; gap: 10px; }
  .gf-sense-ic { width: 40px; height: 40px; border-radius: 10px; }
  .gf-meter-bar { height: 44px; }
  .gf-meter-seg { border-radius: 3px; }
}
`;
