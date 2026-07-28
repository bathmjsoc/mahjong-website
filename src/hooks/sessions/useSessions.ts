import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseSessionsType = {
  sessionMap: Record<string, Session>;
  sessions: Session[];
};

export function useSessions(): UseSessionsType {
  const tournamentId = useTournamentContext();

  const query = useSuspenseQuery({
    queryKey: ["sessions", tournamentId],
    queryFn: () => fetchSessions(tournamentId),
    select: selectSessions,
  });

  return query.data;
}

function selectSessions(rawSessions: Session[]): UseSessionsType {
  const sessions = rawSessions.toSorted(
    (a, b) => Date.parse(a.start_date) - Date.parse(b.start_date),
  );

  const sessionMap = Object.fromEntries(
    sessions.map((session) => [session.id, session]),
  );

  return { sessions, sessionMap };
}

async function fetchSessions(tournamentId: string): Promise<Session[]> {
  const supabase = createClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("tournament_id", tournamentId);

  if (error)
    throw new Error(`fetchSessions encountered an error: ${error.message}`);

  return sessions;
}
