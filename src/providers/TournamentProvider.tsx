"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useRealtimeTournamentSubscriptions } from "@/hooks/useRealtimeSubscriptions";

const TournamentContext = createContext<string | undefined>(undefined);

type TournamentProviderProps = {
  tournamentId: string;
  children: ReactNode;
};

export function TournamentProvider({
  tournamentId,
  children,
}: TournamentProviderProps) {
  useRealtimeTournamentSubscriptions(tournamentId);

  return <TournamentContext value={tournamentId}>{children}</TournamentContext>;
}

export function useTournamentContext(): string {
  const context = useContext(TournamentContext);

  if (!context) {
    throw new Error(
      "useTournamentContext must be used within a <TournamentProvider/>!",
    );
  }

  return context;
}
