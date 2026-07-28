import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { usePlayers } from "@/hooks/players/usePlayers";
import { createClient } from "@/lib/supabase/client";
import type { Attendance, Player } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";

type UseAttendanceType = {
  attendance: Attendance[];
  availablePlayers: Player[];
  lockedPlayerIds: Set<string>;
  registeredPlayers: Player[];
};

export function useAttendance(): UseAttendanceType {
  const { playerMap } = usePlayers();
  const { sessionId } = useSessionContext();

  const selectAttendance = useCallback(
    (rawAttendance: Attendance[]) => {
      const attendance = [...rawAttendance];

      const availablePlayers = [];
      const lockedPlayerIds = new Set<string>();
      const registeredPlayers = [];

      for (const entry of attendance) {
        if (entry.session_id !== sessionId || !entry.registered) {
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
    [playerMap, sessionId],
  );

  const query = useSuspenseQuery({
    queryKey: ["attendance", sessionId],
    queryFn: () => fetchAttendance(sessionId),
    select: selectAttendance,
  });

  return {
    attendance: query.data.attendance,
    availablePlayers: query.data.availablePlayers,
    lockedPlayerIds: query.data.lockedPlayerIds,
    registeredPlayers: query.data.registeredPlayers,
  };
}

async function fetchAttendance(sessionId: string): Promise<Attendance[]> {
  const supabase = createClient();

  const { data: attendance, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(`fetchAttendance encountered an error: ${error.message}`);
  }

  return attendance ?? [];
}
