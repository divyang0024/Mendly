import { useEffect, useState } from "react";
import { getLongTermSummary } from "../features/longterm/longterm.api";

import SummaryCards from "../components/longterm/SummaryCards";
import TrendCard from "../components/longterm/TrendCard";
import CopingUsageCard from "../components/longterm/CopingUsageCard";
import TriggerCard from "../components/longterm/TriggerCard";
import HighlightsCard from "../components/longterm/HighlightsCard";

export default function LongTermPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await getLongTermSummary();
      setData(res.data);
    };
    fetch();
  }, []);

  if (!data) {
    return <div className="p-6">Loading insights...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Long-Term Emotional Memory</h1>

      {/* TOP SUMMARY */}
      <SummaryCards data={data.summary} />

      {/* BENTO GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        <TrendCard trend={data.trend} />
        <CopingUsageCard usage={data.copingUsage} />
        <TriggerCard triggers={data.triggers} />

        <div className="md:col-span-3">
          <HighlightsCard highlights={data.highlights} />
        </div>
      </div>
    </div>
  );
}
