// client/src/hooks/useChat.js
import { useState, useEffect, useRef } from "react";
import {
  createSession,
  getHistory,
  getSessions,
  deleteSession,
} from "../features/chat/chat.api";
import socket from "../services/socket";

export function useChat() {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Ref so socket handlers always read the latest sessionId without re-registering
  const sessionRef = useRef(sessionId);
  useEffect(() => {
    sessionRef.current = sessionId;
  }, [sessionId]);

  /* ---------- LOAD SESSIONS (initial) ---------- */
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { data } = await getSessions();
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setSessions(data);
          setSessionId(data[0]._id);
        } else {
          const res = await createSession();
          setSessions([res.data]);
          setSessionId(res.data._id);
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- LOAD HISTORY WHEN SESSION CHANGES ---------- */
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await getHistory(sessionId);

        let history = [];
        if (Array.isArray(res?.data)) history = res.data;
        else if (Array.isArray(res?.data?.messages))
          history = res.data.messages;
        else if (Array.isArray(res?.data?.data)) history = res.data.data;
        else if (Array.isArray(res)) history = res;

        if (cancelled) return;

        setMessages((current) => {
          const dbIds = new Set(history.map((m) => m._id));
          const temps = current.filter(
            (m) => m.tempId && m.sessionId === sessionId,
          );
          const uniqueTemps = temps.filter((t) => !dbIds.has(t._id));
          return [...history, ...uniqueTemps];
        });
      } catch (err) {
        console.error("Failed to load history", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  /* ---------- JOIN ROOM + REJOIN ON RECONNECT ---------- */
  useEffect(() => {
    if (!sessionId) return;

    socket.emit("join_session", sessionId);

    // Rejoin after socket reconnects (network drop, server restart, etc.)
    const handleReconnect = () =>
      socket.emit("join_session", sessionRef.current);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
      socket.emit("leave_session", sessionId);
    };
  }, [sessionId]);

  /* ---------- SOCKET LISTENERS (registered once) ---------- */
  useEffect(() => {
    const isForCurrentSession = (msg) =>
      msg?.sessionId && msg.sessionId === sessionRef.current;

    const handleUserSaved = (msg) => {
      if (!isForCurrentSession(msg)) return;
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.tempId !== msg.tempId);
        if (withoutTemp.some((m) => m._id === msg._id)) return withoutTemp;
        return [...withoutTemp, msg];
      });
    };

    const handleAITyping = (msg) => {
      if (!isForCurrentSession(msg)) return;
      setMessages((prev) =>
        prev.some((m) => m._id === "typing")
          ? prev
          : [...prev, { _id: "typing", role: "ai", text: "..." }],
      );
    };

    const handleAIMessage = async (msg) => {
      if (!isForCurrentSession(msg)) return;
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m._id !== "typing");
        if (withoutTyping.some((m) => m._id === msg._id)) return withoutTyping;
        return [...withoutTyping, msg];
      });
      try {
        const { data } = await getSessions();
        setSessions(data);
      } catch (err) {
        console.error("Failed to refresh sessions", err);
      }
    };

    // ✅ Fix: clear typing indicator when AI errors out
    const handleAIError = (msg) => {
      if (!isForCurrentSession(msg)) return;
      setMessages((prev) => prev.filter((m) => m._id !== "typing"));
    };

    socket.on("user_message_saved", handleUserSaved);
    socket.on("ai_typing", handleAITyping);
    socket.on("ai_message", handleAIMessage);
    socket.on("ai_message_error", handleAIError);

    return () => {
      socket.off("user_message_saved", handleUserSaved);
      socket.off("ai_typing", handleAITyping);
      socket.off("ai_message", handleAIMessage);
      socket.off("ai_message_error", handleAIError);
    };
  }, []);

  /* ---------- CREATE NEW SESSION ---------- */
  const newSession = async () => {
    try {
      const { data } = await createSession();
      setSessions((prev) => [data, ...prev]);
      setSessionId(data._id);
    } catch (err) {
      console.error("Failed to create session", err);
    }
  };

  /* ---------- DELETE SESSION ---------- */
  const removeSession = async (id) => {
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      // ✅ Fix: use sessionRef to avoid stale closure
      if (sessionRef.current === id) {
        setSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Delete session failed", err);
    }
  };

  /* ---------- SELECT SESSION ---------- */
  const selectSession = (id) => setSessionId(id);

  /* ---------- SEND MESSAGE ---------- */
  const send = (text) => {
    if (!sessionId || !text?.trim()) return;
    const tempId = "temp-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { _id: tempId, tempId, sessionId, role: "user", text },
    ]);
    socket.emit("send_message", { sessionId, text, tempId });
  };

  return {
    sessions,
    sessionId,
    messages,
    newSession,
    selectSession,
    send,
    removeSession,
  };
}
