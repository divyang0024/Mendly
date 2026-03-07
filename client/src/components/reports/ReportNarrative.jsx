export default function ReportNarrative({ text }) {
  if (!text) return null;

  return (
    <>
      <style>{`
        .rn-wrap {
          font-family: 'DM Sans', sans-serif;
          background: var(--primary-container);
          border: 1.5px solid var(--primary);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 12px rgba(26,28,22,0.1);
          color: var(--on-primary-container);
          animation: rnIn 0.4s ease-out both;
        }
        .rn-wrap::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(76,102,43,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .rn-wrap::after {
          content: '';
          position: absolute;
          bottom: -30px; left: -30px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(177,209,138,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        @keyframes rnIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .rn-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(76,102,43,0.2);
          background: rgba(76,102,43,0.08);
        }
        .rn-header-left { display: flex; align-items: center; gap: 10px; }
        .rn-icon {
          width: 30px; height: 30px;
          border-radius: 9px;
          background: var(--primary);
          color: var(--on-primary);
          display: grid; place-items: center;
        }
        .rn-icon svg { width: 14px; height: 14px; }
        .rn-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--on-primary-container);
        }
        .rn-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(76,102,43,0.12);
          border: 1px solid rgba(76,102,43,0.2);
          font-size: 11px;
          font-weight: 500;
          color: var(--on-primary-container);
        }

        .rn-body {
          padding: 20px 20px 24px;
          position: relative;
          z-index: 1;
        }
        .rn-quote-mark {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          line-height: 0.6;
          color: var(--primary);
          opacity: 0.3;
          display: block;
          margin-bottom: 8px;
          user-select: none;
        }
        .rn-text {
          font-size: 14px;
          color: var(--on-primary-container);
          white-space: pre-line;
          line-height: 1.75;
          font-weight: 300;
          margin: 0;
        }

        .rn-footer {
          height: 4px;
          background: linear-gradient(90deg, var(--primary) 0%, var(--tertiary) 100%);
        }
      `}</style>
      <div className="rn-wrap">
        <div className="rn-header">
          <div className="rn-header-left">
            <div className="rn-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <span className="rn-title">Weekly Reflection</span>
          </div>
          <div className="rn-badge">✨ AI Summary</div>
        </div>

        <div className="rn-body">
          <span className="rn-quote-mark">"</span>
          <p className="rn-text">{text}</p>
        </div>

        <div className="rn-footer" />
      </div>
    </>
  );
}
