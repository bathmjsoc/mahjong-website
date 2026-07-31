"use client";

import { createContext, type PropsWithChildren, useContext } from "react";
import { useSessions } from "@/hooks/sessions/useSessions";
import { useRealtimeSessionSubscriptions } from "@/hooks/useRealtimeSubscriptions";

const SessionContext = createContext<string | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const { sessions } = useSessions();
  const latestSession = sessions.at(-1);

  useRealtimeSessionSubscriptions(latestSession?.id);

  if (!latestSession) {
    return null;
  }

  return <SessionContext value={latestSession.id}>{children}</SessionContext>;
}

export function useSessionContext() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSessionContext must be used within SessionProvider!");
  }

  return value;
}
