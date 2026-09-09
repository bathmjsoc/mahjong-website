import {
  createTournament as createTournamentAction,
  updateTournament as updateTournamentAction,
} from "@/actions/tournaments";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { ScoringRule, Tournament } from "@/lib/types";

export function useTournamentMutations() {
  const getTournamentsQueryKey = () => ["tournaments"];

  const { addItem, updateItem } = useCacheItems<Tournament>({
    getId: (tournament) => tournament.id,
    getQueryKey: getTournamentsQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createTournamentAction,
    getQueryKey: getTournamentsQueryKey,
    optimisticUpdate: addItem,
  });

  const updateMutation = useOptimisticMutation({
    mutationFn: updateTournamentAction,
    getQueryKey: getTournamentsQueryKey,
    optimisticUpdate: updateItem,
  });

  return {
    createTournament(
      tournamentName: string,
      scoringRules: ScoringRule[],
      handTypes: string[],
    ) {
      createMutation.mutate({
        id: crypto.randomUUID(),
        user_id: "dummy", // The true UUID is assigned in the server action
        name: tournamentName,
        last_updated: new Date().toISOString(),
        player_count: 0,
        scoring_rules: scoringRules,
        hand_types: handTypes,
      });
    },

    updateTournament(
      tournament: Tournament,
      tournamentName: string,
      scoringRules: ScoringRule[],
      handTypes: string[],
    ) {
      updateMutation.mutate({
        ...tournament,
        name: tournamentName,
        scoring_rules: scoringRules,
        hand_types: handTypes,
      });
    },
  };
}
