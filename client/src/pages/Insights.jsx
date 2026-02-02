import EmotionTrendGraph from "../components/insights/EmotionTrendGraph";
import EmotionPieChart from "../components/insights/EmotionPieChart";
import WeeklyReport from "../components/insights/WeeklyReport";
import TrendCard from "../components/insights/TrendCard";
import VolatilityCard from "../components/insights/VolatilityCard";
import ProfileCard from "../components/insights/ProfileCard";

export default function Insights() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Emotional Insights</h1>
      <ProfileCard />
      <EmotionTrendGraph />
      <EmotionPieChart />
      <WeeklyReport />
      <TrendCard />
      <VolatilityCard />
    </div>
  );
}
