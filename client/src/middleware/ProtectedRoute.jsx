import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <>
      <style>{lsStyles}</style>
      <div className="ls-wrap">
        <div className="ls-card">
          {/* Animated leaf icon */}
          <div className="ls-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22V12" />
              <path d="M12 12C12 7 7 4 4 6" />
              <path d="M12 12c0-5 5-8 8-6" />
              <path d="M12 12c-4 0-7 3-6 7" />
              <path d="M12 12c4 0 7 3 6 7" />
            </svg>
          </div>

          {/* Dots */}
          <div className="ls-dots">
            <span className="ls-dot" />
            <span className="ls-dot" />
            <span className="ls-dot" />
          </div>

          <p className="ls-label">Getting things ready…</p>
        </div>
      </div>
    </>
  );
}

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" />;
}

const lsStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&family=DM+Sans:wght@300;400&display=swap');

.ls-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #F9FAEF;
  font-family: 'DM Sans', sans-serif;
}

.ls-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Pulsing leaf icon */
.ls-icon {
  width: 64px; height: 64px;
  border-radius: 20px;
  background: #CDEDA3;
  color: #4C662B;
  display: grid;
  place-items: center;
  animation: lsPulse 2s ease-in-out infinite;
}
.ls-icon svg { width: 30px; height: 30px; }

@keyframes lsPulse {
  0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0   rgba(76,102,43,0.15); }
  50%       { transform: scale(1.06); box-shadow: 0 0 0 12px rgba(76,102,43,0);    }
}

/* Dots */
.ls-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ls-dot {
  display: block;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #4C662B;
  opacity: 0.35;
  animation: lsDot 1.4s ease-in-out infinite;
}
.ls-dot:nth-child(1) { animation-delay: 0s;    }
.ls-dot:nth-child(2) { animation-delay: 0.18s; }
.ls-dot:nth-child(3) { animation-delay: 0.36s; }

@keyframes lsDot {
  0%, 60%, 100% { transform: translateY(0);   opacity: 0.35; background: #4C662B; }
  30%           { transform: translateY(-5px); opacity: 1;    background: #386663; }
}

/* Label */
.ls-label {
  font-family: 'Playfair Display', serif;
  font-size: 0.95rem;
  font-weight: 400;
  color: #75796C;
  letter-spacing: 0.01em;
}
`;
