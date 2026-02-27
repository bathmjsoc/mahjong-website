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

  const { availableTables, seatedPlayerIds, duplicatePlayerIds } =
    useMemo(() => {
      const seatedPlayerIds = new Set<string>();
      const duplicatePlayerIds = new Set<string>();

      for (const table of tables) {
        if (table.saved) continue;

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

      const availableTables = tables.filter((table) => !table.saved);

      return { seatedPlayerIds, duplicatePlayerIds, availableTables };
    }, [tables]);

  const {
    availablePlayers,
    registeredPlayers,
    lockedPlayerIds,
    unseatedPlayerIds,
  } = useMemo(() => {
    const registeredPlayers: Player[] = [];
    const lockedPlayerIds = new Set<string>();
    const unseatedPlayerIds = new Set<string>();

    for (const entry of attendance) {
      if (entry.session_id !== currentSession.id) continue;

      const player = playerMap.get(entry.player_id);
      if (!player || !entry.registered) continue;

      registeredPlayers.push(player);

      if (entry.locked) {
        lockedPlayerIds.add(player.id);
      } else if (!entry.locked && !seatedPlayerIds.has(player.id)) {
        unseatedPlayerIds.add(player.id);
      }
    }

    const availablePlayers = registeredPlayers.filter(
      (player) => !lockedPlayerIds.has(player.id),
    );

    return {
      registeredPlayers,
      lockedPlayerIds,
      unseatedPlayerIds,
      availablePlayers,
    };
  }, [attendance, currentSession, playerMap, seatedPlayerIds]);

  const logs = useMemo(() => {
    return logEntries.map((entry) => {
      const winners: Player[] = [];
      const losers: Player[] = [];

      for (const participant of entry.log_participants) {
        const player = playerMap.get(participant.player_id);
        if (!player) continue;

        if (participant.role === "winner") winners.push(player);
        if (participant.role === "loser") losers.push(player);
      }

      return { ...entry, winners, losers };
    });
  }, [logEntries, playerMap]);

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
    if (!sessions) return;
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
