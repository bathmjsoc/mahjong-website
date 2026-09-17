import {
  createPlayer as createPlayerAction,
  updatePlayer as updatePlayerAction,
} from "@/actions/players";
import {
  useCacheMutators,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Player } from "@/lib/types";

export function usePlayerMutations() {
  const getPlayersQueryKey = (player: Player) => {
    return ["players", player.tournament_id];
  };

  const { createItem, updateItem } = useCacheMutators<Player>({
    getId: (player) => player.id,
    getQueryKey: getPlayersQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createPlayerAction,
    queryKeyFn: getPlayersQueryKey,
    optimisticFn: createItem,
  });

  const updateMutation = useOptimisticMutation({
    mutationFn: updatePlayerAction,
    queryKeyFn: getPlayersQueryKey,
    optimisticFn: updateItem,
  });

  return {
    createPlayer(tournamentId: string, playerName: string) {
      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        name: playerName,
        deleted: false,
      });
    },

    updatePlayer(player: Player, newName: string) {
      updateMutation.mutate({ ...player, name: newName });
    },

    deletePlayer(player: Player) {
      updateMutation.mutate({ ...player, deleted: true });
    },
  };
}
