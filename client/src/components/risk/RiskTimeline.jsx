import { useEffect, useState } from "react";
import { getRiskEvents } from "../../features/risk/risk.api";

export default function RiskTimeline({ refresh }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await getRiskEvents();
      setEvents(res.data);
    };
    fetchEvents();
  }, [refresh]);

  const levelMeta = {
    low: {
      color: "#4C662B",
      bg: "#CDEDA3",
      text: "#354E16",
    },
    moderate: {
      color: "#586249",
      bg: "#DCE7C8",
      text: "#404A33",
    },
    high: {
      color: "#B45000",
      bg: "#FFDBB6",
      text: "#7A2E00",
    },
    crisis: {
      color: "#BA1A1A",
      bg: "#FFDAD6",
      text: "#93000A",
    },
  };

  return (
    <>
      <style>{`
        .rt-wrap{
          font-family:'DM Sans',sans-serif;
          background:var(--surface-container-low);
          border:1.5px solid var(--outline-variant);
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 1px 12px rgba(26,28,22,0.07);
        }

        .rt-header{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:14px 18px;
          border-bottom:1px solid var(--outline-variant);
          background:var(--surface-container);
        }

        .rt-title{
          font-family:'Playfair Display',serif;
          font-size:1rem;
          color:var(--on-surface);
        }

        .rt-count{
          font-size:11px;
          padding:3px 10px;
          border-radius:100px;
          background:var(--surface-container-high);
          border:1px solid var(--outline-variant);
        }

        .rt-body{
          padding:18px;
          display:flex;
          flex-direction:column;
          gap:20px;
          max-height:480px;
          overflow-y:auto;
        }

        .rt-item{
          display:flex;
          gap:14px;
        }

        .rt-rail{
          display:flex;
          flex-direction:column;
          align-items:center;
          width:16px;
        }

        .rt-dot{
          width:12px;
          height:12px;
          border-radius:50%;
          flex-shrink:0;
        }

        .rt-line{
          width:2px;
          flex:1;
          background:var(--outline-variant);
          margin-top:4px;
        }

        .rt-content{
          flex:1;
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .rt-meta{
          display:flex;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
        }

        .rt-chip{
          font-size:10.5px;
          font-weight:600;
          padding:2px 8px;
          border-radius:100px;
          letter-spacing:0.05em;
        }

        .rt-time{
          font-size:11px;
          color:var(--outline);
        }

        .rt-emotion{
          font-size:12px;
          color:var(--on-surface-variant);
        }

        .rt-intervention{
          font-size:11px;
          padding:3px 9px;
          border-radius:100px;
          background:var(--tertiary-container);
          color:var(--on-tertiary-container);
          width:fit-content;
        }

        .rt-text{
          font-size:13px;
          line-height:1.5;
          color:var(--on-surface);
        }

        .rt-empty{
          text-align:center;
          padding:40px 0;
          font-size:13px;
          color:var(--outline);
        }
      `}</style>

      <div className="rt-wrap">
        <div className="rt-header">
          <div className="rt-title">Recent Risk Events</div>
          <div className="rt-count">{events.length}</div>
        </div>

        <div className="rt-body">
          {events.length === 0 && (
            <div className="rt-empty">No risk events yet</div>
          )}

          {events.map((e, i) => {
            const meta = levelMeta[e.level] || levelMeta.low;
            const last = i === events.length - 1;

            return (
              <div key={e._id} className="rt-item">
                <div className="rt-rail">
                  <div
                    className="rt-dot"
                    style={{
                      background: meta.color,
                      boxShadow: `0 0 0 3px ${meta.bg}`,
                    }}
                  />
                  {!last && <div className="rt-line" />}
                </div>

                <div className="rt-content">
                  <div className="rt-meta">
                    <span
                      className="rt-chip"
                      style={{
                        background: meta.bg,
                        color: meta.text,
                      }}
                    >
                      {e.level.toUpperCase()}
                    </span>

                    <span className="rt-time">
                      {new Date(e.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {e.emotion && (
                    <div className="rt-emotion">
                      Emotion: <strong>{e.emotion}</strong>
                    </div>
                  )}

                  {e.intervention && (
                    <div className="rt-intervention">{e.intervention}</div>
                  )}

                  <div className="rt-text">{e.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
