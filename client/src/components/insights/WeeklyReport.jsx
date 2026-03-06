import { useEffect, useState } from "react";
import { getWeeklyReport } from "../../features/insights/insights.api";

export default function WeeklyReport() {
  const [report, setReport] = useState(null);

  /* ── Original logic — unchanged ── */
  useEffect(() => {
    getWeeklyReport().then((res) => {
      setReport(res.data.report);
    });
  }, []);
  /* ── End original logic ── */

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root{--primary:#4C662B;--primary-container:#CDEDA3;--on-primary-container:#354E16;--secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;--tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;--on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;--surface-container-low:#F3F4E9;--surface-container:#EEEFE3;--surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;}
        .wr-wrap{font-family:'DM Sans',sans-serif;background:var(--surface-container-low);border:1.5px solid var(--outline-variant);border-radius:20px;overflow:hidden;position:relative;box-shadow:0 1px 12px rgba(26,28,22,0.07);color:var(--on-surface);}
        .wr-wrap::before{content:'';position:absolute;top:-45px;right:-45px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(56,102,99,0.07) 0%,transparent 70%);pointer-events:none;}
        .wr-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--outline-variant);background:var(--surface-container);}
        .wr-header-left{display:flex;align-items:center;gap:10px;}
        .wr-icon{width:30px;height:30px;border-radius:9px;background:var(--tertiary-container);color:var(--on-tertiary-container);display:grid;place-items:center;}
        .wr-icon svg{width:14px;height:14px;}
        .wr-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:400;color:var(--on-surface);}
        .wr-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;background:var(--surface-container-highest);border:1px solid var(--outline-variant);font-size:11px;font-weight:500;color:var(--outline);}
        .wr-body{padding:20px;position:relative;z-index:1;}
        .wr-report{font-size:14px;line-height:1.75;color:var(--on-surface);white-space:pre-line;font-weight:300;}
        .wr-loading{display:flex;align-items:center;gap:10px;color:var(--outline);font-size:13.5px;padding:8px 0;}
        @keyframes wrSpin{to{transform:rotate(360deg)}}
        .wr-spinner{width:15px;height:15px;border:2px solid var(--outline-variant);border-top-color:var(--primary);border-radius:50%;animation:wrSpin 0.8s linear infinite;flex-shrink:0;}
        .wr-highlight{display:inline;background:var(--primary-container);color:var(--on-primary-container);border-radius:4px;padding:1px 5px;font-weight:500;}
      `}</style>
      <div className="wr-wrap">
        <div className="wr-header">
          <div className="wr-header-left">
            <div className="wr-icon">
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
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span className="wr-title">Weekly Emotional Summary</span>
          </div>
          <div className="wr-badge">This week</div>
        </div>
        <div className="wr-body">
          {report === null ? (
            <div className="wr-loading">
              <span className="wr-spinner" />
              Generating your summary…
            </div>
          ) : (
            <p className="wr-report">{report}</p>
          )}
        </div>
      </div>
    </>
  );
}
