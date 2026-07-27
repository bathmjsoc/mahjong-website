import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useSessions } from "@/hooks/sessions/useSessions";
import { createClient } from "@/lib/supabase/client";
import type { Attendance, Player, Session } from "@/lib/types";

type UseAttendanceType = {
  attendance: Attendance[];
  availablePlayers: Player[];
  lockedPlayerIds: Set<string>;
  registeredPlayers: Player[];
};

export function useAttendance(): UseAttendanceType {
  const { currentSession } = useSessions();
  const { playerMap } = usePlayers();

  const selectAttendance = useCallback(
    (rawAttendance: Attendance[]) => {
      const attendance = [...rawAttendance];

      const availablePlayers = [];
      const lockedPlayerIds = new Set<string>();
      const registeredPlayers = [];

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
        attendance,
        availablePlayers,
        lockedPlayerIds,
        registeredPlayers,
      };
    },
    [currentSession?.id, playerMap],
  );

  const query = useSuspenseQuery({
    queryKey: ["attendance", currentSession?.id],
    queryFn: () => {
      if (!currentSession) return [];
      return fetchAttendance(currentSession);
    },
    select: selectAttendance,
  });

  return {
    attendance: query.data.attendance,
    availablePlayers: query.data.availablePlayers,
    lockedPlayerIds: query.data.lockedPlayerIds,
    registeredPlayers: query.data.registeredPlayers,
  };
}

async function fetchAttendance(session: Session): Promise<Attendance[]> {
  const supabase = createClient();

  const { data: attendance, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", session.id);

  if (error)
    throw new Error(`fetchAttendance encountered an error: ${error.message}`);

  return attendance ?? [];
}
