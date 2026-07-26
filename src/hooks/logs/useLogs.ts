import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchLogs } from "@/actions/logs";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { getPlayerScores } from "@/lib/scores";
import { useTournamentContext } from "@/providers/TournamentProvider";
import type { Log } from "@/types/app.types";

type UseLogsType = {
  enabledLogs: Log[];
  logs: Log[];
  overallScores: Record<string, number>;
  sessionScores: Record<string, Record<string, number>>;
};

export function useLogs(): UseLogsType {
  const { tournamentId } = useTournamentContext();
  const { scoringRules } = useTournaments();

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
    queryKey: ["logs", tournamentId],
    queryFn: () => fetchLogs(tournamentId),
    select: selectLogs,
  });

  return {
    logs: query.data.logs,
    enabledLogs: query.data.enabledLogs,
    overallScores: query.data.overallScores,
    sessionScores: query.data.sessionScores,
  };
}
