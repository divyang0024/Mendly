export default function RiskLevelBadge({ isSafety }) {
  if (!isSafety) return null;

  return (
    <div
      style={{
        background: "#ff4d4f",
        color: "white",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 8,
      }}
    >
      🚨 Support Mode Activated
    </div>
  );
}
