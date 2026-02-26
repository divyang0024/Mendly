import { useEffect, useState } from "react";
import { getRiskAssessment } from "../features/risk/risk.api";

import RiskBadge from "../components/risk/RiskBadge";
import RiskSignals from "../components/risk/RiskSignals";
import EscalationCard from "../components/risk/EscalationCard";

// NEW COMPONENTS
import RiskSummary from "../components/risk/RiskSummary";
import RiskTimeline from "../components/risk/RiskTimeline";

export default function RiskDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

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
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center">
        Risk Escalation Dashboard
      </h1>

      {/* =========================
         PRIMARY ASSESSMENT BLOCK
      ========================== */}
      <div className="flex justify-center">
        <RiskBadge level={data.riskLevel} />
      </div>

      <RiskSignals signals={data.signals} />
      <EscalationCard escalation={data.escalation} />

      {/* =========================
         DIVIDER
      ========================== */}
      <hr className="my-6" />

      {/* =========================
         NEW MONITORING SECTION
      ========================== */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Risk Monitoring</h2>

        <RiskSummary refresh={refresh} />
        <RiskTimeline refresh={refresh} />

        <div className="text-center">
          <button
            onClick={() => setRefresh(!refresh)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Refresh Monitoring
          </button>
        </div>
      </div>
    </div>
  );
}
