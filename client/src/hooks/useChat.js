import { useState, useEffect } from "react";
import {
  createSession,
  getHistory,
  getSessions,
} from "../features/chat/chat.api";
import socket from "../services/socket";

export function useChat() {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  /* -------------------- LOAD SESSIONS -------------------- */
  useEffect(() => {
    const init = async () => {
      const { data } = await getSessions();

      if (data.length > 0) {
        setSessions(data);
        setSessionId(data[0]._id);
      } else {
        const res = await createSession();
        setSessions([res.data]);
        setSessionId(res.data._id);
      }
    };
    init();
  }, []);

  /* -------------------- LOAD HISTORY -------------------- */
  useEffect(() => {
    if (!sessionId) return;
    getHistory(sessionId).then((res) => setMessages(res.data));
  }, [sessionId]);

  /* -------------------- SOCKET LISTENERS -------------------- */
  useEffect(() => {
    socket.on("user_message_saved", (msg) => {
      setMessages((prev) =>
        prev.filter((m) => !m._id.startsWith("temp-")).concat(msg),
      );
    });

    socket.on("ai_typing", () => {
      setMessages((prev) => [
        ...prev,
        { _id: "typing", role: "ai", text: "..." },
      ]);
    });

    socket.on("ai_message", (msg) => {
      setMessages((prev) => prev.filter((m) => m._id !== "typing").concat(msg));
    });

    return () => {
      socket.off("user_message_saved");
      socket.off("ai_typing");
      socket.off("ai_message");
    };
  }, []);

  /* -------------------- NEW SESSION -------------------- */
  const newSession = async () => {
    const { data } = await createSession();
    setSessions((prev) => [data, ...prev]);
    setSessionId(data._id);
    setMessages([]);
  };

  const selectSession = (id) => {
    setSessionId(id);
  };

  /* -------------------- SEND MESSAGE -------------------- */
 const send = (text) => {
   if (!sessionId) return;

   setMessages((prev) => [
     ...prev,
     { _id: "temp-" + Date.now(), role: "user", text },
   ]);

   socket.emit("send_message", { sessionId, text });
 };


  return {
    sessions,
    sessionId,
    messages,
    newSession,
    selectSession,
    send,
  };
}
