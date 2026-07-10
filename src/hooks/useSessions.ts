"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
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
  const queryKey = useMemo(() => ["sessions", tournamentId], [tournamentId]);

  const query = useQuery({
    queryKey,
    queryFn: () => fetchSessions(tournamentId),
    enabled: !!tournamentId,
    select: (sessions) => {
      const currentSession = sessions[sessions.length - 1];

      const sessionMap = Object.fromEntries(
        sessions.map((session) => [session.id, session]),
      );

      return { sessions, currentSession, sessionMap };
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
