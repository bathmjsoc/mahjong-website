"use client";

import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { useRealtimeSubscriptions } from "@/hooks/useRealtimeSubscriptions";

type TournamentContextValue = {
  tournamentId: string;
};

const TournamentContext = createContext<TournamentContextValue | undefined>(
  undefined,
);

function TournamentRealtime({ children }: PropsWithChildren) {
  useRealtimeSubscriptions();
  return children;
}

type TournamentProviderProps = {
  tournamentId: string;
  children: ReactNode;
};

export function TournamentProvider({
  tournamentId,
  children,
}: TournamentProviderProps) {
  const value = useMemo(() => ({ tournamentId }), [tournamentId]);

  return (
    <TournamentContext.Provider value={value}>
      <TournamentRealtime>{children}</TournamentRealtime>
    </TournamentContext.Provider>
  );
}

export function useTournamentContext() {
  const value = useContext(TournamentContext);

  if (!value) {
    throw new Error(
      "useTournamentContext must be used within TournamentProvider!",
    );
  }

  return value;
}
