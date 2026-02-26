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
import { fetchPlayers } from "@/actions/players";
import { fetchSessions } from "@/actions/sessions";
import { fetchTables } from "@/actions/tables";
import { createClient } from "@/lib/supabase/browser";
import type { Attendance, Player, Session, Table } from "@/lib/types";

type TournamentContextType = {
  tournamentId: string;
  players: Player[];
  registeredPlayers: Player[];
  lockedPlayerIds: Set<string>;
  duplicatePlayerIds: Set<string>;
  unseatedPlayerIds: Set<string>;
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
  const supabase = createClient();

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  // The current session is the last one in sessions
  const currentSession = sessions[sessions.length - 1];

  const playerMap = useMemo(() => {
    return new Map(players.map((player) => [player.id, player]));
  }, [players]);

  const { seatedPlayerIds, duplicatePlayerIds } = useMemo(() => {
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
        } else seatedPlayerIds.add(id);
      }
    }

    return { seatedPlayerIds, duplicatePlayerIds };
  }, [tables]);

  const { registeredPlayers, lockedPlayerIds, unseatedPlayerIds } =
    useMemo(() => {
      const registeredPlayers: Player[] = [];
      const lockedPlayerIds = new Set<string>();
      const unseatedPlayerIds = new Set<string>();

      const currentSessionAttendance = attendance.filter(
        (entry) => entry.session_id === currentSession.id,
      );

      for (const entry of currentSessionAttendance) {
        const player = playerMap.get(entry.player_id);
        if (!player) continue;

        // Collect players who are registered
        if (entry.registered) {
          registeredPlayers.push(player);

          // Collect players who are not locked and not seated
          if (!entry.locked && !seatedPlayerIds.has(player.id)) {
            unseatedPlayerIds.add(player.id);
          }
        }

        // Collect players who are locked
        if (entry.locked) {
          lockedPlayerIds.add(player.id);
        }
      }

      return { registeredPlayers, lockedPlayerIds, unseatedPlayerIds };
    }, [attendance, currentSession, playerMap, seatedPlayerIds]);

  useEffect(() => {
    fetchPlayers(tournamentId).then(setPlayers);
    fetchSessions(tournamentId).then(setSessions);
  }, [tournamentId]);

  useEffect(() => {
    if (currentSession) {
      fetchAttendance(currentSession).then(setAttendance);
      fetchTables(currentSession).then(setTables);
    }
  }, [currentSession]);

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
          filter: `session_id=eq.${currentSession.id}`,
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
        players,
        registeredPlayers,
        lockedPlayerIds,
        duplicatePlayerIds,
        unseatedPlayerIds,
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
