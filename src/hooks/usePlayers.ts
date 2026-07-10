"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPlayers } from "@/actions/players";
import { useTournament } from "@/context/TournamentContext";
import type { Player } from "@/lib/types";

type UsePlayersType = {
  playerMap: Record<string, Player>;
  players: Player[];
  isLoading: boolean;
  isError: boolean;
};

export function usePlayers(): UsePlayersType {
  const { tournamentId } = useTournament();

  const queryKey = ["players", tournamentId];
  const query = useQuery({
    queryKey,
    queryFn: () => fetchPlayers(tournamentId),
    enabled: !!tournamentId,
    select: (players) => {
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
