import { useEffect, useState } from "react";
import {
  generateWeeklyReport,
  getLatestWeeklyReport,
} from "../features/reports/weeklyReport.api";

import ReportSummary from "../components/reports/ReportSummary";
import ReportTrend from "../components/reports/ReportTrend";
import ReportUsage from "../components/reports/ReportUsage";
import ReportTriggers from "../components/reports/ReportTriggers";
import ReportHighlights from "../components/reports/ReportHighlights";
import ReportNarrative from "../components/reports/ReportNarrative";

export default function WeeklyReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    const res = await getLatestWeeklyReport();
    setReport(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    await generateWeeklyReport();
    await fetchReport();
    setGenerating(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Loading your emotional report...</p>
      </div>
    );
  }

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

        .wrp-root {
          min-height:100vh; background:var(--background);
          font-family:'DM Sans',sans-serif; color:var(--on-background);
          margin-top:-1.5rem; padding-top:1.5rem; width:100%; overflow-x:hidden;
        }

        /* ── Hero ── */
        .wrp-hero {
          position:relative; overflow:hidden; background:var(--primary);
          padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
          min-height:220px; display:flex; flex-direction:column; justify-content:center;
        }
        .wrp-hero::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 55% 80% at 80% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 35% 50% at 10% 80%, rgba(177,209,138,0.2) 0%, transparent 55%);
        }
        .wrp-hero-ring { position:absolute;border-radius:50%;pointer-events:none;border:1px solid rgba(205,237,163,0.12); }
        .wrp-hero-ring.r1 { width:300px;height:300px;top:-100px;right:-80px; }
        .wrp-hero-ring.r2 { width:180px;height:180px;top:-50px;right:-30px;border-color:rgba(205,237,163,0.08); }
        .wrp-hero-dots { position:absolute;right:8%;top:50%;transform:translateY(-50%);width:160px;height:140px;background-image:radial-gradient(circle,rgba(177,209,138,0.35) 1.5px,transparent 1.5px);background-size:20px 20px;opacity:0.45;pointer-events:none; }
        .wrp-hero-inner { position:relative;z-index:1;max-width:900px;margin:0 auto;width:100%;display:flex;align-items:center;gap:2rem;flex-wrap:wrap;justify-content:space-between; }
        .wrp-hero-text { flex:1;min-width:220px;display:flex;flex-direction:column; }
        .wrp-hero-eyebrow { display:inline-flex;align-items:center;gap:7px;background:rgba(205,237,163,0.12);border:1px solid rgba(205,237,163,0.22);border-radius:100px;padding:4px 12px 4px 9px;margin-bottom:1rem;width:fit-content; }
        .wrp-hero-eyebrow span { width:6px;height:6px;background:var(--inverse-primary);border-radius:50%;flex-shrink:0;animation:wrpPulse 2.5s ease-in-out infinite; }
        @keyframes wrpPulse{0%,100%{opacity:1}50%{opacity:0.35}}
        .wrp-hero-eyebrow p { font-size:11px;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;color:var(--inverse-primary);margin:0; }
        .wrp-hero-title { font-family:'Playfair Display',serif;font-size:clamp(1.6rem,3vw,2.25rem);font-weight:400;color:var(--primary-container);line-height:1.2;margin:0 0 0.6rem;letter-spacing:-0.3px; }
        .wrp-hero-title em { font-style:italic;color:var(--inverse-primary); }
        .wrp-hero-sub { font-size:14px;color:rgba(205,237,163,0.7);font-weight:300;margin:0;line-height:1.7;max-width:360px; }
        .wrp-hero-chips { display:flex;flex-direction:column;gap:8px;flex-shrink:0; }
        .wrp-hero-chip { display:flex;align-items:center;gap:9px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,0.07);border:1px solid rgba(205,237,163,0.15);min-width:160px; }
        .wrp-hero-chip-icon { width:28px;height:28px;flex-shrink:0;background:rgba(205,237,163,0.1);border-radius:8px;display:grid;place-items:center;color:var(--inverse-primary); }
        .wrp-hero-chip-icon svg { width:14px;height:14px; }
        .wrp-hero-chip-label { font-size:13px;font-weight:500;color:rgba(205,237,163,0.85);line-height:1.3; }
        .wrp-hero-chip-sub { font-size:11px;color:rgba(205,237,163,0.45);margin-top:1px; }
        @media(max-width:640px){ .wrp-hero-chips{display:none;} }
      `}</style>

      <div className="wrp-root">
        {/* ── Hero ── */}
        <div className="wrp-hero">
          <div className="wrp-hero-ring r1" />
          <div className="wrp-hero-ring r2" />
          <div className="wrp-hero-dots" />

          <div className="wrp-hero-inner">
            <div className="wrp-hero-text">
              <div className="wrp-hero-eyebrow">
                <span />
                <p>Weekly Insights</p>
              </div>
              <h1 className="wrp-hero-title">
                Your emotional
                <br />
                <em>weekly report</em>
              </h1>
              <p className="wrp-hero-sub">
                Your weekly emotional patterns, coping usage &amp; key insights
              </p>
            </div>

            <div className="wrp-hero-chips">
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  ),
                  label: "Full summary",
                  sub: "Patterns & key moments",
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
                  label: "Trend analysis",
                  sub: "Mood & energy over time",
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
                      <path d="M12 2a5 5 0 0 1 5 5c0 3-2 5-5 5s-5-2-5-5a5 5 0 0 1 5-5z" />
                      <path d="M2 21c0-4 4-7 10-7s10 3 10 7" />
                    </svg>
                  ),
                  label: "AI narrative",
                  sub: "Personalised insights",
                },
              ].map(({ icon, label, sub }) => (
                <div className="wrp-hero-chip" key={label}>
                  <div className="wrp-hero-chip-icon">{icon}</div>
                  <div>
                    <div className="wrp-hero-chip-label">{label}</div>
                    <div className="wrp-hero-chip-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Page body ── */}
        <div style={styles.page}>
          {/* ── Empty State ── */}
          {!report && (
            <div style={styles.emptyCard}>
              <div style={styles.emptyIconWrap}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <p style={styles.emptyTitle}>No report yet</p>
              <p style={styles.emptyDesc}>
                Generate your first weekly emotional report to see insights.
              </p>
              <button onClick={handleGenerate} style={styles.primaryButton}>
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Generate Report
              </button>
            </div>
          )}

          {/* ── Report Content ── */}
          {report && (
            <>
              <div style={styles.actionRow}>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  style={{
                    ...styles.primaryButton,
                    ...(generating ? styles.primaryButtonDisabled : {}),
                  }}
                >
                  {generating ? (
                    <>
                      <div style={styles.buttonSpinner} />
                      Generating...
                    </>
                  ) : (
                    <>
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
                      Generate New Report
                    </>
                  )}
                </button>
              </div>

              <ReportSummary summary={report.summary} />
              <ReportTrend trend={report.trend} />
              <ReportUsage usage={report.copingUsage} />
              <ReportTriggers triggers={report.triggers} />
              <ReportHighlights highlights={report.highlights} />
              <ReportNarrative text={report.aiReportText} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

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

  /* Empty State */
  emptyCard: {
    background: "var(--md-surface-container-lowest)",
    borderRadius: "var(--md-shape-lg)",
    boxShadow: "var(--md-elevation-1)",
    padding: "48px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    textAlign: "center",
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: "var(--md-shape-xl)",
    background: "var(--md-surface-container)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--md-outline)",
    marginBottom: 8,
  },
  emptyTitle: {
    font: "var(--md-headline-medium)",
    color: "var(--md-on-surface)",
  },
  emptyDesc: {
    font: "var(--md-body-large)",
    color: "var(--md-on-surface-variant)",
    maxWidth: 360,
  },

  /* Action Row */
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
  },

  /* Primary Button */
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    font: "var(--md-label-large)",
    color: "var(--md-on-primary)",
    background: "var(--md-primary)",
    border: "none",
    borderRadius: "var(--md-shape-full)",
    padding: "10px 24px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "var(--md-elevation-1)",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  buttonSpinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "var(--md-on-primary)",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};
