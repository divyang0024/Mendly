import { useEffect, useState } from "react";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

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
      // {
      //   to: "/progress",
      //   title: "Progress",
      //   sub: "Track your journey",
      //   icon: (
      //     <svg
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       stroke="currentColor"
      //       strokeWidth="1.8"
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //     >
      //       <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      //     </svg>
      //   ),
      // },
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
      // {
      //   to: "/longterm",
      //   title: "Long-Term Insights",
      //   sub: "See the bigger picture",
      //   icon: (
      //     <svg
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       stroke="currentColor"
      //       strokeWidth="1.8"
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //     >
      //       <circle cx="12" cy="12" r="10" />
      //       <polyline points="12 6 12 12 16 14" />
      //     </svg>
      //   ),
      // },
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
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
    card: "var(--surface-container-low)",
    icon: "var(--primary-container)",
    iconColor: "var(--on-primary-container)",
    tag: "var(--primary-container)",
    tagText: "var(--on-primary-container)",
    border: "rgba(76,102,43,0.15)",
    hover: "rgba(76,102,43,0.06)",
  },
  tertiary: {
    card: "var(--surface-container-low)",
    icon: "var(--tertiary-container)",
    iconColor: "var(--on-tertiary-container)",
    tag: "var(--tertiary-container)",
    tagText: "var(--on-tertiary-container)",
    border: "rgba(56,102,99,0.15)",
    hover: "rgba(56,102,99,0.06)",
  },
  secondary: {
    card: "var(--surface-container-low)",
    icon: "var(--secondary-container)",
    iconColor: "var(--on-secondary-container)",
    tag: "var(--secondary-container)",
    tagText: "var(--on-secondary-container)",
    border: "rgba(88,98,73,0.15)",
    hover: "rgba(88,98,73,0.06)",
  },
};

export default function Home() {
  const { logout } = useAuth();
  const [msg, setMsg] = useState("Connecting…");
  const connected =
    msg &&
    !msg.toLowerCase().includes("not connected") &&
    msg !== "Connecting…";

  useEffect(() => {
    api
      .get("/")
      .then((res) => setMsg(res.data))
      .catch(() => setMsg("Backend not connected"));
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --primary: #4C662B;
          --primary-container: #CDEDA3;
          --on-primary: #FFFFFF;
          --on-primary-container: #354E16;
          --secondary: #586249;
          --secondary-container: #DCE7C8;
          --on-secondary-container: #404A33;
          --tertiary: #386663;
          --tertiary-container: #BCECE7;
          --on-tertiary-container: #1F4E4B;
          --error: #BA1A1A;
          --background: #F9FAEF;
          --on-background: #1A1C16;
          --surface: #F9FAEF;
          --on-surface: #1A1C16;
          --surface-variant: #E1E4D5;
          --on-surface-variant: #44483D;
          --outline: #75796C;
          --outline-variant: #C5C8BA;
          --surface-container-low: #F3F4E9;
          --surface-container: #EEEFE3;
          --surface-container-high: #E8E9DE;
          --surface-container-highest: #E2E3D8;
          --inverse-primary: #B1D18A;
          --inverse-surface: #2F312A;
        }

        .home-root {
          min-height: 100vh;
          background: var(--background);
          font-family: 'DM Sans', sans-serif;
          color: var(--on-background);
        }

        /* ── Top Nav ── */
        .topnav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(249,250,239,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--outline-variant);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          height: 60px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .nav-logo-icon {
          width: 32px; height: 32px;
          background: var(--primary);
          border-radius: 8px;
          display: grid;
          place-items: center;
        }

        .nav-logo-icon svg { width: 17px; height: 17px; fill: var(--on-primary); }

        .nav-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
          letter-spacing: -0.01em;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--surface-container);
          border: 1px solid var(--outline-variant);
          border-radius: 100px;
          padding: 4px 12px 4px 8px;
        }

        .status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.3s;
        }

        .status-dot.ok   { background: var(--primary); animation: blink 2.5s ease-in-out infinite; }
        .status-dot.err  { background: var(--error); }
        .status-dot.wait { background: var(--outline); }

        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }

        .status-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--on-surface-variant);
          max-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: transparent;
          border: 1.5px solid var(--outline-variant);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--on-surface-variant);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .btn-logout:hover {
          border-color: var(--error);
          color: var(--error);
          background: rgba(186,26,26,0.05);
        }

        .btn-logout svg { width: 14px; height: 14px; }

        /* ── Hero ── */
        .hero {
          position: relative;
          overflow: hidden;
          background: var(--primary);
          padding: clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2.5rem);
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 50% 80% at 85% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 40% 60% at 10% 90%, rgba(177,209,138,0.2) 0%, transparent 60%);
        }

        /* dot grid */
        .hero-dots {
          position: absolute;
          right: 5%;
          top: 50%;
          transform: translateY(-50%);
          width: 220px;
          height: 180px;
          background-image: radial-gradient(circle, rgba(177,209,138,0.35) 1.5px, transparent 1.5px);
          background-size: 22px 22px;
          opacity: 0.5;
          pointer-events: none;
        }

        /* ring */
        .hero-ring {
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(205,237,163,0.12);
          top: -100px; right: -80px;
          pointer-events: none;
        }

        .hero-ring-2 {
          width: 200px; height: 200px;
          top: -50px; right: -30px;
          border-color: rgba(205,237,163,0.08);
        }

        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .hero-text { flex: 1; min-width: 240px; }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(205,237,163,0.12);
          border: 1px solid rgba(205,237,163,0.22);
          border-radius: 100px;
          padding: 4px 12px 4px 9px;
          margin-bottom: 1.25rem;
        }

        .hero-eyebrow span {
          width: 6px; height: 6px;
          background: var(--inverse-primary);
          border-radius: 50%;
        }

        .hero-eyebrow p {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--inverse-primary);
        }

        .hero-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: var(--primary-container);
          margin-bottom: 0.75rem;
        }

        .hero-heading em {
          font-style: italic;
          color: var(--inverse-primary);
        }

        .hero-sub {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(205,237,163,0.72);
          max-width: 380px;
        }

        /* Quick-action cards in hero */
        .hero-quick {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        .quick-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(205,237,163,0.18);
          border-radius: 14px;
          text-decoration: none;
          min-width: 120px;
          transition: background 0.2s, transform 0.15s;
          color: var(--primary-container);
        }

        .quick-card:hover {
          background: rgba(255,255,255,0.13);
          transform: translateY(-2px);
        }

        .quick-card svg { width: 18px; height: 18px; color: var(--inverse-primary); }

        .quick-card-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-container);
        }

        .quick-card-sub {
          font-size: 11px;
          color: rgba(205,237,163,0.6);
          letter-spacing: 0.02em;
        }

        /* ── Main content ── */
        .content {
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
        }

        /* Section */
        .section { margin-bottom: 2.5rem; }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
        }

        .section-tag {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: var(--on-background);
        }

        /* Cards grid */
        .cards-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }

        .nav-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          background: var(--surface-container-low);
          border: 1.5px solid transparent;
          border-radius: 16px;
          text-decoration: none;
          color: var(--on-surface);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.18s, box-shadow 0.18s;
          animation: fadeIn 0.5s ease both;
          position: relative;
          overflow: hidden;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nav-card::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .nav-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .card-icon-wrap {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .nav-card:hover .card-icon-wrap { transform: scale(1.08); }

        .card-icon-wrap svg { width: 18px; height: 18px; }

        .card-body { flex: 1; }

        .card-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--on-surface);
          margin-bottom: 2px;
          line-height: 1.3;
        }

        .card-sub {
          font-size: 12px;
          color: var(--outline);
          line-height: 1.4;
        }

        .card-arrow {
          align-self: flex-end;
          color: var(--outline-variant);
          transition: color 0.2s, transform 0.2s;
        }

        .nav-card:hover .card-arrow {
          transform: translateX(2px);
        }

        .card-arrow svg { width: 14px; height: 14px; }

        /* Divider */
        .section-divider {
          height: 1px;
          background: var(--outline-variant);
          margin-bottom: 2.5rem;
          opacity: 0.5;
        }

        /* Footer note */
        .footer-note {
          text-align: center;
          font-size: 12px;
          color: var(--outline-variant);
          padding-bottom: 2rem;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 700px) {
          .hero-quick { display: none; }
          .cards-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .nav-card { padding: 13px; }
          .status-label { max-width: 110px; }
        }

        @media (max-width: 420px) {
          .cards-grid { grid-template-columns: 1fr; }
          .nav-card { flex-direction: row; align-items: center; gap: 12px; }
          .card-arrow { display: none; }
        }
      `}</style>

      <div className="home-root">
        {/* ── Top Nav ── */}
        <header className="topnav">
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="nav-logo-name">Verdant</span>
          </a>

          <div className="nav-right">
            {/* Backend status */}
            <div className="status-chip">
              <span
                className={`status-dot ${
                  msg === "Connecting…" ? "wait" : connected ? "ok" : "err"
                }`}
              />
              <span className="status-label">{msg}</span>
            </div>

            {/* Logout */}
            <button className="btn-logout" onClick={logout}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-ring" />
          <div className="hero-ring hero-ring-2" />
          <div className="hero-dots" />

          <div className="hero-inner">
            <div className="hero-text">
              <div className="hero-eyebrow">
                <span />
                <p>Your dashboard</p>
              </div>
              <h1 className="hero-heading">
                {greeting},<br />
                <em>welcome back</em>
              </h1>
              <p className="hero-sub">
                Everything you need to support your wellbeing — exercises,
                insights, and progress — all in one place.
              </p>
            </div>

            {/* Quick-access hero cards */}
            <div className="hero-quick">
              <Link to="/chat" className="quick-card">
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
                <span className="quick-card-title">Chat</span>
                <span className="quick-card-sub">Start talking</span>
              </Link>

              <Link to="/daily-checkin" className="quick-card">
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
                <span className="quick-card-title">Check-in</span>
                <span className="quick-card-sub">How are you?</span>
              </Link>

              <Link to="/breathing" className="quick-card">
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
                <span className="quick-card-title">Breathe</span>
                <span className="quick-card-sub">Quick reset</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Main sections ── */}
        <main className="content">
          {NAV_SECTIONS.map((section, si) => {
            const c = colorMap[section.color];
            return (
              <div className="section" key={section.label}>
                <div className="section-header">
                  <span
                    className="section-tag"
                    style={{ background: c.tag, color: c.tagText }}
                  >
                    {section.label}
                  </span>
                </div>

                <div className="cards-grid">
                  {section.items.map(({ to, title, sub, icon }, i) => (
                    <Link
                      key={to}
                      to={to}
                      className="nav-card"
                      style={{
                        animationDelay: `${(si * 3 + i) * 60}ms`,
                        borderColor: c.border,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = c.hover;
                        e.currentTarget.style.borderColor = c.iconColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = c.card;
                        e.currentTarget.style.borderColor = c.border;
                      }}
                    >
                      <div
                        className="card-icon-wrap"
                        style={{ background: c.icon, color: c.iconColor }}
                      >
                        {icon}
                      </div>
                      <div className="card-body">
                        <div className="card-title">{title}</div>
                        <div className="card-sub">{sub}</div>
                      </div>
                      <span className="card-arrow">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>

                {si < NAV_SECTIONS.length - 1 && (
                  <div
                    className="section-divider"
                    style={{ marginTop: "2rem" }}
                  />
                )}
              </div>
            );
          })}

          <p className="footer-note">Verdant · Your wellbeing companion</p>
        </main>
      </div>
    </>
  );
}
