import {
  createLog as createLogAction,
  disableLog as disableLogAction,
} from "@/actions/logs";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type {
  Log,
  Player,
  Session,
  Tournament,
  WinType,
} from "@/types/app.types";

export function useLogMutations() {
  const getLogsQueryKey = (log: Log) => ["logs", log.tournament_id];

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
    mutationFn: disableLogAction,
    getQueryKey: getLogsQueryKey,
    optimisticUpdate: (log) => updateItem({ ...log, disabled: true }),
  });

  return {
    createLog(
      tournament: Tournament,
      session: Session,
      faan: number | null,
      winType: WinType,
      winners: Player[],
      losers: Player[],
      others: Player[],
    ) {
      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournament.id,
        session_id: session.id,
        faan: faan,
        win_type: winType,
        winner_ids: winners.map((player) => player.id),
        loser_ids: losers.map((player) => player.id),
        other_ids: others.map((player) => player.id),
        timestamp: new Date().toISOString(),
        disabled: false,
      });
    },

    disableLog(log: Log) {
      disableMutation.mutate(log);
    },
  };
}
