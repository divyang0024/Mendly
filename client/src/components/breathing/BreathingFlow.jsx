import { useState, useEffect, useRef, useMemo } from "react";
import {
  startBreathingSession,
  completeBreathingSession,
} from "../../features/breathing/breathing.api";

const PATTERNS = {
  "4-4-6": {
    inhale: 4,
    hold: 4,
    exhale: 6,
    label: "Relax",
    timing: "4 · 4 · 6",
    desc: "Gentle & calming — great for daily decompression",
  },
  box: {
    inhale: 4,
    hold: 4,
    exhale: 4,
    label: "Box Breathing",
    timing: "4 · 4 · 4",
    desc: "Equal timing — used for focus and stress relief",
  },
  extended: {
    inhale: 5,
    hold: 2,
    exhale: 7,
    label: "Extended Exhale",
    timing: "5 · 2 · 7",
    desc: "Longer exhale — activates the parasympathetic system",
  },
};

const PHASE_SEQ = ["Inhale", "Hold", "Exhale"];

/* ── Brand-aligned stage palettes (dark, atmospheric, derived from MD3 palette) ── */
const STAGE = {
  Inhale: {
    bg: "linear-gradient(160deg,#0E1A00 0%,#1F3700 55%,#152500 100%)",
    orb: "linear-gradient(145deg,#2A4500,#4C7A00,#3D6300)",
    glow: "rgba(76,102,43,0.65)",
    arc: "#CDEDA3",
    ripple: "rgba(177,209,138,0.28)",
    accent: "#B1D18A",
    label: "rgba(177,209,138,0.75)",
    hint: "Breathe in slowly through your nose",
  },
  Hold: {
    bg: "linear-gradient(160deg,#111A08 0%,#253815 55%,#182410 100%)",
    orb: "linear-gradient(145deg,#263319,#4A6036,#384A28)",
    glow: "rgba(88,98,73,0.65)",
    arc: "#DCE7C8",
    ripple: "rgba(220,231,200,0.25)",
    accent: "#BFCBAD",
    label: "rgba(191,203,173,0.75)",
    hint: "Hold gently — no strain",
  },
  Exhale: {
    bg: "linear-gradient(160deg,#001614 0%,#003230 55%,#001C1A 100%)",
    orb: "linear-gradient(145deg,#003330,#1F5C59,#0D4845)",
    glow: "rgba(56,102,99,0.65)",
    arc: "#BCECE7",
    ripple: "rgba(188,236,231,0.28)",
    accent: "#A0D0CB",
    label: "rgba(160,208,203,0.75)",
    hint: "Release slowly through your mouth",
  },
};

function ArcRing({ total, color, phaseKey }) {
  const R = 108,
    C = 2 * Math.PI * R;
  const animName = `arcFill_${phaseKey}`;
  const style = `@keyframes ${animName} { from { stroke-dashoffset: ${C.toFixed(2)}; } to { stroke-dashoffset: 0; } }`;
  return (
    <svg
      width="232"
      height="232"
      viewBox="0 0 232 232"
      style={{
        position: "absolute",
        top: -6,
        left: -6,
        transform: "rotate(-90deg)",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <style>{style}</style>
      <circle
        cx="116"
        cy="116"
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="2"
      />
      <circle
        key={phaseKey}
        cx="116"
        cy="116"
        r={R}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C}
        style={{
          animation: `${animName} ${total}s linear forwards`,
          transition: "stroke 0.5s ease",
        }}
      />
    </svg>
  );
}

function Particles({ phase }) {
  const pts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        size: 2 + Math.random() * 3.5,
        delay: Math.random() * 1.8,
        drift: -18 + Math.random() * 36,
        baseY: 35 + Math.random() * 35,
      })),
    [],
  );
  const yShift = phase === "Inhale" ? -32 : phase === "Exhale" ? 32 : 0;
  const op = phase === "Hold" ? 0.6 : 0.32;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {pts.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.baseY}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            opacity: op,
            transform: `translate(${p.drift * (phase === "Hold" ? 0.3 : 1)}px,${yShift}px) scale(${phase === "Hold" ? 1.25 : 1})`,
            transition: `all ${phase === "Hold" ? "0.5s" : phase === "Inhale" ? "3s" : "4.2s"} cubic-bezier(0.4,0,0.2,1)`,
            transitionDelay: `${p.delay * 0.22}s`,
          }}
        />
      ))}
    </div>
  );
}

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
    <div className="bf-meter-wrap">
      <div className="bf-meter-bar">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="bf-meter-seg"
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
      <div className="bf-meter-meta">
        <span
          className="bf-meter-val"
          style={{ color: SEGMENT_COLORS[Math.min(value - 1, 9)] }}
        >
          {value}
          <span className="bf-meter-denom">/10</span>
        </span>
        <span
          className="bf-meter-lbl"
          style={{ background: labelBg, color: labelColor }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
// fill color for slider track
const fMeta = (v) => ({
  fill: v <= 3 ? "#4C662B" : v <= 6 ? "#C5A000" : "#BA1A1A",
});

export default function BreathingFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(1);
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [patKey, setPatKey] = useState("4-4-6");
  const [phase, setPhase] = useState("Inhale");
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(false);
  const [dur, setDur] = useState(0);
  const [bsId, setBsId] = useState(null);
  const [rKey, setRKey] = useState(0);
  const timer = useRef(null);
  const phaseRef = useRef("Inhale");
  const patKeyRef = useRef("4-4-6");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    patKeyRef.current = patKey;
  }, [patKey]);

  const pat = PATTERNS[patKey];
  const cfg = STAGE[phase];
  const totalPhase =
    phase === "Inhale" ? pat.inhale : phase === "Hold" ? pat.hold : pat.exhale;
  const orbScale = phase === "Exhale" ? 0.8 : 1.18;
  const pStep = step >= 6 ? 5 : step;

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setDur((d) => d + 1);
      setCount((c) => {
        if (c > 1) return c - 1;
        const curPhase = phaseRef.current;
        const curPat = PATTERNS[patKeyRef.current];
        const np = PHASE_SEQ[(PHASE_SEQ.indexOf(curPhase) + 1) % 3];
        const nextCount =
          np === "Inhale"
            ? curPat.inhale
            : np === "Hold"
              ? curPat.hold
              : curPat.exhale;
        setPhase(np);
        return nextCount;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [running]);

  useEffect(() => {
    if (step === 4) setRKey((k) => k + 1);
  }, [phase, step]);

  const handleStart = async () => {
    const res = await startBreathingSession({
      sessionId,
      pattern: patKey,
      intensityBefore: before,
    });
    setBsId(res.data.data._id);
    setStep(3);
  };

  const beginBreathing = () => {
    setPhase("Inhale");
    setCount(pat.inhale);
    setRunning(true);
    setStep(4);
  };

  const finish = () => {
    clearInterval(timer.current);
    setRunning(false);
    setStep(5);
  };

  const save = async () => {
    await completeBreathingSession({
      breathingSessionId: bsId,
      sessionId,
      pattern: patKey,
      durationSec: dur,
      intensityBefore: before,
      intensityAfter: after,
    });
    if (onComplete) onComplete();
    setStep(6);
  };

  const reset = () => {
    setStep(1);
    setDur(0);
    setBefore(5);
    setAfter(5);
    setPatKey("4-4-6");
  };

  return (
    <>
      <style>{S}</style>
      <div className="bf-card">
        <div className="bf-blob" />

        {/* ── Header + progress (hidden during stage) ── */}
        {step !== 4 && (
          <>
            <div className="bf-hdr">
              <div className="bf-hdr-l">
                <div className="bf-hdr-ic">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 8.03 3 13a9 9 0 0 0 9 9z" />
                    <path d="M12 8v5l3 3" />
                  </svg>
                </div>
                <span className="bf-hdr-title">Breathing Exercise</span>
              </div>
              {step < 6 && <div className="bf-hdr-badge">{pStep} of 5</div>}
            </div>
            {step < 6 && (
              <div className="bf-pbar">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`bf-pseg${s <= pStep ? " on" : ""}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ════ STEP 1 — WELCOME ════ */}
        {step === 1 && (
          <div className="bf-body bf-in">
            <div className="bf-welcome-ic">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: 30,
                  height: 30,
                  color: "var(--on-primary-container)",
                }}
              >
                <path d="M6 12c0-3.314 2.686-6 6-6s6 2.686 6 6v2H6v-2z" />
                <path d="M18 16h-1a5 5 0 0 1 5-5 4 4 0 0 1 4 4 3 3 0 0 1-3 3H8" />
                <path d="M6 18c0 2.21 1.79 4 4 4h14a3 3 0 0 0 3-3 3 3 0 0 0-3-3" />
                <path d="M8 22v3M12 22v3M16 22v3" />
              </svg>
            </div>
            <div className="bf-eyebrow">
              <span className="bf-ey-dot" />
              <p>Guided Practice</p>
            </div>
            <h2 className="bf-title">Guided Breathing</h2>
            <p className="bf-sub">
              Take a moment to regulate your breathing and calm your nervous
              system.
            </p>
            <div className="bf-feat-grid">
              {[
                {
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
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  ),
                  label: "3 techniques",
                  sub: "Choose your pattern",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  ),
                  label: "Track progress",
                  sub: "Before & after mood",
                },
                {
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
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  label: "Your pace",
                  sub: "Stop whenever ready",
                },
              ].map(({ icon, label, sub }) => (
                <div className="bf-feat" key={label}>
                  <span className="bf-feat-e">{icon}</span>
                  <span className="bf-feat-l">{label}</span>
                  <span className="bf-feat-s">{sub}</span>
                </div>
              ))}
            </div>
            <button className="bf-btn-p" onClick={() => setStep(2)}>
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
              Begin Session
            </button>
          </div>
        )}

        {/* ════ STEP 2 — BEFORE RATING ════ */}
        {step === 2 &&
          (() => {
            const fm = fMeta(before);
            return (
              <div className="bf-body bf-in">
                <div className="bf-step-ey">
                  <span className="bf-sn">1</span>
                  <span className="bf-step-lbl">Before we start</span>
                </div>
                <h2 className="bf-title">Current stress level</h2>
                <p className="bf-sub">
                  Drag to set — we'll compare after your session.
                </p>
                <div className="bf-slwrap bf-d1">
                  <TensionMeter value={before} />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={before}
                    onChange={(e) => setBefore(+e.target.value)}
                    className="bf-sl"
                    style={{
                      "--t": `${((before - 1) / 9) * 100}%`,
                      "--f": fm.fill,
                    }}
                  />
                  <div className="bf-sllbl">
                    <span>Calm</span>
                    <span>Overwhelmed</span>
                  </div>
                </div>
                <button className="bf-btn-p bf-d3" onClick={handleStart}>
                  Continue
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
                </button>
              </div>
            );
          })()}

        {/* ════ STEP 3 — PATTERN SELECT ════ */}
        {step === 3 && (
          <div className="bf-body bf-in">
            <div className="bf-step-ey">
              <span className="bf-sn">2</span>
              <span className="bf-step-lbl">Choose technique</span>
            </div>
            <h2 className="bf-title">Pick your pattern</h2>
            <p className="bf-sub">
              Select the breathing rhythm that feels right for you right now.
            </p>
            <div className="bf-pats">
              {Object.entries(PATTERNS).map(([k, pt], i) => {
                const sel = patKey === k;
                const icons = {
                  relax: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 7v5l3.5 3.5" />
                    </svg>
                  ),
                  box: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <rect x="5" y="5" width="14" height="14" rx="2" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  ),
                  extended: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M3 19c3-9 5.5-13 9-13s6 4 9 13" />
                      <path d="M12 6V2M10 4l2-2 2 2" />
                    </svg>
                  ),
                };
                return (
                  <div
                    key={k}
                    className={`bf-pat${sel ? " sel" : ""} bf-in`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => setPatKey(k)}
                  >
                    <div className="bf-pat-ic">{icons[k]}</div>
                    <div className="bf-pat-inf">
                      <div className="bf-pat-name">{pt.label}</div>
                      <div className="bf-pat-time">{pt.timing}</div>
                      <div className="bf-pat-desc">{pt.desc}</div>
                    </div>
                    <div className="bf-pat-radio">
                      {sel && (
                        <svg viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2.5 6L5 8.5L9.5 3.5"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="bf-btn-t bf-d3" onClick={beginBreathing}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M12 22a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 8.03 3 13a9 9 0 0 0 9 9z" />
                <path d="M12 8v5l3 3" />
              </svg>
              Begin Breathing
            </button>
          </div>
        )}

        {/* ════ STEP 4 — IMMERSIVE STAGE ════ */}
        {step === 4 && (
          <div className="bf-stage" style={{ background: cfg.bg }}>
            {/* Layered atmosphere */}
            <div className="bf-sdots" />
            <div className="bf-ga" style={{ background: cfg.glow }} />
            <div className="bf-gb" style={{ background: cfg.glow }} />
            <div className="bf-gc" style={{ background: cfg.glow }} />

            {/* ── Top status strip ── */}
            <div className="bf-stage-top">
              <div className="bf-stimer" style={{ color: cfg.accent }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <path
                    d="M6 3v3l2 1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                {fmt(dur)}
              </div>
              <div
                className="bf-spat"
                style={{ color: cfg.accent, opacity: 0.6 }}
              >
                {pat.label} · {pat.timing}
              </div>
            </div>

            {/* ── Central orb ── */}
            <div className="bf-orb-wrap">
              <div
                className="bf-orb-sc"
                style={{
                  transform: `scale(${orbScale})`,
                  transition: `transform ${phase === "Hold" ? "0.5s" : phase === "Inhale" ? "3s" : "4s"} cubic-bezier(0.4,0,0.2,1)`,
                }}
              >
                <div className="bf-orb-glow" style={{ background: cfg.glow }} />
                <ArcRing total={totalPhase} color={cfg.arc} phaseKey={rKey} />
                {[1, 2, 3].map((n) => (
                  <div
                    key={`${rKey}-${n}`}
                    className={`bf-rip ${phase.toLowerCase()} r${n}`}
                    style={{ border: `1.5px solid ${cfg.ripple}` }}
                  />
                ))}
                <div className="bf-orb" style={{ background: cfg.orb }}>
                  <div className="bf-orb-shine" />
                  <Particles phase={phase} />
                  <span className="bf-orb-cnt">{count}</span>
                </div>
              </div>
            </div>

            {/* ── Phase label + arrow below orb ── */}
            <div className="bf-phase-block">
              <div
                className={`bf-orb-arr ${phase.toLowerCase()}`}
                style={{ color: cfg.arc }}
              >
                {phase === "Inhale" && (
                  <svg viewBox="0 0 22 22" fill="none">
                    <path
                      d="M11 17V5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 11l6-6 6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {phase === "Hold" && (
                  <svg viewBox="0 0 22 22" fill="none">
                    <rect
                      x="5.5"
                      y="5"
                      width="3.5"
                      height="12"
                      rx="1.5"
                      fill="currentColor"
                      opacity=".7"
                    />
                    <rect
                      x="13"
                      y="5"
                      width="3.5"
                      height="12"
                      rx="1.5"
                      fill="currentColor"
                      opacity=".7"
                    />
                  </svg>
                )}
                {phase === "Exhale" && (
                  <svg viewBox="0 0 22 22" fill="none">
                    <path
                      d="M11 5v12"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 11l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="bf-phase-name" style={{ color: cfg.accent }}>
                {phase}
              </span>
              <p className="bf-hint" style={{ color: cfg.accent }}>
                {cfg.hint}
              </p>
            </div>

            {/* ── Phase pill tabs ── */}
            <div className="bf-phase-tabs">
              {PHASE_SEQ.map((ph) => {
                const tp =
                  ph === "Inhale"
                    ? pat.inhale
                    : ph === "Hold"
                      ? pat.hold
                      : pat.exhale;
                const active = phase === ph;
                return (
                  <div
                    key={ph}
                    className={`bf-ptab${active ? " on" : ""}`}
                    style={
                      active
                        ? {
                            background: `${STAGE[ph].arc}22`,
                            borderColor: `${STAGE[ph].arc}55`,
                            color: STAGE[ph].arc,
                          }
                        : {}
                    }
                  >
                    <span className="bf-ptab-name">{ph}</span>
                    <span className="bf-ptab-sec">{tp}s</span>
                  </div>
                );
              })}
            </div>

            <button
              className="bf-btn-stop"
              style={{ color: cfg.accent, borderColor: `${cfg.arc}40` }}
              onClick={finish}
            >
              <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                <rect
                  x="3"
                  y="3"
                  width="10"
                  height="10"
                  rx="2"
                  fill="currentColor"
                  opacity=".8"
                />
              </svg>
              Finish Session
            </button>
          </div>
        )}

        {/* ════ STEP 5 — AFTER RATING ════ */}
        {step === 5 &&
          (() => {
            const fm = fMeta(after);
            const diff = before - after;
            return (
              <div className="bf-body bf-in">
                <div className="bf-step-ey">
                  <span className="bf-sn">3</span>
                  <span className="bf-step-lbl">After session</span>
                </div>
                <h2 className="bf-title">How do you feel now?</h2>
                <p className="bf-sub">
                  Rate your stress level after the session.
                </p>
                <div className="bf-slwrap bf-d1">
                  <TensionMeter value={after} />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={after}
                    onChange={(e) => setAfter(+e.target.value)}
                    className="bf-sl"
                    style={{
                      "--t": `${((after - 1) / 9) * 100}%`,
                      "--f": fm.fill,
                    }}
                  />
                  <div className="bf-sllbl">
                    <span>Calm</span>
                    <span>Overwhelmed</span>
                  </div>
                </div>
                {before !== after && (
                  <div
                    className="bf-diff bf-d2"
                    style={{
                      background: diff > 0 ? "#CDEDA3" : "#FFDAD6",
                      color: diff > 0 ? "#354E16" : "#93000A",
                      border: `1.5px solid ${diff > 0 ? "rgba(76,102,43,0.2)" : "rgba(186,26,26,0.2)"}`,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {diff > 0 ? (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                      ) : (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      )}
                    </span>
                    <span>
                      {diff > 0
                        ? `Stress reduced by ${diff} point${diff > 1 ? "s" : ""}`
                        : `Stress up by ${Math.abs(diff)}`}
                    </span>
                    <span className="bf-diff-b">
                      {before} → {after}
                    </span>
                  </div>
                )}
                <button className="bf-btn-t bf-d3" onClick={save}>
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
            );
          })()}

        {/* ════ STEP 6 — COMPLETE ════ */}
        {step === 6 && (
          <div className="bf-body bf-in" style={{ textAlign: "center" }}>
            <div className="bf-done bf-in">
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
            <h2 className="bf-title bf-d1">Session Complete</h2>
            <p className="bf-sub bf-d1" style={{ marginBottom: 18 }}>
              Great job taking time for yourself today.
            </p>
            <div className="bf-chips bf-d2">
              <div className="bf-chip">
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
                {fmt(dur)}
              </div>
              <div className={`bf-chip${before > after ? " pos" : ""}`}>
                {before > after ? "↓ " : before < after ? "↑ " : "— "}Stress:{" "}
                {before}→{after}
              </div>
              <div className="bf-chip">{pat.label}</div>
            </div>
            {before > after && (
              <div className="bf-insight bf-d3">
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "var(--primary)",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
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
                </span>
                <div>
                  <div className="bf-ins-h">Mood improved</div>
                  <p className="bf-ins-t">
                    Stress dropped {before - after} point
                    {before - after > 1 ? "s" : ""}. Consistent practice deepens
                    the effect.
                  </p>
                </div>
              </div>
            )}
            <button className="bf-btn-o bf-d4" onClick={reset}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 14, height: 14 }}
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
              </svg>
              Start Another Session
            </button>
          </div>
        )}
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
}

/* ── CARD SHELL ── */
.bf-card {
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

/* Decorative orb — top-right, same as sibling cards */
.bf-blob {
  position: absolute;
  top: -48px;
  right: -48px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56,102,99,0.07) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ── HEADER ── */
.bf-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--outline-variant);
  background: var(--surface-container);
  position: relative;
  z-index: 1;
}
.bf-hdr-l {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bf-hdr-ic {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--tertiary-container);
  color: var(--on-tertiary-container);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.bf-hdr-ic svg { width: 14px; height: 14px; }
.bf-hdr-title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 400;
  color: var(--on-surface);
  letter-spacing: -0.1px;
}
.bf-hdr-badge {
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
.bf-pbar {
  display: flex;
  gap: 4px;
  padding: 10px 18px;
  background: var(--surface-container);
  border-bottom: 1px solid var(--outline-variant);
  position: relative;
  z-index: 1;
}
.bf-pseg {
  flex: 1;
  height: 3px;
  border-radius: 3px;
  background: var(--surface-container-highest);
  transition: background 0.5s ease;
}
.bf-pseg.on {
  background: linear-gradient(90deg, var(--primary), var(--tertiary));
}

/* ── BODY ── */
.bf-body {
  padding: 22px 20px 26px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

/* ── EYEBROW (welcome) ── */
.bf-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--primary-container);
  border: 1px solid rgba(76,102,43,0.22);
  border-radius: 100px;
  padding: 4px 12px 4px 9px;
  width: fit-content;
  margin-bottom: 14px;
}
.bf-ey-dot {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: bfPulse 2.2s ease-in-out infinite;
  flex-shrink: 0;
}
.bf-eyebrow p {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--on-primary-container);
}
@keyframes bfPulse { 0%,100% { opacity:1 } 50% { opacity:0.35 } }

/* ── STEP EYEBROW ── */
.bf-step-ey {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.bf-sn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 11px;
  font-weight: 600;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.bf-step-lbl {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--outline);
}

/* ── TYPOGRAPHY ── */
.bf-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--on-surface);
  letter-spacing: -0.3px;
  margin-bottom: 6px;
  line-height: 1.25;
}
.bf-sub {
  font-size: 13px;
  font-weight: 300;
  color: var(--outline);
  line-height: 1.65;
  margin-bottom: 20px;
}

/* ── WELCOME ICON ── */
.bf-welcome-ic {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: var(--primary-container);
  border: 1.5px solid rgba(76,102,43,0.18);
  display: grid;
  place-items: center;
  font-size: 28px;
  margin: 0 auto 18px;
}

/* ── FEATURE GRID ── */
.bf-feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 22px;
}
.bf-feat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 13px 8px;
  border-radius: 14px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
}
.bf-feat:hover {
  background: var(--surface-container-high);
  border-color: rgba(76,102,43,0.25);
}
.bf-feat-e { font-size: 18px; line-height: 1; display:flex; align-items:center; color:var(--on-secondary-container); } .bf-feat-e svg { width:20px; height:20px; }
.bf-feat-l { font-size: 11.5px; font-weight: 600; color: var(--on-surface); }
.bf-feat-s { font-size: 10.5px; color: var(--outline); font-weight: 300; }



/* ── TENSION METER ── */
.bf-meter-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  margin-bottom: 14px;
}
.bf-meter-bar {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 56px;
}
.bf-meter-seg {
  flex: 1;
  border-radius: 4px;
  transform-origin: bottom;
}
.bf-meter-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bf-meter-val {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1;
  transition: color 0.3s ease;
}
.bf-meter-denom {
  font-size: 0.95rem;
  opacity: 0.5;
  margin-left: 1px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
}
.bf-meter-lbl {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

/* ── SLIDER ── */
.bf-slwrap { margin-bottom: 20px; }
.bf-sl {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  background: linear-gradient(
    90deg,
    var(--f, var(--primary)) var(--t, 44%),
    var(--surface-container-highest) var(--t, 44%)
  );
  transition: background 0.3s;
}
.bf-sl::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 6px rgba(0,0,0,0.14), 0 0 0 2.5px var(--f, var(--primary));
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
}
.bf-sl::-webkit-slider-thumb:hover {
  box-shadow: 0 1px 8px rgba(0,0,0,0.2), 0 0 0 3.5px var(--f, var(--primary));
  transform: scale(1.1);
}
.bf-sllbl {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--outline);
  margin-top: 7px;
  font-weight: 300;
}

/* ── DIFF BADGE (step 5) ── */
.bf-diff {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 18px;
}
.bf-diff-b {
  margin-left: auto;
  font-size: 12px;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}

/* ── PATTERN CARDS ── */
.bf-pats {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 22px;
}
.bf-pat {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 14px 15px;
  border: 1.5px solid var(--outline-variant);
  border-radius: 14px;
  cursor: pointer;
  background: var(--surface-container-low);
  transition: all 0.22s ease;
}
.bf-pat:hover {
  border-color: rgba(76,102,43,0.32);
  background: var(--surface-container);
  transform: translateX(2px);
  box-shadow: 0 2px 10px rgba(26,28,22,0.05);
}
.bf-pat.sel {
  border-color: var(--primary);
  background: var(--primary-container);
  box-shadow: 0 2px 14px rgba(76,102,43,0.12);
  transform: translateX(2px);
}
.bf-pat-ic {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  flex-shrink: 0;
  background: var(--surface-container-high);
  color: var(--outline);
  display: grid;
  place-items: center;
  transition: all 0.22s;
}
.bf-pat-ic svg { width: 20px; height: 20px; }
.bf-pat.sel .bf-pat-ic {
  background: rgba(76,102,43,0.13);
  color: var(--primary);
}
.bf-pat-inf { flex: 1; min-width: 0; }
.bf-pat-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 1px;
  transition: color 0.2s;
}
.bf-pat.sel .bf-pat-name { color: var(--on-primary-container); }
.bf-pat-time {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--primary);
  margin-bottom: 3px;
}
.bf-pat.sel .bf-pat-time { color: var(--on-primary-container); opacity: 0.75; }
.bf-pat-desc {
  font-size: 11.5px;
  color: var(--outline);
  font-weight: 300;
  line-height: 1.45;
}
.bf-pat.sel .bf-pat-desc { color: var(--on-primary-container); opacity: 0.6; }
.bf-pat-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid var(--outline-variant);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all 0.22s;
}
.bf-pat.sel .bf-pat-radio {
  background: var(--primary);
  border-color: var(--primary);
}

/* ── BUTTONS ── */
.bf-btn-p {
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
  margin-top: 4px;
}
.bf-btn-p svg { width: 14px; height: 14px; }
.bf-btn-p:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(76,102,43,0.3);
  background: #3d5422;
}
.bf-btn-p:active { transform: translateY(0); }

.bf-btn-t {
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
  margin-top: 4px;
}
.bf-btn-t svg { width: 14px; height: 14px; }
.bf-btn-t:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(56,102,99,0.3);
  background: #2d5452;
}
.bf-btn-t:active { transform: translateY(0); }

.bf-btn-o {
  width: 100%;
  padding: 13px 20px;
  border: 1.5px solid var(--outline-variant);
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14.5px;
  font-weight: 500;
  background: var(--surface-container);
  color: var(--on-surface);
  cursor: pointer;
  transition: all 0.22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}
.bf-btn-o:hover {
  background: var(--surface-container-high);
  border-color: var(--outline);
  transform: translateY(-1px);
  box-shadow: 0 2px 10px rgba(26,28,22,0.06);
}

/* ════════════════════════════════════════════
   IMMERSIVE STAGE (step 4) — redesigned
   ════════════════════════════════════════════ */
.bf-stage {
  position: relative;
  min-height: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 24px;
  overflow: hidden;
  transition: background 1.6s ease;
}

/* Fine dot texture */
.bf-sdots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 0;
}

/* Three ambient glow orbs */
.bf-ga {
  position: absolute;
  width: 280px; height: 280px;
  top: -120px; left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  pointer-events: none;
  z-index: 0;
  transition: background 1.6s ease;
}
.bf-gb {
  position: absolute;
  width: 180px; height: 180px;
  bottom: -60px; left: -40px;
  border-radius: 50%;
  filter: blur(65px);
  opacity: 0.25;
  pointer-events: none;
  z-index: 0;
  transition: background 1.6s ease;
}
.bf-gc {
  position: absolute;
  width: 140px; height: 140px;
  bottom: -40px; right: -30px;
  border-radius: 50%;
  filter: blur(55px);
  opacity: 0.2;
  pointer-events: none;
  z-index: 0;
  transition: background 1.6s ease;
}

/* ── Top status strip ── */
.bf-stage-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 3;
  margin-bottom: 20px;
}
.bf-stimer {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 13px;
  border-radius: 20px;
  background: rgba(0,0,0,0.32);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.09);
  font-size: 12px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.6px;
}
.bf-spat {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.8px;
  padding: 5px 13px;
  border-radius: 20px;
  background: rgba(0,0,0,0.22);
  border: 1px solid rgba(255,255,255,0.07);
}

/* ── Orb ── */
.bf-orb-wrap {
  position: relative;
  width: 220px;
  height: 220px;
  z-index: 2;
  flex-shrink: 0;
}
.bf-orb-sc { position: absolute; inset: 0; }
.bf-orb-glow {
  position: absolute;
  inset: -50px;
  border-radius: 50%;
  filter: blur(65px);
  z-index: 0;
  transition: all 1.5s cubic-bezier(0.4,0,0.2,1);
}

/* Ripple rings */
.bf-rip {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
@keyframes ripOut { 0%  { transform:scale(0.95); opacity:0.45 } 100% { transform:scale(2.2); opacity:0 } }
@keyframes ripIn  { 0%  { transform:scale(1.9);  opacity:0.4  } 100% { transform:scale(0.82); opacity:0 } }
@keyframes ripHld { 0%,100% { transform:scale(1.05); opacity:0.2 } 50% { transform:scale(1.32); opacity:0.07 } }
.bf-rip.inhale          { animation: ripOut 3.5s ease-out infinite; }
.bf-rip.inhale.r2       { animation-delay: .9s; }
.bf-rip.inhale.r3       { animation-delay: 1.8s; }
.bf-rip.exhale          { animation: ripIn  4.5s ease-in infinite; }
.bf-rip.exhale.r2       { animation-delay: 1.2s; }
.bf-rip.exhale.r3       { animation-delay: 2.4s; }
.bf-rip.hold            { animation: ripHld 2.8s ease-in-out infinite; }
.bf-rip.hold.r2         { animation-delay: .9s; }
.bf-rip.hold.r3         { animation-delay: 1.8s; }

/* Orb sphere */
.bf-orb {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 16px 56px rgba(0,0,0,0.5),
    inset 0 -10px 28px rgba(0,0,0,0.18),
    inset 0 10px 32px rgba(255,255,255,0.09);
  transition: background 0.9s ease;
}
.bf-orb-shine {
  position: absolute;
  top: 9%; left: 16%;
  width: 40%; height: 30%;
  border-radius: 50%;
  background: rgba(255,255,255,0.13);
  filter: blur(14px);
  pointer-events: none;
}
.bf-orb-cnt {
  font-size: 72px;
  font-weight: 200;
  color: rgba(255,255,255,0.95);
  line-height: 1;
  z-index: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 4px 24px rgba(0,0,0,0.45);
  letter-spacing: -3px;
}

/* ── Phase label + arrow block ── */
.bf-phase-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 3;
}
.bf-orb-arr {
  width: 22px;
  height: 22px;
}
.bf-orb-arr svg { width: 22px; height: 22px; }
@keyframes floatUp  { 0%,100% { transform:translateY(0); opacity:0.65 } 50% { transform:translateY(-6px); opacity:1 } }
@keyframes floatDn  { 0%,100% { transform:translateY(0); opacity:0.65 } 50% { transform:translateY( 6px); opacity:1 } }
@keyframes pulseHld { 0%,100% { transform:scale(1);      opacity:0.45 } 50% { transform:scale(1.2);      opacity:0.9 } }
.bf-orb-arr.inhale { animation: floatUp  1.5s ease-in-out infinite; }
.bf-orb-arr.exhale { animation: floatDn  1.5s ease-in-out infinite; }
.bf-orb-arr.hold   { animation: pulseHld 2.2s ease-in-out infinite; }

.bf-phase-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.35rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  transition: color 0.6s ease;
}
.bf-hint {
  font-size: 12px;
  font-style: italic;
  font-weight: 300;
  text-align: center;
  letter-spacing: 0.2px;
  z-index: 3;
  margin: 0;
  opacity: 0.7;
  transition: color 0.6s ease;
  max-width: 240px;
}

/* ── Phase pill tabs ── */
.bf-phase-tabs {
  display: flex;
  gap: 8px;
  z-index: 3;
  width: 100%;
  justify-content: center;
  margin: 0;
}
.bf-ptab {
  flex: 1;
  max-width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 9px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.2);
  transition: all 0.4s ease;
}
.bf-ptab.on {
  border-width: 1.5px;
}
.bf-ptab-name {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  transition: color 0.4s ease;
}
.bf-ptab.on .bf-ptab-name {
  color: inherit;
}
.bf-ptab-sec {
  font-size: 16px;
  font-weight: 300;
  color: rgba(255,255,255,0.22);
  font-variant-numeric: tabular-nums;
  transition: color 0.4s ease;
}
.bf-ptab.on .bf-ptab-sec {
  color: inherit;
  font-weight: 400;
}

/* Finish button */
.bf-btn-stop {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 26px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1.5px solid;
  cursor: pointer;
  z-index: 3;
  transition: all 0.22s ease;
  letter-spacing: 0.3px;
}
.bf-btn-stop:hover {
  background: rgba(0,0,0,0.42);
  transform: translateY(-1px);
}

/* ── COMPLETE STEP ── */
.bf-done {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--primary);
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 18px rgba(76,102,43,0.3);
}
.bf-done svg { width: 26px; height: 26px; }

.bf-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 18px;
}
.bf-chip {
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
.bf-chip.pos {
  background: var(--primary-container);
  color: var(--on-primary-container);
  border-color: rgba(76,102,43,0.22);
}

.bf-insight {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--primary-container);
  border: 1.5px solid rgba(76,102,43,0.2);
  margin-bottom: 18px;
  text-align: left;
}
.bf-ins-h {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--on-primary-container);
  opacity: 0.7;
  margin-bottom: 3px;
}
.bf-ins-t {
  font-size: 13px;
  color: var(--on-primary-container);
  font-weight: 400;
  line-height: 1.55;
  margin: 0;
}

/* ── ENTER ANIMATIONS ── */
@keyframes bfIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bf-in  { animation: bfIn 0.38s ease-out both; }
.bf-d1  { animation-delay: 0.06s; }
.bf-d2  { animation-delay: 0.12s; }
.bf-d3  { animation-delay: 0.18s; }
.bf-d4  { animation-delay: 0.24s; }

/* ── RESPONSIVE ── */
@media (max-width: 480px) {
  .bf-card { border-radius: 16px; max-width: 100%; }
  .bf-body { padding: 18px 16px 22px; }
  .bf-title { font-size: 1.35rem; }
  .bf-feat-grid { gap: 6px; }
  .bf-feat { padding: 10px 5px; }
  .bf-feat-e { font-size: 16px; }
  .bf-feat-l { font-size: 10.5px; }
  .bf-feat-s { font-size: 9.5px; }
  .bf-pats { gap: 7px; }
  .bf-pat { padding: 12px 13px; gap: 11px; }
  .bf-pat-ic { width: 38px; height: 38px; }
  .bf-orb-wrap { width: 190px; height: 190px; }
  .bf-orb-cnt { font-size: 60px; }
  .bf-phase-name { font-size: 1.2rem; }
  .bf-stage { min-height: 490px; padding: 16px 16px 20px; }
  .bf-stage-top { margin-bottom: 0; }
  .bf-stimer { font-size: 11px; padding: 4px 10px; }
  .bf-hint { font-size: 11.5px; }
  .bf-ptab { padding: 7px 8px; }
  .bf-ptab-sec { font-size: 14px; }
  .bf-ptab-name { font-size: 9px; }
  .bf-hdr { padding: 12px 14px; }
  .bf-hdr-title { font-size: 0.95rem; }
  .bf-pbar { padding: 8px 14px; }
}

@media (max-width: 360px) {
  .bf-feat-grid { grid-template-columns: 1fr; gap: 5px; }
  .bf-feat { flex-direction: row; justify-content: flex-start; padding: 10px 12px; }
  .bf-feat-e { font-size: 18px; }
}
`;
