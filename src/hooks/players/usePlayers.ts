import { useQuery } from "@tanstack/react-query";
import { fetchPlayers } from "@/actions/players";
import { useTournamentContext } from "@/providers/TournamentProvider";
import type { Player } from "@/types/app.types";

type UsePlayersType = {
  playerMap: Record<string, Player>;
  players: Player[];
  isLoading: boolean;
  isError: boolean;
};

export function usePlayers(): UsePlayersType {
  const { tournamentId } = useTournamentContext();

  const query = useQuery({
    queryKey: ["players", tournamentId],
    queryFn: () => fetchPlayers(tournamentId),
    enabled: !!tournamentId,
    select: (players) => {
      players.sort((a, b) => a.name.localeCompare(b.name));

      const playerMap = Object.fromEntries(
        players.map((player) => [player.id, player]),
      );

      return { players, playerMap };
    },
  });

  return {
    playerMap: query.data?.playerMap ?? {},
    players: query.data?.players ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
