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
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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

/* ── Floating Particles (logic untouched) ── */
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
            background: "rgba(255,255,255,0.9)",
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

/* ── Circular Progress Arc (logic untouched) ── */
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
        stroke="rgba(255,255,255,0.1)"
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

  const getScale = () => (phase === "Exhale" ? 0.78 : 1.2);

  /* Phase configs — brand palette dark variants */
  const phaseConfig = {
    Inhale: {
      stageBg:
        "linear-gradient(170deg, #0E1A00 0%, #172B00 35%, #1F3700 65%, #152500 100%)",
      orbBg: "linear-gradient(145deg, #2A4500, #3D6300, #4C7A00)",
      glow: "rgba(76,102,43,0.7)",
      arc: "#CDEDA3",
      ripple: "rgba(177,209,138,0.3)",
      highlight: "rgba(177,209,138,0.2)",
      accent: "#CDEDA3",
      label: "rgba(177,209,138,0.8)",
    },
    Hold: {
      stageBg:
        "linear-gradient(170deg, #111A08 0%, #1C2B0D 35%, #253815 65%, #182410 100%)",
      orbBg: "linear-gradient(145deg, #263319, #384A28, #4A6036)",
      glow: "rgba(88,98,73,0.7)",
      arc: "#DCE7C8",
      ripple: "rgba(220,231,200,0.28)",
      highlight: "rgba(191,203,173,0.18)",
      accent: "#DCE7C8",
      label: "rgba(191,203,173,0.8)",
    },
    Exhale: {
      stageBg:
        "linear-gradient(170deg, #001614 0%, #002422 35%, #003230 65%, #001C1A 100%)",
      orbBg: "linear-gradient(145deg, #003330, #0D4845, #1F5C59)",
      glow: "rgba(56,102,99,0.7)",
      arc: "#BCECE7",
      ripple: "rgba(188,236,231,0.3)",
      highlight: "rgba(160,208,203,0.2)",
      accent: "#BCECE7",
      label: "rgba(160,208,203,0.8)",
    },
  };

  const getTotalForPhase = () => {
    const p = patterns[pattern];
    if (phase === "Inhale") return p.inhale;
    if (phase === "Hold") return p.hold;
    return p.exhale;
  };

  const handleStartSession = async () => {
    const res = await startBreathingSession({
      sessionId,
      pattern,
      intensityBefore: before,
    });
    setBreathingSessionId(res.data.data._id);
    setStep(3);
  };

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

  const feelingText = (val) => {
    if (val <= 3) return "Body feels calm & regulated";
    if (val <= 6) return "Some tension present";
    return "High stress / activation";
  };
  const feelingEmoji = (val) => (val <= 3 ? "🌿" : val <= 6 ? "🌤" : "🔥");
  const feelingColors = (val) => ({
    bg:
      val <= 3
        ? "var(--primary-container)"
        : val <= 6
          ? "#FEF3C7"
          : "var(--error-container)",
    text:
      val <= 3
        ? "var(--on-primary-container)"
        : val <= 6
          ? "#78350F"
          : "var(--on-error-container)",
  });

  const progressStep = step >= 6 ? 5 : step;
  const formatDuration = (sec) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  const [rippleKey, setRippleKey] = useState(0);
  useEffect(() => {
    if (step === 4) setRippleKey((k) => k + 1);
  }, [phase, step]);

  const cfg = phaseConfig[phase];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --primary:               #4C662B;
          --primary-container:     #CDEDA3;
          --on-primary:            #FFFFFF;
          --on-primary-container:  #354E16;
          --secondary:             #586249;
          --secondary-container:   #DCE7C8;
          --on-secondary-container:#404A33;
          --tertiary:              #386663;
          --tertiary-container:    #BCECE7;
          --on-tertiary-container: #1F4E4B;
          --error:                 #BA1A1A;
          --error-container:       #FFDAD6;
          --on-error-container:    #93000A;
          --background:            #F9FAEF;
          --on-background:         #1A1C16;
          --surface:               #F9FAEF;
          --on-surface:            #1A1C16;
          --on-surface-variant:    #44483D;
          --outline:               #75796C;
          --outline-variant:       #C5C8BA;
          --surface-container-low: #F3F4E9;
          --surface-container:     #EEEFE3;
          --surface-container-high:#E8E9DE;
          --surface-container-highest:#E2E3D8;
          --inverse-primary:       #B1D18A;
          --inverse-surface:       #2F312A;
          --inverse-on-surface:    #F1F2E6;
        }

        /* ════════════════════════════════
           ROOT CARD — matches app surface
        ════════════════════════════════ */
        .bf-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface);
          border: 1.5px solid var(--outline-variant);
          border-radius: 20px;
          max-width: 440px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 12px rgba(26,28,22,0.07), 0 4px 24px rgba(26,28,22,0.04);
        }

        /* Subtle top-right botanical glow — same as Login/Home panels */
        .bf-root::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(76,102,43,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .bf-inner {
          padding: 28px 26px;
          position: relative;
          z-index: 1;
        }

        /* ════════════════════════════════
           PROGRESS BAR
        ════════════════════════════════ */
        .bf-progress-bar {
          display: flex; gap: 5px; margin-bottom: 24px;
        }
        .bf-progress-segment {
          flex: 1; height: 3px; border-radius: 3px;
          background: var(--surface-container-highest);
          transition: background 0.5s ease;
        }
        .bf-progress-segment.active {
          background: linear-gradient(90deg, var(--primary), var(--tertiary));
        }

        /* ════════════════════════════════
           TYPOGRAPHY — matches app exactly
        ════════════════════════════════ */
        .bf-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--on-surface);
          letter-spacing: -0.3px;
          margin: 0 0 5px;
          line-height: 1.2;
        }
        .bf-subtitle {
          font-size: 14px;
          font-weight: 300;
          color: var(--outline);
          margin: 0 0 22px;
          line-height: 1.6;
        }

        /* ════════════════════════════════
           EYEBROW BADGE — same as Login/Home
        ════════════════════════════════ */
        .bf-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--primary-container);
          border: 1px solid rgba(76,102,43,0.2);
          border-radius: 100px;
          padding: 4px 12px 4px 9px;
          margin-bottom: 14px;
          width: fit-content;
        }
        .bf-eyebrow-dot {
          width: 6px; height: 6px;
          background: var(--primary);
          border-radius: 50%;
          animation: bfPulse 2.2s ease-in-out infinite;
        }
        .bf-eyebrow p {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--on-primary-container);
        }
        @keyframes bfPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* ════════════════════════════════
           WELCOME ICON — styled like Home cards
        ════════════════════════════════ */
        .bf-welcome-icon {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: var(--primary-container);
          border: 1.5px solid rgba(76,102,43,0.18);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          font-size: 28px;
        }

        /* ════════════════════════════════
           BUTTONS — exact app button style
        ════════════════════════════════ */
        .bf-btn-primary {
          width: 100%; padding: 13px 20px;
          border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          cursor: pointer; transition: all 0.22s ease;
          background: var(--primary);
          color: var(--on-primary);
          box-shadow: 0 2px 10px rgba(76,102,43,0.2);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .bf-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(76,102,43,0.28);
          background: #3d5422;
        }
        .bf-btn-primary:active { transform: translateY(0); }

        .bf-btn-teal {
          width: 100%; padding: 13px 20px;
          border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          cursor: pointer; transition: all 0.22s ease;
          background: var(--tertiary);
          color: #fff;
          box-shadow: 0 2px 10px rgba(56,102,99,0.2);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .bf-btn-teal:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(56,102,99,0.28);
          background: #2d5452;
        }
        .bf-btn-teal:active { transform: translateY(0); }

        .bf-btn-outline {
          width: 100%; padding: 13px 20px;
          border: 1.5px solid var(--outline-variant);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          cursor: pointer;
          background: var(--surface-container);
          color: var(--on-surface);
          transition: all 0.22s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .bf-btn-outline:hover {
          border-color: var(--outline);
          background: var(--surface-container-high);
          transform: translateY(-1px);
        }

        /* ════════════════════════════════
           SLIDER
        ════════════════════════════════ */
        .bf-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 5px; border-radius: 5px;
          outline: none; transition: background 0.3s;
        }
        .bf-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--surface);
          box-shadow: 0 1px 6px rgba(0,0,0,0.12), 0 0 0 2.5px currentColor;
          cursor: pointer; transition: box-shadow 0.2s;
        }
        .bf-slider::-webkit-slider-thumb:hover { box-shadow: 0 1px 8px rgba(0,0,0,0.18), 0 0 0 3.5px currentColor; }
        .bf-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--surface); border: none;
          box-shadow: 0 1px 6px rgba(0,0,0,0.12), 0 0 0 2.5px currentColor; cursor: pointer;
        }

        /* ════════════════════════════════
           FEELING BADGE
        ════════════════════════════════ */
        .bf-feeling-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 100px;
          font-size: 13.5px; font-weight: 500;
          transition: all 0.3s ease;
        }

        /* ════════════════════════════════
           PATTERN CARDS — matches Home card style
        ════════════════════════════════ */
        .bf-pattern-card {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          border: 1.5px solid var(--outline-variant);
          border-radius: 14px; cursor: pointer;
          transition: all 0.22s ease;
          background: var(--surface-container-low);
        }
        .bf-pattern-card:hover {
          border-color: rgba(76,102,43,0.3);
          background: var(--surface-container);
          transform: translateX(3px);
          box-shadow: 0 2px 8px rgba(76,102,43,0.06);
        }
        .bf-pattern-card.selected {
          border-color: var(--primary);
          background: var(--primary-container);
          box-shadow: 0 2px 12px rgba(76,102,43,0.12);
        }

        .bf-pattern-icon-wrap {
          width: 44px; height: 44px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          background: var(--surface-container-high);
          color: var(--outline);
          transition: all 0.22s ease;
        }
        .bf-pattern-card.selected .bf-pattern-icon-wrap {
          background: rgba(76,102,43,0.14);
          color: var(--primary);
        }

        .bf-pattern-title {
          font-size: 14.5px; font-weight: 500;
          color: var(--on-surface); transition: color 0.2s;
        }
        .bf-pattern-card.selected .bf-pattern-title { color: var(--on-primary-container); }

        .bf-pattern-sub {
          font-size: 12.5px; color: var(--outline); margin-top: 1px; transition: color 0.2s;
        }
        .bf-pattern-card.selected .bf-pattern-sub { color: var(--on-primary-container); opacity: 0.7; }

        .bf-pattern-check {
          margin-left: auto; width: 20px; height: 20px; border-radius: 50%;
          border: 1.5px solid var(--outline-variant);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: all 0.22s ease;
        }
        .bf-pattern-card.selected .bf-pattern-check { border-color: var(--primary); background: var(--primary); }

        /* ════════════════════════════════════════
           IMMERSIVE BREATHING STAGE
           — Dark variant of brand palette
           — Botanical ring motif from Login/Home
        ════════════════════════════════════════ */
        .bf-stage {
          position: relative; min-height: 480px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          margin: -28px -26px; padding: 40px 28px 36px;
          overflow: hidden; transition: background 1.4s ease;
        }

        /* Botanical dot grid — same technique as Login panel */
        .bf-stage-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 22px 22px;
          pointer-events: none; z-index: 0;
        }

        /* Botanical ring decorations — same motif as Login/Home hero */
        .bf-stage-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          pointer-events: none; z-index: 0;
        }

        /* Ambient glow blobs */
        .bf-blob {
          position: absolute; border-radius: 50%;
          filter: blur(70px); pointer-events: none; z-index: 0;
          transition: all 1.6s ease;
        }

        .bf-orb-area {
          position: relative; width: 200px; height: 200px; margin: 0 auto;
        }

        /* ── Ripple animations ── */
        @keyframes bfRippleExpand   { 0%{transform:scale(0.95);opacity:0.45} 100%{transform:scale(2.1);opacity:0} }
        @keyframes bfRippleContract { 0%{transform:scale(1.85);opacity:0.4}  100%{transform:scale(0.8);opacity:0} }
        @keyframes bfRippleBreathe  { 0%,100%{transform:scale(1.1);opacity:0.25} 50%{transform:scale(1.35);opacity:0.1} }

        .bf-ripple { position:absolute; inset:-5px; border-radius:50%; pointer-events:none; z-index:0; }
        .bf-ripple.inhale { animation: bfRippleExpand   3.5s ease-out  infinite; }
        .bf-ripple.inhale.r2 { animation-delay:.9s; }
        .bf-ripple.inhale.r3 { animation-delay:1.8s; }
        .bf-ripple.exhale { animation: bfRippleContract 4.5s ease-in   infinite; }
        .bf-ripple.exhale.r2 { animation-delay:1.2s; }
        .bf-ripple.exhale.r3 { animation-delay:2.4s; }
        .bf-ripple.hold   { animation: bfRippleBreathe  2.5s ease-in-out infinite; }
        .bf-ripple.hold.r2 { animation-delay:.8s; }
        .bf-ripple.hold.r3 { animation-delay:1.6s; }

        .bf-main-orb {
          position:absolute; inset:0; border-radius:50%;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          box-shadow: 0 12px 48px rgba(0,0,0,0.4), inset 0 -8px 24px rgba(0,0,0,0.15), inset 0 8px 28px rgba(255,255,255,0.08);
          overflow:hidden; z-index:2; transition: background 0.8s ease;
        }
        .bf-glow-layer {
          position:absolute; inset:-35px; border-radius:50%;
          filter:blur(50px); z-index:0;
          transition: all 1.4s cubic-bezier(0.4,0,0.2,1);
        }

        /* Direction arrows */
        @keyframes bfFloatUp   { 0%,100%{transform:translateY(0);opacity:0.7} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes bfFloatDown { 0%,100%{transform:translateY(0);opacity:0.7} 50%{transform:translateY(6px);opacity:1} }
        @keyframes bfPulseHold { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.2);opacity:0.9} }
        .bf-dir.inhale { animation: bfFloatUp   1.4s ease-in-out infinite; }
        .bf-dir.exhale { animation: bfFloatDown 1.4s ease-in-out infinite; }
        .bf-dir.hold   { animation: bfPulseHold 2s   ease-in-out infinite; }

        /* Phase pills */
        .bf-phase-indicator { display:flex; gap:6px; align-items:center; }
        .bf-phase-pill {
          padding: 4px 11px; border-radius: 9px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.8px; text-transform: uppercase;
          transition: all 0.4s ease;
          color: rgba(255,255,255,0.28); background: transparent;
          border: 1px solid transparent;
        }
        .bf-phase-pill.active {
          color: rgba(255,255,255,0.95);
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.14);
        }

        /* Timer chip */
        .bf-timer-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 13px; border-radius: 20px;
          background: rgba(0,0,0,0.25); backdrop-filter: blur(8px);
          font-size: 13px; font-weight: 400;
          font-variant-numeric: tabular-nums; letter-spacing: 0.4px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* Stop button */
        .bf-btn-stop {
          padding: 10px 28px;
          border: 1.5px solid rgba(255,255,255,0.18); border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; background: rgba(255,255,255,0.08); backdrop-filter: blur(8px);
          transition: all 0.22s ease;
        }
        .bf-btn-stop:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }

        /* Hint text */
        .bf-hint {
          font-size: 14px; font-weight: 300; font-style: italic;
          min-height: 22px; text-align: center; margin-bottom: 24px;
          z-index: 3; transition: color 0.6s ease, opacity 0.6s ease;
          letter-spacing: 0.1px;
        }

        /* ════════════════════════════════
           SUCCESS / COMPLETE
        ════════════════════════════════ */
        .bf-success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: var(--primary);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 4px 18px rgba(76,102,43,0.28);
        }

        .bf-summary-chips { display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap; justify-content:center; }
        .bf-chip {
          display:flex; align-items:center; gap:5px;
          padding:5px 12px; border-radius:100px;
          background:var(--surface-container-high);
          border:1px solid var(--outline-variant);
          color:var(--on-surface-variant);
          font-size:12px; font-weight:500;
        }
        .bf-chip.positive { background:var(--primary-container); color:var(--on-primary-container); border-color:rgba(76,102,43,0.18); }

        .bf-diff { text-align:center; font-size:13px; margin-bottom:18px; font-weight:500; display:flex; align-items:center; justify-content:center; gap:5px; }

        /* Section divider */
        .bf-divider { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
        .bf-divider-line { flex:1; height:1px; background:var(--outline-variant); }
        .bf-divider-label { font-size:11px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; color:var(--outline); }

        /* ════════════════════════════════
           ANIMATIONS
        ════════════════════════════════ */
        @keyframes bfFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .bf-in  { animation: bfFadeUp 0.42s ease-out both; }
        .bf-d1  { animation-delay: 0.07s; }
        .bf-d2  { animation-delay: 0.14s; }
        .bf-d3  { animation-delay: 0.21s; }
        .bf-d4  { animation-delay: 0.28s; }
      `}</style>

      <div className="bf-root">
        <div className="bf-inner">
          {/* ── Progress Bar (hidden during breathing stage) ── */}
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

          {/* ════════ STEP 1: Welcome ════════ */}
          {step === 1 && (
            <div className="bf-in" style={{ textAlign: "center" }}>
              <div className="bf-welcome-icon">🫁</div>
              <div className="bf-eyebrow" style={{ margin: "0 auto 14px" }}>
                <span className="bf-eyebrow-dot" />
                <p>Breathing Exercise</p>
              </div>
              <h2 className="bf-title">Guided Breathing</h2>
              <p className="bf-subtitle">
                Take a moment to regulate your breathing and calm your body
              </p>
              <button onClick={() => setStep(2)} className="bf-btn-primary">
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
                Start Exercise
              </button>
            </div>
          )}

          {/* ════════ STEP 2: Before ════════ */}
          {step === 2 && (
            <div className="bf-in">
              <h2 className="bf-title">How do you feel?</h2>
              <p className="bf-subtitle">
                Rate your current stress level before we begin
              </p>

              <div
                style={{
                  textAlign: "center",
                  fontSize: 44,
                  margin: "4px 0 8px",
                  lineHeight: 1,
                }}
                className="bf-in bf-d1"
              >
                {feelingEmoji(before)}
              </div>
              <div
                style={{ textAlign: "center", marginBottom: 20 }}
                className="bf-in bf-d1"
              >
                <span
                  className="bf-feeling-badge"
                  style={{
                    background: feelingColors(before).bg,
                    color: feelingColors(before).text,
                  }}
                >
                  {before}/10 · {feelingText(before)}
                </span>
              </div>

              <div
                style={{ padding: "0 4px", marginBottom: 24 }}
                className="bf-in bf-d2"
              >
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={before}
                  onChange={(e) => setBefore(Number(e.target.value))}
                  className="bf-slider"
                  style={{
                    background: `linear-gradient(90deg, var(--primary) 0%, #C5A000 50%, var(--error) 100%)`,
                    color:
                      before <= 3
                        ? "var(--primary)"
                        : before <= 6
                          ? "#C5A000"
                          : "var(--error)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "var(--outline)",
                    marginTop: 7,
                    fontWeight: 400,
                  }}
                >
                  <span>Very Calm</span>
                  <span>Overwhelmed</span>
                </div>
              </div>

              <button
                onClick={handleStartSession}
                className="bf-btn-primary bf-in bf-d3"
              >
                Continue
              </button>
            </div>
          )}

          {/* ════════ STEP 3: Pattern ════════ */}
          {step === 3 && (
            <div className="bf-in">
              <h2 className="bf-title">Choose a technique</h2>
              <p className="bf-subtitle">
                Select the breathing pattern that feels right for you
              </p>

              <div className="bf-divider">
                <div className="bf-divider-line" />
                <span className="bf-divider-label">3 patterns</span>
                <div className="bf-divider-line" />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  marginBottom: 22,
                }}
              >
                {Object.entries(patterns).map(([key, p], idx) => (
                  <div
                    key={key}
                    onClick={() => setPattern(key)}
                    className={`bf-pattern-card bf-in bf-d${idx + 1} ${pattern === key ? "selected" : ""}`}
                  >
                    <div className="bf-pattern-icon-wrap">
                      {patternIcons[key]}
                    </div>
                    <div>
                      <div className="bf-pattern-title">{p.label}</div>
                      <div className="bf-pattern-sub">
                        Inhale {p.inhale}s · Hold {p.hold}s · Exhale {p.exhale}s
                      </div>
                    </div>
                    <div className="bf-pattern-check">
                      {pattern === key && (
                        <svg
                          width="11"
                          height="11"
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
                className="bf-btn-teal bf-in bf-d4"
              >
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
                  <path d="M12 22a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 8.03 3 13a9 9 0 0 0 9 9z" />
                  <path d="M12 8v5l3 3" />
                </svg>
                Begin Breathing
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════
              STEP 4: IMMERSIVE STAGE
              Dark brand palette + botanical motifs
          ════════════════════════════════════════ */}
          {step === 4 && (
            <div className="bf-stage" style={{ background: cfg.stageBg }}>
              {/* Botanical dot grid */}
              <div className="bf-stage-dots" />

              {/* Botanical ring decorations — same motif as Login panel */}
              <div
                className="bf-stage-ring"
                style={{ width: 300, height: 300, top: -100, right: -100 }}
              />
              <div
                className="bf-stage-ring"
                style={{
                  width: 190,
                  height: 190,
                  top: -55,
                  right: -55,
                  borderColor: "rgba(255,255,255,0.04)",
                }}
              />
              <div
                className="bf-stage-ring"
                style={{
                  width: 130,
                  height: 130,
                  bottom: -50,
                  left: -50,
                  borderColor: "rgba(255,255,255,0.04)",
                }}
              />

              {/* Ambient blobs */}
              <div
                className="bf-blob"
                style={{
                  width: 220,
                  height: 220,
                  top: -60,
                  left: -80,
                  background: cfg.glow,
                  opacity: 0.55,
                }}
              />
              <div
                className="bf-blob"
                style={{
                  width: 180,
                  height: 180,
                  bottom: -50,
                  right: -60,
                  background: cfg.glow,
                  opacity: 0.3,
                }}
              />

              {/* Timer */}
              <div style={{ marginBottom: 20, zIndex: 3 }}>
                <div className="bf-timer-chip" style={{ color: cfg.accent }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle
                      cx="6"
                      cy="6"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                      opacity="0.7"
                    />
                    <path
                      d="M6 3v3l2 1.5"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      opacity="0.7"
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

              {/* ORB */}
              <div
                className="bf-orb-area"
                style={{
                  marginBottom: 28,
                  zIndex: 2,
                  transform: `scale(${getScale()})`,
                  transition: `transform ${phase === "Hold" ? "0.5s" : phase === "Inhale" ? "3s" : "4s"} cubic-bezier(0.4,0,0.2,1)`,
                }}
              >
                <div
                  className="bf-glow-layer"
                  style={{ background: cfg.glow }}
                />
                <ProgressArc
                  count={count}
                  totalForPhase={getTotalForPhase()}
                  color={cfg.arc}
                />

                {[1, 2, 3].map((n) => (
                  <div
                    key={`${rippleKey}-${n}`}
                    className={`bf-ripple ${phase.toLowerCase()}${n > 1 ? ` r${n}` : ""}`}
                    style={{ border: `1.5px solid ${cfg.ripple}` }}
                  />
                ))}

                <div className="bf-main-orb" style={{ background: cfg.orbBg }}>
                  {/* Orb shimmer highlight */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10%",
                      left: "18%",
                      width: "38%",
                      height: "28%",
                      borderRadius: "50%",
                      background: cfg.highlight,
                      filter: "blur(14px)",
                      pointerEvents: "none",
                    }}
                  />
                  <FloatingParticles phase={phase} />

                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: cfg.label,
                      letterSpacing: 2.5,
                      textTransform: "uppercase",
                      marginBottom: 4,
                      zIndex: 1,
                    }}
                  >
                    {phase}
                  </div>
                  <div
                    style={{
                      fontSize: 54,
                      fontWeight: 300,
                      color: "white",
                      lineHeight: 1,
                      zIndex: 1,
                      fontVariantNumeric: "tabular-nums",
                      textShadow: "0 2px 16px rgba(0,0,0,0.4)",
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
                className="bf-hint"
                style={{ color: cfg.accent, opacity: 0.72, zIndex: 3 }}
              >
                {phase === "Inhale" && "Breathe in slowly through your nose"}
                {phase === "Hold" && "Hold gently — no strain"}
                {phase === "Exhale" && "Release slowly through your mouth"}
              </p>

              <button
                onClick={finishBreathing}
                className="bf-btn-stop"
                style={{ zIndex: 3, color: cfg.accent }}
              >
                Finish Session
              </button>
            </div>
          )}

          {/* ════════ STEP 5: After ════════ */}
          {step === 5 && (
            <div className="bf-in">
              <h2 className="bf-title">How do you feel now?</h2>
              <p className="bf-subtitle">
                Rate your stress level after the session
              </p>

              <div
                style={{
                  textAlign: "center",
                  fontSize: 44,
                  margin: "4px 0 8px",
                  lineHeight: 1,
                }}
                className="bf-in bf-d1"
              >
                {feelingEmoji(after)}
              </div>
              <div
                style={{ textAlign: "center", marginBottom: 20 }}
                className="bf-in bf-d1"
              >
                <span
                  className="bf-feeling-badge"
                  style={{
                    background: feelingColors(after).bg,
                    color: feelingColors(after).text,
                  }}
                >
                  {after}/10 · {feelingText(after)}
                </span>
              </div>

              <div
                style={{ padding: "0 4px", marginBottom: 12 }}
                className="bf-in bf-d2"
              >
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={after}
                  onChange={(e) => setAfter(Number(e.target.value))}
                  className="bf-slider"
                  style={{
                    background: `linear-gradient(90deg, var(--primary) 0%, #C5A000 50%, var(--error) 100%)`,
                    color:
                      after <= 3
                        ? "var(--primary)"
                        : after <= 6
                          ? "#C5A000"
                          : "var(--error)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "var(--outline)",
                    marginTop: 7,
                    fontWeight: 400,
                  }}
                >
                  <span>Very Calm</span>
                  <span>Overwhelmed</span>
                </div>
              </div>

              {before !== after && (
                <div
                  className="bf-diff bf-in bf-d3"
                  style={{
                    color: after < before ? "var(--primary)" : "var(--outline)",
                  }}
                >
                  {after < before ? (
                    <>
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
                      {before - after} point{before - after > 1 ? "s" : ""}{" "}
                      lower than before
                    </>
                  ) : (
                    <>
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
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                      Stress went up by {after - before}
                    </>
                  )}
                </div>
              )}

              <button onClick={saveSession} className="bf-btn-teal bf-in bf-d3">
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

          {/* ════════ STEP 6: Complete ════════ */}
          {step === 6 && (
            <div className="bf-in" style={{ textAlign: "center" }}>
              <div className="bf-success-icon bf-in">
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
              <h2 className="bf-title bf-in bf-d1">Session Complete</h2>
              <p
                className="bf-subtitle bf-in bf-d2"
                style={{ marginBottom: 16 }}
              >
                Great job taking time for yourself
              </p>
              <div className="bf-summary-chips bf-in bf-d2">
                <div className="bf-chip">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {formatDuration(duration)} total
                </div>
                <div className={`bf-chip${before > after ? " positive" : ""}`}>
                  {before > after ? "↓ " : before < after ? "↑ " : ""}
                  {before} → {after} stress
                </div>
              </div>
              <button
                onClick={() => {
                  setStep(1);
                  setDuration(0);
                  setBefore(5);
                  setAfter(5);
                }}
                className="bf-btn-outline bf-in bf-d3"
              >
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
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                </svg>
                Start Another Session
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
