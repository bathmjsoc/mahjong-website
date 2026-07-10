"use client";

import { createContext, type ReactNode, useContext } from "react";

type TournamentContextType = {
  tournamentId: string;
};

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined,
);

export function TournamentProvider({
  tournamentId,
  children,
}: {
  tournamentId: string;
  children: ReactNode;
}) {
  return (
    <TournamentContext.Provider value={{ tournamentId }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context)
    throw new Error("useTournament must be used within TournamentProvider!");
  return context;
}
