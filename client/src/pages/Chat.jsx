import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SessionList from "../components/chat/SessionList";
import { useChat } from "../hooks/useChat";
import MessageBubble from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import CrisisAlert from "../components/safety/CrisisAlert";
import MoodChart from "../components/mood/MoodChart";

export default function Chat() {
  const navigate = useNavigate();
  const {
    sessions,
    sessionId,
    messages,
    newSession,
    selectSession,
    send,
    removeSession,
  } = useChat();

  const bottomRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSafetyActive = messages.some((m) => m.isSafety);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Close sidebar on session select (mobile UX) */
  const handleSelectSession = (id) => {
    selectSession(id);
    setSidebarOpen(false);
  };

  /* Close sidebar on new session (mobile UX) */
  const handleNewSession = () => {
    newSession();
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{chatStyles}</style>

      <div className="chat-root">
        {/* ── Backdrop (mobile only) ── */}
        {sidebarOpen && (
          <div
            className="chat-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside className={`chat-sidebar${sidebarOpen ? " is-open" : ""}`}>
          <SessionList
            sessions={sessions}
            onNew={handleNewSession}
            onSelect={handleSelectSession}
            onDelete={removeSession}
            activeId={sessionId}
          />
        </aside>

        {/* ── Main ── */}
        <div className="chat-main">
          {/* Top bar */}
          <header className="chat-topbar">
            <div className="chat-topbar-left">
              {/* Back button */}
              <button
                className="chat-icon-btn"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Sidebar toggle (mobile only) */}
              <button
                className="chat-icon-btn chat-menu-btn"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Toggle sessions"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                {sessions.length > 0 && (
                  <span className="chat-menu-count">{sessions.length}</span>
                )}
              </button>

              {/* Session badge */}
              <div className="chat-session-badge">
                <div className="chat-session-badge-dot" />
                <span className="chat-session-badge-text">
                  {sessionId ? "Active session" : "No session selected"}
                </span>
              </div>
            </div>

            <span className="chat-msg-count">
              {messages.length > 0
                ? `${messages.length} msg${messages.length !== 1 ? "s" : ""}`
                : ""}
            </span>
          </header>

          {/* Crisis banner */}
          <CrisisAlert isSafety={isSafetyActive} />

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
                  </svg>
                </div>
                <h3>How are you feeling?</h3>
                <p>
                  This is your safe space. Share anything on your mind — I'm
                  here to listen.
                </p>
                <div className="chat-empty-starters">
                  {[
                    "I've been feeling anxious",
                    "I need to talk",
                    "I'm having a rough day",
                    "Help me breathe",
                  ].map((s) => (
                    <button
                      key={s}
                      className="chat-starter"
                      onClick={() => send(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <MessageBubble key={m._id} message={m} />
                ))}
                <MoodChart messages={messages} />
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={send} />
        </div>
      </div>
    </>
  );
}

const chatStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --primary: #4C662B;
  --primary-container: #CDEDA3;
  --on-primary: #FFFFFF;
  --on-primary-container: #354E16;
  --secondary: #586249;
  --secondary-container: #DCE7C8;
  --tertiary: #386663;
  --tertiary-container: #BCECE7;
  --on-tertiary-container: #1F4E4B;
  --error: #BA1A1A;
  --background: #F9FAEF;
  --on-background: #1A1C16;
  --surface-container-low: #F3F4E9;
  --surface-container: #EEEFE3;
  --surface-container-high: #E8E9DE;
  --on-surface: #1A1C16;
  --on-surface-variant: #44483D;
  --outline: #75796C;
  --outline-variant: #C5C8BA;
  --inverse-primary: #B1D18A;
}

html, body, #root { height: 100%; overflow: hidden; }

/* ── ROOT LAYOUT ── */
.chat-root {
  display: flex;
  height: 100vh;
  background: var(--background);
  font-family: 'DM Sans', sans-serif;
  color: var(--on-background);
  overflow: hidden;
  position: relative;
}

/* ── SIDEBAR ── */
.chat-sidebar {
  width: 260px;
  flex-shrink: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--outline-variant);
  background: var(--surface-container-low);
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  z-index: 100;
}
/* Make SessionList fill the sidebar */
.chat-sidebar > * {
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

/* ── BACKDROP (mobile) ── */
.chat-backdrop {
  display: none;
  position: fixed; inset: 0; z-index: 99;
  background: rgba(26,28,22,0.4);
  backdrop-filter: blur(2px);
  animation: backdropIn 0.2s ease both;
}
@keyframes backdropIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── MAIN AREA ── */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
  overflow: hidden;
}

/* ── TOP BAR ── */
.chat-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px;
  border-bottom: 1px solid var(--outline-variant);
  background: rgba(249,250,239,0.92);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  gap: 8px;
}
.chat-topbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

/* Icon buttons (back + menu) */
.chat-icon-btn {
  width: 34px; height: 34px;
  border-radius: 10px;
  border: 1.5px solid var(--outline-variant);
  background: transparent;
  color: var(--on-surface-variant);
  display: grid; place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s ease;
  position: relative;
}
.chat-icon-btn:hover {
  background: var(--surface-container-high);
  border-color: rgba(76,102,43,0.3);
  color: var(--primary);
}

/* Menu toggle — hidden on desktop, visible on mobile */
.chat-menu-btn { display: none; }
.chat-menu-count {
  position: absolute; top: -5px; right: -5px;
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--primary); color: #fff;
  font-size: 9px; font-weight: 600;
  display: grid; place-items: center;
  border: 2px solid var(--background);
}

/* Session badge */
.chat-session-badge {
  display: flex; align-items: center; gap: 6px;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: 100px;
  padding: 4px 12px;
  min-width: 0; overflow: hidden;
}
.chat-session-badge-dot {
  width: 6px; height: 6px;
  background: var(--primary);
  border-radius: 50%; flex-shrink: 0;
  animation: sessionPulse 2.5s ease-in-out infinite;
}
@keyframes sessionPulse {
  0%,100% { opacity: 1; } 50% { opacity: 0.35; }
}
.chat-session-badge-text {
  font-size: 12px; font-weight: 500;
  color: var(--on-surface-variant);
  letter-spacing: 0.02em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.chat-msg-count {
  font-size: 12px; color: var(--outline); flex-shrink: 0;
}

/* ── MESSAGES ── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 8px;
  scroll-behavior: smooth;
}
.chat-messages::-webkit-scrollbar { width: 5px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb {
  background: var(--outline-variant); border-radius: 4px;
}

/* ── EMPTY STATE ── */
.chat-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 100%; text-align: center;
  padding: 2rem; gap: 12px;
  animation: fadeIn 0.4s ease both;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.chat-empty-icon {
  width: 56px; height: 56px;
  background: var(--primary-container);
  border-radius: 18px; display: grid; place-items: center;
}
.chat-empty-icon svg { width: 28px; height: 28px; fill: var(--primary); }
.chat-empty h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem; font-weight: 400; color: var(--on-background);
}
.chat-empty p {
  font-size: 13.5px; color: var(--outline);
  max-width: 280px; line-height: 1.6;
}
.chat-empty-starters {
  display: flex; flex-wrap: wrap; gap: 8px;
  justify-content: center; margin-top: 4px;
}
.chat-starter {
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: 100px; padding: 6px 14px;
  font-family: 'DM Sans', sans-serif; font-size: 12.5px;
  color: var(--on-surface-variant); cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.chat-starter:hover {
  background: var(--primary-container);
  border-color: var(--primary);
  color: var(--on-primary-container);
}

/* ── RESPONSIVE ── */

/* Tablet — sidebar narrows */
@media (max-width: 768px) {
  .chat-sidebar { width: 220px; }
}

/* Mobile — sidebar becomes off-canvas drawer */
@media (max-width: 600px) {
  .chat-sidebar {
    position: fixed;
    top: 0; left: 0;
    width: min(80vw, 300px);
    height: 100vh;
    transform: translateX(-105%);
    box-shadow: 4px 0 24px rgba(26,28,22,0.14);
  }
  .chat-sidebar.is-open {
    transform: translateX(0);
  }
  .chat-backdrop { display: block; }
  .chat-menu-btn { display: grid; }
  .chat-messages { padding: 14px 12px 6px; }
  .chat-topbar { padding: 0 12px; height: 52px; }
  /* Hide badge text on very small screens, keep dot */
  .chat-session-badge-text { max-width: 110px; }
}

@media (max-width: 380px) {
  .chat-session-badge { padding: 4px 9px; }
  .chat-session-badge-text { display: none; }
  .chat-empty h3 { font-size: 1.1rem; }
  .chat-empty p { font-size: 13px; }
}
`;
