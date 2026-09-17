import { useQueryClient } from "@tanstack/react-query";
import { createSession as createSessionAction } from "@/actions/sessions";
import {
  useCacheMutators,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Session } from "@/lib/types";
import { getCurrentDateString } from "@/lib/utils";

export function useSessionMutations() {
  const queryClient = useQueryClient();

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
    createSession(tournamentId: string) {
      const sessions =
        queryClient.getQueryData<Session[]>(["sessions", tournamentId]) ?? [];
      const sessionCount = sessions.length;

      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        number: sessionCount + 1,
        start_date: getCurrentDateString(),
      });
    },
  };
}
