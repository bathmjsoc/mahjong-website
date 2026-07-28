import { useQueryClient } from "@tanstack/react-query";
import {
  registerPlayer as registerPlayerAction,
  updateAttendance as updateAttendanceAction,
} from "@/actions/attendance";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Attendance, Player } from "@/lib/types";

type RegisterAttendanceVariables = {
  sessionId: string;
  player: Player;
};

type UpdateAttendanceVariables = {
  sessionId: string;
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
    mutationFn: ({ sessionId, player }) =>
      registerPlayerAction(sessionId, player),
    getQueryKey: ({ sessionId }) => getAttendanceQueryKey(sessionId),
    optimisticUpdate: ({ sessionId, player }) =>
      addItem({
        session_id: sessionId,
        player_id: player.id,
        registered: true,
        locked: false,
      }),
  });

  const updateMutation = useOptimisticMutation<UpdateAttendanceVariables, void>(
    {
      mutationFn: ({ sessionId, player, changes }) =>
        updateAttendanceAction(sessionId, player, changes),
      getQueryKey: ({ sessionId }) => getAttendanceQueryKey(sessionId),
      optimisticUpdate: ({ sessionId, player, changes }) => {
        const queryKey = getAttendanceQueryKey(sessionId);
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
    registerPlayer(sessionId: string, player: Player) {
      registerMutation.mutate({ sessionId, player });
    },

    deregisterPlayer(sessionId: string, player: Player) {
      updateMutation.mutate({
        sessionId,
        player,
        changes: {
          registered: false,
        },
      });
    },

    lockPlayer(sessionId: string, player: Player) {
      updateMutation.mutate({
        sessionId,
        player,
        changes: {
          locked: true,
        },
      });
    },

    unlockPlayer(sessionId: string, player: Player) {
      updateMutation.mutate({
        sessionId,
        player,
        changes: {
          locked: false,
        },
      });
    },
  };
}
