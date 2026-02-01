// client/src/hooks/useChat.js
import { useState, useEffect, useRef } from "react";
import {
  createSession,
  getHistory,
  getSessions,
  deleteSession
} from "../features/chat/chat.api";
import socket from "../services/socket";

/**
 * useChat - robust real-time chat hook
 * - handles optimistic UI with tempId
 * - merges history and optimistic messages without overwriting
 * - filters socket events by sessionId
 * - prevents duplicate typing indicators and duplicate messages
 */
export function useChat() {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Keep a ref to the current sessionId so socket handlers always use the latest.
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

        // Normalize response shape so history is always an array
        let history = [];
        if (Array.isArray(res?.data)) {
          history = res.data;
        } else if (Array.isArray(res?.data?.messages)) {
          history = res.data.messages;
        } else if (Array.isArray(res?.data?.data)) {
          history = res.data.data;
        } else if (Array.isArray(res)) {
          history = res;
        } else {
          history = [];
        }

        if (cancelled) return;

        setMessages((current) => {
          // Build set of DB ids
          const dbIds = new Set(history.map((m) => m._id));

          // Keep only temps that belong to the current session (prevent cross-session bleed)
          const temps = current.filter(
            (m) => m.tempId && m.sessionId === sessionId,
          );

          // Keep only temps that aren't already in DB (server should echo tempId when saving)
          const uniqueTemps = temps.filter((t) => !dbIds.has(t._id));

          // Final merged view: DB history (oldest->newest) + optimistic temps (if any)
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

  /* ---------- SOCKET LISTENERS (registered once) ---------- */
  useEffect(() => {
    // Only accept socket events that belong to the currently-active session
    const isForCurrentSession = (msg) => {
      if (!msg || !msg.sessionId) return false;
      return msg.sessionId === sessionRef.current;
    };

    const handleUserSaved = (msg) => {
      if (!isForCurrentSession(msg)) return;

      setMessages((prev) => {
        // Remove the optimistic temp message that matches tempId (if exists)
        const withoutTemp = prev.filter((m) => m.tempId !== msg.tempId);

        // Prevent duplicate DB messages (same _id) in case history already has it
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

      // 🔥 Refresh sessions to re-sort
      const { data } = await getSessions();
      setSessions(data);
    };


    socket.on("user_message_saved", handleUserSaved);
    socket.on("ai_typing", handleAITyping);
    socket.on("ai_message", handleAIMessage);

    return () => {
      socket.off("user_message_saved", handleUserSaved);
      socket.off("ai_typing", handleAITyping);
      socket.off("ai_message", handleAIMessage);
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

 const removeSession = async (id) => {
   try {
     await deleteSession(id);

     // Remove from session list
     setSessions((prev) => prev.filter((s) => s._id !== id));

     // If deleted session is active, clear chat window
     if (sessionId === id) {
       setSessionId(null);
       setMessages([]);
     }
   } catch (err) {
     console.error("Delete session failed", err);
   }
 };


  /* ---------- SELECT EXISTING SESSION ---------- */
  const selectSession = (id) => {
    setSessionId(id);
  };

  /* ---------- SEND MESSAGE (optimistic + emit) ---------- */
  const send = (text) => {
    if (!sessionId) return;

    const tempId = "temp-" + Date.now();

    // add optimistic message (include sessionId so merging logic can consider it)
    setMessages((prev) => [
      ...prev,
      { _id: tempId, tempId, sessionId, role: "user", text },
    ]);

    // send to backend; include sessionId and tempId
    socket.emit("send_message", { sessionId, text, tempId });
  };

  const handleAIMessage = (msg) => {
  if (!isForCurrentSession(msg)) return;

  setMessages((prev) => {
    const withoutTyping = prev.filter((m) => m._id !== "typing");
    return [...withoutTyping, msg];
  });
};



  return {
    sessions,
    sessionId,
    messages,
    newSession,
    selectSession,
    send,
    removeSession,
    handleAIMessage
  };
}
