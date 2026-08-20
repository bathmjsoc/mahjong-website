import { useSuspenseQuery } from "@tanstack/react-query";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { getPlayerScores } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/client";
import type { Log, ScoringRule } from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseLogsType = {
  enabledLogs: Log[];
  logs: Log[];
  overallScores: Record<string, number>;
  sessionScores: Record<string, Record<string, number>>;
};

export function useLogs(): UseLogsType {
  const tournamentId = useTournamentContext();

  const { scoringRulesMap } = useTournaments();

  const query = useSuspenseQuery({
    queryKey: ["logs", tournamentId],
    queryFn: () => fetchLogs(tournamentId),
    select: (logs) => selectLogs(logs, scoringRulesMap),
  });

  return query.data;
}

function selectLogs(
  rawLogs: Log[],
  scoringRulesMap: Map<number | null, ScoringRule>,
): UseLogsType {
  const logs = rawLogs.toSorted((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  );

  const enabledLogs = logs.filter((log) => !log.disabled);
  const overallScores = getPlayerScores(enabledLogs, scoringRulesMap);

  const grouped = Map.groupBy(enabledLogs, (log) => log.session_id);

  const sessionScores: Record<string, Record<string, number>> = {};
  for (const [sessionId, groupedLogs] of grouped) {
    sessionScores[sessionId] = getPlayerScores(groupedLogs, scoringRulesMap);
  }

  return { enabledLogs, logs, overallScores, sessionScores };
}

async function fetchLogs(tournamentId: string): Promise<Log[]> {
  const supabase = createClient();

  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .eq("tournament_id", tournamentId);

  if (error) {
    throw new Error(`fetchLogs encountered an error: ${error.message}`);
  }

  return logs;
}
