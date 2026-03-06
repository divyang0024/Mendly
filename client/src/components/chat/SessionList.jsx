export default function SessionList({
  sessions,
  onSelect,
  onNew,
  onDelete,
  activeId,
}) {
  return (
    <>
      <style>{`
        .session-sidebar {
          width: 260px;
          min-width: 260px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #EEEFE3;
          border-right: 1px solid #C5C8BA;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* Header */
        .session-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 14px 12px;
          border-bottom: 1px solid #C5C8BA;
          flex-shrink: 0;
        }
        .session-header-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .session-logo-icon {
          width: 28px; height: 28px;
          background: #4C662B;
          border-radius: 7px;
          display: grid;
          place-items: center;
        }
        .session-logo-icon svg { width: 15px; height: 15px; fill: #fff; }
        .session-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: #4C662B;
        }

        /* New session button */
        .btn-new-session {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          margin: 12px 0 8px;
          padding: 10px 14px;
          background: #4C662B;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .btn-new-session:hover { background: #354E16; transform: translateY(-1px); }
        .btn-new-session svg { width: 15px; height: 15px; }

        .session-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #75796C;
          padding: 0 14px 6px;
          flex-shrink: 0;
        }

        /* Sessions scroll area */
        .session-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 8px 12px;
        }
        .session-list::-webkit-scrollbar { width: 4px; }
        .session-list::-webkit-scrollbar-track { background: transparent; }
        .session-list::-webkit-scrollbar-thumb { background: #C5C8BA; border-radius: 4px; }

        /* Individual session row */
        .session-item {
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 10px;
          padding: 8px 10px;
          margin-bottom: 2px;
          cursor: pointer;
          transition: background 0.15s;
          background: transparent;
        }
        .session-item:hover { background: #E1E4D5; }
        .session-item.is-active { background: #CDEDA3; }

        .session-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #C5C8BA;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .session-item.is-active .session-dot { background: #4C662B; }

        .session-title {
          flex: 1;
          font-size: 13px;
          color: #44483D;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
          min-width: 0;
        }
        .session-item.is-active .session-title { color: #354E16; font-weight: 500; }

        .btn-delete-session {
          width: 26px; height: 26px;
          flex-shrink: 0;
          background: none;
          border: none;
          border-radius: 6px;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #75796C;
          opacity: 0;
          transition: opacity 0.15s, background 0.15s, color 0.15s;
        }
        .session-item:hover .btn-delete-session { opacity: 1; }
        .btn-delete-session:hover { background: #FFDAD6; color: #BA1A1A; }
        .btn-delete-session svg { width: 13px; height: 13px; }

        /* Empty state */
        .session-empty {
          text-align: center;
          padding: 32px 16px;
          color: #75796C;
          font-size: 13px;
          line-height: 1.6;
        }
        .session-empty svg {
          width: 32px; height: 32px;
          color: #C5C8BA;
          margin: 0 auto 10px;
          display: block;
        }

        /* Collapsed / mobile */
        @media (max-width: 700px) {
          .session-sidebar {
            width: 200px;
            min-width: 200px;
          }
        }
        @media (max-width: 500px) {
          .session-sidebar {
            display: none;
          }
        }
      `}</style>

      <aside className="session-sidebar">
        {/* Header */}
        <div className="session-header">
          <div className="session-header-logo">
            <div className="session-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="session-logo-name">Verdant</span>
          </div>
        </div>

        {/* New session */}
        <div style={{ padding: "0 8px", flexShrink: 0 }}>
          <button className="btn-new-session" onClick={onNew}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Session
          </button>
        </div>

        <div className="session-label">Recent chats</div>

        {/* Session list */}
        <div className="session-list">
          {sessions.length === 0 ? (
            <div className="session-empty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              No sessions yet.
              <br />
              Start a new chat above.
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s._id}
                className={`session-item${activeId === s._id ? " is-active" : ""}`}
              >
                <span className="session-dot" />
                <div
                  className="session-title"
                  onClick={() => onSelect(s._id)}
                  title={s.title}
                >
                  {s.title || "Untitled session"}
                </div>
                <button
                  className="btn-delete-session"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s._id);
                  }}
                  aria-label="Delete session"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
