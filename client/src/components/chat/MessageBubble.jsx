import RiskLevelBadge from "../safety/RiskLevelBadge";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          background: isUser ? "#d1e7ff" : "#f1f1f1",
          padding: 12,
          borderRadius: 8,
          maxWidth: "70%",
        }}
      >
        {!isUser && <RiskLevelBadge isSafety={message.isSafety} />}
        {message.text}
      </div>
    </div>
  );
}
