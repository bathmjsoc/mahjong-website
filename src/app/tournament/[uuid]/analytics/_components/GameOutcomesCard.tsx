import { SunburstChart } from "@/elements/charts/SunburstChart";
import { getGameResults } from "@/lib/scoring";
import type { Log, Player } from "@/lib/types";

type GameOutcomesCardProps = {
  logs: Log[];
  player: Player;
};

export function GameOutcomesCard({ logs, player }: GameOutcomesCardProps) {
  const gameResults = getGameResults(logs, player);
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
    <div className="h-90 w-100">
      <SunburstChart data={gameResultsData} title="GAME OUTCOMES" />
    </div>
  );
}
