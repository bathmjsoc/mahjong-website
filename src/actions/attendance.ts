"use server";

import { createClient } from "@/lib/supabase/server";
import type { Attendance, Player, Session } from "@/lib/types";

export async function registerPlayer(
  session: Session,
  player: Player,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("attendance").upsert(
    {
      session_id: session.id,
      player_id: player.id,
      registered: true,
      locked: false,
    },
    { onConflict: "session_id, player_id" },
  );

  if (error)
    throw new Error(`registerPlayer encountered an error: ${error.message}`);
}

export async function fetchAttendance(session: Session): Promise<Attendance[]> {
  const supabase = await createClient();

  const { data: attendance, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", session.id);

  if (error)
    throw new Error(`fetchAttendance encountered an error: ${error.message}`);

  return attendance ?? [];
}

export async function updateAttendance(
  session: Session,
  player: Player,
  attendance: Partial<Attendance>,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .update(attendance)
    .match({ session_id: session.id, player_id: player.id });

  if (error)
    throw new Error(`updateAttendance encountered an error: ${error.message}`);
}
