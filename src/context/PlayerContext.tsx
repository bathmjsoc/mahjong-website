"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchPlayers } from "@/actions/players";
import { createClient } from "@/lib/supabase/browser";
import type { Player } from "@/lib/types";

type PlayersContextType = {
  playerMap: Map<string, Player>;
  players: Player[];
};

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

const supabase = createClient();

export function PlayersProvider({
  tournamentId,
  children,
}: {
  tournamentId: string;
  children: ReactNode;
}) {
  const [players, setPlayers] = useState<Player[]>([]);

  const playerMap = useMemo(() => {
    return new Map(players.map((player) => [player.id, player]));
  }, [players]);

  useEffect(() => {
    if (!tournamentId) return;
    fetchPlayers(tournamentId).then(setPlayers);

    const channel = supabase
      .channel(`players:${tournamentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => fetchPlayers(tournamentId).then(setPlayers),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId]);

  return (
    <PlayersContext.Provider value={{ playerMap, players }}>
      {children}
    </PlayersContext.Provider>
  );
}

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context)
    throw new Error("usePlayers must be used within PlayersProvider!");
  return context;
};
