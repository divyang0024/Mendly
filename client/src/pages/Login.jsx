import { useState } from "react";
import { loginUser } from "../features/auth/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token, data.user);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --primary: #4C662B;
          --primary-container: #CDEDA3;
          --on-primary: #FFFFFF;
          --on-primary-container: #354E16;
          --secondary: #586249;
          --secondary-container: #DCE7C8;
          --on-secondary-container: #404A33;
          --tertiary: #386663;
          --tertiary-container: #BCECE7;
          --on-tertiary-container: #1F4E4B;
          --background: #F9FAEF;
          --on-background: #1A1C16;
          --surface: #F9FAEF;
          --on-surface: #1A1C16;
          --surface-variant: #E1E4D5;
          --on-surface-variant: #44483D;
          --outline: #75796C;
          --outline-variant: #C5C8BA;
          --surface-container-low: #F3F4E9;
          --surface-container: #EEEFE3;
          --surface-container-high: #E8E9DE;
          --surface-container-highest: #E2E3D8;
          --inverse-primary: #B1D18A;
          --error: #BA1A1A;
        }

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--background);
          font-family: 'DM Sans', sans-serif;
          color: var(--on-background);
        }

        /* ── Left panel ── */
        .login-panel {
          position: relative;
          background: var(--primary);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
          overflow: hidden;
        }

        .login-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 30% 20%, rgba(177,209,138,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 80% 80%, rgba(56,102,99,0.3) 0%, transparent 60%);
        }

        /* botanical ring decorations */
        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(205,237,163,0.18);
        }
        .ring-1 { width: 420px; height: 420px; top: -120px; right: -140px; }
        .ring-2 { width: 280px; height: 280px; top: -40px;  right: -60px;  border-color: rgba(205,237,163,0.12); }
        .ring-3 { width: 180px; height: 180px; bottom: 120px; left: -60px; }

        /* leaf dots pattern */
        .dots-grid {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background-image: radial-gradient(circle, rgba(177,209,138,0.35) 1.5px, transparent 1.5px);
          background-size: 20px 20px;
          opacity: 0.6;
        }

        .panel-badge {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(205,237,163,0.15);
          border: 1px solid rgba(205,237,163,0.3);
          border-radius: 100px;
          padding: 6px 14px;
          margin-bottom: 1.5rem;
          width: fit-content;
        }

        .panel-badge span {
          width: 6px; height: 6px;
          background: var(--inverse-primary);
          border-radius: 50%;
          display: block;
          animation: pulse 2s ease-in-out infinite;
        }

        .panel-badge p {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: var(--inverse-primary);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .panel-headline {
          position: relative;
          z-index: 1;
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: var(--primary-container);
          margin-bottom: 1rem;
        }

        .panel-headline em {
          font-style: italic;
          color: var(--inverse-primary);
        }

        .panel-sub {
          position: relative;
          z-index: 1;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(205,237,163,0.75);
          max-width: 340px;
          margin-bottom: 2.5rem;
        }

        .panel-stats {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 2rem;
        }

        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--inverse-primary);
          line-height: 1;
        }
        .stat-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(205,237,163,0.6);
        }

        /* ── Right panel (form) ── */
        .login-form-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: clamp(2rem, 5vw, 4rem);
          position: relative;
        }

        .form-container {
          width: 100%;
          max-width: 420px;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo mark */
        .logo-mark {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2.5rem;
        }

        .logo-icon {
          width: 38px; height: 38px;
          background: var(--primary);
          border-radius: 10px;
          display: grid;
          place-items: center;
        }

        .logo-icon svg { width: 20px; height: 20px; fill: var(--on-primary); }

        .logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary);
          letter-spacing: -0.01em;
        }

        .form-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 2.5vw, 2rem);
          font-weight: 400;
          color: var(--on-background);
          line-height: 1.25;
          margin-bottom: 0.5rem;
        }

        .form-sub {
          font-size: 14px;
          color: var(--outline);
          margin-bottom: 2.25rem;
        }

        .form-sub a {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }

        .form-sub a:hover { text-decoration: underline; }

        /* Field */
        .field {
          position: relative;
          margin-bottom: 1.25rem;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--on-surface-variant);
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }

        .field.focused .field-label { color: var(--primary); }

        .field-inner {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          display: flex;
          color: var(--outline);
          pointer-events: none;
          transition: color 0.2s;
        }

        .field.focused .field-icon { color: var(--primary); }

        .field-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: var(--surface-container-low);
          border: 1.5px solid var(--outline-variant);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: var(--on-surface);
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: var(--outline); font-size: 14px; }

        .field-input:focus {
          border-color: var(--primary);
          background: var(--surface-container-lowest, #fff);
          box-shadow: 0 0 0 3px rgba(76,102,43,0.1);
        }

        .field-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--outline);
          display: flex;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .field-toggle:hover { color: var(--primary); background: var(--primary-container); }

        /* Forgot link */
        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -0.5rem;
          margin-bottom: 1.5rem;
        }
        .forgot-link {
          font-size: 13px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }

        /* Submit button */
        .btn-submit {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: var(--on-primary);
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }

        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background: var(--on-primary-container);
          box-shadow: 0 4px 20px rgba(76,102,43,0.3);
          transform: translateY(-1px);
        }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.5rem 0;
          color: var(--outline-variant);
          font-size: 12px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--outline-variant);
        }

        /* SSO buttons */
        .sso-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .btn-sso {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px;
          background: var(--surface-container);
          border: 1.5px solid var(--outline-variant);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--on-surface);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }

        .btn-sso:hover {
          background: var(--surface-container-high);
          border-color: var(--outline);
          transform: translateY(-1px);
        }

        .btn-sso svg { width: 18px; height: 18px; flex-shrink: 0; }

        /* Bottom note */
        .signup-note {
          text-align: center;
          margin-top: 2rem;
          font-size: 13px;
          color: var(--outline);
        }
        .signup-note a {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }
        .signup-note a:hover { text-decoration: underline; }

        /* Corner chip decoration */
        .corner-chip {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--surface-container);
          border: 1px solid var(--outline-variant);
          border-radius: 100px;
          padding: 5px 12px 5px 8px;
        }
        .corner-chip-dot {
          width: 8px; height: 8px;
          background: var(--tertiary);
          border-radius: 50%;
        }
        .corner-chip-text {
          font-size: 11px;
          font-weight: 500;
          color: var(--on-surface-variant);
          letter-spacing: 0.03em;
        }

        /* ─── RESPONSIVE ─── */

        /* Tablet */
        @media (max-width: 900px) {
          .login-root { grid-template-columns: 1fr; }
          .login-panel {
            padding: 2.5rem 2rem 2rem;
            min-height: 240px;
            justify-content: flex-start;
          }
          .panel-stats { margin-bottom: 0; }
          .ring-1 { width: 260px; height: 260px; top: -80px; right: -80px; }
          .ring-2 { width: 160px; height: 160px; top: -30px; right: -30px; }
          .ring-3 { display: none; }
          .dots-grid { opacity: 0.35; }
          .panel-headline { font-size: 1.6rem; margin-bottom: 0.5rem; }
          .panel-sub { display: none; }
          .panel-stats { gap: 1.5rem; }
          .login-form-wrap { padding: 2rem 1.5rem; }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .login-panel { padding: 2rem 1.25rem 1.5rem; min-height: 200px; }
          .panel-badge { margin-bottom: 1rem; }
          .panel-headline { font-size: 1.4rem; }
          .panel-stats { gap: 1.25rem; }
          .stat-num { font-size: 1.4rem; }
          .login-form-wrap { padding: 1.75rem 1.25rem 4rem; }
          .logo-mark { margin-bottom: 1.75rem; }
          .form-heading { font-size: 1.5rem; }
          .sso-row { grid-template-columns: 1fr; }
          .corner-chip { display: none; }
        }
      `}</style>

      <div className="login-root">
        {/* ── Left decorative panel ── */}
        <aside className="login-panel">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
          <div className="dots-grid" />

          <div className="panel-badge">
            <span />
            <p>Welcome back</p>
          </div>

          <h1 className="panel-headline">
            Your space to <em>grow</em>
            <br />
            and <em>thrive</em>
          </h1>
          <p className="panel-sub">
            Sign in to pick up right where you left off. Everything you need,
            organised and ready for you.
          </p>

          <div className="panel-stats">
            <div className="stat">
              <span className="stat-num">12k+</span>
              <span className="stat-label">Active users</span>
            </div>
            <div className="stat">
              <span className="stat-num">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat">
              <span className="stat-num">4.9★</span>
              <span className="stat-label">Avg. rating</span>
            </div>
          </div>
        </aside>

        {/* ── Right form panel ── */}
        <main className="login-form-wrap">
          <div className="form-container">
            {/* Logo */}
            <div className="logo-mark">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
                </svg>
              </div>
              <span className="logo-name">Verdant</span>
            </div>

            <h2 className="form-heading">
              Sign in to
              <br />
              your account
            </h2>
            <p className="form-sub">
              New here? <a href="/register">Create a free account</a>
            </p>

            <form onSubmit={submit} noValidate>
              {/* Email */}
              <div
                className={`field${focusedField === "email" ? " focused" : ""}`}
              >
                <label className="field-label" htmlFor="email">
                  Email address
                </label>
                <div className="field-inner">
                  <span className="field-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    className="field-input"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={form.email}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div
                className={`field${focusedField === "password" ? " focused" : ""}`}
              >
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <div className="field-inner">
                  <span className="field-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    className="field-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={form.password}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="field-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="forgot-row">
                <a href="/forgot-password" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            
          </div>

          {/* Corner decoration */}
          <div className="corner-chip">
            <div className="corner-chip-dot" />
            <span className="corner-chip-text">SSL secured</span>
          </div>
        </main>
      </div>
    </>
  );
}
