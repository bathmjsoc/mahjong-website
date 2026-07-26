"use server";

import { createClient } from "@/lib/supabase/server";
import type { Log, Tournament } from "@/types/app.types";

export async function createLog(log: Log): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("logs").insert(log);

  if (error)
    throw new Error(`createLog encountered an error: ${error.message}`);
}

export async function fetchLogs(tournament: Tournament): Promise<Log[]> {
  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .eq("tournament_id", tournament.id);

  if (error)
    throw new Error(`fetchLogs encountered an error: ${error.message}`);

  return logs ?? [];
}

export async function disableLog(log: Log): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("logs")
    .update({ disabled: true })
    .eq("id", log.id);

  if (error)
    throw new Error(`disableLog encountered an error: ${error.message}`);
}
