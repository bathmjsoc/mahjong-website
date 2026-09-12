import { useQueryClient } from "@tanstack/react-query";
import { createSession as createSessionAction } from "@/actions/sessions";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Session } from "@/lib/types";

export function useSessionMutations() {
  const queryClient = useQueryClient();

  const getSessionsQueryKey = (session: Session) => {
    return ["sessions", session.tournament_id];
  };

  const { addItem } = useCacheItems<Session>({
    getId: (session) => session.id,
    getQueryKey: getSessionsQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createSessionAction,
    getQueryKey: getSessionsQueryKey,
    optimisticUpdate: addItem,
  });

  return {
    createSession(tournamentId: string) {
      const sessions =
        queryClient.getQueryData<Session[]>(["sessions", tournamentId]) ?? [];
      const nextNumber = sessions.length + 1;

      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournamentId,
        number: nextNumber,
        start_date: new Date().toISOString().slice(0, 10),
      });
    },
  };
}
