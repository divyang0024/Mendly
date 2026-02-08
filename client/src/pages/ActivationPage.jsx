import { useState } from "react";
import ActivationPlanner from "../components/activation/ActivationPlanner";
import ActivationHistory from "../components/activation/ActivationHistory";
import ActivationStats from "../components/activation/ActivationStats";

export default function ActivationPage() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Behavioral Activation</h1>

      <ActivationPlanner onCreated={() => setRefresh(!refresh)} />
      <ActivationStats refresh={refresh} />
      <ActivationHistory refresh={refresh} />
    </div>
  );
}
