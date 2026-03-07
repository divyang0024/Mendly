export default function ReportHighlights({ highlights }) {
  return (
    <>
      <style>{`
        .rh-wrap {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface-container-low);
          border: 1.5px solid var(--outline-variant);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 12px rgba(26,28,22,0.07);
          color: var(--on-surface);
          animation: rhIn 0.4s ease-out both;
        }
        .rh-wrap::before {
          content: '';
          position: absolute;
          top: -45px; right: -45px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(76,102,43,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        @keyframes rhIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .rh-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--outline-variant);
          background: var(--surface-container);
        }
        .rh-header-left { display: flex; align-items: center; gap: 10px; }
        .rh-icon {
          width: 30px; height: 30px;
          border-radius: 9px;
          background: var(--primary-container);
          color: var(--on-primary-container);
          display: grid; place-items: center;
        }
        .rh-icon svg { width: 14px; height: 14px; }
        .rh-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--on-surface);
        }
        .rh-badge {
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

        .rh-body {
          padding: 18px 18px 20px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .rh-sub {
          font-size: 13px;
          color: var(--outline);
          font-weight: 300;
          line-height: 1.5;
          margin: 0 0 6px;
        }

        .rh-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 13px 15px;
          background: var(--surface-container);
          border: 1px solid var(--outline-variant);
          border-radius: 14px;
          transition: border-color 0.2s;
        }
        .rh-item:hover { border-color: var(--primary); }
        .rh-bullet {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--primary-container);
          color: var(--on-primary-container);
          display: grid; place-items: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .rh-bullet svg { width: 11px; height: 11px; }
        .rh-text {
          font-size: 13.5px;
          color: var(--on-surface);
          line-height: 1.6;
          font-weight: 300;
          margin: 0;
        }

        .rh-empty {
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
        .rh-empty svg { opacity: 0.4; }
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="rh-title">Key Insights</span>
          </div>
          <div className="rh-badge">{highlights?.length ?? 0} highlights</div>
        </div>

        <div className="rh-body">
          {!highlights || highlights.length === 0 ? (
            <div className="rh-empty">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              No highlights available yet.
            </div>
          ) : (
            <>
              <p className="rh-sub">
                Key observations from your emotional activity this week.
              </p>
              {highlights.map((h, i) => (
                <div className="rh-item" key={i}>
                  <div className="rh-bullet">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="rh-text">{h}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
