import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const emotionValue = {
  neutral: 0,
  calm: 1,
  sad: 2,
  anxious: 3,
  angry: 4,
};

const emotionLabel = {
  0: "Neutral",
  1: "Calm",
  2: "Sad",
  3: "Anxious",
  4: "Angry",
};

const emotionDotColor = {
  0: "#75796C",
  1: "#4C662B",
  2: "#386663",
  3: "#C07A00",
  4: "#BA1A1A",
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const color = emotionDotColor[payload.mood] || "#75796C";
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={color}
      stroke="#F9FAEF"
      strokeWidth={2}
    />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = emotionDotColor[d.mood] || "#75796C";
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #C5C8BA",
        borderRadius: 10,
        padding: "8px 12px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        color: "#1A1C16",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontWeight: 500, color, marginBottom: 2 }}>
        {emotionLabel[d.mood]}
      </div>
      <div style={{ color: "#75796C" }}>{d.name}</div>
    </div>
  );
};

export default function MoodChart({ messages }) {
  const data = messages
    .filter((m) => m.role === "user")
    .map((m, i) => ({
      name: `Msg ${i + 1}`,
      mood: emotionValue[m.emotion] ?? 0,
      emotion: m.emotion,
    }));

  if (data.length === 0) return null;

  return (
    <>
      <style>{`
        .mood-chart-wrap {
          background: #EEEFE3;
          border: 1px solid #C5C8BA;
          border-radius: 16px;
          padding: 16px;
          margin-top: 20px;
          font-family: 'DM Sans', sans-serif;
        }
        .mood-chart-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .mood-chart-icon {
          width: 28px; height: 28px;
          background: #CDEDA3;
          border-radius: 8px;
          display: grid;
          place-items: center;
        }
        .mood-chart-icon svg { width: 14px; height: 14px; fill: #4C662B; }
        .mood-chart-title {
          font-size: 13px;
          font-weight: 500;
          color: #1A1C16;
        }
        .mood-chart-sub {
          font-size: 11px;
          color: #75796C;
          margin-top: 1px;
        }
      `}</style>
      <div className="mood-chart-wrap">
        <div className="mood-chart-header">
          <div className="mood-chart-icon">
            <svg viewBox="0 0 24 24">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
          </div>
          <div>
            <div className="mood-chart-title">Mood Trend</div>
            <div className="mood-chart-sub">
              Emotional state across messages
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E1E4D5"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fill: "#75796C",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tickFormatter={(v) => emotionLabel[v]}
              tick={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fill: "#75796C",
              }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#4C662B"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{
                r: 7,
                fill: "#4C662B",
                stroke: "#F9FAEF",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
