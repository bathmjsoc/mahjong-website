"use client";
// TODO: See if it is possible to avoid passing a list of sessions to fetch logs

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchLogs } from "@/actions/logs";
import { useSessions } from "@/hooks/useSessions";
import { getPlayerScores } from "@/lib/scoring";
import type { Log } from "@/lib/types";

type UseLogsType = {
  enabledLogs: Log[];
  logs: Log[];
  overallScores: Record<string, number>;
  sessionScores: Record<string, Record<string, number>>;
  isLoading: boolean;
  isError: boolean;
};

export function useLogs(): UseLogsType {
  const { sessions } = useSessions();

  const sessionIds = useMemo(() => {
    return sessions
      .map((s) => s.id)
      .sort()
      .join(",");
  }, [sessions]);

  const queryKey = ["logs", sessionIds];
  const query = useQuery({
    queryKey,
    queryFn: () => fetchLogs(sessions),
    enabled: sessions.length > 0,
    select: (logs) => {
      const enabledLogs = logs.filter((log) => !log.disabled);
      const overallScores = getPlayerScores(enabledLogs);

      const grouped = Object.groupBy(enabledLogs, (log) => log.session_id);

      const sessionScores: Record<string, Record<string, number>> = {};
      for (const sessionId in grouped) {
        sessionScores[sessionId] = getPlayerScores(grouped[sessionId] ?? []);
      }

      return { logs, enabledLogs, overallScores, sessionScores };
    },
  });

  return {
    logs: query.data?.logs ?? [],
    enabledLogs: query.data?.enabledLogs ?? [],
    overallScores: query.data?.overallScores ?? {},
    sessionScores: query.data?.sessionScores ?? {},
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
