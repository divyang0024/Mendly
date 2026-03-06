import EmotionTrendGraph from "../components/insights/EmotionTrendGraph";
import EmotionPieChart from "../components/insights/EmotionPieChart";
import WeeklyReport from "../components/insights/WeeklyReport";
import TrendCard from "../components/insights/TrendCard";
import VolatilityCard from "../components/insights/VolatilityCard";
import ProfileCard from "../components/insights/ProfileCard";
import CheckinHeatmap from "../components/checkin/CheckinHeatmap";
import { Link } from "react-router-dom";

const Tag = ({ c = "primary", children }) => (
  <span className={`i-tag i-tag-${c}`}>{children}</span>
);

const Card = ({ tag, tagColor = "primary", children, className = "" }) => (
  <div className={`i-card ${className}`}>
    {tag && <Tag c={tagColor}>{tag}</Tag>}
    <div className="i-card-body">{children}</div>
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
          padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem);
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

        /* ── TAGS ── */
        .i-tag {
          display: inline-flex; align-items: center;
          padding: 2px 9px; border-radius: 100px;
          font-size: 10px; font-weight: 600;
          letter-spacing: .05em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .i-tag-primary   { background: var(--pc); color: var(--opc); }
        .i-tag-secondary { background: var(--sc); color: var(--osc); }
        .i-tag-tertiary  { background: var(--tc); color: var(--otc); }

        /* ── CARD ── */
        .i-card {
          background: var(--sl);
          border: 1.5px solid var(--olv);
          border-radius: 16px;
          padding: 14px;
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

        /* ── DASHBOARD GRID ── */
        /*
          Priority order (least scroll, most value first):
          ROW A — Quick stats: Profile | TrendCard | VolatilityCard   (3 equal cols)
          ROW B — Main chart:  EmotionTrendGraph                       (full width)
          ROW C — Analysis:    EmotionPieChart (5) | WeeklyReport (7)
          ROW D — History:     CheckinHeatmap                          (full width)
        */
        .i-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: auto;
          gap: 12px;
          padding: 16px 20px 48px;
          max-width: 1080px;
          margin: 0 auto;
        }

        /* Row A */
        .i-profile    { grid-column: span 4; }
        .i-trendcard  { grid-column: span 4; }
        .i-volatility { grid-column: span 4; }

        /* Row B */
        .i-trendgraph { grid-column: span 12; }

        /* Row C */
        .i-pie        { grid-column: span 5; }
        .i-weekly     { grid-column: span 7; }

        /* Row D */
        .i-heatmap    { grid-column: span 12; }

        /* ── RESPONSIVE ── */
        /* Tablet */
        @media (max-width: 860px) {
          .i-grid { grid-template-columns: repeat(6, 1fr); gap: 10px; }
          .i-profile    { grid-column: span 6; }
          .i-trendcard  { grid-column: span 3; }
          .i-volatility { grid-column: span 3; }
          .i-trendgraph { grid-column: span 6; }
          .i-pie        { grid-column: span 6; }
          .i-weekly     { grid-column: span 6; }
          .i-heatmap    { grid-column: span 6; }
          .i-heatmap-pad{ display:none; }
        }

        /* Mobile */
        @media (max-width: 520px) {
          .i-grid { grid-template-columns: 1fr; gap: 10px; padding: 12px 12px 40px; }
          .i-profile, .i-trendcard, .i-volatility,
          .i-trendgraph, .i-pie, .i-weekly, .i-heatmap { grid-column: span 1; }
          .i-heatmap-pad { display: none; }
          .i-header { padding: 12px 14px; }
          .i-header-title { font-size: 1.1rem; }
          .i-nav { padding: 0 14px; }
        }

        /* Fade-up entrance */
        @keyframes iFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .i-profile    { animation: iFadeUp .35s .00s both; }
        .i-trendcard  { animation: iFadeUp .35s .05s both; }
        .i-volatility { animation: iFadeUp .35s .10s both; }
        .i-trendgraph { animation: iFadeUp .35s .15s both; }
        .i-pie        { animation: iFadeUp .35s .20s both; }
        .i-weekly     { animation: iFadeUp .35s .25s both; }
        .i-heatmap    { animation: iFadeUp .35s .30s both; }
      `}</style>

      <div className="i-root">
        {/* Nav */}
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
            <span className="i-brand">Verdant</span>
          </div>
          <div className="i-bc">
            <span>Home</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <b>Insights</b>
          </div>
        </nav>

        {/* Hero */}
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

        {/* Dashboard */}
        <div className="i-grid">
          {/* ── Row A: Quick-glance stats ── */}
          <Card tag="Profile" tagColor="primary" className="i-profile">
            <ProfileCard />
          </Card>

          <Card tag="Trend" tagColor="secondary" className="i-trendcard">
            <TrendCard />
          </Card>

          <Card tag="Stability" tagColor="tertiary" className="i-volatility">
            <VolatilityCard />
          </Card>

          {/* ── Row B: Main chart ── */}
          <Card
            tag="Emotion Journey"
            tagColor="tertiary"
            className="i-trendgraph"
          >
            <EmotionTrendGraph />
          </Card>

          {/* ── Row C: Analysis pair ── */}
          <Card tag="Breakdown" tagColor="secondary" className="i-pie">
            <EmotionPieChart />
          </Card>

          <Card tag="Weekly Summary" tagColor="tertiary" className="i-weekly">
            <WeeklyReport />
          </Card>

          {/* ── Row D: Heatmap (7 cols) ── */}
          <Card tag="Check-in Heatmap" tagColor="primary" className="i-heatmap">
            <CheckinHeatmap />
          </Card>
        </div>
      </div>
    </>
  );
}
