"use client";

import { createContext, type ReactNode, useContext } from "react";

const TournamentContext = createContext<string | undefined>(undefined);

type TournamentProviderProps = {
  tournamentId: string;
  children: ReactNode;
};

export function TournamentProvider({
  tournamentId,
  children,
}: TournamentProviderProps) {
  return <TournamentContext value={tournamentId}>{children}</TournamentContext>;
}

export function useTournamentContext(): string {
  const tournamentId = useContext(TournamentContext);

  if (!tournamentId) {
    throw new Error(
      "useTournamentContext must be used within a <TournamentProvider/>!",
    );
  }

  return tournamentId;
}
