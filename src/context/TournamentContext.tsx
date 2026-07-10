"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useAttendanceRealtime } from "@/hooks/useAttendanceRealtime";
import { useLogsRealtime } from "@/hooks/useLogsRealtime";
import { usePlayersRealtime } from "@/hooks/usePlayersRealtime";
import { useSessionsRealtime } from "@/hooks/useSessionsRealtime";
import { useTablesRealtime } from "@/hooks/useTablesRealtime";

type TournamentContextType = {
  tournamentId: string;
};

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined,
);

function TournamentRealtime({ children }: { children: ReactNode }) {
  useAttendanceRealtime();
  useLogsRealtime();
  usePlayersRealtime();
  useSessionsRealtime();
  useTablesRealtime();

  return children;
}

export function TournamentProvider({
  tournamentId,
  children,
}: {
  tournamentId: string;
  children: ReactNode;
}) {
  return (
    <TournamentContext.Provider value={{ tournamentId }}>
      <TournamentRealtime>{children}</TournamentRealtime>
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context)
    throw new Error("useTournament must be used within TournamentProvider!");
  return context;
}
