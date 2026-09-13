import { upsertAttendance as upsertAttendanceAction } from "@/actions/attendance";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Attendance, Player } from "@/lib/types";

export function useAttendanceMutations() {
  const getAttendanceQueryKey = (attendance: Attendance) => {
    return ["attendance", attendance.session_id];
  };

  const { createItem, updateItem } = useCacheItems<Attendance>({
    getId: (attendance) => `${attendance.session_id}:${attendance.player_id}`,
    getQueryKey: getAttendanceQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: upsertAttendanceAction,
    getQueryKey: getAttendanceQueryKey,
    optimisticUpdate: createItem,
  });

  const updateMutation = useOptimisticMutation({
    mutationFn: upsertAttendanceAction,
    getQueryKey: getAttendanceQueryKey,
    optimisticUpdate: updateItem,
  });

  return {
    registerPlayer(sessionId: string, player: Player) {
      createMutation.mutate({
        session_id: sessionId,
        player_id: player.id,
        registered: true,
        locked: false,
      });
    },

    deregisterPlayer(sessionId: string, player: Player) {
      updateMutation.mutate({
        session_id: sessionId,
        player_id: player.id,
        registered: false,
        locked: false,
      });
    },

    lockPlayer(sessionId: string, player: Player) {
      updateMutation.mutate({
        session_id: sessionId,
        player_id: player.id,
        registered: true,
        locked: true,
      });
    },

    unlockPlayer(sessionId: string, player: Player) {
      updateMutation.mutate({
        session_id: sessionId,
        player_id: player.id,
        registered: true,
        locked: false,
      });
    },
  };
}
