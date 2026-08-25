import { LineChart } from "@/elements/LineChart";
import { useLogs } from "@/hooks/logs/useLogs";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { getPointHistory } from "@/lib/scoring";
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


  return (
    <div className="flex w-2xl flex-col">
      <LineChart data={scoreData} />
      <SunburstChart data={gameResultsData} />
    </div>
  );
}
