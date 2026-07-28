import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Player } from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UsePlayersType = {
  playerMap: Record<string, Player>;
  players: Player[];
};

export function usePlayers(): UsePlayersType {
  const tournamentId = useTournamentContext();

  const query = useSuspenseQuery({
    queryKey: ["players", tournamentId],
    queryFn: () => fetchPlayers(tournamentId),
    select: selectPlayers,
  });

  return query.data;
}

function selectPlayers(rawPlayers: Player[]): UsePlayersType {
  const players = rawPlayers.toSorted((a, b) => a.name.localeCompare(b.name));

  const playerMap = Object.fromEntries(
    players.map((player) => [player.id, player]),
  );

  return { players, playerMap };
}

async function fetchPlayers(tournamentId: string): Promise<Player[]> {
  const supabase = createClient();

  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .eq("tournament_id", tournamentId);

  if (error)
    throw new Error(`fetchPlayers encountered an error: ${error.message}`);

  return players;
}
