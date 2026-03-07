import { useEffect, useState } from "react";
import { getRiskSummary } from "../../features/risk/risk.api";

export default function RiskSummary({ refresh }) {
  const [data, setData] = useState({
    low: 0,
    moderate: 0,
    high: 0,
    crisis: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRiskSummary();
      setData(res.data);
    };
    fetchData();
  }, [refresh]);

  const cards = [
    {
      label: "Low Risk",
      value: data.low,
      color: "var(--risk-low-text)",
      bg: "var(--risk-low-bg)",
    },
    {
      label: "Moderate",
      value: data.moderate,
      color: "var(--risk-moderate-text)",
      bg: "var(--risk-moderate-bg)",
    },
    {
      label: "High Risk",
      value: data.high,
      color: "var(--risk-high-text)",
      bg: "var(--risk-high-bg)",
    },
    {
      label: "Crisis",
      value: data.crisis,
      color: "var(--risk-crisis-text)",
      bg: "var(--risk-crisis-bg)",
    },
  ];

  return (
    <>
      <style>{`
        .rsm-grid{
          font-family:'DM Sans',sans-serif;
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
          gap:14px;
        }

        .rsm-card{
          background:var(--surface-container-low);
          border:1.5px solid var(--outline-variant);
          border-radius:16px;
          padding:18px;
          display:flex;
          flex-direction:column;
          gap:6px;
          box-shadow:0 1px 10px rgba(26,28,22,0.05);
        }

        .rsm-label{
          font-size:12px;
          color:var(--outline);
        }

        .rsm-value{
          font-family:'Playfair Display',serif;
          font-size:2rem;
          line-height:1;
        }
      `}</style>

      <div className="rsm-grid">
        {cards.map((card) => (
          <div className="rsm-card" key={card.label}>
            <div className="rsm-label">{card.label}</div>
            <div className="rsm-value" style={{ color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
