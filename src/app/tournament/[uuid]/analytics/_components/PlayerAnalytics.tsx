import { LineGraph } from "@/elements/LineGraph";
import { useLogs } from "@/hooks/logs/useLogs";
import { useCurrentTournament } from "@/hooks/useCurrentTournament";
import { getPointHistory } from "@/lib/scores";
import type { Player } from "@/lib/types";

type PlayerAnalyticsProps = {
  player: Player;
};

export function PlayerAnalytics({ player }: PlayerAnalyticsProps) {
  const { enabledLogs } = useLogs();
  const { scoringRules } = useCurrentTournament();

  const scores = getPointHistory(enabledLogs, player, scoringRules);

  const data = {
    name: player.name,
    points: scores.map((score, index) => ({
      x: `Game ${index}`,
      y: score,
    })),
  };

  return (
    <div className="w-2xl">
      <LineGraph data={[data]} />
    </div>
  );
}
