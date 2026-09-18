import { useQueryClient } from "@tanstack/react-query";
import { createSession as createSessionAction } from "@/actions/sessions";
import {
  useCacheMutators,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Session } from "@/lib/types";
import { getCurrentDateString } from "@/lib/utils";
import { useTournamentContext } from "@/providers/TournamentProvider";

export function useSessionMutations() {
  const queryClient = useQueryClient();
  const tournamentId = useTournamentContext();

  const getSessionsQueryKey = (session: Session) => {
    return ["sessions", session.tournament_id];
  };

  const { createItem } = useCacheMutators<Session>({
    getId: (session) => session.id,
    getQueryKey: getSessionsQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createSessionAction,
    queryKeyFn: getSessionsQueryKey,
    optimisticFn: createItem,
  });

  return {
    createSession() {
      const sessions =
        queryClient.getQueryData<Session[]>(["sessions", tournamentId]) ?? [];

      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        number: sessions.length + 1,
        start_date: getCurrentDateString(),
      });
    },
  };
}
