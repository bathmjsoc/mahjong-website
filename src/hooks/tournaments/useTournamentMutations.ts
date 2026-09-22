import {
  createTournament as createTournamentAction,
  updateTournament as updateTournamentAction,
} from "@/actions/tournaments";
import {
  useCacheMutators,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { ScoringRule, Tournament } from "@/lib/types";

export function useTournamentMutations() {
  const getTournamentsQueryKey = () => {
    return ["tournaments"];
  };

  const { createItem, updateItem } = useCacheMutators<Tournament>({
    getId: (tournament) => tournament.id,
    getQueryKey: getTournamentsQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createTournamentAction,
    queryKeyFn: getTournamentsQueryKey,
    optimisticFn: createItem,
  });

  const updateMutation = useOptimisticMutation({
    mutationFn: updateTournamentAction,
    queryKeyFn: getTournamentsQueryKey,
    optimisticFn: updateItem,
  });

  return {
    createTournament(
      tournamentName: string,
      scoringRules: ScoringRule[],
      handTypes: string[],
    ) {
      createMutation.mutate({
        id: crypto.randomUUID(),
        user_id: "", // The real user_id is determined by Supabase using auth.uid()
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
