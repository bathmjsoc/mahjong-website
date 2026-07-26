import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSessions } from "@/hooks/sessions/useSessions";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { createClient } from "@/lib/supabase/client";

export function useSupabaseRealtime() {
  const { currentSession } = useSessions();
  const { currentTournament } = useTournaments();

  const queryClient = useQueryClient();
  
  const sessionId = currentSession?.id;
  const tournamentId = currentTournament?.id;

  useEffect(() => {
    if (!tournamentId) return;

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

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, tournamentId]);

  useEffect(() => {
    if (!sessionId) return;

    const supabase = createClient();
    const channel = supabase.channel(`session:${sessionId}`);

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "attendance",
        filter: `session_id=eq.${sessionId}`,
      },
      () =>
        queryClient.invalidateQueries({
          queryKey: ["attendance", sessionId],
        }),
    );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tables",
        filter: `session_id=eq.${sessionId}`,
      },
      () =>
        queryClient.invalidateQueries({
          queryKey: ["tables", sessionId],
        }),
    );

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, sessionId]);
}
