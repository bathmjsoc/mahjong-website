"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useSessions } from "@/hooks/sessions/useSessions";
import { useRealtimeSessionSubscriptions } from "@/hooks/useRealtimeSubscriptions";

const SessionContext = createContext<string | undefined>(undefined);

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const { sessions } = useSessions();

  const sessionId = sessions.at(-1)?.id;
  if (!sessionId) {
    throw new Error("No session was found, but one should exist.");
  }

  useRealtimeSessionSubscriptions(latestSession.id);

  return <SessionContext value={sessionId}>{children}</SessionContext>;
}

export function useSessionContext(): string {
  const sessionId = useContext(SessionContext);

  if (!sessionId) {
    throw new Error(
      "useSessionContext must be used within a <SessionProvider/>!",
    );
  }

  return sessionId;
}
