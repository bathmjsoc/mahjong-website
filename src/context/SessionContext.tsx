"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchSessions } from "@/actions/sessions";
import { useTournament } from "@/context/TournamentContext";
import { createClient } from "@/lib/supabase/browser";
import type { Session } from "@/lib/types";

type SessionsContextType = {
  currentSession: Session;
  sessionMap: Record<string, Session>;
  sessions: Session[];
};

const SessionsContext = createContext<SessionsContextType | undefined>(
  undefined,
);
const supabase = createClient();

export function SessionsProvider({ children }: { children: ReactNode }) {
  const { tournamentId } = useTournament();

  const [sessions, setSessions] = useState<Session[]>([]);

  const currentSession = useMemo(() => {
    return sessions[sessions.length - 1];
  }, [sessions]);

  const sessionMap = useMemo(() => {
    return Object.fromEntries(sessions.map((session) => [session.id, session]));
  }, [sessions]);

  useEffect(() => {
    if (!tournamentId) return;
    fetchSessions(tournamentId).then(setSessions);

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
        () => fetchSessions(tournamentId).then(setSessions),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [tournamentId]);

  return (
    <SessionsContext.Provider value={{ currentSession, sessionMap, sessions }}>
      {children}
    </SessionsContext.Provider>
  );
}

export const useSessions = () => {
  const context = useContext(SessionsContext);
  if (!context)
    throw new Error("useSessions must be used within SessionsProvider!");
  return context;
};
