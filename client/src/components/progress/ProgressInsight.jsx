export default function ProgressInsight({ bestTool, trend }) {
  if (!bestTool) return null;

  const messages = {
    improving: `Great work! Your progress is improving. "${bestTool}" seems most effective.`,
    stable: `Your emotional regulation is stable. Continue using "${bestTool}".`,
    declining: `Progress dipped recently. Consider increasing use of "${bestTool}".`,
  };

  return (
    <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
      {messages[trend] || messages.stable}
    </div>
  );
}
