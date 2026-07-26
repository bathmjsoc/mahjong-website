import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchLogs } from "@/actions/logs";
import { useCurrentTournament } from "@/hooks/tournaments/useCurrentTournament";
import { getPlayerScores } from "@/lib/scores";
import { useTournamentContext } from "@/providers/TournamentProvider";
import type { Log } from "@/types/app.types";

type UseLogsType = {
  enabledLogs: Log[];
  logs: Log[];
  overallScores: Record<string, number>;
  sessionScores: Record<string, Record<string, number>>;
  isLoading: boolean;
  isError: boolean;
};

export function useLogs(): UseLogsType {
  const { tournamentId } = useTournamentContext();
  const { scoringRules } = useCurrentTournament();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["logs", tournamentId],
    queryFn: () => fetchLogs(tournamentId),
    enabled: !!tournamentId,
    select: (logs) => {
      logs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      return logs;
    },
  });

  const logs = data ?? [];

  const { enabledLogs, overallScores, sessionScores } = useMemo(() => {
    const enabledLogs = logs.filter((log) => !log.disabled);
    const overallScores = getPlayerScores(enabledLogs, scoringRules);

    const grouped = Map.groupBy(enabledLogs, (log) => log.session_id);

    const sessionScores: Record<string, Record<string, number>> = {};
    for (const [sessionId, logs] of grouped) {
      sessionScores[sessionId] = getPlayerScores(logs, scoringRules);
    }

    return { enabledLogs, overallScores, sessionScores };
  }, [logs, scoringRules]);

  return {
    logs: logs,
    enabledLogs: enabledLogs,
    overallScores: overallScores,
    sessionScores: sessionScores,
    isLoading: isLoading,
    isError: isError,
  };
}
