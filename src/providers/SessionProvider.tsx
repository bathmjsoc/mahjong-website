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

  const latestSession = sessions.at(-1);
  if (!latestSession) {
    throw new Error("No session was found, but one should exist.");
  }

  useRealtimeSessionSubscriptions(latestSession.id);

  return <SessionContext value={latestSession.id}>{children}</SessionContext>;
}

export function useSessionContext(): string {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      "useSessionContext must be used within a <SessionProvider/>!",
    );
  }

  return context;
}
