"use client";

import { createContext, type ReactNode, use } from "react";
import { useSessions } from "@/hooks/sessions/useSessions";

const SessionContext = createContext<string | undefined>(undefined);

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const { sessions } = useSessions();

  const currentSession = sessions.at(-1);
  const sessionId = currentSession?.id;

  if (!sessionId) {
    throw new Error("Invalid State: The current tournament has no sessions.");
  }

  return <SessionContext value={sessionId}>{children}</SessionContext>;
}

export function useSessionContext(): string {
  const sessionId = use(SessionContext);

  if (!sessionId) {
    throw new Error(
      "useSessionContext must be used within <SessionProvider/>!",
    );
  }

  return sessionId;
}
