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

const senseColors = {
  sight: {
    bg: "#FFF7ED",
    ring: "#F59E0B",
    accent: "#D97706",
    glow: "rgba(245,158,11,0.25)",
  },
  touch: {
    bg: "#FFF1F2",
    ring: "#F43F5E",
    accent: "#E11D48",
    glow: "rgba(244,63,94,0.25)",
  },
  hearing: {
    bg: "#F5F3FF",
    ring: "#8B5CF6",
    accent: "#7C3AED",
    glow: "rgba(139,92,246,0.25)",
  },
  smell: {
    bg: "#F0FDF4",
    ring: "#14B8A6",
    accent: "#0D9488",
    glow: "rgba(20,184,166,0.25)",
  },
  taste: {
    bg: "#F0F9FF",
    ring: "#0EA5E9",
    accent: "#0284C7",
    glow: "rgba(14,165,233,0.25)",
  },
};

/* ─── Floating Orbs Background ─── */
function FloatingOrbs({ phase }) {
  const palettes = {
    before: ["#a78bfa", "#818cf8", "#c084fc", "#e879f9"],
    after: ["#34d399", "#2dd4bf", "#4ade80", "#a3e635"],
    active: ["#fbbf24", "#f472b6", "#a78bfa", "#22d3ee"],
  };
  const colors = palettes[phase] || palettes.active;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: 24,
        pointerEvents: "none",
      }}
    >
      {colors.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 100 + i * 40,
            height: 100 + i * 40,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c}33, transparent 70%)`,
            top: `${15 + i * 18}%`,
            left: `${10 + i * 20}%`,
            animation: `gfOrb${i} ${6 + i * 2}s ease-in-out infinite`,
            filter: "blur(30px)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Breathing Ring ─── */
function BreathingRing({ color = "#8B5CF6", size = 110 }) {
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
                ? `${3 - i}px solid ${color}${i === 0 ? "40" : "25"}`
                : "none",
            background:
              i === 2
                ? `radial-gradient(circle, ${color}15, transparent)`
                : "none",
            animation: `gfBreathe 4s ease-in-out infinite ${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Progress Arc (SVG) ─── */
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
        stroke="#e5e7eb"
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

/* ─── Chip Tag ─── */
function Chip({ text, color, index }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        borderRadius: 999,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        color,
        fontSize: 13,
        fontWeight: 500,
        animation: `gfChipIn 0.35s cubic-bezier(.34,1.56,.64,1) ${index * 0.06}s both`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          opacity: 0.7,
        }}
      />
      {text}
    </span>
  );
}

/* ─── Keyframes (injected once) ─── */
const GF_STYLE_ID = "grounding-flow-keyframes";
function injectKeyframes() {
  if (document.getElementById(GF_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = GF_STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
    @keyframes gfOrb0{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.15)}}
    @keyframes gfOrb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-25px,25px) scale(1.1)}}
    @keyframes gfOrb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,30px) scale(1.2)}}
    @keyframes gfOrb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,-15px) scale(1.05)}}
    @keyframes gfBreathe{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.12);opacity:1}}
    @keyframes gfFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes gfChipIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
    @keyframes gfPulseGlow{0%,100%{box-shadow:0 0 20px var(--gf-glow)}50%{box-shadow:0 0 40px var(--gf-glow)}}
    @keyframes gfCompletePop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}
    @keyframes gfConfetti{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(-60px) rotate(360deg);opacity:0}}
    .gf-slider{-webkit-appearance:none;appearance:none;height:6px;border-radius:999px;outline:none}
    .gf-slider::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:white;border:3px solid currentColor;box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:pointer}
    .gf-slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:white;border:3px solid currentColor;box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:pointer;border:none}
  `;
  document.head.appendChild(style);
}

/* ─── Main Component (all original logic preserved exactly) ─── */
export default function GroundingFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(-1); // -1 = BEFORE step
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
    else setStep(steps.length); // go to AFTER step
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
    if (val <= 3) return "#059669";
    if (val <= 6) return "#D97706";
    return "#DC2626";
  };
  /* ── End original logic ── */

  const feelingEmoji = (val) => (val <= 3 ? "🍃" : val <= 6 ? "🌊" : "🔥");
  const sliderGradient = (val) =>
    val <= 3
      ? "linear-gradient(90deg,#34d399,#6ee7b7)"
      : val <= 6
        ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
        : "linear-gradient(90deg,#f87171,#ef4444)";
  const sliderThumbColor = (val) =>
    val <= 3 ? "#10b981" : val <= 6 ? "#f59e0b" : "#ef4444";

  const doneSenses = steps.reduce((a, s) => a + responses[s.key].length, 0);
  const phase =
    step === -1 ? "before" : step > steps.length - 1 ? "after" : "active";

  const font = "'DM Sans', sans-serif";
  const displayFont = "'DM Serif Display', serif";

  /* ── Reusable slider block ── */
  const SliderBlock = ({ value, onChange, thumbColor }) => (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          style={{ fontSize: 36, fontFamily: displayFont, color: "#1E1B2E" }}
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
          background: sliderGradient(value),
          color: thumbColor || sliderThumbColor(value),
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#A0A0B8",
          marginTop: 6,
        }}
      >
        <span>Calm</span>
        <span>Overwhelmed</span>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: 600,
          color: feelingColor(value),
          marginTop: 8,
        }}
      >
        {feelingText(value)}
      </p>
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        maxWidth: 440,
        margin: "0 auto",
        padding: 32,
        borderRadius: 24,
        background:
          phase === "before"
            ? "#FAF5FF"
            : phase === "after"
              ? step > steps.length
                ? "#ECFDF5"
                : "#F0FDF4"
              : sc?.bg || "#FAFAFA",
        boxShadow: "0 8px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        fontFamily: font,
        overflow: "hidden",
        transition: "background 0.6s ease",
        minHeight: 400,
      }}
    >
      <FloatingOrbs phase={phase} />

      <div
        key={fadeKey}
        style={{
          position: "relative",
          zIndex: 1,
          animation: "gfFadeUp 0.45s ease-out",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: displayFont,
              fontSize: 26,
              fontWeight: 400,
              color: "#1E1B2E",
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            5 · 4 · 3 · 2 · 1
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#8B8B9E",
              marginTop: 4,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Grounding Exercise
          </p>
        </div>

        {/* ──────── BEFORE STEP ──────── */}
        {step === -1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <BreathingRing color="#8B5CF6" />
            <p
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: "#3B3355",
                textAlign: "center",
                margin: 0,
              }}
            >
              How activated do you feel right now?
            </p>
            <SliderBlock value={before} onChange={setBefore} />
            <button
              onClick={() => setStep(0)}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: font,
                boxShadow: "0 4px 20px rgba(109,40,217,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(109,40,217,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(109,40,217,0.35)";
              }}
            >
              Begin Grounding
            </button>
          </div>
        )}

        {/* ──────── SENSORY STEPS ──────── */}
        {current && step >= 0 && step < steps.length && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Step progress pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {steps.map((s, i) => (
                  <div
                    key={s.key}
                    style={{
                      width: i === step ? 28 : 8,
                      height: 8,
                      borderRadius: 999,
                      background:
                        i < step ? sc.accent : i === step ? sc.ring : "#D1D5DB",
                      opacity: i <= step ? 1 : 0.4,
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
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: `${sc.ring}18`,
                  border: `2px solid ${sc.ring}40`,
                  fontSize: 28,
                  marginBottom: 12,
                  animation: "gfPulseGlow 3s ease-in-out infinite",
                }}
              >
                {current.icon}
              </div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: sc.accent,
                  margin: 0,
                }}
              >
                {current.label}
              </p>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                Step {step + 1} of {steps.length} ·{" "}
                {responses[current.key].length} of {current.count} added
              </div>
            </div>

            {/* Input field */}
            <div
              style={{
                display: "flex",
                gap: 8,
                background: "#fff",
                borderRadius: 14,
                padding: 4,
                border: `2px solid ${sc.ring}30`,
                boxShadow: `0 2px 12px ${sc.glow}`,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addItem();
                }}
                placeholder="Type and press add"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "10px 12px",
                  fontSize: 14,
                  fontFamily: font,
                  background: "transparent",
                  color: "#1E1B2E",
                }}
              />
              <button
                onClick={addItem}
                disabled={!input.trim()}
                style={{
                  padding: "8px 18px",
                  borderRadius: 11,
                  border: "none",
                  background: input.trim() ? sc.ring : "#E5E7EB",
                  color: input.trim() ? "#fff" : "#9CA3AF",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: input.trim() ? "pointer" : "default",
                  fontFamily: font,
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
                gap: 8,
                minHeight: 32,
              }}
            >
              {responses[current.key].map((r, i) => (
                <Chip key={i} text={r} color={sc.accent} index={i} />
              ))}
            </div>

            {/* Next — only when enough items */}
            {responses[current.key].length >= current.count && (
              <button
                onClick={nextStep}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: 14,
                  border: "none",
                  background: `linear-gradient(135deg, ${sc.ring}, ${sc.accent})`,
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: font,
                  boxShadow: `0 4px 20px ${sc.glow}`,
                  animation: "gfChipIn 0.4s cubic-bezier(.34,1.56,.64,1)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                Next
              </button>
            )}
          </div>
        )}

        {/* ──────── AFTER STEP ──────── */}
        {step === steps.length && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <BreathingRing color="#10b981" />

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                You noticed
              </p>
              <p
                style={{
                  fontSize: 30,
                  fontFamily: displayFont,
                  color: "#1E1B2E",
                  margin: "4px 0",
                }}
              >
                {doneSenses} things
              </p>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                around you
              </p>
            </div>

            <p
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: "#1E4D3A",
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
                  background: "#D1FAE5",
                  borderRadius: 12,
                  padding: "10px 16px",
                  fontSize: 13,
                  color: "#065F46",
                  textAlign: "center",
                  border: "1px solid #A7F3D0",
                  width: "100%",
                }}
              >
                Your intensity dropped by {before - after} — nice work
              </div>
            )}

            <button
              onClick={saveSession}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: font,
                boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(16,185,129,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(16,185,129,0.35)";
              }}
            >
              Save Session
            </button>
          </div>
        )}

        {/* ──────── COMPLETE ──────── */}
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
                fontSize: 56,
                marginBottom: 12,
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
                    fontSize: 14,
                    top: "50%",
                    left: "50%",
                    animation: `gfConfetti 1.2s ease-out ${i * 0.1}s forwards`,
                    transform: `rotate(${i * 60}deg) translateY(-10px)`,
                  }}
                >
                  ✦
                </span>
              ))}
            </div>
            <p
              style={{
                fontFamily: displayFont,
                fontSize: 22,
                color: "#065F46",
                margin: "0 0 8px",
              }}
            >
              Session Complete
            </p>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
              Grounding session saved 🌿
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
