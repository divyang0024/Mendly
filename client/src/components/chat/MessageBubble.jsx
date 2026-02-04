import RiskLevelBadge from "../safety/RiskLevelBadge";
import { emotionColors } from "../../utils/emotionColors";
import InterventionCard from "../intervention/InterventionCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatAIResponse } from "../../utils/formatAIResponse";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const emotionStyle = emotionColors[message.emotion] || emotionColors.neutral;

  const formattedText = formatAIResponse(message.text);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          background: isUser ? "#d1e7ff" : "#f1f1f1",
          padding: 12,
          borderRadius: 8,
          maxWidth: "70%",
          lineHeight: 1.6,
          fontSize: 15,
        }}
      >
        {/* 🚨 Safety Badge (AI only) */}
        {!isUser && message.isSafety && (
          <RiskLevelBadge isSafety={message.isSafety} />
        )}

        {/* 💬 Formatted AI / User Text */}
        <div style={{ marginBottom: 6 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p style={{ marginBottom: 10 }}>{children}</p>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: 6 }}>{children}</li>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: 600 }}>{children}</strong>
              ),
            }}
          >
            {formattedText}
          </ReactMarkdown>
        </div>

        {/* 🧘 Intervention UI */}
        {!isUser && message.intervention && (
          <InterventionCard intervention={message.intervention} />
        )}

        {/* 🎭 Emotion Badge (User only) */}
        {isUser && message.emotion && (
          <span
            className={emotionColors[message.emotion] || emotionColors.neutral}
            style={{
              ...emotionStyle,
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 999,
              display: "inline-block",
            }}
          >
            {message.emotion}
          </span>
        )}
      </div>
    </div>
  );
}
