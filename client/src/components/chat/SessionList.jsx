export default function SessionList({
  sessions,
  onSelect,
  onNew,
  onDelete,
  activeId,
}) {
  return (
    <>
      <style>{slStyles}</style>

      {/* No wrapper <aside> — Chat.jsx owns the sidebar shell */}
      <div className="sl-inner">
        {/* Header */}
        <div className="sl-header">
          <div className="sl-logo">
            <div className="sl-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
              </svg>
            </div>
            <span className="sl-logo-name">Mendly</span>
          </div>
        </div>

        {/* New session */}
        <div className="sl-new-wrap">
          <button className="sl-btn-new" onClick={onNew}>
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

        <div className="sl-label">Recent chats</div>

        {/* Session list */}
        <div className="sl-list">
          {sessions.length === 0 ? (
            <div className="sl-empty">
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
                className={`sl-item${activeId === s._id ? " is-active" : ""}`}
              >
                <span className="sl-dot" />
                <div
                  className="sl-title"
                  onClick={() => onSelect(s._id)}
                  title={s.title}
                >
                  {s.title || "Untitled session"}
                </div>
                <button
                  className="sl-btn-delete"
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
      </div>
    </>
  );
}

const slStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

/* ── INNER SHELL — fills whatever Chat.jsx gives it ── */
.sl-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--surface-container, #EEEFE3);
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
}

/* ── HEADER ── */
.sl-header {
  display: flex;
  align-items: center;
  padding: 16px 14px 12px;
  border-bottom: 1px solid var(--outline-variant, #C5C8BA);
  flex-shrink: 0;
}
.sl-logo { display: flex; align-items: center; gap: 8px; }
.sl-logo-icon {
  width: 28px; height: 28px;
  background: var(--primary, #4C662B);
  border-radius: 7px;
  display: grid; place-items: center; flex-shrink: 0;
}
.sl-logo-icon svg { width: 15px; height: 15px; fill: #fff; }
.sl-logo-name {
  font-family: 'Playfair Display', serif;
  font-size: 1rem; font-weight: 600;
  color: var(--primary, #4C662B);
}

/* ── NEW SESSION BUTTON ── */
.sl-new-wrap { padding: 10px 8px 4px; flex-shrink: 0; }
.sl-btn-new {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 10px 14px;
  background: var(--primary, #4C662B); color: #fff;
  border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: background 0.2s, transform 0.15s;
}
.sl-btn-new:hover { background: #354E16; transform: translateY(-1px); }
.sl-btn-new svg { width: 15px; height: 15px; flex-shrink: 0; }

/* ── LABEL ── */
.sl-label {
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--outline, #75796C);
  padding: 8px 14px 6px; flex-shrink: 0;
}

/* ── LIST SCROLL AREA ── */
.sl-list {
  flex: 1; min-height: 0;
  overflow-y: auto;
  padding: 0 8px 12px;
}
.sl-list::-webkit-scrollbar { width: 4px; }
.sl-list::-webkit-scrollbar-track { background: transparent; }
.sl-list::-webkit-scrollbar-thumb {
  background: var(--outline-variant, #C5C8BA); border-radius: 4px;
}

/* ── SESSION ITEM ── */
.sl-item {
  display: flex; align-items: center; gap: 6px;
  border-radius: 10px; padding: 8px 10px; margin-bottom: 2px;
  cursor: pointer; transition: background 0.15s;
  background: transparent;
}
.sl-item:hover { background: #E1E4D5; }
.sl-item.is-active { background: var(--primary-container, #CDEDA3); }

.sl-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--outline-variant, #C5C8BA);
  flex-shrink: 0; transition: background 0.2s;
}
.sl-item.is-active .sl-dot { background: var(--primary, #4C662B); }

.sl-title {
  flex: 1; font-size: 13px;
  color: var(--on-surface-variant, #44483D);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  line-height: 1.4; min-width: 0;
}
.sl-item.is-active .sl-title { color: var(--on-primary-container, #354E16); font-weight: 500; }

.sl-btn-delete {
  width: 26px; height: 26px; flex-shrink: 0;
  background: none; border: none; border-radius: 6px;
  display: grid; place-items: center;
  cursor: pointer; color: var(--outline, #75796C);
  opacity: 0; transition: opacity 0.15s, background 0.15s, color 0.15s;
}
.sl-item:hover .sl-btn-delete { opacity: 1; }
.sl-btn-delete:hover { background: #FFDAD6; color: #BA1A1A; }
.sl-btn-delete svg { width: 13px; height: 13px; }

/* ── EMPTY STATE ── */
.sl-empty {
  text-align: center; padding: 32px 16px;
  color: var(--outline, #75796C);
  font-size: 13px; line-height: 1.6;
}
.sl-empty svg {
  width: 32px; height: 32px;
  color: var(--outline-variant, #C5C8BA);
  margin: 0 auto 10px; display: block;
}
`;
