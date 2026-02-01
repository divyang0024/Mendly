export default function CrisisAlert({ isSafety }) {
  if (!isSafety) return null;

  return (
    <div
      style={{
        background: "#fff1f0",
        border: "1px solid #ffa39e",
        padding: 12,
        borderRadius: 6,
        marginBottom: 10,
      }}
    >
      <strong>You are not alone.</strong>
      <p>
        If you're in immediate danger, please contact local emergency services.
      </p>
      <p>
        India Helpline: <b>+91-9820466726</b>
      </p>
    </div>
  );
}
