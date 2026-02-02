import { useEffect, useState } from "react";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { logout } = useAuth();
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
      <button onClick={logout}>Logout</button>
      <Link to="/chat">Go to Chat</Link>
      <Link to="/insights">Go to Insights</Link>
    </div>
  );
}
