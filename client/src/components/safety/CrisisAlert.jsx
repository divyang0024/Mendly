export default function CrisisAlert({ isSafety }) {
  if (!isSafety) return null;

  return (
    <>
      <style>{`
        .crisis-alert {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #FFDAD6;
          border-top: 3px solid #BA1A1A;
          padding: 12px 20px;
          animation: crisisIn 0.35s cubic-bezier(0.16,1,0.3,1);
          flex-shrink: 0;
        }
        @keyframes crisisIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .crisis-icon-wrap {
          width: 34px; height: 34px;
          background: #BA1A1A;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .crisis-icon-wrap svg { width: 17px; height: 17px; fill: #fff; }
        .crisis-body { flex: 1; }
        .crisis-title {
          font-size: 13.5px;
          font-weight: 500;
          color: #93000A;
          margin-bottom: 3px;
        }
        .crisis-desc {
          font-size: 12.5px;
          color: #410002;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .crisis-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #BA1A1A;
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 100px;
        }
        .crisis-pill svg { width: 12px; height: 12px; fill: #fff; }
      `}</style>
      <div className="crisis-alert" role="alert" aria-live="assertive">
        <div className="crisis-icon-wrap">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div className="crisis-body">
          <div className="crisis-title">You are not alone.</div>
          <p className="crisis-desc">
            If you're in immediate danger, please contact local emergency
            services.
          </p>
          <span className="crisis-pill">
            <svg viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            India Helpline: +91-9820466726
          </span>
        </div>
      </div>
    </>
  );
}
