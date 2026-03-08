import { useEffect, useState, useRef, useCallback } from "react";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { getCheckinHeatmap } from "../features/checkin/checkin.api";
import { getLongTermSummary } from "../features/longterm/longterm.api";

/* ─── SVG mood scale (replaces emojis) ─────────────────────────── */
const MoodFaces = [
  /* Very low */ () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15.5c.8-1.5 5.2-1.5 6 0" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </svg>
  ),
  /* Low */ () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15c1-1 6-1 7 0" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </svg>
  ),
  /* Neutral */ () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="8" y1="15" x2="16" y2="15" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </svg>
  ),
  /* Good */ () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 13.5c.8 1.5 5.2 1.5 6 0" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </svg>
  ),
  /* Great */ () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 13c.8 2.5 6.2 2.5 7 0" />
      <line x1="9" y1="9.5" x2="9.01" y2="9.5" />
      <line x1="15" y1="9.5" x2="15.01" y2="9.5" />
    </svg>
  ),
];

/* ─── Nav data (unchanged) ─────────────────────────────────────── */
const NAV_SECTIONS = [
  {
    label: "Conversations",
    color: "primary",
    items: [
      {
        to: "/chat",
        title: "Chat",
        sub: "Talk to your AI companion",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Exercises",
    color: "tertiary",
    items: [
      {
        to: "/breathing",
        title: "Breathing",
        sub: "Calm your nervous system",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9S3 8.03 3 13a9 9 0 0 0 9 9z" />
            <path d="M12 8v5l3 3" />
          </svg>
        ),
      },
      {
        to: "/grounding",
        title: "Grounding",
        sub: "Anchor yourself in the present",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 12 2.1 10" />
            <path d="m12 12 3.9-9.3" />
          </svg>
        ),
      },
      {
        to: "/reframing",
        title: "Reframing",
        sub: "Shift your perspective",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
          </svg>
        ),
      },
      {
        to: "/affirmation",
        title: "Affirmation",
        sub: "Build a kinder inner voice",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ),
      },
      {
        to: "/activation",
        title: "Activation",
        sub: "Energise body and mind",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Insights & Progress",
    color: "secondary",
    items: [
      {
        to: "/insights",
        title: "Insights",
        sub: "Understand your patterns",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
      },
      {
        to: "/risk",
        title: "Risk Dashboard",
        sub: "Stay ahead of warning signs",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ),
      },
      {
        to: "/weekly-report",
        title: "Weekly Report",
        sub: "Your week at a glance",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        ),
      },
      {
        to: "/daily-checkin",
        title: "Daily Check-in",
        sub: "How are you feeling today?",
        nudge: true,
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        ),
      },
    ],
  },
];

const colorMap = {
  primary: {
    icon: "var(--primary-container)",
    iconColor: "var(--on-primary-container)",
    tag: "var(--primary-container)",
    tagText: "var(--on-primary-container)",
    border: "rgba(76,102,43,0.18)",
    hoverBg: "rgba(76,102,43,0.05)",
    hoverBorder: "rgba(76,102,43,0.5)",
  },
  tertiary: {
    icon: "var(--tertiary-container)",
    iconColor: "var(--on-tertiary-container)",
    tag: "var(--tertiary-container)",
    tagText: "var(--on-tertiary-container)",
    border: "rgba(56,102,99,0.18)",
    hoverBg: "rgba(56,102,99,0.05)",
    hoverBorder: "rgba(56,102,99,0.5)",
  },
  secondary: {
    icon: "var(--secondary-container)",
    iconColor: "var(--on-secondary-container)",
    tag: "var(--secondary-container)",
    tagText: "var(--on-secondary-container)",
    border: "rgba(88,98,73,0.18)",
    hoverBg: "rgba(88,98,73,0.05)",
    hoverBorder: "rgba(88,98,73,0.5)",
  },
};

/* ═══════════════════════════════════════════════════════════════
   HOME-INLINE STYLED SUB-COMPONENTS
   (self-contained — no external component files needed)
═══════════════════════════════════════════════════════════════ */

/* ── LT Summary Cards ── */
function HomeSummaryCards({ data }) {
  if (!data) return null;
  const items = [
    {
      label: "Total sessions",
      value: data.totalSessions ?? "—",
      unit: "sessions",
      color: "primary",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Average mood",
      value: data.avgMood != null ? data.avgMood.toFixed(1) : "—",
      unit: "/ 10",
      color: "secondary",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
    },
    {
      label: "Top emotion",
      value: data.topEmotion ?? "—",
      unit: "",
      color: "tertiary",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      label: "Best tool",
      value: data.bestTool ?? "—",
      unit: "",
      color: "secondary",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];
  return (
    <div className="hi-summary-grid">
      {items.map(({ label, value, unit, color, icon }) => (
        <div key={label} className={`hi-stat hi-stat-${color}`}>
          <div className={`hi-stat-icon hi-stat-icon-${color}`}>{icon}</div>
          <p className="hi-stat-label">{label}</p>
          <p className="hi-stat-value">
            {value}
            {unit && <span className="hi-stat-unit"> {unit}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── LT Trend Card ── */
/* API trend: { direction:"up"|"down", delta:number } */
function HomeTrendCard({ trend }) {
  if (!trend)
    return (
      <div className="hi-card hi-empty">
        <p className="hi-empty-label">No trend data yet</p>
      </div>
    );
  const up = trend.direction === "up";
  const delta = trend.delta != null ? Math.abs(trend.delta) : 0;
  const accent = up ? "#4C662B" : "#BA1A1A";
  const accentBg = up ? "var(--primary-container)" : "var(--error-container)";
  const accentFg = up
    ? "var(--on-primary-container)"
    : "var(--on-error-container)";

  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    /* ── PQRST waveform sampler ── */
    function ecgSample(t) {
      const p =
        t > 0.08 && t < 0.18
          ? Math.sin((Math.PI * (t - 0.08)) / 0.1) * 0.11
          : 0;
      const q =
        t > 0.26 && t < 0.29
          ? -Math.sin((Math.PI * (t - 0.26)) / 0.03) * 0.2
          : 0;
      const r =
        t > 0.29 && t < 0.36
          ? Math.sin((Math.PI * (t - 0.29)) / 0.07) * 1.0
          : 0;
      const s =
        t > 0.36 && t < 0.41
          ? -Math.sin((Math.PI * (t - 0.36)) / 0.05) * 0.25
          : 0;
      const tw =
        t > 0.45 && t < 0.63
          ? Math.sin((Math.PI * (t - 0.45)) / 0.18) * 0.3
          : 0;
      return p + q + r + s + tw;
    }

    const BEAT = 280;
    const SPEED = 1.5;
    const DPR = window.devicePixelRatio || 1;
    const BG = "#0f1109";
    const ACCENT_RGB = up ? "76,102,43" : "186,26,26";

    function resize() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.scale(DPR, DPR);
      return { w, h };
    }
    let { w, h } = resize();

    /* ── offscreen canvas stores the persistent drawn line ── */
    const offscreen = document.createElement("canvas");
    function resizeOff() {
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
    }
    resizeOff();
    const off = offscreen.getContext("2d");
    off.scale(DPR, DPR);

    /* ── subtle dot-matrix grid on main ctx ── */
    function drawGrid() {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      const cW = w / 8,
        cH = h / 5;
      for (let x = cW; x < w; x += cW)
        for (let y = cH; y < h; y += cH) {
          ctx.beginPath();
          ctx.arc(x, y, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      ctx.restore();
    }

    let px = 0;
    let prevY = h / 2;
    /* trail stores last N {x,y} points */
    const TLEN = 90;
    const trail = [];

    function frame() {
      /* 1. phosphor decay on offscreen — old lines fade slowly */
      off.fillStyle = `rgba(15,17,9,0.055)`;
      off.fillRect(0, 0, w, h);

      /* 2. compute new point */
      const t = (px % BEAT) / BEAT;
      const cy = h / 2 - ecgSample(t) * h * 0.4;

      /* 3. draw glowing line segment on offscreen */
      off.beginPath();
      off.moveTo(px - SPEED, prevY);
      off.lineTo(px, cy);
      off.lineCap = "round";
      off.lineJoin = "round";

      /* fat outer bloom */
      off.lineWidth = 7;
      off.strokeStyle = `rgba(${ACCENT_RGB},0.12)`;
      off.shadowColor = accent;
      off.shadowBlur = 0;
      off.stroke();

      /* medium glow */
      off.lineWidth = 3.5;
      off.strokeStyle = `rgba(${ACCENT_RGB},0.45)`;
      off.shadowColor = accent;
      off.shadowBlur = 8;
      off.stroke();

      /* main bright line */
      off.lineWidth = 1.8;
      off.strokeStyle = accent;
      off.shadowColor = accent;
      off.shadowBlur = 14;
      off.globalAlpha = 1;
      off.stroke();

      /* hot white core */
      off.lineWidth = 0.7;
      off.strokeStyle = "#ffffff";
      off.shadowBlur = 4;
      off.globalAlpha = 0.7;
      off.stroke();

      off.globalAlpha = 1;
      off.shadowBlur = 0;

      /* 4. trail buffer */
      trail.push({ x: px, y: cy });
      if (trail.length > TLEN) trail.shift();

      /* 5. composite offscreen → main */
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      drawGrid();
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height, 0, 0, w, h);

      /* 6. draw fading trail over composite for extra pop */
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1],
          b = trail[i];
        if (Math.abs(b.x - a.x) > w * 0.4) continue;
        const r = i / trail.length;
        if (r < 0.3) continue; /* skip oldest, offscreen handles them */

        const eased = (r - 0.3) / 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineCap = "round";

        /* halo */
        ctx.lineWidth = 10 * eased;
        ctx.strokeStyle = `rgba(${ACCENT_RGB},${0.06 * eased})`;
        ctx.shadowBlur = 0;
        ctx.stroke();

        /* accent */
        ctx.lineWidth = 2.2 * eased;
        ctx.strokeStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 16 * eased;
        ctx.globalAlpha = eased;
        ctx.stroke();

        /* white core near tip */
        if (eased > 0.65) {
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = "#ffffff";
          ctx.shadowBlur = 5;
          ctx.globalAlpha = (eased - 0.65) * 2.2;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      /* 7. tip glow — layered circles */
      const tip = trail[trail.length - 1];
      if (tip) {
        /* outermost halo */
        const radGrad = ctx.createRadialGradient(
          tip.x,
          tip.y,
          0,
          tip.x,
          tip.y,
          18,
        );
        radGrad.addColorStop(0, `rgba(${ACCENT_RGB},0.35)`);
        radGrad.addColorStop(1, "transparent");
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 18, 0, Math.PI * 2);
        ctx.fill();

        /* mid ring */
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 0.7;
        ctx.fill();

        /* bright core */
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 1;
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      prevY = cy;
      px = (px + SPEED) % w;
      if (px < SPEED) {
        off.fillStyle = BG;
        off.fillRect(0, 0, w, h);
        trail.length = 0;
        prevY = h / 2;
        drawGrid();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);
    off.fillStyle = BG;
    off.fillRect(0, 0, w, h);
    drawGrid();
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [accent, up]);

  return (
    <div className="hi-trend-card" style={{ "--accent": accent }}>
      {/* Direction + delta */}
      <div className="hi-trend-top">
        <span
          className="hi-trend-icon"
          style={{ background: accentBg, color: accent }}
        >
          {up ? "↑" : "↓"}
        </span>
        <div className="hi-trend-labels">
          <span className="hi-trend-word" style={{ color: accent }}>
            {up ? "Improving" : "Declining"}
          </span>
          <span className="hi-trend-sub">mood trajectory</span>
        </div>
        {delta > 0 && (
          <span
            className="hi-trend-pill"
            style={{ background: accentBg, color: accentFg }}
          >
            +{delta.toFixed(1)} pts
          </span>
        )}
      </div>

      {/* Canvas ECG */}
      <div className="hi-trend-ecg-wrap">
        <canvas ref={canvasRef} className="hi-trend-ecg-canvas" />
        {/* Live badge top-right */}
        <div className="hi-trend-live">
          <span className="hi-trend-live-dot" style={{ background: accent }} />
          LIVE
        </div>
        {/* pts + direction — bottom-left */}
        <div className="hi-trend-pts" style={{ color: accent }}>
          <span className="hi-trend-pts-arrow">{up ? "↑" : "↓"}</span>
          {delta > 0 && (
            <>
              <span className="hi-trend-pts-num">{delta.toFixed(1)}</span>
              <span className="hi-trend-pts-unit">pts</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── LT Coping Card — SVG donut chart ── */
const HI_COPING_PALETTE = [
  "#4C662B",
  "#386663",
  "#86A33F",
  "#586249",
  "#2d6b68",
  "#6B8A35",
];
const HI_COPING_ICONS = {
  breathing: <path d="M12 22c0-4 4-6 4-10a4 4 0 0 0-8 0c0 4 4 6 4 10z" />,
  activation: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  reframing: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </>
  ),
  affirmation: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  coping: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};
function HomeCopingCard({ usage }) {
  if (!usage || typeof usage !== "object" || Array.isArray(usage))
    return (
      <div className="hi-card hi-empty">
        <p className="hi-empty-label">No coping data yet</p>
      </div>
    );
  const entries = Object.entries(usage).sort((a, b) => b[1] - a[1]);
  if (!entries.length)
    return (
      <div className="hi-card hi-empty">
        <p className="hi-empty-label">No coping data yet</p>
      </div>
    );
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const top = entries[0];
  const topPct = Math.round((top[1] / total) * 100);

  return (
    <div className="hi-card hi-coping-card">
      <div className="hi-card-header">
        <div className="hi-card-icon hi-card-icon-primary">
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="hi-card-titles">
          <p className="hi-card-title">Coping Used</p>
          <p className="hi-card-sub">{total} total uses</p>
        </div>
      </div>

      {/* ── Top: segmented block bars ── */}
      <div className="hi-coping-bars">
        {entries.slice(0, 5).map(([strategy, count], i) => {
          const pct = Math.round((count / total) * 100);
          const segs = 10;
          const filled = Math.round((pct / 100) * segs);
          const icon = HI_COPING_ICONS[strategy] || HI_COPING_ICONS.coping;
          return (
            <div
              key={strategy}
              className="hi-coping-bar-row"
              style={{ "--delay": `${0.08 + i * 0.07}s` }}
            >
              <div className="hi-coping-bar-meta">
                <div className="hi-coping-bar-name">
                  <svg
                    viewBox="0 0 24 24"
                    width="11"
                    height="11"
                    fill="none"
                    stroke={HI_COPING_PALETTE[i]}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    {icon}
                  </svg>
                  <span style={{ textTransform: "capitalize" }}>
                    {strategy}
                  </span>
                </div>
                <span
                  className="hi-coping-bar-pct"
                  style={{ color: HI_COPING_PALETTE[i] }}
                >
                  {pct}%
                </span>
              </div>
              <div className="hi-coping-seg-track">
                {Array.from({ length: segs }, (_, s) => (
                  <div
                    key={s}
                    className={`hi-coping-seg${s < filled ? " hi-coping-seg-on" : ""}`}
                    style={
                      s < filled
                        ? {
                            background: HI_COPING_PALETTE[i],
                            boxShadow: `0 0 6px ${HI_COPING_PALETTE[i]}66`,
                            animationDelay: `${0.12 + i * 0.07 + s * 0.04}s`,
                          }
                        : { animationDelay: `${0.12 + i * 0.07 + s * 0.04}s` }
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom: activity chips ── */}
      <div className="hi-coping-activities">
        <p className="hi-coping-act-label">Activities</p>
        <div className="hi-coping-act-chips">
          {entries.map(([strategy, count], i) => {
            const icon = HI_COPING_ICONS[strategy] || HI_COPING_ICONS.coping;
            return (
              <span
                key={strategy}
                className="hi-coping-chip"
                style={{
                  background: HI_COPING_PALETTE[i] + "1a",
                  borderColor: HI_COPING_PALETTE[i] + "44",
                  color: HI_COPING_PALETTE[i],
                  animationDelay: `${0.3 + i * 0.06}s`,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icon}
                </svg>
                {strategy}
                <span className="hi-chip-count">{count}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Physics Word Cloud ── */
function HomeTriggerCard({ triggers }) {
  if (!triggers?.length)
    return (
      <div className="hi-card hi-empty">
        <p className="hi-empty-label">No triggers logged</p>
      </div>
    );

  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const sizedRef = useRef(false);

  const max = triggers[0]?.count || 1;
  const min = triggers[triggers.length - 1]?.count || 1;
  const range = max - min || 1;
  const heat = (c) => (c - min) / range;

  const tagStyle = (count) => {
    const h = heat(count);
    if (h > 0.7) return { bg: "#4C662B", color: "#fff", border: "#4C662B" };
    if (h > 0.4) return { bg: "#CDEDA3", color: "#354E16", border: "#86A33F" };
    if (h > 0.15) return { bg: "#BCECE7", color: "#1F4E4B", border: "#386663" };
    return { bg: "transparent", color: "#75796C", border: "#C5C8BA" };
  };
  const fontSize = (count) => 0.7 + heat(count) * 0.52;

  /* deterministic seeded RNG */
  const rng = (i, s) =>
    ((i * 2654435761 + s * 1234567) & 0xfffffff) / 0xfffffff;

  /* init / re-init particles from measured DOM nodes */
  const initParticles = useCallback(() => {
    const box = containerRef.current;
    if (!box) return;
    const W = box.clientWidth;
    const H = box.clientHeight;
    if (W < 10 || H < 10) return;

    const nodes = box.querySelectorAll(".hi-cloud-tag");
    const ps = [];
    nodes.forEach((el, i) => {
      const w = el.offsetWidth || 60;
      const h = el.offsetHeight || 28;
      const speed = 38 + rng(i, 9) * 52; /* px/s, 38–90 */
      const angle = rng(i, 7) * 2 * Math.PI;
      ps.push({
        el,
        w,
        h,
        x: rng(i, 1) * Math.max(1, W - w),
        y: rng(i, 2) * Math.max(1, H - h),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
      el.style.left = ps[i].x + "px";
      el.style.top = ps[i].y + "px";
    });
    particlesRef.current = ps;
    sizedRef.current = true;
  }, []);

  /* animation loop */
  useEffect(() => {
    let last = null;

    const tick = (ts) => {
      if (!sizedRef.current) {
        initParticles();
      }
      if (!sizedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0.016;
      last = ts;

      const box = containerRef.current;
      if (!box) return;
      const W = box.clientWidth;
      const H = box.clientHeight;
      const ps = particlesRef.current;

      /* move + wall bounce */
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx);
        }
        if (p.x + p.w > W) {
          p.x = W - p.w;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy);
        }
        if (p.y + p.h > H) {
          p.y = H - p.h;
          p.vy = -Math.abs(p.vy);
        }
      }

      /* word–word collision — elastic bounce + glow flash */
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i],
            b = ps[j];
          const ox = a.x + a.w / 2 - (b.x + b.w / 2);
          const oy = a.y + a.h / 2 - (b.y + b.h / 2);
          const minDx = (a.w + b.w) / 2 + 6;
          const minDy = (a.h + b.h) / 2 + 6;
          if (Math.abs(ox) < minDx && Math.abs(oy) < minDy) {
            /* elastic: exchange velocities along collision axis */
            const norm = Math.sqrt(ox * ox + oy * oy) || 1;
            const nx = ox / norm,
              ny = oy / norm;
            const dvx = a.vx - b.vx,
              dvy = a.vy - b.vy;
            const dot = dvx * nx + dvy * ny;
            if (dot < 0) {
              a.vx -= dot * nx;
              a.vy -= dot * ny;
              b.vx += dot * nx;
              b.vy += dot * ny;
            }
            /* push apart */
            const pushX = (minDx - Math.abs(ox)) * 0.55 * Math.sign(ox);
            const pushY = (minDy - Math.abs(oy)) * 0.55 * Math.sign(oy);
            a.x += pushX;
            a.y += pushY;
            b.x -= pushX;
            b.y -= pushY;
            /* glow flash */
            a.el.classList.add("hi-cloud-bounce");
            b.el.classList.add("hi-cloud-bounce");
            setTimeout(() => {
              a.el.classList.remove("hi-cloud-bounce");
              b.el.classList.remove("hi-cloud-bounce");
            }, 300);
          }
        }
      }

      /* write positions */
      for (const p of ps) {
        p.el.style.left = p.x + "px";
        p.el.style.top = p.y + "px";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [triggers, initParticles]);

  /* re-measure on resize */
  useEffect(() => {
    const box = containerRef.current;
    if (!box) return;
    const ro = new ResizeObserver(() => {
      sizedRef.current = false;
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="hi-card hi-cloud-card">
      <div className="hi-card-header">
        <div className="hi-card-icon hi-card-icon-error">
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="hi-card-titles">
          <p className="hi-card-title">Key Triggers</p>
          <p className="hi-card-sub">{triggers.length} detected</p>
        </div>
      </div>
      {/* Purpose banner — top trigger at a glance */}
      {triggers[0] && (
        <div className="hi-cloud-hero">
          <span className="hi-cloud-hero-word">{triggers[0].keyword}</span>
          <span className="hi-cloud-hero-meta">
            <span className="hi-cloud-hero-count">#{1}</span>
            most mentioned · {triggers[0].count}× across sessions
          </span>
        </div>
      )}
      <div className="hi-cloud-arena" ref={containerRef}>
        {triggers.map(({ keyword, count }, i) => {
          const s = tagStyle(count);
          const h = heat(count);
          const fs = fontSize(count);
          return (
            <span
              key={keyword}
              className="hi-cloud-tag"
              title={`${count} mentions`}
              style={{
                background: s.bg,
                color: s.color,
                border: `1.5px solid ${s.border}`,
                fontSize: `${fs}rem`,
                fontWeight: h > 0.6 ? 700 : h > 0.3 ? 600 : 500,
                boxShadow: h > 0.7 ? "0 4px 14px rgba(76,102,43,0.28)" : "none",
                backdropFilter: "blur(2px)",
              }}
            >
              {keyword}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── LT Highlights Card ── */
/* API highlights: string[] — plain text strings */
function HomeHighlightsCard({ highlights }) {
  if (!highlights?.length)
    return (
      <div className="hi-card hi-empty">
        <p className="hi-empty-label">No AI highlights yet</p>
      </div>
    );
  /* duplicate for seamless infinite scroll */
  const items = [...highlights, ...highlights];
  return (
    <div className="hi-card hi-hl-card">
      <div className="hi-card-header">
        <div className="hi-card-icon hi-card-icon-secondary">
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="hi-card-titles">
          <p className="hi-card-title">AI Highlights</p>
          <p className="hi-card-sub">{highlights.length} insights</p>
        </div>
        <span className="hi-hl-ai-badge">
          <svg
            viewBox="0 0 24 24"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
          </svg>
          AI
        </span>
      </div>
      {/* Marquee track */}
      <div className="hi-hl-marquee-wrap">
        {/* Fade edges */}
        <div className="hi-hl-fade hi-hl-fade-l" />
        <div className="hi-hl-fade hi-hl-fade-r" />
        <div className="hi-hl-track" style={{ "--count": highlights.length }}>
          {items.map((text, i) => (
            <div key={i} className="hi-hl-card-item">
              <span className="hi-hl-tag">
                <svg
                  viewBox="0 0 24 24"
                  width="9"
                  height="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
                </svg>
                AI Insight
              </span>
              <p className="hi-hl-text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────── */
function fmtDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const { logout, user } = useAuth();
  const [msg, setMsg] = useState("Connecting…");
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [ltData, setLtData] = useState(null);
  const [ltLoading, setLtLoading] = useState(true);
  const [ltError, setLtError] = useState(false);
  const connected =
    msg &&
    !msg.toLowerCase().includes("not connected") &&
    msg !== "Connecting…";

  useEffect(() => {
    api
      .get("/")
      .then((r) => setMsg(r.data))
      .catch(() => setMsg("Backend not connected"));
  }, []);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    getCheckinHeatmap()
      .then((res) => {
        const dates = (res.data || []).map((d) => d._id);
        setCheckedInToday(dates.includes(today));
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);
  useEffect(() => {
    setLtLoading(true);
    setLtError(false);
    getLongTermSummary()
      .then((res) => {
        setLtData(res.data);
      })
      .catch(() => setLtError(true))
      .finally(() => setLtLoading(false));
  }, []);

  const hour = new Date().getHours();
  const timeLabel = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const name = user?.name || "there";

  const Sidebar = () => (
    <aside className={`hs-sidebar${mobileOpen ? " hs-sidebar-open" : ""}`}>
      {/* Logo + close (mobile) */}
      <div className="hs-top">
        <a href="/" className="hs-logo">
          <div className="hs-logo-mark">
            <svg viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
            </svg>
          </div>
          <span className="hs-logo-name">Mendly</span>
        </a>
        <button
          className="hs-close-btn"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="16"
            height="16"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Greeting */}
      <div className="hs-greeting">
        <p className="hs-greeting-sub">Good {timeLabel}</p>
        <p className="hs-greeting-name">{name}</p>
        <div className="hs-status-row">
          <span
            className={`hs-conn-dot ${msg === "Connecting…" ? "wait" : connected ? "ok" : "err"}`}
          />
          <span className="hs-greeting-email">{user?.email}</span>
        </div>
      </div>

      {/* Check-in */}
      <Link
        to={checkedInToday ? "/insights" : "/daily-checkin"}
        className={`hs-checkin${checkedInToday ? " hs-checkin-done" : ""}`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="hs-checkin-top">
          <span className="hs-checkin-badge">Today</span>
          {!checkedInToday && (
            <span className="hs-checkin-pulse">
              <span />
            </span>
          )}
        </div>
        <p className="hs-checkin-q">
          {checkedInToday ? (
            <>
              <em>Checked in ✓</em>
            </>
          ) : (
            <>
              How are you
              <br />
              <em>feeling?</em>
            </>
          )}
        </p>
        {!checkedInToday && (
          <div className="hs-checkin-faces">
            {MoodFaces.map((Face, i) => (
              <span
                key={i}
                className="hs-face"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <Face />
              </span>
            ))}
          </div>
        )}
        <span className="hs-checkin-cta">
          {checkedInToday ? "View insights" : "Log mood"}
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </Link>

      {/* Nav */}
      <nav className="hs-nav">
        {NAV_SECTIONS.map((section) => {
          const c = colorMap[section.color];
          return (
            <div key={section.label} className="hs-nav-group">
              <p className="hs-nav-group-label">{section.label}</p>
              {section.items.map(({ to, title, icon, nudge }) => (
                <Link
                  key={to}
                  to={to}
                  className={`hs-nav-item${nudge ? " hs-nav-item-nudge" : ""}`}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.hoverBg;
                    e.currentTarget.style.borderColor = c.hoverBorder;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  <span
                    className="hs-nav-icon"
                    style={{ background: c.icon, color: c.iconColor }}
                  >
                    {icon}
                  </span>
                  <span className="hs-nav-label">{title}</span>
                  {nudge && <span className="hs-nudge-pip" />}
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="hs-sidebar-footer">
        <button className="hs-logout-btn" onClick={logout}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="14"
            height="14"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <style>{homeStyles}</style>
      <div className={`home-root${mounted ? " is-mounted" : ""}`}>
        {/* Mobile topbar */}
        <header className="hs-topbar">
          <button
            className="hs-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="20"
              height="20"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <a href="/" className="hs-topbar-logo">
            <div className="hs-logo-mark">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="hs-logo-name">Mendly</span>
          </a>
          <Link
            to={checkedInToday ? "/insights" : "/daily-checkin"}
            className="hs-topbar-checkin-btn"
          >
            {checkedInToday ? "✓ Checked in" : "Check in"}
          </Link>
        </header>

        {/* Overlay */}
        {mobileOpen && (
          <div className="hs-overlay" onClick={() => setMobileOpen(false)} />
        )}

        <div className="hs-layout">
          <Sidebar />

          {/* ── MAIN CONTENT ── */}
          <main className="hs-main">
            {/* Page header */}
            <div className="hs-page-header">
              <div className="hs-page-title-wrap">
                <h1 className="hs-page-title">
                  Emotional <em>Memory</em>
                </h1>
                <span className="hs-live-chip">
                  <span className="hs-live-dot" />
                  Live
                </span>
              </div>
              <p className="hs-page-sub">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Content */}
            {ltLoading ? (
              <div className="hs-skels">
                <div className="hs-skel-bar4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="hs-skel" style={{ height: 80 }} />
                  ))}
                </div>
                <div
                  className="hs-skel"
                  style={{ height: 240, borderRadius: 20 }}
                />
                <div className="hs-skel-bar2">
                  <div className="hs-skel" style={{ height: 220 }} />
                  <div className="hs-skel" style={{ height: 220 }} />
                </div>
                <div
                  className="hs-skel"
                  style={{ height: 100, borderRadius: 16 }}
                />
              </div>
            ) : ltError ? (
              <div className="hs-empty">
                <div className="hs-empty-icon hs-empty-icon-err">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <p className="hs-empty-title">Couldn't load insights</p>
                <p className="hs-empty-sub">
                  Check your connection and refresh.
                </p>
              </div>
            ) : !ltData ? (
              <div className="hs-empty">
                <div className="hs-empty-ring" />
                <p className="hs-empty-title">No long-term data yet</p>
                <p className="hs-empty-sub">
                  Keep checking in — your emotional memory builds over time.
                </p>
              </div>
            ) : (
              <div className="hs-content">
                {/* ── Stat bar ── */}
                <div className="hs-stat-bar">
                  {[
                    {
                      label: "Sessions",
                      value: ltData.summary?.totalSessions ?? "—",
                      color: "primary",
                    },
                    {
                      label: "Avg mood",
                      value:
                        ltData.summary?.avgMood != null
                          ? ltData.summary.avgMood.toFixed(1)
                          : "—",
                      unit: "/10",
                      color: "tertiary",
                    },
                    {
                      label: "Top emotion",
                      value: ltData.summary?.topEmotion ?? "—",
                      color: "secondary",
                    },
                    {
                      label: "Best tool",
                      value: ltData.summary?.bestTool ?? "—",
                      color: "primary",
                    },
                  ].map(({ label, value, unit, color }, i) => (
                    <div
                      key={label}
                      className={`hs-statbar-tile hs-statbar-tile-${color}`}
                      style={{ "--i": i }}
                    >
                      <p
                        className="hs-statbar-val"
                        style={{ textTransform: "capitalize" }}
                      >
                        {value}
                        {unit && (
                          <span className="hs-statbar-unit">{unit}</span>
                        )}
                      </p>
                      <p className="hs-statbar-label">{label}</p>
                    </div>
                  ))}
                </div>

                {/* ── Triggers ── */}
                <div className="hs-block hs-block-triggers">
                  <div className="hs-block-head">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>Key Triggers</span>
                    <span className="hs-count">
                      {ltData.triggers?.length ?? 0}
                    </span>
                  </div>
                  <div className="hs-block-body">
                    <HomeTriggerCard triggers={ltData.triggers} />
                  </div>
                </div>

                {/* ── Coping + Trend ── */}
                <div className="hs-block hs-block-coping">
                  <div className="hs-block-head">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Coping</span>
                  </div>
                  <div className="hs-block-body">
                    <HomeCopingCard usage={ltData.copingUsage} />
                  </div>
                </div>
                <div className="hs-block hs-block-trend">
                  <div className="hs-block-head">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    <span>Trend</span>
                  </div>
                  <div className="hs-block-body">
                    <HomeTrendCard trend={ltData.trend} />
                  </div>
                </div>

                {/* ── Highlights ── */}
                <div className="hs-block hs-block-highlights">
                  <div className="hs-block-head">
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>AI Highlights</span>
                    <span className="hs-count">
                      {ltData.highlights?.length ?? 0}
                    </span>
                  </div>
                  <div className="hs-block-body">
                    <HomeHighlightsCard highlights={ltData.highlights} />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

const homeStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root {
  --primary:#4C662B; --primary-container:#CDEDA3; --on-primary:#fff; --on-primary-container:#354E16;
  --secondary:#586249; --secondary-container:#DCE7C8; --on-secondary-container:#404A33;
  --tertiary:#386663; --tertiary-container:#BCECE7; --on-tertiary-container:#1F4E4B;
  --error:#BA1A1A; --error-container:#FFDAD6; --on-error-container:#93000A;
  --background:#F9FAEF; --on-background:#1A1C16;
  --on-surface:#1A1C16; --on-surface-variant:#44483D;
  --outline:#75796C; --outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9; --surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE; --surface-container-highest:#E2E3D8;
  --inverse-primary:#B1D18A;
  /* Sidebar dark tokens */
  --sb-bg:#1e2d10; --sb-surface:rgba(255,255,255,0.07);
  --sb-border:rgba(255,255,255,0.09); --sb-text:#e4efcc;
  --sb-muted:rgba(228,239,204,0.45); --sb-w:272px;
}

.home-root { min-height:100vh; background:var(--background); font-family:'DM Sans',sans-serif; color:var(--on-background); }

/* ─── MOBILE TOPBAR (hidden on desktop) ─────────────────────── */
.hs-topbar {
  display:none; position:sticky; top:0; z-index:300;
  height:54px; padding:0 16px;
  align-items:center; justify-content:space-between;
  background:var(--sb-bg);
  border-bottom:1px solid var(--sb-border);
}
.hs-topbar-logo { display:flex; align-items:center; gap:8px; text-decoration:none; }
.hs-hamburger {
  width:36px; height:36px; border-radius:9px; border:none;
  background:var(--sb-surface); color:var(--sb-text);
  display:grid; place-items:center; cursor:pointer; flex-shrink:0;
}
.hs-topbar-checkin-btn {
  font-size:12px; font-weight:600; padding:6px 14px; border-radius:9px;
  background:var(--primary-container); color:var(--on-primary-container);
  text-decoration:none; flex-shrink:0;
}

/* ─── LAYOUT ─────────────────────────────────────────────────── */
.hs-layout {
  display:grid;
  grid-template-columns: var(--sb-w) 1fr;
  min-height:100vh;
}
.hs-overlay { display:none; }

/* ─── SIDEBAR ────────────────────────────────────────────────── */
.hs-sidebar {
  position:sticky; top:0; height:100vh;
  overflow-y:auto; scrollbar-width:none;
  background:var(--sb-bg);
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E"),
    linear-gradient(175deg,#253614 0%,#1e2d10 50%,#1a2b0e 100%);
  display:flex; flex-direction:column;
  border-right:1px solid rgba(255,255,255,0.06);
}
.hs-sidebar::-webkit-scrollbar { display:none; }

/* Logo row */
.hs-top {
  display:flex; align-items:center; justify-content:space-between;
  padding:18px 18px 14px;
  border-bottom:1px solid var(--sb-border); flex-shrink:0;
}
.hs-logo { display:flex; align-items:center; gap:9px; text-decoration:none; }
.hs-logo-mark {
  width:28px; height:28px; border-radius:7px;
  background:rgba(177,209,138,0.15); display:grid; place-items:center;
}
.hs-logo-mark svg { width:15px; height:15px; fill:var(--sb-text); }
.hs-logo-name {
  font-family:'Playfair Display',serif; font-size:1rem;
  font-weight:600; color:var(--sb-text);
}
.hs-close-btn {
  display:none; width:28px; height:28px; border-radius:7px;
  border:1px solid var(--sb-border); background:transparent;
  color:var(--sb-muted); cursor:pointer; place-items:center;
}

/* Greeting */
.hs-greeting {
  padding:18px 18px 14px;
  border-bottom:1px solid var(--sb-border); flex-shrink:0;
}
.hs-greeting-sub {
  font-size:10px; font-weight:500; letter-spacing:0.09em;
  text-transform:uppercase; color:var(--sb-muted); margin-bottom:4px;
}
.hs-greeting-name {
  font-family:'Playfair Display',serif;
  font-size:1.6rem; font-weight:400; color:var(--sb-text);
  line-height:1.1; letter-spacing:-0.01em; margin-bottom:6px;
}
.hs-status-row { display:flex; align-items:center; gap:6px; }
.hs-conn-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.hs-conn-dot.ok   { background:var(--inverse-primary); animation:hsBlink 2.5s ease-in-out infinite; }
.hs-conn-dot.err  { background:#ff8a80; }
.hs-conn-dot.wait { background:rgba(255,255,255,0.3); }
@keyframes hsBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.hs-greeting-email {
  font-size:11px; color:var(--sb-muted);
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}



@keyframes hsFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

/* Check-in card */
.hs-checkin {
  margin:12px 14px;
  border-radius:14px;
  background:rgba(177,209,138,0.08);
  border:1px solid rgba(177,209,138,0.18);
  padding:13px 14px 14px;
  text-decoration:none; color:var(--sb-text);
  display:flex; flex-direction:column; gap:9px;
  position:relative; overflow:hidden;
  transition:background 0.18s, transform 0.18s;
  flex-shrink:0;
}
.hs-checkin::after {
  content:''; position:absolute; top:-30px; right:-30px;
  width:90px; height:90px; border-radius:50%;
  background:radial-gradient(circle,rgba(177,209,138,0.15) 0%,transparent 70%);
  pointer-events:none;
}
.hs-checkin:hover { background:rgba(177,209,138,0.14); transform:translateY(-1px); }
.hs-checkin-done { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.09); }
.hs-checkin-top { display:flex; align-items:center; justify-content:space-between; position:relative; z-index:1; }
.hs-checkin-badge {
  font-size:9px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
  padding:2px 8px; border-radius:100px;
  background:rgba(177,209,138,0.2); color:var(--inverse-primary);
}
.hs-checkin-pulse { width:20px; height:20px; display:grid; place-items:center; }
.hs-checkin-pulse span {
  width:8px; height:8px; border-radius:50%; background:rgba(177,209,138,0.7);
  display:block; position:relative;
}
.hs-checkin-pulse span::before {
  content:''; position:absolute; inset:-5px; border-radius:50%;
  background:rgba(177,209,138,0.18); animation:hsBeacon 2s ease-out infinite;
}
@keyframes hsBeacon { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(2.2);opacity:0} }
.hs-checkin-q {
  font-family:'Playfair Display',serif; font-size:1rem; line-height:1.3;
  position:relative; z-index:1;
}
.hs-checkin-q em { font-style:italic; color:var(--inverse-primary); }
.hs-checkin-faces { display:flex; gap:4px; position:relative; z-index:1; }
.hs-face {
  width:28px; height:28px; border-radius:8px;
  background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1);
  display:grid; place-items:center; color:rgba(228,239,204,0.8);
  animation:hsFaceIn 0.35s ease both; transition:background 0.12s, transform 0.12s;
}
@keyframes hsFaceIn { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
.hs-face:hover { background:rgba(255,255,255,0.18); transform:translateY(-2px); }
.hs-face svg { width:15px; height:15px; display:block; }
.hs-checkin-cta {
  display:inline-flex; align-items:center; gap:5px; justify-content:center;
  font-size:11px; font-weight:600; padding:7px 10px; border-radius:8px;
  background:rgba(177,209,138,0.15); color:var(--inverse-primary);
  position:relative; z-index:1; transition:background 0.15s;
}
.hs-checkin:hover .hs-checkin-cta { background:rgba(177,209,138,0.25); }
.hs-checkin-done .hs-checkin-cta { background:rgba(255,255,255,0.07); color:var(--sb-muted); }

/* Nav */
.hs-nav { padding:12px 14px 8px; display:flex; flex-direction:column; gap:14px; flex:1; }
.hs-nav-group { display:flex; flex-direction:column; gap:2px; }
.hs-nav-group-label {
  font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
  color:var(--sb-muted); padding:0 6px 6px;
}
.hs-nav-item {
  display:flex; align-items:center; gap:9px;
  padding:8px 10px; border-radius:10px;
  border:1px solid transparent;
  text-decoration:none; color:var(--sb-text);
  transition:background 0.15s, border-color 0.15s;
  position:relative;
}
.hs-nav-icon {
  width:28px; height:28px; border-radius:7px;
  display:grid; place-items:center; flex-shrink:0;
  transition:transform 0.15s;
}
.hs-nav-item:hover .hs-nav-icon { transform:scale(1.1); }
.hs-nav-icon svg { width:14px; height:14px; }
.hs-nav-label { font-size:12.5px; font-weight:400; flex:1; }
.hs-nav-item-nudge { border-color:rgba(177,209,138,0.2); }
.hs-nudge-pip {
  width:6px; height:6px; border-radius:50%;
  background:var(--inverse-primary); flex-shrink:0;
  animation:hsBlink 2s ease-in-out infinite;
}

/* Sidebar footer */
.hs-sidebar-footer {
  padding:12px 14px 16px;
  border-top:1px solid var(--sb-border); flex-shrink:0;
}
.hs-logout-btn {
  display:flex; align-items:center; gap:7px; width:100%;
  padding:9px 12px; border-radius:10px; border:1px solid var(--sb-border);
  background:transparent; color:var(--sb-muted);
  font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:500;
  cursor:pointer; transition:all 0.2s;
}
.hs-logout-btn:hover { border-color:rgba(255,100,100,0.4); color:rgba(255,120,120,0.8); background:rgba(255,80,80,0.07); }

/* ─── MAIN CONTENT ───────────────────────────────────────────── */
.hs-main {
  padding:clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,3vw,2.5rem);
  overflow-y:auto; min-height:100vh;
}

/* Page header */
.hs-page-header { margin-bottom:2rem; }
.hs-page-title-wrap {
  display:flex; align-items:center; gap:12px; margin-bottom:5px;
  flex-wrap:wrap;
}
.hs-page-title {
  font-family:'Playfair Display',serif;
  font-size:clamp(1.9rem,4vw,2.9rem); font-weight:400;
  color:var(--on-surface); line-height:1.1; letter-spacing:-0.02em;
}
.hs-page-title em { font-style:italic; color:var(--primary); }
.hs-live-chip {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 10px 3px 7px; border-radius:100px;
  background:var(--tertiary-container); color:var(--on-tertiary-container);
  font-size:10px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;
  flex-shrink:0; align-self:center;
}
.hs-live-dot {
  width:5px; height:5px; border-radius:50%; background:var(--tertiary);
  animation:hsBlink 2s ease-in-out infinite;
}
.hs-page-sub {
  font-size:12px; font-weight:400; color:var(--outline); letter-spacing:0.03em;
}

/* Skeletons */
.hs-skels { display:flex; flex-direction:column; gap:14px; }
.hs-skel-bar4 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.hs-skel-bar2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.hs-skel {
  border-radius:14px; display:block;
  background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%);
  background-size:1200px 100%; animation:hsShimmer 1.6s ease-in-out infinite;
}
@keyframes hsShimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }

/* Empty state */
.hs-empty {
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:12px; text-align:center; min-height:40vh; padding:4rem 2rem;
}
.hs-empty-icon { width:46px; height:46px; border-radius:13px; display:grid; place-items:center; }
.hs-empty-icon-err { background:var(--error-container); color:var(--on-error-container); }
.hs-empty-ring { width:44px; height:44px; border-radius:50%; border:2.5px dashed var(--outline-variant); opacity:0.55; }
.hs-empty-title { font-family:'Playfair Display',serif; font-size:1rem; color:var(--on-surface); }
.hs-empty-sub { font-size:12.5px; color:var(--outline); line-height:1.55; max-width:280px; }

/* Content wrapper — compact bento */
.hs-content {
  display:grid;
  grid-template-columns: 1.45fr 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap:10px;
  min-height:calc(100vh - 200px);
}
.hs-stat-bar         { grid-column:1 / -1; }
.hs-block-triggers   { grid-column:1 / 2; grid-row:2; min-height:220px; }
.hs-block-coping     { grid-column:2 / 3; grid-row:2; min-height:220px; }
.hs-block-trend      { grid-column:3 / 4; grid-row:2; min-height:220px; }
.hs-block-highlights { grid-column:1 / -1; grid-row:3; }
.hs-block-highlights .hs-block-body { flex:1; }
.hs-block-highlights .hi-highlights { height:100%; align-content:start; }

/* STAT BAR */
.hs-stat-bar { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.hs-statbar-tile {
  position:relative; overflow:hidden;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:14px; padding:12px 14px 14px;
  display:flex; flex-direction:column; gap:3px;
  opacity:0; animation:hsFadeIn 0.5s calc(0.08s + var(--i,0)*0.07s) both;
  transition:transform 0.18s, box-shadow 0.18s;
}
.hs-statbar-tile:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(26,28,22,0.1); }
.hs-statbar-tile::before {
  content:''; position:absolute; top:-40px; right:-40px;
  width:90px; height:90px; border-radius:50%; pointer-events:none;
}
.hs-statbar-tile-primary::before  { background:radial-gradient(circle,rgba(76,102,43,0.1) 0%,transparent 65%); }
.hs-statbar-tile-secondary::before{ background:radial-gradient(circle,rgba(88,98,73,0.1) 0%,transparent 65%); }
.hs-statbar-tile-tertiary::before { background:radial-gradient(circle,rgba(56,102,99,0.1) 0%,transparent 65%); }
.hs-statbar-tile-primary  { border-top:3px solid var(--primary-container); }
.hs-statbar-tile-secondary{ border-top:3px solid var(--secondary-container); }
.hs-statbar-tile-tertiary { border-top:3px solid var(--tertiary-container); }
.hs-statbar-val {
  font-family:'Playfair Display',serif;
  font-size:1.3rem; font-weight:400; color:var(--on-surface); line-height:1;
}
.hs-statbar-unit { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--outline); }
.hs-statbar-label { font-size:10px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; color:var(--outline); }

/* BLOCKS */
.hs-block {
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:20px; overflow:hidden;
  animation:hsFadeIn 0.5s ease both;
  display:flex; flex-direction:column;
}
.hs-block-head {
  display:flex; align-items:center; gap:7px;
  padding:10px 16px 9px;
  background:var(--surface-container);
  border-bottom:1px solid var(--outline-variant);
  font-size:10.5px; font-weight:700; letter-spacing:0.05em;
  text-transform:uppercase; color:var(--outline);
}
.hs-count {
  margin-left:auto; font-size:9.5px; font-weight:700;
  padding:1px 7px; border-radius:100px;
  background:var(--surface-container-high); color:var(--on-surface-variant);
}
.hs-block-body { display:flex; flex-direction:column;
  flex:1; overflow:hidden;
}

/* Override hi-cards inside blocks — borderless */
.hs-block .hi-card { border:none; border-radius:0; box-shadow:none; flex:1; }
.hs-block .hi-card-header { display:none; }

/* Triggers inner */
.hs-block-triggers .hi-cloud-card  { display:flex; flex-direction:column; flex:1; }
.hs-block-triggers .hi-cloud-arena { min-height:0 !important; flex:1; }



/* Highlights inner */


/* ─── RESPONSIVE ─────────────────────────────────────────────── */
@media(max-width:1100px) {
  :root { --sb-w:240px; }
}
@media(max-width:800px) {
  :root { --sb-w:220px; }
  .hs-stat-bar { grid-template-columns:1fr 1fr; }
  .hs-skel-bar4 { grid-template-columns:1fr 1fr; }
  .hs-content { grid-template-columns:1fr 1fr; }
  .hs-block-triggers { grid-column:1 / -1; }
  .hs-block-highlights { grid-column:1 / -1; }
}
@media(max-width:640px) {
  /* Sidebar becomes off-canvas drawer */
  .hs-layout { grid-template-columns:1fr; }
  .hs-content { grid-template-columns:1fr; }
  .hs-block-triggers,.hs-block-coping,.hs-block-trend { grid-column:1; grid-row:auto; }
  .hs-topbar  { display:flex; }
  .hs-sidebar {
    position:fixed; top:0; left:0; bottom:0; z-index:400;
    width:280px; transform:translateX(-100%);
    transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);
    box-shadow:none;
  }
  .hs-sidebar-open {
    transform:translateX(0);
    box-shadow:8px 0 40px rgba(0,0,0,0.35);
  }
  .hs-close-btn { display:grid; }
  .hs-overlay {
    display:block; position:fixed; inset:0; z-index:350;
    background:rgba(0,0,0,0.45); backdrop-filter:blur(2px);
  }
  .hs-main { padding:1.25rem 1rem; min-height:auto; }
  .hs-stat-bar { grid-template-columns:1fr 1fr; gap:8px; }
  .hs-skel-bar4 { grid-template-columns:1fr 1fr; }
  .hs-skel-bar2 { grid-template-columns:1fr; }
}
@media(max-width:420px) {
  .hs-stat-bar { grid-template-columns:1fr 1fr; }
  .hs-statbar-val { font-size:1.3rem; }
  .hs-page-title { font-size:1.7rem; }
}

/* ════════════════════════════════════════════════════════════════
   HOME INLINE COMPONENT STYLES  (hi- prefix)
════════════════════════════════════════════════════════════════ */


/* Skeleton */
@keyframes hiShimmer{0%{background-position:-700px 0}100%{background-position:700px 0}}
.hi-skel{
  border-radius:14px; width:100%;
  background:linear-gradient(90deg,var(--surface-container) 25%,var(--surface-container-high) 50%,var(--surface-container) 75%);
  background-size:1400px 100%;
  animation:hiShimmer 1.6s ease-in-out infinite;
}
.hi-skel-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}

.hi-summary-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:10px;
}
.hi-stat{
  position:relative;overflow:hidden;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:16px;padding:14px 14px 16px;
  display:flex;flex-direction:column;gap:5px;
  transition:transform 0.2s,box-shadow 0.2s;
}
.hi-stat:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(26,28,22,0.08);}
.hi-stat::before{
  content:'';position:absolute;top:-35px;right:-35px;
  width:90px;height:90px;border-radius:50%;pointer-events:none;
}
.hi-stat-primary::before {background:radial-gradient(circle,rgba(76,102,43,0.09) 0%,transparent 65%);}
.hi-stat-secondary::before{background:radial-gradient(circle,rgba(88,98,73,0.09) 0%,transparent 65%);}
.hi-stat-tertiary::before {background:radial-gradient(circle,rgba(56,102,99,0.09) 0%,transparent 65%);}
.hi-stat-icon{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;margin-bottom:2px;}
.hi-stat-icon-primary  {background:var(--primary-container);  color:var(--on-primary-container);}
.hi-stat-icon-secondary{background:var(--secondary-container);color:var(--on-secondary-container);}
.hi-stat-icon-tertiary {background:var(--tertiary-container); color:var(--on-tertiary-container);}
.hi-stat-label{font-size:10px;font-weight:500;letter-spacing:0.03em;text-transform:uppercase;color:var(--outline);}
.hi-stat-value{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:400;color:var(--on-surface);line-height:1.1;}
.hi-stat-unit{font-family:'DM Sans',sans-serif;font-size:11px;color:var(--outline);}

/* ── Shared LT Card shell ── */
.hi-card{
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:18px; overflow:hidden;
  display:flex; flex-direction:column;
  box-shadow:0 1px 8px rgba(26,28,22,0.05);
  height:100%;
}
.hi-card-header{
  display:flex;align-items:center;gap:9px;
  padding:12px 14px 10px;
  background:var(--surface-container);
  border-bottom:1px solid var(--outline-variant);
  flex-shrink:0;
}
.hi-card-icon{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:grid;place-items:center;}
.hi-card-icon-primary  {background:var(--primary-container);  color:var(--on-primary-container);}
.hi-card-icon-secondary{background:var(--secondary-container);color:var(--on-secondary-container);}
.hi-card-icon-tertiary {background:var(--tertiary-container); color:var(--on-tertiary-container);}
.hi-card-icon-error    {background:var(--error-container);    color:var(--on-error-container);}
.hi-card-titles{flex:1;min-width:0;}
.hi-card-title{font-size:12.5px;font-weight:600;color:var(--on-surface);line-height:1.2;}
.hi-card-sub{font-size:10.5px;color:var(--outline);margin-top:1px;}
.hi-card-footer{
  display:flex;justify-content:space-between;align-items:center;
  padding:8px 14px 12px; margin-top:auto;
  border-top:1px solid var(--outline-variant);
}
.hi-card-foot-label{font-size:10.5px;color:var(--outline);}
.hi-card-foot-val{font-family:'Playfair Display',serif;font-size:0.95rem;color:var(--on-surface);}

/* Delta small */
.hi-delta-sm{
  margin-left:auto;flex-shrink:0;
  font-size:11px;font-weight:600;padding:2px 7px;border-radius:100px;
}

/* DONUT CHART (Coping) */
/* ── Coping progress bars ── */
.hi-coping-card{ display:flex; flex-direction:column; }
.hi-coping-card .hi-card-header{ flex-shrink:0; }
.hi-coping-bars{
  padding:12px 14px 10px; display:flex; flex-direction:column; gap:10px; flex:1;
}
.hi-coping-bar-row{
  display:flex; flex-direction:column; gap:5px;
  opacity:0; animation:hsFadeIn 0.4s var(--delay,0s) ease both;
}
.hi-coping-bar-meta{
  display:flex; align-items:center; justify-content:space-between;
}
.hi-coping-bar-name{
  display:flex; align-items:center; gap:5px;
  font-size:11px; font-weight:500; color:var(--on-surface-variant);
  text-transform:capitalize;
}
.hi-coping-bar-pct{ font-size:11px; font-weight:700; }
/* Segmented block bars */
.hi-coping-seg-track{
  display:flex; gap:3px; align-items:center;
}
.hi-coping-seg{
  flex:1; height:8px; border-radius:3px;
  background:var(--surface-container-highest);
  transition:background 0.2s, box-shadow 0.2s;
}
.hi-coping-seg-on{
  opacity:0;
  animation:hiSegPop 0.25s var(--delay,0s) cubic-bezier(0.34,1.3,0.64,1) forwards;
}
@keyframes hiSegPop{
  from{ opacity:0; transform:scaleY(0.4); }
  to  { opacity:1; transform:scaleY(1); }
}
/* Activities */
.hi-coping-activities{
  padding:8px 14px 12px;
  border-top:1px solid var(--outline-variant);
}
.hi-coping-act-label{
  font-size:9px; font-weight:700; letter-spacing:0.08em;
  text-transform:uppercase; color:var(--outline); margin-bottom:7px;
}
.hi-coping-act-chips{ display:flex; flex-wrap:wrap; gap:5px; }
.hi-coping-chip{
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 9px 3px 7px; border-radius:100px; border:1px solid;
  font-size:10.5px; font-weight:500;
  opacity:0; animation:hsFadeIn 0.35s var(--delay,0.3s) ease both;
}
.hi-chip-count{
  font-size:9.5px; font-weight:700; padding:1px 5px;
  border-radius:100px; background:rgba(0,0,0,0.08);
  margin-left:2px;
}

/* ── AI Highlights marquee ── */
.hi-hl-card{ display:flex; flex-direction:column; }
.hi-hl-ai-badge{
  margin-left:auto; display:inline-flex; align-items:center; gap:4px;
  padding:2px 8px; border-radius:100px; flex-shrink:0;
  background:var(--secondary-container); color:var(--on-secondary-container);
  font-size:9px; font-weight:700; letter-spacing:0.06em;
}
.hi-hl-marquee-wrap{
  position:relative; overflow:hidden; flex:1;
  min-height:90px; display:flex; align-items:center;
}
.hi-hl-fade{
  position:absolute; top:0; bottom:0; width:40px; z-index:2; pointer-events:none;
}
.hi-hl-fade-l{ left:0;  background:linear-gradient(to right, var(--surface-container-low), transparent); }
.hi-hl-fade-r{ right:0; background:linear-gradient(to left,  var(--surface-container-low), transparent); }
.hi-hl-track{
  display:flex; align-items:center; gap:12px;
  padding:14px 16px;
  /* scroll: each card ~240px wide + 12px gap = 252px × count */
  animation: hiMarquee calc(var(--count,4) * 6s) linear infinite;
  width:max-content;
}
.hi-hl-track:hover{ animation-play-state:paused; }
@keyframes hiMarquee{
  from{ transform:translateX(0); }
  to  { transform:translateX(-50%); }
}
.hi-hl-card-item{
  flex-shrink:0; width:220px;
  background:var(--surface-container);
  border:1.5px solid var(--outline-variant);
  border-radius:14px; padding:11px 13px 13px;
  display:flex; flex-direction:column; gap:6px;
}
.hi-hl-tag{
  display:inline-flex; align-items:center; gap:4px; align-self:flex-start;
  padding:2px 8px; border-radius:100px;
  background:var(--secondary-container); color:var(--on-secondary-container);
  font-size:9px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;
}
.hi-hl-text{
  font-size:12px; font-weight:500; color:var(--on-surface); line-height:1.45;
}


/* HEAT TAGS (Triggers) */
.hi-cloud-card { display:flex; flex-direction:column; flex:1; }
/* Hero banner */
.hi-cloud-hero{
  padding:10px 14px 8px;
  border-bottom:1px solid var(--outline-variant);
  display:flex; align-items:baseline; gap:10px; flex-shrink:0;
}
.hi-cloud-hero-word{
  font-family:'Playfair Display',serif;
  font-size:1.6rem; font-weight:700; font-style:italic;
  color:var(--primary); line-height:1;
}
.hi-cloud-hero-meta{
  font-size:10.5px; color:var(--outline); font-weight:500; line-height:1.3;
}
.hi-cloud-hero-count{
  display:inline-block; background:var(--primary-container);
  color:var(--on-primary-container);
  font-size:9px; font-weight:800; letter-spacing:0.06em;
  padding:1px 6px; border-radius:100px; margin-right:4px;
}
/* Arena */
.hi-cloud-arena {
  position:relative; flex:1;
  min-height:160px; overflow:hidden;
  background:radial-gradient(ellipse at 50% 60%, rgba(76,102,43,0.05) 0%, transparent 70%);
}
.hi-cloud-tag {
  position:absolute;
  display:inline-flex; align-items:center;
  padding:5px 14px; border-radius:100px;
  font-family:'DM Sans',sans-serif; line-height:1;
  white-space:nowrap; cursor:default;
  user-select:none;
  transition:box-shadow 0.18s, transform 0.15s, border-color 0.18s;
  will-change:left,top;
  backdrop-filter:blur(2px);
}
.hi-cloud-tag:hover {
  transform:scale(1.15);
  z-index:10;
}
/* Collision flash */
.hi-cloud-bounce {
  animation: hiCloudBounce 0.3s ease !important;
}
@keyframes hiCloudBounce{
  0%  { filter:brightness(1.6) saturate(1.4); transform:scale(1.18); }
  60% { filter:brightness(1.2) saturate(1.1); transform:scale(1.05); }
  100%{ filter:brightness(1)   saturate(1);   transform:scale(1); }
}


/* Trend card — canvas ECG */
.hs-block-trend { display:flex; flex-direction:column; }
.hs-block-trend .hs-block-body { flex:1; display:flex; }
.hi-trend-card {
  flex:1; display:flex; flex-direction:column;
  padding:16px 16px 14px; gap:12px;
}
.hi-trend-top {
  display:flex; align-items:center; gap:10px; flex-shrink:0;
}
.hi-trend-icon {
  width:36px; height:36px; border-radius:10px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:1.05rem; font-weight:700;
}
.hi-trend-labels {
  flex:1; display:flex; flex-direction:column; gap:3px;
}
.hi-trend-word {
  font-family:'Playfair Display',serif;
  font-size:1.1rem; font-weight:700; font-style:italic; line-height:1;
}
.hi-trend-sub {
  font-size:9.5px; font-weight:600; color:var(--outline);
  text-transform:uppercase; letter-spacing:0.05em;
}
.hi-trend-pill {
  font-size:11px; font-weight:700; padding:4px 11px;
  border-radius:100px; flex-shrink:0;
}
/* ECG canvas container */
.hi-trend-ecg-wrap {
  flex:1; min-height:76px;
  border-radius:12px; overflow:hidden;
  border:1px solid var(--outline-variant);
  position:relative; background:#1A1C16;
}
.hi-trend-ecg-canvas {
  width:100%; height:100%; display:block;
  background:#1A1C16;
}
/* Live badge */
.hi-trend-live {
  position:absolute; top:7px; right:9px;
  display:flex; align-items:center; gap:4px;
  font-family:'DM Sans',sans-serif;
  font-size:8px; font-weight:800; letter-spacing:0.12em;
  color:rgba(255,255,255,0.6);
  padding:2px 7px; border-radius:100px;
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.12);
}
.hi-trend-live-dot {
  width:5px; height:5px; border-radius:50%; flex-shrink:0;
  animation:hiLiveBlink 1.1s ease-in-out infinite;
}
@keyframes hiLiveBlink {
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:0.2; transform:scale(0.7); }
}
.hi-trend-pts {
  position:absolute; bottom:7px; left:9px;
  display:flex; align-items:baseline; gap:3px;
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.12);
  padding:2px 8px; border-radius:100px;
}
.hi-trend-pts-arrow {
  font-size:0.75rem; font-weight:800; line-height:1;
}
.hi-trend-pts-num {
  font-family:'Playfair Display',serif;
  font-size:0.85rem; font-weight:700; line-height:1;
}
.hi-trend-pts-unit {
  font-size:8px; font-weight:700;
  letter-spacing:0.08em; opacity:0.7;
  font-family:'DM Sans',sans-serif;
}

/* Highlights */


.hi-hi-primary  {border-color:rgba(76,102,43,0.22);}
.hi-hi-secondary{border-color:rgba(88,98,73,0.18);}
.hi-hi-error    {border-color:rgba(186,26,26,0.18);}
.hi-hi-tag{
  display:inline-flex;padding:2px 8px;border-radius:100px;
  font-size:9px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
  align-self:flex-start;
}
.hi-hi-tag-primary  {background:var(--primary-container);  color:var(--on-primary-container);}
.hi-hi-tag-secondary{background:var(--secondary-container);color:var(--on-secondary-container);}
.hi-hi-tag-error    {background:var(--error-container);    color:var(--on-error-container);}
.hi-hi-title{font-size:12px;font-weight:600;color:var(--on-surface);line-height:1.3;}
.hi-hi-body{font-size:11px;color:var(--on-surface-variant);line-height:1.5;}
.hi-hi-date{font-size:10px;color:var(--outline);margin-top:auto;}

/* Empty state */
.hi-empty{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:8px;padding:2rem 1rem;min-height:100px;
}
.hi-empty-label{font-size:12px;color:var(--outline);}

/* LT divider */
.hi-lt-divider{height:1px;background:var(--outline-variant);opacity:0.5;margin:4px 0;}

/* ── Bento grid (LT section) ── */
.hi-bento{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.hi-bento-md  {grid-column:span 1;}
.hi-bento-sm  {grid-column:span 1;}
.hi-bento-full{grid-column:span 3;}

/* Bento responsive */
@media(max-width:860px){
  .hi-bento{grid-template-columns:1fr 1fr;}
  .hi-bento-md  {grid-column:span 2;}
  .hi-bento-full{grid-column:span 2;}
  .hi-skel-row{grid-template-columns:1fr 1fr;}
  .hi-summary-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:540px){
  .hi-bento{grid-template-columns:1fr;}
  .hi-bento-md,.hi-bento-sm,.hi-bento-full{grid-column:span 1;}
  .hi-highlights{grid-template-columns:1fr;}
  .hi-skel-row{grid-template-columns:1fr 1fr;}
  .hi-summary-grid{grid-template-columns:1fr 1fr;}
}

/* LT error / empty states */
.hi-lt-error{
  align-items:center; justify-content:center; gap:10px;
  text-align:center; padding:2.5rem 1.5rem;
}
.hi-lt-error-icon{
  width:44px; height:44px; border-radius:13px;
  background:var(--error-container); color:var(--on-error-container);
  display:grid; place-items:center; flex-shrink:0;
}
.hi-lt-error-title{
  font-family:'Playfair Display',serif; font-size:1rem; color:var(--on-surface);
}
.hi-lt-error-sub{ font-size:12.5px; color:var(--outline); line-height:1.5; max-width:320px; }
.hi-lt-empty-ring{
  width:40px; height:40px; border-radius:50%;
  border:2px dashed var(--outline-variant); opacity:0.6;
}
`;
