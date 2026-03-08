import { useState } from "react";
import BreathingFlow from "../components/breathing/BreathingFlow";
import BreathingStats from "../components/breathing/BreathingStats";

export default function Breathing() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSessionComplete = () => {
    setRefreshKey((k) => k + 1);
  };

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
          --error: #BA1A1A;
          --error-container: #FFDAD6;
        }

        .breathing-root {
          min-height: 100vh;
          background: var(--background);
          font-family: 'DM Sans', sans-serif;
          color: var(--on-background);
        }

        /* ── Top nav ── */
        .breathing-topnav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(249,250,239,0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--outline-variant);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 clamp(1.25rem, 4vw, 2.5rem);
          height: 60px;
        }

        .nav-back {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--on-surface-variant);
          padding: 6px 10px 6px 6px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }
        .nav-back:hover { background: var(--surface-container); color: var(--primary); }
        .nav-back svg { width: 16px; height: 16px; }

        .nav-divider { width: 1px; height: 18px; background: var(--outline-variant); }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 30px; height: 30px;
          background: var(--primary);
          border-radius: 8px;
          display: grid;
          place-items: center;
        }
        .nav-logo-icon svg { width: 16px; height: 16px; fill: var(--on-primary); }
        .nav-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary);
        }

        .nav-breadcrumb {
          font-size: 13px;
          color: var(--outline);
        }

        /* ── Hero ── */
        .breathing-hero {
          position: relative;
          overflow: hidden;
          background: var(--primary);
          padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
        }

        .breathing-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 80% at 80% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 35% 50% at 10% 80%, rgba(177,209,138,0.2) 0%, transparent 55%);
        }

        .hero-ring-b {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(205,237,163,0.12);
          pointer-events: none;
        }
        .hero-ring-b.r1 { width: 300px; height: 300px; top: -100px; right: -80px; }
        .hero-ring-b.r2 { width: 180px; height: 180px; top: -50px; right: -30px; border-color: rgba(205,237,163,0.08); }

        .hero-dots-b {
          position: absolute;
          right: 8%;
          top: 50%;
          transform: translateY(-50%);
          width: 160px;
          height: 140px;
          background-image: radial-gradient(circle, rgba(177,209,138,0.35) 1.5px, transparent 1.5px);
          background-size: 20px 20px;
          opacity: 0.45;
          pointer-events: none;
        }

        .breathing-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .hero-text-b { flex: 1; min-width: 220px; }

        .hero-eyebrow-b {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(205,237,163,0.12);
          border: 1px solid rgba(205,237,163,0.22);
          border-radius: 100px;
          padding: 4px 12px 4px 9px;
          margin-bottom: 1rem;
        }
        .hero-eyebrow-b span {
          width: 6px; height: 6px;
          background: var(--inverse-primary);
          border-radius: 50%;
          animation: pulseDot 2.5s ease-in-out infinite;
        }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .hero-eyebrow-b p {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--inverse-primary);
        }

        .hero-heading-b {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 3vw, 2.25rem);
          font-weight: 400;
          line-height: 1.2;
          color: var(--primary-container);
          margin-bottom: 0.6rem;
        }
        .hero-heading-b em { font-style: italic; color: var(--inverse-primary); }

        .hero-sub-b {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(205,237,163,0.7);
          max-width: 360px;
        }

        /* Hero stat chips */
        .hero-chips-b {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
        }
        .hero-chip-b {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(205,237,163,0.15);
          border-radius: 12px;
          min-width: 160px;
        }
        .chip-icon-b {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(205,237,163,0.1);
          display: grid;
          place-items: center;
          color: var(--inverse-primary);
          flex-shrink: 0;
        }
        .chip-icon-b svg { width: 14px; height: 14px; }
        .chip-text-b { font-size: 13px; font-weight: 500; color: rgba(205,237,163,0.85); line-height: 1.3; }
        .chip-sub-b { font-size: 11px; color: rgba(205,237,163,0.45); }

        /* ── Main content ── */
        .breathing-content {
          max-width: 900px;
          margin: 0 auto;
          padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 2.5rem);
          display: grid;
          gap: 1.75rem;
          grid-template-columns: 1fr;
          align-items: start;
        }

        /* Section label */
        .section-tag-b {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .hero-chips-b { display: none; }
          .breathing-content { padding: 1.5rem 1rem; }
        }
      `}</style>

      <div className="breathing-root">
        {/* Top nav */}
        <header className="breathing-topnav">
          <a href="/" className="nav-back">
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
          </a>
          <div className="nav-divider" />
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="nav-logo-name">Mendly</span>
          </a>
          <span className="nav-breadcrumb">/ Breathing</span>
        </header>

        {/* Hero */}
        <section className="breathing-hero">
          <div className="hero-ring-b r1" />
          <div className="hero-ring-b r2" />
          <div className="hero-dots-b" />

          <div className="breathing-hero-inner">
            <div className="hero-text-b">
              <div className="hero-eyebrow-b">
                <span />
                <p>Breathing Exercise</p>
              </div>
              <h1 className="hero-heading-b">
                Regulate your
                <br />
                <em>breath & body</em>
              </h1>
              <p className="hero-sub-b">
                Guided breathing patterns to calm your nervous system, reduce
                stress, and restore balance — in just a few minutes.
              </p>
            </div>

            <div className="hero-chips-b">
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
                      <path d="M12 8v4l3 3" />
                    </svg>
                  ),
                  label: "3 patterns",
                  sub: "Relax · Box · Extended",
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
                  label: "Track progress",
                  sub: "Effectiveness score",
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
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ),
                  label: "Stress relief",
                  sub: "Before & after rating",
                },
              ].map(({ icon, label, sub }) => (
                <div className="hero-chip-b" key={label}>
                  <div className="chip-icon-b">{icon}</div>
                  <div>
                    <div className="chip-text-b">{label}</div>
                    <div className="chip-sub-b">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <main className="breathing-content">
          <div>
            <span
              className="section-tag-b"
              style={{
                background: "var(--tertiary-container)",
                color: "var(--on-tertiary-container)",
              }}
            >
              Guided session
            </span>
            <BreathingFlow onComplete={handleSessionComplete} />
          </div>

          <div>
            <span
              className="section-tag-b"
              style={{
                background: "var(--secondary-container)",
                color: "var(--on-secondary-container)",
              }}
            >
              Your stats
            </span>
            <BreathingStats refreshKey={refreshKey} />
          </div>
        </main>
      </div>
    </>
  );
}
