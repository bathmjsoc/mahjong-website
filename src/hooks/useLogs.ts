import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "@/actions/logs";
import { useTournaments } from "@/hooks/useTournaments";
import { getPlayerScores } from "@/lib/scoring";
import type { Log } from "@/lib/types";
import { useTournament } from "@/providers/TournamentProvider";

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
  const { tournamentsMap } = useTournaments();

  const tournament = tournamentsMap[tournamentId];

  const queryKey = ["logs", tournamentId];
  const query = useQuery({
    queryKey,
    queryFn: () => fetchLogs(tournamentId),
    enabled: !!tournamentId,
    select: (logs) => {
      const enabledLogs = logs.filter((log) => !log.disabled);
      const overallScores = getPlayerScores(
        enabledLogs,
        tournament.scoring_rules,
      );

      const grouped = Object.groupBy(enabledLogs, (log) => log.session_id);

      const sessionScores: Record<string, Record<string, number>> = {};
      for (const sessionId in grouped) {
        sessionScores[sessionId] = getPlayerScores(
          grouped[sessionId] ?? [],
          tournament.scoring_rules,
        );
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
