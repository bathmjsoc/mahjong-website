"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchSessions } from "@/actions/sessions";
import { useTournament } from "@/context/TournamentContext";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@/lib/types";

type UseSessionsType = {
  currentSession: Session;
  sessionMap: Record<string, Session>;
  sessions: Session[];
  isLoading: boolean;
  isError: boolean;
};

const supabase = createClient();

export function useSessions(): UseSessionsType {
  const { tournamentId } = useTournament();

  const queryClient = useQueryClient();
  const queryKey = ["sessions", tournamentId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchSessions(tournamentId),
    enabled: !!tournamentId,
    select: (fetchedSessions) => {
      const currentSession = fetchedSessions[fetchedSessions.length - 1];

      const sessionMap = Object.fromEntries(
        fetchedSessions.map((session) => [session.id, session]),
      );

      return { sessions: fetchedSessions, currentSession, sessionMap };
    },
  });

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
        () => queryClient.invalidateQueries({ queryKey }),
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [tournamentId, queryClient, queryKey]);

  return {
    currentSession: query.data?.currentSession!,
    sessionMap: query.data?.sessionMap ?? {},
    sessions: query.data?.sessions ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
