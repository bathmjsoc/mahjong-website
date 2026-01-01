"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  handleDeregisterPlayer,
  handleRegisterPlayer,
  handleSetSeatOccupant,
} from "@/actions/players";
import {
  getActivePlayers,
  sortPlayersAlphabetical,
  sortPlayersDescending,
} from "@/lib/players";
import { sortSessionsNewest } from "@/lib/sessions";
import { sortTablesAscending } from "@/lib/tables";
import type { Log, Player, Session, Table, Wind } from "@/lib/types";

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined,
);

interface TournamentContextType {
  uuid: string;
  sessions: Session[];
  players: Player[];
  tables: Table[];
  logs: Log[];

  selectedSession: Session;
  setSelectedSession: (session: Session) => void;

  sortedSessions: Session[];
  sortedPlayers: Player[];
  rankedPlayers: Player[];
  sortedTables: Table[];

  registerPlayer: (player: Player) => Promise<void>;
  deregisterPlayer: (player: Player) => Promise<void>;
  setSeatOccupant: (
    table: Table,
    wind: Wind,
    player: Player | null,
  ) => Promise<void>;
}

export function TournamentProvider({
  children,
  data,
}: {
  children: ReactNode;
  data: {
    uuid: string;
    players: Player[];
    sessions: Session[];
    tables: Table[];
    logs: Log[];
  };
}) {
  const sortedSessions = useMemo(() => {
    return sortSessionsNewest(data.sessions);
  }, [data.sessions]);

  const [selectedSession, setSelectedSession] = useState(() =>
    data.sessions.length > 1 ? sortedSessions[1] : data.sessions[0],
  );

  const sortedPlayers = useMemo(() => {
    return sortPlayersAlphabetical(data.players);
  }, [data.players]);

  const rankedPlayers = useMemo(() => {
    const sessionPlayers = getActivePlayers(data.players, selectedSession);
    return sortPlayersDescending(sessionPlayers, selectedSession);
  }, [data.players, selectedSession]);

  const sortedTables = useMemo(() => {
    return sortTablesAscending(data.tables);
  }, [data.tables]);

  async function registerPlayer(player: Player) {
    await handleRegisterPlayer(data.uuid, player);
  }

  async function deregisterPlayer(player: Player) {
    await handleDeregisterPlayer(data.uuid, player);
  }

  async function setSeatOccupant(
    table: Table,
    wind: Wind,
    player: Player | null,
  ) {
    await handleSetSeatOccupant(data.uuid, table, wind, player);
  }

  return (
    <TournamentContext.Provider
      value={{
        ...data,
        selectedSession,
        setSelectedSession,
        sortedSessions,
        sortedPlayers,
        rankedPlayers,
        sortedTables,
        registerPlayer,
        deregisterPlayer,
        setSeatOccupant,
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
