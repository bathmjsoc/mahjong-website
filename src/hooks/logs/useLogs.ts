import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { getPlayerScores } from "@/lib/scores";
import { createClient } from "@/lib/supabase/client";
import type { Log, Tournament } from "@/lib/types";

type UseLogsType = {
  enabledLogs: Log[];
  logs: Log[];
  overallScores: Record<string, number>;
  sessionScores: Record<string, Record<string, number>>;
};

export function useLogs(): UseLogsType {
  const { currentTournament, scoringRules } = useTournaments();

  const selectLogs = useCallback(
    (rawLogs: Log[]) => {
      const logs = [...rawLogs].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      const enabledLogs = logs.filter((log) => !log.disabled);
      const overallScores = getPlayerScores(enabledLogs, scoringRules);

      const grouped = Map.groupBy(enabledLogs, (log) => log.session_id);

      const sessionScores: Record<string, Record<string, number>> = {};
      for (const [sessionId, groupedLogs] of grouped) {
        sessionScores[sessionId] = getPlayerScores(groupedLogs, scoringRules);
      }

      return { enabledLogs, logs, overallScores, sessionScores };
    },
    [scoringRules],
  );

  const query = useSuspenseQuery({
    queryKey: ["logs", currentTournament?.id],
    queryFn: () => {
      if (!currentTournament) return [];
      return fetchLogs(currentTournament);
    },
    select: selectLogs,
  });

  return {
    logs: query.data.logs,
    enabledLogs: query.data.enabledLogs,
    overallScores: query.data.overallScores,
    sessionScores: query.data.sessionScores,
  };
}

async function fetchLogs(tournament: Tournament): Promise<Log[]> {
  const supabase = createClient();

  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .eq("tournament_id", tournament.id);

  if (error)
    throw new Error(`fetchLogs encountered an error: ${error.message}`);

  return logs ?? [];
}
