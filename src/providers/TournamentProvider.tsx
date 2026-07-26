"use client";

import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";

type TournamentContextType = {
  tournamentId: string;
};

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined,
);

function TournamentRealtime({ children }: PropsWithChildren) {
  useSupabaseRealtime();
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
  const context = useContext(TournamentContext);

  if (!context) {
    throw new Error(
      "useTournamentContext must be used within TournamentProvider!",
    );
  }

  return context;
}
