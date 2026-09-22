"use server";

import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/types";

export async function createSessions(
  sessions: Session | Session[],
): Promise<void> {
  const payload = Array.isArray(sessions) ? sessions : [sessions];
  if (payload.length === 0) return;

  const supabase = await createClient();
  await supabase.from("sessions").insert(payload).throwOnError();
}
