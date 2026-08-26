import { SunburstChart } from "@/elements/SunburstChart";
import { useLogs } from "@/hooks/logs/useLogs";
import { getGameResults } from "@/lib/scoring";
import type { Player } from "@/lib/types";
import { AnalyticsCard } from "./PlayerAnalytics";

type GameResultsCardProps = {
  player: Player;
};

export function GameResultsCard({ player }: GameResultsCardProps) {
  const { enabledLogs } = useLogs();

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
    <AnalyticsCard title="Game Outcomes">
      <SunburstChart data={gameResultsData} className="size-90" />
    </AnalyticsCard>
  );
}
