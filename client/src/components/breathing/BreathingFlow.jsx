import { useState, useEffect, useRef, useMemo } from "react";
import {
  startBreathingSession,
  completeBreathingSession,
} from "../../features/breathing/breathing.api";

const patterns = {
  "4-4-6": { inhale: 4, hold: 4, exhale: 6, label: "Relax", desc: "4-4-6" },
  box: { inhale: 4, hold: 4, exhale: 4, label: "Box Breathing", desc: "4-4-4" },
  extended: {
    inhale: 5,
    hold: 2,
    exhale: 7,
    label: "Extended Exhale",
    desc: "5-2-7",
  },
};

const patternIcons = {
  "4-4-6": (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 4C8.477 4 4 8.477 4 14s4.477 10 10 10 10-4.477 10-10S19.523 4 14 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M14 8v6l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  box: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect
        x="6"
        y="6"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="14"
        cy="14"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  ),
  extended: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M4 20c3-8 6-12 10-12s7 4 10 12"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 8V4M14 4l-2 2M14 4l2 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/* ── Floating Particles ── */
function FloatingParticles({ phase }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 15 + Math.random() * 70,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 2,
        drift: -20 + Math.random() * 40,
        baseY: 30 + Math.random() * 40,
      })),
    [],
  );

  const yShift = phase === "Inhale" ? -35 : phase === "Exhale" ? 35 : 0;
  const opacity = phase === "Hold" ? 0.55 : 0.35;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.baseY}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            opacity,
            transform: `translate(${p.drift * (phase === "Hold" ? 0.3 : 1)}px, ${yShift}px) scale(${phase === "Hold" ? 1.3 : 1})`,
            transition: `all ${phase === "Hold" ? "0.5s" : phase === "Inhale" ? "3.2s" : "4.2s"} cubic-bezier(0.4, 0, 0.2, 1)`,
            transitionDelay: `${p.delay * 0.25}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Circular Progress Arc ── */
function ProgressArc({ count, totalForPhase, color }) {
  const radius = 106;
  const circumference = 2 * Math.PI * radius;
  const progress =
    totalForPhase > 0 ? (totalForPhase - count) / totalForPhase : 0;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width="228"
      height="228"
      viewBox="0 0 228 228"
      style={{
        position: "absolute",
        top: -14,
        left: -14,
        transform: "rotate(-90deg)",
        zIndex: 1,
      }}
    >
      <circle
        cx="114"
        cy="114"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2.5"
      />
      <circle
        cx="114"
        cy="114"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s ease" }}
      />
      {/* Dot at the end of progress */}
      {progress > 0.02 && (
        <circle
          cx={114 + radius * Math.cos(2 * Math.PI * progress)}
          cy={114 + radius * Math.sin(2 * Math.PI * progress)}
          r="4"
          fill={color}
          style={{ transition: "all 1s linear" }}
        />
      )}
    </svg>
  );
}

export default function BreathingFlow({ sessionId = null, onComplete }) {
  const [step, setStep] = useState(1);
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [pattern, setPattern] = useState("4-4-6");

  const [phase, setPhase] = useState("Inhale");
  const [count, setCount] = useState(patterns["4-4-6"].inhale);
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [breathingSessionId, setBreathingSessionId] = useState(null);

  const timerRef = useRef(null);

  /* ---------- Visual Helpers ---------- */
  const getScale = () => {
    if (phase === "Inhale") return 1.2;
    if (phase === "Hold") return 1.2;
    return 0.78;
  };

  const phaseConfig = {
    Inhale: {
      bg: "linear-gradient(145deg, #5a9de6, #7db8f5, #93c5fd)",
      glow: "rgba(90,157,230,0.45)",
      arc: "rgba(255,255,255,0.75)",
      stageBg:
        "linear-gradient(170deg, #0f2640 0%, #183352 30%, #1a3a5c 60%, #162d48 100%)",
    },
    Hold: {
      bg: "linear-gradient(145deg, #e8c84a, #f5d97d, #fde68a)",
      glow: "rgba(232,200,74,0.4)",
      arc: "rgba(255,255,255,0.75)",
      stageBg:
        "linear-gradient(170deg, #2a2410 0%, #3d3520 30%, #4a4028 60%, #2e2815 100%)",
    },
    Exhale: {
      bg: "linear-gradient(145deg, #4abf6e, #6dd594, #86efac)",
      glow: "rgba(74,191,110,0.4)",
      arc: "rgba(255,255,255,0.75)",
      stageBg:
        "linear-gradient(170deg, #0f2e1e 0%, #183d2a 30%, #1e4a34 60%, #153526 100%)",
    },
  };

  const getTotalForPhase = () => {
    const p = patterns[pattern];
    if (phase === "Inhale") return p.inhale;
    if (phase === "Hold") return p.hold;
    return p.exhale;
  };

  /* ---------- START SESSION ---------- */
  const handleStartSession = async () => {
    const res = await startBreathingSession({
      sessionId,
      pattern,
      intensityBefore: before,
    });
    setBreathingSessionId(res.data.data._id);
    setStep(3);
  };

  /* ---------- BREATHING CYCLE ---------- */
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
      setCount((c) => c - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => {
    if (count > 0) return;
    const p = patterns[pattern];
    if (phase === "Inhale") {
      setPhase("Hold");
      setCount(p.hold);
    } else if (phase === "Hold") {
      setPhase("Exhale");
      setCount(p.exhale);
    } else {
      setPhase("Inhale");
      setCount(p.inhale);
    }
  }, [count, phase, pattern]);

  const beginBreathing = () => {
    setStep(4);
    const p = patterns[pattern];
    setPhase("Inhale");
    setCount(p.inhale);
    setRunning(true);
  };

  const finishBreathing = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setStep(5);
  };

  const saveSession = async () => {
    await completeBreathingSession({
      breathingSessionId,
      sessionId,
      pattern,
      durationSec: duration,
      intensityBefore: before,
      intensityAfter: after,
    });
    if (onComplete) onComplete();
    setStep(6);
  };

  /* ---------- Feeling Helpers ---------- */
  const feelingText = (val) => {
    if (val <= 3) return "Body feels calm & regulated";
    if (val <= 6) return "Some tension present";
    return "High stress / activation";
  };

  const feelingEmoji = (val) => {
    if (val <= 3) return "🌿";
    if (val <= 6) return "🌤";
    return "🔥";
  };

  /* ---------- Step Progress ---------- */
  const progressStep = step >= 6 ? 5 : step;

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* Ripple re-trigger key */
  const [rippleKey, setRippleKey] = useState(0);
  useEffect(() => {
    if (step === 4) setRippleKey((k) => k + 1);
  }, [phase, step]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        .bf-root {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(165deg, #f0f7ff 0%, #fafcff 40%, #f5faf7 100%);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 24px;
          max-width: 420px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
        }

        .bf-root::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(147,197,253,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .bf-inner {
          padding: 32px 28px;
          position: relative;
          z-index: 1;
        }

        .bf-progress-bar { display: flex; gap: 6px; margin-bottom: 28px; }
        .bf-progress-segment { flex: 1; height: 3px; border-radius: 4px; background: rgba(0,0,0,0.06); transition: background 0.5s ease; }
        .bf-progress-segment.active { background: linear-gradient(90deg, #6ba5e7, #81c995); }

        .bf-title { font-size: 22px; font-weight: 600; color: #1a2b3c; letter-spacing: -0.3px; margin: 0 0 4px 0; }
        .bf-subtitle { font-size: 14px; color: #7a8a9a; font-weight: 300; margin: 0 0 24px 0; }

        .bf-btn-primary {
          width: 100%; padding: 14px 24px; border: none; border-radius: 14px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          cursor: pointer; transition: all 0.25s ease;
          background: linear-gradient(135deg, #5b93d5 0%, #6ba5e7 100%);
          color: white; letter-spacing: 0.2px; box-shadow: 0 4px 14px rgba(91,147,213,0.25);
        }
        .bf-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(91,147,213,0.35); }
        .bf-btn-primary:active { transform: translateY(0); }
        .bf-btn-primary.green { background: linear-gradient(135deg, #5aad70 0%, #6bc985 100%); box-shadow: 0 4px 14px rgba(90,173,112,0.25); }
        .bf-btn-primary.green:hover { box-shadow: 0 6px 20px rgba(90,173,112,0.35); }

        .bf-btn-secondary {
          width: 100%; padding: 14px 24px; border: 1.5px solid rgba(0,0,0,0.08); border-radius: 14px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          cursor: pointer; background: white; color: #3a4a5a; transition: all 0.25s ease;
        }
        .bf-btn-secondary:hover { border-color: rgba(0,0,0,0.15); background: #fafbfc; }

        .bf-btn-stop {
          padding: 10px 32px; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8);
          transition: all 0.25s ease; backdrop-filter: blur(8px);
        }
        .bf-btn-stop:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4); }

        /* Slider */
        .bf-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 6px; outline: none; transition: background 0.3s ease; }
        .bf-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 0 0 3px currentColor; cursor: pointer; transition: box-shadow 0.2s ease; }
        .bf-slider::-webkit-slider-thumb:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.2), 0 0 0 4px currentColor; }
        .bf-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 0 0 3px currentColor; cursor: pointer; border: none; }

        /* Pattern Cards */
        .bf-pattern-card { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1.5px solid rgba(0,0,0,0.06); border-radius: 16px; cursor: pointer; transition: all 0.25s ease; background: white; }
        .bf-pattern-card:hover { border-color: rgba(91,147,213,0.25); background: rgba(240,247,255,0.5); }
        .bf-pattern-card.selected { border-color: rgba(91,147,213,0.45); background: linear-gradient(135deg, rgba(240,247,255,0.8) 0%, rgba(240,255,245,0.5) 100%); box-shadow: 0 2px 12px rgba(91,147,213,0.1); }
        .bf-pattern-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(91,147,213,0.08); color: #5b93d5; transition: all 0.25s ease; }
        .bf-pattern-card.selected .bf-pattern-icon { background: rgba(91,147,213,0.15); color: #4a82c4; }
        .bf-pattern-check { margin-left: auto; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.25s ease; }
        .bf-pattern-card.selected .bf-pattern-check { border-color: #5b93d5; background: #5b93d5; }

        /* ═══ IMMERSIVE BREATHING STAGE ═══ */
        .bf-breath-stage {
          position: relative;
          min-height: 460px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: -32px -28px;
          padding: 36px 28px;
          transition: background 1.4s ease;
          overflow: hidden;
        }

        .bf-orb-area {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }

        /* Ripples */
        @keyframes bf-ripple-expand {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes bf-ripple-contract {
          0% { transform: scale(1.8); opacity: 0.4; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        @keyframes bf-ripple-breathe {
          0%, 100% { transform: scale(1.1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.15; }
        }

        .bf-ripple {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .bf-ripple.inhale { animation: bf-ripple-expand 3.5s ease-out infinite; }
        .bf-ripple.inhale.r2 { animation-delay: 0.9s; }
        .bf-ripple.inhale.r3 { animation-delay: 1.8s; }

        .bf-ripple.exhale { animation: bf-ripple-contract 4.5s ease-in infinite; }
        .bf-ripple.exhale.r2 { animation-delay: 1.2s; }
        .bf-ripple.exhale.r3 { animation-delay: 2.4s; }

        .bf-ripple.hold { animation: bf-ripple-breathe 2.5s ease-in-out infinite; }
        .bf-ripple.hold.r2 { animation-delay: 0.8s; }
        .bf-ripple.hold.r3 { animation-delay: 1.6s; }

        /* Main orb */
        .bf-main-orb {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 8px 48px rgba(0,0,0,0.15),
            inset 0 -6px 24px rgba(0,0,0,0.08),
            inset 0 6px 24px rgba(255,255,255,0.25);
          overflow: hidden;
          z-index: 2;
          transition: background 0.8s ease;
        }

        .bf-main-orb::before {
          content: '';
          position: absolute;
          top: 10%;
          left: 18%;
          width: 38%;
          height: 28%;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          filter: blur(12px);
          pointer-events: none;
        }

        .bf-glow-layer {
          position: absolute;
          inset: -35px;
          border-radius: 50%;
          filter: blur(45px);
          z-index: 0;
          transition: all 1.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Direction arrows */
        @keyframes bf-float-up {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes bf-float-down {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(6px); opacity: 1; }
        }
        @keyframes bf-pulse-hold {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }

        .bf-dir.inhale { animation: bf-float-up 1.4s ease-in-out infinite; }
        .bf-dir.exhale { animation: bf-float-down 1.4s ease-in-out infinite; }
        .bf-dir.hold { animation: bf-pulse-hold 2s ease-in-out infinite; }

        /* Phase indicator dots */
        .bf-phase-indicator { display: flex; gap: 6px; align-items: center; }
        .bf-phase-pill {
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          transition: all 0.4s ease;
          color: rgba(255,255,255,0.35);
          background: transparent;
        }
        .bf-phase-pill.active {
          color: rgba(255,255,255,0.95);
          background: rgba(255,255,255,0.12);
        }

        /* Timer chip */
        .bf-timer-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(6px);
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.6);
          font-variant-numeric: tabular-nums;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .bf-feeling-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 24px; font-size: 14px; font-weight: 500; transition: all 0.3s ease; }

        .bf-success-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #5aad70, #6bc985); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 6px 20px rgba(90,173,112,0.25); }

        @keyframes bf-fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .bf-animate-in { animation: bf-fade-up 0.45s ease-out both; }
        .bf-animate-delay-1 { animation-delay: 0.08s; }
        .bf-animate-delay-2 { animation-delay: 0.16s; }
        .bf-animate-delay-3 { animation-delay: 0.24s; }
        .bf-animate-delay-4 { animation-delay: 0.32s; }
      `}</style>

      <div className="bf-root">
        <div className="bf-inner">
          {/* Progress Bar (hidden during breathing) */}
          {step < 6 && step !== 4 && (
            <div className="bf-progress-bar">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`bf-progress-segment ${s <= progressStep ? "active" : ""}`}
                />
              ))}
            </div>
          )}

          {/* ── STEP 1: Welcome ── */}
          {step === 1 && (
            <div className="bf-animate-in" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(91,147,213,0.1), rgba(107,201,133,0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: 32,
                }}
              >
                🫁
              </div>
              <h2 className="bf-title">Guided Breathing</h2>
              <p className="bf-subtitle">
                Take a moment to regulate your breathing and calm your body
              </p>
              <button onClick={() => setStep(2)} className="bf-btn-primary">
                Start Exercise
              </button>
            </div>
          )}

          {/* ── STEP 2: Before ── */}
          {step === 2 && (
            <div className="bf-animate-in">
              <h2 className="bf-title">How do you feel?</h2>
              <p className="bf-subtitle">Rate your current stress level</p>
              <div
                style={{
                  textAlign: "center",
                  fontSize: 48,
                  margin: "8px 0 4px",
                  lineHeight: 1,
                }}
                className="bf-animate-in bf-animate-delay-1"
              >
                {feelingEmoji(before)}
              </div>
              <div
                style={{ textAlign: "center", marginBottom: 24 }}
                className="bf-animate-in bf-animate-delay-1"
              >
                <span
                  className="bf-feeling-badge"
                  style={{
                    background:
                      before <= 3
                        ? "rgba(90,173,112,0.1)"
                        : before <= 6
                          ? "rgba(217,158,46,0.1)"
                          : "rgba(200,80,80,0.1)",
                    color:
                      before <= 3
                        ? "#3a8a52"
                        : before <= 6
                          ? "#a07a22"
                          : "#b54545",
                  }}
                >
                  {before}/10 · {feelingText(before)}
                </span>
              </div>
              <div
                style={{ padding: "0 4px", marginBottom: 28 }}
                className="bf-animate-in bf-animate-delay-2"
              >
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={before}
                  onChange={(e) => setBefore(Number(e.target.value))}
                  className="bf-slider"
                  style={{
                    background:
                      "linear-gradient(90deg, #5aad70 0%, #d4a32a 50%, #c55 100%)",
                    color:
                      before <= 3
                        ? "#5aad70"
                        : before <= 6
                          ? "#d4a32a"
                          : "#c55",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "#aab5c0",
                    marginTop: 8,
                    fontWeight: 300,
                  }}
                >
                  <span>Very Calm</span>
                  <span>Overwhelmed</span>
                </div>
              </div>
              <button
                onClick={handleStartSession}
                className="bf-btn-primary bf-animate-in bf-animate-delay-3"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── STEP 3: Pattern ── */}
          {step === 3 && (
            <div className="bf-animate-in">
              <h2 className="bf-title">Choose a technique</h2>
              <p className="bf-subtitle">
                Select a breathing pattern that suits you
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {Object.entries(patterns).map(([key, p], idx) => (
                  <div
                    key={key}
                    onClick={() => setPattern(key)}
                    className={`bf-pattern-card bf-animate-in bf-animate-delay-${idx + 1} ${pattern === key ? "selected" : ""}`}
                  >
                    <div className="bf-pattern-icon">{patternIcons[key]}</div>
                    <div>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: 15,
                          color: "#1a2b3c",
                        }}
                      >
                        {p.label}
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#8a9aaa", marginTop: 2 }}
                      >
                        Inhale {p.inhale}s · Hold {p.hold}s · Exhale {p.exhale}s
                      </div>
                    </div>
                    <div className="bf-pattern-check">
                      {pattern === key && (
                        <svg
                          width="12"
                          height="12"
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
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={beginBreathing}
                className="bf-btn-primary green bf-animate-in bf-animate-delay-4"
              >
                Begin Breathing
              </button>
            </div>
          )}

          {/* ══════ STEP 4: IMMERSIVE BREATHING ══════ */}
          {step === 4 && (
            <div
              className="bf-breath-stage"
              style={{ background: phaseConfig[phase].stageBg }}
            >
              {/* Ambient glow blobs */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  left: -70,
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: phaseConfig[phase].glow,
                  filter: "blur(70px)",
                  opacity: 0.4,
                  transition: "all 1.6s ease",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -40,
                  right: -60,
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: phaseConfig[phase].glow,
                  filter: "blur(70px)",
                  opacity: 0.25,
                  transition: "all 1.6s ease",
                  pointerEvents: "none",
                }}
              />

              {/* Timer */}
              <div style={{ marginBottom: 20, zIndex: 3 }}>
                <div className="bf-timer-chip">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle
                      cx="6"
                      cy="6"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.6"
                    />
                    <path
                      d="M6 3v3l2 1.5"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </svg>
                  {formatDuration(duration)}
                </div>
              </div>

              {/* Phase pills */}
              <div
                className="bf-phase-indicator"
                style={{ marginBottom: 24, zIndex: 3 }}
              >
                {["Inhale", "Hold", "Exhale"].map((p) => (
                  <div
                    key={p}
                    className={`bf-phase-pill ${phase === p ? "active" : ""}`}
                  >
                    {p}
                  </div>
                ))}
              </div>

              {/* ── ORB ── */}
              <div
                className="bf-orb-area"
                style={{
                  marginBottom: 28,
                  zIndex: 2,
                  transform: `scale(${getScale()})`,
                  transition: `transform ${phase === "Hold" ? "0.5s" : phase === "Inhale" ? "3s" : "4s"} cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              >
                {/* Glow */}
                <div
                  className="bf-glow-layer"
                  style={{ background: phaseConfig[phase].glow }}
                />

                {/* Progress Arc */}
                <ProgressArc
                  count={count}
                  totalForPhase={getTotalForPhase()}
                  color={phaseConfig[phase].arc}
                />

                {/* Ripple Rings */}
                {[1, 2, 3].map((n) => (
                  <div
                    key={`${rippleKey}-${n}`}
                    className={`bf-ripple ${phase.toLowerCase()} ${n === 2 ? "r2" : n === 3 ? "r3" : ""}`}
                    style={{
                      border: `1.5px solid ${
                        phase === "Inhale"
                          ? "rgba(125,184,245,0.3)"
                          : phase === "Hold"
                            ? "rgba(232,200,74,0.25)"
                            : "rgba(109,213,148,0.3)"
                      }`,
                    }}
                  />
                ))}

                {/* Main Orb */}
                <div
                  className="bf-main-orb"
                  style={{ background: phaseConfig[phase].bg }}
                >
                  <FloatingParticles phase={phase} />

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.75)",
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      marginBottom: 2,
                      zIndex: 1,
                    }}
                  >
                    {phase}
                  </div>
                  <div
                    style={{
                      fontSize: 52,
                      fontWeight: 300,
                      color: "white",
                      lineHeight: 1,
                      zIndex: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {count}
                  </div>
                  <div
                    className={`bf-dir ${phase.toLowerCase()}`}
                    style={{ marginTop: 6, zIndex: 1 }}
                  >
                    {phase === "Inhale" && (
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                      >
                        <path
                          d="M11 18V4"
                          stroke="rgba(255,255,255,0.75)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M5 10l6-6 6 6"
                          stroke="rgba(255,255,255,0.75)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {phase === "Hold" && (
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                      >
                        <rect
                          x="5.5"
                          y="5"
                          width="3.5"
                          height="12"
                          rx="1.5"
                          fill="rgba(255,255,255,0.6)"
                        />
                        <rect
                          x="13"
                          y="5"
                          width="3.5"
                          height="12"
                          rx="1.5"
                          fill="rgba(255,255,255,0.6)"
                        />
                      </svg>
                    )}
                    {phase === "Exhale" && (
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                      >
                        <path
                          d="M11 4v14"
                          stroke="rgba(255,255,255,0.75)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M5 12l6 6 6-6"
                          stroke="rgba(255,255,255,0.75)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Hint */}
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  minHeight: 22,
                  textAlign: "center",
                  marginBottom: 24,
                  zIndex: 3,
                  transition: "color 0.6s ease",
                }}
              >
                {phase === "Inhale" && "Breathe in slowly through your nose"}
                {phase === "Hold" && "Hold gently — no strain"}
                {phase === "Exhale" && "Release slowly through your mouth"}
              </p>

              {/* Finish */}
              <button
                onClick={finishBreathing}
                className="bf-btn-stop"
                style={{ zIndex: 3 }}
              >
                Finish Session
              </button>
            </div>
          )}

          {/* ── STEP 5: After ── */}
          {step === 5 && (
            <div className="bf-animate-in">
              <h2 className="bf-title">How do you feel now?</h2>
              <p className="bf-subtitle">
                Rate your stress level after breathing
              </p>
              <div
                style={{
                  textAlign: "center",
                  fontSize: 48,
                  margin: "8px 0 4px",
                  lineHeight: 1,
                }}
                className="bf-animate-in bf-animate-delay-1"
              >
                {feelingEmoji(after)}
              </div>
              <div
                style={{ textAlign: "center", marginBottom: 24 }}
                className="bf-animate-in bf-animate-delay-1"
              >
                <span
                  className="bf-feeling-badge"
                  style={{
                    background:
                      after <= 3
                        ? "rgba(90,173,112,0.1)"
                        : after <= 6
                          ? "rgba(217,158,46,0.1)"
                          : "rgba(200,80,80,0.1)",
                    color:
                      after <= 3
                        ? "#3a8a52"
                        : after <= 6
                          ? "#a07a22"
                          : "#b54545",
                  }}
                >
                  {after}/10 · {feelingText(after)}
                </span>
              </div>
              <div
                style={{ padding: "0 4px", marginBottom: 12 }}
                className="bf-animate-in bf-animate-delay-2"
              >
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={after}
                  onChange={(e) => setAfter(Number(e.target.value))}
                  className="bf-slider"
                  style={{
                    background:
                      "linear-gradient(90deg, #5aad70 0%, #d4a32a 50%, #c55 100%)",
                    color:
                      after <= 3 ? "#5aad70" : after <= 6 ? "#d4a32a" : "#c55",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "#aab5c0",
                    marginTop: 8,
                    fontWeight: 300,
                  }}
                >
                  <span>Very Calm</span>
                  <span>Overwhelmed</span>
                </div>
              </div>
              {before !== after && (
                <div
                  className="bf-animate-in bf-animate-delay-3"
                  style={{
                    textAlign: "center",
                    fontSize: 13,
                    color: after < before ? "#3a8a52" : "#8a9aaa",
                    marginBottom: 20,
                    fontWeight: 400,
                  }}
                >
                  {after < before
                    ? `↓ ${before - after} point${before - after > 1 ? "s" : ""} lower than before`
                    : after > before
                      ? `Stress went up by ${after - before}`
                      : ""}
                </div>
              )}
              <button
                onClick={saveSession}
                className="bf-btn-primary green bf-animate-in bf-animate-delay-3"
              >
                Save Session
              </button>
            </div>
          )}

          {/* ── STEP 6: Complete ── */}
          {step === 6 && (
            <div className="bf-animate-in" style={{ textAlign: "center" }}>
              <div className="bf-success-icon bf-animate-in">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M7 14.5L12 19.5L21 9.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="bf-title bf-animate-in bf-animate-delay-1">
                Session Complete
              </h2>
              <p
                className="bf-subtitle bf-animate-in bf-animate-delay-2"
                style={{ marginBottom: 8 }}
              >
                Great job taking time for yourself
              </p>
              <div
                className="bf-animate-in bf-animate-delay-2"
                style={{
                  display: "inline-flex",
                  gap: 20,
                  fontSize: 13,
                  color: "#7a8a9a",
                  marginBottom: 28,
                }}
              >
                <span>{formatDuration(duration)} total</span>
                <span>
                  {before > after
                    ? `${before} → ${after} stress`
                    : `${before} → ${after}`}
                </span>
              </div>
              <br />
              <button
                onClick={() => {
                  setStep(1);
                  setDuration(0);
                  setBefore(5);
                  setAfter(5);
                }}
                className="bf-btn-secondary bf-animate-in bf-animate-delay-3"
              >
                Start Another Session
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
