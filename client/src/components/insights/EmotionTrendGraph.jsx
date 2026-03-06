import { useEffect, useState } from "react";
import { getEmotionTimeline } from "../../features/insights/insights.api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Dot,
} from "recharts";

/* ── Original logic — unchanged ── */
const emotionRank = { calm: 1, neutral: 2, sad: 3, anxious: 4, angry: 5 };

/* Brand-token emotion colors */
const emotionColor = {
  calm: "#4C662B",
  neutral: "#586249",
  sad: "#A16207",
  anxious: "#C2500A",
  angry: "#BA1A1A",
};

const emotionLabel = {
  1: "Calm",
  2: "Neutral",
  3: "Sad",
  4: "Anxious",
  5: "Angry",
};
/* ── End original logic ── */

const emotionEmoji = {
  calm: "🌿",
  neutral: "😐",
  sad: "🌧",
  anxious: "🌊",
  angry: "🔥",
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

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = emotionColor[d.emotion] ?? "var(--primary)";
  const bg = emotionBg[d.emotion] ?? "var(--primary-container)";
  const text = emotionText[d.emotion] ?? "var(--on-primary-container)";
  return (
    <div
      style={{
        background: bg,
        border: `1.5px solid ${color}30`,
        borderRadius: 12,
        padding: "9px 14px",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: text,
          textTransform: "capitalize",
          marginBottom: 2,
        }}
      >
        {emotionEmoji[d.emotion]} {d.emotion}
      </div>
      <div style={{ fontSize: 11, color: text, opacity: 0.7 }}>{d.time}</div>
    </div>
  );
}

export default function EmotionTrendGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getEmotionTimeline().then((res) => {
      const formatted = res.data.map((m) => ({
        time: new Date(m.createdAt).toLocaleString(),
        mood: emotionRank[m.emotion] || 2,
        emotion: m.emotion,
      }));
      setData(formatted);
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root{--primary:#4C662B;--primary-container:#CDEDA3;--on-primary-container:#354E16;--secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;--on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;--surface-container-low:#F3F4E9;--surface-container:#EEEFE3;--surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;}
        .etg-wrap{font-family:'DM Sans',sans-serif;background:var(--surface-container-low);border:1.5px solid var(--outline-variant);border-radius:20px;overflow:hidden;position:relative;box-shadow:0 1px 12px rgba(26,28,22,0.07);color:var(--on-surface);}
        .etg-wrap::before{content:'';position:absolute;top:-45px;right:-45px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);pointer-events:none;}
        .etg-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--outline-variant);background:var(--surface-container);}
        .etg-header-left{display:flex;align-items:center;gap:10px;}
        .etg-icon{width:30px;height:30px;border-radius:9px;background:var(--tertiary-container);color:var(--on-tertiary-container, #1F4E4B);display:grid;place-items:center;}
        .etg-icon svg{width:14px;height:14px;}
        .etg-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--on-surface);}
        .etg-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;background:var(--surface-container-highest);border:1px solid var(--outline-variant);font-size:11px;font-weight:500;color:var(--outline);}
        .etg-body{padding:18px 18px 20px;position:relative;z-index:1;}
        .etg-sub{font-size:13px;color:var(--outline);font-weight:300;margin-bottom:18px;line-height:1.5;}
        .etg-legend{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid var(--outline-variant);}
        .etg-legend-item{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--on-surface-variant);}
        .etg-legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
        .etg-empty{padding:48px 16px;text-align:center;color:var(--outline);font-size:13px;font-weight:300;}
      `}</style>
      <div className="etg-wrap">
        <div className="etg-header">
          <div className="etg-header-left">
            <div className="etg-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="etg-title">Emotional Journey</span>
          </div>
          <div className="etg-badge">{data.length} points</div>
        </div>

        <div className="etg-body">
          <p className="etg-sub">
            Each point represents how you felt at that moment in a conversation.
          </p>

          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#C5C8BA"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="time"
                  tick={{
                    fontSize: 11,
                    fill: "#75796C",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  angle={-20}
                  textAnchor="end"
                  height={55}
                  axisLine={{ stroke: "#C5C8BA" }}
                  tickLine={false}
                />
                <YAxis
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(v) => emotionLabel[v]}
                  tick={{
                    fontSize: 11,
                    fill: "#75796C",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Emotional State",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fontSize: 11,
                      fill: "#75796C",
                      fontFamily: "'DM Sans', sans-serif",
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#C5C8BA"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <Dot
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill={emotionColor[payload.emotion] ?? "#4C662B"}
                        stroke="white"
                        strokeWidth={1.5}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="etg-empty">
              No emotion data yet. Start chatting to see your journey.
            </div>
          )}

          <div className="etg-legend">
            {Object.entries(emotionColor).map(([emotion, color]) => (
              <div key={emotion} className="etg-legend-item">
                <div className="etg-legend-dot" style={{ background: color }} />
                <span style={{ textTransform: "capitalize" }}>{emotion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
