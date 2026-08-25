import { LineChart } from "@/elements/LineChart";
import { SunburstChart } from "@/elements/SunburstChart";
import { useLogs } from "@/hooks/logs/useLogs";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { getGameResults, getPointHistory } from "@/lib/scoring";
import type { Player } from "@/lib/types";

type PlayerAnalyticsProps = {
  player: Player;
};

export function PlayerAnalytics({ player }: PlayerAnalyticsProps) {
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

  const gameResults = getGameResults(enabledLogs, player);
  const gameResultsData = [
    {
      title: "Wins",
      data: gameResults.wins,
    },
    {
      title: "Losses",
      data: gameResults.losses,
    },
    {
      title: "Others",
      data: gameResults.others,
    },
  ];

  return (
    <div className="flex gap-5">
      <LineChart data={scoreData} className="h-100 w-150" />
      <SunburstChart data={gameResultsData} className="size-100" />
    </div>
  );
}
