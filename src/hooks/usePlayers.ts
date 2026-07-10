"use client";

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

const supabase = createClient();

export function usePlayers(): UsePlayersType {
  const { tournamentId } = useTournament();

  const queryClient = useQueryClient();
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
        () => queryClient.invalidateQueries({ queryKey }),
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [tournamentId, queryClient, queryKey]);

  return {
    playerMap: query.data?.playerMap ?? {},
    players: query.data?.players ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
