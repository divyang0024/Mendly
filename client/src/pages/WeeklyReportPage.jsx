import { useEffect, useState } from "react";
import {
  generateWeeklyReport,
  getLatestWeeklyReport,
} from "../features/reports/weeklyReport.api";

import ReportSummary from "../components/reports/ReportSummary";
import ReportTrend from "../components/reports/ReportTrend";
import ReportUsage from "../components/reports/ReportUsage";
import ReportTriggers from "../components/reports/ReportTriggers";
import ReportHighlights from "../components/reports/ReportHighlights";
import ReportNarrative from "../components/reports/ReportNarrative";

export default function WeeklyReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    const res = await getLatestWeeklyReport();
    setReport(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    await generateWeeklyReport();
    await fetchReport();
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading your emotional report...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Weekly Emotional Report
      </h1>

      {!report && (
        <div className="text-center space-y-4">
          <p>No report yet. Generate your first one.</p>
          <button
            onClick={handleGenerate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate Report
          </button>
        </div>
      )}

      {report && (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {generating ? "Generating..." : "Generate New Report"}
            </button>
          </div>

          <ReportSummary summary={report.summary} />
          <ReportTrend trend={report.trend} />
          <ReportUsage usage={report.copingUsage} />
          <ReportTriggers triggers={report.triggers} />
          <ReportHighlights highlights={report.highlights} />
          <ReportNarrative text={report.aiReportText} />
        </>
      )}
    </div>
  );
}
