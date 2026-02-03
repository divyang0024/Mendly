import RiskLevelBadge from "../safety/RiskLevelBadge";
import { emotionColors } from "../../utils/emotionColors";
import InterventionCard from "../intervention/InterventionCard";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const emotionStyle = emotionColors[message.emotion] || emotionColors.neutral;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 14, // more spacing
      }}
    >
      <div
        style={{
          background: isUser ? "#d1e7ff" : "#f1f1f1",
          padding: 12,
          borderRadius: 8,
          maxWidth: "70%",
          lineHeight: 1.5,
        }}
      >
        {/* 🚨 Safety Badge (AI only) */}
        {!isUser && message.isSafety && (
          <RiskLevelBadge isSafety={message.isSafety} />
        )}

        {/* 💬 Message Text */}
        <div style={{ marginBottom: 6 }}>{message.text}</div>
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
