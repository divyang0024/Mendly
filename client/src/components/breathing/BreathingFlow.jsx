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
  // CSS animation drives the arc — it runs 0→full over exactly `total` seconds.
  // Remounting via key resets it cleanly on every phase change.
  const animName = `arcFill_${phaseKey}`;
  const style = `@keyframes ${animName} { from { stroke-dashoffset: ${C.toFixed(2)}; } to { stroke-dashoffset: 0; } }`;
  return (
    <svg
      width="232"
      height="232"
      viewBox="0 0 232 232"
      style={{
        position: "absolute",
        top: -16,
        left: -16,
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

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const fMeta = (v) => ({
  emoji: v <= 3 ? "🌿" : v <= 6 ? "🌤" : "🔥",
  label:
    v <= 3
      ? "Body feels calm"
      : v <= 6
        ? "Some tension present"
        : "High activation",
  bg: v <= 3 ? "#CDEDA3" : v <= 6 ? "#FEF3C7" : "#FFDAD6",
  text: v <= 3 ? "#354E16" : v <= 6 ? "#78350F" : "#93000A",
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
  // Refs keep the interval callback up-to-date without stale closures
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
        // When count would reach 0, transition phase immediately so 0 is never rendered
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
            <div className="bf-welcome-ic">🫁</div>
            <div className="bf-eyebrow" style={{ margin: "0 auto 14px" }}>
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
                ["🎯", "3 techniques", "Choose your pattern"],
                ["📊", "Track progress", "Before & after mood"],
                ["⏱", "Your pace", "Stop whenever ready"],
              ].map(([e, l, s]) => (
                <div className="bf-feat" key={l}>
                  <span className="bf-feat-e">{e}</span>
                  <span className="bf-feat-l">{l}</span>
                  <span className="bf-feat-s">{s}</span>
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
                <h2 className="bf-title">How do you feel?</h2>
                <p className="bf-sub">
                  Rate your current stress level so we can track your
                  improvement.
                </p>
                <div className="bf-emoji bf-d1">{fm.emoji}</div>
                <div
                  className="bf-fchip bf-d1"
                  style={{ background: fm.bg, color: fm.text }}
                >
                  <span className="bf-fval">{before}/10</span>
                  <span className="bf-fdot" />
                  {fm.label}
                </div>
                <div className="bf-slwrap bf-d2">
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
                    <span>Very Calm</span>
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
            <div className="bf-sdots" />
            <div className="bf-sr r1" />
            <div className="bf-sr r2" />
            <div className="bf-sr r3" />
            <div className="bf-ga" style={{ background: cfg.glow }} />
            <div className="bf-gb" style={{ background: cfg.glow }} />

            {/* Top bar */}
            <div className="bf-stage-top">
              <div className="bf-stimer" style={{ color: cfg.accent }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                    opacity=".6"
                  />
                  <path
                    d="M6 3v3l2 1.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity=".6"
                  />
                </svg>
                {fmt(dur)}
              </div>
              <div className="bf-spills">
                {PHASE_SEQ.map((ph) => (
                  <div
                    key={ph}
                    className={`bf-spill${phase === ph ? " on" : ""}`}
                  >
                    {ph}
                  </div>
                ))}
              </div>
              <div className="bf-spat" style={{ color: cfg.accent }}>
                {pat.timing}
              </div>
            </div>

            {/* Orb */}
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
                  <span className="bf-orb-ph" style={{ color: cfg.label }}>
                    {phase}
                  </span>
                  <span className="bf-orb-cnt">{count}</span>
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
                </div>
              </div>
            </div>

            <p className="bf-hint" style={{ color: cfg.accent }}>
              {cfg.hint}
            </p>

            {/* Phase ratio bar */}
            <div className="bf-phasebar">
              {PHASE_SEQ.map((ph) => {
                const tp =
                  ph === "Inhale"
                    ? pat.inhale
                    : ph === "Hold"
                      ? pat.hold
                      : pat.exhale;
                const tot = pat.inhale + pat.hold + pat.exhale;
                return (
                  <div
                    key={ph}
                    className={`bf-pbseg${phase === ph ? " on" : ""}`}
                    style={{ flex: tp / tot }}
                  >
                    <div
                      className="bf-pbfill"
                      style={{ background: STAGE[ph].arc }}
                    />
                    <span className="bf-pblbl" style={{ color: STAGE[ph].arc }}>
                      {ph}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              className="bf-btn-stop"
              style={{ color: cfg.accent, borderColor: `${cfg.arc}35` }}
              onClick={finish}
            >
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
                <div className="bf-emoji bf-d1">{fm.emoji}</div>
                <div
                  className="bf-fchip bf-d1"
                  style={{ background: fm.bg, color: fm.text }}
                >
                  <span className="bf-fval">{after}/10</span>
                  <span className="bf-fdot" />
                  {fm.label}
                </div>
                <div className="bf-slwrap bf-d2">
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
                    <span>Very Calm</span>
                    <span>Overwhelmed</span>
                  </div>
                </div>
                {before !== after && (
                  <div
                    className="bf-diff bf-d2"
                    style={{
                      background: diff > 0 ? "#CDEDA3" : "#FFDAD6",
                      color: diff > 0 ? "#354E16" : "#93000A",
                    }}
                  >
                    <span>{diff > 0 ? "🌿" : "🔥"}</span>
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
                <span style={{ fontSize: 22 }}>🌿</span>
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

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
  --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
  --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
  --error:#BA1A1A;--error-container:#FFDAD6;--on-error-container:#93000A;
  --on-surface:#1A1C16;--on-surface-variant:#44483D;
  --outline:#75796C;--outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
  --inverse-primary:#B1D18A;
}
/* CARD */
.bf-card{font-family:'DM Sans',sans-serif;background:var(--surface-container-low);border:1.5px solid var(--outline-variant);border-radius:20px;overflow:hidden;position:relative;box-shadow:0 1px 12px rgba(26,28,22,0.07);color:var(--on-surface);max-width:420px;margin:0 auto;}
.bf-blob{position:absolute;top:-48px;right:-48px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);pointer-events:none;z-index:0;}
/* HEADER */
.bf-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--outline-variant);background:var(--surface-container);position:relative;z-index:1;}
.bf-hdr-l{display:flex;align-items:center;gap:10px;}
.bf-hdr-ic{width:30px;height:30px;border-radius:9px;background:var(--tertiary-container);color:var(--on-tertiary-container);display:grid;place-items:center;}
.bf-hdr-ic svg{width:14px;height:14px;}
.bf-hdr-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--on-surface);}
.bf-hdr-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:100px;background:var(--surface-container-highest);border:1px solid var(--outline-variant);font-size:11px;font-weight:500;color:var(--outline);}
/* PROGRESS */
.bf-pbar{display:flex;gap:4px;padding:10px 18px;background:var(--surface-container);border-bottom:1px solid var(--outline-variant);position:relative;z-index:1;}
.bf-pseg{flex:1;height:3px;border-radius:3px;background:var(--surface-container-highest);transition:background 0.5s;}
.bf-pseg.on{background:linear-gradient(90deg,var(--primary),var(--tertiary));}
/* BODY */
.bf-body{padding:22px 20px 24px;position:relative;z-index:1;display:flex;flex-direction:column;}
/* EYEBROW */
.bf-eyebrow{display:inline-flex;align-items:center;gap:7px;background:var(--primary-container);border:1px solid rgba(76,102,43,0.2);border-radius:100px;padding:4px 12px 4px 9px;width:fit-content;}
.bf-ey-dot{width:6px;height:6px;background:var(--primary);border-radius:50%;animation:bfPulse 2.2s ease-in-out infinite;}
.bf-eyebrow p{font-size:11px;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;color:var(--on-primary-container);}
@keyframes bfPulse{0%,100%{opacity:1}50%{opacity:0.35}}
/* STEP EYEBROW */
.bf-step-ey{display:inline-flex;align-items:center;gap:8px;margin-bottom:12px;}
.bf-sn{width:20px;height:20px;border-radius:50%;background:var(--primary);color:var(--on-primary);font-size:11px;font-weight:600;display:grid;place-items:center;}
.bf-step-lbl{font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:var(--outline);}
/* TYPE */
.bf-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:400;color:var(--on-surface);letter-spacing:-0.3px;margin-bottom:6px;line-height:1.2;}
.bf-sub{font-size:13.5px;font-weight:300;color:var(--outline);line-height:1.65;margin-bottom:20px;}
/* WELCOME ICON */
.bf-welcome-ic{width:64px;height:64px;border-radius:18px;background:var(--primary-container);border:1.5px solid rgba(76,102,43,0.18);display:grid;place-items:center;font-size:30px;margin:0 auto 16px;}
/* FEATURE GRID */
.bf-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:22px;}
.bf-feat{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;border-radius:14px;background:var(--surface-container);border:1px solid var(--outline-variant);text-align:center;}
.bf-feat-e{font-size:18px;line-height:1;}
.bf-feat-l{font-size:11.5px;font-weight:600;color:var(--on-surface);}
.bf-feat-s{font-size:10.5px;color:var(--outline);font-weight:300;}
/* EMOJI */
.bf-emoji{font-size:44px;line-height:1;text-align:center;margin:0 auto 10px;}
/* FEELING CHIP */
.bf-fchip{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;border-radius:100px;font-size:13.5px;font-weight:500;margin:0 auto 20px;transition:all 0.3s;}
.bf-fval{font-weight:700;}
.bf-fdot{width:3px;height:3px;border-radius:50%;background:currentColor;opacity:0.5;}
/* SLIDER */
.bf-slwrap{margin-bottom:20px;}
.bf-sl{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:5px;outline:none;background:linear-gradient(90deg,var(--f,var(--primary)) var(--t,44%),var(--surface-container-highest) var(--t,44%));transition:background 0.3s;}
.bf-sl::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:white;box-shadow:0 1px 6px rgba(0,0,0,0.14),0 0 0 2.5px var(--f,var(--primary));cursor:pointer;transition:box-shadow 0.2s;}
.bf-sl::-webkit-slider-thumb:hover{box-shadow:0 1px 8px rgba(0,0,0,0.2),0 0 0 3.5px var(--f,var(--primary));}
.bf-sllbl{display:flex;justify-content:space-between;font-size:11.5px;color:var(--outline);margin-top:7px;}
/* DIFF */
.bf-diff{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:12px;font-size:13px;font-weight:500;margin-bottom:18px;}
.bf-diff-b{margin-left:auto;font-size:12px;opacity:0.7;font-variant-numeric:tabular-nums;}
/* PATTERN CARDS */
.bf-pats{display:flex;flex-direction:column;gap:9px;margin-bottom:22px;}
.bf-pat{display:flex;align-items:flex-start;gap:13px;padding:14px 15px;border:1.5px solid var(--outline-variant);border-radius:14px;cursor:pointer;background:var(--surface-container-low);transition:all 0.22s;}
.bf-pat:hover{border-color:rgba(76,102,43,0.3);background:var(--surface-container);transform:translateX(2px);}
.bf-pat.sel{border-color:var(--primary);background:var(--primary-container);box-shadow:0 2px 12px rgba(76,102,43,0.1);}
.bf-pat-ic{width:42px;height:42px;border-radius:11px;flex-shrink:0;background:var(--surface-container-high);color:var(--outline);display:grid;place-items:center;transition:all 0.22s;}
.bf-pat-ic svg{width:20px;height:20px;}
.bf-pat.sel .bf-pat-ic{background:rgba(76,102,43,0.12);color:var(--primary);}
.bf-pat-inf{flex:1;}
.bf-pat-name{font-size:14px;font-weight:600;color:var(--on-surface);margin-bottom:1px;transition:color 0.2s;}
.bf-pat.sel .bf-pat-name{color:var(--on-primary-container);}
.bf-pat-time{font-size:12px;font-weight:700;letter-spacing:0.08em;color:var(--primary);margin-bottom:3px;}
.bf-pat.sel .bf-pat-time{color:var(--on-primary-container);opacity:0.8;}
.bf-pat-desc{font-size:11.5px;color:var(--outline);font-weight:300;line-height:1.4;}
.bf-pat.sel .bf-pat-desc{color:var(--on-primary-container);opacity:0.65;}
.bf-pat-radio{width:20px;height:20px;border-radius:50%;border:1.5px solid var(--outline-variant);display:grid;place-items:center;flex-shrink:0;margin-top:1px;transition:all 0.22s;}
.bf-pat.sel .bf-pat-radio{background:var(--primary);border-color:var(--primary);}
/* BUTTONS */
.bf-btn-p{width:100%;padding:13px 20px;border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14.5px;font-weight:500;background:var(--primary);color:var(--on-primary);cursor:pointer;transition:all 0.22s;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 2px 10px rgba(76,102,43,0.2);margin-top:4px;}
.bf-btn-p svg{width:14px;height:14px;}
.bf-btn-p:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(76,102,43,0.28);background:#3d5422;}
.bf-btn-t{width:100%;padding:13px 20px;border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14.5px;font-weight:500;background:var(--tertiary);color:#fff;cursor:pointer;transition:all 0.22s;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 2px 10px rgba(56,102,99,0.2);margin-top:4px;}
.bf-btn-t svg{width:14px;height:14px;}
.bf-btn-t:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(56,102,99,0.28);background:#2d5452;}
.bf-btn-o{width:100%;padding:13px 20px;border:1.5px solid var(--outline-variant);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14.5px;font-weight:500;background:var(--surface-container);color:var(--on-surface);cursor:pointer;transition:all 0.22s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;}
.bf-btn-o:hover{background:var(--surface-container-high);border-color:var(--outline);transform:translateY(-1px);}
/* STAGE */
.bf-stage{position:relative;min-height:500px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 22px 28px;overflow:hidden;transition:background 1.4s;}
.bf-sdots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.035) 1px,transparent 1px);background-size:22px 22px;pointer-events:none;z-index:0;}
.bf-sr{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,0.055);pointer-events:none;z-index:0;}
.bf-sr.r1{width:340px;height:340px;top:-130px;right:-110px;}
.bf-sr.r2{width:200px;height:200px;top:-70px;right:-65px;border-color:rgba(255,255,255,0.03);}
.bf-sr.r3{width:130px;height:130px;bottom:-55px;left:-55px;border-color:rgba(255,255,255,0.035);}
.bf-ga{position:absolute;width:220px;height:220px;top:-70px;left:-80px;border-radius:50%;filter:blur(70px);opacity:0.5;pointer-events:none;z-index:0;transition:background 1.4s;}
.bf-gb{position:absolute;width:160px;height:160px;bottom:-55px;right:-55px;border-radius:50%;filter:blur(60px);opacity:0.3;pointer-events:none;z-index:0;transition:background 1.4s;}
.bf-stage-top{display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:24px;z-index:3;}
.bf-stimer{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;background:rgba(0,0,0,0.25);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.07);font-size:12.5px;font-weight:400;font-variant-numeric:tabular-nums;letter-spacing:0.4px;}
.bf-spills{display:flex;gap:5px;}
.bf-spill{padding:4px 10px;border-radius:8px;font-size:10.5px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:rgba(255,255,255,0.22);border:1px solid transparent;transition:all 0.4s;}
.bf-spill.on{color:rgba(255,255,255,0.92);background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.12);}
.bf-spat{font-size:12px;font-weight:500;letter-spacing:1px;opacity:0.7;}
/* ORB */
.bf-orb-wrap{position:relative;width:200px;height:200px;z-index:2;margin-bottom:22px;}
.bf-orb-sc{position:absolute;inset:0;}
.bf-orb-glow{position:absolute;inset:-40px;border-radius:50%;filter:blur(55px);z-index:0;transition:all 1.5s cubic-bezier(0.4,0,0.2,1);}
.bf-rip{position:absolute;inset:-5px;border-radius:50%;pointer-events:none;z-index:0;}
@keyframes ripOut{0%{transform:scale(0.95);opacity:0.45}100%{transform:scale(2.2);opacity:0}}
@keyframes ripIn {0%{transform:scale(1.9);opacity:0.4}100%{transform:scale(0.82);opacity:0}}
@keyframes ripHld{0%,100%{transform:scale(1.1);opacity:0.22}50%{transform:scale(1.38);opacity:0.08}}
.bf-rip.inhale{animation:ripOut 3.5s ease-out infinite;}
.bf-rip.inhale.r2{animation-delay:.9s;}
.bf-rip.inhale.r3{animation-delay:1.8s;}
.bf-rip.exhale{animation:ripIn 4.5s ease-in infinite;}
.bf-rip.exhale.r2{animation-delay:1.2s;}
.bf-rip.exhale.r3{animation-delay:2.4s;}
.bf-rip.hold{animation:ripHld 2.5s ease-in-out infinite;}
.bf-rip.hold.r2{animation-delay:.8s;}
.bf-rip.hold.r3{animation-delay:1.6s;}
.bf-orb{position:absolute;inset:0;border-radius:50%;overflow:hidden;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 12px 48px rgba(0,0,0,0.4),inset 0 -8px 24px rgba(0,0,0,0.15),inset 0 8px 28px rgba(255,255,255,0.08);transition:background 0.8s;}
.bf-orb-shine{position:absolute;top:10%;left:18%;width:38%;height:28%;border-radius:50%;background:rgba(255,255,255,0.12);filter:blur(12px);pointer-events:none;}
.bf-orb-ph{font-size:10.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:2px;z-index:1;}
.bf-orb-cnt{font-size:56px;font-weight:300;color:white;line-height:1;z-index:1;font-variant-numeric:tabular-nums;text-shadow:0 2px 16px rgba(0,0,0,0.4);}
.bf-orb-arr{width:24px;height:24px;margin-top:5px;z-index:1;}
.bf-orb-arr svg{width:24px;height:24px;}
@keyframes floatUp{0%,100%{transform:translateY(0);opacity:0.7}50%{transform:translateY(-5px);opacity:1}}
@keyframes floatDn{0%,100%{transform:translateY(0);opacity:0.7}50%{transform:translateY(5px);opacity:1}}
@keyframes pulseHld{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.18);opacity:0.9}}
.bf-orb-arr.inhale{animation:floatUp 1.4s ease-in-out infinite;}
.bf-orb-arr.exhale{animation:floatDn 1.4s ease-in-out infinite;}
.bf-orb-arr.hold  {animation:pulseHld 2s ease-in-out infinite;}
.bf-hint{font-size:13.5px;font-style:italic;font-weight:300;text-align:center;letter-spacing:0.1px;z-index:3;min-height:20px;margin-bottom:16px;transition:color 0.6s;}
.bf-phasebar{display:flex;width:100%;max-width:260px;height:4px;border-radius:4px;overflow:hidden;gap:3px;margin-bottom:20px;z-index:3;}
.bf-pbseg{position:relative;display:flex;flex-direction:column;border-radius:4px;overflow:hidden;}
.bf-pbfill{position:absolute;inset:0;opacity:0.2;transition:opacity 0.4s;}
.bf-pbseg.on .bf-pbfill{opacity:1;}
.bf-pblbl{position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;white-space:nowrap;opacity:0;transition:opacity 0.4s;}
.bf-pbseg.on .bf-pblbl{opacity:0.7;}
.bf-btn-stop{padding:10px 28px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;background:rgba(255,255,255,0.07);backdrop-filter:blur(8px);border:1.5px solid;cursor:pointer;z-index:3;transition:all 0.22s;}
.bf-btn-stop:hover{background:rgba(255,255,255,0.14);}
/* COMPLETE */
.bf-done{width:64px;height:64px;border-radius:50%;background:var(--primary);display:grid;place-items:center;margin:0 auto 16px;box-shadow:0 4px 18px rgba(76,102,43,0.28);}
.bf-done svg{width:26px;height:26px;}
.bf-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:18px;}
.bf-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 13px;border-radius:100px;background:var(--surface-container-high);border:1px solid var(--outline-variant);color:var(--on-surface-variant);font-size:12.5px;font-weight:500;}
.bf-chip.pos{background:var(--primary-container);color:var(--on-primary-container);border-color:rgba(76,102,43,0.2);}
.bf-insight{display:flex;align-items:flex-start;gap:12px;padding:14px 15px;border-radius:14px;background:var(--primary-container);border:1.5px solid rgba(76,102,43,0.2);margin-bottom:18px;text-align:left;}
.bf-ins-h{font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--on-primary-container);opacity:0.7;margin-bottom:3px;}
.bf-ins-t{font-size:13px;color:var(--on-primary-container);font-weight:400;line-height:1.55;margin:0;}
/* ANIMATIONS */
@keyframes bfIn{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
.bf-in{animation:bfIn 0.4s ease-out both;}
.bf-d1{animation-delay:0.06s}.bf-d2{animation-delay:0.12s}.bf-d3{animation-delay:0.18s}.bf-d4{animation-delay:0.24s}
`;
