import { useEffect, useState } from "react";
import { getRiskAssessment } from "../features/risk/risk.api";

import RiskBadge from "../components/risk/RiskBadge";
import RiskSignals from "../components/risk/RiskSignals";
import EscalationCard from "../components/risk/EscalationCard";
import RiskSummary from "../components/risk/RiskSummary";
import RiskTimeline from "../components/risk/RiskTimeline";

export default function RiskDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetchRisk = async () => {
    try {
      const res = await getRiskAssessment();
      setData(res.data);
    } catch (err) {
      console.error("Risk fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisk();
  }, []);

  /* ── Loading State ── */
  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Assessing emotional risk…</p>
      </div>
    );
  }

  if (!data) return null;

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

        .rd-root {
          min-height:100vh; background:var(--background);
          font-family:'DM Sans',sans-serif; color:var(--on-background);
          width:100%; overflow-x:hidden;
        }

        /* ── Top nav ── */
        .rd-topnav {
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

        .rd-nav-back {
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
        .rd-nav-back:hover { background: var(--surface-container); color: var(--primary); }
        .rd-nav-back svg { width: 16px; height: 16px; }

        .rd-nav-divider { width: 1px; height: 18px; background: var(--outline-variant); }

        .rd-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .rd-nav-logo-icon {
          width: 30px; height: 30px;
          background: var(--primary);
          border-radius: 8px;
          display: grid;
          place-items: center;
        }
        .rd-nav-logo-icon svg { width: 16px; height: 16px; fill: var(--on-primary); }
        .rd-nav-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary);
        }

        .rd-nav-breadcrumb {
          font-size: 13px;
          color: var(--outline);
        }

        /* ── Hero ── */
        .rd-hero {
          position:relative; overflow:hidden; background:var(--primary);
          padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
          min-height:220px; display:flex; flex-direction:column; justify-content:center;
        }
        .rd-hero::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 55% 80% at 80% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 35% 50% at 10% 80%, rgba(177,209,138,0.2) 0%, transparent 55%);
        }
        .rd-hero-ring { position:absolute;border-radius:50%;pointer-events:none;border:1px solid rgba(205,237,163,0.12); }
        .rd-hero-ring.r1 { width:300px;height:300px;top:-100px;right:-80px; }
        .rd-hero-ring.r2 { width:180px;height:180px;top:-50px;right:-30px;border-color:rgba(205,237,163,0.08); }
        .rd-hero-dots { position:absolute;right:8%;top:50%;transform:translateY(-50%);width:160px;height:140px;background-image:radial-gradient(circle,rgba(177,209,138,0.35) 1.5px,transparent 1.5px);background-size:20px 20px;opacity:0.45;pointer-events:none; }
        .rd-hero-inner { position:relative;z-index:1;max-width:900px;margin:0 auto;width:100%;display:flex;align-items:center;gap:2rem;flex-wrap:wrap;justify-content:space-between; }
        .rd-hero-text { flex:1;min-width:220px;display:flex;flex-direction:column; }
        .rd-hero-eyebrow { display:inline-flex;align-items:center;gap:7px;background:rgba(205,237,163,0.12);border:1px solid rgba(205,237,163,0.22);border-radius:100px;padding:4px 12px 4px 9px;margin-bottom:1rem;width:fit-content; }
        .rd-hero-eyebrow span { width:6px;height:6px;background:var(--inverse-primary);border-radius:50%;flex-shrink:0;animation:rdPulse 2.5s ease-in-out infinite; }
        @keyframes rdPulse{0%,100%{opacity:1}50%{opacity:0.35}}
        .rd-hero-eyebrow p { font-size:11px;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;color:var(--inverse-primary);margin:0; }
        .rd-hero-title { font-family:'Playfair Display',serif;font-size:clamp(1.6rem,3vw,2.25rem);font-weight:400;color:var(--primary-container);line-height:1.2;margin:0 0 0.6rem;letter-spacing:-0.3px; }
        .rd-hero-title em { font-style:italic;color:var(--inverse-primary); }
        .rd-hero-sub { font-size:14px;color:rgba(205,237,163,0.7);font-weight:300;margin:0;line-height:1.7;max-width:360px; }
        .rd-hero-chips { display:flex;flex-direction:column;gap:8px;flex-shrink:0; }
        .rd-hero-chip { display:flex;align-items:center;gap:9px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,0.07);border:1px solid rgba(205,237,163,0.15);min-width:160px; }
        .rd-hero-chip-icon { width:28px;height:28px;flex-shrink:0;background:rgba(205,237,163,0.1);border-radius:8px;display:grid;place-items:center;color:var(--inverse-primary); }
        .rd-hero-chip-icon svg { width:14px;height:14px; }
        .rd-hero-chip-label { font-size:13px;font-weight:500;color:rgba(205,237,163,0.85);line-height:1.3; }
        .rd-hero-chip-sub { font-size:11px;color:rgba(205,237,163,0.45);margin-top:1px; }
        @media(max-width:640px){ .rd-hero-chips{display:none;} }
      `}</style>

      <div className="rd-root">
        {/* ── Top nav ── */}
        <header className="rd-topnav">
          <a href="/" className="rd-nav-back">
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
          <div className="rd-nav-divider" />
          <a href="/" className="rd-nav-logo">
            <div className="rd-nav-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="rd-nav-logo-name">Verdant</span>
          </a>
          <span className="rd-nav-breadcrumb">/ Risk Dashboard</span>
        </header>

        {/* ── Hero ── */}
        <div className="rd-hero">
          <div className="rd-hero-ring r1" />
          <div className="rd-hero-ring r2" />
          <div className="rd-hero-dots" />

          <div className="rd-hero-inner">
            <div className="rd-hero-text">
              <div className="rd-hero-eyebrow">
                <span />
                <p>Risk Escalation</p>
              </div>
              <h1 className="rd-hero-title">
                Monitor emotional
                <br />
                <em>risk in real time</em>
              </h1>
              <p className="rd-hero-sub">
                Real-time emotional risk monitoring &amp; escalation tracking
              </p>
            </div>

            <div className="rd-hero-chips">
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
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ),
                  label: "Risk level",
                  sub: "Live assessment score",
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
                  label: "Signal tracking",
                  sub: "Emotional pattern alerts",
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
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  ),
                  label: "Escalation",
                  sub: "Guided intervention steps",
                },
              ].map(({ icon, label, sub }) => (
                <div className="rd-hero-chip" key={label}>
                  <div className="rd-hero-chip-icon">{icon}</div>
                  <div>
                    <div className="rd-hero-chip-label">{label}</div>
                    <div className="rd-hero-chip-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Page body ── */}
        <div style={styles.page}>
          {/* ── Primary Assessment ── */}
          <section style={styles.assessmentCard}>
            <div style={styles.assessmentInner}>
              <div style={styles.badgeColumn}>
                <span style={styles.assessmentLabel}>Current Level</span>
                <RiskBadge level={data.riskLevel} />
              </div>
              <div style={styles.signalsColumn}>
                <RiskSignals signals={data.signals} />
              </div>
            </div>
          </section>

          {/* ── Escalation ── */}
          <EscalationCard escalation={data.escalation} />

          {/* ── Divider ── */}
          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerLabel}>Monitoring</span>
            <span style={styles.dividerLine} />
          </div>

          {/* ── Summary Cards ── */}
          <RiskSummary refresh={refresh} />

          {/* ── Timeline ── */}
          <RiskTimeline refresh={refresh} />

          {/* ── Refresh Button ── */}
          <div style={styles.refreshRow}>
            <button
              onClick={() => setRefresh(!refresh)}
              style={styles.refreshButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--md-primary)";
                e.currentTarget.style.color = "var(--md-on-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "var(--md-surface-container)";
                e.currentTarget.style.color = "var(--md-on-surface)";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
              </svg>
              Refresh Monitoring
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────
   Inline styles – uses CSS custom properties
   from material-theme.css
   ──────────────────────────────────────────── */
const styles = {
  page: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "clamp(16px, 4vw, 40px)",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  /* Loading */
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: 16,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    border: "3px solid var(--md-outline-variant)",
    borderTopColor: "var(--md-primary)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    font: "var(--md-body-large)",
    color: "var(--md-on-surface-variant)",
  },

  /* Assessment Section */
  assessmentCard: {
    background: "var(--md-surface-container-lowest)",
    borderRadius: "var(--md-shape-lg)",
    boxShadow: "var(--md-elevation-2)",
    overflow: "hidden",
  },
  assessmentInner: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0,
  },
  badgeColumn: {
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 40px",
    gap: 12,
    borderRight: "1px solid var(--md-outline-variant)",
    minWidth: 180,
  },
  assessmentLabel: {
    font: "var(--md-label-medium)",
    color: "var(--md-on-surface-variant)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  signalsColumn: {
    flex: 1,
    minWidth: 280,
  },

  /* Divider */
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "8px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "var(--md-outline-variant)",
  },
  dividerLabel: {
    font: "var(--md-label-large)",
    color: "var(--md-on-surface-variant)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  /* Refresh */
  refreshRow: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: 24,
  },
  refreshButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    font: "var(--md-label-large)",
    color: "var(--md-on-surface)",
    background: "var(--md-surface-container)",
    border: "1px solid var(--md-outline-variant)",
    borderRadius: "var(--md-shape-full)",
    padding: "10px 24px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};
