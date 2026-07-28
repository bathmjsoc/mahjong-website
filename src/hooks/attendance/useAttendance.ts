import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Attendance } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";

type UseAttendanceType = {
  attendance: Attendance[];
  availablePlayerIds: Set<string>;
  lockedPlayerIds: Set<string>;
  registeredPlayerIds: Set<string>;
};

export function useAttendance(): UseAttendanceType {
  const { sessionId } = useSessionContext();

  const query = useSuspenseQuery({
    queryKey: ["attendance", sessionId],
    queryFn: () => fetchAttendance(sessionId),
    select: selectAttendance,
  });

  return query.data;
}

function selectAttendance(attendance: Attendance[]): UseAttendanceType {
  const availablePlayerIds = new Set<string>();
  const lockedPlayerIds = new Set<string>();
  const registeredPlayerIds = new Set<string>();

  for (const entry of attendance) {
    if (!entry.registered) {
      continue;
    }

    registeredPlayerIds.add(entry.player_id);

    if (entry.locked) {
      lockedPlayerIds.add(entry.player_id);
    } else {
      availablePlayerIds.add(entry.player_id);
    }
  }

  return {
    attendance,
    availablePlayerIds,
    lockedPlayerIds,
    registeredPlayerIds,
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
