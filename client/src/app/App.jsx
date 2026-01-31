import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/axios";

export default function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api
      .get("/")
      .then((res) => setMsg(res.data))
      .catch(() => setMsg("Backend not connected"));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Frontend → Backend Test</h1>
      <p>{msg}</p>
    </div>
  );
}
