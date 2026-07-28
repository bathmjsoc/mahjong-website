"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { useSessions } from "@/hooks/sessions/useSessions";

type SessionContextValue = {
  sessionId: string;
};

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export function SessionProvider({ children }: PropsWithChildren) {
  const { sessions } = useSessions();
  const latestSession = sessions.at(-1);

  const value = useMemo(
    () => ({ sessionId: latestSession?.id ?? "" }),
    [latestSession?.id],
  );

  if (!latestSession) {
    throw new Error("No sessions found!");
  }

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSessionContext must be used within SessionProvider!");
  }

  return value;
}
