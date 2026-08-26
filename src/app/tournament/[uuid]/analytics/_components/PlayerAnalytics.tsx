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
      color: "var(--color-positive)",
    },
    {
      title: "Losses",
      data: gameResults.losses,
      color: "var(--color-negative)",
    },
    {
      title: "Others",
      data: gameResults.others,
      color: "var(--color-info)",
    },
  ];

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-1">
        <div className="rounded-xl bg-primary p-1 text-center text-secondary text-sm">
          Score History
        </div>
        <LineChart data={scoreData} className="h-90 w-160" />
      </div>

      <div className="flex flex-col gap-1">
        <div className="rounded-xl bg-primary p-1 text-center text-secondary text-sm">
          Game Outcomes
        </div>
        <SunburstChart data={gameResultsData} className="size-90" />
      </div>
    </div>
  );
}
