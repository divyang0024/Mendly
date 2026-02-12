import { useEffect, useState } from "react";
import { getRiskAssessment } from "../features/risk/risk.api";
import RiskBadge from "../components/risk/RiskBadge";
import RiskSignals from "../components/risk/RiskSignals";
import EscalationCard from "../components/risk/EscalationCard";

export default function RiskDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRisk = async () => {
    try {
      const res = await getRiskAssessment();
      setData(res.data);
    } catch (err) {
      console.error("Risk fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisk();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Assessing emotional risk...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Risk Escalation Dashboard</h1>

      <div className="flex justify-center">
        <RiskBadge level={data.riskLevel} />
      </div>

      <RiskSignals signals={data.signals} />

      <EscalationCard escalation={data.escalation} />
    </div>
  );
}
