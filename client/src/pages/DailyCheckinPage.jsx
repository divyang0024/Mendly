import { useState } from "react";
import DailyCheckinForm from "../components/checkin/DailyCheckinForm";
import CheckinStats from "../components/checkin/CheckinStats";
import CheckinHistory from "../components/checkin/CheckinHistory";

export default function DailyCheckinPage() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((r) => !r);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Daily Check-in</h1>

      <DailyCheckinForm onSaved={triggerRefresh} />

      <CheckinStats refresh={refresh} />

      <CheckinHistory refresh={refresh} />
    </div>
  );
}
