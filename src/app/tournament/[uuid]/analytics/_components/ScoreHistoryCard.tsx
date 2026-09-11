import { LineChart } from "@/elements/charts/LineChart";
import { useLogs } from "@/hooks/logs/useLogs";
import { useTournament } from "@/hooks/tournaments/useTournament";
import { getPointHistory } from "@/lib/scoring";
import type { Player } from "@/lib/types";

type ScoreHistoryCardProps = {
  player: Player;
};

export function ScoreHistoryCard({ player }: ScoreHistoryCardProps) {
  const { logs } = useLogs();
  const { scoringRulesMap } = useTournament();

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
