import { useEffect, useState, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import { getCheckinHeatmap } from "../../features/checkin/checkin.api";

/* ───────────────────────────────────────────────────────────────
   EMOTIONAL HEATMAP — refined dark wellness aesthetic
   ─────────────────────────────────────────────────────────────── */

const INTENSITY_META = [
  { max: 0, label: "No data", emoji: "—", color: "#1f2235" },
  { max: 2, label: "Calm", emoji: "🌊", color: "#1b3a4b" },
  { max: 4, label: "Mild", emoji: "🍃", color: "#1a6b5a" },
  { max: 7, label: "Moderate", emoji: "🔥", color: "#d4a03c" },
  { max: 10, label: "Intense", emoji: "⚡", color: "#c0392b" },
];

function getMeta(count) {
  if (!count) return INTENSITY_META[0];
  return INTENSITY_META.find((m) => count <= m.max) || INTENSITY_META[4];
}

export default function CheckinHeatmap() {
  const [values, setValues] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getCheckinHeatmap();
      const mapped = res.data.map((d) => ({
        date: d._id,
        count: Math.round(d.avgIntensity || 0),
      }));
      setValues(mapped);
    };
    load();
  }, []);

  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 90);

  /* ── derived stats ── */
  const valuesMap = useMemo(() => {
    const m = {};
    values.forEach((v) => (m[v.date] = v.count));
    return m;
  }, [values]);

  const stats = useMemo(() => {
    const filled = values.filter((v) => v.count > 0);
    const total = filled.length;
    const avg = total
      ? (filled.reduce((s, v) => s + v.count, 0) / total).toFixed(1)
      : "0";
    const peak = total ? Math.max(...filled.map((v) => v.count)) : 0;

    let streak = 0;
    const d = new Date(today);
    while (true) {
      const key = d.toISOString().split("T")[0];
      if (valuesMap[key] && valuesMap[key] > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return { total, avg, peak, streak };
  }, [values, valuesMap]);

  const activeDay = selectedDay || hoveredDay;
  const activeMeta = activeDay ? getMeta(activeDay.count) : null;

  const fmtDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="checkin-heatmap-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .checkin-heatmap-root {
          --hm-bg: #0f1019;
          --hm-card: #161825;
          --hm-card-raised: #1c1f30;
          --hm-border: #262940;
          --hm-border-hover: #3a3f5c;
          --hm-text: #b8bdd6;
          --hm-text-muted: #5d6180;
          --hm-text-bright: #eaecf6;
          --hm-accent: #1a6b5a;
          --hm-accent-glow: rgba(26, 107, 90, 0.12);
          --hm-empty: #1f2235;
          --hm-scale-1: #1b3a4b;
          --hm-scale-2: #1a6b5a;
          --hm-scale-3: #d4a03c;
          --hm-scale-4: #c0392b;

          font-family: 'Outfit', sans-serif;
          background: var(--hm-card);
          border: 1px solid var(--hm-border);
          border-radius: 18px;
          padding: 1.75rem;
          color: var(--hm-text);
          animation: hm-fadeUp 0.5s ease both;
        }

        @keyframes hm-fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Header ── */
        .hm-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hm-title-group { display: flex; flex-direction: column; gap: 4px; }
        .hm-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--hm-text-bright);
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hm-title::before {
          content: '';
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--hm-accent);
          box-shadow: 0 0 10px var(--hm-accent), 0 0 20px var(--hm-accent-glow);
          animation: hm-pulse 2.5s ease-in-out infinite;
        }
        @keyframes hm-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .hm-subtitle {
          font-size: 0.78rem;
          color: var(--hm-text-muted);
          padding-left: 16px;
        }

        /* ── Stats Row ── */
        .hm-stats {
          display: flex;
          gap: 6px;
        }
        .hm-stat {
          background: var(--hm-card-raised);
          border: 1px solid var(--hm-border);
          border-radius: 10px;
          padding: 8px 14px;
          text-align: center;
          transition: border-color 0.2s, box-shadow 0.2s;
          min-width: 70px;
        }
        .hm-stat:hover {
          border-color: var(--hm-border-hover);
          box-shadow: 0 0 20px var(--hm-accent-glow);
        }
        .hm-stat-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--hm-text-bright);
          line-height: 1.2;
        }
        .hm-stat-label {
          font-size: 0.65rem;
          color: var(--hm-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }

        /* ── Heatmap Grid Override ── */
        .hm-grid-wrapper {
          background: var(--hm-bg);
          border: 1px solid var(--hm-border);
          border-radius: 12px;
          padding: 1rem 1rem 0.75rem;
          overflow-x: auto;
        }
        .hm-grid-wrapper .react-calendar-heatmap {
          width: 100%;
        }
        .hm-grid-wrapper .react-calendar-heatmap text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          fill: var(--hm-text-muted);
        }
        .hm-grid-wrapper .react-calendar-heatmap rect {
          rx: 3;
          ry: 3;
          stroke: transparent;
          stroke-width: 1.5;
          transition: stroke 0.15s, filter 0.15s;
          cursor: pointer;
        }
        .hm-grid-wrapper .react-calendar-heatmap rect:hover {
          stroke: var(--hm-text-bright);
          filter: brightness(1.3);
        }

        .hm-grid-wrapper .color-empty   { fill: var(--hm-empty); }
        .hm-grid-wrapper .color-scale-1  { fill: var(--hm-scale-1); }
        .hm-grid-wrapper .color-scale-2  { fill: var(--hm-scale-2); }
        .hm-grid-wrapper .color-scale-3  { fill: var(--hm-scale-3); }
        .hm-grid-wrapper .color-scale-4  { fill: var(--hm-scale-4); }

        /* ── Footer: Legend + Detail Pill ── */
        .hm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hm-legend {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: var(--hm-text-muted);
        }
        .hm-legend-swatch {
          width: 14px; height: 14px;
          border-radius: 3px;
          transition: transform 0.15s;
          cursor: default;
        }
        .hm-legend-swatch:hover { transform: scale(1.35); }

        .hm-detail-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--hm-card-raised);
          border: 1px solid var(--hm-border);
          border-radius: 10px;
          padding: 6px 14px;
          font-size: 0.78rem;
          color: var(--hm-text);
          animation: hm-pillIn 0.2s ease;
          white-space: nowrap;
        }
        @keyframes hm-pillIn {
          from { opacity: 0; transform: translateX(6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hm-detail-emoji { font-size: 1rem; }
        .hm-detail-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--hm-text-muted);
        }
        .hm-detail-label {
          font-weight: 500;
          color: var(--hm-text-bright);
        }
        .hm-detail-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          opacity: 0.6;
        }

        /* ── Responsive ── */
        @media (max-width: 520px) {
          .checkin-heatmap-root { padding: 1.15rem; }
          .hm-header { flex-direction: column; }
          .hm-stats { width: 100%; }
          .hm-stat { flex: 1; padding: 6px 8px; min-width: 0; }
          .hm-stat-value { font-size: 0.95rem; }
          .hm-footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="hm-header">
        <div className="hm-title-group">
          <div className="hm-title">Emotional Heatmap</div>
          <div className="hm-subtitle">Last 90 days of check-in intensity</div>
        </div>
        <div className="hm-stats">
          <div className="hm-stat">
            <div className="hm-stat-value">{stats.total}</div>
            <div className="hm-stat-label">Days</div>
          </div>
          <div className="hm-stat">
            <div className="hm-stat-value">{stats.avg}</div>
            <div className="hm-stat-label">Avg</div>
          </div>
          <div className="hm-stat">
            <div className="hm-stat-value">{stats.streak}</div>
            <div className="hm-stat-label">Streak</div>
          </div>
          <div className="hm-stat">
            <div className="hm-stat-value">{stats.peak}</div>
            <div className="hm-stat-label">Peak</div>
          </div>
        </div>
      </div>

      {/* ── Heatmap Grid ── */}
      <div className="hm-grid-wrapper">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={values}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count <= 2) return "color-scale-1";
            if (value.count <= 4) return "color-scale-2";
            if (value.count <= 7) return "color-scale-3";
            return "color-scale-4";
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) return { "data-tip": "No data" };
            return {
              "data-tip": `${value.date} → Intensity ${value.count}`,
            };
          }}
          onClick={(value) => {
            if (value) setSelectedDay(value);
          }}
          onMouseOver={(e, value) => {
            if (value) setHoveredDay(value);
          }}
          onMouseLeave={() => setHoveredDay(null)}
          showWeekdayLabels
        />
      </div>

      {/* ── Footer ── */}
      <div className="hm-footer">
        <div className="hm-legend">
          <span>Less</span>
          {[
            "var(--hm-empty)",
            "var(--hm-scale-1)",
            "var(--hm-scale-2)",
            "var(--hm-scale-3)",
            "var(--hm-scale-4)",
          ].map((c, i) => (
            <div
              key={i}
              className="hm-legend-swatch"
              style={{ background: c }}
              title={INTENSITY_META[i]?.label}
            />
          ))}
          <span>More</span>
        </div>

        {activeDay && activeMeta && activeDay.date && (
          <div className="hm-detail-pill" key={activeDay.date}>
            <span className="hm-detail-emoji">{activeMeta.emoji}</span>
            <span className="hm-detail-date">{fmtDate(activeDay.date)}</span>
            <span className="hm-detail-label">{activeMeta.label}</span>
            <span className="hm-detail-count">({activeDay.count}/10)</span>
          </div>
        )}
      </div>
    </div>
  );
}
