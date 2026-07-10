import { useQuery } from "@tanstack/react-query";
import { fetchAttendance } from "@/actions/attendance";
import { usePlayers } from "@/hooks/usePlayers";
import { useSessions } from "@/hooks/useSessions";
import type { Attendance, Player } from "@/lib/types";

type UseAttendanceType = {
  attendance: Attendance[];
  availablePlayers: Player[];
  lockedPlayerIds: Set<string>;
  registeredPlayers: Player[];
  isLoading: boolean;
  isError: boolean;
};

export function useAttendance(): UseAttendanceType {
  const { currentSession } = useSessions();
  const { playerMap } = usePlayers();

  const queryKey = ["attendance", currentSession.id];
  const query = useQuery({
    queryKey,
    queryFn: () => fetchAttendance(currentSession),
    enabled: !!currentSession,
    select: (attendance) => {
      const availablePlayers: Player[] = [];
      const lockedPlayerIds = new Set<string>();
      const registeredPlayers: Player[] = [];

      for (const entry of attendance) {
        if (entry.session_id !== currentSession.id || !entry.registered) {
          continue;
        }

        const player = playerMap[entry.player_id];
        if (!player) continue;

        registeredPlayers.push(player);

        if (entry.locked) {
          lockedPlayerIds.add(player.id);
        } else {
          availablePlayers.push(player);
        }
      }

      registeredPlayers.sort((a, b) => a.name.localeCompare(b.name));

      return {
        attendance,
        availablePlayers,
        lockedPlayerIds,
        registeredPlayers,
      };
    },
  });

  return {
    attendance: query.data?.attendance ?? [],
    availablePlayers: query.data?.availablePlayers ?? [],
    lockedPlayerIds: query.data?.lockedPlayerIds ?? new Set<string>(),
    registeredPlayers: query.data?.registeredPlayers ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
