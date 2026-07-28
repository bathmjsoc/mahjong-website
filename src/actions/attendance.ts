"use server";

import { createClient } from "@/lib/supabase/server";
import type { Attendance, Player } from "@/lib/types";

export async function registerPlayer(
  sessionId: string,
  player: Player,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("attendance").upsert(
    {
      session_id: sessionId,
      player_id: player.id,
      registered: true,
      locked: false,
    },
    { onConflict: "session_id, player_id" },
  );

  if (error)
    throw new Error(`registerPlayer encountered an error: ${error.message}`);
}

export async function updateAttendance(
  sessionId: string,
  player: Player,
  attendance: Partial<Attendance>,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .update(attendance)
    .match({ session_id: sessionId, player_id: player.id });

  if (error)
    throw new Error(`updateAttendance encountered an error: ${error.message}`);
}
