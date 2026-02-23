"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchLogs } from "@/actions/logs";
import { fetchPlayers } from "@/actions/players";
import { fetchSessions } from "@/actions/sessions";
import { fetchTables } from "@/actions/tables";
import { supabaseBrowser } from "@/lib/supabase_client";
import type { Attendance, Log, Player, Session, Table } from "@/lib/types";
import { fetchAttendance } from "@/actions/attendance";

type TournamentContextType = {
  tournamentId: string;
  attendance: Attendance[];
  players: Player[];
  registeredPlayers: Player[];
  duplicatePlayerIds: Set<string>;
  lockedPlayerIds: Set<string>;
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

  const currentSession = useMemo(
    () => sessions[sessions.length - 1],
    [sessions],
  );

  const registeredPlayers = useMemo(() => {
    const registeredIds = new Set(
      attendance
        .filter((a) => a.session_id === currentSession.id && a.registered)
        .map((a) => a.player_id),
    );

    return players.filter((p) => registeredIds.has(p.id));
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

    const ids = tables.flatMap((table) => [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ]);

    for (const id of ids) {
      if (!id) continue;
      if (seen.has(id)) {
        duplicates.add(id);
      } else {
        seen.add(id);
      }
    }

    return duplicates;
  }, [tables]);

  useEffect(() => {
    fetchPlayers(tournamentId).then(setPlayers);
    fetchLogs(tournamentId).then(setLogs);
    fetchSessions(tournamentId).then(setSessions);
    fetchTables(tournamentId).then(setTables);
  }, [tournamentId]);

  useEffect(() => {
    if (currentSession) {
      fetchAttendance(currentSession).then(setAttendance);
    }
  }, [currentSession]);

  useEffect(() => {
    const channel = supabase
      .channel(`tournament_${tournamentId}`)
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
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => fetchTables(tournamentId).then(setTables),
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
      supabase.removeChannel(channel).then();
    };
  }, [tournamentId, currentSession, supabase]);

  return (
    <TournamentContext.Provider
      value={{
        tournamentId,
        attendance,
        players,
        registeredPlayers,
        duplicatePlayerIds,
        lockedPlayerIds,
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
    throw new Error("useTournament must be used within TournamentProvider");
  return context;
};
