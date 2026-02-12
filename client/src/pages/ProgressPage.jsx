import { useState } from "react";
import ProgressOverviewCard from "../components/progress/ProgressOverviewCard";
import ProgressInsight from "../components/progress/ProgressInsight";

export default function ProgressPage() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Progress Impact Engine</h1>

      {/* Overview */}
      <ProgressOverviewCard refresh={refresh} />

      {/* Insight */}
      <ProgressInsight />
    </div>
  );
}
