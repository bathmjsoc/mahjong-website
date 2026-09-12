import {
  createLog as createLogAction,
  updateLog as updateLogAction,
} from "@/actions/logs";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Log, Player, WinType } from "@/lib/types";

export function useLogMutations() {
  const getLogsQueryKey = (log: Log) => {
    return ["logs", log.tournament_id];
  };

  const { addItem, updateItem } = useCacheItems<Log>({
    getId: (log) => log.id,
    getQueryKey: getLogsQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createLogAction,
    getQueryKey: getLogsQueryKey,
    optimisticUpdate: addItem,
  });

  const disableMutation = useOptimisticMutation({
    mutationFn: updateLogAction,
    getQueryKey: getLogsQueryKey,
    optimisticUpdate: updateItem,
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
      disableMutation.mutate({ ...log, disabled: true });
    },
  };
}
