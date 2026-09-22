import {
  createLogs as createLogAction,
  updateLog as updateLogAction,
} from "@/actions/logs";
import {
  useCacheMutators,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Log, Player, WinType } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";
import { useTournamentContext } from "@/providers/TournamentProvider";

export function useLogMutations() {
  const sessionId = useSessionContext();
  const tournamentId = useTournamentContext();

  const getLogsQueryKey = (log: Log) => {
    return ["logs", log.tournament_id];
  };

  const { createItem, updateItem } = useCacheMutators<Log>({
    getId: (log) => log.id,
    getQueryKey: getLogsQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createLogAction,
    queryKeyFn: getLogsQueryKey,
    optimisticFn: createItem,
  });

  const updateMutation = useOptimisticMutation({
    mutationFn: updateLogAction,
    queryKeyFn: getLogsQueryKey,
    optimisticFn: updateItem,
  });

  return {
    createLog(
      winType: WinType,
      handType: string | null,
      faan: number | null,
      winners: Player[],
      losers: Player[],
      others: Player[],
      winnerPoints: number,
      loserPoints: number,
    ) {
      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        session_id: sessionId,
        win_type: winType,
        hand_type: handType,
        faan: faan,
        winner_ids: winners.map((player) => player.id),
        loser_ids: losers.map((player) => player.id),
        other_ids: others.map((player) => player.id),
        winner_points: winnerPoints,
        loser_points: loserPoints,
        timestamp: new Date().toISOString(),
        disabled: false,
      });
    },

    disableLog(log: Log) {
      updateMutation.mutate({ ...log, disabled: true });
    },
  };
}
