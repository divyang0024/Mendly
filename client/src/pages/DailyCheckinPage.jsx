import { useState } from "react";
import DailyCheckinForm from "../components/checkin/DailyCheckinForm";
import CheckinStats from "../components/checkin/CheckinStats";
import CheckinHistory from "../components/checkin/CheckinHistory";
import { Link } from "react-router-dom";

export default function DailyCheckinPage() {
  const [refresh, setRefresh] = useState(false);

  /* ── Original logic — unchanged ── */
  const triggerRefresh = () => setRefresh((r) => !r);
  /* ── End original logic ── */

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --p:#4C662B; --pc:#CDEDA3; --opc:#354E16;
          --s:#586249; --sc:#DCE7C8; --osc:#404A33;
          --t:#386663; --tc:#BCECE7; --otc:#1F4E4B;
          --bg:#F9FAEF; --on:#1A1C16; --onv:#44483D;
          --ol:#75796C; --olv:#C5C8BA;
          --sl:#F3F4E9; --sm:#EEEFE3; --sh:#E8E9DE; --sx:#E2E3D8;
          --inv:#B1D18A;
        }
        *{box-sizing:border-box;}

        .dcp-root { min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--on); width:100%; overflow-x:hidden; }

        /* ── Top nav ── */
        .dcp-topnav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(249,250,239,0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--olv);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          height: 60px;
        }

        .dcp-nav-back {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--onv);
          padding: 6px 10px 6px 6px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }
        .dcp-nav-back:hover { background: var(--sm); color: var(--p); }
        .dcp-nav-back svg { width: 16px; height: 16px; }

        .dcp-nav-divider { width: 1px; height: 18px; background: var(--olv); }

        .dcp-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .dcp-nav-logo-icon {
          width: 30px; height: 30px;
          background: var(--p);
          border-radius: 8px;
          display: grid;
          place-items: center;
        }
        .dcp-nav-logo-icon svg { width: 16px; height: 16px; fill: #FFFFFF; }
        .dcp-nav-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--p);
        }

        .dcp-nav-breadcrumb {
          font-size: 13px;
          color: var(--ol);
        }

        /* Hero */
        .dcp-hero {
          position:relative; overflow:hidden; background:var(--p);
          padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
          min-height: 220px; display:flex; flex-direction:column; justify-content:center;
        }
        .dcp-hero::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 55% 80% at 80% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 35% 50% at 10% 80%, rgba(177,209,138,0.2) 0%, transparent 55%);
        }
        .dcp-hero-ring { position:absolute;border-radius:50%;pointer-events:none;border:1px solid rgba(205,237,163,0.12); }
        .dcp-hero-ring.r1 { width:300px;height:300px;top:-100px;right:-80px; }
        .dcp-hero-ring.r2 { width:180px;height:180px;top:-50px;right:-30px;border-color:rgba(205,237,163,0.08); }
        .dcp-hero-dots { position:absolute;right:8%;top:50%;transform:translateY(-50%);width:160px;height:140px;background-image:radial-gradient(circle,rgba(177,209,138,.35) 1.5px,transparent 1.5px);background-size:20px 20px;opacity:.45;pointer-events:none; }
        .dcp-hero-inner { position:relative;z-index:1;max-width:900px;margin:0 auto;width:100%;display:flex;align-items:center;gap:2rem;flex-wrap:wrap;justify-content:space-between; }
        .dcp-hero-text { flex:1;min-width:220px;display:flex;flex-direction:column; }
        .dcp-hero-eyebrow { display:inline-flex;align-items:center;gap:7px;background:rgba(205,237,163,.12);border:1px solid rgba(205,237,163,.22);border-radius:100px;padding:4px 12px 4px 9px;margin-bottom:1rem;width:fit-content; }
        .dcp-hero-eyebrow span { width:6px;height:6px;background:var(--inv);border-radius:50%;flex-shrink:0;animation:dcpPulse 2.5s ease-in-out infinite; }
        @keyframes dcpPulse{0%,100%{opacity:1}50%{opacity:.35}}
        .dcp-hero-eyebrow p { font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--inv);margin:0; }
        .dcp-hero-title { font-family:'Playfair Display',serif;font-size:clamp(1.55rem,3vw,2.25rem);font-weight:400;color:var(--pc);line-height:1.2;margin:0 0 0.6rem;letter-spacing:-.3px; }
        .dcp-hero-title em { font-style:italic;color:var(--inv); }
        .dcp-hero-sub { font-size:14px;color:rgba(205,237,163,.7);font-weight:300;margin:0;line-height:1.7;max-width:360px; }
        .dcp-hero-chips { display:flex;flex-direction:column;gap:8px;flex-shrink:0; }
        .dcp-hero-chip { display:flex;align-items:center;gap:9px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(205,237,163,.15);min-width:160px; }
        .dcp-hero-chip-icon { width:28px;height:28px;flex-shrink:0;background:rgba(205,237,163,.1);border-radius:8px;display:grid;place-items:center;color:var(--inv); }
        .dcp-hero-chip-icon svg { width:14px;height:14px; }
        .dcp-hero-chip-label { font-size:13px;font-weight:500;color:rgba(205,237,163,.85);line-height:1.3; }
        .dcp-hero-chip-sub { font-size:11px;color:rgba(205,237,163,.45);margin-top:1px; }
        @media(max-width:640px){ .dcp-hero-chips{display:none;} }

        /* Body — two-column on wide screens */
        .dcp-body {
          max-width:900px; margin:0 auto;
          padding:24px 20px 60px;
          display:grid;
          grid-template-columns:1fr 1fr;
          grid-template-rows:auto auto;
          gap:20px;
          align-items:start;
        }

        /* Form spans left column, both rows */
        .dcp-col-form    { grid-column:1; grid-row:1 / 3; }
        /* Stats top right */
        .dcp-col-stats   { grid-column:2; grid-row:1; }
        /* History bottom right */
        .dcp-col-history { grid-column:2; grid-row:2; }

        /* Section labels */
        .dcp-label { display:flex;align-items:center;gap:10px;margin-bottom:12px; }
        .dcp-tag { display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase; }
        .dcp-tag.p { background:var(--pc);color:var(--opc); }
        .dcp-tag.s { background:var(--sc);color:var(--osc); }
        .dcp-tag.t { background:var(--tc);color:var(--otc); }
        .dcp-tag-line { flex:1;height:1px;background:var(--olv);opacity:.6; }

        /* Collapse to 1-col on narrow screens */
        @media(max-width:700px) {
          .dcp-body { grid-template-columns:1fr; }
          .dcp-col-form,.dcp-col-stats,.dcp-col-history { grid-column:1; grid-row:auto; }
          .dcp-hero-title { font-size:1.55rem; }
          .dcp-body { padding:18px 14px 48px; gap:16px; }
        }
      `}</style>

      <div className="dcp-root">
        {/* ── Top nav ── */}
        <header className="dcp-topnav">
          <Link to="/" className="dcp-nav-back">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Home
          </Link>
          <div className="dcp-nav-divider" />
          <Link to="/" className="dcp-nav-logo">
            <div className="dcp-nav-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="dcp-nav-logo-name">Mendly</span>
          </Link>
          <span className="dcp-nav-breadcrumb">/ Check-in</span>
        </header>

        {/* Hero */}
        <div className="dcp-hero">
          <div className="dcp-hero-ring r1" />
          <div className="dcp-hero-ring r2" />
          <div className="dcp-hero-dots" />

          <div className="dcp-hero-inner">
            <div className="dcp-hero-text">
              <div className="dcp-hero-eyebrow">
                <span />
                <p>Daily Check-in</p>
              </div>
              <h1 className="dcp-hero-title">
                Check in with
                <br />
                <em>yourself today</em>
              </h1>
              <p className="dcp-hero-sub">
                Track your mood, energy, stress and sleep to understand your
                patterns
              </p>
            </div>

            <div className="dcp-hero-chips">
              {[
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
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
                  label: "Mood & energy",
                  sub: "Rate how you feel today",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 18a5 5 0 0 0-10 0" />
                      <line x1="12" y1="2" x2="12" y2="9" />
                      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
                      <line x1="1" y1="18" x2="3" y2="18" />
                      <line x1="21" y1="18" x2="23" y2="18" />
                      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
                    </svg>
                  ),
                  label: "Sleep & stress",
                  sub: "Track key wellness signals",
                },
                {
                  icon: (
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
                  ),
                  label: "Build streaks",
                  sub: "Daily consistency counts",
                },
              ].map(({ icon, label, sub }) => (
                <div className="dcp-hero-chip" key={label}>
                  <div className="dcp-hero-chip-icon">{icon}</div>
                  <div>
                    <div className="dcp-hero-chip-label">{label}</div>
                    <div className="dcp-hero-chip-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="dcp-body">
          {/* Left: Form */}
          <div className="dcp-col-form">
            <div className="dcp-label">
              <div className="dcp-tag p">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Today's check-in
              </div>
              <div className="dcp-tag-line" />
            </div>
            <DailyCheckinForm onSaved={triggerRefresh} />
          </div>

          {/* Right top: Stats */}
          <div className="dcp-col-stats">
            <div className="dcp-label">
              <div className="dcp-tag s">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Your trends
              </div>
              <div className="dcp-tag-line" />
            </div>
            <CheckinStats refresh={refresh} />
          </div>

          {/* Right bottom: History */}
          <div className="dcp-col-history">
            <div className="dcp-label">
              <div className="dcp-tag t">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Last 30 days
              </div>
              <div className="dcp-tag-line" />
            </div>
            <CheckinHistory refresh={refresh} />
          </div>
        </div>
      </div>
    </>
  );
}
