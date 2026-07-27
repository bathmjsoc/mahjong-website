import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchSessions } from "@/actions/sessions";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import type { Session } from "@/lib/types";

type UseSessionsType = {
  currentSession: Session | null;
  sessionMap: Record<string, Session>;
  sessions: Session[];
};

export function useSessions(): UseSessionsType {
  const { currentTournament } = useTournaments();

  const selectSessions = useCallback((rawSessions: Session[]) => {
    const sessions = [...rawSessions].sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    );

    const currentSession = sessions.at(-1) ?? null;

    const sessionMap = Object.fromEntries(
      sessions.map((session) => [session.id, session]),
    );

    return { sessions, currentSession, sessionMap };
  }, []);

  const query = useSuspenseQuery({
    queryKey: ["sessions", currentTournament?.id],
    queryFn: () => {
      if (!currentTournament) return [];
      return fetchSessions(currentTournament);
    },
    select: selectSessions,
  });

  return {
    currentSession: query.data.currentSession,
    sessionMap: query.data.sessionMap,
    sessions: query.data.sessions,
  };
}
