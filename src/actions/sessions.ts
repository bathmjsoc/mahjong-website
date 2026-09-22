"use server";

import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/types";

export async function createSessions(data: Session | Session[]): Promise<void> {
  const sessions = Array.isArray(data) ? data : [data];
  if (sessions.length === 0) return;

  const supabase = await createClient();
  await supabase.from("sessions").insert(sessions).throwOnError();
}
