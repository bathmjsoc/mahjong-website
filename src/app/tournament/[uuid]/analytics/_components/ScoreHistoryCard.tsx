import { LineChart } from "@/elements/charts/LineChart";
import { useCurrentTournament } from "@/hooks/tournaments/useCurrentTournament";
import { getPointHistory } from "@/lib/scoring";
import type { Log, Player } from "@/lib/types";

type ScoreHistoryCardProps = {
  logs: Log[];
  player: Player;
};

export function ScoreHistoryCard({ logs, player }: ScoreHistoryCardProps) {
  const { scoringRulesMap } = useCurrentTournament();

  const scores = getPointHistory(logs, player, scoringRulesMap);
  const scoreData = [
    {
      title: player.name,
      data: Object.fromEntries(
        scores.map((score, index) => [`Game ${index}`, score]),
      ),
    },
  ];

  return (
    <div className="h-90 w-150">
      <LineChart data={scoreData} title="SCORE HISTORY" />
    </div>
  );
}
