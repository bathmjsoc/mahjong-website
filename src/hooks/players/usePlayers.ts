import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { createClient } from "@/lib/supabase/client";
import type { Player, Tournament } from "@/lib/types";

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

async function fetchPlayers(tournament: Tournament): Promise<Player[]> {
  const supabase = createClient();

  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .eq("tournament_id", tournament.id);

  if (error)
    throw new Error(`fetchPlayers encountered an error: ${error.message}`);

  return players ?? [];
}
