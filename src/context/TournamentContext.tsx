"use client";

import { createContext, type ReactNode, useContext } from "react";
import { AttendanceProvider } from "@/context/AttendanceContext";
import { LogsProvider } from "@/context/LogContext";
import { PlayersProvider } from "@/context/PlayerContext";
import { SessionsProvider } from "@/context/SessionContext";
import { TablesProvider } from "@/context/TableContext";

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
      <PlayersProvider>
        <SessionsProvider>
          <LogsProvider>
            <TablesProvider>
              <AttendanceProvider>{children}</AttendanceProvider>
            </TablesProvider>
          </LogsProvider>
        </SessionsProvider>
      </PlayersProvider>
    </TournamentContext.Provider>
  );
}

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context)
    throw new Error("useTournament must be used within TournamentProvider!");
  return context;
};
