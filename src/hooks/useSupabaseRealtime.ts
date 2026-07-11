import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTournament } from "@/context/TournamentContext";
import { useSessions } from "@/hooks/useSessions";
import { createClient } from "@/lib/supabase/client";

export function useSupabaseRealtime() {
  const { tournamentId } = useTournament();
  const { currentSession } = useSessions();

  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`tournament:${tournamentId}`);

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "logs",
        filter: `tournament_id=eq.${tournamentId}`,
      },
      () => queryClient.invalidateQueries({ queryKey: ["logs", tournamentId] }),
    );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "players",
        filter: `tournament_id=eq.${tournamentId}`,
      },
      () =>
        queryClient.invalidateQueries({ queryKey: ["players", tournamentId] }),
    );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "sessions",
        filter: `tournament_id=eq.${tournamentId}`,
      },
      () =>
        queryClient.invalidateQueries({ queryKey: ["sessions", tournamentId] }),
    );

    if (currentSession?.id) {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["attendance", currentSession.id],
          }),
      );

      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["tables", currentSession.id],
          }),
      );
    }

    channel.subscribe();

    return () => void supabase.removeChannel(channel);
  }, [tournamentId, currentSession?.id, queryClient]);
}
