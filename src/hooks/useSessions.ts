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

export function useSessions(): UseSessionsType {
  const { tournamentId } = useTournament();

  const queryKey = ["sessions", tournamentId];
  const query = useQuery({
    queryKey,
    queryFn: () => fetchSessions(tournamentId),
    enabled: !!tournamentId,
    select: (sessions) => {
      const currentSession = sessions.at(-1);

      if (!currentSession) {
        throw new Error("Tournament has no sessions.");
      }

      const sessionMap = Object.fromEntries(
        sessions.map((session) => [session.id, session]),
      );

      return { sessions, currentSession, sessionMap };
    },
  });

  return {
    currentSession: query.data?.currentSession ?? ({} as Session),
    sessionMap: query.data?.sessionMap ?? {},
    sessions: query.data?.sessions ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

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
