export default function EscalationCard({ escalation }) {
  return (
    <>
      <style>{`
        .ec-wrap{
          font-family:'DM Sans',sans-serif;
          background:var(--surface-container-low);
          border:1.5px solid var(--outline-variant);
          border-radius:20px;
          overflow:hidden;
          position:relative;
          box-shadow:0 1px 12px rgba(26,28,22,0.07);
        }

        .ec-header{
          display:flex;
          align-items:center;
          gap:10px;
          padding:14px 18px;
          border-bottom:1px solid var(--outline-variant);
          background:var(--surface-container);
        }

        .ec-icon{
          width:30px;
          height:30px;
          border-radius:9px;
          background:var(--tertiary-container);
          color:var(--on-tertiary-container);
          display:grid;
          place-items:center;
        }

        .ec-title{
          font-family:'Playfair Display',serif;
          font-size:1rem;
          font-weight:400;
          color:var(--on-surface);
        }

        .ec-body{
          padding:18px;
          display:flex;
          flex-direction:column;
          gap:16px;
        }

        .ec-field{
          padding:14px 16px;
          border-radius:14px;
          background:var(--surface-container-high);
          border:1px solid var(--outline-variant);
        }

        .ec-label{
          font-size:11px;
          letter-spacing:0.05em;
          text-transform:uppercase;
          color:var(--outline);
          margin-bottom:5px;
        }

        .ec-text{
          font-size:14px;
          line-height:1.6;
          color:var(--on-surface);
        }

        .ec-action{
          padding:14px 16px;
          border-radius:14px;
          background:var(--primary-container);
          border:1.5px solid rgba(76,102,43,0.25);
        }

        .ec-action-text{
          font-size:14px;
          color:var(--on-primary-container);
          font-weight:500;
          line-height:1.6;
        }
      `}</style>

      <div className="ec-wrap">
        <div className="ec-header">
          <div className="ec-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>

          <span className="ec-title">Escalation Plan</span>
        </div>

        <div className="ec-body">
          <div className="ec-field">
            <div className="ec-label">Reason</div>
            <p className="ec-text">{escalation.reason}</p>
          </div>

          <div className="ec-action">
            <div className="ec-label">Recommended Action</div>
            <p className="ec-action-text">{escalation.action}</p>
          </div>
        </div>
      </div>
    </>
  );
}
