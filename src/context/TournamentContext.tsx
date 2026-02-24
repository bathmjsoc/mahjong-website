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
import { supabaseBrowser } from "@/lib/supabase_client";
import type { Attendance, Log, Player, Session, Table } from "@/lib/types";

type TournamentContextType = {
  tournamentId: string;
  attendance: Attendance[];
  players: Player[];
  registeredPlayers: Player[];
  lockedPlayerIds: Set<string>;
  duplicatePlayerIds: Set<string>;
  unseatedPlayerIds: Set<string>;
  logs: Log[];
  sessions: Session[];
  currentSession: Session;
  tables: Table[];
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
  const supabase = supabaseBrowser();

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  // The current session is the last one in sessions
  const currentSession = useMemo(
    () => sessions[sessions.length - 1],
    [sessions],
  );

  const registeredPlayers = useMemo(() => {
    const registeredPlayerIds = new Set(
      attendance
        .filter((a) => a.session_id === currentSession.id && a.registered)
        .map((a) => a.player_id),
    );

    return players.filter((player) => registeredPlayerIds.has(player.id));
  }, [attendance, currentSession, players]);

  const lockedPlayerIds = useMemo(() => {
    return new Set(
      attendance
        .filter((a) => a.session_id === currentSession.id && a.locked)
        .map((a) => a.player_id),
    );
  }, [attendance, currentSession]);

  const duplicatePlayerIds = useMemo(() => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    const ids = tables
      .filter((table) => !table.is_saved)
      .flatMap((table) => [
        table.east_id,
        table.south_id,
        table.west_id,
        table.north_id,
      ]);

    for (const id of ids) {
      if (seen.has(id)) duplicates.add(id);
      else seen.add(id);
    }

    return duplicates;
  }, [tables]);

  const unseatedPlayerIds = useMemo(() => {
    const seatedPlayerIds = new Set(
      tables
        .filter((table) => !table.is_saved)
        .flatMap((table) => [
          table.east_id,
          table.south_id,
          table.west_id,
          table.north_id,
        ]),
    );

    return new Set(
      registeredPlayers
        .filter((player) => !seatedPlayerIds.has(player.id))
        .filter((player) => !lockedPlayerIds.has(player.id))
        .map((player) => player.id),
    );
  }, [tables, registeredPlayers, lockedPlayerIds]);

  useEffect(() => {
    fetchPlayers(tournamentId).then(setPlayers);
    fetchLogs(tournamentId).then(setLogs);
    fetchSessions(tournamentId).then(setSessions);
  }, [tournamentId]);

  useEffect(() => {
    if (currentSession) {
      fetchAttendance(currentSession).then(setAttendance);
      fetchTables(currentSession).then(setTables);
    }
  }, [currentSession]);

  useEffect(() => {
    const channel = supabase
      .channel(`tournament:${tournamentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
        },
        () => fetchAttendance(currentSession).then(setAttendance),
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
          table: "tables",
        },
        () => fetchTables(currentSession).then(setTables),
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId, currentSession, supabase]);

  return (
    <TournamentContext.Provider
      value={{
        tournamentId,
        attendance,
        players,
        registeredPlayers,
        lockedPlayerIds,
        duplicatePlayerIds,
        unseatedPlayerIds,
        logs,
        sessions,
        currentSession,
        tables,
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
