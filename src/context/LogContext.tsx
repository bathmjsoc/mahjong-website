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
import { useSessions } from "@/context/SessionContext";
import { getPlayerScores } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/client";
import type { Log } from "@/lib/types";

type LogsContextType = {
  enabledLogs: Log[];
  logs: Log[];
  overallScores: Record<string, number>;
  sessionScores: Record<string, Record<string, number>>;
};

const LogsContext = createContext<LogsContextType | undefined>(undefined);
const supabase = createClient();

export function LogsProvider({ children }: { children: ReactNode }) {
  const { sessions } = useSessions();

  const [logs, setLogs] = useState<Log[]>([]);

  const sessionIds = useMemo(() => {
    return sessions.map((session) => session.id).join(",");
  }, [sessions]);

  const enabledLogs = useMemo(() => {
    return logs.filter((log) => !log.disabled);
  }, [logs]);

  const overallScores = useMemo(() => {
    return getPlayerScores(enabledLogs);
  }, [enabledLogs]);

  const sessionScores = useMemo(() => {
    const grouped = Object.groupBy(enabledLogs, (log) => log.session_id);

    const scores: Record<string, Record<string, number>> = {};
    for (const sessionId in grouped) {
      scores[sessionId] = getPlayerScores(grouped[sessionId] ?? []);
    }

    return scores;
  }, [enabledLogs]);

  useEffect(() => {
    if (!sessions.length) return;
    fetchLogs(sessions).then(setLogs);

    const channel = supabase
      .channel(`logs:${sessionIds}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "logs",
          filter: `session_id=in.(${sessionIds})`,
        },
        () => fetchLogs(sessions).then(setLogs),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [sessions, sessionIds]);

  return (
    <LogsContext.Provider
      value={{ enabledLogs, logs, overallScores, sessionScores }}
    >
      {children}
    </LogsContext.Provider>
  );
}

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) throw new Error("useLogs must be used within LogsProvider!");
  return context;
};
