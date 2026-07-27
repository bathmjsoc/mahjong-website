import { useQueryClient } from "@tanstack/react-query";
import { createSession as createSessionAction } from "@/actions/sessions";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Session, Table, Tournament } from "@/lib/types";

export function useSessionMutations() {
  const queryClient = useQueryClient();

  const getSessionsQueryKey = (session: Session) => [
    "sessions",
    session.tournament_id,
  ];

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
    createSession(tournament: Tournament) {
      const sessions = queryClient.getQueryData<Table[]>([
        "tables",
        tournament.id,
      ]);

      createMutation.mutate({
        id: crypto.randomUUID(),
        tournament_id: tournament.id,
        number: (sessions?.length ?? 0) + 1,
        start_date: new Date().toISOString().slice(0, 10),
      });
    },
  };
}
