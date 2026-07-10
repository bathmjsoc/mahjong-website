import { useQuery } from "@tanstack/react-query";
import { fetchSessions } from "@/actions/sessions";
import { useTournament } from "@/context/TournamentContext";
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
