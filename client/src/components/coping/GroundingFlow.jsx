import { useState, useEffect, useRef } from "react";
import { completeGroundingSession } from "../../features/grounding/grounding.api";

const steps = [
  {
    key: "seen",
    label: "Name 5 things you can SEE",
    count: 5,
    icon: "👁",
    sense: "sight",
  },
  {
    key: "felt",
    label: "Name 4 things you can FEEL",
    count: 4,
    icon: "✋",
    sense: "touch",
  },
  {
    key: "heard",
    label: "Name 3 things you can HEAR",
    count: 3,
    icon: "👂",
    sense: "hearing",
  },
  {
    key: "smelled",
    label: "Name 2 things you can SMELL",
    count: 2,
    icon: "🌸",
    sense: "smell",
  },
  {
    key: "tasted",
    label: "Name 1 thing you can TASTE",
    count: 1,
    icon: "👅",
    sense: "taste",
  },
];

/* Material-token sense colors — each maps to a tonal variant of the brand palette */
const senseColors = {
  sight: {
    bg: "rgba(76,102,43,0.07)",
    ring: "#4C662B",
    accent: "#354E16",
    glow: "rgba(76,102,43,0.2)",
    chip: "#CDEDA3",
    chipText: "#354E16",
  },
  touch: {
    bg: "rgba(88,98,73,0.07)",
    ring: "#586249",
    accent: "#404A33",
    glow: "rgba(88,98,73,0.2)",
    chip: "#DCE7C8",
    chipText: "#404A33",
  },
  hearing: {
    bg: "rgba(56,102,99,0.07)",
    ring: "#386663",
    accent: "#1F4E4B",
    glow: "rgba(56,102,99,0.2)",
    chip: "#BCECE7",
    chipText: "#1F4E4B",
  },
  smell: {
    bg: "rgba(76,102,43,0.05)",
    ring: "#B1D18A",
    accent: "#4C662B",
    glow: "rgba(177,209,138,0.25)",
    chip: "#CDEDA3",
    chipText: "#354E16",
  },
  taste: {
    bg: "rgba(56,102,99,0.05)",
    ring: "#BCECE7",
    accent: "#386663",
    glow: "rgba(56,102,99,0.18)",
    chip: "#BCECE7",
    chipText: "#1F4E4B",
  },
};

/* ── Botanical floating orbs — brand palette variants ── */
function FloatingOrbs({ phase }) {
  const palettes = {
    before: [
      "rgba(76,102,43,0.18)",
      "rgba(88,98,73,0.15)",
      "rgba(56,102,99,0.12)",
      "rgba(177,209,138,0.12)",
    ],
    after: [
      "rgba(56,102,99,0.18)",
      "rgba(76,102,43,0.15)",
      "rgba(177,209,138,0.15)",
      "rgba(88,98,73,0.1)",
    ],
    active: [
      "rgba(76,102,43,0.14)",
      "rgba(56,102,99,0.14)",
      "rgba(88,98,73,0.12)",
      "rgba(177,209,138,0.1)",
    ],
  };
  const colors = palettes[phase] || palettes.active;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: 20,
        pointerEvents: "none",
      }}
    >
      {colors.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 110 + i * 40,
            height: 110 + i * 40,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c}, transparent 70%)`,
            top: `${12 + i * 18}%`,
            left: `${8 + i * 22}%`,
            animation: `gfOrb${i} ${7 + i * 2}s ease-in-out infinite`,
            filter: "blur(35px)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Botanical breathing ring — uses brand primary ── */
function BreathingRing({ color = "#4C662B", size = 100 }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        margin: "0 auto",
      }}
    >
      {[0, 8, 16].map((inset, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset,
            borderRadius: "50%",
            border:
              i < 2
                ? `${3 - i}px solid ${color}${i === 0 ? "40" : "22"}`
                : "none",
            background:
              i === 2
                ? `radial-gradient(circle, ${color}12, transparent)`
                : "none",
            animation: `gfBreathe 4s ease-in-out infinite ${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Progress Arc ── */
function ProgressArc({ current, total, color }) {
  const r = 18,
    circ = 2 * Math.PI * r,
    pct = total > 0 ? current / total : 0;
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      style={{ transform: "rotate(-90deg)" }}
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

/* ── Response Chip — brand token style ── */
function Chip({ text, sc, index }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 13px",
        borderRadius: 100,
        background: sc.chip,
        border: `1px solid ${sc.ring}30`,
        color: sc.chipText,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        animation: `gfChipIn 0.35s cubic-bezier(.34,1.56,.64,1) ${index * 0.06}s both`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: sc.accent,
          opacity: 0.8,
        }}
      />
      {text}
    </span>
  );
}

/* ── Keyframes injected once ── */
const GF_STYLE_ID = "grounding-flow-keyframes";
function injectKeyframes() {
  if (document.getElementById(GF_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = GF_STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    :root {
      --primary: #4C662B; --primary-container: #CDEDA3; --on-primary: #FFFFFF; --on-primary-container: #354E16;
      --secondary: #586249; --secondary-container: #DCE7C8; --on-secondary-container: #404A33;
      --tertiary: #386663; --tertiary-container: #BCECE7; --on-tertiary-container: #1F4E4B;
      --error: #BA1A1A; --error-container: #FFDAD6; --on-error-container: #93000A;
      --background: #F9FAEF; --on-background: #1A1C16; --on-surface: #1A1C16; --on-surface-variant: #44483D;
      --outline: #75796C; --outline-variant: #C5C8BA;
      --surface-container-low: #F3F4E9; --surface-container: #EEEFE3; --surface-container-high: #E8E9DE;
      --surface-container-highest: #E2E3D8; --inverse-primary: #B1D18A;
    }
    @keyframes gfOrb0{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(28px,-18px) scale(1.15)}}
    @keyframes gfOrb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-22px,22px) scale(1.1)}}
    @keyframes gfOrb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(18px,28px) scale(1.2)}}
    @keyframes gfOrb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-28px,-12px) scale(1.05)}}
    @keyframes gfBreathe{0%,100%{transform:scale(1);opacity:0.55}50%{transform:scale(1.12);opacity:1}}
    @keyframes gfFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes gfChipIn{from{opacity:0;transform:scale(0.82)}to{opacity:1;transform:scale(1)}}
    @keyframes gfPulseGlow{0%,100%{box-shadow:0 0 0 0 var(--gf-glow)}50%{box-shadow:0 0 0 8px transparent}}
    @keyframes gfCompletePop{0%{transform:scale(0.65);opacity:0}60%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}
    @keyframes gfConfetti{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(-60px) rotate(360deg);opacity:0}}
    @keyframes gfPulse{0%,100%{opacity:1}50%{opacity:0.35}}
    .gf-slider{-webkit-appearance:none;appearance:none;height:5px;border-radius:999px;outline:none}
    .gf-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--background);box-shadow:0 1px 6px rgba(0,0,0,0.12),0 0 0 2.5px currentColor;cursor:pointer}
    .gf-slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:var(--background);box-shadow:0 1px 6px rgba(0,0,0,0.12),0 0 0 2.5px currentColor;cursor:pointer;border:none}
    .gf-input-wrap:focus-within{border-color:var(--primary) !important;box-shadow:0 0 0 3px rgba(76,102,43,0.12) !important;}
  `;
  document.head.appendChild(style);
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
    injectKeyframes();
  }, []);
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

  const feelingText = (val) => {
    if (val <= 3) return "Body feels calm";
    if (val <= 6) return "Some tension present";
    return "High stress / activation";
  };

  const feelingColor = (val) => {
    if (val <= 3) return "var(--primary)";
    if (val <= 6) return "#A16207";
    return "var(--error)";
  };
  /* ── End original logic ── */

  const feelingEmoji = (val) => (val <= 3 ? "🍃" : val <= 6 ? "🌊" : "🔥");
  const sliderBg = (val) =>
    val <= 3
      ? "linear-gradient(90deg, var(--primary), #B1D18A)"
      : val <= 6
        ? "linear-gradient(90deg, #92400E, #CA8A04)"
        : "linear-gradient(90deg, var(--error), #F87171)";
  const sliderColor = (val) =>
    val <= 3 ? "var(--primary)" : val <= 6 ? "#CA8A04" : "var(--error)";

  const doneSenses = steps.reduce((a, s) => a + responses[s.key].length, 0);
  const phase =
    step === -1 ? "before" : step > steps.length - 1 ? "after" : "active";

  /* ── Reusable slider block ── */
  const SliderBlock = ({ value, onChange }) => (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontFamily: "'Playfair Display', serif",
            color: "var(--on-surface)",
            fontWeight: 400,
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: 22 }}>{feelingEmoji(value)}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="gf-slider"
        style={{
          width: "100%",
          background: sliderBg(value),
          color: sliderColor(value),
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11.5,
          color: "var(--outline)",
          marginTop: 7,
          fontWeight: 400,
        }}
      >
        <span>Calm</span>
        <span>Overwhelmed</span>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: 13.5,
          fontWeight: 500,
          color: feelingColor(value),
          marginTop: 8,
        }}
      >
        {feelingText(value)}
      </p>
    </div>
  );

  /* Card bg — warm surface tones per phase */
  const cardBg =
    phase === "before"
      ? "var(--surface-container-low)"
      : phase === "after" && step > steps.length
        ? "var(--surface-container-low)"
        : phase === "after"
          ? "var(--surface-container-low)"
          : sc
            ? "var(--surface-container-low)"
            : "var(--surface-container-low)";

  return (
    <div
      style={{
        position: "relative",
        maxWidth: 440,
        margin: "0 auto",
        padding: 28,
        borderRadius: 20,
        background: cardBg,
        border: "1.5px solid var(--outline-variant)",
        boxShadow:
          "0 1px 12px rgba(26,28,22,0.07), 0 4px 24px rgba(26,28,22,0.04)",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        transition: "background 0.5s ease",
        minHeight: 400,
        color: "var(--on-surface)",
      }}
    >
      {/* Botanical floating orbs */}
      <FloatingOrbs phase={phase} />

      {/* Top-right botanical glow — matches app cards */}
      <div
        style={{
          position: "absolute",
          top: -45,
          right: -45,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(76,102,43,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        key={fadeKey}
        style={{
          position: "relative",
          zIndex: 1,
          animation: "gfFadeUp 0.42s ease-out",
        }}
      >
        {/* ── Card Header ── */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "var(--primary-container)",
              border: "1px solid rgba(76,102,43,0.2)",
              borderRadius: 100,
              padding: "4px 13px 4px 10px",
              marginBottom: 12,
              width: "fit-content",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "var(--primary)",
                borderRadius: "50%",
                animation: "gfPulse 2.2s ease-in-out infinite",
                display: "block",
              }}
            />
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--on-primary-container)",
                margin: 0,
              }}
            >
              Grounding Exercise
            </p>
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.55rem",
              fontWeight: 400,
              color: "var(--on-surface)",
              margin: 0,
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}
          >
            5 · 4 · 3 · 2 · 1
          </h2>
        </div>

        {/* ════ BEFORE STEP ════ */}
        {step === -1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
            }}
          >
            <BreathingRing color="var(--primary)" />
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--on-surface)",
                textAlign: "center",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              How activated do you feel right now?
            </p>
            <SliderBlock value={before} onChange={setBefore} />
            <button
              onClick={() => setStep(0)}
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 12,
                border: "none",
                background: "var(--primary)",
                color: "var(--on-primary)",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 2px 10px rgba(76,102,43,0.22)",
                transition: "transform 0.22s, box-shadow 0.22s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(76,102,43,0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 10px rgba(76,102,43,0.22)";
              }}
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
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Begin Grounding
            </button>
          </div>
        )}

        {/* ════ SENSORY STEPS ════ */}
        {current && step >= 0 && step < steps.length && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Progress pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 5 }}>
                {steps.map((s, i) => (
                  <div
                    key={s.key}
                    style={{
                      width: i === step ? 26 : 7,
                      height: 7,
                      borderRadius: 999,
                      background:
                        i < step
                          ? sc.accent
                          : i === step
                            ? sc.ring
                            : "var(--outline-variant)",
                      opacity: i <= step ? 1 : 0.5,
                      transition: "all 0.4s ease",
                    }}
                  />
                ))}
              </div>
              <ProgressArc
                current={responses[current.key].length}
                total={current.count}
                color={sc.ring}
              />
            </div>

            {/* Sense icon + label */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  "--gf-glow": sc.glow,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: sc.bg,
                  border: `1.5px solid ${sc.ring}35`,
                  fontSize: 26,
                  marginBottom: 12,
                  animation: "gfPulseGlow 3s ease-in-out infinite",
                }}
              >
                {current.icon}
              </div>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: sc.accent,
                  margin: 0,
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                }}
              >
                {current.label}
              </p>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--outline)",
                  marginTop: 5,
                  fontWeight: 400,
                }}
              >
                Step {step + 1} of {steps.length} ·{" "}
                {responses[current.key].length} of {current.count} added
              </div>
            </div>

            {/* Input */}
            <div
              className="gf-input-wrap"
              style={{
                display: "flex",
                gap: 8,
                background: "var(--background)",
                borderRadius: 12,
                padding: 4,
                border: `1.5px solid var(--outline-variant)`,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addItem();
                }}
                placeholder="Type and press add…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "9px 12px",
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  background: "transparent",
                  color: "var(--on-surface)",
                }}
              />
              <button
                onClick={addItem}
                disabled={!input.trim()}
                style={{
                  padding: "8px 16px",
                  borderRadius: 9,
                  border: "none",
                  background: input.trim()
                    ? sc.ring
                    : "var(--surface-container-highest)",
                  color: input.trim() ? "#fff" : "var(--outline)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: input.trim() ? "pointer" : "default",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                Add
              </button>
            </div>

            {/* Response chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
                minHeight: 32,
              }}
            >
              {responses[current.key].map((r, i) => (
                <Chip key={i} text={r} sc={sc} index={i} />
              ))}
            </div>

            {/* Next button — appears when quota met */}
            {responses[current.key].length >= current.count && (
              <button
                onClick={nextStep}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 12,
                  border: "none",
                  background:
                    sc.accent === "var(--primary)" ||
                    sc.accent === "#354E16" ||
                    sc.accent === "#4C662B"
                      ? "var(--primary)"
                      : sc.ring,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: `0 3px 14px ${sc.glow}`,
                  animation: "gfChipIn 0.4s cubic-bezier(.34,1.56,.64,1)",
                  transition: "transform 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-1px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
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
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Next
              </button>
            )}
          </div>
        )}

        {/* ════ AFTER STEP ════ */}
        {step === steps.length && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <BreathingRing color="var(--tertiary)" />

            {/* Stats summary */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--outline)", margin: 0 }}>
                You noticed
              </p>
              <p
                style={{
                  fontSize: 32,
                  fontFamily: "'Playfair Display', serif",
                  color: "var(--on-surface)",
                  margin: "4px 0",
                  fontWeight: 400,
                }}
              >
                {doneSenses} things
              </p>
              <p style={{ fontSize: 13, color: "var(--outline)", margin: 0 }}>
                around you
              </p>
            </div>

            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--on-surface)",
                textAlign: "center",
                margin: 0,
              }}
            >
              How do you feel now?
            </p>

            <SliderBlock value={after} onChange={setAfter} />

            {before > after && (
              <div
                style={{
                  background: "var(--primary-container)",
                  borderRadius: 12,
                  padding: "10px 16px",
                  fontSize: 13,
                  color: "var(--on-primary-container)",
                  textAlign: "center",
                  border: "1px solid rgba(76,102,43,0.2)",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                }}
              >
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
                Your intensity dropped by {before - after} — nice work
              </div>
            )}

            <button
              onClick={saveSession}
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 12,
                border: "none",
                background: "var(--tertiary)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 2px 10px rgba(56,102,99,0.22)",
                transition: "transform 0.22s, box-shadow 0.22s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(56,102,99,0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 10px rgba(56,102,99,0.22)";
              }}
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
          <div
            style={{
              textAlign: "center",
              animation: "gfCompletePop 0.6s cubic-bezier(.34,1.56,.64,1)",
              paddingTop: 24,
            }}
          >
            <div
              style={{
                fontSize: 54,
                marginBottom: 14,
                position: "relative",
                display: "inline-block",
              }}
            >
              🌿
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    fontSize: 13,
                    top: "50%",
                    left: "50%",
                    animation: `gfConfetti 1.2s ease-out ${i * 0.1}s forwards`,
                    transform: `rotate(${i * 60}deg) translateY(-10px)`,
                    color: "var(--primary)",
                  }}
                >
                  ✦
                </span>
              ))}
            </div>

            {/* Success icon */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 4px 18px rgba(76,102,43,0.28)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path
                  d="M7 14.5L12 19.5L21 9.5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                fontWeight: 400,
                color: "var(--on-surface)",
                margin: "0 0 8px",
              }}
            >
              Session Complete
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--outline)",
                margin: 0,
                fontWeight: 300,
              }}
            >
              Grounding session saved 🌿
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
