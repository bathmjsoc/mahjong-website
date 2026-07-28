"use client";

import { createContext, type PropsWithChildren, useContext } from "react";
import { useSessions } from "@/hooks/sessions/useSessions";
import { useRelatimeSessionSubscriptions } from "@/hooks/useRealtimeSubscriptions";

const SessionContext = createContext<string | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const { sessions } = useSessions();
  const latestSession = sessions.at(-1);

  if (!latestSession) {
    throw new Error("No sessions found!");
  }

  useRelatimeSessionSubscriptions(latestSession.id);

  return <SessionContext value={latestSession.id}>{children}</SessionContext>;
}

export function useSessionContext() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSessionContext must be used within SessionProvider!");
  }

  return value;
}
