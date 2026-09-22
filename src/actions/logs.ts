"use server";

import { createClient } from "@/lib/supabase/server";
import type { Log } from "@/lib/types";

export async function createLogs(data: Log | Log[]): Promise<void> {
  const logs = Array.isArray(data) ? data : [data];
  if (logs.length === 0) return;

  const supabase = await createClient();
  await supabase.from("logs").insert(logs).throwOnError();
}

export async function updateLog(log: Log): Promise<void> {
  const supabase = await createClient();
  await supabase.from("logs").update(log).eq("id", log.id).throwOnError();
}
