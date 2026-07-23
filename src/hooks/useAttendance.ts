import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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

  const queryKey = ["attendance", currentSession?.id];
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => {
      if (!currentSession) return [];
      return fetchAttendance(currentSession);
    },
    enabled: !!currentSession,
  });

  const attendance = data ?? [];

  const { availablePlayers, lockedPlayerIds, registeredPlayers } =
    useMemo(() => {
      const availablePlayers: Player[] = [];
      const lockedPlayerIds = new Set<string>();
      const registeredPlayers: Player[] = [];

      for (const entry of attendance) {
        if (entry.session_id !== currentSession?.id || !entry.registered) {
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
        availablePlayers,
        lockedPlayerIds,
        registeredPlayers,
      };
    }, [attendance, currentSession?.id, playerMap]);

  return {
    attendance: attendance,
    availablePlayers: availablePlayers,
    lockedPlayerIds: lockedPlayerIds,
    registeredPlayers: registeredPlayers,
    isLoading: isLoading,
    isError: isError,
  };
}
