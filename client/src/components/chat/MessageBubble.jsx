export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 12, 
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: 14,
          lineHeight: 1.5,
          background: isUser ? "#4caf50" : "#f1f1f1",
          color: isUser ? "white" : "black",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word", 
        }}
      >
        {message.text}
      </div>
    </div>
  );
}
