import { useEffect, useState, useMemo, useRef } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { getCheckinHeatmap } from "../../features/checkin/checkin.api";

/* ── Intensity metadata — SVG icons replace emojis ── */
const INTENSITY_META = [
  {
    max: 0,
    label: "No data",
    color: "#E2E3D8",
    Icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    max: 2,
    label: "Calm",
    color: "#CDEDA3",
    Icon: () => (
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
  },
  {
    max: 4,
    label: "Mild",
    color: "#4C662B",
    Icon: () => (
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
  },
  {
    max: 7,
    label: "Moderate",
    color: "#A16207",
    Icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    max: 10,
    label: "Intense",
    color: "#BA1A1A",
    Icon: () => (
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
  },
];

function getMeta(c) {
  if (!c) return INTENSITY_META[0];
  return INTENSITY_META.find((m) => c <= m.max) || INTENSITY_META[4];
}

/* ── Range options ── */
const RANGES = [
  { key: "6m", label: "6M", days: 180 },
  { key: "12m", label: "12M", days: 365 },
];

export default function CheckinHeatmap() {
  const [values, setValues] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [range, setRange] = useState(() =>
    window.innerWidth >= 768 ? "12m" : "6m",
  );
  const svgRef = useRef(null);

  /* Sync range to viewport width on resize */
  useEffect(() => {
    const handler = () => setRange(window.innerWidth >= 768 ? "12m" : "6m");
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

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

  /* Strip inline w/h the library stamps after every render */
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
  const days = RANGES.find((r) => r.key === range)?.days ?? 90;
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);

  const valuesMap = useMemo(() => {
    const m = {};
    values.forEach((v) => (m[v.date] = v.count));
    return m;
  }, [values]);

  /* Filter values to selected range */
  const rangeValues = useMemo(() => {
    const cutoff = startDate.toISOString().split("T")[0];
    return values.filter((v) => v.date >= cutoff);
  }, [values, range]);

  const stats = useMemo(() => {
    const filled = rangeValues.filter((v) => v.count > 0);
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
  }, [rangeValues, valuesMap]);

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
      <style>{chmStyles}</style>

      {/* ── Header ── */}
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
              Check-in intensity · last{" "}
              {RANGES.find((r) => r.key === range)?.label}
            </div>
          </div>
        </div>

        {/* Range selector */}
        <div className="chm-range">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => {
                setRange(r.key);
                setSelectedDay(null);
              }}
              className={`chm-range-btn${range === r.key ? " active" : ""}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="chm-stats-bar">
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

      {/* ── Heatmap grid ── */}
      <div className="chm-grid-wrap" ref={svgRef}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={rangeValues}
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
          onClick={(v) =>
            v && setSelectedDay((prev) => (prev?.date === v.date ? null : v))
          }
          onMouseOver={(_, v) => v && setHoveredDay(v)}
          onMouseLeave={() => setHoveredDay(null)}
          showWeekdayLabels
        />
      </div>

      {/* ── Footer ── */}
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

        {activeDay?.date && activeMeta ? (
          <div className="chm-pill" key={activeDay.date}>
            <span className="chm-pill-icon" style={{ color: activeMeta.color }}>
              <activeMeta.Icon />
            </span>
            <span className="chm-pill-date">{fmtDate(activeDay.date)}</span>
            <span
              className="chm-pill-label"
              style={{ color: activeMeta.color }}
            >
              {activeMeta.label}
            </span>
            <span className="chm-pill-count">({activeDay.count}/10)</span>
          </div>
        ) : (
          <div className="chm-pill chm-pill-hint">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 15l6 6M9.5 14a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z" />
            </svg>
            Hover or tap a day
          </div>
        )}
      </div>
    </div>
  );
}

const chmStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&family=DM+Sans:wght@300;400;500;600&display=swap');

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
.chm-root {
  font-family:'DM Sans',sans-serif;
  color:var(--on-surface);
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden; position:relative;
  box-shadow:0 1px 12px rgba(26,28,22,0.07);
}
.chm-root::before {
  content:''; position:absolute;
  top:-45px; right:-45px; width:140px; height:140px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,0.06) 0%,transparent 70%);
  pointer-events:none; z-index:0;
}

/* ── HEADER ── */
.chm-header {
  display:flex; align-items:center; justify-content:space-between;
  gap:12px; padding:14px 18px;
  border-bottom:1px solid var(--outline-variant);
  background:var(--surface-container);
  flex-wrap:wrap;
  position:relative; z-index:1;
}
.chm-header-left { display:flex; align-items:center; gap:10px; min-width:0; flex-shrink:1; }
.chm-icon {
  width:30px; height:30px; border-radius:9px; flex-shrink:0;
  background:var(--primary-container); color:var(--on-primary-container);
  display:grid; place-items:center;
}
.chm-icon svg { width:14px; height:14px; }
.chm-title {
  font-family:'Playfair Display',serif; font-size:.95rem;
  color:var(--on-surface); display:flex; align-items:center; gap:7px;
  margin-bottom:2px; white-space:nowrap;
}
.chm-pulse {
  width:7px; height:7px; border-radius:50%;
  background:var(--primary); flex-shrink:0;
  animation:chmPulse 2.5s ease-in-out infinite;
}
@keyframes chmPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
.chm-subtitle { font-size:11px; color:var(--outline); font-weight:300; white-space:nowrap; }

/* ── RANGE SELECTOR ── */
.chm-range {
  display:flex; gap:4px; flex-shrink:0;
}
.chm-range-btn {
  padding:5px 12px; border-radius:8px;
  border:1.5px solid var(--outline-variant);
  background:transparent; color:var(--on-surface-variant);
  font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500;
  cursor:pointer; transition:all 0.18s ease;
}
.chm-range-btn:hover { border-color:rgba(76,102,43,0.35); color:var(--primary); background:var(--surface-container-high); }
.chm-range-btn.active {
  background:var(--primary); color:#fff;
  border-color:var(--primary);
  box-shadow:0 2px 8px rgba(76,102,43,0.22);
}

/* ── STATS BAR ── */
.chm-stats-bar {
  display:grid; grid-template-columns:repeat(4,1fr);
  border-bottom:1px solid var(--outline-variant);
  position:relative; z-index:1;
}
.chm-stat {
  padding:10px 8px; text-align:center;
  border-right:1px solid var(--outline-variant);
  background:var(--surface-container-low);
  transition:background 0.15s;
}
.chm-stat:last-child { border-right:none; }
.chm-stat:hover { background:var(--surface-container); }
.chm-stat-value {
  font-family:'Playfair Display',serif;
  font-size:.95rem; color:var(--on-surface); line-height:1.2;
}
.chm-stat-label {
  font-size:9.5px; color:var(--outline);
  text-transform:uppercase; letter-spacing:0.06em; margin-top:2px;
}

/* ── GRID ── */
.chm-grid-wrap {
  padding:14px 16px 8px;
  background:var(--surface-container-low);
  overflow:hidden; position:relative; z-index:1;
}
.chm-grid-wrap svg.react-calendar-heatmap {
  display:block !important; width:100% !important; height:auto !important;
}
.chm-grid-wrap .react-calendar-heatmap text {
  font-family:'DM Sans',sans-serif; font-size:9px; fill:var(--outline);
}
.chm-grid-wrap .react-calendar-heatmap rect {
  rx:3; ry:3; stroke:transparent; stroke-width:1.5;
  cursor:pointer; transition:stroke .15s,filter .15s;
}
.chm-grid-wrap .react-calendar-heatmap rect:hover {
  stroke:var(--primary); filter:brightness(1.08);
}
.chm-grid-wrap .color-empty   { fill:#E2E3D8; }
.chm-grid-wrap .color-scale-1 { fill:#CDEDA3; }
.chm-grid-wrap .color-scale-2 { fill:#4C662B; }
.chm-grid-wrap .color-scale-3 { fill:#A16207; }
.chm-grid-wrap .color-scale-4 { fill:#BA1A1A; }

/* ── FOOTER ── */
.chm-footer {
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:8px;
  padding:9px 16px 13px;
  border-top:1px solid var(--outline-variant);
  background:var(--surface-container-low);
  position:relative; z-index:1;
}
.chm-legend { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--outline); }
.chm-swatch { width:11px; height:11px; border-radius:3px; cursor:default; transition:transform .15s; flex-shrink:0; }
.chm-swatch:hover { transform:scale(1.4); }

/* Day detail pill */
.chm-pill {
  display:inline-flex; align-items:center; gap:6px;
  background:var(--surface-container-high);
  border:1.5px solid var(--outline-variant);
  border-radius:10px; padding:5px 11px;
  font-size:12px; white-space:nowrap;
  animation:chmPillIn .2s ease;
}
@keyframes chmPillIn { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:none} }
.chm-pill-icon { width:14px; height:14px; display:flex; align-items:center; flex-shrink:0; }
.chm-pill-icon svg { width:14px; height:14px; }
.chm-pill-date  { font-size:10.5px; color:var(--outline); }
.chm-pill-label { font-weight:600; font-size:12px; }
.chm-pill-count { font-size:10.5px; color:var(--outline); }
.chm-pill-hint  { color:var(--outline); font-size:11.5px; font-weight:300; border-style:dashed; }

/* ── RESPONSIVE ── */
@media(max-width:600px) {
  .chm-header { padding:12px 14px; gap:10px; }
  .chm-range-btn { padding:4px 9px; font-size:11px; }
  .chm-stats-bar { grid-template-columns:repeat(4,1fr); }
  .chm-stat { padding:8px 4px; }
  .chm-stat-value { font-size:.85rem; }
  .chm-stat-label { font-size:8.5px; }
  .chm-grid-wrap { padding:10px 10px 6px; }
  .chm-footer { padding:8px 12px 11px; }
  .chm-pill { font-size:11px; padding:4px 9px; }
}

@media(max-width:400px) {
  .chm-title { font-size:.88rem; }
  .chm-range { gap:3px; }
  .chm-range-btn { padding:4px 7px; font-size:10.5px; }
  /* Stack header vertically on very small screens */
  .chm-header { flex-direction:column; align-items:flex-start; }
  .chm-range { align-self:stretch; justify-content:space-between; }
  .chm-range-btn { flex:1; text-align:center; }
}
`;
