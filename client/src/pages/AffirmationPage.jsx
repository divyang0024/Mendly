import { useState } from "react";
import AffirmationFlow from "../components/coping/AffirmationFlow";
import AffirmationStats from "../components/coping/AffirmationStats";
import AffirmationHistory from "../components/coping/AffirmationHistory";

export default function AffirmationPage() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <AffirmationFlow onComplete={() => setRefresh(!refresh)} />
      <AffirmationStats key={refresh} />
      <AffirmationHistory key={"h-" + refresh} />
    </div>
  );
}
