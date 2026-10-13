"use server";

import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/types";
import { toArray } from "@/lib/utils";

export async function createSessions(
  sessions: Session | Session[],
): Promise<void> {
  const payload = toArray(sessions);
  if (payload.length === 0) return;

  const supabase = await createClient();
  await supabase.from("sessions").insert(payload).throwOnError();
}
