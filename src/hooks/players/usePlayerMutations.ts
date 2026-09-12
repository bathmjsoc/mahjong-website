import {
  createPlayer as createPlayerAction,
  updatePlayer as updatePlayerAction,
} from "@/actions/players";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Player } from "@/lib/types";

export function usePlayerMutations() {
  const getPlayersQueryKey = (player: Player) => [
    "players",
    player.tournament_id,
  ];

  const { addItem, updateItem } = useCacheItems<Player>({
    getId: (player) => player.id,
    getQueryKey: getPlayersQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createPlayerAction,
    getQueryKey: getPlayersQueryKey,
    optimisticUpdate: addItem,
  });

  const updateMutation = useOptimisticMutation({
    mutationFn: updatePlayerAction,
    getQueryKey: getPlayersQueryKey,
    optimisticUpdate: updateItem,
  });

  const deleteMutation = useOptimisticMutation({
    mutationFn: updatePlayerAction,
    getQueryKey: getPlayersQueryKey,
    optimisticUpdate: updateItem,
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
      deleteMutation.mutate({ ...player, deleted: true });
    },
  };
}
