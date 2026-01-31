import SessionList from "../components/chat/SessionList";
import { useChat } from "../hooks/useChat";
import MessageBubble from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import { useEffect, useRef } from "react";


export default function Chat() {
  const { sessions, messages, newSession, selectSession, send } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ display: "flex" }}>
      <SessionList
        sessions={sessions}
        onNew={newSession}
        onSelect={selectSession}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Message area */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {messages.map((m) => (
            <MessageBubble key={m._id} message={m} />
          ))}

          {/* 👇 This is the scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Input stays fixed at bottom */}
        <ChatInput onSend={send} />
      </div>
    </div>
  );
}

