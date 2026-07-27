import {
  createPlayer as createPlayerAction,
  deletePlayer as deletePlayerAction,
  updatePlayer as updatePlayerAction,
} from "@/actions/players";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Player, Tournament } from "@/lib/types";

type UpdatePlayerVariables = {
  player: Player;
  newName: string;
};

export function usePlayerMutations() {
  const getPlayersQueryKey = (player: Player) => [
    "players",
    player.tournament_id,
  ];

  const { addItem, updateItem, removeItem } = useCacheItems<Player>({
    getId: (player) => player.id,
    getQueryKey: getPlayersQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createPlayerAction,
    getQueryKey: getPlayersQueryKey,
    optimisticUpdate: addItem,
  });

  const updateMutation = useOptimisticMutation<UpdatePlayerVariables, void>({
    mutationFn: ({ player }) => updatePlayerAction(player),
    getQueryKey: ({ player }) => getPlayersQueryKey(player),
    optimisticUpdate: ({ player, newName }) =>
      updateItem({ ...player, name: newName }),
  });

  const deleteMutation = useOptimisticMutation({
    mutationFn: deletePlayerAction,
    getQueryKey: getPlayersQueryKey,
    optimisticUpdate: removeItem,
  });

  return {
    createPlayer(tournament: Tournament, playerName: string) {
      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournament.id,
        name: playerName,
      });
    },

    updatePlayer(player: Player, newName: string) {
      updateMutation.mutate({ player, newName });
    },

    deletePlayer(player: Player) {
      deleteMutation.mutate(player);
    },
  };
}
