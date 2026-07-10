import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTournament } from "@/context/TournamentContext";
import { createClient } from "@/lib/supabase/client";

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
