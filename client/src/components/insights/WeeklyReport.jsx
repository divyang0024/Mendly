import { useEffect, useState } from "react";
import { getWeeklyReport } from "../../features/insights/insights.api";

export default function WeeklyReport() {
  const [report, setReport] = useState("Loading...");

  useEffect(() => {
    getWeeklyReport().then((res) => {
      setReport(res.data.report);
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-2">Weekly Emotional Summary</h3>
      <p className="text-gray-700 whitespace-pre-line">{report}</p>
    </div>
  );
}
