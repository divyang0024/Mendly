import RiskLevelBadge from "../safety/RiskLevelBadge";
import { emotionColors } from "../../utils/emotionColors";
import InterventionCard from "../intervention/InterventionCard";
import TypingIndicator from "./TypingIndicator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatAIResponse } from "../../utils/formatAIResponse";

const EMOTION_PILL = {
  neutral: { bg: "#E1E4D5", color: "#44483D" },
  calm:    { bg: "#CDEDA3", color: "#354E16" },
  sad:     { bg: "#D0E4FF", color: "#004695" },
  anxious: { bg: "#FFE0B2", color: "#7A3B0A" },
  angry:   { bg: "#FFDAD6", color: "#93000A" },
};

export default function MessageBubble({ message }) {
  // Swap in the animated typing indicator for the transient typing message
  if (message._id === "typing") return <TypingIndicator />;

  const isUser = message.role === "user";
  const emotionStyle = emotionColors[message.emotion] || emotionColors.neutral;
  const formattedText = formatAIResponse(message.text);
  const pill = EMOTION_PILL[message.emotion] || EMOTION_PILL.neutral;

  return (
    <>
      <style>{mbStyles}</style>

      <div className={`bubble-row${isUser ? " is-user" : " is-ai"}`}>
        {/* AI avatar */}
        {!isUser && (
          <div className="bubble-avatar ai-avatar">
            <svg viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
            </svg>
          </div>
        )}

        <div className="bubble-content">
          <div className={`bubble${isUser ? " user-bubble" : " ai-bubble"}`}>
            {/* Safety badge (AI only) */}
            {!isUser && message.isSafety && (
              <RiskLevelBadge isSafety={message.isSafety} />
            )}

            {/* Message text */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p:      ({ children }) => <p>{children}</p>,
                li:     ({ children }) => <li>{children}</li>,
                strong: ({ children }) => <strong>{children}</strong>,
              }}
            >
              {formattedText}
            </ReactMarkdown>

            {/* Intervention card (AI only) */}
            {!isUser && message.intervention && (
              <InterventionCard intervention={message.intervention} />
            )}

            {/* Emotion badge (user only) */}
            {isUser && message.emotion && (
              <span
                className={`emotion-pill ${emotionColors[message.emotion] || emotionColors.neutral}`}
                style={{ ...emotionStyle, background: pill.bg, color: pill.color }}
              >
                {message.emotion}
              </span>
            )}
          </div>

          {message.timestamp && (
            <span className="bubble-time">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/* User avatar */}
        {isUser && (
          <div className="bubble-avatar user-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}

const mbStyles = `
  .bubble-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 14px;
    animation: bubbleIn 0.25s ease both;
    /* prevent bubbles from overflowing the chat container */
    min-width: 0;
  }
  @keyframes bubbleIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bubble-row.is-user { justify-content: flex-end; }
  .bubble-row.is-ai   { justify-content: flex-start; }

  /* ── Avatar ── */
  .bubble-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .bubble-avatar.ai-avatar {
    background: #CDEDA3;
    margin-right: 8px;
  }
  .bubble-avatar.ai-avatar svg { width: 16px; height: 16px; fill: #4C662B; }
  .bubble-avatar.user-avatar {
    background: #4C662B;
    margin-left: 8px;
    order: 1;
  }
  .bubble-avatar.user-avatar svg { width: 14px; height: 14px; fill: #fff; }

  /* ── Bubble content wrapper — takes remaining width, allows shrink ── */
  .bubble-content {
    min-width: 0;
    max-width: min(72%, calc(100% - 46px));
  }

  /* ── Bubble ── */
  .bubble {
    width: 100%;
    padding: 11px 14px;
    border-radius: 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.65;
    color: #1A1C16;
    word-break: break-word;
    overflow-wrap: anywhere;
    /* prevent content from forcing layout overflow */
    box-sizing: border-box;
  }
  .bubble.ai-bubble {
    background: #EEEFE3;
    border: 1px solid #C5C8BA;
    border-top-left-radius: 4px;
  }
  .bubble.user-bubble {
    background: #4C662B;
    color: #fff;
    border-top-right-radius: 4px;
  }
  .bubble.user-bubble p { color: rgba(255,255,255,0.9); }

  /* ── Markdown overrides ── */
  .bubble p { margin-bottom: 8px; }
  .bubble p:last-child { margin-bottom: 0; }
  .bubble li { margin-bottom: 5px; }
  .bubble strong { font-weight: 600; }
  .bubble ul, .bubble ol { padding-left: 18px; }
  /* long unbreakable strings (URLs, filenames) */
  .bubble a { word-break: break-all; }

  /* ── Emotion pill ── */
  .emotion-pill {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    padding: 2px 9px;
    border-radius: 100px;
    margin-top: 7px;
    letter-spacing: 0.03em;
    text-transform: capitalize;
  }

  /* ── Timestamp ── */
  .bubble-time {
    font-size: 10px;
    color: #75796C;
    margin-top: 4px;
    display: block;
  }
  .bubble-row.is-user .bubble-time { text-align: right; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    /* Wider bubbles on small screens */
    .bubble-content {
      max-width: calc(100% - 42px);
    }
    .bubble {
      font-size: 13.5px;
      padding: 10px 12px;
    }
    /* Slightly smaller avatars on very small screens */
    .bubble-avatar {
      width: 26px; height: 26px;
    }
    .bubble-avatar.ai-avatar { margin-right: 6px; }
    .bubble-avatar.user-avatar { margin-left: 6px; }
    .bubble-avatar.ai-avatar svg { width: 14px; height: 14px; }
    .bubble-avatar.user-avatar svg { width: 12px; height: 12px; }
  }

  @media (max-width: 360px) {
    .bubble-content {
      max-width: calc(100% - 36px);
    }
    .bubble-avatar {
      width: 24px; height: 24px;
    }
  }`;