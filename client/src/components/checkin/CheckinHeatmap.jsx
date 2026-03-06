import { useEffect, useState, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { getCheckinHeatmap } from "../../features/checkin/checkin.api";

/* ── Brand-mapped intensity levels (light theme) ── */
const INTENSITY_META = [
  { max: 0, label: "No data", emoji: "—", color: "#E2E3D8" }, // surface-container-highest
  { max: 2, label: "Calm", emoji: "🌿", color: "#CDEDA3" }, // primary-container
  { max: 4, label: "Mild", emoji: "🌊", color: "#4C662B" }, // primary
  { max: 7, label: "Moderate", emoji: "🌤", color: "#A16207" }, // amber
  { max: 10, label: "Intense", emoji: "🔥", color: "#BA1A1A" }, // error
];

function getMeta(count) {
  if (!count) return INTENSITY_META[0];
  return INTENSITY_META.find((m) => count <= m.max) || INTENSITY_META[4];
}

export default function CheckinHeatmap() {
  const [values, setValues] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  /* ── Original logic — unchanged ── */
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
  /* ── End original logic ── */

  return (
    <div className="chm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root{
          --primary:#4C662B;--primary-container:#CDEDA3;--on-primary-container:#354E16;
          --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
          --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
          --on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;
          --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
          --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
          --inverse-primary:#B1D18A;
        }

        .chm-root {
          font-family:'DM Sans',sans-serif;
          background:var(--surface-container-low);
          border:1.5px solid var(--outline-variant);
          border-radius:20px;
          overflow:hidden;
          position:relative;
          box-shadow:0 1px 12px rgba(26,28,22,0.07),0 4px 24px rgba(26,28,22,0.04);
          color:var(--on-surface);
          animation:chmFadeUp 0.45s ease-out both;
        }
        @keyframes chmFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .chm-root::before{content:'';position:absolute;top:-45px;right:-45px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(76,102,43,0.07) 0%,transparent 70%);pointer-events:none;}

        /* Header */
        .chm-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:16px 18px;border-bottom:1px solid var(--outline-variant);background:var(--surface-container);}
        .chm-header-left{display:flex;align-items:center;gap:10px;}
        .chm-icon{width:30px;height:30px;border-radius:9px;background:var(--primary-container);color:var(--on-primary-container);display:grid;place-items:center;}
        .chm-icon svg{width:14px;height:14px;}
        .chm-title-group{display:flex;flex-direction:column;gap:2px;}
        .chm-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--on-surface);display:flex;align-items:center;gap:7px;}
        .chm-pulse{width:7px;height:7px;border-radius:50%;background:var(--primary);animation:chmPulse 2.5s ease-in-out infinite;}
        @keyframes chmPulse{0%,100%{opacity:1}50%{opacity:0.35}}
        .chm-subtitle{font-size:12px;color:var(--outline);font-weight:300;padding-left:1px;}

        /* Stats row */
        .chm-stats{display:flex;gap:6px;}
        .chm-stat{background:var(--surface-container-high);border:1px solid var(--outline-variant);border-radius:10px;padding:7px 13px;text-align:center;min-width:62px;transition:border-color 0.2s,box-shadow 0.2s;}
        .chm-stat:hover{border-color:rgba(76,102,43,0.35);box-shadow:0 2px 10px rgba(76,102,43,0.08);}
        .chm-stat-value{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:400;color:var(--on-surface);line-height:1.2;}
        .chm-stat-label{font-size:10px;color:var(--outline);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;}

        /* Grid wrapper */
        .chm-grid-wrap{background:var(--surface-container);border-top:0;border-bottom:1px solid var(--outline-variant);padding:16px 18px 12px;overflow-x:auto;position:relative;z-index:1;}
        .chm-grid-wrap .react-calendar-heatmap{width:100%;}
        .chm-grid-wrap .react-calendar-heatmap text{font-family:'DM Sans',sans-serif;font-size:9px;fill:var(--outline);}
        .chm-grid-wrap .react-calendar-heatmap rect{rx:3;ry:3;stroke:transparent;stroke-width:1.5;cursor:pointer;transition:stroke 0.15s,filter 0.15s;}
        .chm-grid-wrap .react-calendar-heatmap rect:hover{stroke:var(--primary);filter:brightness(1.08);}

        /* Heatmap color classes — brand palette */
        .chm-grid-wrap .color-empty    { fill: #E2E3D8; }
        .chm-grid-wrap .color-scale-1  { fill: #CDEDA3; }
        .chm-grid-wrap .color-scale-2  { fill: #4C662B; }
        .chm-grid-wrap .color-scale-3  { fill: #A16207; }
        .chm-grid-wrap .color-scale-4  { fill: #BA1A1A; }

        /* Footer */
        .chm-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;gap:12px;flex-wrap:wrap;}
        .chm-legend{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--outline);}
        .chm-swatch{width:13px;height:13px;border-radius:3px;cursor:default;transition:transform 0.15s;}
        .chm-swatch:hover{transform:scale(1.4);}

        /* Detail pill */
        .chm-pill{display:flex;align-items:center;gap:8px;background:var(--surface-container-high);border:1.5px solid var(--outline-variant);border-radius:10px;padding:7px 14px;font-size:12.5px;color:var(--on-surface);animation:chmPillIn 0.2s ease;white-space:nowrap;}
        @keyframes chmPillIn{from{opacity:0;transform:translateX(6px)}to{opacity:1;transform:translateX(0)}}
        .chm-pill-emoji{font-size:15px;}
        .chm-pill-date{font-size:11px;color:var(--outline);}
        .chm-pill-label{font-weight:500;color:var(--on-surface);}
        .chm-pill-count{font-size:11px;color:var(--outline);}

        @media(max-width:520px){
          .chm-header{flex-direction:column;}
          .chm-stats{width:100%;}
          .chm-stat{flex:1;padding:6px 8px;min-width:0;}
          .chm-footer{flex-direction:column;align-items:flex-start;}
        }
      `}</style>

      {/* Header */}
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
          <div className="chm-title-group">
            <div className="chm-title">
              <span className="chm-pulse" />
              Emotional Heatmap
            </div>
            <div className="chm-subtitle">
              Last 90 days of check-in intensity
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

      {/* Grid */}
      <div className="chm-grid-wrap">
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
            return { "data-tip": `${value.date} → Intensity ${value.count}` };
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

      {/* Footer */}
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

        {activeDay && activeMeta && activeDay.date && (
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
