import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPlayers } from "@/actions/players";
import { useTournament } from "@/context/TournamentContext";
import { createClient } from "@/lib/supabase/client";
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

const supabase = createClient();
export function usePlayersRealtime() {
  const { tournamentId } = useTournament();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tournamentId) return;

    const channel = supabase
      .channel(`players:${tournamentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["players", tournamentId],
          }),
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [tournamentId, queryClient]);
}
