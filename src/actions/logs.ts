"use server";

import { createClient } from "@/lib/supabase/server";
import type { Log, LogEntry, Session } from "@/lib/types";

export async function fetchLogs(sessions: Session[]): Promise<LogEntry[]> {
  const supabase = await createClient();

  if (sessions.length === 0) return [];

  const sessionIds = sessions.map((session) => session.id);
  const { data, error } = await supabase
    .from("log_entries")
    .select(`
      *,
      log_participants (
        log_id,
        player_id,
        role
      )
    `)
    .in("session_id", sessionIds)
    .eq("disabled", false)
    .order("timestamp", { ascending: false });

  if (error)
    throw new Error(`fetchLogs encountered an error: ${error.message}`);

  return (
    data?.map((entry) => ({
      ...entry,
      log_participants: entry.log_participants ?? [],
    })) ?? []
  );
}

export async function disableLog(log: Log) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("log_entries")
    .update({ disabled: true })
    .eq("id", log.id);

  if (error)
    throw new Error(`disableLog encountered an error: ${error.message}`);
}
