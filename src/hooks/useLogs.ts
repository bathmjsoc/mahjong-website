import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "@/actions/logs";
import { useTournament } from "@/context/TournamentContext";
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
  const { tournamentId } = useTournament();

  const queryKey = ["logs", tournamentId];
  const query = useQuery({
    queryKey,
    queryFn: () => fetchLogs(tournamentId),
    enabled: !!tournamentId,
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
