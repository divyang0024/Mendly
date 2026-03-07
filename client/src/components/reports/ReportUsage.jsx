export default function ReportUsage({ usage }) {
  const entries = Object.entries(usage || {});
  const maxCount = Math.max(...entries.map(([, c]) => c), 1);

  return (
    <>
      <style>{`
        .ru-wrap {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface-container-low);
          border: 1.5px solid var(--outline-variant);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 12px rgba(26,28,22,0.07);
          color: var(--on-surface);
          animation: ruIn 0.4s ease-out both;
        }
        .ru-wrap::before {
          content: '';
          position: absolute;
          top: -45px; right: -45px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(56,102,99,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        @keyframes ruIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .ru-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--outline-variant);
          background: var(--surface-container);
        }
        .ru-header-left { display: flex; align-items: center; gap: 10px; }
        .ru-icon {
          width: 30px; height: 30px;
          border-radius: 9px;
          background: var(--secondary-container);
          color: var(--on-secondary-container);
          display: grid; place-items: center;
        }
        .ru-icon svg { width: 14px; height: 14px; }
        .ru-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--on-surface);
        }
        .ru-badge {
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

        .ru-body {
          padding: 18px 18px 20px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ru-sub {
          font-size: 13px;
          color: var(--outline);
          font-weight: 300;
          line-height: 1.5;
          margin: 0 0 4px;
        }

        .ru-bar-row { display: flex; flex-direction: column; gap: 6px; }
        .ru-bar-meta {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .ru-bar-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--on-surface);
          text-transform: capitalize;
        }
        .ru-bar-count {
          font-size: 12px;
          color: var(--outline);
          font-variant-numeric: tabular-nums;
        }
        .ru-bar-track {
          width: 100%;
          height: 7px;
          border-radius: 4px;
          background: var(--surface-container-highest);
          overflow: hidden;
        }
        .ru-bar-fill {
          height: 100%;
          border-radius: 4px;
          background: var(--primary);
          transition: width 0.7s cubic-bezier(0.34, 1.1, 0.64, 1);
        }

        .ru-empty {
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
        .ru-empty svg { opacity: 0.4; }
      `}</style>
      <div className="ru-wrap">
        <div className="ru-header">
          <div className="ru-header-left">
            <div className="ru-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
            </div>
            <span className="ru-title">Coping Usage</span>
          </div>
          <div className="ru-badge">{entries.length} tools</div>
        </div>

        <div className="ru-body">
          {entries.length === 0 ? (
            <div className="ru-empty">
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
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
              No coping usage recorded this week.
            </div>
          ) : (
            <>
              <p className="ru-sub">
                Tools you used most during conversations this week.
              </p>
              {entries
                .sort(([, a], [, b]) => b - a)
                .map(([tool, count], i) => (
                  <div
                    className="ru-bar-row"
                    key={tool}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="ru-bar-meta">
                      <span className="ru-bar-name">{tool}</span>
                      <span className="ru-bar-count">{count}×</span>
                    </div>
                    <div className="ru-bar-track">
                      <div
                        className="ru-bar-fill"
                        style={{
                          width: `${Math.max((count / maxCount) * 100, 4)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
