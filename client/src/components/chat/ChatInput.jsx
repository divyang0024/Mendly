import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  const autoResize = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <>
      <style>{`
        .chat-input-wrap {
          border-top: 1px solid #C5C8BA;
          background: #F9FAEF;
          padding: 12px 16px 10px;
          flex-shrink: 0;
        }
        .chat-input-row {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: #F3F4E9;
          border: 1.5px solid #C5C8BA;
          border-radius: 16px;
          padding: 9px 12px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .chat-input-row.is-focused {
          border-color: #4C662B;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(76,102,43,0.1);
        }
        .chat-textarea {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1A1C16;
          resize: none;
          min-height: 22px;
          max-height: 120px;
          line-height: 1.55;
          padding: 0;
          overflow-y: auto;
        }
        .chat-textarea::placeholder { color: #75796C; }
        .chat-send-btn {
          width: 36px; height: 36px;
          flex-shrink: 0;
          background: #4C662B;
          border: none;
          border-radius: 10px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .chat-send-btn:hover:not(:disabled) {
          background: #354E16;
          transform: scale(1.06);
        }
        .chat-send-btn:disabled { background: #C5C8BA; cursor: not-allowed; }
        .chat-send-btn svg { width: 15px; height: 15px; fill: #fff; }
        .chat-input-hint {
          text-align: center;
          font-size: 11px;
          color: #C5C8BA;
          margin-top: 7px;
          letter-spacing: 0.02em;
        }
      `}</style>
      <form className="chat-input-wrap" onSubmit={submit}>
        <div className={`chat-input-row${focused ? " is-focused" : ""}`}>
          <textarea
            className="chat-textarea"
            rows={1}
            value={text}
            onChange={autoResize}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!text.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="chat-input-hint">
          Enter to send · Shift+Enter for new line
        </p>
      </form>
    </>
  );
}
