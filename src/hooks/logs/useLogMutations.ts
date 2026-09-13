import {
  createLog as createLogAction,
  updateLog as updateLogAction,
} from "@/actions/logs";
import {
  useCacheMutators,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Log, Player, WinType } from "@/lib/types";

export function useLogMutations() {
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
      tournamentId: string,
      sessionId: string,
      faan: number | null,
      winType: WinType,
      winners: Player[],
      losers: Player[],
      others: Player[],
      handType: string | null,
    ) {
      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        session_id: sessionId,
        faan: faan,
        win_type: winType,
        winner_ids: winners.map((player) => player.id),
        loser_ids: losers.map((player) => player.id),
        other_ids: others.map((player) => player.id),
        hand_type: handType,
        timestamp: new Date().toISOString(),
        disabled: false,
      });
    },

    disableLog(log: Log) {
      updateMutation.mutate({ ...log, disabled: true });
    },
  };
}
