import { LineGraph } from "@/elements/LineGraph";
import { useLogs } from "@/hooks/logs/useLogs";
import { useTournaments } from "@/hooks/useTournaments";
import { getPointHistory } from "@/lib/scores";
import { useTournamentContext } from "@/providers/TournamentProvider";
import type { Player } from "@/types/app.types";

type PlayerAnalyticsProps = {
  player: Player;
};

export function PlayerAnalytics({ player }: PlayerAnalyticsProps) {
  const { enabledLogs } = useLogs();
  const { tournamentId } = useTournamentContext();
  const { tournamentsMap } = useTournaments();

  const tournament = tournamentsMap[tournamentId];
  const scores = getPointHistory(
    enabledLogs,
    player,
    tournament?.scoring_rules,
  );

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
