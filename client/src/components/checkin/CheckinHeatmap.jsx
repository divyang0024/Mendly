import { useEffect, useState, useMemo, useRef } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { getCheckinHeatmap } from "../../features/checkin/checkin.api";

const INTENSITY_META = [
  { max: 0, label: "No data", emoji: "—", color: "#E2E3D8" },
  { max: 2, label: "Calm", emoji: "🌿", color: "#CDEDA3" },
  { max: 4, label: "Mild", emoji: "🌊", color: "#4C662B" },
  { max: 7, label: "Moderate", emoji: "🌤", color: "#A16207" },
  { max: 10, label: "Intense", emoji: "🔥", color: "#BA1A1A" },
];

function getMeta(c) {
  if (!c) return INTENSITY_META[0];
  return INTENSITY_META.find((m) => c <= m.max) || INTENSITY_META[4];
}

export default function CheckinHeatmap() {
  const [values, setValues] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    getCheckinHeatmap().then((res) =>
      setValues(
        res.data.map((d) => ({
          date: d._id,
          count: Math.round(d.avgIntensity || 0),
        })),
      ),
    );
  }, []);

  // Strip the inline w/h the library stamps after every render.
  // width:100% / height:auto makes the SVG fill its container
  // and scale the rects proportionally — no tiny rectangles.
  useEffect(() => {
    const wrap = svgRef.current;
    if (!wrap) return;
    const svg = wrap.querySelector("svg.react-calendar-heatmap");
    if (!svg) return;
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });

  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 90);

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
      if (valuesMap[key]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return { total, avg, peak, streak };
  }, [values, valuesMap]);

  const activeDay = selectedDay || hoveredDay;
  const activeMeta = activeDay ? getMeta(activeDay.count) : null;
  const fmtDate = (s) =>
    s
      ? new Date(s + "T00:00:00").toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : "";

  return (
    <div className="chm-root">
      <style>{`
        /*
          margin:-14px cancels the parent .i-card-heatmap's padding:14px
          so the component fills edge-to-edge to the card border.
        */
        .chm-root {
          font-family: 'DM Sans', sans-serif;
          color: var(--on-surface, #1A1C16);
          margin: -14px;
        }

        /* ── Header ── */
        .chm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 14px;
          border-bottom: 1px solid var(--outline-variant, #C5C8BA);
          background: var(--surface-container, #EEEFE3);
          /* Allow header to reflow naturally — never force two lines */
          flex-wrap: wrap;
          min-width: 0;
        }
        .chm-header-left {
          display: flex; align-items: center; gap: 10px;
          min-width: 0; flex-shrink: 1;
        }
        .chm-icon {
          width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
          background: var(--primary-container, #CDEDA3);
          color: var(--on-primary-container, #354E16);
          display: grid; place-items: center;
        }
        .chm-icon svg { width: 14px; height: 14px; }
        .chm-title {
          font-family: 'Playfair Display', serif;
          font-size: .95rem;
          color: var(--on-surface, #1A1C16);
          display: flex; align-items: center; gap: 7px;
          margin-bottom: 2px;
          white-space: nowrap;
        }
        .chm-pulse {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--primary, #4C662B);
          flex-shrink: 0;
          animation: chmPulse 2.5s ease-in-out infinite;
        }
        @keyframes chmPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .chm-subtitle { font-size: 11px; color: var(--outline, #75796C); font-weight: 300; white-space: nowrap; }

        /* Stats strip — wraps to a second line if the header is narrow */
        .chm-stats {
          display: flex; gap: 6px;
          flex-shrink: 0;
        }
        .chm-stat {
          background: var(--surface-container-high, #E8E9DE);
          border: 1px solid var(--outline-variant, #C5C8BA);
          border-radius: 10px;
          padding: 5px 12px;
          text-align: center;
          transition: border-color .2s, box-shadow .2s;
        }
        .chm-stat:hover { border-color: rgba(76,102,43,0.35); box-shadow: 0 2px 10px rgba(76,102,43,0.08); }
        .chm-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: .95rem;
          color: var(--on-surface, #1A1C16);
          line-height: 1.2;
        }
        .chm-stat-label {
          font-size: 9.5px; color: var(--outline, #75796C);
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-top: 2px;
        }

        /* ── Grid ── */
        .chm-grid-wrap {
          padding: 14px 16px 8px;
          background: var(--surface-container-low, #F3F4E9);
          overflow: hidden;
        }
        /* width:100% + height:auto — SVG fills its column, rects scale up */
        .chm-grid-wrap svg.react-calendar-heatmap {
          display: block !important;
          width:   100% !important;
          height:  auto !important;
        }
        .chm-grid-wrap .react-calendar-heatmap text {
          font-family: 'DM Sans', sans-serif; font-size: 9px;
          fill: var(--outline, #75796C);
        }
        .chm-grid-wrap .react-calendar-heatmap rect {
          rx: 3; ry: 3;
          stroke: transparent; stroke-width: 1.5;
          cursor: pointer;
          transition: stroke .15s, filter .15s;
        }
        .chm-grid-wrap .react-calendar-heatmap rect:hover {
          stroke: var(--primary, #4C662B); filter: brightness(1.08);
        }
        .chm-grid-wrap .color-empty   { fill: #E2E3D8; }
        .chm-grid-wrap .color-scale-1 { fill: #CDEDA3; }
        .chm-grid-wrap .color-scale-2 { fill: #4C662B; }
        .chm-grid-wrap .color-scale-3 { fill: #A16207; }
        .chm-grid-wrap .color-scale-4 { fill: #BA1A1A; }

        /* ── Footer ── */
        .chm-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          padding: 9px 14px 12px;
          border-top: 1px solid var(--outline-variant, #C5C8BA);
          background: var(--surface-container-low, #F3F4E9);
        }
        .chm-legend {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: var(--outline, #75796C);
        }
        .chm-swatch {
          width: 11px; height: 11px; border-radius: 3px;
          cursor: default; transition: transform .15s; flex-shrink: 0;
        }
        .chm-swatch:hover { transform: scale(1.4); }
        .chm-pill {
          display: flex; align-items: center; gap: 7px;
          background: var(--surface-container-high, #E8E9DE);
          border: 1.5px solid var(--outline-variant, #C5C8BA);
          border-radius: 10px;
          padding: 4px 10px; font-size: 12px; white-space: nowrap;
          animation: chmPillIn .2s ease;
        }
        @keyframes chmPillIn { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:none} }
        .chm-pill-emoji { font-size: 13px; }
        .chm-pill-date  { font-size: 10.5px; color: var(--outline, #75796C); }
        .chm-pill-label { font-weight: 500; }
        .chm-pill-count { font-size: 10.5px; color: var(--outline, #75796C); }
      `}</style>

      <div className="chm-header">
        <div className="chm-header-left">
          <div className="chm-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <div className="chm-title">
              <span className="chm-pulse" />
              Emotional Heatmap
            </div>
            <div className="chm-subtitle">
              Last 90 days · check-in intensity
            </div>
          </div>
        </div>

        <div className="chm-stats">
          {[
            { v: stats.total, l: "Days" },
            { v: stats.avg, l: "Avg" },
            { v: stats.streak, l: "Streak" },
            { v: stats.peak, l: "Peak" },
          ].map(({ v, l }) => (
            <div key={l} className="chm-stat">
              <div className="chm-stat-value">{v}</div>
              <div className="chm-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chm-grid-wrap" ref={svgRef}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={values}
          classForValue={(v) =>
            !v
              ? "color-empty"
              : v.count <= 2
                ? "color-scale-1"
                : v.count <= 4
                  ? "color-scale-2"
                  : v.count <= 7
                    ? "color-scale-3"
                    : "color-scale-4"
          }
          tooltipDataAttrs={(v) => ({
            "data-tip": v?.date
              ? `${v.date} → Intensity ${v.count}`
              : "No data",
          })}
          onClick={(v) => v && setSelectedDay(v)}
          onMouseOver={(_, v) => v && setHoveredDay(v)}
          onMouseLeave={() => setHoveredDay(null)}
          showWeekdayLabels
        />
      </div>

      <div className="chm-footer">
        <div className="chm-legend">
          <span>Less</span>
          {INTENSITY_META.map((m, i) => (
            <div
              key={i}
              className="chm-swatch"
              style={{ background: m.color }}
              title={m.label}
            />
          ))}
          <span>More</span>
        </div>
        {activeDay?.date && activeMeta && (
          <div className="chm-pill" key={activeDay.date}>
            <span className="chm-pill-emoji">{activeMeta.emoji}</span>
            <span className="chm-pill-date">{fmtDate(activeDay.date)}</span>
            <span className="chm-pill-label">{activeMeta.label}</span>
            <span className="chm-pill-count">({activeDay.count}/10)</span>
          </div>
        )}
      </div>
    </div>
  );
}
