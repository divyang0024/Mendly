import { useEffect, useState } from "react";
import { getReframingHistory } from "../../features/reframing/reframing.api";

export default function ReframingHistory({ refresh }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getReframingHistory().then((res) => setData(res.data));
  }, [refresh]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --primary:#4C662B;--primary-container:#CDEDA3;--on-primary:#FFFFFF;--on-primary-container:#354E16;
          --secondary:#586249;--secondary-container:#DCE7C8;--on-secondary-container:#404A33;
          --tertiary:#386663;--tertiary-container:#BCECE7;--on-tertiary-container:#1F4E4B;
          --on-surface:#1A1C16;--on-surface-variant:#44483D;--outline:#75796C;--outline-variant:#C5C8BA;
          --surface-container-low:#F3F4E9;--surface-container:#EEEFE3;--surface-container-high:#E8E9DE;--surface-container-highest:#E2E3D8;
        }
        .rh-wrap { background:var(--surface-container-low); border:1.5px solid var(--outline-variant); border-radius:20px; overflow:hidden; font-family:'DM Sans',sans-serif; color:var(--on-surface); position:relative; box-shadow:0 1px 12px rgba(26,28,22,0.07); }
        .rh-wrap::before { content:''; position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle,rgba(56,102,99,0.06) 0%,transparent 70%); pointer-events:none; }
        .rh-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--outline-variant); background:var(--surface-container); }
        .rh-header-left { display:flex; align-items:center; gap:10px; }
        .rh-icon { width:30px; height:30px; border-radius:9px; background:var(--tertiary-container); color:var(--on-tertiary-container); display:grid; place-items:center; }
        .rh-icon svg { width:14px; height:14px; }
        .rh-title { font-family:'Playfair Display',serif; font-size:1rem; font-weight:400; color:var(--on-surface); }
        .rh-count-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; background:var(--surface-container-highest); border:1px solid var(--outline-variant); font-size:11px; font-weight:500; color:var(--outline); }
        .rh-list { padding:14px 16px; display:flex; flex-direction:column; gap:10px; }
        .rh-card { padding:14px 16px; border-radius:14px; background:var(--surface-container-low); border:1.5px solid var(--outline-variant); transition:border-color 0.2s,box-shadow 0.2s; }
        .rh-card:hover { border-color:rgba(76,102,43,0.3); box-shadow:0 2px 10px rgba(76,102,43,0.06); }
        .rh-card-row { display:flex; gap:10px; align-items:flex-start; margin-bottom:8px; }
        .rh-card-row:last-child { margin-bottom:0; }
        .rh-card-icon { width:26px; height:26px; border-radius:7px; display:grid; place-items:center; flex-shrink:0; margin-top:1px; }
        .rh-card-icon svg { width:12px; height:12px; }
        .rh-card-label { font-size:10.5px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:2px; opacity:0.7; }
        .rh-card-text { font-size:13.5px; color:var(--on-surface); line-height:1.5; font-weight:400; }
        .rh-card-divider { height:1px; background:var(--outline-variant); opacity:0.5; margin:8px 0; }
        .rh-shift-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; font-size:11.5px; font-weight:500; }
        .rh-empty { padding:28px 16px; text-align:center; color:var(--outline); font-size:13px; font-weight:300; line-height:1.6; }
        @keyframes rhFadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .rh-card { animation:rhFadeUp 0.35s ease-out both; }
      `}</style>

      <div className="rh-wrap">
        <div className="rh-header">
          <div className="rh-header-left">
            <div className="rh-icon">
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
              </svg>
            </div>
            <span className="rh-title">Recent Sessions</span>
          </div>
          {data.length > 0 && (
            <div className="rh-count-chip">{data.length} entries</div>
          )}
        </div>

        {data.length > 0 ? (
          <div className="rh-list">
            {data.map((s, idx) => {
              const shift = s.effectivenessScore ?? 0;
              const improved = shift > 0;
              return (
                <div
                  key={s._id}
                  className="rh-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Automatic thought */}
                  <div className="rh-card-row">
                    <div
                      className="rh-card-icon"
                      style={{
                        background: "var(--surface-container-high)",
                        color: "var(--outline)",
                      }}
                    >
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
                    </div>
                    <div>
                      <div
                        className="rh-card-label"
                        style={{ color: "var(--outline)" }}
                      >
                        Thought
                      </div>
                      <div className="rh-card-text">{s.automaticThought}</div>
                    </div>
                  </div>

                  <div className="rh-card-divider" />

                  {/* Reframed thought */}
                  <div className="rh-card-row">
                    <div
                      className="rh-card-icon"
                      style={{
                        background: "var(--primary-container)",
                        color: "var(--on-primary-container)",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                      </svg>
                    </div>
                    <div>
                      <div
                        className="rh-card-label"
                        style={{ color: "var(--on-primary-container)" }}
                      >
                        Reframe
                      </div>
                      <div className="rh-card-text">{s.reframedThought}</div>
                    </div>
                  </div>

                  <div className="rh-card-divider" />

                  {/* Shift score */}
                  <div
                    className="rh-shift-chip"
                    style={{
                      background: improved
                        ? "var(--primary-container)"
                        : "var(--surface-container-high)",
                      color: improved
                        ? "var(--on-primary-container)"
                        : "var(--outline)",
                    }}
                  >
                    {improved ? (
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
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    ) : (
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
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                    {improved ? `${shift} pt shift` : "No shift"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rh-empty">
            No sessions yet. Complete a reframing exercise to see your history.
          </div>
        )}
      </div>
    </>
  );
}
