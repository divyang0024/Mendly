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
      <br />
      <button onClick={logout}>Logout</button>
      <Link to="/chat">Go to Chat</Link>
      <br />
      <Link to="/insights">Go to Insights</Link>
      <br />
      <Link to="/breathing">Go to Breathing Exercise</Link>
      <br />
      <Link to="/grounding">Go to Grounding Exercise</Link>
      <br />
      <Link to="/reframing">Go to Reframing Exercise</Link>
      <br />
      <Link to="/affirmation">Go to Affirmation Exercise</Link>
      <br />
      <Link to="/activation">Go to Activation Exercise</Link>
      <br />
      <Link to="/progress">Go to Progress Page</Link>
      <br />
      <Link to="/risk">Go to Risk Dashboard</Link>
      <br />
      <Link to="/longterm">Go to Long-Term Insights</Link>
      <br />
      <Link to="/weekly-report">Go to Weekly Report</Link>
    </div>
  );
}
