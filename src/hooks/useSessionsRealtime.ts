import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTournament } from "@/context/TournamentContext";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useSessionsRealtime() {
  const { tournamentId } = useTournament();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tournamentId) return;

    const channel = supabase
      .channel(`sessions:${tournamentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["sessions", tournamentId],
          }),
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [tournamentId, queryClient]);
}
