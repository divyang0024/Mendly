import ReframingFlow from "../components/coping/ReframingFlow";
import ReframingHistory from "../components/coping/ReframingHistory";
import ReframingStats from "../components/coping/ReframingStats";
import { useState, useCallback } from "react";

export default function ReframingPage() {
  const [refresh, setRefresh] = useState(false);

  // ✅ Stable reference
  const handleComplete = useCallback(() => {
    setRefresh((r) => !r);
  }, []);

  return (
    <div className="space-y-6">
      <ReframingFlow onComplete={handleComplete} />
      <ReframingStats refresh={refresh} />
      <ReframingHistory refresh={refresh} />
    </div>
  );
}
