import { SunburstChart } from "@/elements/charts/SunburstChart";
import { useLogs } from "@/hooks/logs/useLogs";
import { getGameResults } from "@/lib/scoring";
import type { Player } from "@/lib/types";

type GameOutcomesCardProps = {
  player: Player;
};

export function GameOutcomesCard({ player }: GameOutcomesCardProps) {
  const { enabledLogs } = useLogs();

  const gameResults = getGameResults(enabledLogs, player);
  const gameResultsData = [
    {
      title: "WINS",
      data: gameResults.wins,
      color: "var(--color-positive)",
    },
    {
      title: "LOSSES",
      data: gameResults.losses,
      color: "var(--color-negative)",
    },
    {
      title: "OTHERS",
      data: gameResults.others,
      color: "var(--color-info)",
    },
  ];

  return (
    <div className="h-85 w-100">
      <SunburstChart data={gameResultsData} title="GAME OUTCOMES" />
    </div>
  );
}
