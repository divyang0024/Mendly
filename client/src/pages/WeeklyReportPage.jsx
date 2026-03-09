import { useEffect, useState, useCallback } from "react";
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

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const getCountdown = (createdAt) => {
  if (!createdAt) return null;
  const diff = new Date(createdAt).getTime() + ONE_WEEK_MS - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    ms: diff,
  };
};

export default function WeeklyReportPage() {
  const [report, setReport] = useState(null);
  const [noData, setNoData] = useState(false); // ← new: backend said not enough data
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const canGenerate = (reportData) => {
    if (!reportData?.createdAt) return true;
    return Date.now() - new Date(reportData.createdAt).getTime() >= ONE_WEEK_MS;
  };

  const fetchAndMaybeGenerate = useCallback(async (isAutoRefresh = false) => {
    setLoading(true);
    try {
      const res = await getLatestWeeklyReport();
      const existing = res.data;

      if (!existing || canGenerate(existing)) {
        setGenerating(true);
        const genRes = await generateWeeklyReport();
        setGenerating(false);

        // ✅ Backend returned success: false → not enough data yet
        if (genRes?.data?.success === false) {
          setNoData(true);
          setReport(null);
          return;
        }

        setNoData(false);
        const fresh = await getLatestWeeklyReport();
        setReport(fresh.data);
        if (isAutoRefresh) showToast("Weekly report refreshed!", "success");
      } else {
        setNoData(false);
        setReport(existing);
      }
    } catch (err) {
      showToast("Failed to load your report. Please try again.");
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    fetchAndMaybeGenerate(false);
  }, [fetchAndMaybeGenerate]);

  useEffect(() => {
    if (!report?.createdAt) return;
    const tick = () => setCountdown(getCountdown(report.createdAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [report?.createdAt]);

  useEffect(() => {
    if (countdown !== null && countdown.ms <= 0) {
      fetchAndMaybeGenerate(true);
    }
  }, [countdown, fetchAndMaybeGenerate]);

  // ── Loading / generating ──
  // if (loading || generating) {
  //   return (
  //     <>
  //       <style>{baseStyles}</style>
  //       <div className="wrp-loading">
  //         <div className="wrp-spinner" />
  //         <p className="wrp-loading-text">
  //           {generating
  //             ? "Generating your weekly report…"
  //             : "Loading your emotional report…"}
  //         </p>
  //       </div>
  //     </>
  //   );
  // }

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
          {/* ── No data empty state ── */}
          {noData && (
            <div className="wrp-empty">
              <div className="wrp-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a5 5 0 0 1 5 5c0 3-2 5-5 5s-5-2-5-5a5 5 0 0 1 5-5z" />
                  <path d="M2 21c0-4 4-7 10-7s10 3 10 7" />
                  <path d="M8 14.5c1 .3 2.6.5 4 .5" />
                </svg>
              </div>
              <h2 className="wrp-empty-title">No report yet</h2>
              <p className="wrp-empty-sub">
                Your weekly report will be ready once you've had a few sessions
                with Mendly. Come back after chatting a bit more — your insights
                are on their way.
              </p>
              <div className="wrp-empty-steps">
                {[
                  { n: "1", text: "Have a conversation with Mendly" },
                  { n: "2", text: "Use a coping tool or two" },
                  { n: "3", text: "Your report generates automatically" },
                ].map(({ n, text }) => (
                  <div className="wrp-empty-step" key={n}>
                    <div className="wrp-empty-step-num">{n}</div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <a href="/" className="wrp-empty-cta">
                Start a session
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
              </a>
            </div>
          )}

          {/* Countdown bar */}
          {report && countdown && (
            <div className="wrp-refresh-bar">
              <div className="wrp-refresh-bar-left">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Next auto-refresh in
              </div>
              <div className="wrp-countdown">
                {[
                  { val: countdown.days, label: "d" },
                  { val: countdown.hours, label: "h" },
                  { val: countdown.minutes, label: "m" },
                  { val: countdown.seconds, label: "s" },
                ].map(({ val, label }) => (
                  <div className="wrp-cd-unit" key={label}>
                    <span className="wrp-cd-val">
                      {String(val).padStart(2, "0")}
                    </span>
                    <span className="wrp-cd-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report && (
            <>
              {/* <ReportSummary summary={report.summary} />
              <ReportTrend trend={report.trend} />
              <ReportUsage usage={report.copingUsage} />
              <ReportTriggers triggers={report.triggers} />
              <ReportHighlights highlights={report.highlights} /> */}
              <ReportNarrative text={report.aiReportText} />
            </>
          )}
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div className={`wrp-toast wrp-toast-${toast.type}`}>
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
              {toast.type === "error" ? (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              ) : (
                <polyline points="20 6 9 17 4 12" />
              )}
            </svg>
            {toast.message}
          </div>
        )}
      </div>
    </>
  );
}

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --primary: #4C662B; --primary-container: #CDEDA3; --on-primary: #FFFFFF;
    --on-primary-container: #354E16; --secondary: #586249; --secondary-container: #DCE7C8;
    --on-secondary: #FFFFFF; --on-secondary-container: #404A33; --tertiary: #386663;
    --tertiary-container: #BCECE7; --on-tertiary: #FFFFFF; --on-tertiary-container: #1F4E4B;
    --background: #F9FAEF; --on-background: #1A1C16; --on-surface: #1A1C16;
    --on-surface-variant: #44483D; --outline: #75796C; --outline-variant: #C5C8BA;
    --surface-container-low: #F3F4E9; --surface-container: #EEEFE3;
    --surface-container-high: #E8E9DE; --surface-container-highest: #E2E3D8;
    --inverse-primary: #B1D18A;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .wrp-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; gap: 16px; font-family: 'DM Sans', sans-serif; background: var(--background);
  }
  .wrp-spinner {
    width: 36px; height: 36px; border: 3px solid var(--outline-variant);
    border-top-color: var(--primary); border-radius: 50%; animation: wrpSpin 0.8s linear infinite;
  }
  @keyframes wrpSpin { to { transform: rotate(360deg); } }
  .wrp-loading-text { font-size: 14px; color: var(--outline); font-weight: 300; }

  .wrp-root {
    min-height: 100vh; background: var(--background);
    font-family: 'DM Sans', sans-serif; color: var(--on-background); overflow-x: hidden;
  }

  .wrp-topnav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(249,250,239,0.88); backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--outline-variant);
    display: flex; align-items: center; gap: 12px;
    padding: 0 clamp(1.25rem, 4vw, 2.5rem); height: 58px;
  }
  .wrp-nav-back {
    display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--on-surface-variant); padding: 6px 10px 6px 6px; border-radius: 8px;
    transition: background 0.2s, color 0.2s; text-decoration: none;
  }
  .wrp-nav-back:hover { background: var(--surface-container); color: var(--primary); }
  .wrp-nav-back svg { width: 15px; height: 15px; }
  .wrp-nav-divider { width: 1px; height: 18px; background: var(--outline-variant); flex-shrink: 0; }
  .wrp-nav-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .wrp-nav-logo-icon { width: 28px; height: 28px; background: var(--primary); border-radius: 8px; display: grid; place-items: center; }
  .wrp-nav-logo-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--primary); }
  .wrp-nav-breadcrumb { font-size: 13px; color: var(--outline); }

  .wrp-hero {
    position: relative; overflow: hidden; background: var(--primary);
    padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
    min-height: 210px; display: flex; flex-direction: column; justify-content: center;
  }
  .wrp-hero::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 55% 80% at 80% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
                radial-gradient(ellipse 35% 50% at 10% 80%, rgba(177,209,138,0.2) 0%, transparent 55%);
  }
  .wrp-hero-ring { position: absolute; border-radius: 50%; pointer-events: none; border: 1px solid rgba(205,237,163,0.12); }
  .wrp-hero-ring.r1 { width: 300px; height: 300px; top: -100px; right: -80px; }
  .wrp-hero-ring.r2 { width: 180px; height: 180px; top: -50px; right: -30px; border-color: rgba(205,237,163,0.07); }
  .wrp-hero-dots {
    position: absolute; right: 8%; top: 50%; transform: translateY(-50%);
    width: 160px; height: 140px;
    background-image: radial-gradient(circle, rgba(177,209,138,0.35) 1.5px, transparent 1.5px);
    background-size: 20px 20px; opacity: 0.4; pointer-events: none;
  }
  .wrp-hero-inner {
    position: relative; z-index: 1; max-width: 960px; margin: 0 auto; width: 100%;
    display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; justify-content: space-between;
  }
  .wrp-hero-text { flex: 1; min-width: 220px; display: flex; flex-direction: column; }
  .wrp-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(205,237,163,0.12); border: 1px solid rgba(205,237,163,0.22);
    border-radius: 100px; padding: 4px 12px 4px 9px; margin-bottom: 1rem; width: fit-content;
  }
  .wrp-eyebrow-dot {
    width: 6px; height: 6px; background: var(--inverse-primary); border-radius: 50%;
    flex-shrink: 0; animation: wrpPulse 2.5s ease-in-out infinite;
  }
  @keyframes wrpPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .wrp-hero-eyebrow p { font-size: 11px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--inverse-primary); }
  .wrp-hero-title {
    font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 400; color: var(--primary-container); line-height: 1.2; letter-spacing: -0.3px; margin-bottom: 0.6rem;
  }
  .wrp-hero-title em { font-style: italic; color: var(--inverse-primary); }
  .wrp-hero-sub { font-size: 14px; color: rgba(205,237,163,0.7); font-weight: 300; line-height: 1.7; max-width: 360px; }
  .wrp-hero-chips { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
  .wrp-hero-chip {
    display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(205,237,163,0.15); min-width: 165px;
  }
  .wrp-chip-icon { width: 28px; height: 28px; flex-shrink: 0; background: rgba(205,237,163,0.1); border-radius: 8px; display: grid; place-items: center; color: var(--inverse-primary); }
  .wrp-chip-icon svg { width: 14px; height: 14px; }
  .wrp-chip-label { font-size: 13px; font-weight: 500; color: rgba(205,237,163,0.85); line-height: 1.3; }
  .wrp-chip-sub { font-size: 11px; color: rgba(205,237,163,0.45); margin-top: 1px; }
  @media (max-width: 640px) { .wrp-hero-chips { display: none; } }

  .wrp-page {
    max-width: 960px; margin: 0 auto;
    padding: clamp(16px, 4vw, 36px); display: flex; flex-direction: column; gap: 20px;
  }

  /* ── Empty state ── */
  .wrp-empty {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding: clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 4vw, 3rem);
    background: var(--surface-container-low);
    border: 1.5px dashed var(--outline-variant);
    border-radius: 20px; gap: 0;
    animation: wrpFadeIn 0.5s ease both;
  }
  @keyframes wrpFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .wrp-empty-icon {
    width: 64px; height: 64px; border-radius: 18px;
    background: var(--primary-container); display: grid; place-items: center;
    color: var(--on-primary-container); margin-bottom: 1.5rem;
  }
  .wrp-empty-icon svg { width: 30px; height: 30px; }

  .wrp-empty-title {
    font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 400;
    color: var(--on-background); margin-bottom: 0.6rem;
  }
  .wrp-empty-sub {
    font-size: 14px; color: var(--outline); line-height: 1.75;
    max-width: 380px; margin-bottom: 2rem;
  }

  .wrp-empty-steps {
    display: flex; flex-direction: column; gap: 10px;
    width: 100%; max-width: 340px; margin-bottom: 2rem;
  }
  .wrp-empty-step {
    display: flex; align-items: center; gap: 12px;
    background: var(--surface-container); border: 1px solid var(--outline-variant);
    border-radius: 12px; padding: 11px 16px; text-align: left;
    font-size: 13.5px; color: var(--on-surface-variant);
  }
  .wrp-empty-step-num {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    background: var(--primary); color: var(--on-primary);
    display: grid; place-items: center;
    font-size: 11px; font-weight: 600;
  }

  .wrp-empty-cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; background: var(--primary); color: var(--on-primary);
    border-radius: 12px; font-size: 14px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; text-decoration: none;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .wrp-empty-cta:hover {
    background: var(--on-primary-container);
    box-shadow: 0 4px 20px rgba(76,102,43,0.28);
    transform: translateY(-1px);
  }

  /* ── Refresh countdown bar ── */
  .wrp-refresh-bar {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px; padding: 12px 18px; border-radius: 14px;
    background: var(--surface-container); border: 1.5px solid var(--outline-variant);
  }
  .wrp-refresh-bar-left {
    display: flex; align-items: center; gap: 7px;
    font-size: 12.5px; color: var(--on-surface-variant); font-weight: 400;
  }
  .wrp-refresh-bar-left svg { color: var(--outline); flex-shrink: 0; }
  .wrp-countdown { display: flex; align-items: center; gap: 6px; }
  .wrp-cd-unit {
    display: flex; align-items: baseline; gap: 2px;
    background: var(--surface-container-high); border: 1px solid var(--outline-variant);
    border-radius: 8px; padding: 4px 9px;
  }
  .wrp-cd-val {
    font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 400;
    color: var(--primary); line-height: 1; min-width: 22px; text-align: center;
  }
  .wrp-cd-label { font-size: 10px; font-weight: 500; color: var(--outline); text-transform: uppercase; letter-spacing: 0.05em; }

  /* ── Toast ── */
  .wrp-toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    z-index: 999; display: inline-flex; align-items: center; gap: 10px;
    padding: 12px 20px; border-radius: 100px; font-size: 13.5px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 20px rgba(26,28,22,0.18);
    animation: wrpToastIn 0.3s cubic-bezier(0.34,1.2,0.64,1); white-space: nowrap;
  }
  .wrp-toast-error { background: #FFDAD6; color: #93000A; border: 1.5px solid #BA1A1A40; }
  .wrp-toast-success { background: var(--primary-container); color: var(--on-primary-container); border: 1.5px solid rgba(76,102,43,0.25); }
  @keyframes wrpToastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(12px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
