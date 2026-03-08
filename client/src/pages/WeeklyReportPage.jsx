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
      <>
        <style>{baseStyles}</style>
        <div className="wrp-loading">
          <div className="wrp-spinner" />
          <p className="wrp-loading-text">Loading your emotional report…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{baseStyles}</style>

      <div className="wrp-root">
        {/* ── Top nav ── */}
        <header className="wrp-topnav">
          <a href="/" className="wrp-nav-back">
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
          <div className="wrp-nav-divider" />
          <a href="/" className="wrp-nav-logo">
            <div className="wrp-nav-logo-icon">
              <svg viewBox="0 0 24 24" fill="var(--on-primary)">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="wrp-nav-logo-name">Mendly</span>
          </a>
          <span className="wrp-nav-breadcrumb">/ Weekly Report</span>
        </header>

        {/* ── Hero ── */}
        <div className="wrp-hero">
          <div className="wrp-hero-ring r1" />
          <div className="wrp-hero-ring r2" />
          <div className="wrp-hero-dots" />

          <div className="wrp-hero-inner">
            <div className="wrp-hero-text">
              <div className="wrp-hero-eyebrow">
                <span className="wrp-eyebrow-dot" />
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
                  <div className="wrp-chip-icon">{icon}</div>
                  <div>
                    <div className="wrp-chip-label">{label}</div>
                    <div className="wrp-chip-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Page body ── */}
        <div className="wrp-page">
          {/* Empty state */}
          {!report && (
            <div className="wrp-empty-card">
              <div className="wrp-empty-icon">
                <svg
                  width="36"
                  height="36"
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
              <p className="wrp-empty-title">No report yet</p>
              <p className="wrp-empty-desc">
                Generate your first weekly emotional report to see insights.
              </p>
              <button onClick={handleGenerate} className="wrp-btn-primary">
                <svg
                  width="16"
                  height="16"
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

          {/* Report content */}
          {report && (
            <>
              <div className="wrp-action-row">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className={`wrp-btn-primary${generating ? " wrp-btn-disabled" : ""}`}
                >
                  {generating ? (
                    <>
                      <div className="wrp-btn-spinner" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
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

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --primary: #4C662B;
    --primary-container: #CDEDA3;
    --on-primary: #FFFFFF;
    --on-primary-container: #354E16;
    --secondary: #586249;
    --secondary-container: #DCE7C8;
    --on-secondary: #FFFFFF;
    --on-secondary-container: #404A33;
    --tertiary: #386663;
    --tertiary-container: #BCECE7;
    --on-tertiary: #FFFFFF;
    --on-tertiary-container: #1F4E4B;
    --background: #F9FAEF;
    --on-background: #1A1C16;
    --on-surface: #1A1C16;
    --on-surface-variant: #44483D;
    --outline: #75796C;
    --outline-variant: #C5C8BA;
    --surface-container-low: #F3F4E9;
    --surface-container: #EEEFE3;
    --surface-container-high: #E8E9DE;
    --surface-container-highest: #E2E3D8;
    --inverse-primary: #B1D18A;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Loading ── */
  .wrp-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 16px;
    font-family: 'DM Sans', sans-serif;
    background: var(--background);
  }
  .wrp-spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--outline-variant);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: wrpSpin 0.8s linear infinite;
  }
  @keyframes wrpSpin { to { transform: rotate(360deg); } }
  .wrp-loading-text {
    font-size: 14px;
    color: var(--outline);
    font-weight: 300;
  }

  /* ── Root ── */
  .wrp-root {
    min-height: 100vh;
    background: var(--background);
    font-family: 'DM Sans', sans-serif;
    color: var(--on-background);
    overflow-x: hidden;
  }

  /* ── Top nav ── */
  .wrp-topnav {
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
    height: 58px;
  }
  .wrp-nav-back {
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
  .wrp-nav-back:hover { background: var(--surface-container); color: var(--primary); }
  .wrp-nav-back svg { width: 15px; height: 15px; }
  .wrp-nav-divider { width: 1px; height: 18px; background: var(--outline-variant); flex-shrink: 0; }
  .wrp-nav-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .wrp-nav-logo-icon {
    width: 28px; height: 28px;
    background: var(--primary);
    border-radius: 8px;
    display: grid; place-items: center;
  }
  .wrp-nav-logo-name {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary);
  }
  .wrp-nav-breadcrumb {
    font-size: 13px;
    color: var(--outline);
  }

  /* ── Hero ── */
  .wrp-hero {
    position: relative;
    overflow: hidden;
    background: var(--primary);
    padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
    min-height: 210px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .wrp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 55% 80% at 80% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
      radial-gradient(ellipse 35% 50% at 10% 80%, rgba(177,209,138,0.2) 0%, transparent 55%);
  }
  .wrp-hero-ring {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    border: 1px solid rgba(205,237,163,0.12);
  }
  .wrp-hero-ring.r1 { width: 300px; height: 300px; top: -100px; right: -80px; }
  .wrp-hero-ring.r2 { width: 180px; height: 180px; top: -50px; right: -30px; border-color: rgba(205,237,163,0.07); }
  .wrp-hero-dots {
    position: absolute;
    right: 8%; top: 50%;
    transform: translateY(-50%);
    width: 160px; height: 140px;
    background-image: radial-gradient(circle, rgba(177,209,138,0.35) 1.5px, transparent 1.5px);
    background-size: 20px 20px;
    opacity: 0.4;
    pointer-events: none;
  }
  .wrp-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .wrp-hero-text { flex: 1; min-width: 220px; display: flex; flex-direction: column; }
  .wrp-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(205,237,163,0.12);
    border: 1px solid rgba(205,237,163,0.22);
    border-radius: 100px;
    padding: 4px 12px 4px 9px;
    margin-bottom: 1rem;
    width: fit-content;
  }
  .wrp-eyebrow-dot {
    width: 6px; height: 6px;
    background: var(--inverse-primary);
    border-radius: 50%;
    flex-shrink: 0;
    animation: wrpPulse 2.5s ease-in-out infinite;
  }
  @keyframes wrpPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .wrp-hero-eyebrow p {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--inverse-primary);
  }
  .wrp-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 400;
    color: var(--primary-container);
    line-height: 1.2;
    letter-spacing: -0.3px;
    margin-bottom: 0.6rem;
  }
  .wrp-hero-title em { font-style: italic; color: var(--inverse-primary); }
  .wrp-hero-sub {
    font-size: 14px;
    color: rgba(205,237,163,0.7);
    font-weight: 300;
    line-height: 1.7;
    max-width: 360px;
  }
  .wrp-hero-chips { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
  .wrp-hero-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(205,237,163,0.15);
    min-width: 165px;
  }
  .wrp-chip-icon {
    width: 28px; height: 28px;
    flex-shrink: 0;
    background: rgba(205,237,163,0.1);
    border-radius: 8px;
    display: grid; place-items: center;
    color: var(--inverse-primary);
  }
  .wrp-chip-icon svg { width: 14px; height: 14px; }
  .wrp-chip-label { font-size: 13px; font-weight: 500; color: rgba(205,237,163,0.85); line-height: 1.3; }
  .wrp-chip-sub { font-size: 11px; color: rgba(205,237,163,0.45); margin-top: 1px; }
  @media (max-width: 640px) {
    .wrp-hero-chips { display: none; }
  }

  /* ── Page body ── */
  .wrp-page {
    max-width: 960px;
    margin: 0 auto;
    padding: clamp(16px, 4vw, 36px);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── Action row ── */
  .wrp-action-row {
    display: flex;
    justify-content: flex-end;
  }

  /* ── Primary button ── */
  .wrp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--on-primary);
    background: var(--primary);
    border: none;
    border-radius: 100px;
    padding: 10px 22px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 2px 8px rgba(76,102,43,0.25);
  }
  .wrp-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .wrp-btn-primary:active { transform: translateY(0); }
  .wrp-btn-disabled { opacity: 0.6 !important; cursor: not-allowed !important; transform: none !important; }
  .wrp-btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: wrpSpin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Empty state card ── */
  .wrp-empty-card {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface-container-low);
    border: 1.5px solid var(--outline-variant);
    border-radius: 20px;
    padding: 52px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    box-shadow: 0 1px 12px rgba(26,28,22,0.07);
  }
  .wrp-empty-icon {
    width: 72px; height: 72px;
    border-radius: 20px;
    background: var(--surface-container-high);
    display: grid; place-items: center;
    color: var(--outline);
    margin-bottom: 4px;
  }
  .wrp-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--on-surface);
  }
  .wrp-empty-desc {
    font-size: 14px;
    color: var(--outline);
    font-weight: 300;
    max-width: 320px;
    line-height: 1.6;
  }
`;
