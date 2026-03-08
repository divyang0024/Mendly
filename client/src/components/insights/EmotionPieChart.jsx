import { useEffect, useState } from "react";
import { getEmotionStats } from "../../features/insights/insights.api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/* ── Brand-token emotion colors ── */
const COLORS = {
  calm: "#4C662B",
  neutral: "#586249",
  sad: "#A16207",
  anxious: "#C2500A",
  angry: "#BA1A1A",
};
const COLORS_BG = {
  calm: "#CDEDA3",
  neutral: "#DCE7C8",
  sad: "#FEF3C7",
  anxious: "#FFEDD5",
  angry: "#FFDAD6",
};
const COLORS_TEXT = {
  calm: "#354E16",
  neutral: "#404A33",
  sad: "#78350F",
  anxious: "#7C2D12",
  angry: "#93000A",
};

/* ── Emotion SVG icons (shared pattern) ── */
const EmotionIcon = ({ emotion, size = 20 }) => {
  const s = { width: size, height: size };
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (emotion) {
    case "calm":
      return (
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <path d="M12 22V12" />
          <path d="M12 12C12 7 7 4 4 6" />
          <path d="M12 12c0-5 5-8 8-6" />
          <path d="M12 12c-4 0-7 3-6 7" />
          <path d="M12 12c4 0 7 3 6 7" />
        </svg>
      );
    case "neutral":
      return (
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="15" x2="16" y2="15" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
        </svg>
      );
    case "sad":
      return (
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
        </svg>
      );
    case "anxious":
      return (
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <path d="M1 9c1.5 3 3.5 5 6 5s4.5-2 6-5 3.5-5 6-5" />
          <path d="M1 15c1.5-3 3.5-5 6-5s4.5 2 6 5 3.5 5 6 5" />
        </svg>
      );
    case "angry":
      return (
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <path d="M9 8l2.5 2M15 8l-2.5 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" style={s} {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      );
  }
};

/* ── Original logic — unchanged ── */
const renderLabel = ({ name, percent }) =>
  `${name} ${(percent * 100).toFixed(0)}%`;
/* ── End original logic ── */

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div
      style={{
        background: COLORS_BG[name] ?? "#F3F4E9",
        border: `1.5px solid ${COLORS[name] ?? "#C5C8BA"}30`,
        borderRadius: 12,
        padding: "9px 14px",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          color: COLORS[name] ?? "var(--outline)",
          flexShrink: 0,
          display: "flex",
        }}
      >
        <EmotionIcon emotion={name} size={18} />
      </span>
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: COLORS_TEXT[name] ?? "#1A1C16",
            marginBottom: 2,
            textTransform: "capitalize",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: COLORS_TEXT[name] ?? "#75796C",
            opacity: 0.8,
          }}
        >
          {value} conversations
        </div>
      </div>
    </div>
  );
}

export default function EmotionPieChart() {
  const [data, setData] = useState([]);
  const [dominant, setDominant] = useState(null);
  const [totalConvos, setTotalConvos] = useState(0);

  useEffect(() => {
    getEmotionStats().then((res) => {
      const total = res.data.reduce((sum, e) => sum + e.count, 0);
      setTotalConvos(total);
      const formatted = res.data.map((e) => ({ name: e._id, value: e.count }));
      setData(formatted);
      const top = [...formatted].sort((a, b) => b.value - a.value)[0];
      setDominant(top);
    });
  }, []);

  return (
    <>
      <style>{epcStyles}</style>
      <div className="epc-wrap">
        {/* ── Header ── */}
        <div className="epc-header">
          <div className="epc-header-left">
            <div className="epc-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
            </div>
            <span className="epc-title">Emotional Composition</span>
          </div>
          <div className="epc-badge">{totalConvos} convos</div>
        </div>

        <div className="epc-body">
          <p className="epc-sub">
            Distribution of emotions across your <strong>{totalConvos}</strong>{" "}
            recent conversations.
          </p>

          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  outerRadius={110}
                  label={renderLabel}
                  labelLine={{ stroke: "#C5C8BA" }}
                  fontSize={11}
                  fontFamily="'DM Sans', sans-serif"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[entry.name] || "#75796C"}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="epc-empty">
              No emotion data yet. Start chatting to see your composition.
            </div>
          )}

          {dominant && totalConvos > 0 && (
            <div
              className="epc-insight"
              style={{
                background:
                  COLORS_BG[dominant.name] ?? "var(--surface-container-high)",
                borderColor: `${COLORS[dominant.name] ?? "var(--outline-variant)"}30`,
              }}
            >
              <div
                className="epc-insight-icon"
                style={{ color: COLORS[dominant.name] ?? "var(--outline)" }}
              >
                <EmotionIcon emotion={dominant.name} size={28} />
              </div>
              <div
                style={{
                  color: COLORS_TEXT[dominant.name] ?? "var(--on-surface)",
                }}
              >
                <div className="epc-insight-title">Most frequent emotion</div>
                <div
                  className="epc-insight-text"
                  style={{ fontWeight: 600, textTransform: "capitalize" }}
                >
                  {dominant.name} —{" "}
                  {Math.round((dominant.value / totalConvos) * 100)}% of{" "}
                  {totalConvos} conversations
                </div>
                <div className="epc-insight-note">
                  Identifying patterns behind this emotion can help improve
                  emotional awareness.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const epcStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --primary:#4C662B;--primary-container:#CDEDA3;--on-primary-container:#354E16;
  --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
  --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
  --on-surface:#1A1C16;--on-surface-variant:#44483D;
  --outline:#75796C;--outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
}

/* ── CARD SHELL ── */
.epc-wrap {
  font-family:'DM Sans',sans-serif;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
  color:var(--on-surface);
}
.epc-wrap::before {
  content:''; position:absolute;
  top:-48px; right:-48px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle,rgba(56,102,99,0.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.epc-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  position:relative; z-index:1;
}
.epc-header-left { display:flex; align-items:center; gap:10px; }
.epc-icon {
  width:30px; height:30px; border-radius:9px;
  background:var(--secondary-container); color:var(--on-secondary-container);
  display:grid; place-items:center; flex-shrink:0;
}
.epc-icon svg { width:14px; height:14px; }
.epc-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:400; color:var(--on-surface);
}
.epc-badge {
  display:inline-flex; align-items:center;
  padding:3px 10px; border-radius:100px;
  background:var(--surface-container-highest);
  border:1px solid var(--outline-variant);
  font-size:11px; font-weight:500; color:var(--outline);
}

/* ── BODY ── */
.epc-body { padding:18px 18px 20px; position:relative; z-index:1; }
.epc-sub { font-size:13px; color:var(--outline); font-weight:300; margin-bottom:18px; line-height:1.5; }

/* Insight block */
.epc-insight {
  display:flex; align-items:flex-start; gap:12px;
  padding:14px 16px; border-radius:14px; margin-top:18px;
  border:1.5px solid transparent;
}
.epc-insight-icon { flex-shrink:0; display:flex; align-items:center; margin-top:2px; }
.epc-insight-title { font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; opacity:0.7; margin-bottom:3px; }
.epc-insight-text { font-size:13px; line-height:1.55; }
.epc-insight-note { font-size:12px; opacity:0.7; margin-top:5px; font-weight:300; }

.epc-empty { padding:48px 16px; text-align:center; color:var(--outline); font-size:13px; font-weight:300; }

@media(max-width:480px) {
  .epc-wrap { border-radius:16px; }
  .epc-body { padding:14px; }
}
`;
