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
import type { Log, Player, Session, Table } from "@/lib/types";

type TournamentContextType = {
  tournamentId: string;
  players: Player[];
  registeredPlayers: Player[];
  duplicatePlayers: Set<string>;
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

  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    fetchPlayers(tournamentId).then(setPlayers);
    fetchLogs(tournamentId).then(setLogs);
    fetchSessions(tournamentId).then(setSessions);
    fetchTables(tournamentId).then(setTables);

    const channel = supabase
      .channel(`tournament_${tournamentId}`)
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
  }, [tournamentId, supabase]);

  const currentSession = useMemo(
    () => sessions[sessions.length - 1],
    [sessions],
  );

  const registeredPlayers = useMemo(
    () => players.filter((player) => player.registered),
    [players],
  );

  const duplicatePlayers = useMemo(() => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const table of tables) {
      const ids = [
        table.east_id,
        table.south_id,
        table.west_id,
        table.north_id,
      ];

      for (const id of ids) {
        if (seen.has(id)) {
          duplicates.add(id);
        } else {
          seen.add(id);
        }
      }
    }

    return duplicates;
  }, [tables]);

  return (
    <TournamentContext.Provider
      value={{
        tournamentId,
        players,
        registeredPlayers,
        duplicatePlayers,
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
