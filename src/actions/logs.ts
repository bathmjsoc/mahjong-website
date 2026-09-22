"use server";

import { createClient } from "@/lib/supabase/server";
import type { Log } from "@/lib/types";

export async function createLogs(logs: Log | Log[]): Promise<void> {
  const payload = Array.isArray(logs) ? logs : [logs];
  if (payload.length === 0) return;

  const supabase = await createClient();
  await supabase.from("logs").insert(payload).throwOnError();
}

export async function updateLog(log: Log): Promise<void> {
  const supabase = await createClient();
  await supabase.from("logs").update(log).eq("id", log.id).throwOnError();
}
