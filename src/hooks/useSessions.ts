import { useQuery } from "@tanstack/react-query";
import { fetchSessions } from "@/actions/sessions";
import type { Session } from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseSessionsType = {
  currentSession: Session | null;
  sessionMap: Record<string, Session>;
  sessions: Session[];
  isLoading: boolean;
  isError: boolean;
};

export function useSessions(): UseSessionsType {
  const { tournamentId } = useTournamentContext();

  const queryKey = ["sessions", tournamentId];
  const query = useQuery({
    queryKey,
    queryFn: () => fetchSessions(tournamentId),
    enabled: !!tournamentId,
    select: (sessions) => {
      sessions.sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      );

      const currentSession = sessions.at(-1) ?? null;

      const sessionMap = Object.fromEntries(
        sessions.map((session) => [session.id, session]),
      );

      return { sessions, currentSession, sessionMap };
    },
  });

  return {
    currentSession: query.data?.currentSession ?? null,
    sessionMap: query.data?.sessionMap ?? {},
    sessions: query.data?.sessions ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
