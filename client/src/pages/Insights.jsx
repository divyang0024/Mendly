import EmotionTrendGraph from "../components/insights/EmotionTrendGraph";
import EmotionPieChart from "../components/insights/EmotionPieChart";
import WeeklyReport from "../components/insights/WeeklyReport";
import TrendCard from "../components/insights/TrendCard";
import VolatilityCard from "../components/insights/VolatilityCard";
import ProfileCard from "../components/insights/ProfileCard";
import CheckinHeatmap from "../components/checkin/CheckinHeatmap";
import { Link } from "react-router-dom";

// Lightweight section label — replaces the messy per-card Tag approach
const SectionLabel = ({ emoji, children }) => (
  <div className="i-section-label">
    {emoji && <span>{emoji}</span>}
    <span>{children}</span>
  </div>
);

export default function Insights() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --p:#4C662B; --pc:#CDEDA3; --opc:#354E16;
          --s:#586249; --sc:#DCE7C8; --osc:#404A33;
          --t:#386663; --tc:#BCECE7; --otc:#1F4E4B;
          --bg:#F9FAEF; --on:#1A1C16; --onv:#44483D;
          --ol:#75796C; --olv:#C5C8BA;
          --sl:#F3F4E9; --sm:#EEEFE3; --sh:#E8E9DE; --sx:#E2E3D8;
          --inv:#B1D18A;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .i-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--on);
          margin-top: -1.5rem;
          padding-top: 1.5rem;
          width: 100%;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .i-nav {
          position: sticky; top: 0; z-index: 60;
          height: 52px;
          background: rgba(249,250,239,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--olv);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px;
        }
        .i-nav-l { display: flex; align-items: center; gap: 9px; }
        .i-back {
          width: 30px; height: 30px; border-radius: 8px;
          background: var(--sm); border: 1px solid var(--olv);
          display: grid; place-items: center;
          color: var(--onv); text-decoration: none;
          transition: all .15s;
        }
        .i-back:hover { background: var(--sh); }
        .i-brand { font-family: 'Playfair Display', serif; font-size: .95rem; color: var(--p); }
        .i-bc { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--ol); }
        .i-bc b { color: var(--onv); font-weight: 500; }

        /* ── HERO ── */
        .i-hero {
          position:relative; overflow:hidden; background:var(--p);
          padding: clamp(2rem,4vw,3rem) clamp(1.25rem,4vw,2.5rem);
          min-height: 220px; display:flex; flex-direction:column; justify-content:center;
        }
        .i-hero::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 55% 80% at 80% 50%, rgba(56,102,99,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 35% 50% at 10% 80%, rgba(177,209,138,0.2) 0%, transparent 55%);
        }
        .i-hero-ring { position:absolute;border-radius:50%;pointer-events:none;border:1px solid rgba(205,237,163,0.12); }
        .i-hero-ring.r1 { width:300px;height:300px;top:-100px;right:-80px; }
        .i-hero-ring.r2 { width:180px;height:180px;top:-50px;right:-30px;border-color:rgba(205,237,163,0.08); }
        .i-hero-dots{position:absolute;right:8%;top:50%;transform:translateY(-50%);width:160px;height:140px;background-image:radial-gradient(circle,rgba(177,209,138,0.35) 1.5px,transparent 1.5px);background-size:20px 20px;opacity:0.45;pointer-events:none;}
        .i-hero-inner{position:relative;z-index:1;max-width:900px;margin:0 auto;width:100%;display:flex;align-items:center;gap:2rem;flex-wrap:wrap;justify-content:space-between;}
        .i-hero-text{flex:1;min-width:220px;display:flex;flex-direction:column;}
        .i-hero-eyebrow{display:inline-flex;align-items:center;gap:7px;background:rgba(205,237,163,0.12);border:1px solid rgba(205,237,163,0.22);border-radius:100px;padding:4px 12px 4px 9px;margin-bottom:1rem;width:fit-content;}
        .i-hero-eyebrow span{width:6px;height:6px;background:var(--inv);border-radius:50%;flex-shrink:0;animation:iPulse 2.5s ease-in-out infinite;}
        @keyframes iPulse{0%,100%{opacity:1}50%{opacity:0.35}}
        .i-hero-eyebrow p{font-size:11px;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;color:var(--inv);margin:0;}
        .i-hero-title{font-family:'Playfair Display',serif;font-size:clamp(1.55rem,3vw,2.25rem);font-weight:400;color:var(--pc);line-height:1.2;margin:0 0 0.6rem;letter-spacing:-0.3px;}
        .i-hero-title em{font-style:italic;color:var(--inv);}
        .i-hero-sub{font-size:14px;color:rgba(205,237,163,0.7);font-weight:300;margin:0;line-height:1.7;max-width:360px;}
        .i-hero-chips{display:flex;flex-direction:column;gap:8px;flex-shrink:0;}
        .i-hero-chip{display:flex;align-items:center;gap:9px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,0.07);border:1px solid rgba(205,237,163,0.15);min-width:160px;}
        .i-hero-chip-icon{width:28px;height:28px;flex-shrink:0;background:rgba(205,237,163,0.1);border-radius:8px;display:grid;place-items:center;color:var(--inv);}
        .i-hero-chip-icon svg{width:14px;height:14px;}
        .i-hero-chip-label{font-size:13px;font-weight:500;color:rgba(205,237,163,0.85);line-height:1.3;}
        .i-hero-chip-sub{font-size:11px;color:rgba(205,237,163,0.45);margin-top:1px;}
        @media(max-width:640px){.i-hero-chips{display:none;}}
        @media(max-width:520px){.i-hero-title{font-size:1.55rem;}}

        /* ── SECTION LABEL ── */
        .i-section-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600;
          letter-spacing: .07em; text-transform: uppercase;
          color: var(--ol);
          margin-bottom: 10px;
        }

        /* ── CARD ── */
        .i-card {
          background: var(--sl);
          border: 1.5px solid var(--olv);
          border-radius: 16px;
          padding: 16px;
          position: relative; overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
          min-width: 0;
        }
        .i-card:hover {
          border-color: rgba(76,102,43,.22);
          box-shadow: 0 3px 16px rgba(26,28,22,.06);
        }
        .i-card::after {
          content: ''; position: absolute;
          top: -40px; right: -40px;
          width: 110px; height: 110px; border-radius: 50%;
          background: radial-gradient(circle, rgba(76,102,43,.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .i-card-body { position: relative; z-index: 1; }

        /* ── HEATMAP CARD — no extra padding, the component owns its own chrome ── */
        .i-card-flush {
          border: 1.5px solid var(--olv);
          border-radius: 16px;
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
          min-width: 0;
        }
        .i-card-flush:hover {
          border-color: rgba(76,102,43,.22);
          box-shadow: 0 3px 16px rgba(26,28,22,.06);
        }

        /* ══════════════════════════════════════════
           LAYOUT — Three clear sections

           SECTION 1  "At a Glance"
             3 equal stat cards

           SECTION 2  "Your Emotions"
             TrendGraph (7/12)  |  PieChart (5/12)

           SECTION 3  "Activity"
             Heatmap full-width (no double-wrap)
             WeeklyReport full-width below
        ══════════════════════════════════════════ */
        .i-content {
          max-width: 1080px;
          margin: 0 auto;
          padding: 24px 20px 56px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── Section shell ── */
        .i-section { display: flex; flex-direction: column; }

        /* ── Row helpers ── */
        .i-row {
          display: grid;
          gap: 12px;
        }

        /* Section 1 — 3 equal columns */
        .i-row-thirds {
          grid-template-columns: repeat(3, 1fr);
        }

        /* Section 2 — 7/12 + 5/12 */
        .i-row-charts {
          grid-template-columns: 7fr 5fr;
          align-items: stretch;
        }

        /* Section 3 — full width items stacked */
        .i-row-full {
          grid-template-columns: 1fr;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .i-row-thirds { grid-template-columns: 1fr 1fr; }
          .i-row-charts  { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .i-content { padding: 16px 12px 40px; gap: 24px; }
          .i-row-thirds { grid-template-columns: 1fr; }
          .i-nav { padding: 0 14px; }
        }

        /* Staggered fade-up entrance */
        @keyframes iFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .i-anim-1 { animation: iFadeUp .35s .05s both; }
        .i-anim-2 { animation: iFadeUp .35s .10s both; }
        .i-anim-3 { animation: iFadeUp .35s .15s both; }
        .i-anim-4 { animation: iFadeUp .35s .20s both; }
        .i-anim-5 { animation: iFadeUp .35s .25s both; }
        .i-anim-6 { animation: iFadeUp .35s .30s both; }
        .i-anim-7 { animation: iFadeUp .35s .35s both; }
      `}</style>

      <div className="i-root">
        {/* ── Nav ── */}
        <nav className="i-nav">
          <div className="i-nav-l">
            <Link to="/" className="i-back">
              <svg
                width="13"
                height="13"
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
            <span className="i-brand">Mendly</span>
          </div>
          <div className="i-bc">
            <span>Home</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <b>Insights</b>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="i-hero">
          <div className="i-hero-ring r1" />
          <div className="i-hero-ring r2" />
          <div className="i-hero-dots" />
          <div className="i-hero-inner">
            <div className="i-hero-text">
              <div className="i-hero-eyebrow">
                <span />
                <p>Emotional Insights</p>
              </div>
              <h1 className="i-hero-title">
                Understand your
                <br />
                <em>inner landscape</em>
              </h1>
              <p className="i-hero-sub">
                Patterns, trends and clarity drawn from your emotional history
              </p>
            </div>
            <div className="i-hero-chips">
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
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  ),
                  label: "7 insights",
                  sub: "Trends · Patterns · Profile",
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
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  ),
                  label: "90-day view",
                  sub: "Full history at a glance",
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
                  label: "AI summary",
                  sub: "Weekly personalised report",
                },
              ].map(({ icon, label, sub }) => (
                <div className="i-hero-chip" key={label}>
                  <div className="i-hero-chip-icon">{icon}</div>
                  <div>
                    <div className="i-hero-chip-label">{label}</div>
                    <div className="i-hero-chip-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Dashboard ── */}
        <div className="i-content">
          {/* ─── SECTION 1: At a Glance ─── */}
          <div className="i-section i-anim-1">
            <SectionLabel emoji="✦">At a Glance</SectionLabel>
            <div className="i-row i-row-thirds">
              <div className="i-card i-anim-1">
                <div className="i-card-body">
                  <ProfileCard />
                </div>
              </div>
              <div className="i-card i-anim-2">
                <div className="i-card-body">
                  <TrendCard />
                </div>
              </div>
              <div className="i-card i-anim-3">
                <div className="i-card-body">
                  <VolatilityCard />
                </div>
              </div>
            </div>
          </div>

          {/* ─── SECTION 2: Your Emotions ─── */}
          <div className="i-section i-anim-4">
            <SectionLabel emoji="✦">Your Emotions</SectionLabel>
            <div className="i-row i-row-charts">
              <div className="i-card">
                <div className="i-card-body">
                  <EmotionTrendGraph />
                </div>
              </div>
              <div className="i-card">
                <div className="i-card-body">
                  <EmotionPieChart />
                </div>
              </div>
            </div>
          </div>

          {/* ─── SECTION 3: Activity ─── */}
          <div className="i-section i-anim-5">
            <SectionLabel emoji="✦">Activity</SectionLabel>
            <div className="i-row i-row-full" style={{ gap: 12 }}>
              {/*
                CheckinHeatmap already ships with its own header, body and footer —
                wrap it in i-card-flush (border + radius only, zero padding)
                so it looks integrated without double-chrome.
              */}
              <div className="i-card-flush i-anim-6">
                <CheckinHeatmap />
              </div>
              <div className="i-card i-anim-7">
                <div className="i-card-body">
                  <WeeklyReport />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
