export default function TypingIndicator() {
  return (
    <>
      <style>{tiStyles}</style>
      <div className="ti-row">
        <div className="ti-avatar">
          <svg viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C5.71 21 6 20.5 6.47 19.57C9 20.5 11.7 20.69 14.09 20C20.22 18.18 22.5 9.51 17 8ZM6.81 18C7.72 16 10.5 13.5 14.5 13.5C13 15 10 17.5 6.81 18Z" />
          </svg>
        </div>
        <div className="ti-bubble">
          <span className="ti-dot" />
          <span className="ti-dot" />
          <span className="ti-dot" />
        </div>
      </div>
    </>
  );
}

const tiStyles = `
  .ti-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 14px;
    animation: tiIn 0.25s ease both;
  }
  @keyframes tiIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Avatar — matches ai-avatar in MessageBubble */
  .ti-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: #CDEDA3;
    display: grid; place-items: center;
    flex-shrink: 0;
  }
  .ti-avatar svg {
    width: 16px; height: 16px;
    fill: #4C662B;
  }

  /* Bubble — matches ai-bubble in MessageBubble */
  .ti-bubble {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 13px 16px;
    border-radius: 16px;
    border-top-left-radius: 4px;
    background: #EEEFE3;
    border: 1px solid #C5C8BA;
  }

  /* Dots */
  .ti-dot {
    display: block;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #4C662B;
    opacity: 0.35;
    animation: tiPulse 1.4s ease-in-out infinite;
  }
  .ti-dot:nth-child(1) { animation-delay: 0s;    }
  .ti-dot:nth-child(2) { animation-delay: 0.18s; }
  .ti-dot:nth-child(3) { animation-delay: 0.36s; }

  @keyframes tiPulse {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.35;
      background: #4C662B;
    }
    30% {
      transform: translateY(-5px);
      opacity: 1;
      background: #386663;
    }
  }

  @media (max-width: 480px) {
    .ti-avatar { width: 26px; height: 26px; }
    .ti-avatar svg { width: 14px; height: 14px; }
    .ti-bubble { padding: 11px 14px; gap: 4px; }
    .ti-dot { width: 6px; height: 6px; }
  }
`;
