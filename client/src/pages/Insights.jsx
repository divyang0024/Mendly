import EmotionTrendGraph from "../components/insights/EmotionTrendGraph";
import EmotionPieChart from "../components/insights/EmotionPieChart";
import WeeklyReport from "../components/insights/WeeklyReport";

export default function Insights() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Emotional Insights</h1>

      <EmotionTrendGraph />
      <EmotionPieChart />
      <WeeklyReport />
    </div>
  );
}
