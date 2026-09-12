"use server";

import { createClient } from "@/lib/supabase/server";
import type { Attendance } from "@/lib/types";

export async function upsertAttendance(attendance: Attendance): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("attendance")
    .upsert(attendance, { onConflict: "session_id, player_id" });

  if (error) {
    throw new Error(`upsertAttendance encountered an error: ${error.message}`);
  }
}
