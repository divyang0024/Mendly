import { useEffect, useRef, useState } from "react";

export default function ReportNarrative({ text }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    // Vary speed slightly per character for organic feel
    const speeds = {
      " ": 18,
      ",": 120,
      ".": 160,
      "!": 160,
      "?": 160,
      "\n": 200,
    };
    const baseSpeed = 22;

    const tick = () => {
      if (indexRef.current >= text.length) {
        setDone(true);
        return;
      }

      const char = text[indexRef.current];
      setDisplayed((prev) => prev + char);
      indexRef.current += 1;

      const delay = speeds[char] ?? baseSpeed;
      rafRef.current = setTimeout(tick, delay);
    };

    rafRef.current = setTimeout(tick, 400); // small initial pause

    return () => clearTimeout(rafRef.current);
  }, [text]);

  if (!text) return null;

  return (
    <>
      <style>{rnStyles}</style>
      <div className="rn-wrap">
        {/* ── Header ── */}
        <div className="rn-header">
          <div className="rn-header-left">
            <div className="rn-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <span className="rn-title">Weekly Reflection</span>
          </div>

          <div className="rn-header-right">
            {/* Skip button — disappears when done */}
            {!done && (
              <button
                className="rn-skip"
                onClick={() => {
                  clearTimeout(rafRef.current);
                  setDisplayed(text);
                  setDone(true);
                }}
              >
                Skip
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="5 12 19 12" />
                  <polyline points="13 6 19 12 13 18" />
                </svg>
              </button>
            )}

            <div className="rn-badge">
              <span className="rn-badge-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226" />
                  <path d="M16.5 8.5c.49.49.74 1.13.74 1.78 0 1.07-.67 2-1.74 2.47" />
                  <path d="M9 7.5c-.6.55-.9 1.28-.9 2S8.4 11 9 11.5" />
                  <circle cx="12" cy="18" r="1" />
                  <path d="M12 15v2" />
                  <path d="M8.5 20.5c.97.32 2 .5 3.5.5s2.53-.18 3.5-.5" />
                </svg>
              </span>
              AI Summary
            </div>
          </div>
        </div>

        <div className="rn-body">
          <span className="rn-quote-mark">"</span>
          <p className="rn-text">
            {displayed}
            {!done && <span className="rn-cursor" />}
          </p>
        </div>

        <div className="rn-footer" />
      </div>
    </>
  );
}

const rnStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
  --tertiary:#386663;
}

/* ── CARD SHELL ── */
.rn-wrap {
  font-family:'DM Sans',sans-serif;
  background:var(--primary-container);
  border:1.5px solid var(--primary);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.1);
  color:var(--on-primary-container);
  animation:rnIn 0.4s ease-out both;
}
.rn-wrap::before {
  content:''; position:absolute;
  top:-50px; right:-50px; width:160px; height:160px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,0.12) 0%,transparent 70%);
  pointer-events:none;
}
.rn-wrap::after {
  content:''; position:absolute;
  bottom:-30px; left:-30px; width:120px; height:120px; border-radius:50%;
  background:radial-gradient(circle,rgba(177,209,138,0.15) 0%,transparent 70%);
  pointer-events:none;
}
@keyframes rnIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── HEADER ── */
.rn-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid rgba(76,102,43,0.2);
  background:rgba(76,102,43,0.08);
  position:relative; z-index:1; gap:10px; flex-wrap:wrap;
}
.rn-header-left  { display:flex; align-items:center; gap:10px; }
.rn-header-right { display:flex; align-items:center; gap:8px; }

.rn-icon {
  width:30px; height:30px; border-radius:9px;
  background:var(--primary); color:var(--on-primary);
  display:grid; place-items:center; flex-shrink:0;
}
.rn-icon svg { width:14px; height:14px; }
.rn-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400; color:var(--on-primary-container);
}

/* Skip button */
.rn-skip {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px 3px 12px; border-radius:100px; cursor:pointer;
  background:transparent; border:1px solid rgba(76,102,43,0.3);
  font-size:11px; font-weight:500; color:var(--on-primary-container);
  font-family:'DM Sans',sans-serif;
  transition:background 0.15s, border-color 0.15s;
}
.rn-skip:hover { background:rgba(76,102,43,0.1); border-color:rgba(76,102,43,0.5); }
.rn-skip svg { width:11px; height:11px; }

.rn-badge {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px 3px 7px; border-radius:100px;
  background:rgba(76,102,43,0.12);
  border:1px solid rgba(76,102,43,0.2);
  font-size:11px; font-weight:500;
  color:var(--on-primary-container);
}
.rn-badge-icon { width:13px; height:13px; display:flex; align-items:center; flex-shrink:0; }
.rn-badge-icon svg { width:13px; height:13px; }

/* ── BODY ── */
.rn-body { padding:20px 20px 24px; position:relative; z-index:1; }
.rn-quote-mark {
  font-family:'Playfair Display',serif;
  font-size:4rem; line-height:0.6;
  color:var(--primary); opacity:0.3;
  display:block; margin-bottom:8px;
  user-select:none;
}
.rn-text {
  font-size:14px; color:var(--on-primary-container);
  white-space:pre-line; line-height:1.75;
  font-weight:300; margin:0;
}

/* Blinking cursor */
.rn-cursor {
  display:inline-block;
  width:2px; height:1em;
  background:var(--primary);
  margin-left:2px;
  vertical-align:text-bottom;
  border-radius:1px;
  animation:rnBlink 0.75s step-end infinite;
}
@keyframes rnBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── FOOTER accent bar ── */
.rn-footer {
  height:4px;
  background:linear-gradient(90deg, var(--primary) 0%, var(--tertiary) 100%);
}

@media(max-width:480px) {
  .rn-wrap { border-radius:16px; }
  .rn-body { padding:16px 16px 20px; }
}
`;
