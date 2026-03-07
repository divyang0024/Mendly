export default function ReportTriggers({ triggers }) {
  return (
    <>
      <style>{`
        .rtr-wrap {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface-container-low);
          border: 1.5px solid var(--outline-variant);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 12px rgba(26,28,22,0.07);
          color: var(--on-surface);
          animation: rtrIn 0.4s ease-out both;
        }
        .rtr-wrap::before {
          content: '';
          position: absolute;
          top: -45px; right: -45px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(161,98,7,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        @keyframes rtrIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .rtr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--outline-variant);
          background: var(--surface-container);
        }
        .rtr-header-left { display: flex; align-items: center; gap: 10px; }
        .rtr-icon {
          width: 30px; height: 30px;
          border-radius: 9px;
          background: var(--tertiary-container);
          color: var(--on-tertiary-container);
          display: grid; place-items: center;
        }
        .rtr-icon svg { width: 14px; height: 14px; }
        .rtr-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--on-surface);
        }
        .rtr-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          background: var(--surface-container-highest);
          border: 1px solid var(--outline-variant);
          font-size: 11px;
          font-weight: 500;
          color: var(--outline);
        }

        .rtr-body {
          padding: 18px 18px 20px;
          position: relative;
          z-index: 1;
        }
        .rtr-sub {
          font-size: 13px;
          color: var(--outline);
          font-weight: 300;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .rtr-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .rtr-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px 6px 10px;
          border-radius: 100px;
          background: var(--surface-container);
          border: 1.5px solid var(--outline-variant);
          font-size: 13px;
          color: var(--on-surface);
          font-weight: 400;
        }
        .rtr-chip-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--tertiary);
          flex-shrink: 0;
        }
        .rtr-chip-keyword { font-weight: 500; text-transform: capitalize; }
        .rtr-chip-count {
          font-size: 11px;
          font-weight: 600;
          color: var(--on-tertiary-container);
          background: var(--tertiary-container);
          border-radius: 100px;
          padding: 1px 8px;
          min-width: 22px;
          text-align: center;
        }

        .rtr-empty {
          padding: 40px 16px;
          text-align: center;
          color: var(--outline);
          font-size: 13px;
          font-weight: 300;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .rtr-empty svg { opacity: 0.4; }
      `}</style>
      <div className="rtr-wrap">
        <div className="rtr-header">
          <div className="rtr-header-left">
            <div className="rtr-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="rtr-title">Frequent Triggers</span>
          </div>
          <div className="rtr-badge">{triggers?.length ?? 0} detected</div>
        </div>

        <div className="rtr-body">
          {!triggers || triggers.length === 0 ? (
            <div className="rtr-empty">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--outline-variant)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              No triggers detected this week.
            </div>
          ) : (
            <>
              <p className="rtr-sub">
                Topics and patterns that frequently surfaced in your
                conversations.
              </p>
              <div className="rtr-chips">
                {triggers.map((t, i) => (
                  <span className="rtr-chip" key={i}>
                    <span className="rtr-chip-dot" />
                    <span className="rtr-chip-keyword">{t.keyword}</span>
                    <span className="rtr-chip-count">{t.count}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
