import SessionList from "../components/chat/SessionList";
import { useChat } from "../hooks/useChat";
import MessageBubble from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import CrisisAlert from "../components/safety/CrisisAlert";
import MoodChart from "../components/mood/MoodChart";
import { useEffect, useRef } from "react";

export default function Chat() {
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
  const isSafetyActive = messages.some((m) => m.isSafety);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <style>{`
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

        html, body, #root {
          height: 100%;
          overflow: hidden;
        }

        .chat-root {
          display: flex;
          height: 100vh;
          background: var(--background);
          font-family: 'DM Sans', sans-serif;
          color: var(--on-background);
          overflow: hidden;
        }

        /* ── Main chat area ── */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          min-width: 0;
          overflow: hidden;
        }

        /* ── Top bar ── */
        .chat-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 56px;
          border-bottom: 1px solid var(--outline-variant);
          background: rgba(249,250,239,0.9);
          backdrop-filter: blur(10px);
          flex-shrink: 0;
        }

        .chat-topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chat-session-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--surface-container);
          border: 1px solid var(--outline-variant);
          border-radius: 100px;
          padding: 4px 12px;
        }

        .chat-session-badge-dot {
          width: 6px; height: 6px;
          background: var(--primary);
          border-radius: 50%;
          animation: sessionPulse 2.5s ease-in-out infinite;
        }

        @keyframes sessionPulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.35; }
        }

        .chat-session-badge-text {
          font-size: 12px;
          font-weight: 500;
          color: var(--on-surface-variant);
          letter-spacing: 0.02em;
        }

        .chat-msg-count {
          font-size: 12px;
          color: var(--outline);
        }

        /* ── Messages scroll area ── */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px 20px 8px;
          scroll-behavior: smooth;
        }

        .chat-messages::-webkit-scrollbar { width: 5px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: var(--outline-variant);
          border-radius: 4px;
        }

        /* ── Empty state ── */
        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          padding: 2rem;
          gap: 12px;
          animation: fadeIn 0.4s ease both;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chat-empty-icon {
          width: 56px; height: 56px;
          background: var(--primary-container);
          border-radius: 18px;
          display: grid;
          place-items: center;
        }
        .chat-empty-icon svg { width: 28px; height: 28px; fill: var(--primary); }

        .chat-empty h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: var(--on-background);
        }

        .chat-empty p {
          font-size: 13.5px;
          color: var(--outline);
          max-width: 280px;
          line-height: 1.6;
        }

        .chat-empty-starters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 4px;
        }

        .chat-starter {
          background: var(--surface-container);
          border: 1px solid var(--outline-variant);
          border-radius: 100px;
          padding: 6px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          color: var(--on-surface-variant);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .chat-starter:hover {
          background: var(--primary-container);
          border-color: var(--primary);
          color: var(--on-primary-container);
        }

        /* ── Responsive ── */
        @media (max-width: 500px) {
          .chat-messages { padding: 14px 12px 6px; }
          .chat-topbar { padding: 0 12px; }
        }
      `}</style>

      <div className="chat-root">
        {/* Sidebar */}
        <SessionList
          sessions={sessions}
          onNew={newSession}
          onSelect={selectSession}
          onDelete={removeSession}
          activeId={sessionId}
        />

        {/* Main */}
        <div className="chat-main">
          {/* Top bar */}
          <header className="chat-topbar">
            <div className="chat-topbar-left">
              <div className="chat-session-badge">
                <div className="chat-session-badge-dot" />
                <span className="chat-session-badge-text">
                  {sessionId ? "Active session" : "No session selected"}
                </span>
              </div>
            </div>
            <span className="chat-msg-count">
              {messages.length > 0
                ? `${messages.length} message${messages.length !== 1 ? "s" : ""}`
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

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={send} />
        </div>
      </div>
    </>
  );
}
