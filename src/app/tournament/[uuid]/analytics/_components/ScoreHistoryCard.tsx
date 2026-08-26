import { LineChart } from "@/elements/charts/LineChart";
import { useLogs } from "@/hooks/logs/useLogs";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { getPointHistory } from "@/lib/scoring";
import type { Player } from "@/lib/types";
import { AnalyticsCard } from "./PlayerAnalytics";

type ScoreHistoryCardProps = {
  player: Player;
};

export function ScoreHistoryCard({ player }: ScoreHistoryCardProps) {
  const { enabledLogs } = useLogs();
  const { scoringRulesMap } = useTournaments();

  const scores = getPointHistory(enabledLogs, player, scoringRulesMap);
  const scoreData = [
    {
      title: player.name,
      data: Object.fromEntries(
        scores.map((score, index) => [`Game ${index}`, score]),
      ),
    },
  ];

  return (
    <AnalyticsCard title="Score History">
      <LineChart data={scoreData} className="h-90 w-150" />
    </AnalyticsCard>
  );
}
