import { upsertAttendance as upsertAttendanceAction } from "@/actions/attendance";
import {
  useCacheMutators,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Attendance, Player } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";

export function useAttendanceMutations() {
  const sessionId = useSessionContext();

  const getAttendanceQueryKey = (attendance: Attendance) => {
    return ["attendance", attendance.session_id];
  };

  const { upsertItem } = useCacheMutators<Attendance>({
    getId: (attendance) => `${attendance.session_id}:${attendance.player_id}`,
    getQueryKey: getAttendanceQueryKey,
  });

  const upsertMutation = useOptimisticMutation({
    mutationFn: upsertAttendanceAction,
    queryKeyFn: getAttendanceQueryKey,
    optimisticFn: upsertItem,
  });

  return {
    registerPlayer(player: Player) {
      upsertMutation.mutate({
        session_id: sessionId,
        player_id: player.id,
        registered: true,
        locked: false,
      });
    },

    deregisterPlayer(player: Player) {
      upsertMutation.mutate({
        session_id: sessionId,
        player_id: player.id,
        registered: false,
        locked: false,
      });
    },

    lockPlayer(player: Player) {
      upsertMutation.mutate({
        session_id: sessionId,
        player_id: player.id,
        registered: true,
        locked: true,
      });
    },

    unlockPlayer(player: Player) {
      upsertMutation.mutate({
        session_id: sessionId,
        player_id: player.id,
        registered: true,
        locked: false,
      });
    },
  };
}
