"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchAttendance } from "@/actions/attendance";
import { fetchLogs } from "@/actions/logs";
import { fetchPlayers } from "@/actions/players";
import { fetchSessions } from "@/actions/sessions";
import { fetchTables } from "@/actions/tables";
import { createClient } from "@/lib/supabase/browser";
import type {
  Attendance,
  Log,
  LogEntry,
  Player,
  Session,
  Table,
} from "@/lib/types";

type TournamentContextType = {
  availablePlayers: Player[];
  availableTables: Table[];
  currentSession: Session;
  duplicatePlayerIds: Set<string>;
  lockedPlayerIds: Set<string>;
  logs: Log[];
  playerMap: Map<string, Player>;
  players: Player[];
  registeredPlayers: Player[];
  sessions: Session[];
  tables: Table[];
  tournamentId: string;
  unseatedPlayerIds: Set<string>;
};

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined,
);

type TournamentProviderProps = {
  children: ReactNode;
  tournamentId: string;
};

export function TournamentProvider({
  children,
  tournamentId,
}: TournamentProviderProps) {
  const supabase = createClient();

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  // The current session is the last one in sessions
  const currentSession = useMemo(() => {
    return sessions[sessions.length - 1];
  }, [sessions]);

  const playerMap = useMemo(() => {
    return new Map(players.map((player) => [player.id, player]));
  }, [players]);

  const sessionMap = useMemo(() => {
    return new Map(sessions.map((session) => [session.id, session]));
  }, [sessions]);

  const { availableTables, duplicatePlayerIds, seatedPlayerIds } =
    useMemo(() => {
      const availableTables: Table[] = [];
      const duplicatePlayerIds = new Set<string>();
      const seatedPlayerIds = new Set<string>();

      for (const table of tables) {
        if (table.saved) continue;

        availableTables.push(table);

        const seats = [
          table.east_id,
          table.south_id,
          table.west_id,
          table.north_id,
        ];

        for (const id of seats) {
          if (!id) continue;

          if (seatedPlayerIds.has(id)) {
            duplicatePlayerIds.add(id);
          } else {
            seatedPlayerIds.add(id);
          }
        }
      }

      return { availableTables, seatedPlayerIds, duplicatePlayerIds };
    }, [tables]);

  const {
    availablePlayers,
    registeredPlayers,
    lockedPlayerIds,
    unseatedPlayerIds,
  } = useMemo(() => {
    const availablePlayers: Player[] = [];
    const registeredPlayers: Player[] = [];
    const lockedPlayerIds = new Set<string>();
    const unseatedPlayerIds = new Set<string>();

    for (const entry of attendance) {
      if (entry.session_id !== currentSession.id || !entry.registered) continue;

      const player = playerMap.get(entry.player_id);
      if (!player) continue;

      registeredPlayers.push(player);

      if (entry.locked) {
        lockedPlayerIds.add(player.id);
      } else {
        availablePlayers.push(player);

        if (!seatedPlayerIds.has(player.id)) {
          unseatedPlayerIds.add(player.id);
        }
      }
    }

    return {
      registeredPlayers,
      lockedPlayerIds,
      availablePlayers,
      unseatedPlayerIds,
    };
  }, [attendance, currentSession, playerMap, seatedPlayerIds]);

  const logs = useMemo(() => {
    return logEntries.map((entry) => {
      const session_number = sessionMap.get(entry.session_id)?.number ?? 0;
      const winners: Player[] = [];
      const losers: Player[] = [];

      for (const participant of entry.log_participants) {
        const player = playerMap.get(participant.player_id);
        if (!player) continue;

        if (participant.role === "winner") winners.push(player);
        if (participant.role === "loser") losers.push(player);
      }

      return { ...entry, session_number, winners, losers };
    });
  }, [logEntries, playerMap, sessionMap]);

  useEffect(() => {
    fetchPlayers(tournamentId).then(setPlayers);
    fetchSessions(tournamentId).then(setSessions);
  }, [tournamentId]);

  useEffect(() => {
    if (!currentSession) return;
    fetchAttendance(currentSession).then(setAttendance);
    fetchTables(currentSession).then(setTables);
  }, [currentSession]);

  useEffect(() => {
    if (!sessions.length) return;
    fetchLogs(sessions).then(setLogEntries);
  }, [sessions]);

  useEffect(() => {
    if (!currentSession) return;

    const channel = supabase
      .channel(`tournament:${tournamentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () => fetchAttendance(currentSession).then(setAttendance),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "log_entries",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () => fetchLogs([currentSession]).then(setLogEntries),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => {
          fetchPlayers(tournamentId).then(setPlayers);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => fetchSessions(tournamentId).then(setSessions),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () => fetchTables(currentSession).then(setTables),
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSession, supabase, tournamentId]);

  return (
    <TournamentContext.Provider
      value={{
        availablePlayers,
        availableTables,
        currentSession,
        duplicatePlayerIds,
        lockedPlayerIds,
        logs,
        playerMap,
        players,
        registeredPlayers,
        sessions,
        tables,
        tournamentId,
        unseatedPlayerIds,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context)
    throw new Error("useTournament must be used within TournamentProvider!");
  return context;
};
