"use server";

import { createClient } from "@/lib/supabase/server";
import type { LogEntry, LogParticipant } from "@/lib/types";

export async function fetchLogEntries(
  tournamentId: string,
): Promise<LogEntry[]> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("log_entries")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("timestamp", { ascending: false });

  if (error)
    throw new Error(`fetchSessions encountered an error: ${error.message}`);
}

export async function fetchLogParticipants(
  tournamentId: string,
): Promise<LogParticipant[]> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("log_participants")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("timestamp", { ascending: false });

  if (error)
    throw new Error(`fetchSessions encountered an error: ${error.message}`);
}
