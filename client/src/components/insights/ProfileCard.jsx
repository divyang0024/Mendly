import { useEffect, useState } from "react";
import { getEmotionalProfile } from "../../features/insights/insights.api";

const emotionColor = {
  calm: "#4C662B",
  neutral: "#586249",
  sad: "#A16207",
  anxious: "#C2500A",
  angry: "#BA1A1A",
};
const emotionBg = {
  calm: "#CDEDA3",
  neutral: "#DCE7C8",
  sad: "#FEF3C7",
  anxious: "#FFEDD5",
  angry: "#FFDAD6",
};
const emotionText = {
  calm: "#354E16",
  neutral: "#404A33",
  sad: "#78350F",
  anxious: "#7C2D12",
  angry: "#93000A",
};

/* ── Emotion SVG icons ── */
const EmotionIcon = ({ emotion, size = 20 }) => {
  const s = { width: size, height: size };
  const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (emotion) {
    case "calm":
      return (
        <svg viewBox="0 0 24 24" style={s} {...base}>
          <path d="M12 22V12" />
          <path d="M12 12C12 7 7 4 4 6" />
          <path d="M12 12c0-5 5-8 8-6" />
          <path d="M12 12c-4 0-7 3-6 7" />
          <path d="M12 12c4 0 7 3 6 7" />
        </svg>
      );
    case "neutral":
      return (
        <svg viewBox="0 0 24 24" style={s} {...base}>
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="15" x2="16" y2="15" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
        </svg>
      );
    case "sad":
      return (
        <svg viewBox="0 0 24 24" style={s} {...base}>
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
        </svg>
      );
    case "anxious":
      return (
        <svg viewBox="0 0 24 24" style={s} {...base}>
          <path d="M1 9c1.5 3 3.5 5 6 5s4.5-2 6-5 3.5-5 6-5" />
          <path d="M1 15c1.5-3 3.5-5 6-5s4.5 2 6 5 3.5 5 6 5" />
        </svg>
      );
    case "angry":
      return (
        <svg viewBox="0 0 24 24" style={s} {...base}>
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <path d="M9 8l2.5 2M15 8l-2.5 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" style={s} {...base}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      );
  }
};

export default function ProfileCard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getEmotionalProfile().then((res) => setProfile(res.data));
  }, []);

  if (!profile) return null;

  /* ── Original logic — unchanged ── */
  const { counts, percentages } = profile;
  const dominant = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0];
  /* ── End original logic ── */

  const domColor = dominant ? emotionColor[dominant[0]] : "var(--primary)";
  const domBg = dominant ? emotionBg[dominant[0]] : "var(--primary-container)";
  const domText = dominant
    ? emotionText[dominant[0]]
    : "var(--on-primary-container)";

  return (
    <>
      <style>{pcStyles}</style>
      <div className="pc-wrap">
        {/* ── Header ── */}
        <div className="pc-header">
          <div className="pc-header-left">
            <div className="pc-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="pc-title">Emotional Profile</span>
          </div>
          <div className="pc-badge">Last 7 days</div>
        </div>

        <div className="pc-body">
          {/* Dominant emotion block */}
          {dominant && (
            <div
              className="pc-dominant"
              style={{
                background: domBg,
                borderColor: `${domColor}30`,
                color: domText,
              }}
            >
              <div className="pc-dom-icon" style={{ color: domColor }}>
                <EmotionIcon emotion={dominant[0]} size={30} />
              </div>
              <div>
                <div className="pc-dom-label">Dominant emotion</div>
                <div className="pc-dom-name">{dominant[0]}</div>
                <div className="pc-dom-pct">
                  {dominant[1]}% of conversations
                </div>
              </div>
            </div>
          )}

          {/* Bar chart */}
          <div className="pc-bars">
            {Object.entries(percentages)
              .sort((a, b) => b[1] - a[1])
              .map(([emotion, percent]) => (
                <div key={emotion} className="pc-bar-row">
                  <span
                    className="pc-bar-icon"
                    style={{ color: emotionColor[emotion] ?? "var(--outline)" }}
                  >
                    <EmotionIcon emotion={emotion} size={16} />
                  </span>
                  <span className="pc-bar-name">{emotion}</span>
                  <div className="pc-bar-track">
                    <div
                      className="pc-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: emotionColor[emotion] ?? "var(--primary)",
                      }}
                    />
                  </div>
                  <span className="pc-bar-pct">{percent}%</span>
                </div>
              ))}
          </div>

          <p className="pc-note">
            Based on conversations from the past 7 days.
          </p>
        </div>
      </div>
    </>
  );
}

const pcStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
  --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
  --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
  --on-surface:#1A1C16;--on-surface-variant:#44483D;
  --outline:#75796C;--outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
}

/* ── CARD SHELL ── */
.pc-wrap {
  font-family:'DM Sans',sans-serif;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
  color:var(--on-surface);
  animation:pcIn 0.4s ease-out both;
}
.pc-wrap::before {
  content:''; position:absolute;
  top:-48px; right:-48px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}
@keyframes pcIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── HEADER ── */
.pc-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  position:relative; z-index:1;
}
.pc-header-left { display:flex; align-items:center; gap:10px; }
.pc-icon {
  width:30px; height:30px; border-radius:9px;
  background:var(--primary-container); color:var(--on-primary-container);
  display:grid; place-items:center; flex-shrink:0;
}
.pc-icon svg { width:14px; height:14px; }
.pc-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400; color:var(--on-surface);
}
.pc-badge {
  display:inline-flex; align-items:center;
  padding:3px 10px; border-radius:100px;
  background:var(--surface-container-highest);
  border:1px solid var(--outline-variant);
  font-size:11px; font-weight:500; color:var(--outline);
}

/* ── BODY ── */
.pc-body { padding:18px 18px 20px; position:relative; z-index:1; }

/* Dominant block */
.pc-dominant {
  display:flex; align-items:center; gap:14px;
  padding:14px 16px; border-radius:14px; margin-bottom:18px;
  border:1.5px solid transparent;
}
.pc-dom-icon { flex-shrink:0; display:flex; align-items:center; }
.pc-dom-label { font-size:11px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; opacity:0.7; margin-bottom:3px; }
.pc-dom-name { font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:400; line-height:1.2; text-transform:capitalize; }
.pc-dom-pct { font-size:12px; opacity:0.7; margin-top:2px; }

/* Bar rows */
.pc-bars { display:flex; flex-direction:column; gap:9px; }
.pc-bar-row { display:flex; align-items:center; gap:10px; }
.pc-bar-icon { width:18px; flex-shrink:0; display:flex; align-items:center; }
.pc-bar-name { font-size:12.5px; font-weight:500; color:var(--on-surface-variant); width:68px; flex-shrink:0; text-transform:capitalize; }
.pc-bar-track { flex:1; height:7px; border-radius:4px; background:var(--surface-container-highest); overflow:hidden; }
.pc-bar-fill { height:100%; border-radius:4px; transition:width 0.8s cubic-bezier(0.34,1.2,0.64,1); }
.pc-bar-pct { font-size:11.5px; font-weight:500; color:var(--outline); width:32px; text-align:right; flex-shrink:0; }

.pc-note {
  font-size:12px; color:var(--outline); font-weight:300;
  margin-top:14px; padding-top:12px;
  border-top:1px solid var(--outline-variant);
}

@media(max-width:480px) {
  .pc-wrap { border-radius:16px; }
  .pc-body { padding:14px; }
  .pc-bar-name { width:58px; font-size:11.5px; }
}
`;
