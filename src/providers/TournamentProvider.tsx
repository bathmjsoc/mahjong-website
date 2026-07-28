"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useRelatimeTournamentSubscriptions } from "@/hooks/useRealtimeSubscriptions";

const TournamentContext = createContext<string | undefined>(undefined);

type TournamentProviderProps = {
  tournamentId: string;
  children: ReactNode;
};

export function TournamentProvider({
  tournamentId,
  children,
}: TournamentProviderProps) {
  useRelatimeTournamentSubscriptions(tournamentId);

  return (
    <TournamentContext.Provider value={tournamentId}>
      {children}
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
