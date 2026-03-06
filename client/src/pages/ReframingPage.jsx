import ReframingFlow from "../components/coping/ReframingFlow";
import ReframingHistory from "../components/coping/ReframingHistory";
import ReframingStats from "../components/coping/ReframingStats";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

export default function ReframingPage() {
  const [refresh, setRefresh] = useState(false);

  // ✅ Stable reference — original logic unchanged
  const handleComplete = useCallback(() => {
    setRefresh((r) => !r);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
          --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
          --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
          --background:#F9FAEF;--on-background:#1A1C16;--on-surface:#1A1C16;--on-surface-variant:#44483D;
          --outline:#75796C;--outline-variant:#C5C8BA;
          --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;
          --surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
          --inverse-primary:#B1D18A;
        }
        *{box-sizing:border-box;}
        .rp-root { min-height:100vh; background:var(--background); font-family:'DM Sans',sans-serif; color:var(--on-background); margin-top:-1.5rem; padding-top:1.5rem; width:100%; overflow-x:hidden; }

        /* ── Nav ── */
        .rp-nav { position:sticky;top:0;z-index:50; background:rgba(249,250,239,0.85); backdrop-filter:blur(12px); border-bottom:1px solid var(--outline-variant); padding:0 24px; height:56px; display:flex; align-items:center; justify-content:space-between; }
        .rp-nav-left { display:flex; align-items:center; gap:10px; }
        .rp-back { width:32px;height:32px;border-radius:9px;background:var(--surface-container);border:1px solid var(--outline-variant);display:grid;place-items:center;cursor:pointer;transition:all 0.2s;color:var(--on-surface-variant);text-decoration:none; }
        .rp-back:hover { background:var(--surface-container-high);border-color:var(--outline); }
        .rp-brand { font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--primary);letter-spacing:-0.1px; }
        .rp-breadcrumb { display:flex;align-items:center;gap:6px;font-size:12px;color:var(--outline);font-weight:400; }
        .rp-breadcrumb-dot { width:3px;height:3px;border-radius:50%;background:var(--outline);opacity:0.5; }
        .rp-breadcrumb-current { color:var(--on-surface-variant);font-weight:500; }

        /* ── Hero ── */
        .rp-hero {
          position:relative; overflow:hidden; background:var(--primary);
          padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
          min-height: 220px; display:flex; flex-direction:column; justify-content:center;
        }
        .rp-hero::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 55% 80% at 80% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 35% 50% at 10% 80%, rgba(177,209,138,0.2) 0%, transparent 55%);
        }
        .rp-hero-ring { position:absolute;border-radius:50%;pointer-events:none;border:1px solid rgba(205,237,163,0.12); }
        .rp-hero-ring.r1 { width:300px;height:300px;top:-100px;right:-80px; }
        .rp-hero-ring.r2 { width:180px;height:180px;top:-50px;right:-30px;border-color:rgba(205,237,163,0.08); }
        .rp-hero-dots { position:absolute;right:8%;top:50%;transform:translateY(-50%);width:160px;height:140px;background-image:radial-gradient(circle,rgba(177,209,138,0.35) 1.5px,transparent 1.5px);background-size:20px 20px;opacity:0.45;pointer-events:none; }
        .rp-hero-inner { position:relative;z-index:1;max-width:900px;margin:0 auto;width:100%;display:flex;align-items:center;gap:2rem;flex-wrap:wrap;justify-content:space-between; }
        .rp-hero-text { flex:1;min-width:220px;display:flex;flex-direction:column; }
        .rp-hero-eyebrow { display:inline-flex;align-items:center;gap:7px;background:rgba(205,237,163,0.12);border:1px solid rgba(205,237,163,0.22);border-radius:100px;padding:4px 12px 4px 9px;margin-bottom:1rem;width:fit-content; }
        .rp-hero-eyebrow span { width:6px;height:6px;background:var(--inverse-primary);border-radius:50%;flex-shrink:0;animation:rpPulse 2.5s ease-in-out infinite; }
        @keyframes rpPulse{0%,100%{opacity:1}50%{opacity:0.35}}
        .rp-hero-eyebrow p { font-size:11px;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;color:var(--inverse-primary);margin:0; }
        .rp-hero-title { font-family:'Playfair Display',serif;font-size:clamp(1.6rem,3vw,2.25rem);font-weight:400;color:var(--primary-container);line-height:1.2;margin:0 0 0.6rem;letter-spacing:-0.3px; }
        .rp-hero-title em { font-style:italic;color:var(--inverse-primary); }
        .rp-hero-sub { font-size:14px;color:rgba(205,237,163,0.7);font-weight:300;margin:0;line-height:1.7;max-width:360px; }
        .rp-hero-chips { display:flex;flex-direction:column;gap:8px;flex-shrink:0; }
        .rp-hero-chip { display:flex;align-items:center;gap:9px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,0.07);border:1px solid rgba(205,237,163,0.15);min-width:160px; }
        .rp-hero-chip-icon { width:28px;height:28px;flex-shrink:0;background:rgba(205,237,163,0.1);border-radius:8px;display:grid;place-items:center;color:var(--inverse-primary); }
        .rp-hero-chip-icon svg { width:14px;height:14px; }
        .rp-hero-chip-label { font-size:13px;font-weight:500;color:rgba(205,237,163,0.85);line-height:1.3; }
        .rp-hero-chip-sub { font-size:11px;color:rgba(205,237,163,0.45);margin-top:1px; }
        @media(max-width:640px){ .rp-hero-chips{display:none;} }

        /* ── Body ── */
        .rp-body { max-width:540px;margin:0 auto;padding:32px 20px 60px;display:flex;flex-direction:column;gap:32px; }
        .rp-section-label { display:flex;align-items:center;gap:10px;margin-bottom:14px; }
        .rp-section-tag { display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase; }
        .rp-section-tag.flow    { background:var(--primary-container);color:var(--on-primary-container); }
        .rp-section-tag.stats   { background:var(--secondary-container);color:var(--on-secondary-container); }
        .rp-section-tag.history { background:var(--tertiary-container);color:var(--on-tertiary-container); }
        .rp-section-line { flex:1;height:1px;background:var(--outline-variant);opacity:0.6; }

        @media(max-width:480px){
          .rp-hero-title{font-size:1.6rem;}
          .rp-body{padding:24px 16px 48px;gap:24px;}
        }
      `}</style>

      <div className="rp-root">
        {/* Nav */}
        <nav className="rp-nav">
          <div className="rp-nav-left">
            <Link to="/" className="rp-back">
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
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </Link>
            <span className="rp-brand">Verdant</span>
          </div>
          <div className="rp-breadcrumb">
            <span>Exercises</span>
            <div className="rp-breadcrumb-dot" />
            <span className="rp-breadcrumb-current">Reframing</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="rp-hero">
          <div className="rp-hero-ring r1" />
          <div className="rp-hero-ring r2" />
          <div className="rp-hero-dots" />

          <div className="rp-hero-inner">
            <div className="rp-hero-text">
              <div className="rp-hero-eyebrow">
                <span />
                <p>Cognitive Reframing</p>
              </div>
              <h1 className="rp-hero-title">
                Shift your
                <br />
                <em>perspective</em>
              </h1>
              <p className="rp-hero-sub">
                Challenge automatic thoughts and find a more balanced way of
                seeing situations
              </p>
            </div>

            <div className="rp-hero-chips">
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
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  ),
                  label: "5 steps",
                  sub: "Guided thought process",
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
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  ),
                  label: "~3 minutes",
                  sub: "Quick & effective",
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
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  ),
                  label: "Track shifts",
                  sub: "Session history & stats",
                },
              ].map(({ icon, label, sub }) => (
                <div className="rp-hero-chip" key={label}>
                  <div className="rp-hero-chip-icon">{icon}</div>
                  <div>
                    <div className="rp-hero-chip-label">{label}</div>
                    <div className="rp-hero-chip-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="rp-body">
          <div>
            <div className="rp-section-label">
              <div className="rp-section-tag flow">
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
                Guided session
              </div>
              <div className="rp-section-line" />
            </div>
            <ReframingFlow onComplete={handleComplete} />
          </div>

          <div>
            <div className="rp-section-label">
              <div className="rp-section-tag stats">
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
                Your stats
              </div>
              <div className="rp-section-line" />
            </div>
            <ReframingStats refresh={refresh} />
          </div>

          <div>
            <div className="rp-section-label">
              <div className="rp-section-tag history">
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Recent history
              </div>
              <div className="rp-section-line" />
            </div>
            <ReframingHistory refresh={refresh} />
          </div>
        </div>
      </div>
    </>
  );
}
