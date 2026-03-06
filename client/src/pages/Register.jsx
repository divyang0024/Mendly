import { useState } from "react";
import { registerUser } from "../features/auth/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [strength, setStrength] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.token, data.user);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#BA1A1A", "#75796C", "#386663", "#4C662B"][
    strength
  ];

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
          --error: #BA1A1A;
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
          --inverse-surface: #2F312A;
        }

        .reg-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--background);
          font-family: 'DM Sans', sans-serif;
          color: var(--on-background);
        }

        /* ── Left form panel ── */
        .reg-form-wrap {
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
          margin-bottom: 2rem;
        }

        .form-sub a {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }

        .form-sub a:hover { text-decoration: underline; }

        /* Step indicators */
        .steps {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.75rem;
        }

        .step-dot {
          height: 4px;
          border-radius: 100px;
          transition: width 0.35s ease, background 0.35s ease;
        }

        .step-dot.active  { width: 28px; background: var(--primary); }
        .step-dot.done    { width: 16px; background: var(--primary-container); }
        .step-dot.pending { width: 8px;  background: var(--outline-variant); }

        /* Field */
        .field {
          position: relative;
          margin-bottom: 1.1rem;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--on-surface-variant);
          margin-bottom: 0.45rem;
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
          background: #fff;
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

        /* Password strength */
        .strength-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .strength-bar {
          flex: 1;
          height: 3px;
          border-radius: 100px;
          background: var(--outline-variant);
          transition: background 0.3s;
        }

        .strength-label {
          font-size: 11px;
          font-weight: 500;
          min-width: 36px;
          text-align: right;
          letter-spacing: 0.03em;
          transition: color 0.3s;
        }

        /* Terms checkbox */
        .terms-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 1.25rem 0 1.5rem;
        }

        .terms-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border: 1.5px solid var(--outline-variant);
          border-radius: 5px;
          background: var(--surface-container-low);
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 1px;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
        }

        .terms-checkbox:checked {
          background: var(--primary);
          border-color: var(--primary);
        }

        .terms-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1.5px;
          width: 6px;
          height: 10px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }

        .terms-text {
          font-size: 13px;
          color: var(--on-surface-variant);
          line-height: 1.6;
        }

        .terms-text a {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }
        .terms-text a:hover { text-decoration: underline; }

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
        .signin-note {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 13px;
          color: var(--outline);
        }
        .signin-note a {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }
        .signin-note a:hover { text-decoration: underline; }

        /* Corner chip */
        .corner-chip {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
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

        /* ── Right decorative panel ── */
        .reg-panel {
          position: relative;
          background: var(--inverse-surface);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3.5rem;
          overflow: hidden;
        }

        /* Teal glow */
        .reg-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 45% at 70% 25%, rgba(56,102,99,0.45) 0%, transparent 65%),
            radial-gradient(ellipse 40% 50% at 20% 80%, rgba(76,102,43,0.3) 0%, transparent 60%);
        }

        /* Concentric arcs */
        .arc {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(177,209,138,0.1);
        }
        .arc-1 { width: 500px; height: 500px; bottom: -160px; left: -180px; }
        .arc-2 { width: 340px; height: 340px; bottom: -100px; left: -100px; border-color: rgba(160,208,203,0.12); }
        .arc-3 { width: 200px; height: 200px; top: 60px; right: -70px; }

        /* Noise texture overlay */
        .reg-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.5;
        }

        .panel-content { position: relative; z-index: 1; }

        .panel-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(177,209,138,0.1);
          border: 1px solid rgba(177,209,138,0.2);
          border-radius: 100px;
          padding: 5px 14px 5px 10px;
          margin-bottom: 2rem;
          width: fit-content;
        }

        .panel-eyebrow-dot {
          width: 6px; height: 6px;
          background: var(--inverse-primary);
          border-radius: 50%;
        }

        .panel-eyebrow-text {
          font-size: 11px;
          font-weight: 500;
          color: var(--inverse-primary);
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .panel-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 2.8vw, 2.5rem);
          font-weight: 400;
          line-height: 1.2;
          color: #E2E3D8;
          margin-bottom: 1rem;
        }

        .panel-headline em {
          font-style: italic;
          color: var(--inverse-primary);
        }

        .panel-sub {
          font-size: 14px;
          line-height: 1.75;
          color: rgba(197,200,186,0.75);
          max-width: 340px;
          margin-bottom: 2.5rem;
        }

        /* Feature list */
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-icon {
          width: 34px; height: 34px;
          flex-shrink: 0;
          border-radius: 10px;
          background: rgba(205,237,163,0.1);
          border: 1px solid rgba(205,237,163,0.18);
          display: grid;
          place-items: center;
          color: var(--inverse-primary);
        }

        .feature-icon svg { width: 16px; height: 16px; }

        .feature-text {
          font-size: 13.5px;
          color: rgba(225,228,213,0.8);
          line-height: 1.4;
        }

        .feature-text strong {
          display: block;
          font-weight: 500;
          color: #E1E4D5;
          font-size: 14px;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .reg-root { grid-template-columns: 1fr; }

          .reg-panel {
            order: -1;
            padding: 2rem 1.5rem;
            min-height: 220px;
            justify-content: flex-start;
          }

          .panel-sub { display: none; }
          .feature-list { flex-direction: row; flex-wrap: wrap; gap: 10px; }
          .feature-item { flex-direction: column; align-items: flex-start; gap: 6px; flex: 1 1 140px; }
          .arc-1 { width: 300px; height: 300px; bottom: -120px; left: -100px; }
          .arc-2 { width: 180px; height: 180px; bottom: -60px; left: -50px; }
          .arc-3 { display: none; }
          .panel-headline { font-size: 1.5rem; margin-bottom: 0.5rem; }

          .reg-form-wrap { padding: 2rem 1.5rem; }
          .corner-chip { display: none; }
        }

        @media (max-width: 480px) {
          .reg-panel { padding: 1.75rem 1.25rem; }
          .panel-headline { font-size: 1.35rem; }
          .feature-list { gap: 8px; }
          .feature-item { flex: 1 1 120px; }
          .feature-text { font-size: 12px; }
          .reg-form-wrap { padding: 1.75rem 1.25rem 4rem; }
          .sso-row { grid-template-columns: 1fr; }
          .logo-mark { margin-bottom: 1.75rem; }
          .form-heading { font-size: 1.5rem; }
        }
      `}</style>

      <div className="reg-root">
        {/* ── Left form panel ── */}
        <main className="reg-form-wrap">
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

            {/* Progress dots */}
            <div className="steps" aria-label="Step 1 of 3">
              <div className="step-dot active" />
              <div className="step-dot pending" />
              <div className="step-dot pending" />
            </div>

            <h2 className="form-heading">
              Create your
              <br />
              account
            </h2>
            <p className="form-sub">
              Already have one? <a href="/login">Sign in instead</a>
            </p>

            <form onSubmit={submit} noValidate>
              {/* Full name */}
              <div
                className={`field${focusedField === "name" ? " focused" : ""}`}
              >
                <label className="field-label" htmlFor="name">
                  Full name
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
                      <circle cx="12" cy="8" r="4" />
                      <path d="M20 21a8 8 0 1 0-16 0" />
                    </svg>
                  </span>
                  <input
                    id="name"
                    className="field-input"
                    type="text"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    value={form.name}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    value={form.password}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      calcStrength(e.target.value);
                    }}
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

                {/* Strength meter */}
                {form.password.length > 0 && (
                  <div className="strength-row">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="strength-bar"
                          style={{
                            background:
                              strength >= n ? strengthColor : undefined,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="strength-label"
                      style={{ color: strengthColor }}
                    >
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>


              {/* Submit */}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
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

          

            <p className="signin-note">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>

          {/* Corner chip */}
          <div className="corner-chip">
            <div className="corner-chip-dot" />
            <span className="corner-chip-text">Free forever plan</span>
          </div>
        </main>

        {/* ── Right decorative panel ── */}
        <aside className="reg-panel">
          <div className="arc arc-1" />
          <div className="arc arc-2" />
          <div className="arc arc-3" />

          <div className="panel-content">
            <div className="panel-eyebrow">
              <div className="panel-eyebrow-dot" />
              <span className="panel-eyebrow-text">Join Verdant</span>
            </div>

            <h2 className="panel-headline">
              Everything you need
              <br />
              to <em>get started</em>
            </h2>
            <p className="panel-sub">
              Set up your account in under a minute. No credit card required —
              just bring your ideas and we'll take care of the rest.
            </p>

            <div className="feature-list">
              {[
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: "Bank-level security",
                  sub: "End-to-end encryption on all data",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                  ),
                  title: "Organised dashboard",
                  sub: "All your work in one clean view",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  ),
                  title: "Instant setup",
                  sub: "Ready in less than 60 seconds",
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                  title: "Team collaboration",
                  sub: "Invite members with one click",
                },
              ].map(({ icon, title, sub }) => (
                <div className="feature-item" key={title}>
                  <div className="feature-icon">{icon}</div>
                  <div className="feature-text">
                    <strong>{title}</strong>
                    {sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
