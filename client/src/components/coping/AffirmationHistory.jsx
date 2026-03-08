import { useEffect, useState } from "react";
import { getAffirmationHistory } from "../../features/affirmation/affirmation.api";

/* ── Theme icons ── */
const ThemeIcons = {
  "self-worth": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22V12" />
      <path d="M12 12C12 7 7 4 4 6" />
      <path d="M12 12c0-5 5-8 8-6" />
      <path d="M12 12c-4 0-7 3-6 7" />
      <path d="M12 12c4 0 7 3 6 7" />
    </svg>
  ),
  confidence: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  "anxiety-relief": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 9c1.5 3 3.5 5 6 5s4.5-2 6-5 3.5-5 6-5" />
      <path d="M1 15c1.5-3 3.5-5 6-5s4.5 2 6 5 3.5 5 6 5" />
    </svg>
  ),
  resilience: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  motivation: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.5-1-2.5-2-4 0 0-1 1-1 2.5" />
      <path d="M12 22C6.47 22 2 17.52 2 12c0-2.5 1-4.75 2.65-6.41C5 5.24 5.5 5.5 5.5 6c0 1 .5 2 1.5 2.5C7.5 9 8.5 7.5 7.5 5.5 9.17 5.17 11 6 12 8c.67-1.5 2-2.5 3.5-2.5.5 0 1 .17 1.5.5C16.5 7 17 8.5 17.5 8c.5-.5 1.5-1.5 1.5-3 2.5 2 4 5 4 8C23 17.52 18.52 22 12 22z" />
    </svg>
  ),
  "self-compassion": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  default: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
};

const themeLabel = (theme) =>
  theme
    ? theme.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

export default function AffirmationHistory() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getAffirmationHistory().then((res) => setSessions(res.data));
  }, []);

  return (
    <>
      <style>{ahStyles}</style>
      <div className="ah-wrap">
        {/* ── Header ── */}
        <div className="ah-header">
          <div className="ah-header-left">
            <div className="ah-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span className="ah-title">Recent Affirmations</span>
          </div>
          {sessions.length > 0 && (
            <div className="ah-count-chip">{sessions.length} entries</div>
          )}
        </div>

        {sessions.length > 0 ? (
          <div className="ah-list">
            {sessions.map((s, idx) => {
              const shift = s.intensityBefore - s.intensityAfter;
              const improved = shift > 0;
              const icon = ThemeIcons[s.theme] ?? ThemeIcons["default"];
              return (
                <div
                  key={s._id}
                  className="ah-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="ah-card-top">
                    <div className="ah-theme-pill">
                      <span className="ah-theme-icon">{icon}</span>
                      {themeLabel(s.theme)}
                    </div>
                    <div
                      className="ah-shift-chip"
                      style={{
                        background: improved
                          ? "var(--primary-container)"
                          : "var(--surface-container-high)",
                        color: improved
                          ? "var(--on-primary-container)"
                          : "var(--outline)",
                      }}
                    >
                      {improved ? (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="4" fill="currentColor" />
                        </svg>
                      )}
                      {improved ? `${shift} pt shift` : "No shift"}
                    </div>
                  </div>

                  <div className="ah-quote-wrap">
                    <div className="ah-quote-mark">"</div>
                    <p className="ah-affirmation">{s.affirmationText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ah-empty">
            No affirmations yet. Start a session to build your collection.
          </div>
        )}
      </div>
    </>
  );
}

const ahStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400&family=DM+Sans:wght@300;400;500&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
  --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
  --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
  --on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
}

/* ── CARD SHELL ── */
.ah-wrap {
  background:var(--surface-container-low); border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden;
  font-family:'DM Sans',sans-serif; color:var(--on-surface);
  position:relative; box-shadow:0 1px 12px rgba(26,28,22,0.07);
}
.ah-wrap::before {
  content:''; position:absolute;
  top:-40px; right:-40px; width:120px; height:120px; border-radius:50%;
  background:radial-gradient(circle,rgba(56,102,99,0.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.ah-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px; border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container); position:relative; z-index:1;
}
.ah-header-left { display:flex; align-items:center; gap:10px; }
.ah-icon { width:30px; height:30px; border-radius:9px; background:var(--tertiary-container); color:var(--on-tertiary-container); display:grid; place-items:center; }
.ah-icon svg { width:14px; height:14px; }
.ah-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on-surface); }
.ah-count-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; background:var(--surface-container-highest); border:1px solid var(--outline-variant); font-size:11px; font-weight:500; color:var(--outline); }

/* ── LIST ── */
.ah-list { padding:14px 16px; display:flex; flex-direction:column; gap:10px; position:relative; z-index:1; }

@keyframes ahIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.ah-card {
  padding:16px; border-radius:14px;
  background:var(--surface-container-low); border:1.5px solid var(--outline-variant);
  transition:border-color 0.2s,box-shadow 0.2s;
  animation:ahIn 0.35s ease-out both;
}
.ah-card:hover { border-color:rgba(76,102,43,0.3); box-shadow:0 2px 10px rgba(76,102,43,0.06); }

.ah-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }

/* Theme pill */
.ah-theme-pill {
  display:inline-flex; align-items:center; gap:6px;
  padding:3px 10px 3px 7px; border-radius:100px;
  background:var(--secondary-container); color:var(--on-secondary-container);
  font-size:11.5px; font-weight:500;
}
.ah-theme-icon { width:14px; height:14px; display:flex; align-items:center; flex-shrink:0; }
.ah-theme-icon svg { width:14px; height:14px; }

/* Shift chip */
.ah-shift-chip {
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 10px; border-radius:100px;
  font-size:11.5px; font-weight:500;
}

/* Quote card */
.ah-quote-wrap {
  position:relative; padding:14px 16px; border-radius:12px;
  background:var(--primary); overflow:hidden;
}
.ah-quote-wrap::before {
  content:''; position:absolute; top:-20px; right:-20px; width:80px; height:80px; border-radius:50%;
  background:radial-gradient(circle,rgba(177,209,138,0.18) 0%,transparent 70%); pointer-events:none;
}
.ah-quote-mark { font-family:'Playfair Display',serif; font-size:1.8rem; color:rgba(255,255,255,0.2); line-height:0.7; position:relative; z-index:1; }
.ah-affirmation { font-family:'Playfair Display',serif; font-size:0.92rem; font-style:italic; font-weight:400; color:#fff; line-height:1.55; margin:4px 0 0; position:relative; z-index:1; letter-spacing:0.1px; }

.ah-empty { padding:28px 16px; text-align:center; color:var(--outline); font-size:13px; font-weight:300; line-height:1.6; }

@media(max-width:480px) {
  .ah-wrap { border-radius:16px; }
  .ah-list { padding:10px 12px; }
}
`;
