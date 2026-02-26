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

  const Card = ({ label, value, color }) => (
    <div className="p-4 rounded-xl shadow bg-white border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Low Risk" value={data.low} color="text-green-600" />
      <Card label="Moderate" value={data.moderate} color="text-yellow-600" />
      <Card label="High Risk" value={data.high} color="text-orange-600" />
      <Card label="Crisis" value={data.crisis} color="text-red-600" />
    </div>
  );
}
