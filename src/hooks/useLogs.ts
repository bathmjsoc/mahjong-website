import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchLogs } from "@/actions/logs";
import { useTournaments } from "@/hooks/useTournaments";
import type { Log } from "@/lib/types";
import { getPlayerScores } from "@/lib/utils";
import { useTournamentContext } from "@/providers/TournamentProvider";

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
  const { tournamentsMap } = useTournaments();

  const tournament = tournamentsMap[tournamentId];

  const queryKey = ["logs", tournamentId];
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchLogs(tournamentId),
    enabled: !!tournamentId,
  });

  const logs = data ?? [];

  const { enabledLogs, overallScores, sessionScores } = useMemo(() => {
    const enabledLogs = logs.filter((log) => !log.disabled);
    const overallScores = getPlayerScores(
      enabledLogs,
      tournament?.scoring_rules ?? [],
    );

    const grouped = Object.groupBy(enabledLogs, (log) => log.session_id);

    const sessionScores: Record<string, Record<string, number>> = {};
    for (const sessionId in grouped) {
      sessionScores[sessionId] = getPlayerScores(
        grouped[sessionId] ?? [],
        tournament?.scoring_rules ?? [],
      );
    }

    return { enabledLogs, overallScores, sessionScores };
  }, [logs, tournament?.scoring_rules]);

  return {
    logs: logs,
    enabledLogs: enabledLogs,
    overallScores: overallScores,
    sessionScores: sessionScores,
    isLoading: isLoading,
    isError: isError,
  };
}
