"use client";

import { createContext, type ReactNode, useContext } from "react";
import { AttendanceProvider, useAttendance } from "@/context/AttendanceContext";
import { LogsProvider, useLogs } from "@/context/LogContext";
import { PlayersProvider, usePlayers } from "@/context/PlayerContext";
import { SessionsProvider, useSessions } from "@/context/SessionContext";
import { TablesProvider, useTables } from "@/context/TableContext";

type TournamentContextType = {
  tournamentId: string;

  // Attendance
  attendance: ReturnType<typeof useAttendance>["attendance"];
  availablePlayers: ReturnType<typeof useAttendance>["availablePlayers"];
  lockedPlayerIds: ReturnType<typeof useAttendance>["lockedPlayerIds"];
  registeredPlayers: ReturnType<typeof useAttendance>["registeredPlayers"];

  // Logs
  logs: ReturnType<typeof useLogs>["logs"];
  overallScores: ReturnType<typeof useLogs>["overallScores"];
  sessionScores: ReturnType<typeof useLogs>["sessionScores"];

  // Players
  playerMap: ReturnType<typeof usePlayers>["playerMap"];
  players: ReturnType<typeof usePlayers>["players"];

  // Sessions
  currentSession: ReturnType<typeof useSessions>["currentSession"];
  sessionMap: ReturnType<typeof useSessions>["sessionMap"];
  sessions: ReturnType<typeof useSessions>["sessions"];

  // Tables
  availableTables: ReturnType<typeof useTables>["availableTables"];
  duplicatePlayerIds: ReturnType<typeof useTables>["duplicatePlayerIds"];
  seatedPlayerIds: ReturnType<typeof useTables>["seatedPlayerIds"];
  tables: ReturnType<typeof useTables>["tables"];
};

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined,
);

function TournamentConsumer({
  tournamentId,
  children,
}: {
  tournamentId: string;
  children: ReactNode;
}) {
  const attendance = useAttendance();
  const logs = useLogs();
  const players = usePlayers();
  const sessions = useSessions();
  const tables = useTables();

  return (
    <TournamentContext.Provider
      value={{
        tournamentId,

        // Attendance
        attendance: attendance.attendance,
        availablePlayers: attendance.availablePlayers,
        lockedPlayerIds: attendance.lockedPlayerIds,
        registeredPlayers: attendance.registeredPlayers,

        // Logs
        logs: logs.logs,
        overallScores: logs.overallScores,
        sessionScores: logs.sessionScores,

        // Players
        playerMap: players.playerMap,
        players: players.players,

        // Sessions
        currentSession: sessions.currentSession,
        sessionMap: sessions.sessionMap,
        sessions: sessions.sessions,

        // Tables
        availableTables: tables.availableTables,
        duplicatePlayerIds: tables.duplicatePlayerIds,
        seatedPlayerIds: tables.seatedPlayerIds,
        tables: tables.tables,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function TournamentProvider({
  tournamentId,
  children,
}: {
  tournamentId: string;
  children: ReactNode;
}) {
  return (
    <PlayersProvider tournamentId={tournamentId}>
      <SessionsProvider tournamentId={tournamentId}>
        <LogsProvider>
          <TablesProvider>
            <AttendanceProvider>
              <TournamentConsumer tournamentId={tournamentId}>
                {children}
              </TournamentConsumer>
            </AttendanceProvider>
          </TablesProvider>
        </LogsProvider>
      </SessionsProvider>
    </PlayersProvider>
  );
}

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context)
    throw new Error("useTournament must be used within TournamentProvider!");
  return context;
};
