import { useEffect, useState } from "react";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { getCheckinHeatmap } from "../features/checkin/checkin.api";

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
  const [checkedInToday, setCheckedInToday] = useState(false);
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
      .catch(() => {}); // silent fail — card defaults to nudge state
  }, []);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const hour = new Date().getHours();
  const timeLabel = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const name = user?.name || "there";

  return (
    <>
      <style>{homeStyles}</style>
      <div className={`home-root${mounted ? " is-mounted" : ""}`}>
        {/* ── Topnav ───────────────────────────────────────────── */}
        <header className="hn-nav">
          <a href="/" className="hn-logo">
            <div className="hn-logo-mark">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="hn-logo-name">Mendly</span>
          </a>

          <div className="hn-nav-right">
            <div className="hn-status">
              <span
                className={`hn-status-dot ${msg === "Connecting…" ? "wait" : connected ? "ok" : "err"}`}
              />
              <span className="hn-status-text">{user?.email}</span>
            </div>
            <button className="hn-logout" onClick={logout}>
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
              <span className="hn-logout-label">Logout</span>
            </button>
          </div>
        </header>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="hn-hero">
          {/* Ambient shapes */}
          <div className="hn-hero-orb hn-hero-orb-1" />
          <div className="hn-hero-orb hn-hero-orb-2" />
          <div className="hn-hero-grid" />

          <div className="hn-hero-inner">
            <div className="hn-hero-text">
              <p className="hn-hero-date">{fmtDate()}</p>
              <h1 className="hn-hero-heading">
                Good {timeLabel},<br />
                <em>{name}</em>
              </h1>
              <p className="hn-hero-sub">
                Your wellbeing space — calm, grounded, and always here.
              </p>

              {/* Quick pills */}
              <div className="hn-quick-pills">
                {[
                  { to: "/chat", label: "Chat now" },
                  { to: "/breathing", label: "Breathe" },
                  { to: "/weekly-report", label: "Weekly report" },
                ].map((p) => (
                  <Link key={p.to} to={p.to} className="hn-quick-pill">
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Check-in feature card in hero */}
            <Link
              to={checkedInToday ? "/insights" : "/daily-checkin"}
              className={`hn-checkin-card${checkedInToday ? " is-done" : ""}`}
            >
              <div className="hn-checkin-card-top">
                <div className="hn-checkin-badge">Today's check-in</div>
                {!checkedInToday && (
                  <div className="hn-checkin-pulse">
                    <span />
                  </div>
                )}
              </div>
              <p className="hn-checkin-q">
                {checkedInToday ? (
                  <>
                    Well done,
                    <br />
                    <em>you checked in!</em>
                  </>
                ) : (
                  <>
                    How are you
                    <br />
                    <em>feeling right now?</em>
                  </>
                )}
              </p>
              {!checkedInToday ? (
                <>
                  <div className="hn-checkin-moods">
                    {MoodFaces.map((Face, i) => (
                      <span
                        key={i}
                        className="hn-mood-dot"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <Face />
                      </span>
                    ))}
                  </div>
                  <div className="hn-checkin-cta">
                    Log how you feel
                    <svg
                      width="14"
                      height="14"
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
                  </div>
                </>
              ) : (
                <>
                  <div className="hn-checkin-done">
                    <div className="hn-checkin-done-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="hn-checkin-done-title">
                        All logged for today
                      </p>
                      <p className="hn-checkin-done-sub">
                        Come back tomorrow to check in again.
                      </p>
                    </div>
                  </div>
                  <div className="hn-checkin-cta hn-checkin-cta-done">
                    View insights
                    <svg
                      width="14"
                      height="14"
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
                  </div>
                </>
              )}
            </Link>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────── */}
        <main className="hn-content">
          {NAV_SECTIONS.map((section, si) => {
            const c = colorMap[section.color];
            return (
              <section
                className="hn-section"
                key={section.label}
                style={{ "--si": si }}
              >
                {/* Section label */}
                <div className="hn-section-label">
                  <span
                    className="hn-section-tag"
                    style={{ background: c.tag, color: c.tagText }}
                  >
                    {section.label}
                  </span>
                  <div className="hn-section-rule" />
                </div>

                {/* Cards */}
                <div
                  className={`hn-grid hn-grid-${section.items.length === 1 ? "single" : section.items.length <= 3 ? "small" : "full"}`}
                >
                  {section.items.map(({ to, title, sub, icon, nudge }, i) => (
                    <Link
                      key={to}
                      to={to}
                      className={`hn-card${nudge ? " hn-card-nudge" : ""}`}
                      style={{ "--ci": i }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = c.hoverBg;
                        e.currentTarget.style.borderColor = c.hoverBorder;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "";
                        e.currentTarget.style.borderColor = nudge ? "" : "";
                      }}
                    >
                      {nudge && <span className="hn-nudge-beacon" />}

                      <div className="hn-card-top">
                        <div
                          className="hn-card-icon"
                          style={{ background: c.icon, color: c.iconColor }}
                        >
                          {icon}
                        </div>
                        {nudge && <span className="hn-nudge-pill">Today</span>}
                      </div>

                      <div className="hn-card-body">
                        <p className="hn-card-title">{title}</p>
                        <p className="hn-card-sub">{sub}</p>
                      </div>

                      <div className="hn-card-footer">
                        <span className="hn-card-arrow">
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
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <footer className="hn-footer">
            <div className="hn-footer-logo">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <p>Mendly · Your wellbeing companion</p>
          </footer>
        </main>
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
  --error:#BA1A1A; --background:#F9FAEF; --on-background:#1A1C16;
  --on-surface:#1A1C16; --on-surface-variant:#44483D;
  --outline:#75796C; --outline-variant:#C5C8BA;
  --surface-container-low:#F3F4E9; --surface-container:#EEEFE3;
  --surface-container-high:#E8E9DE; --surface-container-highest:#E2E3D8;
  --inverse-primary:#B1D18A;
}

.home-root {
  min-height:100vh;
  background:var(--background);
  font-family:'DM Sans',sans-serif;
  color:var(--on-background);
}

/* ── NAV ────────────────────────────────────────────────────────── */
.hn-nav {
  position:sticky; top:0; z-index:200;
  height:60px;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 clamp(1rem,4vw,2.5rem); gap:12px;
  background:rgba(249,250,239,0.9);
  backdrop-filter:blur(16px);
  border-bottom:1px solid var(--outline-variant);
}
.hn-logo { display:flex; align-items:center; gap:9px; text-decoration:none; flex-shrink:0; }
.hn-logo-mark {
  width:32px; height:32px; background:var(--primary);
  border-radius:9px; display:grid; place-items:center;
}
.hn-logo-mark svg { width:17px; height:17px; fill:#fff; }
.hn-logo-name {
  font-family:'Playfair Display',serif; font-size:1.1rem;
  font-weight:600; color:var(--primary); letter-spacing:-0.01em;
}
.hn-nav-right { display:flex; align-items:center; gap:8px; }

.hn-status {
  display:flex; align-items:center; gap:6px;
  background:var(--surface-container); border:1px solid var(--outline-variant);
  border-radius:100px; padding:4px 12px 4px 8px;
}
.hn-status-dot {
  width:7px; height:7px; border-radius:50%; flex-shrink:0;
}
.hn-status-dot.ok   { background:var(--primary); animation:hnBlink 2.5s ease-in-out infinite; }
.hn-status-dot.err  { background:var(--error); }
.hn-status-dot.wait { background:var(--outline); }
@keyframes hnBlink { 0%,100%{opacity:1} 50%{opacity:0.35} }
.hn-status-text {
  font-size:12px; font-weight:500; color:var(--on-surface-variant);
  max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}

.hn-logout {
  display:inline-flex; align-items:center; gap:6px;
  padding:7px 13px;
  border:1.5px solid var(--outline-variant); border-radius:10px;
  background:transparent; color:var(--on-surface-variant);
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
  cursor:pointer; transition:all 0.2s; flex-shrink:0;
}
.hn-logout:hover { border-color:var(--error); color:var(--error); background:rgba(186,26,26,0.05); }
.hn-logout svg { width:14px; height:14px; }
.hn-logout-label { display:none; }
@media(min-width:600px){ .hn-logout-label { display:inline; } }

/* ── HERO ───────────────────────────────────────────────────────── */
.hn-hero {
  position:relative; overflow:hidden;
  background:var(--primary);
  padding:clamp(2.5rem,5vw,4.5rem) clamp(1rem,4vw,2.5rem);
  /* subtle grain texture */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"),
    linear-gradient(135deg, #4C662B 0%, #3a5020 60%, #2d4018 100%);
}
.hn-hero-orb {
  position:absolute; border-radius:50%; pointer-events:none;
}
.hn-hero-orb-1 {
  width:500px; height:500px;
  top:-150px; right:-100px;
  background:radial-gradient(circle, rgba(56,102,99,0.45) 0%, transparent 65%);
  animation:hnOrb1 8s ease-in-out infinite alternate;
}
.hn-hero-orb-2 {
  width:300px; height:300px;
  bottom:-80px; left:-60px;
  background:radial-gradient(circle, rgba(177,209,138,0.2) 0%, transparent 65%);
  animation:hnOrb2 10s ease-in-out infinite alternate;
}
@keyframes hnOrb1 { from{transform:translate(0,0)} to{transform:translate(-30px,20px)} }
@keyframes hnOrb2 { from{transform:translate(0,0)} to{transform:translate(20px,-15px)} }

/* Dot grid */
.hn-hero-grid {
  position:absolute; inset:0; pointer-events:none;
  background-image:radial-gradient(circle, rgba(177,209,138,0.25) 1.5px, transparent 1.5px);
  background-size:28px 28px;
  background-position:14px 14px;
  mask-image:radial-gradient(ellipse 80% 100% at 70% 50%, black 20%, transparent 75%);
}

.hn-hero-inner {
  position:relative; z-index:1;
  max-width:1100px; margin:0 auto;
  display:flex; align-items:center;
  justify-content:space-between;
  gap:2.5rem; flex-wrap:wrap;
}

/* Hero text */
.hn-hero-text { flex:1; min-width:220px; }

.hn-hero-date {
  font-size:11px; font-weight:500;
  letter-spacing:0.1em; text-transform:uppercase;
  color:rgba(205,237,163,0.55); margin-bottom:1rem;
}

.hn-hero-heading {
  font-family:'Playfair Display',serif;
  font-size:clamp(2rem,4vw,3.25rem); font-weight:400;
  line-height:1.15; color:var(--primary-container);
  margin-bottom:0.9rem;
}
.hn-hero-heading em { font-style:italic; color:var(--inverse-primary); }

.hn-hero-sub {
  font-size:14px; line-height:1.75;
  color:rgba(205,237,163,0.65); margin-bottom:1.75rem;
  max-width:340px;
}

/* Quick pills */
.hn-quick-pills { display:flex; flex-wrap:wrap; gap:8px; }
.hn-quick-pill {
  padding:7px 16px;
  border:1px solid rgba(205,237,163,0.3);
  border-radius:100px;
  font-size:12.5px; font-weight:500; color:rgba(205,237,163,0.85);
  text-decoration:none; background:rgba(255,255,255,0.06);
  transition:all 0.2s; white-space:nowrap;
}
.hn-quick-pill:hover {
  background:rgba(205,237,163,0.15);
  border-color:rgba(205,237,163,0.6);
  color:var(--primary-container);
  transform:translateY(-1px);
}

/* ── CHECK-IN HERO CARD ─────────────────────────────────────────── */
.hn-checkin-card {
  flex-shrink:0;
  width:clamp(240px,30vw,300px);
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:24px; overflow:hidden;
  padding:20px 22px 22px;
  text-decoration:none; color:var(--on-surface);
  display:flex; flex-direction:column; gap:16px;
  box-shadow:0 20px 60px rgba(0,0,0,0.25), 0 2px 12px rgba(0,0,0,0.1);
  transition:transform 0.25s ease, box-shadow 0.25s ease;
  position:relative; overflow:hidden;

  /* Entrance animation */
  opacity:0; transform:translateY(20px) scale(0.97);
  animation:hnCardIn 0.6s 0.2s cubic-bezier(0.34,1.1,0.64,1) forwards;
}
@keyframes hnCardIn { to{opacity:1; transform:translateY(0) scale(1);} }
.hn-checkin-card::before {
  content:''; position:absolute;
  top:-50px; right:-50px; width:160px; height:160px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(76,102,43,0.07) 0%, transparent 70%);
  pointer-events:none;
}
.hn-checkin-card:hover {
  transform:translateY(-4px);
  box-shadow:0 28px 70px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.12);
}

.hn-checkin-card-top { display:flex; align-items:center; justify-content:space-between; }
.hn-checkin-badge {
  display:inline-flex; align-items:center; gap:5px;
  background:var(--primary-container); color:var(--on-primary-container);
  padding:3px 10px; border-radius:100px;
  font-size:11px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase;
}
.hn-checkin-pulse {
  width:28px; height:28px; display:grid; place-items:center;
}
.hn-checkin-pulse span {
  width:10px; height:10px; border-radius:50%; background:var(--primary);
  display:block; position:relative;
}
.hn-checkin-pulse span::before {
  content:''; position:absolute; inset:-5px; border-radius:50%;
  background:rgba(76,102,43,0.2);
  animation:hnBeacon 2s ease-out infinite;
}
@keyframes hnBeacon {
  0%{transform:scale(0.8); opacity:0.8}
  100%{transform:scale(2.2); opacity:0}
}

.hn-checkin-q {
  font-family:'Playfair Display',serif;
  font-size:1.25rem; font-weight:400; line-height:1.3;
  color:var(--on-surface);
}
.hn-checkin-q em { font-style:italic; color:var(--primary); }

.hn-checkin-moods {
  display:flex; gap:6px;
}
.hn-mood-dot {
  width:36px; height:36px; border-radius:10px;
  background:var(--surface-container-high);
  border:1.5px solid var(--outline-variant);
  display:grid; place-items:center;
  color:var(--on-surface-variant);
  transition:transform 0.2s, background 0.2s, border-color 0.2s, color 0.2s;
  animation:hnMoodIn 0.4s ease both;
  flex-shrink:0;
}
@keyframes hnMoodIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
.hn-checkin-moods:hover .hn-mood-dot { opacity:0.45; }
.hn-checkin-moods .hn-mood-dot:hover {
  opacity:1 !important;
  background:var(--primary-container);
  border-color:rgba(76,102,43,0.4);
  color:var(--primary);
  transform:translateY(-3px) scale(1.08);
}

.hn-checkin-cta {
  display:inline-flex; align-items:center; gap:7px;
  background:var(--primary); color:#fff;
  padding:11px 18px; border-radius:12px;
  font-size:13.5px; font-weight:500;
  box-shadow:0 4px 14px rgba(76,102,43,0.3);
  transition:all 0.2s; align-self:stretch; justify-content:center;
}
.hn-checkin-card:hover .hn-checkin-cta {
  background:#3d5422;
  box-shadow:0 6px 20px rgba(76,102,43,0.4);
}
/* Done state CTA — secondary */
.hn-checkin-cta-done {
  background:var(--surface-container-high);
  color:var(--on-surface-variant);
  box-shadow:none;
}
.hn-checkin-card:hover .hn-checkin-cta-done {
  background:var(--surface-container-highest);
  box-shadow:none;
}

/* Done state card overlay */
.hn-checkin-card.is-done { border-color:rgba(76,102,43,0.25); }
.hn-checkin-done {
  display:flex; align-items:center; gap:12px;
}
.hn-checkin-done-icon {
  width:36px; height:36px; border-radius:50%; flex-shrink:0;
  background:var(--primary-container); color:var(--primary);
  display:grid; place-items:center;
}
.hn-checkin-done-icon svg { width:16px; height:16px; }
.hn-checkin-done-title { font-size:13.5px; font-weight:600; color:var(--on-surface); margin-bottom:2px; }
.hn-checkin-done-sub { font-size:12px; color:var(--outline); line-height:1.4; }

/* Mood dot SVG fix */
.hn-mood-dot svg { width:20px; height:20px; display:block; }

/* ── MAIN CONTENT ───────────────────────────────────────────────── */
.hn-content {
  max-width:1100px; margin:0 auto;
  padding:clamp(2rem,4vw,3rem) clamp(1rem,4vw,2.5rem);
}

.hn-section {
  margin-bottom:3rem;
  opacity:0; transform:translateY(16px);
  animation:hnSecIn 0.5s calc(0.1s + var(--si,0) * 0.1s) ease both;
}
@keyframes hnSecIn { to{opacity:1;transform:none} }

.hn-section-label {
  display:flex; align-items:center; gap:14px;
  margin-bottom:1.1rem;
}
.hn-section-tag {
  display:inline-flex; padding:4px 12px; border-radius:100px;
  font-size:10.5px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
  white-space:nowrap; flex-shrink:0;
}
.hn-section-rule {
  flex:1; height:1px; background:var(--outline-variant); opacity:0.6;
}

/* ── CARD GRIDS ─────────────────────────────────────────────────── */
.hn-grid {
  display:grid; gap:12px;
}
.hn-grid-full   { grid-template-columns:repeat(auto-fill, minmax(190px,1fr)); }
.hn-grid-small  { grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); }
.hn-grid-single { grid-template-columns:minmax(0,460px); }

/* ── NAV CARD ───────────────────────────────────────────────────── */
.hn-card {
  position:relative; overflow:hidden;
  display:flex; flex-direction:column; gap:12px;
  padding:18px 18px 16px;
  background:var(--surface-container-low);
  border:1.5px solid var(--outline-variant);
  border-radius:18px; text-decoration:none; color:var(--on-surface);
  transition:background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  animation:hnCardFade 0.5s calc(0.2s + var(--ci,0) * 0.07s) ease both;
}
@keyframes hnCardFade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
.hn-card::after {
  content:''; position:absolute;
  top:-40px; right:-40px; width:120px; height:120px; border-radius:50%;
  background:radial-gradient(circle,rgba(76,102,43,0.035) 0%,transparent 70%);
  pointer-events:none;
}
.hn-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(26,28,22,0.1); }

/* Nudge card */
.hn-card-nudge {
  border-color:rgba(76,102,43,0.3) !important;
  box-shadow:0 0 0 4px rgba(205,237,163,0.4);
}
.hn-card-nudge:hover {
  box-shadow:0 12px 32px rgba(76,102,43,0.14), 0 0 0 4px rgba(205,237,163,0.5);
}
.hn-nudge-beacon {
  position:absolute; top:14px; right:14px;
  width:9px; height:9px; border-radius:50%; background:var(--primary);
}
.hn-nudge-beacon::before {
  content:''; position:absolute; inset:-5px; border-radius:50%;
  background:rgba(76,102,43,0.25);
  animation:hnBeacon 2s ease-out infinite;
}
.hn-nudge-pill {
  display:inline-flex; padding:2px 8px; border-radius:100px;
  background:var(--primary-container); color:var(--on-primary-container);
  font-size:10px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase;
}

.hn-card-top { display:flex; align-items:center; justify-content:space-between; }
.hn-card-icon {
  width:40px; height:40px; border-radius:12px;
  display:grid; place-items:center; flex-shrink:0;
  transition:transform 0.2s;
}
.hn-card:hover .hn-card-icon { transform:scale(1.08); }
.hn-card-icon svg { width:18px; height:18px; }

.hn-card-body { flex:1; }
.hn-card-title {
  font-size:14.5px; font-weight:500;
  color:var(--on-surface); margin-bottom:3px; line-height:1.3;
}
.hn-card-sub { font-size:12px; color:var(--outline); line-height:1.5; }

.hn-card-footer { display:flex; justify-content:flex-end; }
.hn-card-arrow {
  width:26px; height:26px; border-radius:8px;
  background:var(--surface-container-high);
  display:grid; place-items:center;
  color:var(--outline); transition:all 0.2s;
}
.hn-card:hover .hn-card-arrow {
  background:var(--primary); color:#fff; transform:translateX(2px);
}
.hn-card-arrow svg { width:13px; height:13px; }

/* ── FOOTER ─────────────────────────────────────────────────────── */
.hn-footer {
  display:flex; align-items:center; justify-content:center; gap:8px;
  padding:2rem 0 1.5rem;
  border-top:1px solid var(--outline-variant);
  color:var(--outline-variant); font-size:12px;
}
.hn-footer-logo {
  width:18px; height:18px; fill:var(--outline-variant);
}
.hn-footer-logo svg { width:18px; height:18px; fill:var(--outline-variant); }

/* ── RESPONSIVE ─────────────────────────────────────────────────── */
@media(max-width:860px) {
  .hn-checkin-card { width:100%; max-width:100%; flex-direction:row; gap:20px; flex-wrap:wrap; }
  .hn-checkin-q { font-size:1.1rem; }
  .hn-grid-full  { grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); }
}

@media(max-width:640px) {
  .hn-hero { padding:2rem 1rem 1.75rem; }
  .hn-hero-inner { flex-direction:column; gap:1.5rem; }
  .hn-checkin-card {
    width:100%; flex-direction:column;
    padding:16px 18px 18px;
  }
  .hn-hero-sub { display:none; }
  .hn-grid-full, .hn-grid-small { grid-template-columns:1fr 1fr; }
  .hn-card { padding:14px 14px 12px; }
  .hn-status-text { max-width:90px; }
}

@media(max-width:420px) {
  .hn-nav { height:54px; }
  .hn-status-text { display:none; }
  .hn-status { padding:4px 8px; }
  .hn-grid-full, .hn-grid-small, .hn-grid-single { grid-template-columns:1fr; }
  .hn-card {
    flex-direction:row; align-items:center;
    gap:12px; padding:12px 14px;
  }
  .hn-card-body { flex:1; }
  .hn-card-footer { display:none; }
  .hn-card::after { display:none; }
  .hn-hero-heading { font-size:1.85rem; }
}
`;
