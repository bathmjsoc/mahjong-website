import { useQueryClient } from "@tanstack/react-query";
import {
  registerPlayer as registerPlayerAction,
  updateAttendance as updateAttendanceAction,
} from "@/actions/attendance";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Attendance, Player, Session } from "@/lib/types";

type RegisterAttendanceVariables = {
  session: Session;
  player: Player;
};

type UpdateAttendanceVariables = {
  session: Session;
  player: Player;
  changes: Partial<Attendance>;
};

export function useAttendanceMutations() {
  const queryClient = useQueryClient();

  const getAttendanceQueryKey = (sessionId: string) => [
    "attendance",
    sessionId,
  ];

  const { addItem, updateItem } = useCacheItems<Attendance>({
    getId: ({ session_id, player_id }) => `${session_id}:${player_id}`,
    getQueryKey: (attendance) => getAttendanceQueryKey(attendance.session_id),
  });

  const registerMutation = useOptimisticMutation<
    RegisterAttendanceVariables,
    void
  >({
    mutationFn: ({ session, player }: { session: Session; player: Player }) =>
      registerPlayerAction(session, player),
    getQueryKey: ({ session }) => getAttendanceQueryKey(session.id),
    optimisticUpdate: ({ session, player }) =>
      addItem({
        session_id: session.id,
        player_id: player.id,
        registered: true,
        locked: false,
      }),
  });

  const updateMutation = useOptimisticMutation<UpdateAttendanceVariables, void>(
    {
      mutationFn: ({ session, player, changes }) =>
        updateAttendanceAction(session, player, changes),
      getQueryKey: ({ session }) => getAttendanceQueryKey(session.id),
      optimisticUpdate: ({ session, player, changes }) => {
        const queryKey = getAttendanceQueryKey(session.id);
        const previousData = queryClient.getQueryData<Attendance[]>(queryKey);

        const existingAttendance = previousData?.find(
          (attendance) => attendance.player_id === player.id,
        );

        if (existingAttendance) {
          updateItem({
            ...existingAttendance,
            ...changes,
          });
        }
      },
    },
  );

  return {
    registerPlayer(session: Session, player: Player) {
      registerMutation.mutate({ session, player });
    },

    deregisterPlayer(session: Session, player: Player) {
      updateMutation.mutate({
        session,
        player,
        changes: {
          registered: false,
        },
      });
    },

    lockPlayer(session: Session, player: Player) {
      updateMutation.mutate({
        session,
        player,
        changes: {
          locked: true,
        },
      });
    },

    unlockPlayer(session: Session, player: Player) {
      updateMutation.mutate({
        session,
        player,
        changes: {
          locked: false,
        },
      });
    },
  };
}
