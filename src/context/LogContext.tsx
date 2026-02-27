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
import { usePlayers } from "@/context/PlayerContext";
import { useSessions } from "@/context/SessionContext";
import { createClient } from "@/lib/supabase/browser";
import type { Log, LogEntry, Player } from "@/lib/types";
import { getPlayerScores } from "@/lib/utils";

type LogsContextType = {
  logs: Log[];
  overallScores: Record<string, number>;
  sessionScores: Record<string, Record<string, number>>;
};

const LogsContext = createContext<LogsContextType | undefined>(undefined);

const supabase = createClient();

export function LogsProvider({ children }: { children: ReactNode }) {
  const { sessionMap, sessions } = useSessions();
  const { playerMap } = usePlayers();
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  const logs: Log[] = useMemo(() => {
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

      return { ...entry, winners, losers, session_number };
    });
  }, [logEntries, playerMap, sessionMap]);

  const overallScores = useMemo(() => getPlayerScores(logs), [logs]);

  const sessionScores = useMemo(() => {
    const grouped = Object.groupBy(logs, (log) => log.session_id);

    const scores: Record<string, Record<string, number>> = {};
    for (const sessionId in grouped) {
      scores[sessionId] = getPlayerScores(grouped[sessionId] ?? []);
    }

    return scores;
  }, [logs]);

  useEffect(() => {
    if (!sessions.length) return;
    fetchLogs(sessions).then(setLogEntries);

    const sessionIds = sessions.map((session) => session.id).join(",");

    const channel = supabase
      .channel(`logs:${sessionIds}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "log_entries",
          filter: `session_id=in.(${sessionIds})`,
        },
        () => fetchLogs(sessions).then(setLogEntries),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessions]);

  return (
    <LogsContext.Provider value={{ logs, overallScores, sessionScores }}>
      {children}
    </LogsContext.Provider>
  );
}

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) throw new Error("useLogs must be used within LogsProvider!");
  return context;
};
