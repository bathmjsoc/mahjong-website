import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchPlayers } from "@/actions/players";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import type { Player } from "@/lib/types";

type UsePlayersType = {
  playerMap: Record<string, Player>;
  players: Player[];
};

export function usePlayers(): UsePlayersType {
  const { currentTournament } = useTournaments();

  const selectPlayers = useCallback((rawPlayers: Player[]) => {
    const players = [...rawPlayers].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const playerMap = Object.fromEntries(
      players.map((player) => [player.id, player]),
    );

    return { players, playerMap };
  }, []);

  const query = useSuspenseQuery({
    queryKey: ["players", currentTournament?.id],
    queryFn: () => {
      if (!currentTournament) return [];
      return fetchPlayers(currentTournament);
    },
    select: selectPlayers,
  });

  return {
    playerMap: query.data.playerMap,
    players: query.data.players,
  };
}
