import { useEffect, useState } from "react";
import { getEmotionalProfile } from "../../features/insights/insights.api";

export default function ProfileCard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getEmotionalProfile().then((res) => setProfile(res.data));
  }, []);

  if (!profile) return null;

  const { counts, percentages } = profile;
  const dominant = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
      <h3 style={{ fontWeight: 600 }}>Your Emotional Profile</h3>

      {dominant && (
        <p style={{ marginTop: 10 }}>
          Dominant recent emotion: <strong>{dominant[0]}</strong> ({dominant[1]}
          %)
        </p>
      )}

      <div
        style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        {Object.entries(percentages).map(([emotion, percent]) => (
          <span
            key={emotion}
            style={{
              background: "#f3f4f6",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {emotion}: {percent}%
          </span>
        ))}
      </div>

      <small style={{ display: "block", marginTop: 10, color: "#6b7280" }}>
        Based on conversations from the past 7 days.
      </small>
    </div>
  );
}
