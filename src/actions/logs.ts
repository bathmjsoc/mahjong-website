"use server";

import { createClient } from "@/lib/supabase/server";
import type { Log } from "@/lib/types";

export async function createLog(log: Log): Promise<void> {
  const supabase = await createClient();
  await supabase.from("logs").insert(log).throwOnError();
}

export async function updateLog(log: Log): Promise<void> {
  const supabase = await createClient();
  await supabase.from("logs").update(log).eq("id", log.id).throwOnError();
}
